/* CONSTANTS AND GLOBALS */
const width = window.innerWidth* .8,
  height = window.innerHeight* .8,
  margin = { top: 20, bottom: 50, left: 50, right: 40 },
  radius = 5;

// these variables allow us to access anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.
let svg;
let xScale;
let yScale;
let colorScale;

/* APPLICATION STATE */
let state = {
  data: [],
  selection:'glazed' // + YOUR FILTER SELECTION
};

/* LOAD DATA */
/**d3.json("../data/environmentRatings.json", d3.autoType).then(raw_data => {
  // + SET YOUR DATA PATH
  console.log("raw_data", raw_data);
  state.data = raw_data;
  init();
}); **/

d3.csv("../data/donut.csv",d3.autoType).then(raw_data =>{

  console.log("raw_data",raw_data);
  state.data = raw_data;
  init();
});


/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in 
function init() {
 // + SCALES
 xScale = d3.scaleOrdinal()
 .domain(d3.extent(state.data, d=> d.donut))
 .range([margin.left, width - margin.right])
 

    yScale = d3.scaleLinear()
    .domain(d3.extent(state.data, d => d.rank))
    .range([height - margin.bottom, margin.bottom])

  // + AXES 
  const x = d3.axisBottom(xScale) 
  const y = d3.axisLeft(yScale)



  //Create the svg

  svg = d3.select("#d3-container")
  .append("svg")
  .attr("width", width)
  .attr("height",height)

  // + UI ELEMENT SETUP
   // add labels - xAxis
    // + CALL AXES
  const xAxisGroup = svg.append("g")
  .attr("class", 'xAxis')
  .attr("transform", `translate(${0}, ${height - margin.bottom})`) // move to the bottom
  .call(x)

const yAxisGroup = svg.append("g")
  .attr("class", 'yAxis')
  .attr("transform", `translate(${margin.left}, ${0})`) // align with left margin
  .call(y)

// add labels - xAxis
xAxisGroup.append("text")
  .attr("class", 'axis-title')
  .attr("x", width / 2)
  .attr("y", 40)
  .attr("text-anchor", "middle")
  .style("fill","#FFFFFF")
  .style("font", "40px, calibri")
  .text("Donut")

// add labels - yAxis
yAxisGroup.append("text")
  .attr("class", 'axis-title')
  .attr("x", -40)
  .attr("y", height / 2)
  .attr("writing-mode", "vertical-rl")
  .attr("text-anchor", "middle")
  .style("fill","#FFFFFF")
  .style("font", "40px, calibri")
  .text("Rank")

   // append a new group, g stands for group
   svg.append("g")
   .attr("class", "xAxis")
   .attr("transform", `translate(${0},${height-margin.bottom})`)
   .call(x)

   svg.append("g")
   .attr("class", "yAxis")
   .attr("transform", `translate(${margin.left},${0})`)
   .call(y)


  // Setting up the UI Elements
  const listoptions =  d3.select("#dropdown")

    listoptions.selectAll("options")
    .data(["Glazed", "Matcha", "French Cruller", "Strawberry Frosted", "Jelly"])
    .join("option")
    .attr("value", d=>d)
    .text (d=>d)

  listoptions.on("change", event => {

    state.selection = event.target.value
    draw();

  })
    // calls the draw function
   draw(); 

}

/* DRAW FUNCTION */
 // we call this everytime there is an update to the data/state
function draw() {

  const userInput= state.data.filter(d=>d.donut === state.selection)

  svg.selectAll("circle")
  .data(state.data, d=>d.id)
  .join(
     enter => enter.append("circle")
     .attr("fill", '#FFFFFF')
     .attr("r", radius*2)
     .attr("cx", d=> xScale(d.donut))
     
     .call(enter=> enter.transition()
     .ease(d3.easeLinear)
      .duration(100)
      .attr("cy", d=> yScale(d.rank))
    )
    ,
    update => update,
    
     exit => exit
     .call(sel => sel
       .attr("opacity", 1)
       .transition()
       .duration(500)
       .attr("opacity", "0")
       .remove()
     )
  )
     
  
  .attr("cx", d=> xScale(d.donut))
     }