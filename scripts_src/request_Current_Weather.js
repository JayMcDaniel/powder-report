var requestCurrentWeather = function(resort_obj, callback){
    var callback = callback || function(){};
    
    var url = "http://api.openweathermap.org/data/2.5/weather?zip=" + resort_obj.contact_info.zip + ",us&units=Imperial&appid=cca701a02541072de8ae89206c9faee9";
        
    $.getJSON(url)
        .done(function (json) {
         callback(json, resort_obj);
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Request Failed: " + err);
        });
        
        
}