var loadResorts = require("./load_Resorts.js");
var printResorts = require("./print_Resorts.js");
var toggleWidgetDisplaySetup = require("./toggle_Widget_Display_setup.js");
var sorting = require("./sorting.js");
var area_selector = require("./area_selector.js");
var filterResortsSetup = require("./filter_Resorts_Setup.js");

$(document).ready(function () {

    var area = area_selector.pageLoad();

    /** get the resort json from selected area */
    loadResorts(area, function (json, area) {
        
        
        toggleWidgetDisplaySetup();
        sorting.setSelected(json, area);
        sorting.sortBarInit();
        sorting.sortResortsArray();
        
        printResorts(json, area);

        //initialize are dropdown menu;

        area_selector.dropdownInit();

    });


    filterResortsSetup();


});