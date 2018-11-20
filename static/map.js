mapboxgl.accessToken = 'pk.eyJ1IjoiamF5ZCIsImEiOiJUTjM5bGpNIn0._B2eAOBJiK2-xWKjYnfbyw'; //Put your Mapbox Public Access token here
    var margin = {top: 20, right: 20, bottom: 60, left: 60}
    var height= 250- margin.top - margin.bottom;
    var width = 240 - margin.left - margin.right;
    var hourData=[]
 
    var hourParse= d3.timeFormat("%H:%M% ");
    var hourOnlyParse=d3.timeFormat("%H")
    var yearParse=d3.timeFormat("%Y");
    var monthParse=d3.timeFormat("%m");
    var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S.%L");
    var boundList = {EB:"East Bound",WB:"West Bound",NB:"North Bound",SB:"South Bound"}
    var yearList =[2011,2012,2013,2014,2015,2016,2017]
    var monthList =[5,10]
    var popup //Popup in global scope so events can access it
    var colorList = [
   
    [1, '#fcc5c0'],
    [51, '#fa9fb5'],
    [101, '#f768a1'],
    [151, '#dd3497'],
    [201, '#ae017e'],
    [251, '#7a0177']
  ];

   var CurrentYear=2017
   var CurrentMonth=5
   //d3 

   y = d3.scaleLinear().rangeRound([height, 0]);


    //Load a new map in the 'map' HTML div
    var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/light-v9',
            center: [-123.488802, 48.454731],
            zoom: 9.83
        });

    //Load the vector tile source of cycling volume
    map.on('load', function () {
            map.addSource('cycling-volume', {
                type: 'vector',
                url: 'mapbox://jayd.ahoxavvu' //Mapbox tileset Map ID
            });

    //Add the circle layer to the map
    map.addControl(new mapboxgl.NavigationControl(),'top-left');

    map.addLayer({
        'id': 'cycling_volume',
        'source': 'cycling-volume', //name of source
        "filter": ["all",["==", "Year",CurrentYear],["==", "Month",CurrentMonth]],
        'source-layer': 'PeakHour-99cunt', //name of the layer in the tileset
        'type': 'circle',
        'paint' : {
            'circle-color' : {
                    property: 'peakHour',
                    type: 'interval',
                    stops: colorList
        },
            'circle-radius': {
               
                'stops': [[8, 2], [13, 10],[15, 15],[17, 20]]
            },
            'circle-opacity': 1
          }
        });

    //newFilter = ["all",["==", "Year",2016],["==", "Month",5]]
    //map.setFilter('cycling_volume',newFilter)
    // When a click event occurs near a place, open a popup at the location of
// the feature, with HTML description from its properties
function barChart(indata) {
       if (indata.length >0 ) {
  var x = d3.scaleBand().domain(["07:00 ","08:00 ","15:00 ","16:00 ","17:00 "]).range([0,width]).padding(.1);
 //console.log(indata)
  var svg = d3.select("body").append("svg")
    .remove()
   .attr("height",height + margin.top + margin.bottom)
   .attr("width",width+ margin.left + margin.right);
    
  var xAxis = d3.axisBottom(x);
  
  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      
    g.append("text")
    .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
    .attr("x", width / 2)
    .attr("y", margin.bottom - 40)
     .attr("dy", ".71em")
     .style("text-anchor", "middle")
     .text("Count Hour");

     g.append("text")
      .attr("transform", "translate(0," + 0 + ")")
    .attr("x", width / 2)
    .attr("y", -15 )
     .attr("dy", ".71em")
     .attr("font-weight","bold")
     .style("text-anchor", "middle")
     .text(boundList[indata[0].heading]);

    g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height/2)
    .attr("y", -margin.left+15)
    .attr("dy", ".71em")
    .style("text-anchor", "middle")
    .text("Number of Cyclists");


      var legend = g.append("g")
      .attr("transform", "translate(" +40 +"," + (height+50) + ")");   
       
       legend.append("rect")
       .attr("y",-12)
      .attr("width", 15)
      .attr("height", 15)
      .attr("class","am");
      
      legend.append("text")
      .attr("font-size", 11)
      .attr('x',20)
      .text("AM");

      legend.append("rect")
       .attr("y",-12)
       .attr('x',45)
      .attr("width", 15)
      .attr("height", 15)
      .attr("class","pm");

      legend.append("text")
      .attr("font-size", 11)
      .attr('x',45+20)
      .text("PM");
      


     g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y));

   

    
    g.selectAll(".bar")
    .data(indata)
    .enter().append("rect")
      .attr("class", function(d) { if (parseInt(hourOnlyParse(d.CountDate)) > 8) {return "bar pm";} else {return "bar am";}})
      .attr("x", function(d) { return x(hourParse(d.CountDate)); })
      .attr("y", function(d) { return y(d.HourTotal); }) 
      .attr("width",x.bandwidth())
      .attr("height", function(d) { return height - y(d.HourTotal); });

      return svg
     }
     else{
      var svg = d3.select("body").append("svg")
    .remove()
    svg.attr("display","none")
    return svg
     }
  }



