

/** gets current weather conditions from openweathermap.org */

var requestCurrentWeather = function (resort_obj, parsed_address, callback) {


        var url = "http://api.openweathermap.org/data/2.5/weather?zip=" + parsed_address.zip + ",us&units=Imperial&appid=cca701a02541072de8ae89206c9faee9";
   
    $.getJSON(url)
        .done(function (json) {

            callback(json, resort_obj);
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
        });

}

module.exports = requestCurrentWeather;