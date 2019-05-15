// !/usr/bin/env python
//     Name: Thomas Verouden
//     Student number: 10779272
//
//     This file visualises the amount of teens in violent areas against the
//     amount of teen pregnancies in a d3 scatterplot, with the Country GDP indicated by color.
//
//     source: stats.oecd.org --> CWB table
//     python -m http.server 8888 &
//     http://localhost:8888/scatter.html


// global variables
var h = 600;

var w = 1200;

var barPad = 5;

var gdp_max = 90000;

var data_limit = 50;

var year = "2012";

var chartPad = {
  top: 100,
  bottom: 100,
  left: 100,
  right: 700
};

// create color array for chart + legend
var colorArray = ['#bd0026', '#fc4e2a', '#feb24c', '#ffeda0'];

// create value array of gdp portions for chart colors + legend
var gdpPortions = [gdp_max * (1/4), gdp_max * (2/4), gdp_max * (3/4), gdp_max]


window.onload = function() {

  var teensInViolentArea = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB11/all?startTime=2010&endTime=2017"
  var teenPregnancies = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB46/all?startTime=1960&endTime=2017"
  var GDP = "https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EU28+EU15+OECDE+OECD+OTF+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+ROU+RUS+SAU+ZAF+FRME+DEW.B1_GE.HCPC/all?startTime=2012&endTime=2018&dimensionAtObservation=allDimensions"

  var requests = [d3.json(teensInViolentArea), d3.json(teenPregnancies), d3.json(GDP)];

  // add title, name, studentID and short description
  addText();


  Promise.all(requests).then(function(response) {

      var vioArea = transformResponse(response[0]);

      var teenPreg = transformResponse(response[1]);

      var gdp = transformResponseGDP(response[2]);

      // console.log(vioArea);
      // console.log(teenPreg);
      // console.log(gdp);
      // console.log(Object.keys().length);
      var full_dataset = {
            '2012': [],
            '2013': [],
            '2014': [],
            '2015': []
      };

      var vioCountry = Object.keys(vioArea);

      var pregCountry = Object.keys(teenPreg);

      var gdpCountry = Object.keys(gdp);

      // console.log(vioCountry);
      // console.log(pregCountry);
      // console.log(gdpCountry);


      // add data from all datasets to full_dataset
      full_dataset = addViolent(full_dataset, vioArea);

      full_dataset = addPregnancy(full_dataset, teenPreg);

      full_dataset = addGDP(full_dataset, gdp);


      // remove Country: "OECD - Average"
      for (oecd in full_dataset) {
        full_dataset[oecd].pop();
      };

      // console.log(full_dataset)
      // console.log(full_dataset[year]);

      // for (iterate in full_dataset[year]) {
      //   console.log(iterate);
      //   for (it in iterate) {
      //     console.log(it)
      //   }
      // }


      // create x, y scaling for placing data in svg pixels
      var xScale = getXscale(data_limit, chartPad);

      var yScale = getYscale(data_limit, chartPad);


      // on window open, start on data 2012
      drawScatter(full_dataset[year], xScale, yScale);


      // call on drawScatter function with selected year for data
      document.getElementById("2012").onclick = function() {
        d3.selectAll("svg").remove()
        drawScatter(full_dataset["2012"], xScale, yScale);
      };

      document.getElementById("2013").onclick = function() {
        d3.selectAll("svg").remove()
        drawScatter(full_dataset["2013"], xScale, yScale);
      };

      document.getElementById("2014").onclick = function() {
        d3.selectAll("svg").remove()
        drawScatter(full_dataset["2014"], xScale, yScale);
      };

      document.getElementById("2015").onclick = function() {
        d3.selectAll("svg").remove()
        drawScatter(full_dataset["2015"], xScale, yScale);
      };



  }).catch(function(e){
      throw(e);

  });

  console.log(" Yo");

};


function addText() {
  // add title, name, studentID and short description
  d3.select("body")
    .append("h1")
    .text("The correlation between percentage teen pregnancy and the percentage of teens in violent areas")
    .style("font-weight", "bold");

  d3.select("body")
    .append("h3")
    .text("Thomas Verouden");

  d3.select("body")
    .append("h3")
    .text("StudentID: 10779272");

  d3.select("body")
    .append("p")
    .text("This scatterplot made with D3 shows the percentage of teens in violent areas \
    against the precentage of teen pregnancies in that country. The color is an \
    indicator for the GDP of that country.");
};

