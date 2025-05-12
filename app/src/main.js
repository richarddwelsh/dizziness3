import './style.css'

import * as d3 from "d3";

console.log("Hello World")

// Declare the chart dimensions and margins.
// const width = 1500;
const height = 200;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;
const width = window.outerWidth - marginLeft - marginRight;

// Declare the x (horizontal position) scale.
const x = d3.scaleUtc()
    .domain([new Date("2018-01-01"), new Date("2025-05-11")])
    .range([marginLeft, width - marginRight]);

// Declare the y (vertical position) scale.
const y = d3.scaleLinear()
    .domain([0, 100])
    .range([height - marginBottom, marginTop]);

// Create the SVG container.
const svg = d3.create("svg")
    .attr("class", "chart")
    .attr("width", width)
    .attr("height", height);

// Add the x-axis.
const xAxis = d3.axisBottom(x)
    .tickSize(10)
    .tickPadding(5);

const gX = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(xAxis);

// Add the y-axis.
const yAxis = d3.axisLeft(y);

const gY = svg.append("g")
    .attr("class", "y axis")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(yAxis);

const zoom = d3.zoom()
    .on('zoom', ({ transform }) => {
        // console.log(transform);
        gX.call(xAxis.scale(transform.rescaleX(x)));
        gY.call(yAxis.scale(transform.rescaleY(y)));      
    });

// Append the SVG element.
document.querySelector('#app').append(svg.call(zoom).node());
