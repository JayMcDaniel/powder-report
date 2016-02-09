var loadResorts = require("./load_Resorts.js");
var printResorts = require("./print_Resorts.js");
var toggleWidgetDisplaySetup = require("./toggle_Widget_Display_setup.js");
var sorting = require("./sorting.js");
var area_selector = require("./area_selector.js");
var filterResortsSetup = require("./filter_Resorts_Setup.js");
var stickySortBarSetup = require("./sticky_SortBar_setup.js");


$(document).ready(function () {

    var area = area_selector.pageLoad();

    /** get the resort json from selected area */
    loadResorts(area, function (json, area) {
        
        
        printResorts(json, area);
        
        sorting.setSelected(json, area);
        sorting.sortBarInit();
        sorting.sortResortsArray();
        

        area_selector.dropdownInit();  //initialize are dropdown menu;

    });


    filterResortsSetup(); //inits the filter box
    stickySortBarSetup(); //sets up the sort bar sticking to the top when page is scrolled


});