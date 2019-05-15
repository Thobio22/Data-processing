// !/usr/bin/env python
//     Name: Thomas Verouden
//     Student number: 10779272
//
//     This file visualises the

// python -m http.server 8888 &
// http://localhost:8888/scatter.html




window.onload = function() {
  // global variables
  var h = 600;
  var w = 1200;
  var barPad = 5
  var limit = 100
  var chartPad = 100



  var teensInViolentArea = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB11/all?startTime=2010&endTime=2017"
  var teenPregnancies = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB46/all?startTime=1960&endTime=2017"
  var GDP = "https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EU28+EU15+OECDE+OECD+OTF+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+ROU+RUS+SAU+ZAF+FRME+DEW.B1_GE.HCPC/all?startTime=2012&endTime=2018&dimensionAtObservation=allDimensions"

  var requests = [d3.json(teensInViolentArea), d3.json(teenPregnancies), d3.json(GDP)];


  Promise.all(requests).then(function(response) {

      vioArea = transformResponse(response[0]);
      teenPreg = transformResponse(response[1]);
      gdp = transformResponseGDP(response[2]);

      // create the svg field
      var svg = d3.select("body")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h);



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


      for (k in teenPreg) {
        // console.log(k)
        for (l in teenPreg[k]) {
          // console.log(teenPreg[k][l].Country)
          let time = teenPreg[k][l]["Time"];
          let country = teenPreg[k][l].Country
          // console.log(time);
          // console.log(county);
          if (time in full_dataset){
            // console.log(time);
            full_dataset[time].forEach(function(tvk) {
              if (tvk.Country == country) {
                tvk["Preg"] = teenPreg[k][l].Datapoint
              };

            });

          };

        };

      };


      for (m in gdp) {
        // console.log(k)
        for (n in gdp[m]) {
          // console.log(teenPreg[k][l].Country)
          let time = gdp[m][n]["Year"];
          let country = gdp[m][n].Country
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

      // remove Country: "OECD - Average"
      for (o in full_dataset) {
        full_dataset[o].pop();
      };


      console.log(full_dataset);

      // create x, y scaling for placing data in svg pixels
      var yScale = d3.scaleLinear()
                     .domain([0, limit])
                     .range([h - chartPad, chartPad]);
      var xScale = d3.scaleLinear()
                     .domain([0, limit])
                     .range([chartPad, w - chartPad]);


      drawScatter(full_dataset, xScale, yScale)




  }).catch(function(e){
      throw(e);
  });
  console.log(" Yo");

};
