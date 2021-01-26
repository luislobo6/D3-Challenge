// @TODO: YOUR CODE HERE!
console.log("#ok")

//  Defined width and height for the area of the SVG
let svgWidth = 960;
let svgHeight = 700;

// Margins for the x,y labels
let margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

// Calculated width and height
let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Create an SVG
let svg = d3.select("#scatter")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);

// Append an SVG group for chart
let chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial graph painted
let chooseX = "poverty";
let chooseY = "healthcare";

// function used for updating x-scale
function xScale(riskData, chooseX) {
    // Create the scales with domain and range
    let xLinearScale = d3.scaleLinear()
    .domain([d3.min(riskData, d => d[chooseX]),d3.max(riskData, d => d[chooseX])])
    // .domain([0,d3.max(riskData, d => d[chooseX])])
    .range([0, width]);
  
    return xLinearScale;
  
  }

  // function used for updating y-scale
function yScale(riskData, chooseY) {
    // Create the scales with domain and range
    let yLinearScale = d3.scaleLinear()
    // .domain([d3.min(riskData, d => d[chooseY]),d3.max(riskData, d => d[chooseY])])
    .domain([0,d3.max(riskData, d => d[chooseY])])
    .range([height, 0]);
  
    return yLinearScale;
  
  }

// function for updating xAxis with a click on label
function renderXAxes(newXScale, xAxis) {
    let bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
}
// function for updating yAxis with a click on label
function renderYAxes(newYScale, yAxis) {
    let leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
}

// function for updating circles when changes on X Axis
function renderXCircles(circlesGroup, newXScale, chooseX) {

    circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chooseX]));

    return circlesGroup;
}

// function for updating circles when changes on X Axis
function renderYCircles(circlesGroup, newYScale, chooseY) {

    circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chooseY]));

    return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chooseX, circlesGroup) {

    let label;
  
    if (chooseX === "poverty") {
      label = "In Poverty(%)";
    } 
    else if(chooseX === "age"){
        label = "Age (Median)"
    }
    else if(chooseX === "income"){
      label = "Household Income (Median)";
    }
  
    let toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${label} ${d[chooseX]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }






  // Retrieve data from the CSV file and execute everything below
d3.csv("static/data/data.csv").then(riskData => {
 
    // parse data
    riskData.forEach(function(data) {
        // X Axis
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        // Y Axis
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    });
  
    // functions that returns the xLinearScale and the yLinearScale
    let xLinearScale = xScale(riskData, chooseX);
    let yLinearScale = yScale(riskData, chooseY);
  
    // Create initial axis functions
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);
  
    // append x axis
    let xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  
    // append y axis
    let yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);
  
    // append initial circles
    let circlesGroup = chartGroup.selectAll("circle")
    .data(riskData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chooseX]))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 20)
    .attr("fill", "purple")
    .attr("opacity", ".5");

    //   circlesGroup.append("text")
    //   .attr("x",12)
    //   .attr("y",".35em")
    //   .text(d => d.abbr);
  
    // Create group for X Axis labels
    let xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
    // Create group for Y Axis labels
    let yLabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");
    
    // append on X Axis 
    let povertyLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty(%)");
  
    let ageLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");
      
    let incomeLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");
  
    // append on Y Axis
    let healthcareLabel = yLabelsGroup.append("text")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("value", "healthcare") // value to grab for event listener
      .attr("dy", "1em")
      .classed("active", true)
      .text("Lacks Healthcare (%)");
    
    // append on Y Axis
    let obesityLabel = yLabelsGroup.append("text")
      .attr("y", 0 - margin.left + 20)
      .attr("x", 0 - (height / 2))
      .attr("value", "obesity") // value to grab for event listener
      .attr("dy", "1em")
      .classed("inactive", true)
      .text("Obesity (%)");
    
    // append on Y Axis
    let smokesLabel = yLabelsGroup.append("text")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("value", "smokes") // value to grab for event listener
      .attr("dy", "1em")
      .classed("inactive", true)
      .text("Smokes (%)");
    
    // updateToolTip function above csv import
    circlesGroup = updateToolTip(chooseX, circlesGroup);
  
    // X axis labels on click event
    xLabelsGroup.selectAll("text")
    .on("click", function() {
        // get value of selection
        let value = d3.select(this).attr("value");
        if (value !== chooseX) {
  
            // replaces chooseX with value
            chooseX = value;

            // console.log(chooseX)

            // functions here found above csv import
            // updates x scale for new data
            xLinearScale = xScale(riskData, chooseX);
    
            // updates x axis with transition
            xAxis = renderXAxes(xLinearScale, xAxis);
            //   yAxis = renderYAxes(yLinearScale, yAxis);
    
            // updates circles with new x values
            circlesGroup = renderXCircles(circlesGroup, xLinearScale, chooseX);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chooseX, circlesGroup);

            // changes classes to change bold text
            if (chooseX === "age") {
                ageLabel.classed("active", true)
                .classed("inactive", false);
                povertyLabel.classed("active", false)
                .classed("inactive", true);
                incomeLabel.classed("active", false)
                .classed("inactive", true);
            } else if (chooseX === "poverty") {
                ageLabel.classed("active", false)
                .classed("inactive", true);
                povertyLabel.classed("active", true)
                .classed("inactive", false);
                incomeLabel.classed("active", false)
                .classed("inactive", true);
            } else {
                ageLabel.classed("active", false)
                .classed("inactive", true);
                povertyLabel.classed("active", false)
                .classed("inactive", true);
                incomeLabel.classed("active", true)
                .classed("inactive", false);
            }
        }
    });

    
    // Y axis labels on click event
    yLabelsGroup.selectAll("text")
    .on("click", function() {
        // get selected value
        let value = d3.select(this).attr("value");
        if (value !== chooseY) {
  
            chooseY = value;
            // console.log(chooseY)

            // updates Y scale
            yLinearScale = yScale(riskData, chooseY);
    
            // updates Y axis
            yAxis = renderYAxes(yLinearScale, yAxis);
    
            // updates circles with new Y values
            circlesGroup = renderYCircles(circlesGroup, yLinearScale, chooseY);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chooseY, circlesGroup);

            // changes classes to change bold text
            
            if (chooseY === "healthcare") {
                healthcareLabel.classed("active", true)
                .classed("inactive", false);
                obesityLabel.classed("active", false)
                .classed("inactive", true);
                smokesLabel.classed("active", false)
                .classed("inactive", true);
            } else if (chooseY === "obesity") {
                healthcareLabel.classed("active", false)
                .classed("inactive", true);
                obesityLabel.classed("active", true)
                .classed("inactive", false);
                smokesLabel.classed("active", false)
                .classed("inactive", true);
            } else {
                healthcareLabel.classed("active", false)
                .classed("inactive", true);
                obesityLabel.classed("active", false)
                .classed("inactive", true);
                smokesLabel.classed("active", true)
                .classed("inactive", false);
            }
        }
    });


}).catch(function(error) {
    console.log(error);
});
  