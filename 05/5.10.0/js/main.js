/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 2 - Gapminder Clone
 */

var t = d3.transition().duration(100);

const AXIS_OFFSET = 3;
const SVG_HEIGHT = 500;
const SVG_WIDTH = 800;

const MAX_CIRCLE_RADIUS = 80; // for the country with max population

const MARGIN = { left: 70, right: 30, top: 50, bottom: 70 };

const dataInfo = {
  // to be update with real data
  xMin: 200,
  xMax: 200000,
  yMin: 0,
  yMax: 100,
  continents: new Set(),
  populationMax: 0
};

const width = SVG_WIDTH - MARGIN.left - MARGIN.right;
const height = SVG_HEIGHT - MARGIN.top - MARGIN.bottom;

const g = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", width + MARGIN.left + MARGIN.right)
  .attr("height", height + MARGIN.top + MARGIN.bottom)
  .attr("style", "border: solid 1px #d4b7d4;")
  .append("g")
  .attr("transform", "translate(" + MARGIN.left + ", " + MARGIN.top + ")");

const xAxisGroup = g
  .append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${height + AXIS_OFFSET})`);

const yAxisGroup = g
  .append("g")
  .attr("class", "y axis")
  .attr("transform", `translate(${-AXIS_OFFSET}, 0)`);

const xLabel = g
  .append("g")
  .attr("transform", `translate(${width / 2}, ${height + 50})`)
  .append("text")
  .attr("text-anchor", "middle")
  .attr("font-size", 20)
  .html("GDP Per Capita ($)");

const yLabel = g
  .append("g")
  .attr("transform", `translate(-40, ${height / 2}) rotate(-90)`)
  .append("text")
  .attr("text-anchor", "middle")
  .attr("font-size", 20)
  .html("Life Expectancy (Years)");

// X Scale
const x = d3
  .scaleLog()
  .base(10)
  .domain([dataInfo.xMin, dataInfo.xMax])
  .range([0, width]);

// Y Scale
const y = d3
  .scaleLinear()
  .domain([dataInfo.yMin, dataInfo.yMax])
  .range([height, 0]);

// X Axis
const xAxisCall = d3
  .axisBottom(x)
  .tickValues([200, 1000, 10000, 100000])
  .tickFormat(function(d) {
    return "$" + d;
  });
xAxisGroup.call(xAxisCall);

// Y Axis
const yAxisCall = d3.axisLeft(y);
yAxisGroup.call(yAxisCall);

// Continents scale -> colors
const continentColorScale = d3.scaleOrdinal().range(d3.schemeDark2);

const populationScale = d3
  .scaleSqrt()
  .range([MAX_CIRCLE_RADIUS / 30, MAX_CIRCLE_RADIUS]);

d3.json("data/data.json").then(function(data) {
  collectDataInfo(data);
  continentColorScale.domain(Array.from(dataInfo.continents));
  populationScale.domain([0, dataInfo.populationMax]);

	let index = 0;
	let oneYearData = data[index++];
	update(oneYearData);
	const yearLabel = attachYearLabel(oneYearData);

  d3.interval(() => {
		oneYearData = data[index++];
		index = index == data.length ? 0 : index;
		update(oneYearData);
		yearLabel.html(oneYearData.year);
	}, 200);

});

function attachYearLabel(oneYearData) {
  return g
    .append("g")
    .attr("transform", `translate(${width}, ${height - 20})`)
    .append("text")
    .attr("text-anchor", "end")
    .attr("font-size", 30)
    .attr("fill", "#a5a5a5")
    .html(oneYearData.year);
}

function collectDataInfo(data) {
  //console.log(dataInfo.populationMax);
  for (const el of data) {
    for (const country of el.countries) {
      dataInfo.continents.add(country.continent);
      dataInfo.populationMax = Math.max(
        dataInfo.populationMax,
        country.population
      );
    }
  }
  //console.log(dataInfo.populationMax);
  //console.log(dataInfo);
}

function update(oneYearData) {

  // Filter out countries with no income or no life_exp
  const countries = oneYearData.countries.filter(c => c.income && c.life_exp);

  // JOIN new data with old elements.
  var circles = g.selectAll("circle").data(countries, function(d) {
    return d.country;
  });

  // EXIT old elements not present in new data.
  circles
    .exit()
    .attr("fill", "red")
    .transition().duration(100)
    .attr("cy", y(0))
    .remove();

  // ENTER new elements present in new data...
  circles
    .enter()
    .append("circle")
    .attr("fill", d => continentColorScale(d.continent))
    .attr("fill-opacity", "0.4")
    .attr("cy", y(0))
    .attr("cx", d => x(d.income))
    .attr("r", d => populationScale(d.population))
    // AND UPDATE old elements present in new data.
    .merge(circles)
		.transition().duration(200)
		.attr("cx", d => x(d.income))
    .attr("cy", d => y(d.life_exp));
}
