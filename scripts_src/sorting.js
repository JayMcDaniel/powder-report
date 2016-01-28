var printResorts = require("./print_Resorts.js");
var toggleWidgetDisplaySetup = require("./toggle_Widget_Display_setup.js");



/** set up the sort bar functionality */

var sorting = {
    
    //have a copy of the selected json and area in this object to use in sortResortsArray();
    selected_json: {},
    selected_area: {},
    
    setSelected: function(json, area){
        this.selected_json = json;
        this.selected_area = area;
    },
    
    
    
    

    //sorts resort json. called when sort link is clicked or region dropdown is changed
    sortResortsArray: function (sort_by, sort_order) {

        if (typeof sort_by === "undefined") {
            sort_by = this.cached ? this.cached.sort_by : "name";
        }
        if (typeof sort_order === "undefined") {
            sort_order = this.cached ? this.cached.sort_order : "desc";
        }

        
        var thisResortArray = this.selected_json[this.selected_area];
        if (sort_by === "name") {
            thisResortArray.sort(function (a, b) {
                return a[sort_by].localeCompare(b[sort_by]);
            });
        } else { //for numbered sorts in two levels

            var sort_spot = sort_by.split(".");

            thisResortArray.sort(function (a, b) {
                return a[sort_spot[0]][sort_spot[1]] - b[sort_spot[0]][sort_spot[1]];
            });

        }


        if (sort_order === "asc") {
            thisResortArray.reverse();
        }

        this.cached = {
            sort_order: sort_order,
            sort_by: sort_by
        }

       //rebuild resorts list on screen
            printResorts(this.selected_json, this.selected_area);
        // enable widget display links on each snippet
            toggleWidgetDisplaySetup();

    },
    
    

    //sort bar initializer - called when page loads
    sortBarInit: function () {

        $("#sort_bar .sort_link").click(function () {

            var clicked_sort = $(this);
            var sort_by = clicked_sort.attr("sort_by");
            var sort_order = clicked_sort.attr("sort_order");

            $("#sort_bar .sort_link_selected").removeClass("sort_link_selected");
            clicked_sort.addClass("sort_link_selected");


            //if ascending, make descending etc.

            var triangle = sort_order === "asc" ? "\u25BC" : "\u25B2";
            var new_sort_order = sort_order === "asc" ? "desc" : "asc";



            // sort the resorts array
            sorting.sortResortsArray(sort_by, sort_order);

            $(".sort_triangle", clicked_sort).text(triangle);

            clicked_sort.toggleClass("sort_order_asc sort_order_desc").attr("sort_order", new_sort_order);


        });
    }


}



module.exports = sorting;