/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.8 - Activity: Your first visualization!
*/

const RECT_WIDTH = 50;
const GAP_BETWEEN_RECTS = 20;

d3.json("data/buildings.json")
  .then(data => {
    data.forEach(v => {
      v.height = +v.height;
    });

    const svg = d3.select("#chart-area")
      .append("svg")
        .attr("width", 500)
        .attr("height", 500);

    const rects = svg.selectAll("rect")
      .data(data);

    rects.enter()
      .append("rect")
        .attr("x", (_, i) => i * (RECT_WIDTH + GAP_BETWEEN_RECTS))
        .attr("y", 10)
        .attr("width", RECT_WIDTH)
        .attr("height", d => d.height)
        .attr("fill", "#288");

    console.log(data);
  })
  .catch(console.log);