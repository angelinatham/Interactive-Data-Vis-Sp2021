/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 },
  radius = 5;

// these variables allow us to access anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.
let svg;
let xScale;
let yScale;
let yAxis;
let xAxis;
let xAxisGroup;
let yAxisGroup;


/* APPLICATION STATE */
let state = {
  data: [],
  selection: "All", // + YOUR FILTER SELECTION
};

/* LOAD DATA */
// + SET YOUR DATA PATH
d3.csv(".../data/NYPD_Hate_Crimes.csv", (d) => {
  return{
    category: d.Category, // for drop down list i think
    total: +d.ID,
    year: new Date(d.Year,01,01)
  }
})
  .then(data => {
    state.date = date;
    init();
  });

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  // + SCALES

  xScale = d3.scaleTime()
    .domain(d3.extent(state.data, d=> d.year))
    .range([margin.left, width - margin.right])

    yScale = d3.scaleLinear()
    .domain(d3.extent(state.data, d=> d.total))
    .range([height - margin.bottom, margin.top])

  // + AXES
  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale)

  // + UI ELEMENT SETUP

  const selectElement = d3.select("#dropdown").on("change", function() {
    // `this` === the selectElement
    // 'this.value' holds the dropdown value a user just selected
    state.selection = this.value; // + UPDATE STATE WITH YOUR SELECTED VALUE
    console.log("new value is", this.value);
    draw(); // re-draw the graph based on this new selection
  });

  // add in dropdown options from the unique values in the data
  selectElement
    .selectAll("option")
    .data(["All", "Sexual Orientation", "Religion/Religious Practice", "Race/Color", "Gender"]) // + ADD DATA VALUES FOR DROPDOWN
    .join("option")
    .attr("value", d => d.category)
    .text(d => d.category);

  // + SET SELECT ELEMENT'S DEFAULT VALUE (optional)

  // + CREATE SVG ELEMENT

  // + CALL AXES

  const xAxisGroup = svg.append("g")
  .attr("class", "xAxis")
  .attr("transform", 'translate(${0},${height - margin.bottom})')
  .call(xAxis)
  draw(); // calls the draw function

  xAxisGroup.append("text")
  .attr("class", 'axis-title')
  .attr("x", width/2)
  .attr("y", 50)
  .attr("font-size", "12")
  .attr("fill", "black")
  .text("Year")

  yAxisGroup = svg.append("g")
  .attr("class", "yAxis")
  .attr("transform",`translate(${margin.left},${0})`)
  .call(yAxis)

  yAxisGroup.append("text")
  .attr("class", 'axis-title')
  .attr("x", -50)
  .attr("y", height/2)
  .attr("writing-mode", "vertical-lr")
  .attr("text-anchor", "middle")
  .attr("fill", "black")
  .text("Count")

  }

/* DRAW FUNCTION */
// we call this everytime there is an update to the data/state
function draw() 


  filteredData = state.data
  .filter(d => d.category === state.selectedCategory)

  // + UPDATE SCALE(S), if needed
  yScale.domain([0, d3.max(filteredData, d => d.ID)])
  // + UPDATE AXIS/AXES, if needed
  yAxisGroup 
    .transition()
    .duration(1000)
    .call(yAxis.scale(yScale))

  // + DRAW CIRCLES/LABEL GROUPS, if you decide to
 dots = svg
    .selectAll(".dot")
    .data(filteredData, d => d.year) // if i change it to total dot color changes
    .join(                           // if i change it to year transitions work
      enter => enter.append("g")
        .attr("class","dot")
        .attr("fill", d => colorScale(d.type) ) //d => colorScale(d.type)
        .attr("transform", d => `translate(${xScale(d.year)},${yScale(d.ID)})`)
        ,
      update => update
        .call(update => update.transition()
        .duration(1000)
        .attr("transform",d => `translate(${xScale(d.year)},${yScale(d.ID)})`)
    ),
    exit => exit.remove()
    );

  dots.selectAll("circle")  //add circle into group
      .data(d => [d])
      .join("circle")
      .attr("r", radius)

  //dots.selectAll("text")  //add text into group
      //.data(d => [d])
      //.join("text")
      //.atrr("text-anchor","end")
      //.text(d => `{formatDate(d.year)}`)

  // + DEFINE LINE GENERATOR FUNCTION
  lineFunction = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.ID))

  // + DRAW LINE AND/OR AREA
  svg.selectAll("path.line")
    .data([filteredData])
    .join("path")
    .attr("class","line")
    .attr("d", d => lineFunction(d))
    .attr("fill","none")
    .transition()
    .duration(1000)
    

 areaFunction = d3.area() //showed filled in area underneath line
     .x(d => xScale(d.year))
     .y0(yScale(0))
     .y1(d => yScale(d.ID))

  svg.selectAll(".area")
      .data([filteredData])
      .join("path")
      .attr("class",'area')
      .attr("opacity", 0.2)
      .transition()
      .duration(1000)
      .attr("d", d => areaFunction(d))
