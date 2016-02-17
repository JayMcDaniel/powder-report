/** gets current weather conditions from openweathermap.org */

var requestCurrentWeather = function (resort_obj, parsed_address, callback) {



    if (resort_obj.weather_json) { //used cached weather if available
        
        setTimeout(function(){
           callback(resort_obj.weather_json, resort_obj, parsed_address); 
        }, 100); //delay to let the snippet build first
        
        
    } else {


        var lat_lon = resort_obj.contact_info.lat_lon;

        lat_lon = lat_lon.split(",");
        var lat = lat_lon[0];
        var lon = $.trim(lat_lon[1]);
        //openweather
        // var url = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=Imperial&appid=cca701a02541072de8ae89206c9faee9";
        //noaa
        var url = "http://forecast.weather.gov/MapClick.php?lat=" + lat + "&lon=" + lon + "&FcstType=json";




        $.getJSON(url)
            .done(function (json) {

                resort_obj.weather_json = json; //cache the weather json

                callback(json, resort_obj, parsed_address);

                // console.log(json);
            })
            .fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
            });

    }

}

module.exports = requestCurrentWeather;