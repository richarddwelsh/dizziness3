import './style.css'

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import Papa from "papaparse";

console.log("Hello World")

const timeOfDay = {
    'nite': '00:00',
    'am': '06:00',
    'mid': '12:00',
    'pm': '18:00'
}

// Download and parse CSV data
Papa.parse('/data/export.csv', {
    download: true,
    header: true,
    complete: function ({data, errors, meta}) {
        // console.log(data);
        const tranformedData = data
            .filter(d => d.Dizziness && d.Dizziness != '') // filter out data points with no value
            .map(d => ({
                timepoint: new Date(`${d.Date}T${timeOfDay[d.Period]}Z`),
                level: d.Dizziness ? (d.Dizziness == '' ? null : Number(d.Dizziness)) : null
            })  
        )

        console.log(tranformedData);

        renderChart(document.querySelector('#app'), tranformedData);
    }
})

function renderChart(elem, data) {
    // Declare the chart dimensions and margins.
    const height = 200;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 10;
    const width = window.innerWidth - marginLeft - marginRight;

    // Declare the x (horizontal position) scale.
    const x = d3.scaleUtc()
        // .domain([d3.min(data, d => d.timepoint), d3.max(data, d => d.timepoint)])
        .domain([new Date(2024, 3, 1), d3.max(data, d => d.timepoint)])
        .range([marginLeft, width - marginRight]);

    // Declare the y (vertical position) scale.
    const y = d3.scaleLinear()
        .domain([0, 10])
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
    // const yAxis = d3.axisLeft(y);

    // const gY = svg.append("g")
    //     .attr("class", "y axis")
    //     .attr("transform", `translate(${marginLeft},0)`)
    //     .call(yAxis);

    // plot the data

    const barWidth = x(new Date(1971, 1, 16, 6, 0)) - x(new Date(1971, 1, 16)); // bar width is 6 hours

    const dataSelection = svg.append('g')
          .attr('fill', 'grey')
        .selectAll()
        .data(data)
        .join("rect")
          .attr('x', d => x(d.timepoint))
          .attr('width', barWidth)
          // .attr('y', d => y(4))
          // .attr('height', d => y(0) - y(4))
          .attr('y', d => y(d.level))
          .attr('height', d => y(0) - y(d.level))
          .attr('class', d => `l${d.level}`);

    const zoom = d3.zoom()
        .on('zoom', ({ transform }) => {
            const newX = transform.rescaleX(x);

            gX.call(xAxis.scale(newX));

            dataSelection
              .attr('x', d => newX(d.timepoint))
              .attr('width', barWidth * transform.k)
        });

    // Append the SVG element.
    elem.append(svg.call(zoom).node());
}