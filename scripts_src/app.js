$(document).ready(function(){
    
    loadResorts("DC", function(json, area){
        printResorts(json, area);
    });
    
    requestCurrentWeather("94040");
        
});