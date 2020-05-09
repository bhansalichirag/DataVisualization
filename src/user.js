import * as d3 from "d3";

const User = {
    svg: {},
    width: 300,
    height: 300,
    padding: 30 + 58,
    labels: [
        "Yelp Age",
        "Reviews",
        "Coolness",
        "Fans",
        "Stars",
        "Useful"
    ],
    yelpAgeScale: {},
    reviewsScale: {},
    coolnessScale: {},
    fansScale: {},
    starsScale: {},
    usefulScale: {},
    yScale: {},
    xScale: {},
    colorScale: {},
    load: function() {

        let container = document.querySelector(".userstat-container");
        this.width = container.getBoundingClientRect().width;
        this.height = container.getBoundingClientRect().height;

        this.yelpAgeScale = d3.scalePow()
            .range([5, this.height - this.padding])
            .domain([3.85, 10.81]);

        this.reviewsScale = d3.scalePow()
            .exponent(1/3)
            .range([5, this.height - this.padding])
            .domain([6.07, 633.42]);

        this.coolnessScale = d3.scalePow()
            .exponent(1/3)
            .range([5, this.height - this.padding])
            .domain([0.75, 5518]);

        this.fansScale = d3.scalePow()
            .exponent(1/3)
            .range([0, this.height - this.padding])
            .domain([0, 89.75]);

        this.starsScale = d3.scalePow()
            .range([1, this.height - this.padding])
            .domain([1.57, 4.72]);

        this.usefulScale = d3.scalePow()
            .exponent(1/3)
            .range([5, this.height - this.padding])
            .domain([3, 6487.5]);

        this.yScale = d3.scaleLinear()
            .range([0, this.height - this.padding])
            .domain([0, 100]);

        this.xScale = d3.scaleBand()
            .range([0, this.width - 30])
            .domain(this.labels)
            .padding(0.6);

        container = d3.select(".userstat-container");
        container.append("h3")
            .html("Restaurant Demographics");

        this.svg = container
            .append("div")
            .attr("class", "userstats")
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height - this.padding + 20)
            .append("g");
        
        this.svg.append("g")
            .attr("transform", "translate(5, 0)")
            .call(d3.axisLeft(this.yScale).tickSize(2));
        
        this.svg.append("g")
            .attr("transform", `translate(5, ${this.height - this.padding})`)
            .call(d3.axisBottom(this.xScale).tickFormat((d) => d).tickSize(2));
        
        this.updateInfo(USER_DATA[YELP_ARRAY[0][0]]);
        this.updateInfo(USER_DATA[YELP_ARRAY[0][0]]);
    },
    updateInfo: function(data) {
        data = Object.entries(data);

        let rects = this.svg.selectAll("rect")
            .data(data);

        let texts = this.svg.selectAll("text.stats")
            .data(data);

        rects.exit().remove();
        texts.exit().remove();

        rects.enter().append("rect");
        texts.enter().append("text").attr("class", "stats");

        rects.transition()
            .duration(500)
            .attr("x", (d) => this.xScale(this.getLabel(d[0])) + 5)
            .attr("y", (d) => (this.height - this.getScaledValue(d[0], d[1]) - this.padding))
            .attr("width", this.xScale.bandwidth())
            .attr("height", (d) => this.getScaledValue(d[0], d[1]))
            .attr("fill", (d) => d3.interpolateGreens(this.getScaledValue(d[0], d[1]) / (this.height - this.padding)));

        texts.transition()
            .duration(500)
            .attr("x", (d) => this.xScale(this.getLabel(d[0])) + 10)
            .attr("y", (d) => (this.height - this.getScaledValue(d[0], d[1]) - this.padding - 2))
            .text((d) => Math.round(d[1]));
    },
    getLabel: function(key) {
        if (key == "Yelping_age") return "Yelp Age";
        else if (key == "review_count") return "Reviews";
        else if (key == "coolness") return "Coolness";
        else if (key == "fans") return "Fans";
        else if (key == "average_stars") return "Stars";
        else return "Useful";
    },
    getScaledValue: function(key, value) {
        if (key == "Yelping_age") return this.yelpAgeScale(value);
        else if (key == "review_count") return this.reviewsScale(value);
        else if (key == "coolness") return this.coolnessScale(value);
        else if (key == "fans") return this.fansScale(value);
        else if (key == "average_stars") return this.starsScale(value);
        else return this.usefulScale(value);
    }
};

export default User;