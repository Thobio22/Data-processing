// !/usr/bin/env python
// Name: Thomas Verouden
// Student number: 10779272
//
// This file visualises the HPI
//
// source: source: http://happyplanetindex.org/resources ==> data
// grouped barchart instructions: https://medium.com/@vaibhavkumar_19430/how-to-create-a-grouped-bar-chart-in-d3-js-232c54f85894
// python -m http.server 8888 &
// http://localhost:8888/linked.html






window.onload = function() {

  // var barPad = 5;

  // call on data, in which to plot the barchart itself
  d3v5.json("happiness.json").then(function(dataset){

    var chartPad = {
      h: 600,
      w: 500,
      top: 100,
      bottom: 100,
      left: 100,
      right: 700,
      betweenBar: 10
    };




    // clicked_dataset will be what country will be selected. > linked view
    var clickedDataset = [dataset[0]];

    // draw map
    var linkedMap = new Datamap({
                  element: document.getElementById('map_place'),
                    fills: {
                      defaultFill: 'grey'
                    },
                    data: 


                  });


    var clickedDataset = [dataset[0]];
    // // scatter dataset
    // var regionData = {
    //   "Americas": [],
    //   "Asia Pacific": [],
    //   "Europe": [],
    //   "Middle East and North Africa": [],
    //   "Post-communist": [],
    //   "Sub Saharan Africa": []
    // };
    //
    // // // add region data to regionData
    // // regionData = addData(regionData, dataset)






    // draw grouped barchart based on given dataset
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



function drawBar(dataset, chartPad, limit) {

  // create the svg field
  var svg = d3v5.select("body")
            .append("svg")
              .attr("width", chartPad.w)
              .attr("height", chartPad.h);


  var ageLimit = 100;


  // create x, y scaling for placing data in svg pixels
  var xScale = getXscale(ageLimit, chartPad, dataset);

  // var xScale2 = getXscale2(xScale);

  var yScale = getYscale(ageLimit, chartPad);


  // define x and y axis
  var xAxis = d3v5.axisBottom(xScale);

  var yAxis = d3v5.axisLeft(yScale);


  // // define interaction tooltip
  // var avBarTip = d3v5.tip()
  //                    .attr('class', 'd3-tip')
  //                    .offset([-10, 0])
  //                    .html(function(d) {
  //                      return d["Country"] + " HPI Rank: " + d["HPI Rank"] + "<br>"
  //                             + "Average Life Expectancy: " + d["Average_Life_Expectancy"];
  //
  //                    });
  //
  //
  // var adjBarTip = d3v5.tip()
  //                     .attr('class', 'd3-tip')
  //                     .offset([-10, 0])
  //                     .html(function(d) {
  //                       return d["Country"] + " HPI Rank: " + d["HPI Rank"] + "<br>"
  //
  //
  //                     });

  var tip = d3v5.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                  return d[0]["Country"] + " HPI Rank: " + d[0]["HPI_Rank"] + "<br>"
                         + "Average Life Expectancy: " + Math.round(+d[0]["Average_Life_Expectancy"], 4)
                         + "<br>" + "Inequality-adjusted Life Expectancy: "
                         + Math.round(+d[0]["Inequality-adjusted_Life_Expectancy"], 4);
                })
                .attr("stroke", "black");;


  // // make interactive animation work
  // svg.call(avBarTip);
  //
  // svg.call(adjBarTip);

  svg.call(tip);


  // create the bars
  var rect = svg.selectAll("rect")
                .data([dataset, dataset])
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", function(d, i) {

                  let string = i === 0 ? "Average_Life_Expectancy" : "Inequality-adjusted_Life_Expectancy";

                  return xScale(string);

                 })
                .attr("y", function(d, i) {

                  let string = i === 0 ? "Average_Life_Expectancy" : "Inequality-adjusted_Life_Expectancy";

                  return yScale(d[0][string]); // can use + for converting string to int

                 })
                .attr("width", xScale.bandwidth())
                .attr("height", function(d, i) {
                  let string = i === 0 ? "Average_Life_Expectancy" : "Inequality-adjusted_Life_Expectancy";

                  return  (chartPad.h - yScale(+d[0][string]) - chartPad.top);

                 })
                .attr("fill", function(d, i) {

                  let string = i === 0 ? "Average_Life_Expectancy" : "Inequality-adjusted_Life_Expectancy";
                  if (string == "Average_Life_Expectancy") {
                    return "red"
                  }
                  else {
                    return "yellow"
                  };

                })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);


  // create x axis by calling on xAxis
  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(0," + (chartPad.h - chartPad.top) + ")")
     .call(xAxis);


  // create yAxis by calling on yAxis
  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(" + chartPad.top + ",0)")
     .call(yAxis);


  // create chart Title
  svg.append("text")
     .attr("transform", "translate(100,0)")
     .attr("x", 50)
     .attr("y", 50)
     .attr("font-size", "24px")
     .text("Life expectancy");


  country = dataset[0].Country;


  // create x-axis label
  svg.append("text")
     .attr("class", "x label")
     .attr("text-anchor", "end")
     .attr("x", chartPad.w / 2)
     .attr("y", chartPad.h - 50)
     .text(country);


  // create y-axis label
  svg.append("text")
     .attr("class", "y label")
     .attr("text-anchor", "end")
     .attr("y", 50)
     .attr("x", -150)
     .attr("dy", "1em")
     .attr("transform", "rotate(-90)")
     .text("Age (in years)");









  //
  // // draw the grouped bars
  // var groupBar = svg.selectAll("groupBar")
  //                     .data(dataset)
  //                     .enter()
  //                   .append("groupBar")
  //                     .attr("class", "chart")
  //                     .attr("transform", function(d) {
  //                       return 'translate(${xScale(d.Country)}, 0)'
  //                     });
  //
  //
  // // add bars to groupchart
  // groupBar.selectAll("avLifeExp")
  //         .data(function(d) {
  //           return d;
  //         })
  //         .enter()
  //       .append("avLifeExp")
  //         .attr("class", "avLifeExp")
  //         .style("fill", "#f9eb25")
  //         .attr("x", function(d) {
  //           return "Average_Life_Expectancy"
  //         })
  //         .attr("y", function(d) {
  //           return yScale(d["Average_Life_Expectancy"])
  //         })
  //         .attr("width", xScale2.bandwidth())
  //         .attr("height", function(d) {
  //           return (chartPad.h - yScale(+d["Average_Life_Expectancy"]) - chartPad.top)
  //         })
  //         .on('mouseover', avBarTip.show) // for animation
  //         .on('mouseout', avBarTip.hide);
  //
  //
  //
  // groupbar.selectAll("adjLifeExp")
  //         .data(function(d) {
  //           console.log(d)
  //           return [d];
  //         })
  //         .enter()
  //       .append("adjLifeExp")
  //         .attr("class", "adjLifeExp")
  //         .style("fill", "#f91109")
  //         .attr("x", function(d) {
  //           return "Inequality-adjusted_Life_Expectancy"
  //         })
  //         .attr("y", function(d) {
  //           return yScale(d["Inequality-adjusted_Life_Expectancy"])
  //         })
  //         .attr("width", xScale2.bandwidth())
  //         .attr("height", function(d) {
  //           return (chartPad.h - yScale(+d["Inequality-adjusted_Life_Expectancy"]) - chartPad.top)
  //         })
  //         .on('mouseover', adjBarTip.show) // for animation
  //         .on('mouseout', adjBarTip.hide);
  //
  //               // .attr("x", function(d) {
                //    return xScale(d["HPI Rank"]);
                //
                // })
                // .attr("y", function(d) {
                //    return yScale(d["Inequality-adjusted_Life_Expectancy"]);
                //
                // })
                // .attr("width", chartPad.w / dataset.length - 5)
                // .attr("height", function(d) {
                //    return  (chartPad.h - yScale(+d["Inequality-adjusted_Life_Expectancy"]) - chartPad.top);
                //  })
                // // .attr("r", 5)
                // // .attr("fill", function(d) {
                // //     return color(d["Inequality of Outcomes"]);
                // // })



};


function getXscale(limit, chartPad, dataset) {

  var xScale = d3v5.scaleLinear()
                   .domain([0, 1])
                   .range([0, chartPad.w - chartPad.left - 10]);

  xScale = d3v5.scaleBand()
              .domain(["Average_Life_Expectancy", "Inequality-adjusted_Life_Expectancy"])
              .range([100, 400]);

  return xScale;

};


function getYscale(limit, chartPad) {

  var yScale = d3v5.scaleLinear()
                 .domain([0, limit])
                 .range([chartPad.h - chartPad.bottom, chartPad.top]);

  return yScale;

};
