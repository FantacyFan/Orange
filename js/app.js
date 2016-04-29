(function(){
  var myApp = angular.module('myApp', []);

  myApp.controller('myCtrl', ['$scope',function($scope) {
  	$scope.threshold=50;
    // var width = window.innerWidth;
    // var height = window.innerHeight;
    var barMargin = {top: 20, right: 20, bottom: 70, left: 40},
        barWidth = document.getElementById("barChart").offsetWidth - barMargin.left - barMargin.right,
        barHeight = 300 - barMargin.top - barMargin.bottom;


    var x = d3.scale.ordinal().rangeRoundBands([0, barWidth], .05);

    var y = d3.scale.linear().range([barHeight, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);

    var svgBar = d3.select("#barChart").append("svg")
        .attr("width", barWidth + barMargin.left + barMargin.right)
        .attr("height", barHeight + barMargin.top + barMargin.bottom)
        .append("g")
        .attr("transform", 
              "translate(" + barMargin.left + "," + barMargin.top + ")");



    var width =document.getElementById("bubbles").offsetWidth;
    var height = 500;


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

    //init lots of array node to store VCs' name
    var getData,
        tempData = [],
        nodes = [],
        edges = [],
        numGetter = [],
        combinationGetter = [];


    var allCombinations = [];
    var roundFreqData = [];

    var vis = d3.select("#visualisation"),
        width = 1000,
        height = 500,
        margins = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 50
        };

    var filterCombinations = [];

    init();


    //load json data file
    function init(){
      d3.json("orange.json", function(error, data) {
      if(error){
        console.log(error);
      }else{
        // save the data load from json into getData
        getData = data;
        var year = [],
            count = [],
            domain = [];

        var frequency = {};  // array of frequency.
        var maxCount = 0;  // holds the max frequency.

        // draw bar chart
        getData.forEach(function(d){
          d.combinations.forEach(function(combination){
            allCombinations.push(combination);
          });
        });

        // for linechart
        allCombinations.forEach(function(d) {
          d.year = d.date.substring(0, 4);
          year.push(Number(d.year));
          domain.push(d.domain);
        });
       
        var counts = {};
        var domainCounts = {};

        for(var i = 0; i< year.length; i++) {
            var num = year[i];
            counts[num] = counts[num] ? counts[num]+1 : 1;
        }


        for(var i = 0; i< domain.length; i++) {
            var tempDomain = domain[i];
            if(tempDomain){
              domainCounts[tempDomain] = domainCounts[tempDomain] ? domainCounts[tempDomain]+1 : 1;
            }
        }
          for(var y in year) {
              frequency[year[y]]=(frequency[year[y]] || 0)+1; // increment frequency.
              if(frequency[year[y]] > maxCount) { // is this frequency > max so far ?
                      maxCount = frequency[year[y]];  // update max.
                      // result = year[y];          // update result.
              }
        }

        var domainLength = Object.keys(domainCounts).length;
        // console.log(domainLength);
        allCombinations.forEach(function(d) {
          d.count = counts[d.year];
          d.year = Number(d.year);
        });

        allCombinations.sort(function(a,b) {
          return d3.ascending(a.year, b.year);
        });        
        roundFreqData=getFreq(allCombinations);
        drawBar(roundFreqData);
        
        // draw force graph
        updateData();
        edges = createEdges(tempData.length);
        

        drawForce(edges,nodes);    




        // draw line chart
        drawLine(year,maxCount,domainLength)  ;   

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

    function updateData(){
      getData.forEach(function(d,i){
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
        });
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
              "rgba(211,211,211,0.1)"
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
                "rgba(198, 141, 141, 0.7)"
              )
              .on("mouseover", function(d) {
                d3.select(this).style("fill", "rgb(169, 99, 99)");
              }) 
              .on("mouseout", function(d) {
                d3.select(this).style("fill", "rgba(198, 141, 141, 0.7)");
              })
              .call(force.drag)
              .on("click", function(d){
                $scope.combinations = combinationGetter[d.index].combinations;
                $scope.$apply();
              });


      //add text to each node
      var svg_texts = svg.selectAll("text")
              .data(nodes)
              .enter()
              .append("text")
              .attr("class","vcName")
              .attr("font-size","0.5em")
              .style("fill", "rgb(128, 99, 99)")
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
  x.domain(data.map(function(d) { 
    return d.roundName;
  }));

  y.domain([0, d3.max(data, function(d) { 
    return d.frequency;
  })]);

  svgBar.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + barHeight + ")")
      .call(xAxis);

  svgBar.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("class","frequency")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");

  svgBar.selectAll(".bar")
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
  d3.selectAll(".bar").remove();
  d3.selectAll(".axis").remove();
  var newCombination = [];
  newCombination = allCombinations.filter(function(d){
    return d.domain ==="企业服务";
  });
  roundFreqData=getFreq(newCombination);
  draw(roundFreqData);
}

function drawLine(year,maxCount,domainLength){
      console.log(maxCount) ;
  var xScale = d3.scale.linear()
        .range([margins.left, width - margins.right])
        .domain(d3.extent(year)),

      yScale = d3.scale.linear()
        .range([height - margins.top, margins.bottom])
        .domain([0,(maxCount/domainLength)*1.5]),

      xAxis = d3.svg.axis()
        .scale(xScale),
  
      yAxis = d3.svg.axis()
          .scale(yScale)
          .orient("left");

      vis.append("svg:g")
          .attr("transform", "translate(0," + (height - margins.bottom) + ")")
          .style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'})
          .call(xAxis);

      vis.append("svg:g")
          .attr("transform", "translate(" + (margins.left) + ",0)")
          .style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'})
          .call(yAxis);

    //   allCombinations.forEach(function(d) {
    //   if (d.domain == id) {
    //     filterCombinations.push(d);
    //   }
    // });

      var lineGen = d3.svg.line()
          .x(function(d) {
            return xScale(d.year);
          })
          .y(function(d) {
            // console.log(d.count/domainLength);
            return yScale(d.count/domainLength);
          });

      vis.append('svg:path')
          .attr('d', lineGen(allCombinations))
          .attr('stroke', 'green')
          .attr('stroke-width', 1)
          .attr('fill', 'none');
}



  }]);
}());