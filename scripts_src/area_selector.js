var loadResorts = require("./load_Resorts.js");
var printResorts = require("./print_Resorts.js");
var toggleWidgetDisplaySetup = require("./toggle_Widget_Display_setup.js");
var sorting = require("./sorting.js");


var area_selector = {

    pageLoad: function () {

        //look at initial page url and q string to get area

        var area = window.location.hash.slice(1) || "mid_atlantic";

        //set initial value of resort_selection_dropdown 
        $("#resort_selection_dropdown").val(area);

        return area;

    },

    dropdownInit: function () {
        $("#resort_selection_dropdown").change(function () {
            var area = $(this).val();
            window.location.hash = area;


            /** get the resort json from selected area */
            loadResorts(area, function (json, area) {
                sorting.setSelected(json, area);
                sorting.sortResortsArray(); //not supplying sort_by and sort_order to use function cache;
                

            });
        });
    }

}

module.exports = area_selector;