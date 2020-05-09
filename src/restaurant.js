import * as d3 from "d3";
import Map from "./map";
import HeatMap from "./heatmap";
import User from "./user";
import BubbleChart from "./bubble-chart";
import Slider from "./slider";

const Restaurant = {
    rateStar: {
        1: "★",
        2: "★★",
        3: "★★★",
        4: "★★★★",
        5: "★★★★★",
        1.5: "★☆",
        2.5: "★★☆",
        3.5: "★★★☆",
        4.5: "★★★★☆"
    },
    load: function() {
        Map.svg.selectAll("path")
            .data(YELP_ARRAY)
            .on("mouseover", (d) => {
                this.updateInfo(d);
                HeatMap.updateInfo(d[1]["checkin-info"]);
                User.updateInfo(USER_DATA[d[0]]);
                BubbleChart.updateInfo(d[1]["categories"]);
            });
        
        this.updateInfo(YELP_ARRAY[0]);
    },
    updateInfo: function(data) {
        const infoContainer = d3.select(".info-container");

        infoContainer.select(".name").remove();
        infoContainer.append("h2")
            .attr("class", "name")
            .text(data[1].name);
        
        infoContainer.select(".stats").remove();
        const stats = infoContainer.append("div")
            .attr("class", "stats");
        
        stats.append("div")
            .attr("class", "rating")
            .html(this.rateStar[data[1].stars]);
        
        stats.append("div")
            .attr("class", "reviews")
            .html(`${data[1].review_count} Reviews`);
        
        stats.append("div")
            .attr("class", "price")
            .html(Slider.data[data[1]["RestaurantPriceRange"]]);
    
        infoContainer.select(".category").remove();
        infoContainer.append("div")
            .attr("class", "category")
            .html(data[1].categories.split(", ").reduce((acc, d) => acc + `<span>${d}</span>`, ""));
        
        infoContainer.select(".address").remove();
        infoContainer.append("div")
            .attr("class", "address")
            .html(`<a target="_blank" href="https://www.google.com/maps/search/?api=1&query=${data[1].full_address}">${data[1].full_address}</a>`);
    }
}

export default Restaurant;