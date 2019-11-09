var WIDTH = 2000
var HEIGHT = 2000
var centered;

var svg = d3.select("svg");
var g = d3.select("g");

var projection = d3.geoAlbersUsa()
    .scale(1070)
    .translate([WIDTH / 2, HEIGHT / 2]);

var path = d3.geoPath()
    .projection(projection);

d3.json("/canada-province.json").then(function (cp) {
    // Add the labels
    d3.selectAll('path')
        .each(function (d) {
            currPathEle = d3.select(this)["_groups"][0][0];
            svg.append("text")
                .attr("x", findCentroid(currPathEle)[0])
                .attr("y", findCentroid(currPathEle)[1])
                .text(currPathEle.id)
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "central")
                .style("font-size", 11)
                .style("fill", "white");
        });


    d3.selectAll("path")
        .data(cp.features)
        .on("mouseover", function (d) {
            currPathEle = d3.select(this)["_groups"][0][0];
            d3.select(this).style('stroke', 'black');
            getTableData(currPathEle.id);
        })

        // fade out tooltip on mouse out               
        .on("mouseout", function (d) {
            d3.select(this).style('stroke', '#46b5d6');
        })
        .on("click", clicked);
});

$(document).ready(function () {

});

function findCentroid(element) {
    bbox = element.getBBox();
    centroid = [bbox.x + bbox.width / 2, bbox.y + bbox.height / 2];
    return centroid;
}

function getTableData(id) {
    var provinceSelected = ""
    if (id == 'CA.NB') {
        provinceSelected = "New Brunswick";
    }
    else if (id == 'CA.BC') {
        provinceSelected = "British Columbia";
    }
    d3.csv("processed_data.csv").then(function (data) {
        numListings = 0;
        numEntireHome = 0;
        numPrivateRoom = 0;
        numHotelRoom = 0;
        numSharedRoom = 0;
        numNeighborhoods = 0;

        numRows = data.length;

        //num of listings in province
        for (i = 0; i < numRows; i++) {
            if (data[i]['province'] == provinceSelected) {
                numListings++;
            }
        }

        // num of listings by room type
        classes = d3.map(data, function (d) { return d['room_type']; }).keys();
        for (i = 0; i < data.length; i++) {
            if (data[i]['province'] == provinceSelected && data[i]['room_type'] == classes[0]) {
                numEntireHome++;
            }
            else if (data[i]['province'] == provinceSelected && data[i]['room_type'] == classes[1]) {
                numPrivateRoom++;
            }
            else if (data[i]['province'] == provinceSelected && data[i]['room_type'] == classes[2]) {
                numHotelRoom++;
            }
            else if (data[i]['province'] == provinceSelected && data[i]['room_type'] == classes[3]) {
                numSharedRoom++;
            }
        }

        // num of neighbourhoods
        numNeighborhoods = (d3.map(data, function (d) {
            if (d['province'] == provinceSelected) {
                return d['neighbourhood'];
            }
        }).keys()).length;

        document.getElementById("numListings").innerHTML = numListings;
        document.getElementById("numEntireHome").innerHTML = numEntireHome;
        document.getElementById("numPrivateRoom").innerHTML = numPrivateRoom;
        document.getElementById("numHotelRoom").innerHTML = numHotelRoom;
        document.getElementById("numSharedRoom").innerHTML = numSharedRoom;
        document.getElementById("numNeighborhoods").innerHTML = numNeighborhoods;
    });
}

function clicked(d, i) {
    var x, y, k;
    if (d && centered !== d) {
        var centroid = path.centroid(d);
        x = centroid[0];
        y = centroid[1];
        k = 2.5;
        centered = d;

        g.transition()
            .duration(750)
            .attr("transform", "translate(" + WIDTH / 2 + "," + HEIGHT / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
            .style("stroke-width", 1.5 / k + "px");
    } else {
        g.transition()
            .duration(750)
            .attr("transform", "translate(-559.79,0.708441)")
            .style("stroke-width", 1.5 / k + "px");
    }

    g.selectAll("path")
        .classed("active", centered && function (d) { return d === centered; });
    //   alert("translate(" + 1043 / 2 + "," + 1010 / 2 + ") scale(" + k + ") translate(" + -x + "," + -y + ")");


}