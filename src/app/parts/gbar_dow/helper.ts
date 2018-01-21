
import { Timespan } from 'app/models/timespan';
import { Setting } from 'app/models/setting';
import { convertTime, formatTime, round } from 'convertTime';

export function parse(spans: Timespan[], settings?: any) {

	// ! If you want to edit 'spans' you must clone with Timespan.cloneArray()
	let data = [
		{name: "Mon", yVal: 0, color: "#26A69A"},
		{name: "Tue", yVal: 0, color: "#26A69A"},
		{name: "Wed", yVal: 0, color: "#26A69A"},
		{name: "Thu", yVal: 0, color: "#26A69A"},
		{name: "Fri", yVal: 0, color: "#26A69A"},
		{name: "Sat", yVal: 0, color: "#26A69A"},
		{name: "Sun", yVal: 0, color: "#26A69A"}
	]

  for (let i=0;i<spans.length;i++){
    let span = spans[i];
    let index = settings.centercount.getSetting() ? 
    	span.getCenter().getDay()
    	: span.start.getDay();

    data[index].yVal += settings.timescount.getSetting() ?
    	1 : span.getLength() / (60*60*1000); // convert to hours;
  }

  if (settings.avgvalue.getSetting())
  	for (let i=0;i<data.length;i++)
  		data[i].yVal = data[i].yVal / spans.length;

  return data;

}

export function draw(svg: any, data: any, d3: any) {

	let padding: number = 35;
	let width: number = svg.width.baseVal.value;
	let height: number = svg.height.baseVal.value;

	if (svg !== null) {

		let graph = d3.select(svg);
		graph.text('');

	  let xScale = d3.scaleBand()
	      .domain(data.map(function(d){ return d.name; }))
	      .range([0, 300]);

	  let yScale = d3.scaleLinear()
	      .domain([0,d3.max(data, function(d) {return d.yVal})])
	      .range([180, 0]);

	  let xAxis = d3.axisBottom(xScale)
	      .ticks(7)
	      .scale(xScale);

	  let yAxis = d3.axisLeft(xScale)
	      .scale(yScale)
	      .ticks(7,"s");

    graph.append("g")
	    .attr("class", "axis")
	    .attr("transform", "translate(" + (padding) + "," + padding + ")")
	    .call(yAxis);

     graph.append('g')
	     .attr('class', 'axis')
	     .attr("transform", "translate(" + padding + "," + (height - padding) + ")")
	     .call(xAxis);

	  let rects = graph.selectAll('rect')
	      .data(data);
	      rects.size();

	  let newRects = rects.enter();

	  newRects.append('rect')
	      .attr('x', function(d,i) {
	        return xScale(d.name );
	      })
	      .attr('y', function(d) {
	          return yScale(d.yVal);
	        })
	      .attr("transform","translate(" + (padding -5  + 25) + "," + (padding - 5) + ")")
	      .attr('height', function(d) {
	          return height - yScale(d.yVal) - (2*padding) + 5})
	      .attr('width', 20)
	      .attr('fill', function(d, i) {
	        return data[i].color;
	      });

	 }

}
