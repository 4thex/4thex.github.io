let Graph = data => {
  let svg = d3
    .select("#graph")
    .append("svg")
    .attr("width", 500)
    .attr("height", 500);
  let domain = [
    data.reduce((acc, item) => {
      return Math.min(acc, item.time);
    }, new Date(1E15)),
    data.reduce((acc, item) => {
      return Math.max(acc, item.time);
    }, new Date(-1E15))
  ];
  let scale = d3.scaleLinear()
    .domain(domain)
    .range([0, 500]);
  let x_axis = d3.axisBottom()
    .scale(scale);
  svg.append("g")
         .call(x_axis);
};
export { Graph };