function addViolent(full_dataset, vioArea) {
  for (i in vioArea) {
    for (j in vioArea[i]) {
      // console.log(vioArea[i][j].Country)
      let time = vioArea[i][j]["Time"];

      if (time in full_dataset) {
        // console.log(time);
        full_dataset[time].push({
          "Country": vioArea[i][j].Country,
          "Vio": vioArea[i][j].Datapoint
        });

      };

    };

  };

  return full_dataset;

};


function addPregnancy(full_dataset, teenPreg) {
  for (k in teenPreg) {
    // console.log(k)
    for (l in teenPreg[k]) {
      // console.log(teenPreg[k][l].Country)
      let time = teenPreg[k][l]["Time"];

      let country = teenPreg[k][l].Country;

      // console.log(time);
      // console.log(county);
      if (time in full_dataset){
        // console.log(time);
        full_dataset[time].forEach(function(value) {
          if (value.Country == country) {
            value["Preg"] = teenPreg[k][l].Datapoint
          };

        });

      };

    };

  };

  return full_dataset;

};


function addGDP(full_dataset, gdp) {
  for (m in gdp) {
    // console.log(k)
    for (n in gdp[m]) {
      // console.log(teenPreg[k][l].Country)
      let time = gdp[m][n]["Year"];

      let country = gdp[m][n].Country;

      // console.log(time);
      // console.log(country);
      if (time in full_dataset) {
        // console.log(time);
        full_dataset[time].forEach(function(kvt) {
          if (kvt.Country == country) {
            kvt["GDP"] = gdp[m][n].Datapoint
          };

        });

      };

    };

  };

  return full_dataset;

};


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


function drawScatter(data, xScale, yScale) {

  // create the svg field
  var svg = d3.select("body")
              .append("svg")
              .attr("width", w)
              .attr("height", h);


  // define x and y axis
  var xAxis = d3.axisBottom(xScale);

  var yAxis = d3.axisLeft(yScale);

  // create x axis by calling on xAxis
  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(0," + (h - chartPad.top) + ")")
     .call(xAxis)

  // create yAxis by calling on yAxis
  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(" + chartPad.top + ",0)")
     .call(yAxis)




  // create color variable that changes with gdp
  var gdp_color = d3.scaleThreshold()
                    .domain(gdpPortions)
                    .range(colorArray);

  // define interaction tooltip
  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d) {
                return d["Country"]
                       + "<br>" + "GDP" + "<span style='color:lightgreen'>"
                       + ": $" + d["GDP"] + "</span>" + "</br>"
                       + "<br>Teens in violent areas: " + d["Vio"] + "%" + "</br>"
                       + "<br>Teen Pregnancies: " + d["Preg"] + "%" + "</br>";

              })
              .attr("stroke", "black");

  // make interactive animation work
  svg.call(tip);


  // draw the circles
  svg.selectAll("circle")
     .data(data)
     .enter()
     .append("circle")
     .attr("class", "cir")
     .attr("cx", function(d) {
         return xScale(d["Vio"]);

     })
     .attr("cy", function(d) {
         return yScale(d["Preg"]);

     })
     .attr("r", 5)
     .attr("fill", function(d) {
         return gdp_color(d["GDP"]);
     })
     .on('mouseover', tip.show) // for animation
     .on('mouseout', tip.hide);

     // create chart Title
     svg.append("text")
        .attr("transform", "translate(100,0)")
        .attr("x", 50)
        .attr("y", 50)
        .attr("font-size", "24px")
        .text("Correlation between teen pregnancy and the % teens in violent areas");

     // create x-axis label
     svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", w - chartPad.right)
        .attr("y", h - 50)
        .text("% Teens in violent areas");

     // create y-axis label
     svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 30)
        .attr("x", -150)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .text("Teen pregnancy (%)");

     // create legend
     var legend3 = svg.selectAll('.legend3')
                      .data(colorArray)
                      .enter()
                      .append('g')
                      .attr("class", "legends3")
                      .attr("transform", function (d, i) {
                          return "translate(0," + i * 20 + ")";

                      })
                      .append('rect')
                      .attr("x", 0)
                      .attr("y", 0)
                      .attr("width", 10)
                      .attr("height", 10)
                      .style("fill", function (d, i) {
                          return colorArray[i];

                      })
                      .data(gdpPortions)
                      .enter()
                      .append('text')
                      .attr("x", 20)
                      .attr("y", 10)
                      //.attr("dy", ".35em")
                      .text(function (d, i) {
                          console.log(d)
                          console.log(i)
                          return d
                      })
                      .attr("class", "textselected")
                      .style("text-anchor", "start")
                      .style("font-size", 15);




};
