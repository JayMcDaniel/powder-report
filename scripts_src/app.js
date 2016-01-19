var loadResorts = require("./load_Resorts.js");
var printResorts = require("./print_Resorts.js");
var toggleWidgetDisplaySetup = require("./toggle_Widget_Display_setup.js");

$(document).ready(function(){
    
    loadResorts("DC", function(json, area){
        printResorts(json, area);
        toggleWidgetDisplaySetup();

    });
        
});