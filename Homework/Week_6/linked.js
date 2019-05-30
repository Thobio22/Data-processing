// !/usr/bin/env python
// Name: Thomas Verouden
// Student number: 10779272
//
// This file visualises the HPI
//
// source: source: http://happyplanetindex.org/resources ==> data
// datamap structure: https://github.com/markmarkoh/datamaps/blob/master/README.md#getting-started
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
      betweenBar: 10,
      xScaleRangeL: 100,
      xScaleRangeR: 400
    };




    // clicked_dataset will be what country will be selected. > linked view
    var mapDataset = getMapDataset(dataset);

    drawMap(mapDataset, dataset, chartPad)

    // draw grouped barchart based on given dataset
    drawBar(dataset, chartPad);




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

function getMapDataset(dataset) {

  // list of all ISO of the used countries
  mapISO = ["AFG", "ALB", "DZA", "ARG", "ARM", "AUS", "AUT", "BGD", "BLR", "BEL",
             "BLZ", "BEN", "BTN", "BOL", "BIH", "BWA", "BRA", "BGR", "BFA", "BDI",
             "KHM", "CMR", "CAN", "TCD", "CHL", "CHN", "COL", "COM", "CRI", "CIV",
             "HRV", "CYP", "CZE", "DNK", "DJI", "DOM", "ECU", "EGY", "SLV", "EST",
             "ETH", "FIN", "FRA", "GAB", "GEO", "DEU", "GHA", "GRC", "GTM", "GIN",
             "HTI", "HND", "HKG", "HUN", "ISL", "IND", "IDN", "IRN", "IRQ", "IRL",
             "ISR", "ITA", "JAM", "JPN", "KAZ", "KEN", "KGZ", "LVA", "LBN", "LSO",
             "LBR", "LTU", "LUX", "MKD", "MWI", "MYS", "MLT", "MRT", "MUS", "MEX",
             "MNG", "MNE", "MAR", "MOZ", "MMR", "NAM", "NPL", "NLD", "NZL", "NIC",
             "NER", "NGA", "NOR", "OMN", "PAK", "PSE", "PAN", "PRY", "PER", "PHL",
             "POL", "PRT", "COD", "ROU", "RUS", "RWA", "SEN", "SRB", "SLE", "SVK",
             "SVN", "ZAF", "KOR", "ESP", "LKA", "SUR", "SWZ", "SWE", "CHE", "SYR",
             "TJK", "TZA", "THA", "TGO", "TTO", "TUN", "TUR", "TKM", "UGA", "UKR",
             "GBR", "USA", "URY", "UZB", "VUT", "VEN", "VNM", "YEM", "RNR", "ZWE"];

  // create list with all relevant country data
  var countryData = {};

  mapISO.forEach(function(d, i) {
      countryData[d] = {
        "Country": dataset[i]["Country"],
        "HPI": dataset[i]["HPI_Rank"],
        "Footprint": dataset[i]["Footprint_(gha\/capita)"],
        "AvLifeExp": dataset[i]["Average_Life_Expectancy"],
        "AdjLifeExp": dataset[i]["Inequality-adjusted_Life_Expectancy"]
      }
    });

  // create fillcolor for map based on footprint
  var colorScale = function(footprint) {
     if (0 < footprint && footprint < 1) {
       return "#ffffcc";
     }
     else if (1 < footprint && footprint < 3) {
       return "#ffeda0"
     }
     else if (3 < footprint && footprint < 5) {
       return "#feb24c"
     }
     else if (5 < footprint && footprint < 7) {
       return "#fd8d3c"
     }
     else if (7 < footprint && footprint < 9) {
       return "#fc4e2a"
     }
     else if (9 < footprint && footprint < 11) {
       return "#e31a1c"
     }
     else {
       return "#800026"
     }
  };

  // add relevant fillcolor to countryData based on present footprint
  Object.keys(countryData).forEach(function (d) {
        countryData[d]["fillcolor"] = colorScale(countryData[d].Footprint)
  });


};


function drawMap(mapDataset, barDataset, chartPad) {
  // draw map
  var linkedMap = new Datamap({
              element: document.getElementById('map_place'),
                fills: {
                  defaultFill: 'grey'
                },
                data: mapDataset,
                geographyConfig: {
                  highlightOnHover: true,
                  highlightFillColor: "black",
                  popupTemplate: function(geo, dataset) {
                      // console.log(geo.properties.name)
                      console.log(dataset.Footprint)
                      return ['<div class="hoverinfo">' +
                              'Footprint (in gha/capita) of ' + geo.properties.name,
                              ': ' + dataset.Footprint,
                              '</div>'].join('');
                  }
                },
                done: function(countryMap) {
                  // on click function to create a groupedd barchart with country data
                  countryMap.svg.selectAll("groupedbarchart").on("click", function (geo) {
                    d3v5.selectAll("body").remove();
                    drawBar(dataset, chartPad);
                  })
                }



              });

};




function drawBar(barDataset, chartPad, limit) {

  // create the svg field
  var svg = d3v5.select("body")
            .append("svg")
              .attr("width", chartPad.w)
              .attr("height", chartPad.h);


  var ageLimit = 100;


  // create x, y scaling for placing data in svg pixels
  var xScale = getXscale(chartPad);

  var yScale = getYscale(ageLimit, chartPad);


  // define x and y axis
  var xAxis = d3v5.axisBottom(xScale);

  var yAxis = d3v5.axisLeft(yScale);


  // define interaction tooltip
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


  // call on tooltip for it to work
  svg.call(tip);


  // create the bars
  var rect = svg.selectAll("rect")
                .data([barDataset, barDataset])
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
                    return "purple"
                  }
                  else {
                    return "pink"
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


  country = barDataset[0].Country;


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



};


function getXscale(chartPad) {
  var xScale = d3v5.scaleBand()
                   .domain(["Average_Life_Expectancy", "Inequality-adjusted_Life_Expectancy"])
                   .range([chartPad.xScaleRangeL, chartPad.xScaleRangeR]);

  return xScale;

};


function getYscale(limit, chartPad) {

  var yScale = d3v5.scaleLinear()
                 .domain([0, limit])
                 .range([chartPad.h - chartPad.bottom, chartPad.top]);

  return yScale;

};
