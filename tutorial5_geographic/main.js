/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 };



/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;

/**
 * APPLICATION STATE
 * */
let state = {
  geojson: null,
  // + SET UP STATE
};

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
  d3.json("../data/usState.json"),
  d3.csv("../data/usHeatExtremes.csv", d3.autoType),
]).then(([geojson, otherData]) => {
  // + SET STATE WITH DATA
  state.geojson = geojson
  state.heat = otherData
  console.log("state: ", state);
  init();
});
    

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {

    // + SET UP PROJECTION
    const projection = d3.geoAlbersUsa()
    .fitSize([width,height], state.geojson)


  //color?
  //const colorScale = d3.scaleSequential(d3.interpolateBlues)
//.domain(d3.extent(state.geojson.features, d => d.properties.AWATER))
  // create an svg element in our main `d3-container` element
  svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

    const states = svg.selectAll("path")
      .data(state.geojson.features)
      .join("path")
      .attr("stroke-width", "2")
      .attr("fill" , "#CCABD8")
      .attr("d", pathFunction)

  // + SET UP GEOPATH
const pathFunction = d3.geoPath(projection)
svg.selectAll("path")
  .data(state.geojson.features)
  .join("path")
  .attr("stroke", "black")
  .attr("d", pathFunction)
  .attr("fill", d => {
    return colorScale(d.properties.AWATER)
  })

  // + DRAW BASE MAP PATH
  // + ADD EVENT LISTENERS (if you want)

  draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {}

//circle
svg.selectAll("circle.point")
.data(state.heat)
.join("circle")
.attr("fill", d => {
  if (d.TempChange > 0) return "#8474A1";
  else if (d.TempChange === 0 ) return "#055B5C"
  else return "#6EC6CA"
.attr("r", d => radius(Math.abs(d.TempChange)))
.attr("r", 3)
.attr("stroke", "#ccc")

})



  
  radius = d3.scaleLinear([0, d3.max(state.heat, d => d.TempChange)], [3, 13])
})