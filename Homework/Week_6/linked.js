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

  var chartPad = {
    h: 600,
    w: 1200,
    top: 100,
    bottom: 100,
    left: 100,
    right: 700
  };

  // call on data, in which to plot the barchart itself
  d3.json("cleansed_happiness.json").then(function(dataset){

    // drawMap(dataset, chartPad);

    // clicked_dataset will be what country will be selected. > linked view
    var clicked_dataset = dataset;

    drawBar(clicked_dataset, chartPad);




  })








};

function drawBar(data, chartPad){

  // create the svg field
  var svg = d3.select("body")
            .append("svg")
              .attr("width", chartPad.w)
              .attr("height", chartPad.h);


  // data limit == last/highest data point
  var dataLimitX = 200;

  var dataLimitY =


  // create x, y scaling for placing data in svg pixels
  var xScale = getXscale(dataLimitX, chartPad);

  var yScale = getYscale(dataLimitY, chartPad);


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
