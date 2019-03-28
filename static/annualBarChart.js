var locList = {E:"East",W:"West",N:"North",S:"South"}
var boundList = {EB:"East Bound",WB:"West Bound",NB:"North Bound",SB:"South Bound"}
 
var margin = {
    top: 20,
    right: 20,
    bottom: 10,
    left: 40
  }
 
var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S.%L");
    var hourParse= d3.timeFormat("%H:%M%");
    var dateParse= d3.timeFormat("%b %d %Y");
    var hourOnlyParse=d3.timeFormat("%H")
    var yearParse=d3.timeFormat("%b %Y");

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
  .html('Station #'+ hourData[0].countID+ ' '+  hourData[0].onStreet +' '+ locList[hourData[0].location] + 
    ' of ' + hourData[0].xStreet );
    hourData=hourData.sort(function (a,b) {return d3.ascending(a.CountDate, b.CountDate) || d3.ascending(a.heading,b.heading) });
    //Nest By heading
    hourly = d3.nest()
    .key(function(d) {return d.Year})
    .key(function(d) {return d.heading})
    .entries(hourData)
   
    
   var width = 960 - margin.left - margin.right;
   var height = 140 - margin.top - margin.bottom;


//Scales
   var xHeading=d3.scaleBand()
               .range([0,width])
               .padding(0.15);
var yHours = d3.scaleBand();    
var x = d3.scaleLinear();
//Axis
var headingAxis=d3.axisTop(xHeading).tickFormat(function(d) {return boundList[d]});
var yHourAxis = d3.axisLeft(yHours);
var xAxis = d3.axisTop(x);

    
    //Heading Range
    xHeading.domain(hourly[0].values.map(function(d) { return d.key; }));
    

    //Hour Space within Year Range
  yHours.domain(["07:00","08:00","15:00","16:00","17:00"])
         .range([0,height])
         .padding(.2);

  x.domain([0, d3.max(hourData, function(d) { return d.HourTotal; })]).range([0,xHeading.bandwidth()]).nice();

  // Add an SVG element for each country, with the desired dimensions and margin.
  
  



  
    var year_g = d3.select("#vis")
    .selectAll("svg")
    .data(hourly)
    .enter().append("svg")
    .attr("class", function(d) {return 'year year-' + d.key;})
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom )
    .attr("transform", "translate(" + margin.left + "," +0 + ")");
  
    var heading_g = year_g.selectAll(".heading")
  .data(function(d) {return d.values;})
  .enter()
  .append("g")
  .attr("width", width)
  .attr("height", height)
  .attr("class", function(d) {return 'heading heading-' + d.key;})
  .attr("transform", function(d) {return "translate(" + xHeading(d.key)  + ","+ margin.top +")";});
    
heading_g.append("g")
.call(xAxis);
  
heading_g.append("g")
.attr("class", "x axis")
.call(yHourAxis);

d3.select("#vis").insert("svg", ":first-child")

.attr("width", width + margin.left + margin.right)
.attr("height",40)
.attr("transform", "translate(" + margin.left + "," +0 + ")")
.attr("width",width)
.append("g")
.attr("transform", "translate(0,30)")
.attr("class", "heading-axis")
.call(headingAxis);
    
  var year_labels = year_g.selectAll('.year-label')
    .data(function(d) {return [d.key];})
    .enter().append("text")
    .attr("class", function(d) {return 'year-label year-label-' + d;})
    .attr("x", function() { return((height+margin.top+margin.bottom)/2)*-1})
    .attr('y',20 )
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text(function(d) {
      return d;
    });

  



  // Accessing nested data: https://groups.google.com/forum/#!topic/d3-js/kummm9mS4EA
  // data(function(d) {return d.values;}) 
  // this will dereference the values for nested data for each group
  heading_g.selectAll(".bar")
      .data(function(d) {return d.values;})
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("width", function(d) {return x(d.HourTotal);})
      .attr("y", function(d) { return yHours(d.Hour);  })
      .attr("height", yHours.bandwidth())
      .attr("fill", function(d) {return color(parseInt(hourOnlyParse(d.CountDate)))})
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

   year_g.call(tip);

       
     });