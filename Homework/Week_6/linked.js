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

  var h = 600;

  var w = 1200;

  // var barPad = 5;

  var year = "2012";

  var chartPad = {
    top: 100,
    bottom: 100,
    left: 100,
    right: 700
  };

  // call on data, in which to plot the barchart itself
  d3.json("cleansed_happiness.json").then(function(dataset){

    // drawMap(dataset, chartPad);

    // clicked_dataset will be what country will be selected. > linked view

    drawBar(clicked_dataset, chartPad);




  };








});

function drawScatter(data, chartPad){

  // create the svg field
  var svg = d3.select("body")
            .append("svg")
              .attr("width", w)
              .attr("height", h);


  // create x, y scaling for placing data in svg pixels
  var xScale = getXscale(data_limit, chartPad);

  var yScale = getYscale(data_limit, chartPad);


  // define x and y axis
  var xAxis = d3.axisBottom(xScale);

  var yAxis = d3.axisLeft(yScale);


  // define interaction tooltip
  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d) {
                console.log(d);
                return "HPI Rank of " + d["Country"] + ": " + d["HPI Rank"];
              });

  // make interactive animation work
  svg.call(tip);

  // draw the circles
  svg.selectAll("circle")
     .data(dataset)
     .enter()
   .append("circle")
     .attr("class", "cir")
     .attr("cx", function(d) {
         return xScale(d["Inequality-adjusted Life Expectancy"]);

     })
     .attr("cy", function(d) {
         return yScale(d["HPI Rank"]);

     })
     // .attr("r", 5)
     // .attr("fill", function(d) {
     //     return color(d["Inequality of Outcomes"]);
     // })
     .on('mouseover', tip.show) // for animation
     .on('mouseout', tip.hide);


}


function getXscale(data_limit, chartPad) {
  var xScale = d3.scaleLinear()
                 .domain([0, data_limit])
                 .range([chartPad.left, w - chartPad.right]);

  return xScale;

};


function getYscale(data_limit, chartPad) {
  var yScale = d3.scaleLinear()
                 .domain([0, data_limit])
                 .range([h - chartPad.bottom, chartPad.top]);

  return yScale;

};
