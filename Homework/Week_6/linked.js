// !/usr/bin/env python
// Name: Thomas Verouden
// Student number: 10779272
//
// This file visualises the HPI
//
// source: source: http://happyplanetindex.org/resources ==> data
// python -m http.server 8888 &
// http://localhost:8888/linked.html






window.onload = function() {

  // var barPad = 5;

  // call on data, in which to plot the barchart itself
  d3v5.json("happiness.json").then(function(dataset){

    var chartPad = {
      h: 2000,
      w: 1200,
      top: 100,
      bottom: 100,
      left: 100,
      right: 700
    };


    var limit = {
      xFoot:4,
      yFoot:4,
    };


    // draw map
    var linkedMap = new Datamap({element: document.getElementById('container')});


    // scatter dataset
    var regionData = {
      "Americas": [],
      "Asia Pacific": [],
      "Europe": [],
      "Middle East and North Africa": [],
      "Post-communist": [],
      "Sub Saharan Africa": []
    };

    // // add region data to regionData
    // regionData = addData(regionData, dataset)



    // clicked_dataset will be what country will be selected. > linked view
    var clickedDataset = dataset;



    drawBar(clickedDataset, chartPad);




  })








};


// function addData(regionData, dataset) {
//   for (i in dataset) {
//     for (j in dataset[i]) {
//       let region = dataset[i][j]["Region"];
//
//       if (region in dataset) {
//         dataset[region].push({
//           "Country": dataset[i][j].Country,
//           "Region": dataset[i][j].Region,
//           "HPI Rank": dataset[i][j].HPI Rank,
//           "Average Life Expectancy": dataset[i][j].,
//           "Footprint (gha\/capita)": dataset[i][j].,
//           "Inequality of Outcomes": dataset[i][j].,
//           "Inequality-adjusted Life Expectancy": dataset[i][j].,
//           "Population": HPI Rank
//         })
//       };
//     };
//   };
// };



function drawBar(data, chartPad, limit){

  // create the svg field
  var svg = d3v5.select("body")
            .append("svg")
              .attr("width", chartPad.w)
              .attr("height", chartPad.h / 2);


  // create x, y scaling for placing data in svg pixels
  var xScale = getXscale(limit.x, chartPad);

  var yScale = getYscale(limit.y, chartPad);


  // define x and y axis
  var xAxis = d3v5.axisBottom(xScale);

  var yAxis = d3v5.axisLeft(yScale);


  // define interaction tooltip
  var tip = d3v5.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d) {
                console.log(d);
                return "HPI Rank of " + d["Country"] + ": " + d["HPI Rank"];
              });

  // make interactive animation work
  svg.call(tip);

  // draw the circles
  var rect = svg.selectAll("rect")
                .data(dataset)
                .enter()
              .append("rect")
                .attr("class", "bar")
                .attr("x", function(d) {
                   return xScale(d["HPI Rank"]);

                })
                .attr("y", function(d) {
                   return yScale(d["Inequality-adjusted Life Expectancy"]);

                })
                .attr("width", chartPad.w / dataset.length - 5)
                .attr("height", function(d) {
                   return  (chartPad.h - yScale(+d["Inequality-adjusted Life Expectancy"]) - chartPad.top);
                 })
                // .attr("r", 5)
                // .attr("fill", function(d) {
                //     return color(d["Inequality of Outcomes"]);
                // })
               .on('mouseover', tip.show) // for animation
               .on('mouseout', tip.hide);


};


function getXscale(limit, chartPad) {
  var xScale = d3v5.scaleLinear()
                 .domain([0, limit])
                 .range([chartPad.left, w - chartPad.right]);

  return xScale;

};


function getYscale(limit, chartPad) {
  var yScale = d3v5.scaleLinear()
                 .domain([0, limit])
                 .range([h - chartPad.bottom, chartPad.top]);

  return yScale;

};
