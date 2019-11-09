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

// on DOM load
$(document).ready(function () {
    $("#table").hide();
});


d3.json("/canada-province.json").then(function (cp) {
    // Add the labels
    d3.selectAll('path')
        .each(function (d) {
            currPathEle = d3.select(this)["_groups"][0][0];
            svg.append("text")
                .attr("x", findCentroid(currPathEle)[0])
                .attr("y", findCentroid(currPathEle)[1])
                .text(currPathEle.id)
                .attr("class", "labels")
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "central")
                .style("font-size", 12)
                .style("font-weight", "bold")
                .style("fill", "black");
        });

    // on mouse over and mouse out
    d3.selectAll("path")
        .data(cp.features)
        .on("mouseover", function (d) {
            $("#table").show();
            currPathEle = d3.select(this)["_groups"][0][0];
            d3.select(this).style('stroke', 'black');
            getTableData(currPathEle.id);
        })

        .on("mouseout", function (d) {
            d3.select(this).style('stroke', '#ddd');
        })
        .on("click", clicked);
});

// finding centroid to place labels on provinces
function findCentroid(element) {
    bbox = element.getBBox();
    centroid = [bbox.x + bbox.width / 2, bbox.y + bbox.height / 2];
    return centroid;
}

// to get details of Airbnb on hover over provinces
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

// on click of province and zoom in to display neighbourhoods
function clicked(d, i) {
    //hide all labels
    $(".labels").hide();

    //calling function that handles zoom in and zoom out on click of province
    currPathEle = d3.select(this)["_groups"][0][0];
    performZoomOperation(currPathEle, d)
    
    // displayNeighbourhoods(currPathEle, d);
}


// function to handle zoom in and zoom out on click
function performZoomOperation(currPathEle, d) {
    var x, y, k;
    if (d && centered !== d) {        
        var centroid = findCentroid(currPathEle);
        x = centroid[0];
        y = centroid[1];
        k = 2;
        centered = d;

        g.transition()
            .duration(750)
            .attr("transform", "translate(" + WIDTH / 5 + "," + HEIGHT / 5 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
            .style("stroke-width", 1.5 / k + "px");
    } else {        
        x = WIDTH / 2;
        y = HEIGHT / 2;
        k = 1;
        centered = null;
        g.transition()
            .duration(750)
            .attr("transform", "translate(" + WIDTH / 2+ "," + HEIGHT / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
            .style("stroke-width", 1.5 / k + "px");
        $(".labels").show();
    }
}

function displayNeighbourhoods(currPathEle, d) {
    if(currPathEle.id == "CA.NB") {
        fileName = "neighbourhoods_NB.geojson"
        $.get('neighbourhoodsSVG_NB.svg', function(data) {
            console.log(data);
            // $('#text').html(data.replace('n',''));
         });
    }
    if(currPathEle.id == "CA.BC") {
        fileName = "neighbourhoods_BC.geojson"
    }
    console.log(fileName);

  
   
}