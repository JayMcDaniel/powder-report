var loadResorts = require("./load_Resorts.js");
var printResorts = require("./print_Resorts.js");
var toggleWidgetDisplaySetup = require("./toggle_Widget_Display_setup.js");
var sortBarSetup = require("./sort_Bar_setup.js");

$(document).ready(function(){
    
    /** get the resort json from selected area */
    loadResorts("DC", function(json, area){
        
        printResorts(json, area);
        toggleWidgetDisplaySetup();
        sortBarSetup(json, area);

    });
    
    
    
    
        
});