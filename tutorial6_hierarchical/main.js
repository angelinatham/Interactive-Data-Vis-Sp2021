//constants
const width = window.innerWidth,
  height = window.innerHeight,
  margin = { top: 20, bottom: 50, left: 60, right: 40 }

  ;

let svg;
let tooltip;
//let radius;

/**
 * APPLICATION STATE
 * */
let state = {
  // + INITIALIZE STATE
};

//this loads up the data
d3.json("../data/flare.json", d3.autotype).then(data => {
  state.data = data;
  init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
  const colorScale = d3.scaleOrdinal(d3.schemeBlues[5])
  //this made the circles different shades of blue

  const container = d3.select("#d3-container").style("position", "relative");


  svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .style("font", "3px sans-serif")
    .attr("text-anchor", "middle");

  //hover aspects
  tooltip = container
    .attr("class", "tooltip")
    .append("div")
    .style("position", "absolute")
    .style("top", 0)
    .style("left", 0)
    .style("background-color", "#F5F5F5")


  // this just says we're doing the nested data tree thing
  const root = d3.hierarchy(state.data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value)

  const packLayout = d3.pack()
    .size([width - 1, height - 1])
    .padding(2)



  const pack = packLayout(root)
  const node = root.descendants()

  const packGroups = svg
    .selectAll("g")
    .data(node)
    .join("g")
    .attr("transform", d => `translate(${d.x}, ${d.y})`)

  // Join our leaves to data

  const leaves = root.leaves()
  console.log("leaves", leaves)

  const leafGroup = svg.selectAll("g")
    .data(leaves)
    .join("g")
    .attr("transform", d => `translate(${d.x + 1}, ${d.y + 1})`)


  //append 
  packGroups.append("circle")
    .attr("fill", d => {
      const level1Ancestor = d.ancestors().find(a => a.depth === 1)
      return colorScale(level1Ancestor.data.name)
    })
    .attr("stroke", "blue")
    .attr("height", d => d.x + 20)
    .attr("width", d => d.y + 20)
    .attr("r", d => d.r)


  leafGroup.append("text")
    //.attr("dy", "1em")
    .text(d => d.data.name)

  leafGroup.on("mouseenter", (event, d) => {
    state.hoverLeaf = d.data.name
    state.hoverPositionX = d.x
    state.hoverPositionY = d.y
    //state.hoverPositionR = d.r

    draw()

  })

  draw(); // calls the draw function
}


/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */

// more hover stuff
function draw() {
  tooltip
    .style("transform", `translate(${state.hoverPositionX}px, ${state.hoverPositionY}px)`)
    .html(`
  <div>${state.hoverLeaf}</div>`)

}