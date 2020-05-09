import * as d3 from "d3";
import Slider from "./slider";
import Restaurant from "./restaurant";
import BubbleChart from "./bubble-chart";
import User from "./user";
import HeatMap from "./heatmap";
import Map from "./map";

const Recommendation = {
    entries: {},
    color: {},
    load: function() {
        this.updateInfo("Italian");
    },
    updateInfo: function(category) {
        category = category.replace(" N ", " & ");
        const data = RECOMMEND.filter((d) => d.suggested_category == category);
        const categories = data[0]["recommended_categories"];
        const restaurants = data[0]["recommended_restaurants"];
        this.entries = Object.entries(restaurants);
        const recommendation = d3.select(".recommendation");

        this.color = d3.scaleOrdinal(categories, [...d3.schemeSet1]);

        recommendation.html(`<h2>Recommendation for: ${category}</h2>`);

        recommendation.selectAll(".category-container").remove();

        const containers = recommendation.selectAll(".category-container")
            .data(categories)
            .enter()
            .append("div")
            .attr("class", "category-container");

        containers.append("div")
            .attr("class", "category")
            .append("span")
            .style("background-color", (d) => BubbleChart.color(d))
            .html((d) => d);
        
        const cards = containers.selectAll(".card")
            .data(d => restaurants[d])
            .enter()
            .append("div")
            .attr("class", "card")
            .html(d => this.getMarkup(d));
        
        cards.on("mouseover", (d) => {
            const data = YELP_DATA[d];
            Restaurant.updateInfo([d, data]);
            HeatMap.updateInfo(data["checkin-info"]);
            User.updateInfo(USER_DATA[d]);
            BubbleChart.updateInfo(data["categories"]);
        })
        .on("mouseout", (d) => {
            BubbleChart.reset();
            if (null !== Map.persist) {
                const data = Map.persist;
                Restaurant.updateInfo(data);
                HeatMap.updateInfo(data[1]["checkin-info"]);
                User.updateInfo(USER_DATA[data[0]]);
            }
        });

    },
    getMarkup: function(id) {

        const data = YELP_DATA[id];

        return `
            <h3 class="name">${data.name}</h3>
            <div class="stats">
                <div class="reviews">${Restaurant.rateStar[data.stars]}</div>
                <div class="rating">${data.review_count} Reviews</div>
                <div class="price">${Slider.data[data.RestaurantPriceRange]}</div>
            </div>
            <div class="address"><a target="_blank" href="https://www.google.com/maps/search/?api=1&query=${data.full_address}">${data.full_address}</a></div>
        `;
    }   
};

export default Recommendation;