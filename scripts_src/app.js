$(document).ready(function(){
    
    loadResorts("DC", function(json, area){
        printResorts(json, area);
        toggleWidgetDisplaySetup();

    });
        
});