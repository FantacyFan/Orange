(function(){
  var myApp = angular.module('myApp', []);

  myApp.controller('myCtrl', ['$scope',function($scope) {
  	$scope.threshold=80;
    $scope.selectOption =[];
    $scope.selectDomain="all";
    $scope.getData =[];
    $scope.barData =[];

    // var width =document.getElementById("bubbles").offsetWidth;
    var width=700;
    var height = 400;


    var svg = d3.select("#bubbles")
          .append("svg")
          .attr("width",width)
          .attr("height",height);

    // set force  
    var force = d3.layout.force()
                  .linkStrength(0.1)
                  .friction(0.9)
                  .linkDistance(120)
                  .charge(-150)
                  .gravity(0.05)
                  .theta(0.2)
                  .alpha(0.8)
                  .size([width, height]);

    var vis = d3.select("#lineVisu"),
        chartWidth = 1000,
        chartHeight = 400;
    // var bar = d3.select("#barVisu");
   
    var margin = {top: 20, right: 20, bottom: 20, left: 50},
        barWidth = chartWidth - margin.left - margin.right,
        barHeight = chartHeight - margin.top - margin.bottom;
        
    //init lots of array node to store VCs' name
    var tempData = [],
        nodes = [],
        edges = [],
        numGetter = [],
        combinationGetter = [];
    var domains;

    var allCombinations = [];
    var roundFreqData = [];

    var filterCombinations = [];

    init();


    //load json data file
    function init(){
      d3.json("orange.json", function(error, data) {
      if(error){
        console.log(error);
      }else{
        // save the data load from json into $scope.getData
        $scope.getData = data.filter(function(d){
          return d.number!="0";
        });


        // draw bar chart
        $scope.getData.forEach(function(d){
          d.combinations.forEach(function(combination){
            combination.year = combination.date.substring(0,4);
            allCombinations.push(combination);
          });
        });


        $scope.combinations = allCombinations;

        var filterDomain = d3.nest().key(function(d){
          return d.domain;
        }).key(function(d){
          return d.year;
        }).entries(allCombinations);

        var filterYear = d3.nest().key(function(d){
          return d.year;
        }).entries(allCombinations);

        filterDomain.forEach(function(d){
          var tempObj ={
            "name":d.key
          }
          $scope.selectOption.push(tempObj);
        })


        roundFreqData=getFreq(allCombinations);
        drawBar(roundFreqData);
        
        // draw force graph
        updateData();
        edges = createEdges(tempData.length);
        drawForce(edges,nodes);    

        // draw line chart
        drawLine(filterYear,filterDomain)  ;   

      }
      
    });
    }

    // update, triggered by input
    $scope.update =function(){
      // clear the screen and data arraies
      d3.selectAll(".link").remove();
      d3.selectAll(".vcName").remove();
      d3.selectAll(".nodeCircle").remove();
      tempData = [],
          nodes = [],
          edges = [],
          numGetter = [];

        updateData();  
        edges = createEdges(tempData.length);
        
        drawForce(edges,nodes);         
            
    }

    $scope.updateCombination = function(){
      updateBar();
      d3.selectAll(".frequencyLine").attr("stroke","rgba(0,0,0,0.4")
      d3.select("#"+$scope.selectDomain).attr("stroke","red");
    }  

    function updateData(){
      $scope.getData.forEach(function(d,i){
          //only consider VCs whose invest times larger than threshold
          var combinations = d.combinations;
          var num = combinations.length;
          if(num > $scope.threshold){
            var tempObj ={
              "name":d.name,
              "combinations":d.combinations,
              "number":d.number
            }
            tempData.push(tempObj);
          }
        });
        var tempCom = [];
        tempData.forEach(function(d){
          var tempObj ={
            "name":d.name
          }
          nodes.push(tempObj);
          var tempObj2 ={
            "number":d.number
          }
          numGetter.push(tempObj2);
          var tempObj3 = {
            "combinations": d.combinations
          }
          combinationGetter.push(tempObj3);
          d.combinations.forEach(function(com){
            tempCom.push(com);
          })
        });
        $scope.combinations= tempCom;

        // $scope.$apply();
    }

    function drawForce(edges,nodes){
      force
          .nodes(nodes)
          .links(edges)
          .start();                    

      var link = svg.selectAll(".link")
            .data(edges)
            .enter().append("line")
            .attr("class", "link")
            .style("stroke",
              // "rgba(218,212,162,0.1)"
              "rgba(231,231,231,0.1)"
            )
            .style("stroke-width", function(d) { 
              return Math.sqrt(d.value);
            });

      var svg_nodes = svg.selectAll("circle")
              .data(nodes)
              .enter()
              .append("circle")
              .attr("class","nodeCircle")
              .attr("r",function(d){
                return  Math.sqrt(numGetter[d.index].number);
              })
              .style("fill",
                "rgba(174, 202, 237, 0.5)"
              )
              .on("mouseover", function(d) {
                d3.select(this).style("fill", "rgba(64, 101, 148, 0.9)");
              }) 
              .on("mouseout", function(d) {
                d3.select(this).style("fill", "rgba(174, 202, 237, 0.5)");
              })
              .call(force.drag)
              .on("click", function(d){
                $scope.combinations = combinationGetter[d.index].combinations;
                $scope.$apply();
               // not finshed yet
                filterVC();
                roundFreqData = getFreq($scope.combinations);
                drawBar(roundFreqData);
              });


      //add text to each node
      var svg_texts = svg.selectAll("text")
              .data(nodes)
              .enter()
              .append("text")
              .attr("class","vcName")
              .attr("font-size","0.5em")
              .style("fill", "rgba(183, 217, 255, 0.6)")
              .attr("dx", 20)
              .attr("dy", 8)
              .text(function(d){
                return d.name;
              });        

      forceOn(link,svg_nodes,svg_texts);   
    }

    function forceOn(link,svg_nodes,svg_texts){
      force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        svg_nodes.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        svg_texts.attr("x",function(d){
                    return d.x;
                  })
                  .attr("y",function(d){
                    return d.y;
                  })
      });  
    }

    function createEdges(_length){
      var tempLength = _length;
          for(var i = 0 ;i<tempLength;i++){
            var data = tempData[i],
                combination = data.combinations;
            var leng1 = combination.length;

                for(var j =i+1 ; j<tempLength;j++){
                    var value = 1;
                    var data2 = tempData[j],
                        combination2 = data2.combinations;
                    var leng2 =combination2.length;

                        for(var k=0;k<leng1;k++){
                          var tempTitle = combination[k].title;
                          for(var l=0 ; l<leng2;l++){
                            var tempTitle2 = combination2[l].title;
                            if(tempTitle ==tempTitle2){
                              value++;
                            }
                          }
                        }
                    if(value==1){
                      continue;
                    }else{
                        var tempObj = {
                        "source":i,
                        "target":j,
                        "value": value
                      }

                      edges.push(tempObj);
                    }
                    
                }
          }
      return edges;
    }

function drawBar(data){
    var bar = d3.select("#barVisu").append("g")
        .attr("width", barWidth + margin.left + margin.right)
        .attr("height", barHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");
    var x = d3.scale.ordinal().rangeRoundBands([0, barWidth], .05);
    var y = d3.scale.linear().range([barHeight, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);
 
  x.domain(data.map(function(d) { 
    return d.roundName;
  }));

  y.domain([0, d3.max(data, function(d) { 
    return d.frequency;
  })]);

  bar.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + barHeight + ")")
      .call(xAxis);

  bar.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("class","frequency")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");

  bar.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { 
        return x(d.roundName); 
      })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { 
        return y(d.frequency); 
      })
      .attr("height", function(d) { return barHeight - y(d.frequency); });

}

function getFreq(data){
  var result=[];

  var category = {
    "种子轮": 0,
    "天使轮":0,
    "Pre-A轮":0,
    "A轮":0,
    "A+轮":0,
    "Pre-B轮":0,
    "B轮":0,
    "B+轮":0,
    "C轮":0,
    "D轮":0,
    "E轮":0,
    "F轮-上市前":0,
    "IPO上市":0,
    "IPO上市后":0,
    "新三板":0,
    "战略投资":0,
    "不明确":0,
    "并购":0
  };

  for(var i=0; i<data.length; i++){
    if(data[i].round.indexOf("并购") > -1){
      data[i].round="并购";
    }
    category[data[i].round]++;
  }

  for(key in category){
    var tempObj={
      "roundName":key,
      "frequency":category[key]
    }
    result.push(tempObj);
  }
  return result;
}

function updateBar(){
  document.getElementById("barVisu").innerHTML="";
  d3.selectAll(".bar").remove();
  d3.selectAll(".axis").remove();
  var newCombination = [];
  newCombination = $scope.combinations.filter(function(d){
    return d.domain ===$scope.selectDomain;
  });
  roundFreqData=getFreq(newCombination);
  drawBar(roundFreqData);
}

function drawLine(filterYear,filterDomain){
 
  var currentYear=[];
  var year = [],
      count = [];
  filterYear.forEach(function(d){
      var tempObj ={
        "year":Number(d.key),
        "count":d.values.length
      }
      // for base line
      currentYear.push(tempObj);
      // for x, y axis
      year.push(Number(d.key));
      count.push(d.values.length)
  });

  var domainLength = filterDomain.length;
  var xScale = d3.scale.linear()
        .range([margin.left, chartWidth - margin.right])
        .domain(d3.extent(year)),

      yScale = d3.scale.pow().exponent(.2)
        .range([chartHeight - margin.top, margin.bottom])
        .domain([0,(d3.extent(count)[1]/domainLength)*3]),

      xAxis = d3.svg.axis()
        .scale(xScale),
  
      yAxis = d3.svg.axis()
          .scale(yScale)
          .orient("left");

      vis.append("svg:g")
          .attr("transform", "translate(0," + (chartHeight - margin.bottom) + ")")
          .style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'})
          .call(xAxis);

      vis.append("svg:g")
          .attr("transform", "translate(" + (margin.left) + ",0)")
          .style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'})
          .call(yAxis);

     var lineGen = d3.svg.line()
          .interpolate("basis")
          .x(function(d) {
            return xScale(d.year);
          })
          .y(function(d) {
            return yScale(d.count/filterDomain.length);
          });
      
      // draw base line, average of all domains.
      vis.append('svg:path')
          .attr("class","all")
          .attr('d', lineGen(currentYear))
          .attr('stroke', 'green')
          .attr('stroke-width', 2)
          .attr('fill', 'none');


     // draw lines for all domains
      filterDomain.forEach(function(d){
        var currentDomain = [];
        d.values.forEach(function(d){
          var tempObj ={
            "year":d.key,
            "count":d.values.length*domainLength
          }
          currentDomain.push(tempObj);
        })

        vis.append('svg:path')
            .attr("id",function(){
                return d.key;
            })
            .attr("class","frequencyLine")
            .attr('d',lineGen(currentDomain))
            .attr('stroke', 'rgba(0,0,0,0.1)')
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .on("mouseover",function(){
              d3.select(this).attr("stroke","red");
            })
            .on("mouseout", function(){
              d3.select(this).attr('stroke', 'rgba(0,0,0,0.1)');
            });
      })    
}


function filterVC(){
  document.getElementById('lineVisu').innerHTML ="";
  document.getElementById('barVisu').innerHTML ="";
  filterDomain = d3.nest().key(function(d){
                    return d.domain;
                  }).key(function(d){
                    return d.year;
                  }).entries( $scope.combinations);

  filterYear = d3.nest().key(function(d){
          return d.year;
        }).entries( $scope.combinations);

  drawLine(filterYear,filterDomain);
}

  }]);
}());