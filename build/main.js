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

        printResorts(json, area);
        toggleWidgetDisplaySetup();
        sorting.setSelected(json, area);
        sorting.sortBarInit();

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

    var rates = "Rates (midweek / weekend or prime): <span class = 'rates_adult report'>Adult:&nbsp;$" + resort_obj.rates.adults_midweek + "&nbsp;/&nbsp;$" + resort_obj.rates.adults_prime + "&nbsp;</span>\
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
    
    var $resorts_results_div = $("#resorts_results_div");

    $resorts_results_div.empty();

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
    $resorts_results_div.append(allResorts);
    
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
              return image_name.replace('.png', '_sm.png').replace('.jpg', '_sm.jpg').replace('.jpeg', '_sm.jpeg');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzX3NyYy9hcHAuanMiLCJzY3JpcHRzX3NyYy9hcmVhX3NlbGVjdG9yLmpzIiwic2NyaXB0c19zcmMvYnVpbGRfUmVzb3J0X0JyaWVmX0Rpdi5qcyIsInNjcmlwdHNfc3JjL2ZpbHRlcl9SZXNvcnRzX1NldHVwLmpzIiwic2NyaXB0c19zcmMvaW5zZXJ0X0N1cnJlbnRfV2VhdGhlci5qcyIsInNjcmlwdHNfc3JjL2xvYWRfUmVzb3J0cy5qcyIsInNjcmlwdHNfc3JjL3ByaW50X1Jlc29ydHMuanMiLCJzY3JpcHRzX3NyYy9yZXF1ZXN0X0N1cnJlbnRfV2VhdGhlci5qcyIsInNjcmlwdHNfc3JjL3NvcnRpbmcuanMiLCJzY3JpcHRzX3NyYy90b2dnbGVfV2lkZ2V0X0Rpc3BsYXlfc2V0dXAuanMiLCJzY3JpcHRzX3NyYy91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgbG9hZFJlc29ydHMgPSByZXF1aXJlKFwiLi9sb2FkX1Jlc29ydHMuanNcIik7XG52YXIgcHJpbnRSZXNvcnRzID0gcmVxdWlyZShcIi4vcHJpbnRfUmVzb3J0cy5qc1wiKTtcbnZhciB0b2dnbGVXaWRnZXREaXNwbGF5U2V0dXAgPSByZXF1aXJlKFwiLi90b2dnbGVfV2lkZ2V0X0Rpc3BsYXlfc2V0dXAuanNcIik7XG52YXIgc29ydGluZyA9IHJlcXVpcmUoXCIuL3NvcnRpbmcuanNcIik7XG52YXIgYXJlYV9zZWxlY3RvciA9IHJlcXVpcmUoXCIuL2FyZWFfc2VsZWN0b3IuanNcIik7XG52YXIgZmlsdGVyUmVzb3J0c1NldHVwID0gcmVxdWlyZShcIi4vZmlsdGVyX1Jlc29ydHNfU2V0dXAuanNcIik7XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBhcmVhID0gYXJlYV9zZWxlY3Rvci5wYWdlTG9hZCgpO1xuXG4gICAgLyoqIGdldCB0aGUgcmVzb3J0IGpzb24gZnJvbSBzZWxlY3RlZCBhcmVhICovXG4gICAgbG9hZFJlc29ydHMoYXJlYSwgZnVuY3Rpb24gKGpzb24sIGFyZWEpIHtcblxuICAgICAgICBwcmludFJlc29ydHMoanNvbiwgYXJlYSk7XG4gICAgICAgIHRvZ2dsZVdpZGdldERpc3BsYXlTZXR1cCgpO1xuICAgICAgICBzb3J0aW5nLnNldFNlbGVjdGVkKGpzb24sIGFyZWEpO1xuICAgICAgICBzb3J0aW5nLnNvcnRCYXJJbml0KCk7XG5cbiAgICAgICAgLy9pbml0aWFsaXplIGFyZSBkcm9wZG93biBtZW51O1xuXG4gICAgICAgIGFyZWFfc2VsZWN0b3IuZHJvcGRvd25Jbml0KCk7XG5cbiAgICB9KTtcblxuXG4gICAgZmlsdGVyUmVzb3J0c1NldHVwKCk7XG5cblxufSk7IiwidmFyIGxvYWRSZXNvcnRzID0gcmVxdWlyZShcIi4vbG9hZF9SZXNvcnRzLmpzXCIpO1xudmFyIHByaW50UmVzb3J0cyA9IHJlcXVpcmUoXCIuL3ByaW50X1Jlc29ydHMuanNcIik7XG52YXIgdG9nZ2xlV2lkZ2V0RGlzcGxheVNldHVwID0gcmVxdWlyZShcIi4vdG9nZ2xlX1dpZGdldF9EaXNwbGF5X3NldHVwLmpzXCIpO1xudmFyIHNvcnRpbmcgPSByZXF1aXJlKFwiLi9zb3J0aW5nLmpzXCIpO1xuXG5cbnZhciBhcmVhX3NlbGVjdG9yID0ge1xuXG4gICAgcGFnZUxvYWQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAvL2xvb2sgYXQgaW5pdGlhbCBwYWdlIHVybCBhbmQgcSBzdHJpbmcgdG8gZ2V0IGFyZWFcblxuICAgICAgICB2YXIgYXJlYSA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnNsaWNlKDEpIHx8IFwibWlkX2F0bGFudGljXCI7XG5cbiAgICAgICAgLy9zZXQgaW5pdGlhbCB2YWx1ZSBvZiByZXNvcnRfc2VsZWN0aW9uX2Ryb3Bkb3duIFxuICAgICAgICAkKFwiI3Jlc29ydF9zZWxlY3Rpb25fZHJvcGRvd25cIikudmFsKGFyZWEpO1xuXG4gICAgICAgIHJldHVybiBhcmVhO1xuXG4gICAgfSxcblxuICAgIGRyb3Bkb3duSW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAkKFwiI3Jlc29ydF9zZWxlY3Rpb25fZHJvcGRvd25cIikuY2hhbmdlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhcmVhID0gJCh0aGlzKS52YWwoKTtcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gYXJlYTtcblxuXG4gICAgICAgICAgICAvKiogZ2V0IHRoZSByZXNvcnQganNvbiBmcm9tIHNlbGVjdGVkIGFyZWEgKi9cbiAgICAgICAgICAgIGxvYWRSZXNvcnRzKGFyZWEsIGZ1bmN0aW9uIChqc29uLCBhcmVhKSB7XG4gICAgICAgICAgICAgICAgc29ydGluZy5zZXRTZWxlY3RlZChqc29uLCBhcmVhKTtcbiAgICAgICAgICAgICAgICBzb3J0aW5nLnNvcnRSZXNvcnRzQXJyYXkoKTsgLy9ub3Qgc3VwcGx5aW5nIHNvcnRfYnkgYW5kIHNvcnRfb3JkZXIgdG8gdXNlIGZ1bmN0aW9uIGNhY2hlO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRvZ2dsZVdpZGdldERpc3BsYXlTZXR1cCgpO1xuXG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcmVhX3NlbGVjdG9yOyIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMuanMnKTtcbi8qKiBidWlsZHMgaHRtbCBmcm9tIF9yZXNvcnRzLmpzb24gYW5kIHJldHVybnMgaXQgYXMgYSAucmVzb3J0X3NuaXBwZXQgZGl2Ki9cblxudmFyIGJ1aWxkUmVzb3J0QnJpZWZEaXYgPSBmdW5jdGlvbiAocmVzb3J0X29iaiwgcGFyc2VkX2FkZHJlc3MpIHtcbiAgICBcblxuXG4gICAgdmFyIG5hbWVfYW5kX2xvZ28gPSBcIjxhIGNsYXNzID0gJ3Jlc29ydF9uYW1lJyB0YXJnZXQgPSdfYmxhbmsnIGhyZWYgPSdcIiArIHV0aWxzLnVybEZvcm1hdChyZXNvcnRfb2JqLmNvbnRhY3RfaW5mby51cmwpICsgXCInPjxoMz48aW1nIGNsYXNzID0ncmVzb3J0X2xvZ29faW1nJyBzcmMgPSAnaW1hZ2VzL3Jlc29ydF9sb2dvcy9cIiArIHJlc29ydF9vYmouaW1hZ2VzLmxvZ28gKyBcIicvPlwiICsgcmVzb3J0X29iai5uYW1lICsgXCIgPHNwYW4gY2xhc3M9J3Jlc29ydF9zdGF0ZSc+XCIgKyBwYXJzZWRfYWRkcmVzcy5zdGF0ZSArIFwiPC9zcGFuPjwvaDM+PC9hPlwiO1xuXG4gICAgdmFyIHRyYWlscyA9IFwiPHNwYW4gY2xhc3MgPSAndHJhaWxzIHJlcG9ydCc+XCIgKyByZXNvcnRfb2JqLnN0YXRzLnRyYWlscyArIFwiJm5ic3A7dHJhaWxzIDwvc3Bhbj5cIjtcblxuICAgIHZhciBsaWZ0cyA9IFwiPHNwYW4gY2xhc3MgPSAnbGlmdHMgcmVwb3J0Jz5cIiArIHJlc29ydF9vYmouc3RhdHMubGlmdHMgKyBcIiZuYnNwO2xpZnRzIDwvc3Bhbj5cIjtcblxuICAgIHZhciBhY3JlcyA9IFwiPHNwYW4gY2xhc3MgPSAnYWNyZXMgcmVwb3J0Jz5cIiArIHV0aWxzLmFkZENvbW1hcyhyZXNvcnRfb2JqLnN0YXRzLnNraWFibGVfYWNyZXMpICsgXCImbmJzcDthY3Jlczwvc3Bhbj5cIjtcbiAgICBcbiAgICB2YXIgcGVhayA9IFwiPHNwYW4gY2xhc3MgPSAncGVhayByZXBvcnQnPlwiICsgdXRpbHMuYWRkQ29tbWFzKHJlc29ydF9vYmouc3RhdHMucGVhaykgKyBcIicmbmJzcDtwZWFrPC9zcGFuPlwiO1xuXG4gICAgdmFyIHZlcnQgPSBcIjxzcGFuIGNsYXNzID0gJ3ZlcnQgcmVwb3J0Jz5cIiArIHV0aWxzLmFkZENvbW1hcyhyZXNvcnRfb2JqLnN0YXRzLnZlcnRpY2FsX2Ryb3BfZnQpICsgXCInJm5ic3A7dmVydGljYWwmbmJzcDtkcm9wPC9zcGFuPlwiO1xuXG4gICAgdmFyIGZ1bGxfYWRkcmVzcyA9IFwiPGEgdGFyZ2V0ID0nX2JsYW5rJyBocmVmID0nXCIgKyByZXNvcnRfb2JqLmNvbnRhY3RfaW5mby5hZGRyZXNzX3VybCArIFwiJz48c3BhbiBjbGFzcyA9ICdmdWxsX2FkZHJlc3MnPlwiICsgcGFyc2VkX2FkZHJlc3MuZnVsbF9hZGRyZXNzICsgXCI8L3NwYW4+PC9hPiBcIjtcblxuICAgIHZhciByYXRlcyA9IFwiUmF0ZXMgKG1pZHdlZWsgLyB3ZWVrZW5kIG9yIHByaW1lKTogPHNwYW4gY2xhc3MgPSAncmF0ZXNfYWR1bHQgcmVwb3J0Jz5BZHVsdDombmJzcDskXCIgKyByZXNvcnRfb2JqLnJhdGVzLmFkdWx0c19taWR3ZWVrICsgXCImbmJzcDsvJm5ic3A7JFwiICsgcmVzb3J0X29iai5yYXRlcy5hZHVsdHNfcHJpbWUgKyBcIiZuYnNwOzwvc3Bhbj5cXFxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzID0gJ3JhdGVzX2p1bmlvciByZXBvcnQnPkp1bmlvcjombmJzcDskXCIgKyByZXNvcnRfb2JqLnJhdGVzLmp1bmlvcnNfbWlkd2VlayArIFwiJm5ic3A7LyZuYnNwOyRcIiArIHJlc29ydF9vYmoucmF0ZXMuanVuaW9yc19wcmltZSArIFwiPC9zcGFuPiA8YSBjbGFzcyA9ICdyYXRlc191cmwnIHRhcmdldCA9J19ibGFuaycgaHJlZiA9J1wiICsgcmVzb3J0X29iai5yYXRlcy5yYXRlc191cmwgKyBcIic+R2V0IHRpY2tldHM8L2E+XCI7XG5cbiAgICB2YXIgcGhvbmUgPSBcIjxzcGFuIGNsYXNzID0ncmVzb3J0X3Bob25lX251bWJlcic+XCIgKyB1dGlscy5waG9uZUZvcm1hdChyZXNvcnRfb2JqLmNvbnRhY3RfaW5mby5waG9uZSkgKyBcIjwvc3Bhbj5cIjtcblxuXG4gICAgdmFyIHRvZ2dsZV93aWRnZXRfbGluayA9IFwiPHNwYW4gY2xhc3MgPSAndG9nZ2xlX3dpZGdldF9saW5rIHJlcG9ydCcgd2lkZ2V0X2xpbmsgPSBcIiArIHJlc29ydF9vYmouc3RhdHMud2lkZ2V0X2xpbmsgKyBcIj5zaG93IGN1cnJlbnQgc3RhdHM8L3NwYW4+XCJcblxuICAgIHZhciBtYXBfdGh1bWJuYWlsID0gXCI8ZGl2IGNsYXNzPSdtYXBfdGh1bWJuYWlsJz4gPGEgdGFyZ2V0ID0nX2JsYW5rJyBocmVmPSdpbWFnZXMvcmVzb3J0X21hcHMvXCIgKyByZXNvcnRfb2JqLmltYWdlcy5tYXAgKyBcIic+PGltZyBzcmM9J2ltYWdlcy9yZXNvcnRfbWFwcy9cIiArIHV0aWxzLnRodW1ibmFpbE5hbWUocmVzb3J0X29iai5pbWFnZXMubWFwKSArIFwiJy8+PC9hPjwvZGl2PlwiO1xuXG5cbiAgICB2YXIgc25pcHBldCA9IFwiPGRpdiBjbGFzcz0ncmVzb3J0X3NuaXBwZXQnIGlkID0nXCIgKyByZXNvcnRfb2JqLmlkICsgXCInID5cIiArIG5hbWVfYW5kX2xvZ28gKyBcIlxcXG4gICAgICAgIFwiICsgbWFwX3RodW1ibmFpbCArIFwiPGRpdiBjbGFzcz0ncmVzb3J0X3NuaXBwZXRfdGV4dCc+XFxcbiAgICAgICAgPHNwYW4gY2xhc3M9J3N0YXRzX3JlcG9ydCc+XCIgKyB0cmFpbHMgKyBsaWZ0cyArIGFjcmVzICsgcGVhayArIHZlcnQgKyBcIjwvc3Bhbj48YnIvPlxcXG4gICAgICAgIFwiICsgcmF0ZXMgKyBcIjxicj48cCBjbGFzcz0nY29udGFjdF9pbmZvJz5cXFxuICAgICAgICBcIiArIGZ1bGxfYWRkcmVzcyArIHBob25lICsgXCI8L3A+XFxcbiAgICAgICAgXCIgKyB0b2dnbGVfd2lkZ2V0X2xpbmsgKyBcIjwvZGl2PlxcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPSdjbGVhcl9mbG9hdCc+PC9kaXY+XFxcbiAgICAgICAgPC9kaXY+XCI7XG5cblxuXG4gICAgcmV0dXJuIHNuaXBwZXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYnVpbGRSZXNvcnRCcmllZkRpdjsiLCIvKiogc2V0cyB1cCB0aGUgZmlsdGVyX3Jlc29ydHMgc2VhcmNoIGJveCB0byBkaXNwbGF5IG9ubHkgdGhlIHJlc29ydCBzbmlwcGV0cyB0aGF0IHVzZXIgdHlwZXMgaW4gKi9cblxudmFyIGZpbHRlclJlc29ydHNTZXR1cCA9IGZ1bmN0aW9uIGZpbHRlclJlc29ydHNTZXR1cCgpe1xuICAgIHZhciAkZmlsdGVyX2lucHV0ID0gJCggXCIjZmlsdGVyX3Jlc29ydHNcIiApO1xuICAgIFxuICAgIFxuJGZpbHRlcl9pbnB1dC5rZXl1cChmdW5jdGlvbigpIHtcbiAgICB2YXIgZmlsdGVyX2lkID0gJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1xccysvaSxcIl9cIikucmVwbGFjZSgvXFwuKy9pLFwiXCIpO1xuICAgIGlmIChmaWx0ZXJfaWQgPT09IFwiXCIpe1xuICAgICAgICAkKFwiLnJlc29ydF9zbmlwcGV0XCIpLnNob3coKTtcbiAgICB9ZWxzZXtcbiAgICAgICAgJChcIi5yZXNvcnRfc25pcHBldFwiKS5oaWRlKCk7XG4gICAgICAgICQoIFwiW2lkKj0nXCIgKyBmaWx0ZXJfaWQgKyBcIiddXCIgKS5zaG93KCk7XG4gICAgfVxuXG59KTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbHRlclJlc29ydHNTZXR1cDsiLCJ2YXIgdXRpbHMgPSByZXF1aXJlKFwiLi91dGlscy5qc1wiKTtcblxuLyoqIGJ1aWxkcyBodG1sIGZyb20gd2VhdGhlciBqc29uIGFuZCBpbnNlcnRzIHdlYXRoZXIgcmVwb3J0IHNwYW4gKi9cblxudmFyIGluc2VydEN1cnJlbnRXZWF0aGVyID0gZnVuY3Rpb24gKGpzb24sIHJlc29ydF9vYmosIHBhcnNlZF9hZGRyZXNzKSB7XG4gICAgXG5cbiAgICAkKFwiI1wiICsgcmVzb3J0X29iai5pZCArIFwiIC53ZWF0aGVyX3JlcG9ydFwiKS5yZW1vdmUoKTtcblxuICAgIHZhciB3ZWF0aGVyX3JlcG9ydCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgIHdlYXRoZXJfcmVwb3J0LmNsYXNzTmFtZSA9IFwid2VhdGhlcl9yZXBvcnRcIjtcblxuICAgIHZhciBpY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICBpY29uLmNsYXNzTmFtZSA9IFwid2VhdGhlcl9pY29uXCI7XG4gICAgaWNvbi5zcmMgPSBcImh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvXCIgKyBqc29uLndlYXRoZXJbMF0uaWNvbiArIFwiLnBuZ1wiO1xuXG4gICAgdmFyIGRlc2NyaXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgZGVzY3JpcHRpb24uY2xhc3NOYW1lID0gXCJ3ZWF0aGVyX2Rlc2NyaXB0aW9uXCI7XG4gICAgZGVzY3JpcHRpb24udGV4dENvbnRlbnQgPSB1dGlscy53ZWF0aGVyRGVzY3JpcHRvcihqc29uLndlYXRoZXJbMF0uZGVzY3JpcHRpb24pICsgXCIgXCI7XG5cbiAgICB2YXIgdGVtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgIHRlbXAuY2xhc3NOYW1lID0gXCJ3ZWF0aGVyX3RlbXBcIjtcbiAgICB0ZW1wLnRleHRDb250ZW50ID0ganNvbi5tYWluLnRlbXAudG9GaXhlZCgxKSArIFwiXFx1MjEwOSBcIjsgLy9zeW1ib2wgZm9yIGRlZ3JlZXMgRlxuXG4gICAgdmFyIHdpbmRfc3BlZWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICB3aW5kX3NwZWVkLmNsYXNzTmFtZSA9IFwid2VhdGhlcl93aW5kX3NwZWVkXCI7XG4gICAgd2luZF9zcGVlZC50ZXh0Q29udGVudCA9IFwid2luZDpcXHUwMGEwXCIgKyBqc29uLndpbmQuc3BlZWQudG9GaXhlZCgxKSArIFwiXFx1MDBhMG1waFwiO1xuXG4gICAgdmFyIGZpdmVfZGF5X2ZvcmNhc3Rfc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgIHZhciBmaXZlX2RheV9mb3JjYXN0X2xpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICBmaXZlX2RheV9mb3JjYXN0X2xpbmsuY2xhc3NOYW1lID0gXCJmaXZlX2RheV9mb3JjYXN0X2xpbmtcIjtcbiAgICBmaXZlX2RheV9mb3JjYXN0X2xpbmsudGV4dENvbnRlbnQgPSBcIjVcXHUyMDExZGF5XFx1MDBBMGZvcmNhc3RcIjtcblxuICAgIC8vaWYgbW9yZSBhY2N1cmF0ZSB3ZWF0aGVyIGxpbmsgaXMgYXZhaWxhYmxlLCB1c2UgdGhhdCBpbnN0ZWFkIG9mIHppcCBjb2RlXG4gICAgaWYgKHR5cGVvZiByZXNvcnRfb2JqLndlYXRoZXJfZm9yY2FzdF91cmwgIT0gXCJ1bmRlZmluZWRcIiAmJiByZXNvcnRfb2JqLndlYXRoZXJfZm9yY2FzdF91cmwubGVuZ3RoID4gMCkge1xuICAgICAgICBmaXZlX2RheV9mb3JjYXN0X2xpbmsuaHJlZiA9IHJlc29ydF9vYmoud2VhdGhlcl9mb3JjYXN0X3VybDtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZpdmVfZGF5X2ZvcmNhc3RfbGluay5ocmVmID0gXCJodHRwOi8vd3d3LndlYXRoZXIuY29tL3dlYXRoZXIvNWRheS9sL1wiICsgcGFyc2VkX2FkZHJlc3MuemlwICsgXCI6NDpVU1wiO1xuICAgIH1cblxuXG4gICAgZml2ZV9kYXlfZm9yY2FzdF9saW5rLnRhcmdldCA9IFwiX2JsYW5rXCI7XG4gICAgZml2ZV9kYXlfZm9yY2FzdF9zcGFuLmFwcGVuZENoaWxkKGZpdmVfZGF5X2ZvcmNhc3RfbGluayk7XG5cblxuXG5cbiAgICB3ZWF0aGVyX3JlcG9ydC5hcHBlbmRDaGlsZChpY29uKTtcbiAgICB3ZWF0aGVyX3JlcG9ydC5hcHBlbmRDaGlsZChkZXNjcmlwdGlvbik7XG4gICAgd2VhdGhlcl9yZXBvcnQuYXBwZW5kQ2hpbGQodGVtcCk7XG4gICAgd2VhdGhlcl9yZXBvcnQuYXBwZW5kQ2hpbGQod2luZF9zcGVlZCk7XG4gICAgd2VhdGhlcl9yZXBvcnQuYXBwZW5kQ2hpbGQoZml2ZV9kYXlfZm9yY2FzdF9zcGFuKTtcblxuICAgICQod2VhdGhlcl9yZXBvcnQpLmluc2VydEJlZm9yZSgkKFwiI1wiICsgcmVzb3J0X29iai5pZCArIFwiIC50b2dnbGVfd2lkZ2V0X2xpbmtcIikpO1xuXG5cblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0Q3VycmVudFdlYXRoZXI7IiwiLyoqIGdldHMgc3RhdGljIHJlc29ydCBjb25kaXRpb24gZnJvbSAuanNvbiBmaWxlICovXG5cbnZhciBsb2FkUmVzb3J0cyA9IGZ1bmN0aW9uIChhcmVhLCBjYWxsYmFjaykge1xuXG4gICAgdmFyIGZpbGUgPSBcImpzb24vXCIgKyBhcmVhICsgXCJfcmVzb3J0cy5qc29uXCI7XG5cbiAgICAkLmdldEpTT04oZmlsZSlcbiAgICAgICAgLmRvbmUoZnVuY3Rpb24gKGpzb24pIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGpzb24sIGFyZWEpO1xuICAgICAgICB9KVxuICAgICAgICAuZmFpbChmdW5jdGlvbiAoanF4aHIsIHRleHRTdGF0dXMsIGVycm9yKSB7XG4gICAgICAgICAgICB2YXIgZXJyID0gdGV4dFN0YXR1cyArIFwiLCBcIiArIGVycm9yO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXF1ZXN0IEZhaWxlZDogXCIgKyBlcnIpO1xuICAgICAgICB9KTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxvYWRSZXNvcnRzOyIsInZhciBidWlsZFJlc29ydEJyaWVmRGl2ID0gcmVxdWlyZShcIi4vYnVpbGRfUmVzb3J0X0JyaWVmX0Rpdi5qc1wiKTtcbnZhciByZXF1ZXN0Q3VycmVudFdlYXRoZXIgPSByZXF1aXJlKFwiLi9yZXF1ZXN0X0N1cnJlbnRfV2VhdGhlci5qc1wiKTtcbnZhciBpbnNlcnRDdXJyZW50V2VhdGhlciA9IHJlcXVpcmUoXCIuL2luc2VydF9DdXJyZW50X1dlYXRoZXIuanNcIik7XG52YXIgdXRpbHMgPSByZXF1aXJlKFwiLi91dGlscy5qc1wiKTtcblxuLyoqIGNhbGxzIGJ1aWxkZXIgYW5kIGluc2VydHMgbmV3IHJlc29ydCBzbmlwcGV0cyBvbiBwYWdlICovXG5cbnZhciBwcmludFJlc29ydHMgPSBmdW5jdGlvbiAoanNvbiwgYXJlYSkge1xuICAgIFxuICAgICQoXCIucmVnaW9uX3NlbGVjdGVkXCIpLnRleHQoYXJlYS50b1VwcGVyQ2FzZSgpLnJlcGxhY2UoL18vZyxcIiBcIikpO1xuICAgIFxuICAgIHZhciAkcmVzb3J0c19yZXN1bHRzX2RpdiA9ICQoXCIjcmVzb3J0c19yZXN1bHRzX2RpdlwiKTtcblxuICAgICRyZXNvcnRzX3Jlc3VsdHNfZGl2LmVtcHR5KCk7XG5cbiAgICB2YXIgcmVzb3J0c19hcnIgPSBqc29uW2FyZWFdO1xuICAgIHZhciBhbGxSZXNvcnRzID0gXCJcIjtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gcmVzb3J0c19hcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblxuICAgICAgICByZXNvcnRzX2FycltpXS5pZCA9IHJlc29ydHNfYXJyW2ldLm5hbWUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC8gL2csIFwiX1wiKS5yZXBsYWNlKC9cXC4vZywgXCJcIik7XG4gICAgICAgIFxuICAgICAgICB2YXIgcGFyc2VkX2FkZHJlc3MgPSB1dGlscy5wYXJzZUFkZHJlc3MocmVzb3J0c19hcnJbaV0pO1xuICAgICAgICBcbiAgICAgICAgdmFyIHJlc29ydF9icmllZl9kaXYgPSBidWlsZFJlc29ydEJyaWVmRGl2KHJlc29ydHNfYXJyW2ldLCBwYXJzZWRfYWRkcmVzcyk7XG4gICAgICAgIGFsbFJlc29ydHMgPSBhbGxSZXNvcnRzICsgcmVzb3J0X2JyaWVmX2RpdjtcblxuICAgICAgICByZXF1ZXN0Q3VycmVudFdlYXRoZXIocmVzb3J0c19hcnJbaV0sIHBhcnNlZF9hZGRyZXNzLCBmdW5jdGlvbiAoanNvbiwgbmFtZSkge1xuICAgICAgICAgICAgaW5zZXJ0Q3VycmVudFdlYXRoZXIoanNvbiwgbmFtZSwgcGFyc2VkX2FkZHJlc3MpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvL2luc2VydCBhbGwgcmVzb3J0cyBvbiBwYWdlXG4gICAgJHJlc29ydHNfcmVzdWx0c19kaXYuYXBwZW5kKGFsbFJlc29ydHMpO1xuICAgIFxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gcHJpbnRSZXNvcnRzOyIsIi8qKiBnZXRzIGN1cnJlbnQgd2VhdGhlciBjb25kaXRpb25zIGZyb20gb3BlbndlYXRoZXJtYXAub3JnICovXG5cbnZhciByZXF1ZXN0Q3VycmVudFdlYXRoZXIgPSBmdW5jdGlvbiAocmVzb3J0X29iaiwgcGFyc2VkX2FkZHJlc3MsIGNhbGxiYWNrKSB7XG5cbiAgICB2YXIgbGF0X2xvbiA9IHJlc29ydF9vYmouY29udGFjdF9pbmZvLmxhdF9sb247XG4gICAgaWYgKGxhdF9sb24ubGVuZ3RoID4gMCkge1xuICAgICAgICBsYXRfbG9uID0gbGF0X2xvbi5zcGxpdChcIixcIik7XG4gICAgICAgIHZhciBsYXQgPSBsYXRfbG9uWzBdO1xuICAgICAgICB2YXIgbG9uID0gJC50cmltKGxhdF9sb25bMV0pO1xuICAgICAgICB2YXIgdXJsID0gXCJodHRwOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS93ZWF0aGVyP2xhdD1cIiArIGxhdCArIFwiJmxvbj1cIiArIGxvbiArIFwiJnVuaXRzPUltcGVyaWFsJmFwcGlkPWNjYTcwMWEwMjU0MTA3MmRlOGFlODkyMDZjOWZhZWU5XCI7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgdXJsID0gXCJodHRwOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS93ZWF0aGVyP3ppcD1cIiArIHBhcnNlZF9hZGRyZXNzLnppcCArIFwiLHVzJnVuaXRzPUltcGVyaWFsJmFwcGlkPWNjYTcwMWEwMjU0MTA3MmRlOGFlODkyMDZjOWZhZWU5XCI7XG5cblxuICAgIH1cblxuXG4gICAgJC5nZXRKU09OKHVybClcbiAgICAgICAgLmRvbmUoZnVuY3Rpb24gKGpzb24pIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGpzb24sIHJlc29ydF9vYmopO1xuLy8gICAgICAgIGNvbnNvbGUubG9nKGpzb24pO1xuICAgICAgICB9KVxuICAgICAgICAuZmFpbChmdW5jdGlvbiAoanF4aHIsIHRleHRTdGF0dXMsIGVycm9yKSB7XG4gICAgICAgICAgICB2YXIgZXJyID0gdGV4dFN0YXR1cyArIFwiLCBcIiArIGVycm9yO1xuICAgICAgICB9KTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVlc3RDdXJyZW50V2VhdGhlcjsiLCJ2YXIgcHJpbnRSZXNvcnRzID0gcmVxdWlyZShcIi4vcHJpbnRfUmVzb3J0cy5qc1wiKTtcbnZhciB0b2dnbGVXaWRnZXREaXNwbGF5U2V0dXAgPSByZXF1aXJlKFwiLi90b2dnbGVfV2lkZ2V0X0Rpc3BsYXlfc2V0dXAuanNcIik7XG52YXIgdXRpbHMgPSByZXF1aXJlKFwiLi91dGlscy5qc1wiKTtcblxuXG5cbi8qKiBzZXQgdXAgdGhlIHNvcnQgYmFyIGZ1bmN0aW9uYWxpdHkgKi9cblxudmFyIHNvcnRpbmcgPSB7XG5cbiAgICAvL2hhdmUgYSBjb3B5IG9mIHRoZSBzZWxlY3RlZCBqc29uIGFuZCBhcmVhIGluIHRoaXMgb2JqZWN0IHRvIHVzZSBpbiBzb3J0UmVzb3J0c0FycmF5KCk7XG4gICAgc2VsZWN0ZWRfanNvbjoge30sXG4gICAgc2VsZWN0ZWRfYXJlYToge30sXG5cbiAgICBzZXRTZWxlY3RlZDogZnVuY3Rpb24gKGpzb24sIGFyZWEpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9qc29uID0ganNvbjtcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9hcmVhID0gYXJlYTtcbiAgICB9LFxuXG5cblxuXG5cbiAgICAvL3NvcnRzIHJlc29ydCBqc29uLiBjYWxsZWQgd2hlbiBzb3J0IGxpbmsgaXMgY2xpY2tlZCBvciByZWdpb24gZHJvcGRvd24gaXMgY2hhbmdlZFxuICAgIHNvcnRSZXNvcnRzQXJyYXk6IGZ1bmN0aW9uIChzb3J0X2J5LCBzb3J0X29yZGVyKSB7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBzb3J0X2J5ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBzb3J0X2J5ID0gdGhpcy5jYWNoZWQgPyB0aGlzLmNhY2hlZC5zb3J0X2J5IDogXCJuYW1lXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBzb3J0X29yZGVyID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBzb3J0X29yZGVyID0gdGhpcy5jYWNoZWQgPyB0aGlzLmNhY2hlZC5zb3J0X29yZGVyIDogXCJkZXNjXCI7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHZhciB0aGlzUmVzb3J0QXJyYXkgPSB0aGlzLnNlbGVjdGVkX2pzb25bdGhpcy5zZWxlY3RlZF9hcmVhXTtcblxuICAgICAgICAvL3NvcnQgYnkgbmFtZVxuXG4gICAgICAgIGlmIChzb3J0X2J5ID09PSBcIm5hbWVcIikge1xuICAgICAgICAgICAgdGhpc1Jlc29ydEFycmF5LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYVtzb3J0X2J5XS5sb2NhbGVDb21wYXJlKGJbc29ydF9ieV0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgLy9zb3J0IGJ5IHN0YXRlXG5cbiAgICAgICAgfSBlbHNlIGlmIChzb3J0X2J5ID09PSBcInN0YXRlXCIpIHtcblxuICAgICAgICAgICAgdGhpc1Jlc29ydEFycmF5LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiB1dGlscy5wYXJzZUFkZHJlc3MoYSkuc3RhdGUubG9jYWxlQ29tcGFyZSh1dGlscy5wYXJzZUFkZHJlc3MoYikuc3RhdGUpO1xuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICB9IGVsc2UgeyAvL2ZvciBudW1iZXJlZCBzb3J0cyBpbiB0d28gbGV2ZWxzXG5cbiAgICAgICAgICAgIHZhciBzb3J0X3Nwb3QgPSBzb3J0X2J5LnNwbGl0KFwiLlwiKTtcblxuICAgICAgICAgICAgdGhpc1Jlc29ydEFycmF5LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYVtzb3J0X3Nwb3RbMF1dW3NvcnRfc3BvdFsxXV0gLSBiW3NvcnRfc3BvdFswXV1bc29ydF9zcG90WzFdXTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuXG4gICAgICAgIGlmIChzb3J0X29yZGVyID09PSBcImFzY1wiKSB7XG4gICAgICAgICAgICB0aGlzUmVzb3J0QXJyYXkucmV2ZXJzZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYWNoZWQgPSB7XG4gICAgICAgICAgICBzb3J0X29yZGVyOiBzb3J0X29yZGVyLFxuICAgICAgICAgICAgc29ydF9ieTogc29ydF9ieVxuICAgICAgICB9XG5cbiAgICAgICAgLy9yZWJ1aWxkIHJlc29ydHMgbGlzdCBvbiBzY3JlZW5cbiAgICAgICAgcHJpbnRSZXNvcnRzKHRoaXMuc2VsZWN0ZWRfanNvbiwgdGhpcy5zZWxlY3RlZF9hcmVhKTtcbiAgICAgICAgLy8gZW5hYmxlIHdpZGdldCBkaXNwbGF5IGxpbmtzIG9uIGVhY2ggc25pcHBldFxuICAgICAgICB0b2dnbGVXaWRnZXREaXNwbGF5U2V0dXAoKTtcblxuICAgIH0sXG5cblxuXG4gICAgLy9zb3J0IGJhciBpbml0aWFsaXplciAtIGNhbGxlZCB3aGVuIHBhZ2UgbG9hZHNcbiAgICBzb3J0QmFySW5pdDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICQoXCIjc29ydF9iYXIgLnNvcnRfbGlua1wiKS5jbGljayhmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIHZhciBjbGlja2VkX3NvcnQgPSAkKHRoaXMpO1xuICAgICAgICAgICAgdmFyIHNvcnRfYnkgPSBjbGlja2VkX3NvcnQuYXR0cihcInNvcnRfYnlcIik7XG4gICAgICAgICAgICB2YXIgc29ydF9vcmRlciA9IGNsaWNrZWRfc29ydC5hdHRyKFwic29ydF9vcmRlclwiKTtcblxuICAgICAgICAgICAgJChcIiNzb3J0X2JhciAuc29ydF9saW5rX3NlbGVjdGVkXCIpLnJlbW92ZUNsYXNzKFwic29ydF9saW5rX3NlbGVjdGVkXCIpO1xuICAgICAgICAgICAgY2xpY2tlZF9zb3J0LmFkZENsYXNzKFwic29ydF9saW5rX3NlbGVjdGVkXCIpO1xuXG5cbiAgICAgICAgICAgIC8vaWYgYXNjZW5kaW5nLCBtYWtlIGRlc2NlbmRpbmcgZXRjLlxuXG4gICAgICAgICAgICB2YXIgdHJpYW5nbGUgPSBzb3J0X29yZGVyID09PSBcImFzY1wiID8gXCJcXHUyNUJDXCIgOiBcIlxcdTI1QjJcIjtcbiAgICAgICAgICAgIHZhciBuZXdfc29ydF9vcmRlciA9IHNvcnRfb3JkZXIgPT09IFwiYXNjXCIgPyBcImRlc2NcIiA6IFwiYXNjXCI7XG5cblxuXG4gICAgICAgICAgICAvLyBzb3J0IHRoZSByZXNvcnRzIGFycmF5XG4gICAgICAgICAgICBzb3J0aW5nLnNvcnRSZXNvcnRzQXJyYXkoc29ydF9ieSwgc29ydF9vcmRlcik7XG5cbiAgICAgICAgICAgICQoXCIuc29ydF90cmlhbmdsZVwiLCBjbGlja2VkX3NvcnQpLnRleHQodHJpYW5nbGUpO1xuXG4gICAgICAgICAgICBjbGlja2VkX3NvcnQudG9nZ2xlQ2xhc3MoXCJzb3J0X29yZGVyX2FzYyBzb3J0X29yZGVyX2Rlc2NcIikuYXR0cihcInNvcnRfb3JkZXJcIiwgbmV3X3NvcnRfb3JkZXIpO1xuXG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbn1cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gc29ydGluZzsiLCIvKiogd2hlbiBcIm1vcmVcIiBsaW5rIGlzIGNsaWNrZWQsIGdldHMgd2lkZ2V0IGZvciB0aGF0IHJlc29ydCBhbmQgYXBwZW5kcyBpdCB0byByZXNvcnQgc25pcHBldCAqL1xuXG52YXIgdG9nZ2xlV2lkZ2V0RGlzcGxheVNldHVwID0gZnVuY3Rpb24oKXtcbiAgICBcbiAgICAkKFwiLnRvZ2dsZV93aWRnZXRfbGlua1wiKS5jbGljayhmdW5jdGlvbigpeyAgICBcbiAgICAgICAgXG4gICAgICAgIGlmICgkKHRoaXMpLnRleHQoKSA9PT0gXCJzaG93IGN1cnJlbnQgc3RhdHNcIil7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBjb25kaXRpb25zX3dpZGdldF9jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0X2NvbnRhaW5lci5jbGFzc05hbWUgPSBcImNvbmRpdGlvbnNfd2lkZ2V0X2NvbnRhaW5lclwiO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgY29uZGl0aW9uc193aWRnZXRfc25vd2NvdW50cnlfbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0X3Nub3djb3VudHJ5X2xpbmsuY2xhc3NOYW1lID0gXCJjb25kaXRpb25zX3dpZGdldF9zbm93Y291bnRyeV9saW5rXCI7XG4gICAgICAgICAgICAgICAgY29uZGl0aW9uc193aWRnZXRfc25vd2NvdW50cnlfbGluay50ZXh0Q29udGVudCA9XCJQb3dlcmVkIGJ5IHd3dy5zbm9jb3VudHJ5LmNvbVwiO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0X3Nub3djb3VudHJ5X2xpbmsuaHJlZiA9IFwiaHR0cDovL3d3dy5zbm9jb3VudHJ5LmNvbVwiO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0X3Nub3djb3VudHJ5X2xpbmsudGFyZ2V0ID0gXCJfYmxhbmtcIjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgY29uZGl0aW9uc193aWRnZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaWZyYW1lXCIpO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0LmNsYXNzTmFtZSA9IFwiY29uZGl0aW9uc193aWRnZXRcIjtcbiAgICAgICAgICAgICAgICBjb25kaXRpb25zX3dpZGdldC5zcmMgPSAkKHRoaXMpLmF0dHIoXCJ3aWRnZXRfbGlua1wiKTtcbiAgICAgICAgICAgICAgICBjb25kaXRpb25zX3dpZGdldC5oZWlnaHQgPSBcIjI4MFwiO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0LndpZHRoID0gXCI1OTBcIjtcbiAgICAgICAgICAgICAgICBjb25kaXRpb25zX3dpZGdldC5zZWFtbGVzcz0gXCJzZWFtbGVzc1wiO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0LmZyYW1lQm9yZGVyPVwiMFwiO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0LnNjcm9sbGluZyA9IFwibm9cIjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25kaXRpb25zX3dpZGdldF9jb250YWluZXIuYXBwZW5kQ2hpbGQoY29uZGl0aW9uc193aWRnZXRfc25vd2NvdW50cnlfbGluayk7XG4gICAgICAgICAgICBjb25kaXRpb25zX3dpZGdldF9jb250YWluZXIuYXBwZW5kQ2hpbGQoY29uZGl0aW9uc193aWRnZXQpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgICQodGhpcykudGV4dChcImhpZGUgY3VycmVudCBzdGF0c1wiKVxuICAgICAgICAgICAgICAgIC5jbG9zZXN0KFwiLnJlc29ydF9zbmlwcGV0XCIpLmFwcGVuZChjb25kaXRpb25zX3dpZGdldF9jb250YWluZXIpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICQodGhpcykudGV4dChcInNob3cgY3VycmVudCBzdGF0c1wiKVxuICAgICAgICAgICAgICAgIC5jbG9zZXN0KFwiLnJlc29ydF9zbmlwcGV0XCIpLmZpbmQoXCIuY29uZGl0aW9uc193aWRnZXRfY29udGFpbmVyXCIpLnJlbW92ZSgpO1xuICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgICBcbiAgICAgICAgXG4gICAgfSk7XG4gICAgXG4gICAgXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB0b2dnbGVXaWRnZXREaXNwbGF5U2V0dXA7IiwiICAgICAgdmFyIHV0aWxzID0ge1xuXG4gICAgICAgICAgLyoqIGFkZCBjb21tYXMgZnVuY3Rpb24gKi9cbiAgICAgICAgICBhZGRDb21tYXM6IGZ1bmN0aW9uICh2YWwpIHtcblxuICAgICAgICAgICAgICBpZiAoaXNOYU4odmFsKSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICgodmFsID4gOTk5KSB8fCAodmFsIDwgLTk5OSkpIHtcbiAgICAgICAgICAgICAgICAgIHdoaWxlICgvKFxcZCspKFxcZHszfSkvLnRlc3QodmFsLnRvU3RyaW5nKCkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFsID0gdmFsLnRvU3RyaW5nKCkucmVwbGFjZSgvKFxcZCspKFxcZHszfSkvLCAnJDEnICsgJywnICsgJyQyJyk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgLyoqIHJldHVybiBfc20gZm9yIGltYWdlIG5hbWUgKi9cbiAgICAgICAgICB0aHVtYm5haWxOYW1lOiBmdW5jdGlvbiAoaW1hZ2VfbmFtZSkge1xuICAgICAgICAgICAgICByZXR1cm4gaW1hZ2VfbmFtZS5yZXBsYWNlKCcucG5nJywgJ19zbS5wbmcnKS5yZXBsYWNlKCcuanBnJywgJ19zbS5qcGcnKS5yZXBsYWNlKCcuanBlZycsICdfc20uanBlZycpO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICAvKiogcmV0dXJuIG1vZGRlZCBsYW5ndWFnZSBmb3Igd2VhdGhlciBkZXNjcmlwdGlvbiAqL1xuICAgICAgICAgIHdlYXRoZXJEZXNjcmlwdG9yOiBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzdHJpbmcucmVwbGFjZShcIm92ZXJjYXN0IGNsb3Vkc1wiLCBcIm92ZXJjYXN0XCIpLnJlcGxhY2UoXCJza3kgaXMgY2xlYXJcIiwgXCJjbGVhciBza2llc1wiKTtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgcGhvbmVGb3JtYXQ6IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC9cXCh8XFwpL2csIFwiXCIpLnJlcGxhY2UoLy18IC9nLCBcIiYjODIwOTtcIik7XG4gICAgICAgICAgfSxcblxuXG4gICAgICAgICAgcGFyc2VBZGRyZXNzOiBmdW5jdGlvbiAocmVzb3J0X29iaikge1xuICAgICAgICAgICAgICB2YXIgcGFyc2VkX2FkZHJlc3MgPSB7fTtcblxuICAgICAgICAgICAgICAvL2lmIHBhcnRzIGFyZSB0aGVyZSwgdXNlIHRob3NlXG4gICAgICAgICAgICAgIHBhcnNlZF9hZGRyZXNzLnN0cmVldF9hZHJlc3MgPSByZXNvcnRfb2JqLmNvbnRhY3RfaW5mby5zdHJlZXRfYWRkcmVzcyB8fCBcIlwiO1xuICAgICAgICAgICAgICBwYXJzZWRfYWRkcmVzcy5jaXR5ID0gcmVzb3J0X29iai5jb250YWN0X2luZm8uY2l0eSB8fCBcIlwiO1xuICAgICAgICAgICAgICBwYXJzZWRfYWRkcmVzcy5zdGF0ZSA9IHJlc29ydF9vYmouY29udGFjdF9pbmZvLnN0YXRlIHx8IFwiXCI7XG4gICAgICAgICAgICAgIHBhcnNlZF9hZGRyZXNzLnppcCA9IHJlc29ydF9vYmouY29udGFjdF9pbmZvLnppcCB8fCBcIlwiO1xuXG4gICAgICAgICAgICAgIC8vZnVsbCBhZGRyZXNzIHVzZXMgZnVsbCBpZiBpdHMgdGhlcmUsIG9yIGEgY29tYmluYXRpb24gaWYgaXQncyBub3RcbiAgICAgICAgICAgICAgcGFyc2VkX2FkZHJlc3MuZnVsbF9hZGRyZXNzID0gcmVzb3J0X29iai5jb250YWN0X2luZm8uZnVsbF9hZGRyZXNzIHx8IHJlc29ydF9vYmouY29udGFjdF9pbmZvLnN0cmVldF9hZGRyZXNzICsgXCIsIFwiICsgcmVzb3J0X29iai5jb250YWN0X2luZm8uY2l0eSArIFwiLCBcIiArIHJlc29ydF9vYmouY29udGFjdF9pbmZvLnN0YXRlICsgXCIgXCIgKyByZXNvcnRfb2JqLmNvbnRhY3RfaW5mby56aXA7XG5cbiAgICAgICAgICAgICAgLy9pZiBmdWxsIGFkZHJlc3MgaXMgdGhlcmUsIHBhcnNlIGl0IGZvciBwYXJ0cyBvZiB0aGUgYWRkcmVzc1xuICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlc29ydF9vYmouY29udGFjdF9pbmZvLmZ1bGxfYWRkcmVzcyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgdmFyIGFkZHJlc3NfYXJyID0gcmVzb3J0X29iai5jb250YWN0X2luZm8uZnVsbF9hZGRyZXNzLnNwbGl0KFwiLFwiKTtcblxuICAgICAgICAgICAgICAgICAgcGFyc2VkX2FkZHJlc3MuemlwID0gYWRkcmVzc19hcnJbYWRkcmVzc19hcnIubGVuZ3RoIC0gMV0uc2xpY2UoMyk7XG4gICAgICAgICAgICAgICAgICBwYXJzZWRfYWRkcmVzcy5zdGF0ZSA9IGFkZHJlc3NfYXJyW2FkZHJlc3NfYXJyLmxlbmd0aCAtIDFdLnNsaWNlKDEsIDMpO1xuICAgICAgICAgICAgICAgICAgcGFyc2VkX2FkZHJlc3MuY2l0eSA9IGFkZHJlc3NfYXJyW2FkZHJlc3NfYXJyLmxlbmd0aCAtIDJdO1xuICAgICAgICAgICAgICAgICAgcGFyc2VkX2FkZHJlc3Muc3RyZWV0X2FkcmVzcyA9IGFkZHJlc3NfYXJyLnNsaWNlKDAsIGFkZHJlc3NfYXJyLmxlbmd0aCAtIDIpLmpvaW4oXCIsXCIpO1xuXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICByZXR1cm4gcGFyc2VkX2FkZHJlc3M7XG5cbiAgICAgICAgICB9LFxuICAgICAgICAgIFxuXG4gICAgICAgICAgdXJsRm9ybWF0OiBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gICAgICAgICAgICAgIGlmIChzdHJpbmcuc2xpY2UoMCwgMykgPT09IFwid3d3XCIpIHtcbiAgICAgICAgICAgICAgICAgIHN0cmluZyA9IFwiaHR0cDovL1wiICsgc3RyaW5nO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBzdHJpbmc7XG4gICAgICAgICAgfVxuXG4gICAgICB9XG5cblxuICAgICAgbW9kdWxlLmV4cG9ydHMgPSB1dGlsczsiXX0=
