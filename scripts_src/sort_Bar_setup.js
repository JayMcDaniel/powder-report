var printResorts = require("./print_Resorts.js");


/** set up the sort bar functionality */


var sortResortsArray = function (json, area, sort_by, sort_order) {

    if (sort_by === "name") {
        json[area].sort(function (a, b) {
            return a[sort_by].localeCompare(b[sort_by]);
        });
    } else { //for numbered sorts in two levels

        var sort_spot = sort_by.split(".");
        
        json[area].sort(function (a, b) {
            return a[sort_spot[0]][sort_spot[1]] - b[sort_spot[0]][sort_spot[1]];
        });
        
    }
    

    if (sort_order === "asc") {
        json[area].reverse();
    }

}


var sortBarSetup = function (json, area) {

    $("#sort_bar .sort_link").click(function () {

        var clicked_sort = $(this);
        var sort_by = clicked_sort.attr("sort_by");
        var sort_order = clicked_sort.attr("sort_order");

        $("#sort_bar .sort_link_selected").removeClass("sort_link_selected");
        clicked_sort.addClass("sort_link_selected");


        //if ascending, make descending etc.

        var triangle = sort_order === "asc" ? "\u25BC" : "\u25B2";
        var new_sort_order = sort_order === "asc" ? "desc" : "asc";

        $(".sort_triangle", clicked_sort).text(triangle);

        clicked_sort.toggleClass("sort_order_asc sort_order_desc").attr("sort_order", new_sort_order);

        // sort the resorts array
        sortResortsArray(json, area, sort_by, sort_order);

        //rebuild resorts list on screen
        printResorts(json, area);


    });
}

module.exports = sortBarSetup;