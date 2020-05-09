import L from "leaflet";
import * as d3 from "d3";
import Recommendation from "./recommend";
import BubbleChart from "./bubble-chart";
import Restaurant from "./restaurant";
import HeatMap from "./heatmap";
import User from "./user";

const Map = {
    map: {},
    svg: {},
    persist: null,
    filter: {
        "category": "",
        "price": 0
    },
    load: function() {

        this.map = new L.map("map", {renderer: L.svg(), center: [33.44, -112.07], zoom: 12});

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1
        }).addTo(this.map);
    },
    plotMarker: function() {
        for (let i = 0; i < YELP_ARRAY.length; i++) {
            L.circleMarker(L.latLng(YELP_ARRAY[i][1]["latitude"], YELP_ARRAY[i][1]["longitude"]), {
                pane: "overlayPane",
                radius: 5,
                fillColor: "#ff0000",
                weight: 1,
                opacity: 1,
            }).addTo(this.map);
        }

        this.svg = d3.select("#map").select("svg").attr("class", "map_svg");

        const paths = this.svg.selectAll("path");

        paths.on("click", (d, e) => {
            let nodes = paths.nodes();
            Map.persist = d;

            if ("7" == nodes[e].getAttribute("stroke-width")) {
                this.svg.select("path[stroke-width='7']").attr("stroke-width", 1);
                paths.on("mouseover", this.onMouseOver);
                Map.persist = null;
            } else {
                this.svg.select("path[stroke-width='7']").attr("stroke-width", 1);
                nodes[e].setAttribute("stroke-width", 7);
                paths.on("mouseover", null);
                this.onMouseOver(d);
            }
        })
        .on("mouseover", (d) => this.onMouseOver(d));
    },
    filterMarker: function() {
        this.svg.selectAll("path")
            .data(YELP_ARRAY)
            .attr("fill-opacity", (d) => {
                const shouldShow = this.shouldShow(d);
                const isRecommended = this.isRecommended(d);

                if (shouldShow || isRecommended.length > 0) {
                    return (isRecommended.length > 0) ? 1 : 0.2;
                } else {
                    return 0;
                }
            })
            .attr("stroke-opacity", (d) => ((this.shouldShow(d) || this.isRecommended(d).length > 0) ? 1 : 0))
            .attr("fill", (d) => ((this.isRecommended(d).length > 0) ? BubbleChart.color(this.isRecommended(d)[0][0]) : "#ff0000"))
            .attr("stroke", (d) => ((this.isRecommended(d).length > 0) ? "#000000" : "#3388ff"))
            .attr("stroke-width", (d) => (this.isRecommended(d).length > 0) ? 1.5 : 1)
            .attr("visibility", (d) => ((this.shouldShow(d) || this.isRecommended(d).length > 0) ? "visible" : "hidden"));
    },
    resetMarker: function() {
        this.svg.selectAll("path")
            .attr("fill-opacity", (d) => 0.2)
            .attr("stroke-opacity", (d) => 1)
            .attr("fill", "#ff0000")
            .attr("stroke", "#3388ff")
            .attr("stroke-width", 1)
            .attr("visibility", "visible");
    },
    shouldShow: function(data) {

        if (this.filter.category !== "" && this.filter.price > 0) {
            return (-1 !== data[1].categories.indexOf(this.filter.category.replace(" N ", " & ")) && (data[1]["RestaurantPriceRange"] == this.filter.price));
        } else if (this.filter.category !== "" || this.filter.price > 0) {
            return (
                this.filter.category !== "" && -1 !== data[1].categories.indexOf(this.filter.category.replace(" N ", " & "))
                ||
                ( this.filter.price > 0 && data[1]["RestaurantPriceRange"] == this.filter.price)
            )
        } else {
            return true;
        }
    },
    isRecommended: function(data) {
        return Recommendation.entries.filter(d => -1 !== d[1].indexOf(data[0]));
    },
    onMouseOver: function(data) {
        Restaurant.updateInfo(data);
        HeatMap.updateInfo(data[1]["checkin-info"]);
        User.updateInfo(USER_DATA[data[0]]);
        BubbleChart.updateInfo(data[1]["categories"]);
    }
}

export default Map;