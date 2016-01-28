(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./area_selector.js":2,"./filter_Resorts_Setup.js":4,"./load_Resorts.js":6,"./print_Resorts.js":7,"./sorting.js":9,"./toggle_Widget_Display_setup.js":10}],2:[function(require,module,exports){
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
                
                toggleWidgetDisplaySetup();


            });
        });
    }

}

module.exports = area_selector;
},{"./load_Resorts.js":6,"./print_Resorts.js":7,"./sorting.js":9,"./toggle_Widget_Display_setup.js":10}],3:[function(require,module,exports){
var utils = require('./utils.js');
/** builds html from _resorts.json and returns it as a .resort_snippet div*/

var buildResortBriefDiv = function (resort_obj, parsed_address) {
    


    var name_and_logo = "<a class = 'resort_name' target ='_blank' href ='" + utils.urlFormat(resort_obj.contact_info.url) + "'><h3><img class ='resort_logo_img' src = 'images/resort_logos/" + resort_obj.images.logo + "'/>" + resort_obj.name + " <span class='resort_state'>" + parsed_address.state + "</span></h3></a>";

    var trails = "<span class = 'trails report'>" + resort_obj.stats.trails + "&nbsp;trails </span>";

    var lifts = "<span class = 'lifts report'>" + resort_obj.stats.lifts + "&nbsp;lifts </span>";

    var acres = "<span class = 'acres report'>" + utils.addCommas(resort_obj.stats.skiable_acres) + "&nbsp;acres</span>";
    
    var peak = "<span class = 'peak report'>" + utils.addCommas(resort_obj.stats.peak) + "'&nbsp;peak</span>";

    var vert = "<span class = 'vert report'>" + utils.addCommas(resort_obj.stats.vertical_drop_ft) + "'&nbsp;vertical&nbsp;drop</span>";

    var full_address = "<a target ='_blank' href ='" + resort_obj.contact_info.address_url + "'><span class = 'full_address'>" + parsed_address.full_address + "</span></a> ";

    var rates = "Rates (midweek or discount / weekend or prime): <span class = 'rates_adult report'>Adult:&nbsp;$" + resort_obj.rates.adults_midweek + "&nbsp;/&nbsp;$" + resort_obj.rates.adults_prime + "&nbsp;</span>\
                <span class = 'rates_junior report'>Junior:&nbsp;$" + resort_obj.rates.juniors_midweek + "&nbsp;/&nbsp;$" + resort_obj.rates.juniors_prime + "</span> <a class = 'rates_url' target ='_blank' href ='" + resort_obj.rates.rates_url + "'>Get tickets</a>";

    var phone = "<span class ='resort_phone_number'>" + utils.phoneFormat(resort_obj.contact_info.phone) + "</span>";


    var toggle_widget_link = "<span class = 'toggle_widget_link report' widget_link = " + resort_obj.stats.widget_link + ">show current stats</span>"

    var map_thumbnail = "<div class='map_thumbnail'> <a target ='_blank' href='images/resort_maps/" + resort_obj.images.map + "'><img src='images/resort_maps/" + utils.thumbnailName(resort_obj.images.map) + "'/></a></div>";


    var snippet = "<div class='resort_snippet' id ='" + resort_obj.id + "' >" + name_and_logo + "\
        " + map_thumbnail + "<div class='resort_snippet_text'>\
        <span class='stats_report'>" + trails + lifts + acres + peak + vert + "</span><br/>\
        " + rates + "<br><p class='contact_info'>\
        " + full_address + phone + "</p>\
        " + toggle_widget_link + "</div>\
            <div class='clear_float'></div>\
        </div>";



    return snippet;
}

module.exports = buildResortBriefDiv;
},{"./utils.js":11}],4:[function(require,module,exports){
/** sets up the filter_resorts search box to display only the resort snippets that user types in */

var filterResortsSetup = function filterResortsSetup(){
    var $filter_input = $( "#filter_resorts" );
    
    
$filter_input.keyup(function() {
    var filter_id = $(this).val().toLowerCase().replace(/\s+/i,"_").replace(/\.+/i,"");
    if (filter_id === ""){
        $(".resort_snippet").show();
    }else{
        $(".resort_snippet").hide();
        $( "[id*='" + filter_id + "']" ).show();
    }

});

}

module.exports = filterResortsSetup;
},{}],5:[function(require,module,exports){
var utils = require("./utils.js");

/** builds html from weather json and inserts weather report span */

var insertCurrentWeather = function (json, resort_obj, parsed_address) {
    

    $("#" + resort_obj.id + " .weather_report").remove();

    var weather_report = document.createElement("p");
    weather_report.className = "weather_report";

    var icon = document.createElement("img");
    icon.className = "weather_icon";
    icon.src = "http://openweathermap.org/img/w/" + json.weather[0].icon + ".png";

    var description = document.createElement("span");
    description.className = "weather_description";
    description.textContent = utils.weatherDescriptor(json.weather[0].description) + " ";

    var temp = document.createElement("span");
    temp.className = "weather_temp";
    temp.textContent = json.main.temp.toFixed(1) + "\u2109 "; //symbol for degrees F

    var wind_speed = document.createElement("span");
    wind_speed.className = "weather_wind_speed";
    wind_speed.textContent = "wind:\u00a0" + json.wind.speed.toFixed(1) + "\u00a0mph";

    var five_day_forcast_span = document.createElement("span");
    var five_day_forcast_link = document.createElement("a");
    five_day_forcast_link.className = "five_day_forcast_link";
    five_day_forcast_link.textContent = "5\u2011day\u00A0forcast";

    //if more accurate weather link is available, use that instead of zip code
    if (typeof resort_obj.weather_forcast_url != "undefined" && resort_obj.weather_forcast_url.length > 0) {
        five_day_forcast_link.href = resort_obj.weather_forcast_url;

    } else {
        five_day_forcast_link.href = "http://www.weather.com/weather/5day/l/" + parsed_address.zip + ":4:US";
    }


    five_day_forcast_link.target = "_blank";
    five_day_forcast_span.appendChild(five_day_forcast_link);




    weather_report.appendChild(icon);
    weather_report.appendChild(description);
    weather_report.appendChild(temp);
    weather_report.appendChild(wind_speed);
    weather_report.appendChild(five_day_forcast_span);

    $(weather_report).insertBefore($("#" + resort_obj.id + " .toggle_widget_link"));



}


module.exports = insertCurrentWeather;
},{"./utils.js":11}],6:[function(require,module,exports){
/** gets static resort condition from .json file */

var loadResorts = function (area, callback) {

    var file = "json/" + area + "_resorts.json";

    $.getJSON(file)
        .done(function (json) {
            callback(json, area);
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Request Failed: " + err);
        });

}

module.exports = loadResorts;
},{}],7:[function(require,module,exports){
var buildResortBriefDiv = require("./build_Resort_Brief_Div.js");
var requestCurrentWeather = require("./request_Current_Weather.js");
var insertCurrentWeather = require("./insert_Current_Weather.js");
var utils = require("./utils.js");

/** calls builder and inserts new resort snippets on page */

var printResorts = function (json, area) {
    
    $(".region_selected").text(area.toUpperCase().replace(/_/g," "));
    
    
    var resorts_results_div = document.getElementById("resorts_results_div");

    var resorts_arr = json[area];
    var allResorts = "";
    for (var i = 0, len = resorts_arr.length; i < len; i++) {

        resorts_arr[i].id = resorts_arr[i].name.toLowerCase().replace(/ /g, "_").replace(/\./g, "");
        
        var parsed_address = utils.parseAddress(resorts_arr[i]);
        
        var resort_brief_div = buildResortBriefDiv(resorts_arr[i], parsed_address);
        allResorts = allResorts + resort_brief_div;

        requestCurrentWeather(resorts_arr[i], parsed_address, function (json, name) {
            insertCurrentWeather(json, name, parsed_address);
        });
    }
    //insert all resorts on page
    resorts_results_div.innerHTML = allResorts;
    
}


module.exports = printResorts;
},{"./build_Resort_Brief_Div.js":3,"./insert_Current_Weather.js":5,"./request_Current_Weather.js":8,"./utils.js":11}],8:[function(require,module,exports){
/** gets current weather conditions from openweathermap.org */

var requestCurrentWeather = function (resort_obj, parsed_address, callback) {

    var lat_lon = resort_obj.contact_info.lat_lon;
    if (lat_lon.length > 0) {
        lat_lon = lat_lon.split(",");
        var lat = lat_lon[0];
        var lon = $.trim(lat_lon[1]);
        var url = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=Imperial&appid=cca701a02541072de8ae89206c9faee9";

    } else {
        var url = "http://api.openweathermap.org/data/2.5/weather?zip=" + parsed_address.zip + ",us&units=Imperial&appid=cca701a02541072de8ae89206c9faee9";


    }


    $.getJSON(url)
        .done(function (json) {
            callback(json, resort_obj);
//        console.log(json);
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
        });

}

module.exports = requestCurrentWeather;
},{}],9:[function(require,module,exports){
var printResorts = require("./print_Resorts.js");
var toggleWidgetDisplaySetup = require("./toggle_Widget_Display_setup.js");
var utils = require("./utils.js");



/** set up the sort bar functionality */

var sorting = {

    //have a copy of the selected json and area in this object to use in sortResortsArray();
    selected_json: {},
    selected_area: {},

    setSelected: function (json, area) {
        this.selected_json = json;
        this.selected_area = area;
    },





    //sorts resort json. called when sort link is clicked or region dropdown is changed
    sortResortsArray: function (sort_by, sort_order) {

        if (typeof sort_by === "undefined") {
            sort_by = this.cached ? this.cached.sort_by : "name";
        }
        if (typeof sort_order === "undefined") {
            sort_order = this.cached ? this.cached.sort_order : "desc";
        }


        var thisResortArray = this.selected_json[this.selected_area];

        //sort by name

        if (sort_by === "name") {
            thisResortArray.sort(function (a, b) {
                return a[sort_by].localeCompare(b[sort_by]);
            });
            
        //sort by state

        } else if (sort_by === "state") {

            thisResortArray.sort(function (a, b) {

                return utils.parseAddress(a).state.localeCompare(utils.parseAddress(b).state);
            });


        } else { //for numbered sorts in two levels

            var sort_spot = sort_by.split(".");

            thisResortArray.sort(function (a, b) {
                return a[sort_spot[0]][sort_spot[1]] - b[sort_spot[0]][sort_spot[1]];
            });

        }


        if (sort_order === "asc") {
            thisResortArray.reverse();
        }

        this.cached = {
            sort_order: sort_order,
            sort_by: sort_by
        }

        //rebuild resorts list on screen
        printResorts(this.selected_json, this.selected_area);
        // enable widget display links on each snippet
        toggleWidgetDisplaySetup();

    },



    //sort bar initializer - called when page loads
    sortBarInit: function () {

        $("#sort_bar .sort_link").click(function () {

            var clicked_sort = $(this);
            var sort_by = clicked_sort.attr("sort_by");
            var sort_order = clicked_sort.attr("sort_order");

            $("#sort_bar .sort_link_selected").removeClass("sort_link_selected");
            clicked_sort.addClass("sort_link_selected");


            //if ascending, make descending etc.

            var triangle = sort_order === "asc" ? "\u25BC" : "\u25B2";
            var new_sort_order = sort_order === "asc" ? "desc" : "asc";



            // sort the resorts array
            sorting.sortResortsArray(sort_by, sort_order);

            $(".sort_triangle", clicked_sort).text(triangle);

            clicked_sort.toggleClass("sort_order_asc sort_order_desc").attr("sort_order", new_sort_order);


        });
    }


}



module.exports = sorting;
},{"./print_Resorts.js":7,"./toggle_Widget_Display_setup.js":10,"./utils.js":11}],10:[function(require,module,exports){
/** when "more" link is clicked, gets widget for that resort and appends it to resort snippet */

var toggleWidgetDisplaySetup = function(){
    
    $(".toggle_widget_link").click(function(){    
        
        if ($(this).text() === "show current stats"){
            
            var conditions_widget_container = document.createElement("div");
                conditions_widget_container.className = "conditions_widget_container";
            
            var conditions_widget_snowcountry_link = document.createElement("a");
                conditions_widget_snowcountry_link.className = "conditions_widget_snowcountry_link";
                conditions_widget_snowcountry_link.textContent ="Powered by www.snocountry.com";
                conditions_widget_snowcountry_link.href = "http://www.snocountry.com";
                conditions_widget_snowcountry_link.target = "_blank";
            
            
            var conditions_widget = document.createElement("iframe");
                conditions_widget.className = "conditions_widget";
                conditions_widget.src = $(this).attr("widget_link");
                conditions_widget.height = "280";
                conditions_widget.width = "590";
                conditions_widget.seamless= "seamless";
                conditions_widget.frameBorder="0";
                conditions_widget.scrolling = "no";
            
            
            conditions_widget_container.appendChild(conditions_widget_snowcountry_link);
            conditions_widget_container.appendChild(conditions_widget);
            
            
            $(this).text("hide current stats")
                .closest(".resort_snippet").append(conditions_widget_container);
                
        }else{
            $(this).text("show current stats")
                .closest(".resort_snippet").find(".conditions_widget_container").remove();
            
        }
       
        
    });
    
    
}


module.exports = toggleWidgetDisplaySetup;
},{}],11:[function(require,module,exports){
      var utils = {

          /** add commas function */
          addCommas: function (val) {

              if (isNaN(val)) {
                  return val;
              } else if ((val > 999) || (val < -999)) {
                  while (/(\d+)(\d{3})/.test(val.toString())) {
                      val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
                  }
              }
              return val;
          },

          /** return _sm for image name */
          thumbnailName: function (image_name) {
              return image_name.replace('.png', '_sm.png').replace('.jpg', '_sm.jpg').replace('.jpeg', '_sm.jpeg').replace('.pdf', '_sm.png');
          },

          /** return modded language for weather description */
          weatherDescriptor: function (string) {
              return string.replace("overcast clouds", "overcast").replace("sky is clear", "clear skies");
          },

          phoneFormat: function (string) {
              return string.replace(/\(|\)/g, "").replace(/-| /g, "&#8209;");
          },


          parseAddress: function (resort_obj) {
              var parsed_address = {};

              //if parts are there, use those
              parsed_address.street_adress = resort_obj.contact_info.street_address || "";
              parsed_address.city = resort_obj.contact_info.city || "";
              parsed_address.state = resort_obj.contact_info.state || "";
              parsed_address.zip = resort_obj.contact_info.zip || "";

              //full address uses full if its there, or a combination if it's not
              parsed_address.full_address = resort_obj.contact_info.full_address || resort_obj.contact_info.street_address + ", " + resort_obj.contact_info.city + ", " + resort_obj.contact_info.state + " " + resort_obj.contact_info.zip;

              //if full address is there, parse it for parts of the address
              if (typeof resort_obj.contact_info.full_address !== "undefined") {
                  var address_arr = resort_obj.contact_info.full_address.split(",");

                  parsed_address.zip = address_arr[address_arr.length - 1].slice(3);
                  parsed_address.state = address_arr[address_arr.length - 1].slice(1, 3);
                  parsed_address.city = address_arr[address_arr.length - 2];
                  parsed_address.street_adress = address_arr.slice(0, address_arr.length - 2).join(",");

              }

              return parsed_address;

          },
          

          urlFormat: function (string) {
              if (string.slice(0, 3) === "www") {
                  string = "http://" + string;
              }
              return string;
          }

      }


      module.exports = utils;
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzX3NyYy9hcHAuanMiLCJzY3JpcHRzX3NyYy9hcmVhX3NlbGVjdG9yLmpzIiwic2NyaXB0c19zcmMvYnVpbGRfUmVzb3J0X0JyaWVmX0Rpdi5qcyIsInNjcmlwdHNfc3JjL2ZpbHRlcl9SZXNvcnRzX1NldHVwLmpzIiwic2NyaXB0c19zcmMvaW5zZXJ0X0N1cnJlbnRfV2VhdGhlci5qcyIsInNjcmlwdHNfc3JjL2xvYWRfUmVzb3J0cy5qcyIsInNjcmlwdHNfc3JjL3ByaW50X1Jlc29ydHMuanMiLCJzY3JpcHRzX3NyYy9yZXF1ZXN0X0N1cnJlbnRfV2VhdGhlci5qcyIsInNjcmlwdHNfc3JjL3NvcnRpbmcuanMiLCJzY3JpcHRzX3NyYy90b2dnbGVfV2lkZ2V0X0Rpc3BsYXlfc2V0dXAuanMiLCJzY3JpcHRzX3NyYy91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBsb2FkUmVzb3J0cyA9IHJlcXVpcmUoXCIuL2xvYWRfUmVzb3J0cy5qc1wiKTtcbnZhciBwcmludFJlc29ydHMgPSByZXF1aXJlKFwiLi9wcmludF9SZXNvcnRzLmpzXCIpO1xudmFyIHRvZ2dsZVdpZGdldERpc3BsYXlTZXR1cCA9IHJlcXVpcmUoXCIuL3RvZ2dsZV9XaWRnZXRfRGlzcGxheV9zZXR1cC5qc1wiKTtcbnZhciBzb3J0aW5nID0gcmVxdWlyZShcIi4vc29ydGluZy5qc1wiKTtcbnZhciBhcmVhX3NlbGVjdG9yID0gcmVxdWlyZShcIi4vYXJlYV9zZWxlY3Rvci5qc1wiKTtcbnZhciBmaWx0ZXJSZXNvcnRzU2V0dXAgPSByZXF1aXJlKFwiLi9maWx0ZXJfUmVzb3J0c19TZXR1cC5qc1wiKTtcblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIGFyZWEgPSBhcmVhX3NlbGVjdG9yLnBhZ2VMb2FkKCk7XG5cbiAgICAvKiogZ2V0IHRoZSByZXNvcnQganNvbiBmcm9tIHNlbGVjdGVkIGFyZWEgKi9cbiAgICBsb2FkUmVzb3J0cyhhcmVhLCBmdW5jdGlvbiAoanNvbiwgYXJlYSkge1xuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIHRvZ2dsZVdpZGdldERpc3BsYXlTZXR1cCgpO1xuICAgICAgICBzb3J0aW5nLnNldFNlbGVjdGVkKGpzb24sIGFyZWEpO1xuICAgICAgICBzb3J0aW5nLnNvcnRCYXJJbml0KCk7XG4gICAgICAgIHNvcnRpbmcuc29ydFJlc29ydHNBcnJheSgpO1xuICAgICAgICBcbiAgICAgICAgcHJpbnRSZXNvcnRzKGpzb24sIGFyZWEpO1xuXG4gICAgICAgIC8vaW5pdGlhbGl6ZSBhcmUgZHJvcGRvd24gbWVudTtcblxuICAgICAgICBhcmVhX3NlbGVjdG9yLmRyb3Bkb3duSW5pdCgpO1xuXG4gICAgfSk7XG5cblxuICAgIGZpbHRlclJlc29ydHNTZXR1cCgpO1xuXG5cbn0pOyIsInZhciBsb2FkUmVzb3J0cyA9IHJlcXVpcmUoXCIuL2xvYWRfUmVzb3J0cy5qc1wiKTtcbnZhciBwcmludFJlc29ydHMgPSByZXF1aXJlKFwiLi9wcmludF9SZXNvcnRzLmpzXCIpO1xudmFyIHRvZ2dsZVdpZGdldERpc3BsYXlTZXR1cCA9IHJlcXVpcmUoXCIuL3RvZ2dsZV9XaWRnZXRfRGlzcGxheV9zZXR1cC5qc1wiKTtcbnZhciBzb3J0aW5nID0gcmVxdWlyZShcIi4vc29ydGluZy5qc1wiKTtcblxuXG52YXIgYXJlYV9zZWxlY3RvciA9IHtcblxuICAgIHBhZ2VMb2FkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgLy9sb29rIGF0IGluaXRpYWwgcGFnZSB1cmwgYW5kIHEgc3RyaW5nIHRvIGdldCBhcmVhXG5cbiAgICAgICAgdmFyIGFyZWEgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zbGljZSgxKSB8fCBcIm1pZF9hdGxhbnRpY1wiO1xuXG4gICAgICAgIC8vc2V0IGluaXRpYWwgdmFsdWUgb2YgcmVzb3J0X3NlbGVjdGlvbl9kcm9wZG93biBcbiAgICAgICAgJChcIiNyZXNvcnRfc2VsZWN0aW9uX2Ryb3Bkb3duXCIpLnZhbChhcmVhKTtcblxuICAgICAgICByZXR1cm4gYXJlYTtcblxuICAgIH0sXG5cbiAgICBkcm9wZG93bkluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJChcIiNyZXNvcnRfc2VsZWN0aW9uX2Ryb3Bkb3duXCIpLmNoYW5nZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYXJlYSA9ICQodGhpcykudmFsKCk7XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IGFyZWE7XG5cblxuICAgICAgICAgICAgLyoqIGdldCB0aGUgcmVzb3J0IGpzb24gZnJvbSBzZWxlY3RlZCBhcmVhICovXG4gICAgICAgICAgICBsb2FkUmVzb3J0cyhhcmVhLCBmdW5jdGlvbiAoanNvbiwgYXJlYSkge1xuICAgICAgICAgICAgICAgIHNvcnRpbmcuc2V0U2VsZWN0ZWQoanNvbiwgYXJlYSk7XG4gICAgICAgICAgICAgICAgc29ydGluZy5zb3J0UmVzb3J0c0FycmF5KCk7IC8vbm90IHN1cHBseWluZyBzb3J0X2J5IGFuZCBzb3J0X29yZGVyIHRvIHVzZSBmdW5jdGlvbiBjYWNoZTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0b2dnbGVXaWRnZXREaXNwbGF5U2V0dXAoKTtcblxuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJlYV9zZWxlY3RvcjsiLCJ2YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzLmpzJyk7XG4vKiogYnVpbGRzIGh0bWwgZnJvbSBfcmVzb3J0cy5qc29uIGFuZCByZXR1cm5zIGl0IGFzIGEgLnJlc29ydF9zbmlwcGV0IGRpdiovXG5cbnZhciBidWlsZFJlc29ydEJyaWVmRGl2ID0gZnVuY3Rpb24gKHJlc29ydF9vYmosIHBhcnNlZF9hZGRyZXNzKSB7XG4gICAgXG5cblxuICAgIHZhciBuYW1lX2FuZF9sb2dvID0gXCI8YSBjbGFzcyA9ICdyZXNvcnRfbmFtZScgdGFyZ2V0ID0nX2JsYW5rJyBocmVmID0nXCIgKyB1dGlscy51cmxGb3JtYXQocmVzb3J0X29iai5jb250YWN0X2luZm8udXJsKSArIFwiJz48aDM+PGltZyBjbGFzcyA9J3Jlc29ydF9sb2dvX2ltZycgc3JjID0gJ2ltYWdlcy9yZXNvcnRfbG9nb3MvXCIgKyByZXNvcnRfb2JqLmltYWdlcy5sb2dvICsgXCInLz5cIiArIHJlc29ydF9vYmoubmFtZSArIFwiIDxzcGFuIGNsYXNzPSdyZXNvcnRfc3RhdGUnPlwiICsgcGFyc2VkX2FkZHJlc3Muc3RhdGUgKyBcIjwvc3Bhbj48L2gzPjwvYT5cIjtcblxuICAgIHZhciB0cmFpbHMgPSBcIjxzcGFuIGNsYXNzID0gJ3RyYWlscyByZXBvcnQnPlwiICsgcmVzb3J0X29iai5zdGF0cy50cmFpbHMgKyBcIiZuYnNwO3RyYWlscyA8L3NwYW4+XCI7XG5cbiAgICB2YXIgbGlmdHMgPSBcIjxzcGFuIGNsYXNzID0gJ2xpZnRzIHJlcG9ydCc+XCIgKyByZXNvcnRfb2JqLnN0YXRzLmxpZnRzICsgXCImbmJzcDtsaWZ0cyA8L3NwYW4+XCI7XG5cbiAgICB2YXIgYWNyZXMgPSBcIjxzcGFuIGNsYXNzID0gJ2FjcmVzIHJlcG9ydCc+XCIgKyB1dGlscy5hZGRDb21tYXMocmVzb3J0X29iai5zdGF0cy5za2lhYmxlX2FjcmVzKSArIFwiJm5ic3A7YWNyZXM8L3NwYW4+XCI7XG4gICAgXG4gICAgdmFyIHBlYWsgPSBcIjxzcGFuIGNsYXNzID0gJ3BlYWsgcmVwb3J0Jz5cIiArIHV0aWxzLmFkZENvbW1hcyhyZXNvcnRfb2JqLnN0YXRzLnBlYWspICsgXCInJm5ic3A7cGVhazwvc3Bhbj5cIjtcblxuICAgIHZhciB2ZXJ0ID0gXCI8c3BhbiBjbGFzcyA9ICd2ZXJ0IHJlcG9ydCc+XCIgKyB1dGlscy5hZGRDb21tYXMocmVzb3J0X29iai5zdGF0cy52ZXJ0aWNhbF9kcm9wX2Z0KSArIFwiJyZuYnNwO3ZlcnRpY2FsJm5ic3A7ZHJvcDwvc3Bhbj5cIjtcblxuICAgIHZhciBmdWxsX2FkZHJlc3MgPSBcIjxhIHRhcmdldCA9J19ibGFuaycgaHJlZiA9J1wiICsgcmVzb3J0X29iai5jb250YWN0X2luZm8uYWRkcmVzc191cmwgKyBcIic+PHNwYW4gY2xhc3MgPSAnZnVsbF9hZGRyZXNzJz5cIiArIHBhcnNlZF9hZGRyZXNzLmZ1bGxfYWRkcmVzcyArIFwiPC9zcGFuPjwvYT4gXCI7XG5cbiAgICB2YXIgcmF0ZXMgPSBcIlJhdGVzIChtaWR3ZWVrIG9yIGRpc2NvdW50IC8gd2Vla2VuZCBvciBwcmltZSk6IDxzcGFuIGNsYXNzID0gJ3JhdGVzX2FkdWx0IHJlcG9ydCc+QWR1bHQ6Jm5ic3A7JFwiICsgcmVzb3J0X29iai5yYXRlcy5hZHVsdHNfbWlkd2VlayArIFwiJm5ic3A7LyZuYnNwOyRcIiArIHJlc29ydF9vYmoucmF0ZXMuYWR1bHRzX3ByaW1lICsgXCImbmJzcDs8L3NwYW4+XFxcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcyA9ICdyYXRlc19qdW5pb3IgcmVwb3J0Jz5KdW5pb3I6Jm5ic3A7JFwiICsgcmVzb3J0X29iai5yYXRlcy5qdW5pb3JzX21pZHdlZWsgKyBcIiZuYnNwOy8mbmJzcDskXCIgKyByZXNvcnRfb2JqLnJhdGVzLmp1bmlvcnNfcHJpbWUgKyBcIjwvc3Bhbj4gPGEgY2xhc3MgPSAncmF0ZXNfdXJsJyB0YXJnZXQgPSdfYmxhbmsnIGhyZWYgPSdcIiArIHJlc29ydF9vYmoucmF0ZXMucmF0ZXNfdXJsICsgXCInPkdldCB0aWNrZXRzPC9hPlwiO1xuXG4gICAgdmFyIHBob25lID0gXCI8c3BhbiBjbGFzcyA9J3Jlc29ydF9waG9uZV9udW1iZXInPlwiICsgdXRpbHMucGhvbmVGb3JtYXQocmVzb3J0X29iai5jb250YWN0X2luZm8ucGhvbmUpICsgXCI8L3NwYW4+XCI7XG5cblxuICAgIHZhciB0b2dnbGVfd2lkZ2V0X2xpbmsgPSBcIjxzcGFuIGNsYXNzID0gJ3RvZ2dsZV93aWRnZXRfbGluayByZXBvcnQnIHdpZGdldF9saW5rID0gXCIgKyByZXNvcnRfb2JqLnN0YXRzLndpZGdldF9saW5rICsgXCI+c2hvdyBjdXJyZW50IHN0YXRzPC9zcGFuPlwiXG5cbiAgICB2YXIgbWFwX3RodW1ibmFpbCA9IFwiPGRpdiBjbGFzcz0nbWFwX3RodW1ibmFpbCc+IDxhIHRhcmdldCA9J19ibGFuaycgaHJlZj0naW1hZ2VzL3Jlc29ydF9tYXBzL1wiICsgcmVzb3J0X29iai5pbWFnZXMubWFwICsgXCInPjxpbWcgc3JjPSdpbWFnZXMvcmVzb3J0X21hcHMvXCIgKyB1dGlscy50aHVtYm5haWxOYW1lKHJlc29ydF9vYmouaW1hZ2VzLm1hcCkgKyBcIicvPjwvYT48L2Rpdj5cIjtcblxuXG4gICAgdmFyIHNuaXBwZXQgPSBcIjxkaXYgY2xhc3M9J3Jlc29ydF9zbmlwcGV0JyBpZCA9J1wiICsgcmVzb3J0X29iai5pZCArIFwiJyA+XCIgKyBuYW1lX2FuZF9sb2dvICsgXCJcXFxuICAgICAgICBcIiArIG1hcF90aHVtYm5haWwgKyBcIjxkaXYgY2xhc3M9J3Jlc29ydF9zbmlwcGV0X3RleHQnPlxcXG4gICAgICAgIDxzcGFuIGNsYXNzPSdzdGF0c19yZXBvcnQnPlwiICsgdHJhaWxzICsgbGlmdHMgKyBhY3JlcyArIHBlYWsgKyB2ZXJ0ICsgXCI8L3NwYW4+PGJyLz5cXFxuICAgICAgICBcIiArIHJhdGVzICsgXCI8YnI+PHAgY2xhc3M9J2NvbnRhY3RfaW5mbyc+XFxcbiAgICAgICAgXCIgKyBmdWxsX2FkZHJlc3MgKyBwaG9uZSArIFwiPC9wPlxcXG4gICAgICAgIFwiICsgdG9nZ2xlX3dpZGdldF9saW5rICsgXCI8L2Rpdj5cXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz0nY2xlYXJfZmxvYXQnPjwvZGl2PlxcXG4gICAgICAgIDwvZGl2PlwiO1xuXG5cblxuICAgIHJldHVybiBzbmlwcGV0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJ1aWxkUmVzb3J0QnJpZWZEaXY7IiwiLyoqIHNldHMgdXAgdGhlIGZpbHRlcl9yZXNvcnRzIHNlYXJjaCBib3ggdG8gZGlzcGxheSBvbmx5IHRoZSByZXNvcnQgc25pcHBldHMgdGhhdCB1c2VyIHR5cGVzIGluICovXG5cbnZhciBmaWx0ZXJSZXNvcnRzU2V0dXAgPSBmdW5jdGlvbiBmaWx0ZXJSZXNvcnRzU2V0dXAoKXtcbiAgICB2YXIgJGZpbHRlcl9pbnB1dCA9ICQoIFwiI2ZpbHRlcl9yZXNvcnRzXCIgKTtcbiAgICBcbiAgICBcbiRmaWx0ZXJfaW5wdXQua2V5dXAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGZpbHRlcl9pZCA9ICQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9cXHMrL2ksXCJfXCIpLnJlcGxhY2UoL1xcLisvaSxcIlwiKTtcbiAgICBpZiAoZmlsdGVyX2lkID09PSBcIlwiKXtcbiAgICAgICAgJChcIi5yZXNvcnRfc25pcHBldFwiKS5zaG93KCk7XG4gICAgfWVsc2V7XG4gICAgICAgICQoXCIucmVzb3J0X3NuaXBwZXRcIikuaGlkZSgpO1xuICAgICAgICAkKCBcIltpZCo9J1wiICsgZmlsdGVyX2lkICsgXCInXVwiICkuc2hvdygpO1xuICAgIH1cblxufSk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmaWx0ZXJSZXNvcnRzU2V0dXA7IiwidmFyIHV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMuanNcIik7XG5cbi8qKiBidWlsZHMgaHRtbCBmcm9tIHdlYXRoZXIganNvbiBhbmQgaW5zZXJ0cyB3ZWF0aGVyIHJlcG9ydCBzcGFuICovXG5cbnZhciBpbnNlcnRDdXJyZW50V2VhdGhlciA9IGZ1bmN0aW9uIChqc29uLCByZXNvcnRfb2JqLCBwYXJzZWRfYWRkcmVzcykge1xuICAgIFxuXG4gICAgJChcIiNcIiArIHJlc29ydF9vYmouaWQgKyBcIiAud2VhdGhlcl9yZXBvcnRcIikucmVtb3ZlKCk7XG5cbiAgICB2YXIgd2VhdGhlcl9yZXBvcnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICB3ZWF0aGVyX3JlcG9ydC5jbGFzc05hbWUgPSBcIndlYXRoZXJfcmVwb3J0XCI7XG5cbiAgICB2YXIgaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gICAgaWNvbi5jbGFzc05hbWUgPSBcIndlYXRoZXJfaWNvblwiO1xuICAgIGljb24uc3JjID0gXCJodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2ltZy93L1wiICsganNvbi53ZWF0aGVyWzBdLmljb24gKyBcIi5wbmdcIjtcblxuICAgIHZhciBkZXNjcmlwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgIGRlc2NyaXB0aW9uLmNsYXNzTmFtZSA9IFwid2VhdGhlcl9kZXNjcmlwdGlvblwiO1xuICAgIGRlc2NyaXB0aW9uLnRleHRDb250ZW50ID0gdXRpbHMud2VhdGhlckRlc2NyaXB0b3IoanNvbi53ZWF0aGVyWzBdLmRlc2NyaXB0aW9uKSArIFwiIFwiO1xuXG4gICAgdmFyIHRlbXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICB0ZW1wLmNsYXNzTmFtZSA9IFwid2VhdGhlcl90ZW1wXCI7XG4gICAgdGVtcC50ZXh0Q29udGVudCA9IGpzb24ubWFpbi50ZW1wLnRvRml4ZWQoMSkgKyBcIlxcdTIxMDkgXCI7IC8vc3ltYm9sIGZvciBkZWdyZWVzIEZcblxuICAgIHZhciB3aW5kX3NwZWVkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgd2luZF9zcGVlZC5jbGFzc05hbWUgPSBcIndlYXRoZXJfd2luZF9zcGVlZFwiO1xuICAgIHdpbmRfc3BlZWQudGV4dENvbnRlbnQgPSBcIndpbmQ6XFx1MDBhMFwiICsganNvbi53aW5kLnNwZWVkLnRvRml4ZWQoMSkgKyBcIlxcdTAwYTBtcGhcIjtcblxuICAgIHZhciBmaXZlX2RheV9mb3JjYXN0X3NwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICB2YXIgZml2ZV9kYXlfZm9yY2FzdF9saW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgZml2ZV9kYXlfZm9yY2FzdF9saW5rLmNsYXNzTmFtZSA9IFwiZml2ZV9kYXlfZm9yY2FzdF9saW5rXCI7XG4gICAgZml2ZV9kYXlfZm9yY2FzdF9saW5rLnRleHRDb250ZW50ID0gXCI1XFx1MjAxMWRheVxcdTAwQTBmb3JjYXN0XCI7XG5cbiAgICAvL2lmIG1vcmUgYWNjdXJhdGUgd2VhdGhlciBsaW5rIGlzIGF2YWlsYWJsZSwgdXNlIHRoYXQgaW5zdGVhZCBvZiB6aXAgY29kZVxuICAgIGlmICh0eXBlb2YgcmVzb3J0X29iai53ZWF0aGVyX2ZvcmNhc3RfdXJsICE9IFwidW5kZWZpbmVkXCIgJiYgcmVzb3J0X29iai53ZWF0aGVyX2ZvcmNhc3RfdXJsLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZml2ZV9kYXlfZm9yY2FzdF9saW5rLmhyZWYgPSByZXNvcnRfb2JqLndlYXRoZXJfZm9yY2FzdF91cmw7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICBmaXZlX2RheV9mb3JjYXN0X2xpbmsuaHJlZiA9IFwiaHR0cDovL3d3dy53ZWF0aGVyLmNvbS93ZWF0aGVyLzVkYXkvbC9cIiArIHBhcnNlZF9hZGRyZXNzLnppcCArIFwiOjQ6VVNcIjtcbiAgICB9XG5cblxuICAgIGZpdmVfZGF5X2ZvcmNhc3RfbGluay50YXJnZXQgPSBcIl9ibGFua1wiO1xuICAgIGZpdmVfZGF5X2ZvcmNhc3Rfc3Bhbi5hcHBlbmRDaGlsZChmaXZlX2RheV9mb3JjYXN0X2xpbmspO1xuXG5cblxuXG4gICAgd2VhdGhlcl9yZXBvcnQuYXBwZW5kQ2hpbGQoaWNvbik7XG4gICAgd2VhdGhlcl9yZXBvcnQuYXBwZW5kQ2hpbGQoZGVzY3JpcHRpb24pO1xuICAgIHdlYXRoZXJfcmVwb3J0LmFwcGVuZENoaWxkKHRlbXApO1xuICAgIHdlYXRoZXJfcmVwb3J0LmFwcGVuZENoaWxkKHdpbmRfc3BlZWQpO1xuICAgIHdlYXRoZXJfcmVwb3J0LmFwcGVuZENoaWxkKGZpdmVfZGF5X2ZvcmNhc3Rfc3Bhbik7XG5cbiAgICAkKHdlYXRoZXJfcmVwb3J0KS5pbnNlcnRCZWZvcmUoJChcIiNcIiArIHJlc29ydF9vYmouaWQgKyBcIiAudG9nZ2xlX3dpZGdldF9saW5rXCIpKTtcblxuXG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEN1cnJlbnRXZWF0aGVyOyIsIi8qKiBnZXRzIHN0YXRpYyByZXNvcnQgY29uZGl0aW9uIGZyb20gLmpzb24gZmlsZSAqL1xuXG52YXIgbG9hZFJlc29ydHMgPSBmdW5jdGlvbiAoYXJlYSwgY2FsbGJhY2spIHtcblxuICAgIHZhciBmaWxlID0gXCJqc29uL1wiICsgYXJlYSArIFwiX3Jlc29ydHMuanNvblwiO1xuXG4gICAgJC5nZXRKU09OKGZpbGUpXG4gICAgICAgIC5kb25lKGZ1bmN0aW9uIChqc29uKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhqc29uLCBhcmVhKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmZhaWwoZnVuY3Rpb24gKGpxeGhyLCB0ZXh0U3RhdHVzLCBlcnJvcikge1xuICAgICAgICAgICAgdmFyIGVyciA9IHRleHRTdGF0dXMgKyBcIiwgXCIgKyBlcnJvcjtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVxdWVzdCBGYWlsZWQ6IFwiICsgZXJyKTtcbiAgICAgICAgfSk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsb2FkUmVzb3J0czsiLCJ2YXIgYnVpbGRSZXNvcnRCcmllZkRpdiA9IHJlcXVpcmUoXCIuL2J1aWxkX1Jlc29ydF9CcmllZl9EaXYuanNcIik7XG52YXIgcmVxdWVzdEN1cnJlbnRXZWF0aGVyID0gcmVxdWlyZShcIi4vcmVxdWVzdF9DdXJyZW50X1dlYXRoZXIuanNcIik7XG52YXIgaW5zZXJ0Q3VycmVudFdlYXRoZXIgPSByZXF1aXJlKFwiLi9pbnNlcnRfQ3VycmVudF9XZWF0aGVyLmpzXCIpO1xudmFyIHV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMuanNcIik7XG5cbi8qKiBjYWxscyBidWlsZGVyIGFuZCBpbnNlcnRzIG5ldyByZXNvcnQgc25pcHBldHMgb24gcGFnZSAqL1xuXG52YXIgcHJpbnRSZXNvcnRzID0gZnVuY3Rpb24gKGpzb24sIGFyZWEpIHtcbiAgICBcbiAgICAkKFwiLnJlZ2lvbl9zZWxlY3RlZFwiKS50ZXh0KGFyZWEudG9VcHBlckNhc2UoKS5yZXBsYWNlKC9fL2csXCIgXCIpKTtcbiAgICBcbiAgICBcbiAgICB2YXIgcmVzb3J0c19yZXN1bHRzX2RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzb3J0c19yZXN1bHRzX2RpdlwiKTtcblxuICAgIHZhciByZXNvcnRzX2FyciA9IGpzb25bYXJlYV07XG4gICAgdmFyIGFsbFJlc29ydHMgPSBcIlwiO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSByZXNvcnRzX2Fyci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXG4gICAgICAgIHJlc29ydHNfYXJyW2ldLmlkID0gcmVzb3J0c19hcnJbaV0ubmFtZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoLyAvZywgXCJfXCIpLnJlcGxhY2UoL1xcLi9nLCBcIlwiKTtcbiAgICAgICAgXG4gICAgICAgIHZhciBwYXJzZWRfYWRkcmVzcyA9IHV0aWxzLnBhcnNlQWRkcmVzcyhyZXNvcnRzX2FycltpXSk7XG4gICAgICAgIFxuICAgICAgICB2YXIgcmVzb3J0X2JyaWVmX2RpdiA9IGJ1aWxkUmVzb3J0QnJpZWZEaXYocmVzb3J0c19hcnJbaV0sIHBhcnNlZF9hZGRyZXNzKTtcbiAgICAgICAgYWxsUmVzb3J0cyA9IGFsbFJlc29ydHMgKyByZXNvcnRfYnJpZWZfZGl2O1xuXG4gICAgICAgIHJlcXVlc3RDdXJyZW50V2VhdGhlcihyZXNvcnRzX2FycltpXSwgcGFyc2VkX2FkZHJlc3MsIGZ1bmN0aW9uIChqc29uLCBuYW1lKSB7XG4gICAgICAgICAgICBpbnNlcnRDdXJyZW50V2VhdGhlcihqc29uLCBuYW1lLCBwYXJzZWRfYWRkcmVzcyk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvL2luc2VydCBhbGwgcmVzb3J0cyBvbiBwYWdlXG4gICAgcmVzb3J0c19yZXN1bHRzX2Rpdi5pbm5lckhUTUwgPSBhbGxSZXNvcnRzO1xuICAgIFxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gcHJpbnRSZXNvcnRzOyIsIi8qKiBnZXRzIGN1cnJlbnQgd2VhdGhlciBjb25kaXRpb25zIGZyb20gb3BlbndlYXRoZXJtYXAub3JnICovXG5cbnZhciByZXF1ZXN0Q3VycmVudFdlYXRoZXIgPSBmdW5jdGlvbiAocmVzb3J0X29iaiwgcGFyc2VkX2FkZHJlc3MsIGNhbGxiYWNrKSB7XG5cbiAgICB2YXIgbGF0X2xvbiA9IHJlc29ydF9vYmouY29udGFjdF9pbmZvLmxhdF9sb247XG4gICAgaWYgKGxhdF9sb24ubGVuZ3RoID4gMCkge1xuICAgICAgICBsYXRfbG9uID0gbGF0X2xvbi5zcGxpdChcIixcIik7XG4gICAgICAgIHZhciBsYXQgPSBsYXRfbG9uWzBdO1xuICAgICAgICB2YXIgbG9uID0gJC50cmltKGxhdF9sb25bMV0pO1xuICAgICAgICB2YXIgdXJsID0gXCJodHRwOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS93ZWF0aGVyP2xhdD1cIiArIGxhdCArIFwiJmxvbj1cIiArIGxvbiArIFwiJnVuaXRzPUltcGVyaWFsJmFwcGlkPWNjYTcwMWEwMjU0MTA3MmRlOGFlODkyMDZjOWZhZWU5XCI7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgdXJsID0gXCJodHRwOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS93ZWF0aGVyP3ppcD1cIiArIHBhcnNlZF9hZGRyZXNzLnppcCArIFwiLHVzJnVuaXRzPUltcGVyaWFsJmFwcGlkPWNjYTcwMWEwMjU0MTA3MmRlOGFlODkyMDZjOWZhZWU5XCI7XG5cblxuICAgIH1cblxuXG4gICAgJC5nZXRKU09OKHVybClcbiAgICAgICAgLmRvbmUoZnVuY3Rpb24gKGpzb24pIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGpzb24sIHJlc29ydF9vYmopO1xuLy8gICAgICAgIGNvbnNvbGUubG9nKGpzb24pO1xuICAgICAgICB9KVxuICAgICAgICAuZmFpbChmdW5jdGlvbiAoanF4aHIsIHRleHRTdGF0dXMsIGVycm9yKSB7XG4gICAgICAgICAgICB2YXIgZXJyID0gdGV4dFN0YXR1cyArIFwiLCBcIiArIGVycm9yO1xuICAgICAgICB9KTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVlc3RDdXJyZW50V2VhdGhlcjsiLCJ2YXIgcHJpbnRSZXNvcnRzID0gcmVxdWlyZShcIi4vcHJpbnRfUmVzb3J0cy5qc1wiKTtcbnZhciB0b2dnbGVXaWRnZXREaXNwbGF5U2V0dXAgPSByZXF1aXJlKFwiLi90b2dnbGVfV2lkZ2V0X0Rpc3BsYXlfc2V0dXAuanNcIik7XG52YXIgdXRpbHMgPSByZXF1aXJlKFwiLi91dGlscy5qc1wiKTtcblxuXG5cbi8qKiBzZXQgdXAgdGhlIHNvcnQgYmFyIGZ1bmN0aW9uYWxpdHkgKi9cblxudmFyIHNvcnRpbmcgPSB7XG5cbiAgICAvL2hhdmUgYSBjb3B5IG9mIHRoZSBzZWxlY3RlZCBqc29uIGFuZCBhcmVhIGluIHRoaXMgb2JqZWN0IHRvIHVzZSBpbiBzb3J0UmVzb3J0c0FycmF5KCk7XG4gICAgc2VsZWN0ZWRfanNvbjoge30sXG4gICAgc2VsZWN0ZWRfYXJlYToge30sXG5cbiAgICBzZXRTZWxlY3RlZDogZnVuY3Rpb24gKGpzb24sIGFyZWEpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9qc29uID0ganNvbjtcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9hcmVhID0gYXJlYTtcbiAgICB9LFxuXG5cblxuXG5cbiAgICAvL3NvcnRzIHJlc29ydCBqc29uLiBjYWxsZWQgd2hlbiBzb3J0IGxpbmsgaXMgY2xpY2tlZCBvciByZWdpb24gZHJvcGRvd24gaXMgY2hhbmdlZFxuICAgIHNvcnRSZXNvcnRzQXJyYXk6IGZ1bmN0aW9uIChzb3J0X2J5LCBzb3J0X29yZGVyKSB7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBzb3J0X2J5ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBzb3J0X2J5ID0gdGhpcy5jYWNoZWQgPyB0aGlzLmNhY2hlZC5zb3J0X2J5IDogXCJuYW1lXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBzb3J0X29yZGVyID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBzb3J0X29yZGVyID0gdGhpcy5jYWNoZWQgPyB0aGlzLmNhY2hlZC5zb3J0X29yZGVyIDogXCJkZXNjXCI7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHZhciB0aGlzUmVzb3J0QXJyYXkgPSB0aGlzLnNlbGVjdGVkX2pzb25bdGhpcy5zZWxlY3RlZF9hcmVhXTtcblxuICAgICAgICAvL3NvcnQgYnkgbmFtZVxuXG4gICAgICAgIGlmIChzb3J0X2J5ID09PSBcIm5hbWVcIikge1xuICAgICAgICAgICAgdGhpc1Jlc29ydEFycmF5LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYVtzb3J0X2J5XS5sb2NhbGVDb21wYXJlKGJbc29ydF9ieV0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgLy9zb3J0IGJ5IHN0YXRlXG5cbiAgICAgICAgfSBlbHNlIGlmIChzb3J0X2J5ID09PSBcInN0YXRlXCIpIHtcblxuICAgICAgICAgICAgdGhpc1Jlc29ydEFycmF5LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiB1dGlscy5wYXJzZUFkZHJlc3MoYSkuc3RhdGUubG9jYWxlQ29tcGFyZSh1dGlscy5wYXJzZUFkZHJlc3MoYikuc3RhdGUpO1xuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICB9IGVsc2UgeyAvL2ZvciBudW1iZXJlZCBzb3J0cyBpbiB0d28gbGV2ZWxzXG5cbiAgICAgICAgICAgIHZhciBzb3J0X3Nwb3QgPSBzb3J0X2J5LnNwbGl0KFwiLlwiKTtcblxuICAgICAgICAgICAgdGhpc1Jlc29ydEFycmF5LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYVtzb3J0X3Nwb3RbMF1dW3NvcnRfc3BvdFsxXV0gLSBiW3NvcnRfc3BvdFswXV1bc29ydF9zcG90WzFdXTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuXG4gICAgICAgIGlmIChzb3J0X29yZGVyID09PSBcImFzY1wiKSB7XG4gICAgICAgICAgICB0aGlzUmVzb3J0QXJyYXkucmV2ZXJzZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYWNoZWQgPSB7XG4gICAgICAgICAgICBzb3J0X29yZGVyOiBzb3J0X29yZGVyLFxuICAgICAgICAgICAgc29ydF9ieTogc29ydF9ieVxuICAgICAgICB9XG5cbiAgICAgICAgLy9yZWJ1aWxkIHJlc29ydHMgbGlzdCBvbiBzY3JlZW5cbiAgICAgICAgcHJpbnRSZXNvcnRzKHRoaXMuc2VsZWN0ZWRfanNvbiwgdGhpcy5zZWxlY3RlZF9hcmVhKTtcbiAgICAgICAgLy8gZW5hYmxlIHdpZGdldCBkaXNwbGF5IGxpbmtzIG9uIGVhY2ggc25pcHBldFxuICAgICAgICB0b2dnbGVXaWRnZXREaXNwbGF5U2V0dXAoKTtcblxuICAgIH0sXG5cblxuXG4gICAgLy9zb3J0IGJhciBpbml0aWFsaXplciAtIGNhbGxlZCB3aGVuIHBhZ2UgbG9hZHNcbiAgICBzb3J0QmFySW5pdDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICQoXCIjc29ydF9iYXIgLnNvcnRfbGlua1wiKS5jbGljayhmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIHZhciBjbGlja2VkX3NvcnQgPSAkKHRoaXMpO1xuICAgICAgICAgICAgdmFyIHNvcnRfYnkgPSBjbGlja2VkX3NvcnQuYXR0cihcInNvcnRfYnlcIik7XG4gICAgICAgICAgICB2YXIgc29ydF9vcmRlciA9IGNsaWNrZWRfc29ydC5hdHRyKFwic29ydF9vcmRlclwiKTtcblxuICAgICAgICAgICAgJChcIiNzb3J0X2JhciAuc29ydF9saW5rX3NlbGVjdGVkXCIpLnJlbW92ZUNsYXNzKFwic29ydF9saW5rX3NlbGVjdGVkXCIpO1xuICAgICAgICAgICAgY2xpY2tlZF9zb3J0LmFkZENsYXNzKFwic29ydF9saW5rX3NlbGVjdGVkXCIpO1xuXG5cbiAgICAgICAgICAgIC8vaWYgYXNjZW5kaW5nLCBtYWtlIGRlc2NlbmRpbmcgZXRjLlxuXG4gICAgICAgICAgICB2YXIgdHJpYW5nbGUgPSBzb3J0X29yZGVyID09PSBcImFzY1wiID8gXCJcXHUyNUJDXCIgOiBcIlxcdTI1QjJcIjtcbiAgICAgICAgICAgIHZhciBuZXdfc29ydF9vcmRlciA9IHNvcnRfb3JkZXIgPT09IFwiYXNjXCIgPyBcImRlc2NcIiA6IFwiYXNjXCI7XG5cblxuXG4gICAgICAgICAgICAvLyBzb3J0IHRoZSByZXNvcnRzIGFycmF5XG4gICAgICAgICAgICBzb3J0aW5nLnNvcnRSZXNvcnRzQXJyYXkoc29ydF9ieSwgc29ydF9vcmRlcik7XG5cbiAgICAgICAgICAgICQoXCIuc29ydF90cmlhbmdsZVwiLCBjbGlja2VkX3NvcnQpLnRleHQodHJpYW5nbGUpO1xuXG4gICAgICAgICAgICBjbGlja2VkX3NvcnQudG9nZ2xlQ2xhc3MoXCJzb3J0X29yZGVyX2FzYyBzb3J0X29yZGVyX2Rlc2NcIikuYXR0cihcInNvcnRfb3JkZXJcIiwgbmV3X3NvcnRfb3JkZXIpO1xuXG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbn1cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gc29ydGluZzsiLCIvKiogd2hlbiBcIm1vcmVcIiBsaW5rIGlzIGNsaWNrZWQsIGdldHMgd2lkZ2V0IGZvciB0aGF0IHJlc29ydCBhbmQgYXBwZW5kcyBpdCB0byByZXNvcnQgc25pcHBldCAqL1xuXG52YXIgdG9nZ2xlV2lkZ2V0RGlzcGxheVNldHVwID0gZnVuY3Rpb24oKXtcbiAgICBcbiAgICAkKFwiLnRvZ2dsZV93aWRnZXRfbGlua1wiKS5jbGljayhmdW5jdGlvbigpeyAgICBcbiAgICAgICAgXG4gICAgICAgIGlmICgkKHRoaXMpLnRleHQoKSA9PT0gXCJzaG93IGN1cnJlbnQgc3RhdHNcIil7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBjb25kaXRpb25zX3dpZGdldF9jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0X2NvbnRhaW5lci5jbGFzc05hbWUgPSBcImNvbmRpdGlvbnNfd2lkZ2V0X2NvbnRhaW5lclwiO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgY29uZGl0aW9uc193aWRnZXRfc25vd2NvdW50cnlfbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0X3Nub3djb3VudHJ5X2xpbmsuY2xhc3NOYW1lID0gXCJjb25kaXRpb25zX3dpZGdldF9zbm93Y291bnRyeV9saW5rXCI7XG4gICAgICAgICAgICAgICAgY29uZGl0aW9uc193aWRnZXRfc25vd2NvdW50cnlfbGluay50ZXh0Q29udGVudCA9XCJQb3dlcmVkIGJ5IHd3dy5zbm9jb3VudHJ5LmNvbVwiO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0X3Nub3djb3VudHJ5X2xpbmsuaHJlZiA9IFwiaHR0cDovL3d3dy5zbm9jb3VudHJ5LmNvbVwiO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0X3Nub3djb3VudHJ5X2xpbmsudGFyZ2V0ID0gXCJfYmxhbmtcIjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgY29uZGl0aW9uc193aWRnZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaWZyYW1lXCIpO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0LmNsYXNzTmFtZSA9IFwiY29uZGl0aW9uc193aWRnZXRcIjtcbiAgICAgICAgICAgICAgICBjb25kaXRpb25zX3dpZGdldC5zcmMgPSAkKHRoaXMpLmF0dHIoXCJ3aWRnZXRfbGlua1wiKTtcbiAgICAgICAgICAgICAgICBjb25kaXRpb25zX3dpZGdldC5oZWlnaHQgPSBcIjI4MFwiO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0LndpZHRoID0gXCI1OTBcIjtcbiAgICAgICAgICAgICAgICBjb25kaXRpb25zX3dpZGdldC5zZWFtbGVzcz0gXCJzZWFtbGVzc1wiO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0LmZyYW1lQm9yZGVyPVwiMFwiO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0LnNjcm9sbGluZyA9IFwibm9cIjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25kaXRpb25zX3dpZGdldF9jb250YWluZXIuYXBwZW5kQ2hpbGQoY29uZGl0aW9uc193aWRnZXRfc25vd2NvdW50cnlfbGluayk7XG4gICAgICAgICAgICBjb25kaXRpb25zX3dpZGdldF9jb250YWluZXIuYXBwZW5kQ2hpbGQoY29uZGl0aW9uc193aWRnZXQpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgICQodGhpcykudGV4dChcImhpZGUgY3VycmVudCBzdGF0c1wiKVxuICAgICAgICAgICAgICAgIC5jbG9zZXN0KFwiLnJlc29ydF9zbmlwcGV0XCIpLmFwcGVuZChjb25kaXRpb25zX3dpZGdldF9jb250YWluZXIpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICQodGhpcykudGV4dChcInNob3cgY3VycmVudCBzdGF0c1wiKVxuICAgICAgICAgICAgICAgIC5jbG9zZXN0KFwiLnJlc29ydF9zbmlwcGV0XCIpLmZpbmQoXCIuY29uZGl0aW9uc193aWRnZXRfY29udGFpbmVyXCIpLnJlbW92ZSgpO1xuICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgICBcbiAgICAgICAgXG4gICAgfSk7XG4gICAgXG4gICAgXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB0b2dnbGVXaWRnZXREaXNwbGF5U2V0dXA7IiwiICAgICAgdmFyIHV0aWxzID0ge1xuXG4gICAgICAgICAgLyoqIGFkZCBjb21tYXMgZnVuY3Rpb24gKi9cbiAgICAgICAgICBhZGRDb21tYXM6IGZ1bmN0aW9uICh2YWwpIHtcblxuICAgICAgICAgICAgICBpZiAoaXNOYU4odmFsKSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICgodmFsID4gOTk5KSB8fCAodmFsIDwgLTk5OSkpIHtcbiAgICAgICAgICAgICAgICAgIHdoaWxlICgvKFxcZCspKFxcZHszfSkvLnRlc3QodmFsLnRvU3RyaW5nKCkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFsID0gdmFsLnRvU3RyaW5nKCkucmVwbGFjZSgvKFxcZCspKFxcZHszfSkvLCAnJDEnICsgJywnICsgJyQyJyk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgLyoqIHJldHVybiBfc20gZm9yIGltYWdlIG5hbWUgKi9cbiAgICAgICAgICB0aHVtYm5haWxOYW1lOiBmdW5jdGlvbiAoaW1hZ2VfbmFtZSkge1xuICAgICAgICAgICAgICByZXR1cm4gaW1hZ2VfbmFtZS5yZXBsYWNlKCcucG5nJywgJ19zbS5wbmcnKS5yZXBsYWNlKCcuanBnJywgJ19zbS5qcGcnKS5yZXBsYWNlKCcuanBlZycsICdfc20uanBlZycpLnJlcGxhY2UoJy5wZGYnLCAnX3NtLnBuZycpO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICAvKiogcmV0dXJuIG1vZGRlZCBsYW5ndWFnZSBmb3Igd2VhdGhlciBkZXNjcmlwdGlvbiAqL1xuICAgICAgICAgIHdlYXRoZXJEZXNjcmlwdG9yOiBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzdHJpbmcucmVwbGFjZShcIm92ZXJjYXN0IGNsb3Vkc1wiLCBcIm92ZXJjYXN0XCIpLnJlcGxhY2UoXCJza3kgaXMgY2xlYXJcIiwgXCJjbGVhciBza2llc1wiKTtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgcGhvbmVGb3JtYXQ6IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC9cXCh8XFwpL2csIFwiXCIpLnJlcGxhY2UoLy18IC9nLCBcIiYjODIwOTtcIik7XG4gICAgICAgICAgfSxcblxuXG4gICAgICAgICAgcGFyc2VBZGRyZXNzOiBmdW5jdGlvbiAocmVzb3J0X29iaikge1xuICAgICAgICAgICAgICB2YXIgcGFyc2VkX2FkZHJlc3MgPSB7fTtcblxuICAgICAgICAgICAgICAvL2lmIHBhcnRzIGFyZSB0aGVyZSwgdXNlIHRob3NlXG4gICAgICAgICAgICAgIHBhcnNlZF9hZGRyZXNzLnN0cmVldF9hZHJlc3MgPSByZXNvcnRfb2JqLmNvbnRhY3RfaW5mby5zdHJlZXRfYWRkcmVzcyB8fCBcIlwiO1xuICAgICAgICAgICAgICBwYXJzZWRfYWRkcmVzcy5jaXR5ID0gcmVzb3J0X29iai5jb250YWN0X2luZm8uY2l0eSB8fCBcIlwiO1xuICAgICAgICAgICAgICBwYXJzZWRfYWRkcmVzcy5zdGF0ZSA9IHJlc29ydF9vYmouY29udGFjdF9pbmZvLnN0YXRlIHx8IFwiXCI7XG4gICAgICAgICAgICAgIHBhcnNlZF9hZGRyZXNzLnppcCA9IHJlc29ydF9vYmouY29udGFjdF9pbmZvLnppcCB8fCBcIlwiO1xuXG4gICAgICAgICAgICAgIC8vZnVsbCBhZGRyZXNzIHVzZXMgZnVsbCBpZiBpdHMgdGhlcmUsIG9yIGEgY29tYmluYXRpb24gaWYgaXQncyBub3RcbiAgICAgICAgICAgICAgcGFyc2VkX2FkZHJlc3MuZnVsbF9hZGRyZXNzID0gcmVzb3J0X29iai5jb250YWN0X2luZm8uZnVsbF9hZGRyZXNzIHx8IHJlc29ydF9vYmouY29udGFjdF9pbmZvLnN0cmVldF9hZGRyZXNzICsgXCIsIFwiICsgcmVzb3J0X29iai5jb250YWN0X2luZm8uY2l0eSArIFwiLCBcIiArIHJlc29ydF9vYmouY29udGFjdF9pbmZvLnN0YXRlICsgXCIgXCIgKyByZXNvcnRfb2JqLmNvbnRhY3RfaW5mby56aXA7XG5cbiAgICAgICAgICAgICAgLy9pZiBmdWxsIGFkZHJlc3MgaXMgdGhlcmUsIHBhcnNlIGl0IGZvciBwYXJ0cyBvZiB0aGUgYWRkcmVzc1xuICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlc29ydF9vYmouY29udGFjdF9pbmZvLmZ1bGxfYWRkcmVzcyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgdmFyIGFkZHJlc3NfYXJyID0gcmVzb3J0X29iai5jb250YWN0X2luZm8uZnVsbF9hZGRyZXNzLnNwbGl0KFwiLFwiKTtcblxuICAgICAgICAgICAgICAgICAgcGFyc2VkX2FkZHJlc3MuemlwID0gYWRkcmVzc19hcnJbYWRkcmVzc19hcnIubGVuZ3RoIC0gMV0uc2xpY2UoMyk7XG4gICAgICAgICAgICAgICAgICBwYXJzZWRfYWRkcmVzcy5zdGF0ZSA9IGFkZHJlc3NfYXJyW2FkZHJlc3NfYXJyLmxlbmd0aCAtIDFdLnNsaWNlKDEsIDMpO1xuICAgICAgICAgICAgICAgICAgcGFyc2VkX2FkZHJlc3MuY2l0eSA9IGFkZHJlc3NfYXJyW2FkZHJlc3NfYXJyLmxlbmd0aCAtIDJdO1xuICAgICAgICAgICAgICAgICAgcGFyc2VkX2FkZHJlc3Muc3RyZWV0X2FkcmVzcyA9IGFkZHJlc3NfYXJyLnNsaWNlKDAsIGFkZHJlc3NfYXJyLmxlbmd0aCAtIDIpLmpvaW4oXCIsXCIpO1xuXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICByZXR1cm4gcGFyc2VkX2FkZHJlc3M7XG5cbiAgICAgICAgICB9LFxuICAgICAgICAgIFxuXG4gICAgICAgICAgdXJsRm9ybWF0OiBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gICAgICAgICAgICAgIGlmIChzdHJpbmcuc2xpY2UoMCwgMykgPT09IFwid3d3XCIpIHtcbiAgICAgICAgICAgICAgICAgIHN0cmluZyA9IFwiaHR0cDovL1wiICsgc3RyaW5nO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBzdHJpbmc7XG4gICAgICAgICAgfVxuXG4gICAgICB9XG5cblxuICAgICAgbW9kdWxlLmV4cG9ydHMgPSB1dGlsczsiXX0=
