var WIDTH = 2000
var HEIGHT = 2000
var centered;

var svg = d3.select("svg");
var g = d3.select("g");

var projection = d3.geo.albersUsa()
    .scale(1070)
    .translate([WIDTH / 2, HEIGHT / 2]);

var path = d3.geo.path()
    .projection(projection);

// Append Div for tooltip to SVG
var div = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.json("/canada-province.json", function (error, cp) {
    if (error) throw error;

    // Add the labels
    d3.selectAll('path') 
        .each(function (d) {
            svg.append("text")
                .attr("x", findCentroid(d3.select(this)[0][0])[0])
                .attr("y", findCentroid(d3.select(this)[0][0])[1])
                .text(d3.select(this)[0][0].id)
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "central")
                .style("font-size", 11)
                .style("fill", "white");
        });


    d3.selectAll("path")
        .data(cp.features)
        .on("mouseover", function (d) {
            d3.select(this).style('stroke', 'black');
        })

        // fade out tooltip on mouse out               
        .on("mouseout", function (d) {
            d3.select(this).style('stroke', '#46b5d6');
        })
        .on("click", clicked);
});

// $(document).ready( function() {
//     $('#CABC').css('fill', 'red')   
// });

function findCentroid(element) {
    var bbox = element.getBBox();
    return [bbox.x + bbox.width / 2, bbox.y + bbox.height / 2];
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