d3.csv("static/BikeCountsHourly.csv", function(error, data) {
   
    hourData=data
    hourData.forEach(function(d) {
        d.countID=+d.countID;
        d.CountDate=parseTime(d.countStart);
        d.HourTotal=+d.totalCount;
       
    });
     
});
map.on('click', function(e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['cycling_volume'] });

    // if the features have no info, return nothing
    if (!features.length) {
        return;
    }

    var feature = features[0];

  
   
    selectedDayData=hourData.filter(function(d){ return d.countID==feature.properties['countID'] & yearParse(d.CountDate)==CurrentYear & monthParse(d.CountDate) ==CurrentMonth ; })
   
  y.domain([0, d3.max(selectedDayData, function(d) { return d.HourTotal; })]).nice();
  
   var svg= barChart(selectedDayData.filter(function(d){ return d.heading == "NB" || d.heading == "EB"}))
   var svg2= barChart(selectedDayData.filter(function(d){ return d.heading == "SB"  || d.heading == "WB"}))
   //Combine Both svg nodes under one parent element
   var popUpDiv=document.createElement("div")
   popUpDiv.innerHTML= '<div><h4>' + '#' + feature.properties['countID']+ ' ' 
   + feature.properties['onStreet']+ " " +feature.properties['location']+ " of " 
   + feature.properties['xStreet'] +"</br>Peak Hour:"  + feature.properties['peakHour'] 
   +'</h4>' + '<a href="/chart/'+feature.properties['countID']
   +'" target="_blank" class="button button-popup">Compare Count  Periods</a></div><div style="clear: both;"></div>'

   popUpDiv.appendChild(svg.node())
   popUpDiv.appendChild(svg2.node())
  
   popup = new mapboxgl.Popup({closeOnClick: true})
        .setLngLat(feature.geometry.coordinates)
        .setDOMContent(popUpDiv)
        .addTo(map);
});

// Use the same approach as above to indicate that the symbols are clickable
// by changing the cursor style to 'pointer'
map.on('mousemove', function(e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['cycling_volume'] });
    map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
});
    });

//Select The Year of the Count
document.getElementById('buttons-year').addEventListener('click', function(event) {
    CurrentYear = parseInt(event.target.id.substr('button-'.length));

    try {popup.remove()}
    catch(e){}
    var ul = document.getElementById('buttons-year');
    var button = ul.getElementsByTagName('li');
for (var i=0; i<button.length; i++){
     button[i].className="button"
     
}
    event.target.className +=" selected"
    var UpdateFilter = ["all",["==", "Year",CurrentYear],["==", "Month",CurrentMonth]]
    map.setFilter('cycling_volume',UpdateFilter);
});

//Select the Month of the Count
document.getElementById('buttons-month').addEventListener('click', function(event) {
    CurrentMonth = parseInt(event.target.id.substr('button-'.length));
   try {popup.remove()}
   catch(e){}
    var ul = document.getElementById('buttons-month');
    var button = ul.getElementsByTagName('li');
for (var i=0; i<button.length; i++){
     button[i].className="button"
     
}
    event.target.className +=" selected"
    var UpdateFilter = ["all",["==", "Year",CurrentYear],["==", "Month",CurrentMonth]]
    map.setFilter('cycling_volume',UpdateFilter);
});