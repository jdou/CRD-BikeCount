var locList = {E:"East",W:"West",N:"North",S:"South"}
var boundList = {EB:"East Bound",WB:"West Bound",NB:"North Bound",SB:"South Bound"}
 
var margin = {
    top: 40,
    right: 20,
    bottom: 60,
    left: 40
  }
 
var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S.%L");
    var hourParse= d3.timeFormat("%H:%M%");
    var dateParse= d3.timeFormat("%b %d %Y");
    var hourOnlyParse=d3.timeFormat("%H")
    var yearParse=d3.timeFormat("%b %Y");
    var monthParse=d3.timeFormat("%m");

var color = d3.scaleThreshold()
          .range(["#4daf4a","#984ea3"])
          .domain([9]);


   

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([0, 5])
  .direction("e")
  .html(function(d) {
    return "<strong> <span style='color:#fff'>" + d.HourTotal + "</span>";
  })



d3.json("/data/v1.0/"+document.querySelector('#title').dataset.countid, function(error, data) {
 
    hourData=data
    hourData.forEach(function(d) {
        d.countID=+d.countID;
        d.CountDate=parseTime(d.countStart);
        d.Date=dateParse(d.CountDate);
        d.Year=yearParse(d.CountDate);
        d.Hour=hourParse(d.CountDate);
        d.HourTotal=+d.totalCount;
           });
    //Sort data
    d3.select("#title").append("h1")
  .html('Station #'+ hourData[0].countID+ ' '+  hourData[0].onStreet +' '+ hourData[0].location + 
    ' of ' + hourData[0].xStreet );
    hourData=hourData.sort(function (a,b) {return d3.ascending(a.CountDate, b.CountDate) || d3.ascending(a.heading,b.heading) });
    //Nest By heading
    var hourly = d3.nest()
    .key(function(d) {return d.heading})
    .key(function(d) {return d.Year})
    .entries(hourData)

    
   var width = 960 - margin.left - margin.right;
   var height = 140*(hourly[0].values.map(function(d) { return d.key; }).length) - margin.top - margin.bottom;

   var svg = d3.select("#vis").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var xHeading=d3.scaleBand()
               .range([0,width])
               .padding(0.15);

var xYear = d3.scaleBand()
              .range([0,height])
              .padding(.05);
    

var xHours = d3.scaleBand();    

// Scales. Note the inverted domain fo y-scale: bigger is up!
var y = d3.scaleLinear();
    

var headingAxis=d3.axisTop(xHeading).tickFormat(function(d) {return boundList[d]});

var xHourAxis = d3.axisLeft(xHours);

var xAxisYear = d3.axisLeft(xYear);
   

var yAxis = d3.axisTop(y);

    
    //Heading Range
    xHeading.domain(hourly.map(function(d) { return d.key; }));
    
  //Year Range
    xYear.domain(hourly[0].values.map(function(d) { return d.key; }));
     
  
    //Hour Space within Year Range
  xHours.domain(["07:00","08:00","15:00","16:00","17:00"])
         .range([0,xYear.bandwidth()])
         .padding(.2);

  y.domain([0, d3.max(hourData, function(d) { return d.HourTotal; })]).range([0,xHeading.bandwidth()]).nice();

  // Add an SVG element for each country, with the desired dimensions and margin.
  
  

     svg.append("g")
    .attr("class", "heading-axis")
    .attr("transform", "translate(0," + -20 + ")")
    .call(headingAxis);

  var heading_g = svg.selectAll(".heading")
  .data(hourly)
  .enter()
  .append("g")
  .attr("class", function(d) {return 'heading heading-' + d.key;})
  .attr("transform", function(d) {return "translate(" + xHeading(d.key) + ",0)";});
    
heading_g.append("g").call(yAxis);
  

  var year_g = heading_g.selectAll(".year")
    .data(function(d) {return d.values;})
    .enter().append("g")
    .attr("class", function(d) {return 'year year-' + d.key;})
    .attr("transform", function(d) {return "translate(" + 0 + "," + xYear(d.key) +")";});
    
  var year_labels = year_g.selectAll('.year-label')
    .data(function(d) {return [d.key];})
    .enter().append("text")
    .attr("class", function(d) {return 'year-label year-label-' + d;})
    .attr("x", function(d) {return (xYear.bandwidth()/2)-xYear.bandwidth();})
    .attr('y',-40 )
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text(function(d) {
      return d;
    });

  

  year_g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate("+ 0 +",0 )")
      .call(xHourAxis);


  // Accessing nested data: https://groups.google.com/forum/#!topic/d3-js/kummm9mS4EA
  // data(function(d) {return d.values;}) 
  // this will dereference the values for nested data for each group
  year_g.selectAll(".bar")
      .data(function(d) {return d.values;})
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("width", function(d) {return y(d.HourTotal);})
      .attr("y", function(d) { return xHours(d.Hour);  })
      .attr("height", xHours.bandwidth())
      .attr("fill", function(d) {return color(parseInt(hourOnlyParse(d.CountDate)))})
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

  svg.call(tip);

       
     });