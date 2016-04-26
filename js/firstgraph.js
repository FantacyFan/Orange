(function(){
//   var threshold = document.getElementById("threshold").value;
//   // var width = window.innerWidth;
//   // var height = window.innerHeight;

//   var width = 800;
//   var height = 600;


//   var svg = d3.select(".bubbles")
//         .append("svg")
//         .attr("width",width)
//         .attr("height",height);
  
//   // set force  
//   var force = d3.layout.force()
//                 .linkStrength(0.1)
//                 .friction(0.9)
//                 .linkDistance(120)
//                 .charge(-100)
//                 .gravity(0.1)
//                 .theta(0.8)
//                 .alpha(0.1)
//                 .size([width, height]);

//   //init lots of array node to store VCs' name
//   var getData,
//       tempData = new Array(),
//       nodes = new Array(),
//       edges = new Array(),
//       numGetter = [];
//       combinationGetter = [];
//       init();

//   //load json data file
// function init(){
//     d3.json("orange.json", function(error, data) {
//     //error checking
//     if(error){
//       console.log(error);
//     }
//     // save the data load from json into getData
//     getData = data;
//     getData.forEach(function(d,i){
//       //only consider VCs whose invest times larger than threshold
//       var combinations = d.combinations;
//       var num = combinations.length;
//       if(num > threshold){
//         var tempObj ={
//           "name":d.name,
//           "combinations":d.combinations,
//           "number":d.number
//         }
//         tempData.push(tempObj);
//       }
//     });

//     tempData.forEach(function(d){
//       var tempObj ={
//         "name":d.name
//       }
//       nodes.push(tempObj);
//       var tempObj2 ={
//         "number":d.number
//       }
//       numGetter.push(tempObj2);
//       var tempObj3 = {
//         "combinations": d.combinations
//       }
//       combinationGetter.push(tempObj3);
//     });
//     // console.log(combinationGetter);

//     var tempLength = tempData.length;

//     edges = createEdges(tempLength);
    
//     var color = d3.scale.category20();

//     force
//         .nodes(nodes)
//         .links(edges)
//         .start(); 


//     //add nodes   
//     var link = svg.selectAll(".link")
//           .data(edges)
//           .enter().append("line")
//           .attr("class", "link")
//           .style("stroke",
//             // "rgba(218,212,162,0.1)"
//             "rgba(211,211,211,0.1)"
//           )
//           .style("stroke-width", function(d) { 
//             return Math.sqrt(d.value);
//           });



//     var svg_nodes = svg.selectAll("circle")
//             .attr("class","nodeCircle")
//             .data(nodes)
//             .enter()
//             .append("circle")
//             .attr("r",function(d){
//               return  Math.sqrt(numGetter[d.index].number);
//             })
//             .style("fill",
//               // function(d,i){
//               // return color(i);}
//               "rgba(198, 141, 141, 0.7)"
//             )
//             .on("mouseover", function(d) {
//               d3.select(this).style("fill", "rgb(169, 99, 99)");
//             }) 
//             .on("mouseout", function(d) {
//               d3.select(this).style("fill", "rgba(198, 141, 141, 0.7)");
//             })
//             .call(force.drag)
//             .on("click", function(d){
//               var combinationsLenght = combinationGetter[d.index].combinations.length;

//               var tempComb = '';
//               var node = combinationGetter[d.index];

//               console.log(combinationGetter[d.index]);
//               for(var i=0; i<combinationsLenght; i++){
//                   tempComb += node.combinations[i].title + ',' + node.combinations[i].date + ',' + node.combinations[i].round + ',' + node.combinations[i].domain + ',' 
//                     + node.combinations[i].amount + '\n';
//               }

              
//               d3.select(".firms").text(tempComb)
//               // console.log(combinationsLenght);
//             });
  

//     //add text to each node
//     var svg_texts = svg.selectAll("text")
//             .attr("class","vcName")
//             .data(nodes)
//             .enter()
//             .append("text")
//             .attr("font-size","0.5em")
//             .style("fill", "rgb(128, 99, 99)")
//             .attr("dx", 20)
//             .attr("dy", 8)
//             // .text("New paragraph!");
//             .text(function(d){
//               return d.name;
//             });        

//     force.on("tick", function() {
//       link.attr("x1", function(d) { return d.source.x; })
//           .attr("y1", function(d) { return d.source.y; })
//           .attr("x2", function(d) { return d.target.x; })
//           .attr("y2", function(d) { return d.target.y; });

//       svg_nodes.attr("cx", function(d) { return d.x; })
//           .attr("cy", function(d) { return d.y; });

//       svg_texts.attr("x",function(d){
//                   return d.x;
//                 })
//                 .attr("y",function(d){
//                   return d.y;
//                 })
//     });  






//     // draw line chart
    

//     // Set the dimensions of the canvas / graph
   


//   });
// }

// // update, triggered by input
// function update(){
//   // clear the screen and data arraies
//   d3.selectAll("line").remove();
//   d3.selectAll("text").remove();
//   d3.selectAll("circle").remove();
//   tempData = [],
//       nodes = [],
//       edges = [],
//       numGetter = [];
 
//   // get threshold
//   threshold = document.getElementById("threshold").value;
//   // console.log(threshold);

//   // update nodes, edges and numGetter
//     getData.forEach(function(d,i){
//       //only consider VCs whose invest times larger than 3
//       var combinations = d.combinations;
//       var num = combinations.length;
//       if(num > threshold){
//         var tempObj ={
//           "name":d.name,
//           "combinations":d.combinations,
//           "number":d.number
//         }
//         tempData.push(tempObj);
//       }
//     });

//     tempData.forEach(function(d){
//       var tempObj ={
//         "name":d.name
//       }
//       nodes.push(tempObj);
//       var tempObj2 ={
//         "number":d.number
//       }
//       numGetter.push(tempObj2);
//     });

//     var tempLength = tempData.length;
//     edges = createEdges(tempLength);
    
//     var color = d3.scale.category20();

//     force
//         .nodes(nodes)
//         .links(edges)
//         .start();                    
//     //add nodes   
//     var link = svg.selectAll(".link")
//           .data(edges)
//           .enter().append("line")
//           .attr("class", "link")
//           .style("stroke",
//             // "rgba(218,212,162,0.1)"
//             "rgba(211,211,211,0.1)"
//           )
//           .style("stroke-width", function(d) { 
//             return Math.sqrt(d.value);
//           });

//     var svg_nodes = svg.selectAll("circle")
//             .data(nodes)
//             .enter()
//             .append("circle")
//             .attr("class","nodeCircle")
//             .attr("r",function(d){
//               return  Math.sqrt(numGetter[d.index].number);
//             })
//             .style("fill",
//               // function(d,i){
//               // return color(i);
//               // }
//               "rgba(198, 141, 141, 0.7)"
//             )
//             .on("mouseover", function(d) {
//               d3.select(this).style("fill", "rgb(169, 99, 99)");
//             }) 
//             .on("mouseout", function(d) {
//               d3.select(this).style("fill", "rgba(198, 141, 141, 0.7)");
//             })
//             .call(force.drag);
  

//     //add text to each node
//     var svg_texts = svg.selectAll("text")
//             .data(nodes)
//             .enter()
//             .append("text")
//             .attr("class","vcName")
//             .attr("font-size","0.5em")
//             .style("fill", "rgb(128, 99, 99)")
//             .attr("dx", 20)
//             .attr("dy", 8)
//             // .text("New paragraph!");
//             .text(function(d){
//               return d.name;
//             });        

//     force.on("tick", function() {
//       link.attr("x1", function(d) { return d.source.x; })
//           .attr("y1", function(d) { return d.source.y; })
//           .attr("x2", function(d) { return d.target.x; })
//           .attr("y2", function(d) { return d.target.y; });

//       svg_nodes.attr("cx", function(d) { return d.x; })
//           .attr("cy", function(d) { return d.y; });

//       svg_texts.attr("x",function(d){
//                   return d.x;
//                 })
//                 .attr("y",function(d){
//                   return d.y;
//                 })
//     });        

// }  

// function createEdges(_length){
//     var tempLength = _length;
//         for(var i = 0 ;i<tempLength;i++){
//           var data = tempData[i],
//               combination = data.combinations;
//           var leng1 = combination.length;

//               for(var j =i+1 ; j<tempLength;j++){
//                   var value = 1;
//                   var data2 = tempData[j],
//                       combination2 = data2.combinations;
//                   var leng2 =combination2.length;

//                       for(var k=0;k<leng1;k++){
//                         var tempTitle = combination[k].title;
//                         for(var l=0 ; l<leng2;l++){
//                           var tempTitle2 = combination2[l].title;
//                           if(tempTitle ==tempTitle2){
//                             value++;
//                           }
//                         }
//                       }
//                   if(value==1){
//                     continue;
//                   }else{
//                       var tempObj = {
//                       "source":i,
//                       "target":j,
//                       "value": value
//                     }

//                     edges.push(tempObj);
//                   }
                  
//               }
//         }
//     return edges;
// }

//  for responsive, not working right now!

// window.addEventListener('resize',function(){
//   d3.select("svg").remove();
//   width = window.innerWidth;
//   height = window.innerHeight;

//   var svg = d3.select("body")
//         .append("svg")
//         .attr("width",width)
//         .attr("height",height);
//   console.log(svg);
//   var force = d3.layout.force()
//                 .linkStrength(0.1)
//                 .friction(0.9)
//                 .linkDistance(150)
//                 .charge(-200)
//                 .gravity(0.1)
//                 .theta(0.8)
//                 .alpha(0.1)
//                 .size([width, height]);      
//   update();
// })
}());