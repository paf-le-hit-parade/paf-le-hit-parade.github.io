'use strict';


const margin = {top: 20, right: 350, bottom: 40, left: 50};
const width = 960 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;
const percentFormat = d3.format('.0%');
const leftPadding = 0;

const delay = function(d, i) {
    return i * 40;
};

function sortData(data) {
    return data.sort((a, b) => b.value - a.value);
}

function removeGeoAreasWithNoData(data) {
    return data.filter(d => d.value);
}

function prepareData(data) {
    return data.reduce((accumulator, d) => {
            Object.keys(d).forEach((k) => {
            if (!Number.isInteger(+k)) { return; }
    let value;
    if (d[+k] === '..') {
        value = 0;
    } else {
        value = +d[+k];
    }
    const newEntry = {
        value,
        Genre: d.Genre
    };
    if (accumulator[+k]) {
        accumulator[+k].push(newEntry);
    } else {
        accumulator[+k] = [newEntry];
    }
});
    return accumulator;
}, {});
}

function xAccessor(d) {
    return d.value;
}

function yAccessor(d) {
    return d.Genre;
}

const xScale = d3.scaleLinear()
    .range([0, width])
    .domain([0, 280]);

const yScale = d3.scaleBand()
    .rangeRound([0, height], 0.1)
    .padding(0.1);

function drawXAxis(el) {
    el.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(${leftPadding},${height})`)
        .call(d3.axisBottom(xScale));
}

function drawYAxis(el, data, t) {
    let axis = el.select('.axis--y');
    if (axis.empty()) {
        axis = el.append('g')
            .attr('class', 'axis axis--y');
    }

    axis.transition(t)
        .call(d3.axisLeft(yScale))
        .selectAll('g')
        .delay(delay);
}

function drawBars(el, data, t) {
    var color = ["#7D85E5","#49F1C3","#FC9665","#9D2F74","#36C6E4","#8FD847","#E62A30"]
    let barsG = el.select('.bars-g');
    if (barsG.empty()) {
        barsG = el.append('g')
            .attr('class', 'bars-g');
    }

    const bars = barsG
        .selectAll('.bar')
        .data(data, yAccessor);
    bars.exit()
        .remove();
    bars.enter()
        .append('rect')
        .style("fill", function(d, i) {
            return color[i] // here it is picking up colors in sequence
        })
        .attr('class', d => d.Genre === 'WLD' ? 'bar wld' : 'bar')
.attr('x', leftPadding)
        .merge(bars).transition(t)
        .attr('y', d => yScale(yAccessor(d)))
.attr('width', d => xScale(xAccessor(d)))
.attr('height', yScale.bandwidth())
        .delay(delay)
    ;
}

const svg = d3.select('.chart').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);



	
fetch("./data/dataTop40.csv")
    .then((res) => res.text())
.then((res) => {
    const data = prepareData(d3.csvParse(res));
const years = Object.keys(data).map(d => +d);
const lastYear = years[years.length - 1];
let startYear = years[0];
let selectedData = removeGeoAreasWithNoData(sortData(data[startYear]));
let geoAreas = selectedData.map(yAccessor);
	
var label = svg.append("text")
   .attr("class", "year label")
   .attr("text-anchor", "end")
   .attr("y", height - 20)
   .attr("x", width)
   .text(1955);
  var box = label.node().getBBox();  	

d3.select('.year').text(startYear);

yScale.domain(geoAreas);
drawXAxis(svg, selectedData);
drawYAxis(svg, selectedData);
drawBars(svg, selectedData);


const interval = d3.interval(() => {
        const t = d3.transition().duration(500);

startYear += 5;
selectedData = removeGeoAreasWithNoData(sortData(data[startYear]));

d3.select('.year').text(startYear);

yScale.domain(selectedData.map(yAccessor));
drawYAxis(svg, selectedData, t);
drawBars(svg, selectedData, t);
label.text(startYear)

if (startYear === lastYear) {
  var yearScale = d3.scale.linear().domain([1955,2009])
        .range([box.x, box.x + box.width] )
		.clamp(true);  	
   // Cancel the current transition, if any.
   svg.transition().duration(0);
  var overlay = svg.append("rect")
        .attr("class", "overlay")
        .attr("x", box.x)
        .attr("y", box.y)
        .attr("width", box.width)
        .attr("height", box.height)
		.on("mouseover",mouseover)
        .on("mouseout", mouseout)
        .on("mousemove", mousemove)
        .on("touchmove", mousemove);


    function mouseover() {
      label.classed("active", true);
    }

    function mouseout() {
      label.classed("active", false);
    }

    function mousemove() {
      displayYear(yearScale.invert(d3.mouse(this)[0]));
  }
}
}, 1000);




  // Updates the display to show the specified year.
  function displayYear(Year) {
	const  x = 5*(Math.floor(Math.abs(Year/5)))
    selectedData = removeGeoAreasWithNoData(sortData(data[x]));
	d3.select('.year').text(x);
	yScale.domain(selectedData.map(yAccessor));
	drawYAxis(svg, selectedData);
	drawBars(svg, selectedData);
    label.text(x);
  }


});

