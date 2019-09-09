/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.5 - Activity: Adding SVGs to the screen
*/

d3.select('#chart-area')
  .append('svg')
  .attr('width', 800)
  .attr('height', 600)
    .append('rect')
    .attr('x', 50)
    .attr('y', 10)
    .attr('width', 100)
    .attr('height', 200)
    .attr('fill', '#0ff')