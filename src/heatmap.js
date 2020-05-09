import * as d3 from "d3";

const HeatMap = {
    svg: {},
    width: 300,
    height: 150,
    times: new Array(24).fill(1),
    days: new Array(7).fill(1),
    timeLabels: [
        "Time",
        "04:00",
        "08:00",
        "12:00",
        "16:00",
        "20:00",
        "24:00"
    ],
    dayLabels: [
        "Su",
        "Mo",
        "Tu",
        "Wd",
        "Th",
        "Fr",
        "St"
    ],
    xScale: {},
    yScale: {},
    colorScale: {},
    tooltip: {},
    load: function() {

        let container = document.querySelector(".heatmap");
        this.width = container.getBoundingClientRect().width;
        this.height = container.getBoundingClientRect().height;
        this.times = this.times.map((value, index) => index);
        this.days = this.days.map((value, index) => index);

        this.xScale = d3.scaleBand()
            .range([0, this.width - 30])
            .domain(this.times)
            .padding(0.01)

        this.yScale = d3.scaleBand()
            .range([this.height - (30 + 58), 0])
            .domain(this.days)
            .padding(0.01);

        this.colorScale = d3.scaleLinear()
            .range(["#f6faaa", "#F46D43", "#9E0142"])
            .domain([1, 25, 50]);

        this.tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip");

        container = d3.select(".heatmap");

        container.append("h3")
            .html("Day-Time Checkins")
            .style("padding-left", "10px");

        this.svg = container
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height - 58)
            .append("g")
            .attr("transform", "translate(20, 20)");
        
        this.svg.append("g")
            .attr("transform", "translate(0, 0)")
            .call(
                d3.axisTop(this.xScale).tickFormat((d) => {
                    if (d % 4 == 0) return this.timeLabels[parseInt(d / 4)];
                })
                .tickSize(1)
            );

        this.svg.append("g")
            .call(
                d3.axisLeft(this.yScale).tickFormat((d) => this.dayLabels[6 - d])
                .tickSize(1)
            );
        
        this.updateInfo(YELP_ARRAY[0][1]["checkin-info"]);
        this.updateInfo(YELP_ARRAY[0][1]["checkin-info"]);
    },
    updateInfo: function(data) {
        data = JSON.parse(data);
        data = Object.entries(data);

        const rects = this.svg.selectAll("rect");
        
        rects.exit().remove();

        rects.data(data).enter().append("rect");

        rects.attr("x", (d) => this.xScale(this.getHour(d[0])))
            .attr("y", (d) => this.yScale(6 - this.getDay(d[0])))
            .attr("width", this.xScale.bandwidth())
            .attr("height", this.yScale.bandwidth())
            .style("fill", (d) => this.colorScale(d[1]))
            .on("mouseover", (d) => {
                this.tooltip.transition()
                    .duration(200)
                    .style("opacity", 0.9)
                    .style("visibility", "visible");
                this.tooltip.html(d[1])
                    .style("left", d3.event.pageX + "px")
                    .style("top", d3.event.pageY + "px");
            })
            .on("mouseout", (d) => {
                this.tooltip.transition()		
                    .duration(200)
                    .style("visibility", "hidden");
            });
    },
    getHour: function(data) {
        return parseInt(data.split("-")[0]);
    },
    getDay: function(data) {
        return parseInt(data.split("-")[1]);
    }
}

export default HeatMap;