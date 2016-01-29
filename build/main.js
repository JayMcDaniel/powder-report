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
    
    
    var resorts_results_div = $("#resorts_results_div");

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
  
    resorts_results_div.append(allResorts);
    
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzX3NyYy9hcHAuanMiLCJzY3JpcHRzX3NyYy9hcmVhX3NlbGVjdG9yLmpzIiwic2NyaXB0c19zcmMvYnVpbGRfUmVzb3J0X0JyaWVmX0Rpdi5qcyIsInNjcmlwdHNfc3JjL2ZpbHRlcl9SZXNvcnRzX1NldHVwLmpzIiwic2NyaXB0c19zcmMvaW5zZXJ0X0N1cnJlbnRfV2VhdGhlci5qcyIsInNjcmlwdHNfc3JjL2xvYWRfUmVzb3J0cy5qcyIsInNjcmlwdHNfc3JjL3ByaW50X1Jlc29ydHMuanMiLCJzY3JpcHRzX3NyYy9yZXF1ZXN0X0N1cnJlbnRfV2VhdGhlci5qcyIsInNjcmlwdHNfc3JjL3NvcnRpbmcuanMiLCJzY3JpcHRzX3NyYy90b2dnbGVfV2lkZ2V0X0Rpc3BsYXlfc2V0dXAuanMiLCJzY3JpcHRzX3NyYy91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGxvYWRSZXNvcnRzID0gcmVxdWlyZShcIi4vbG9hZF9SZXNvcnRzLmpzXCIpO1xudmFyIHByaW50UmVzb3J0cyA9IHJlcXVpcmUoXCIuL3ByaW50X1Jlc29ydHMuanNcIik7XG52YXIgdG9nZ2xlV2lkZ2V0RGlzcGxheVNldHVwID0gcmVxdWlyZShcIi4vdG9nZ2xlX1dpZGdldF9EaXNwbGF5X3NldHVwLmpzXCIpO1xudmFyIHNvcnRpbmcgPSByZXF1aXJlKFwiLi9zb3J0aW5nLmpzXCIpO1xudmFyIGFyZWFfc2VsZWN0b3IgPSByZXF1aXJlKFwiLi9hcmVhX3NlbGVjdG9yLmpzXCIpO1xudmFyIGZpbHRlclJlc29ydHNTZXR1cCA9IHJlcXVpcmUoXCIuL2ZpbHRlcl9SZXNvcnRzX1NldHVwLmpzXCIpO1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgYXJlYSA9IGFyZWFfc2VsZWN0b3IucGFnZUxvYWQoKTtcblxuICAgIC8qKiBnZXQgdGhlIHJlc29ydCBqc29uIGZyb20gc2VsZWN0ZWQgYXJlYSAqL1xuICAgIGxvYWRSZXNvcnRzKGFyZWEsIGZ1bmN0aW9uIChqc29uLCBhcmVhKSB7XG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgdG9nZ2xlV2lkZ2V0RGlzcGxheVNldHVwKCk7XG4gICAgICAgIHNvcnRpbmcuc2V0U2VsZWN0ZWQoanNvbiwgYXJlYSk7XG4gICAgICAgIHNvcnRpbmcuc29ydEJhckluaXQoKTtcbiAgICAgICAgc29ydGluZy5zb3J0UmVzb3J0c0FycmF5KCk7XG4gICAgICAgIFxuICAgICAgICBwcmludFJlc29ydHMoanNvbiwgYXJlYSk7XG5cbiAgICAgICAgLy9pbml0aWFsaXplIGFyZSBkcm9wZG93biBtZW51O1xuXG4gICAgICAgIGFyZWFfc2VsZWN0b3IuZHJvcGRvd25Jbml0KCk7XG5cbiAgICB9KTtcblxuXG4gICAgZmlsdGVyUmVzb3J0c1NldHVwKCk7XG5cblxufSk7IiwidmFyIGxvYWRSZXNvcnRzID0gcmVxdWlyZShcIi4vbG9hZF9SZXNvcnRzLmpzXCIpO1xudmFyIHByaW50UmVzb3J0cyA9IHJlcXVpcmUoXCIuL3ByaW50X1Jlc29ydHMuanNcIik7XG52YXIgdG9nZ2xlV2lkZ2V0RGlzcGxheVNldHVwID0gcmVxdWlyZShcIi4vdG9nZ2xlX1dpZGdldF9EaXNwbGF5X3NldHVwLmpzXCIpO1xudmFyIHNvcnRpbmcgPSByZXF1aXJlKFwiLi9zb3J0aW5nLmpzXCIpO1xuXG5cbnZhciBhcmVhX3NlbGVjdG9yID0ge1xuXG4gICAgcGFnZUxvYWQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAvL2xvb2sgYXQgaW5pdGlhbCBwYWdlIHVybCBhbmQgcSBzdHJpbmcgdG8gZ2V0IGFyZWFcblxuICAgICAgICB2YXIgYXJlYSA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnNsaWNlKDEpIHx8IFwibWlkX2F0bGFudGljXCI7XG5cbiAgICAgICAgLy9zZXQgaW5pdGlhbCB2YWx1ZSBvZiByZXNvcnRfc2VsZWN0aW9uX2Ryb3Bkb3duIFxuICAgICAgICAkKFwiI3Jlc29ydF9zZWxlY3Rpb25fZHJvcGRvd25cIikudmFsKGFyZWEpO1xuXG4gICAgICAgIHJldHVybiBhcmVhO1xuXG4gICAgfSxcblxuICAgIGRyb3Bkb3duSW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAkKFwiI3Jlc29ydF9zZWxlY3Rpb25fZHJvcGRvd25cIikuY2hhbmdlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhcmVhID0gJCh0aGlzKS52YWwoKTtcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gYXJlYTtcblxuXG4gICAgICAgICAgICAvKiogZ2V0IHRoZSByZXNvcnQganNvbiBmcm9tIHNlbGVjdGVkIGFyZWEgKi9cbiAgICAgICAgICAgIGxvYWRSZXNvcnRzKGFyZWEsIGZ1bmN0aW9uIChqc29uLCBhcmVhKSB7XG4gICAgICAgICAgICAgICAgc29ydGluZy5zZXRTZWxlY3RlZChqc29uLCBhcmVhKTtcbiAgICAgICAgICAgICAgICBzb3J0aW5nLnNvcnRSZXNvcnRzQXJyYXkoKTsgLy9ub3Qgc3VwcGx5aW5nIHNvcnRfYnkgYW5kIHNvcnRfb3JkZXIgdG8gdXNlIGZ1bmN0aW9uIGNhY2hlO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRvZ2dsZVdpZGdldERpc3BsYXlTZXR1cCgpO1xuXG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcmVhX3NlbGVjdG9yOyIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMuanMnKTtcbi8qKiBidWlsZHMgaHRtbCBmcm9tIF9yZXNvcnRzLmpzb24gYW5kIHJldHVybnMgaXQgYXMgYSAucmVzb3J0X3NuaXBwZXQgZGl2Ki9cblxudmFyIGJ1aWxkUmVzb3J0QnJpZWZEaXYgPSBmdW5jdGlvbiAocmVzb3J0X29iaiwgcGFyc2VkX2FkZHJlc3MpIHtcbiAgICBcblxuXG4gICAgdmFyIG5hbWVfYW5kX2xvZ28gPSBcIjxhIGNsYXNzID0gJ3Jlc29ydF9uYW1lJyB0YXJnZXQgPSdfYmxhbmsnIGhyZWYgPSdcIiArIHV0aWxzLnVybEZvcm1hdChyZXNvcnRfb2JqLmNvbnRhY3RfaW5mby51cmwpICsgXCInPjxoMz48aW1nIGNsYXNzID0ncmVzb3J0X2xvZ29faW1nJyBzcmMgPSAnaW1hZ2VzL3Jlc29ydF9sb2dvcy9cIiArIHJlc29ydF9vYmouaW1hZ2VzLmxvZ28gKyBcIicvPlwiICsgcmVzb3J0X29iai5uYW1lICsgXCIgPHNwYW4gY2xhc3M9J3Jlc29ydF9zdGF0ZSc+XCIgKyBwYXJzZWRfYWRkcmVzcy5zdGF0ZSArIFwiPC9zcGFuPjwvaDM+PC9hPlwiO1xuXG4gICAgdmFyIHRyYWlscyA9IFwiPHNwYW4gY2xhc3MgPSAndHJhaWxzIHJlcG9ydCc+XCIgKyByZXNvcnRfb2JqLnN0YXRzLnRyYWlscyArIFwiJm5ic3A7dHJhaWxzIDwvc3Bhbj5cIjtcblxuICAgIHZhciBsaWZ0cyA9IFwiPHNwYW4gY2xhc3MgPSAnbGlmdHMgcmVwb3J0Jz5cIiArIHJlc29ydF9vYmouc3RhdHMubGlmdHMgKyBcIiZuYnNwO2xpZnRzIDwvc3Bhbj5cIjtcblxuICAgIHZhciBhY3JlcyA9IFwiPHNwYW4gY2xhc3MgPSAnYWNyZXMgcmVwb3J0Jz5cIiArIHV0aWxzLmFkZENvbW1hcyhyZXNvcnRfb2JqLnN0YXRzLnNraWFibGVfYWNyZXMpICsgXCImbmJzcDthY3Jlczwvc3Bhbj5cIjtcbiAgICBcbiAgICB2YXIgcGVhayA9IFwiPHNwYW4gY2xhc3MgPSAncGVhayByZXBvcnQnPlwiICsgdXRpbHMuYWRkQ29tbWFzKHJlc29ydF9vYmouc3RhdHMucGVhaykgKyBcIicmbmJzcDtwZWFrPC9zcGFuPlwiO1xuXG4gICAgdmFyIHZlcnQgPSBcIjxzcGFuIGNsYXNzID0gJ3ZlcnQgcmVwb3J0Jz5cIiArIHV0aWxzLmFkZENvbW1hcyhyZXNvcnRfb2JqLnN0YXRzLnZlcnRpY2FsX2Ryb3BfZnQpICsgXCInJm5ic3A7dmVydGljYWwmbmJzcDtkcm9wPC9zcGFuPlwiO1xuXG4gICAgdmFyIGZ1bGxfYWRkcmVzcyA9IFwiPGEgdGFyZ2V0ID0nX2JsYW5rJyBocmVmID0nXCIgKyByZXNvcnRfb2JqLmNvbnRhY3RfaW5mby5hZGRyZXNzX3VybCArIFwiJz48c3BhbiBjbGFzcyA9ICdmdWxsX2FkZHJlc3MnPlwiICsgcGFyc2VkX2FkZHJlc3MuZnVsbF9hZGRyZXNzICsgXCI8L3NwYW4+PC9hPiBcIjtcblxuICAgIHZhciByYXRlcyA9IFwiUmF0ZXMgKG1pZHdlZWsgb3IgZGlzY291bnQgLyB3ZWVrZW5kIG9yIHByaW1lKTogPHNwYW4gY2xhc3MgPSAncmF0ZXNfYWR1bHQgcmVwb3J0Jz5BZHVsdDombmJzcDskXCIgKyByZXNvcnRfb2JqLnJhdGVzLmFkdWx0c19taWR3ZWVrICsgXCImbmJzcDsvJm5ic3A7JFwiICsgcmVzb3J0X29iai5yYXRlcy5hZHVsdHNfcHJpbWUgKyBcIiZuYnNwOzwvc3Bhbj5cXFxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzID0gJ3JhdGVzX2p1bmlvciByZXBvcnQnPkp1bmlvcjombmJzcDskXCIgKyByZXNvcnRfb2JqLnJhdGVzLmp1bmlvcnNfbWlkd2VlayArIFwiJm5ic3A7LyZuYnNwOyRcIiArIHJlc29ydF9vYmoucmF0ZXMuanVuaW9yc19wcmltZSArIFwiPC9zcGFuPiA8YSBjbGFzcyA9ICdyYXRlc191cmwnIHRhcmdldCA9J19ibGFuaycgaHJlZiA9J1wiICsgcmVzb3J0X29iai5yYXRlcy5yYXRlc191cmwgKyBcIic+R2V0IHRpY2tldHM8L2E+XCI7XG5cbiAgICB2YXIgcGhvbmUgPSBcIjxzcGFuIGNsYXNzID0ncmVzb3J0X3Bob25lX251bWJlcic+XCIgKyB1dGlscy5waG9uZUZvcm1hdChyZXNvcnRfb2JqLmNvbnRhY3RfaW5mby5waG9uZSkgKyBcIjwvc3Bhbj5cIjtcblxuXG4gICAgdmFyIHRvZ2dsZV93aWRnZXRfbGluayA9IFwiPHNwYW4gY2xhc3MgPSAndG9nZ2xlX3dpZGdldF9saW5rIHJlcG9ydCcgd2lkZ2V0X2xpbmsgPSBcIiArIHJlc29ydF9vYmouc3RhdHMud2lkZ2V0X2xpbmsgKyBcIj5zaG93IGN1cnJlbnQgc3RhdHM8L3NwYW4+XCJcblxuICAgIHZhciBtYXBfdGh1bWJuYWlsID0gXCI8ZGl2IGNsYXNzPSdtYXBfdGh1bWJuYWlsJz4gPGEgdGFyZ2V0ID0nX2JsYW5rJyBocmVmPSdpbWFnZXMvcmVzb3J0X21hcHMvXCIgKyByZXNvcnRfb2JqLmltYWdlcy5tYXAgKyBcIic+PGltZyBzcmM9J2ltYWdlcy9yZXNvcnRfbWFwcy9cIiArIHV0aWxzLnRodW1ibmFpbE5hbWUocmVzb3J0X29iai5pbWFnZXMubWFwKSArIFwiJy8+PC9hPjwvZGl2PlwiO1xuXG5cbiAgICB2YXIgc25pcHBldCA9IFwiPGRpdiBjbGFzcz0ncmVzb3J0X3NuaXBwZXQnIGlkID0nXCIgKyByZXNvcnRfb2JqLmlkICsgXCInID5cIiArIG5hbWVfYW5kX2xvZ28gKyBcIlxcXG4gICAgICAgIFwiICsgbWFwX3RodW1ibmFpbCArIFwiPGRpdiBjbGFzcz0ncmVzb3J0X3NuaXBwZXRfdGV4dCc+XFxcbiAgICAgICAgPHNwYW4gY2xhc3M9J3N0YXRzX3JlcG9ydCc+XCIgKyB0cmFpbHMgKyBsaWZ0cyArIGFjcmVzICsgcGVhayArIHZlcnQgKyBcIjwvc3Bhbj48YnIvPlxcXG4gICAgICAgIFwiICsgcmF0ZXMgKyBcIjxicj48cCBjbGFzcz0nY29udGFjdF9pbmZvJz5cXFxuICAgICAgICBcIiArIGZ1bGxfYWRkcmVzcyArIHBob25lICsgXCI8L3A+XFxcbiAgICAgICAgXCIgKyB0b2dnbGVfd2lkZ2V0X2xpbmsgKyBcIjwvZGl2PlxcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPSdjbGVhcl9mbG9hdCc+PC9kaXY+XFxcbiAgICAgICAgPC9kaXY+XCI7XG5cblxuXG4gICAgcmV0dXJuIHNuaXBwZXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYnVpbGRSZXNvcnRCcmllZkRpdjsiLCIvKiogc2V0cyB1cCB0aGUgZmlsdGVyX3Jlc29ydHMgc2VhcmNoIGJveCB0byBkaXNwbGF5IG9ubHkgdGhlIHJlc29ydCBzbmlwcGV0cyB0aGF0IHVzZXIgdHlwZXMgaW4gKi9cblxudmFyIGZpbHRlclJlc29ydHNTZXR1cCA9IGZ1bmN0aW9uIGZpbHRlclJlc29ydHNTZXR1cCgpe1xuICAgIHZhciAkZmlsdGVyX2lucHV0ID0gJCggXCIjZmlsdGVyX3Jlc29ydHNcIiApO1xuICAgIFxuICAgIFxuJGZpbHRlcl9pbnB1dC5rZXl1cChmdW5jdGlvbigpIHtcbiAgICB2YXIgZmlsdGVyX2lkID0gJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1xccysvaSxcIl9cIikucmVwbGFjZSgvXFwuKy9pLFwiXCIpO1xuICAgIGlmIChmaWx0ZXJfaWQgPT09IFwiXCIpe1xuICAgICAgICAkKFwiLnJlc29ydF9zbmlwcGV0XCIpLnNob3coKTtcbiAgICB9ZWxzZXtcbiAgICAgICAgJChcIi5yZXNvcnRfc25pcHBldFwiKS5oaWRlKCk7XG4gICAgICAgICQoIFwiW2lkKj0nXCIgKyBmaWx0ZXJfaWQgKyBcIiddXCIgKS5zaG93KCk7XG4gICAgfVxuXG59KTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbHRlclJlc29ydHNTZXR1cDsiLCJ2YXIgdXRpbHMgPSByZXF1aXJlKFwiLi91dGlscy5qc1wiKTtcblxuLyoqIGJ1aWxkcyBodG1sIGZyb20gd2VhdGhlciBqc29uIGFuZCBpbnNlcnRzIHdlYXRoZXIgcmVwb3J0IHNwYW4gKi9cblxudmFyIGluc2VydEN1cnJlbnRXZWF0aGVyID0gZnVuY3Rpb24gKGpzb24sIHJlc29ydF9vYmosIHBhcnNlZF9hZGRyZXNzKSB7XG4gICAgXG5cbiAgICAkKFwiI1wiICsgcmVzb3J0X29iai5pZCArIFwiIC53ZWF0aGVyX3JlcG9ydFwiKS5yZW1vdmUoKTtcblxuICAgIHZhciB3ZWF0aGVyX3JlcG9ydCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgIHdlYXRoZXJfcmVwb3J0LmNsYXNzTmFtZSA9IFwid2VhdGhlcl9yZXBvcnRcIjtcblxuICAgIHZhciBpY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICBpY29uLmNsYXNzTmFtZSA9IFwid2VhdGhlcl9pY29uXCI7XG4gICAgaWNvbi5zcmMgPSBcImh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvXCIgKyBqc29uLndlYXRoZXJbMF0uaWNvbiArIFwiLnBuZ1wiO1xuXG4gICAgdmFyIGRlc2NyaXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgZGVzY3JpcHRpb24uY2xhc3NOYW1lID0gXCJ3ZWF0aGVyX2Rlc2NyaXB0aW9uXCI7XG4gICAgZGVzY3JpcHRpb24udGV4dENvbnRlbnQgPSB1dGlscy53ZWF0aGVyRGVzY3JpcHRvcihqc29uLndlYXRoZXJbMF0uZGVzY3JpcHRpb24pICsgXCIgXCI7XG5cbiAgICB2YXIgdGVtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgIHRlbXAuY2xhc3NOYW1lID0gXCJ3ZWF0aGVyX3RlbXBcIjtcbiAgICB0ZW1wLnRleHRDb250ZW50ID0ganNvbi5tYWluLnRlbXAudG9GaXhlZCgxKSArIFwiXFx1MjEwOSBcIjsgLy9zeW1ib2wgZm9yIGRlZ3JlZXMgRlxuXG4gICAgdmFyIHdpbmRfc3BlZWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICB3aW5kX3NwZWVkLmNsYXNzTmFtZSA9IFwid2VhdGhlcl93aW5kX3NwZWVkXCI7XG4gICAgd2luZF9zcGVlZC50ZXh0Q29udGVudCA9IFwid2luZDpcXHUwMGEwXCIgKyBqc29uLndpbmQuc3BlZWQudG9GaXhlZCgxKSArIFwiXFx1MDBhMG1waFwiO1xuXG4gICAgdmFyIGZpdmVfZGF5X2ZvcmNhc3Rfc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgIHZhciBmaXZlX2RheV9mb3JjYXN0X2xpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICBmaXZlX2RheV9mb3JjYXN0X2xpbmsuY2xhc3NOYW1lID0gXCJmaXZlX2RheV9mb3JjYXN0X2xpbmtcIjtcbiAgICBmaXZlX2RheV9mb3JjYXN0X2xpbmsudGV4dENvbnRlbnQgPSBcIjVcXHUyMDExZGF5XFx1MDBBMGZvcmNhc3RcIjtcblxuICAgIC8vaWYgbW9yZSBhY2N1cmF0ZSB3ZWF0aGVyIGxpbmsgaXMgYXZhaWxhYmxlLCB1c2UgdGhhdCBpbnN0ZWFkIG9mIHppcCBjb2RlXG4gICAgaWYgKHR5cGVvZiByZXNvcnRfb2JqLndlYXRoZXJfZm9yY2FzdF91cmwgIT0gXCJ1bmRlZmluZWRcIiAmJiByZXNvcnRfb2JqLndlYXRoZXJfZm9yY2FzdF91cmwubGVuZ3RoID4gMCkge1xuICAgICAgICBmaXZlX2RheV9mb3JjYXN0X2xpbmsuaHJlZiA9IHJlc29ydF9vYmoud2VhdGhlcl9mb3JjYXN0X3VybDtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZpdmVfZGF5X2ZvcmNhc3RfbGluay5ocmVmID0gXCJodHRwOi8vd3d3LndlYXRoZXIuY29tL3dlYXRoZXIvNWRheS9sL1wiICsgcGFyc2VkX2FkZHJlc3MuemlwICsgXCI6NDpVU1wiO1xuICAgIH1cblxuXG4gICAgZml2ZV9kYXlfZm9yY2FzdF9saW5rLnRhcmdldCA9IFwiX2JsYW5rXCI7XG4gICAgZml2ZV9kYXlfZm9yY2FzdF9zcGFuLmFwcGVuZENoaWxkKGZpdmVfZGF5X2ZvcmNhc3RfbGluayk7XG5cblxuXG5cbiAgICB3ZWF0aGVyX3JlcG9ydC5hcHBlbmRDaGlsZChpY29uKTtcbiAgICB3ZWF0aGVyX3JlcG9ydC5hcHBlbmRDaGlsZChkZXNjcmlwdGlvbik7XG4gICAgd2VhdGhlcl9yZXBvcnQuYXBwZW5kQ2hpbGQodGVtcCk7XG4gICAgd2VhdGhlcl9yZXBvcnQuYXBwZW5kQ2hpbGQod2luZF9zcGVlZCk7XG4gICAgd2VhdGhlcl9yZXBvcnQuYXBwZW5kQ2hpbGQoZml2ZV9kYXlfZm9yY2FzdF9zcGFuKTtcblxuICAgICQod2VhdGhlcl9yZXBvcnQpLmluc2VydEJlZm9yZSgkKFwiI1wiICsgcmVzb3J0X29iai5pZCArIFwiIC50b2dnbGVfd2lkZ2V0X2xpbmtcIikpO1xuXG5cblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0Q3VycmVudFdlYXRoZXI7IiwiLyoqIGdldHMgc3RhdGljIHJlc29ydCBjb25kaXRpb24gZnJvbSAuanNvbiBmaWxlICovXG5cbnZhciBsb2FkUmVzb3J0cyA9IGZ1bmN0aW9uIChhcmVhLCBjYWxsYmFjaykge1xuXG4gICAgdmFyIGZpbGUgPSBcImpzb24vXCIgKyBhcmVhICsgXCJfcmVzb3J0cy5qc29uXCI7XG5cbiAgICAkLmdldEpTT04oZmlsZSlcbiAgICAgICAgLmRvbmUoZnVuY3Rpb24gKGpzb24pIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGpzb24sIGFyZWEpO1xuICAgICAgICB9KVxuICAgICAgICAuZmFpbChmdW5jdGlvbiAoanF4aHIsIHRleHRTdGF0dXMsIGVycm9yKSB7XG4gICAgICAgICAgICB2YXIgZXJyID0gdGV4dFN0YXR1cyArIFwiLCBcIiArIGVycm9yO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXF1ZXN0IEZhaWxlZDogXCIgKyBlcnIpO1xuICAgICAgICB9KTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxvYWRSZXNvcnRzOyIsInZhciBidWlsZFJlc29ydEJyaWVmRGl2ID0gcmVxdWlyZShcIi4vYnVpbGRfUmVzb3J0X0JyaWVmX0Rpdi5qc1wiKTtcbnZhciByZXF1ZXN0Q3VycmVudFdlYXRoZXIgPSByZXF1aXJlKFwiLi9yZXF1ZXN0X0N1cnJlbnRfV2VhdGhlci5qc1wiKTtcbnZhciBpbnNlcnRDdXJyZW50V2VhdGhlciA9IHJlcXVpcmUoXCIuL2luc2VydF9DdXJyZW50X1dlYXRoZXIuanNcIik7XG52YXIgdXRpbHMgPSByZXF1aXJlKFwiLi91dGlscy5qc1wiKTtcblxuLyoqIGNhbGxzIGJ1aWxkZXIgYW5kIGluc2VydHMgbmV3IHJlc29ydCBzbmlwcGV0cyBvbiBwYWdlICovXG5cbnZhciBwcmludFJlc29ydHMgPSBmdW5jdGlvbiAoanNvbiwgYXJlYSkge1xuICAgIFxuICAgICQoXCIucmVnaW9uX3NlbGVjdGVkXCIpLnRleHQoYXJlYS50b1VwcGVyQ2FzZSgpLnJlcGxhY2UoL18vZyxcIiBcIikpO1xuICAgIFxuICAgIFxuICAgIHZhciByZXNvcnRzX3Jlc3VsdHNfZGl2ID0gJChcIiNyZXNvcnRzX3Jlc3VsdHNfZGl2XCIpO1xuXG4gICAgdmFyIHJlc29ydHNfYXJyID0ganNvblthcmVhXTtcbiAgICB2YXIgYWxsUmVzb3J0cyA9IFwiXCI7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHJlc29ydHNfYXJyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cbiAgICAgICAgcmVzb3J0c19hcnJbaV0uaWQgPSByZXNvcnRzX2FycltpXS5uYW1lLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvIC9nLCBcIl9cIikucmVwbGFjZSgvXFwuL2csIFwiXCIpO1xuICAgICAgICBcbiAgICAgICAgdmFyIHBhcnNlZF9hZGRyZXNzID0gdXRpbHMucGFyc2VBZGRyZXNzKHJlc29ydHNfYXJyW2ldKTtcbiAgICAgICAgXG4gICAgICAgIHZhciByZXNvcnRfYnJpZWZfZGl2ID0gYnVpbGRSZXNvcnRCcmllZkRpdihyZXNvcnRzX2FycltpXSwgcGFyc2VkX2FkZHJlc3MpO1xuICAgICAgICBhbGxSZXNvcnRzID0gYWxsUmVzb3J0cyArIHJlc29ydF9icmllZl9kaXY7XG5cbiAgICAgICAgcmVxdWVzdEN1cnJlbnRXZWF0aGVyKHJlc29ydHNfYXJyW2ldLCBwYXJzZWRfYWRkcmVzcywgZnVuY3Rpb24gKGpzb24sIG5hbWUpIHtcbiAgICAgICAgICAgIGluc2VydEN1cnJlbnRXZWF0aGVyKGpzb24sIG5hbWUsIHBhcnNlZF9hZGRyZXNzKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vaW5zZXJ0IGFsbCByZXNvcnRzIG9uIHBhZ2VcbiAgXG4gICAgcmVzb3J0c19yZXN1bHRzX2Rpdi5hcHBlbmQoYWxsUmVzb3J0cyk7XG4gICAgXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBwcmludFJlc29ydHM7IiwiLyoqIGdldHMgY3VycmVudCB3ZWF0aGVyIGNvbmRpdGlvbnMgZnJvbSBvcGVud2VhdGhlcm1hcC5vcmcgKi9cblxudmFyIHJlcXVlc3RDdXJyZW50V2VhdGhlciA9IGZ1bmN0aW9uIChyZXNvcnRfb2JqLCBwYXJzZWRfYWRkcmVzcywgY2FsbGJhY2spIHtcblxuICAgIHZhciBsYXRfbG9uID0gcmVzb3J0X29iai5jb250YWN0X2luZm8ubGF0X2xvbjtcbiAgICBpZiAobGF0X2xvbi5sZW5ndGggPiAwKSB7XG4gICAgICAgIGxhdF9sb24gPSBsYXRfbG9uLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgdmFyIGxhdCA9IGxhdF9sb25bMF07XG4gICAgICAgIHZhciBsb24gPSAkLnRyaW0obGF0X2xvblsxXSk7XG4gICAgICAgIHZhciB1cmwgPSBcImh0dHA6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L3dlYXRoZXI/bGF0PVwiICsgbGF0ICsgXCImbG9uPVwiICsgbG9uICsgXCImdW5pdHM9SW1wZXJpYWwmYXBwaWQ9Y2NhNzAxYTAyNTQxMDcyZGU4YWU4OTIwNmM5ZmFlZTlcIjtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciB1cmwgPSBcImh0dHA6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L3dlYXRoZXI/emlwPVwiICsgcGFyc2VkX2FkZHJlc3MuemlwICsgXCIsdXMmdW5pdHM9SW1wZXJpYWwmYXBwaWQ9Y2NhNzAxYTAyNTQxMDcyZGU4YWU4OTIwNmM5ZmFlZTlcIjtcblxuXG4gICAgfVxuXG5cbiAgICAkLmdldEpTT04odXJsKVxuICAgICAgICAuZG9uZShmdW5jdGlvbiAoanNvbikge1xuICAgICAgICAgICAgY2FsbGJhY2soanNvbiwgcmVzb3J0X29iaik7XG4vLyAgICAgICAgY29uc29sZS5sb2coanNvbik7XG4gICAgICAgIH0pXG4gICAgICAgIC5mYWlsKGZ1bmN0aW9uIChqcXhociwgdGV4dFN0YXR1cywgZXJyb3IpIHtcbiAgICAgICAgICAgIHZhciBlcnIgPSB0ZXh0U3RhdHVzICsgXCIsIFwiICsgZXJyb3I7XG4gICAgICAgIH0pO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWVzdEN1cnJlbnRXZWF0aGVyOyIsInZhciBwcmludFJlc29ydHMgPSByZXF1aXJlKFwiLi9wcmludF9SZXNvcnRzLmpzXCIpO1xudmFyIHRvZ2dsZVdpZGdldERpc3BsYXlTZXR1cCA9IHJlcXVpcmUoXCIuL3RvZ2dsZV9XaWRnZXRfRGlzcGxheV9zZXR1cC5qc1wiKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzLmpzXCIpO1xuXG5cblxuLyoqIHNldCB1cCB0aGUgc29ydCBiYXIgZnVuY3Rpb25hbGl0eSAqL1xuXG52YXIgc29ydGluZyA9IHtcblxuICAgIC8vaGF2ZSBhIGNvcHkgb2YgdGhlIHNlbGVjdGVkIGpzb24gYW5kIGFyZWEgaW4gdGhpcyBvYmplY3QgdG8gdXNlIGluIHNvcnRSZXNvcnRzQXJyYXkoKTtcbiAgICBzZWxlY3RlZF9qc29uOiB7fSxcbiAgICBzZWxlY3RlZF9hcmVhOiB7fSxcblxuICAgIHNldFNlbGVjdGVkOiBmdW5jdGlvbiAoanNvbiwgYXJlYSkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkX2pzb24gPSBqc29uO1xuICAgICAgICB0aGlzLnNlbGVjdGVkX2FyZWEgPSBhcmVhO1xuICAgIH0sXG5cblxuXG5cblxuICAgIC8vc29ydHMgcmVzb3J0IGpzb24uIGNhbGxlZCB3aGVuIHNvcnQgbGluayBpcyBjbGlja2VkIG9yIHJlZ2lvbiBkcm9wZG93biBpcyBjaGFuZ2VkXG4gICAgc29ydFJlc29ydHNBcnJheTogZnVuY3Rpb24gKHNvcnRfYnksIHNvcnRfb3JkZXIpIHtcblxuICAgICAgICBpZiAodHlwZW9mIHNvcnRfYnkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHNvcnRfYnkgPSB0aGlzLmNhY2hlZCA/IHRoaXMuY2FjaGVkLnNvcnRfYnkgOiBcIm5hbWVcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHNvcnRfb3JkZXIgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHNvcnRfb3JkZXIgPSB0aGlzLmNhY2hlZCA/IHRoaXMuY2FjaGVkLnNvcnRfb3JkZXIgOiBcImRlc2NcIjtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgdmFyIHRoaXNSZXNvcnRBcnJheSA9IHRoaXMuc2VsZWN0ZWRfanNvblt0aGlzLnNlbGVjdGVkX2FyZWFdO1xuXG4gICAgICAgIC8vc29ydCBieSBuYW1lXG5cbiAgICAgICAgaWYgKHNvcnRfYnkgPT09IFwibmFtZVwiKSB7XG4gICAgICAgICAgICB0aGlzUmVzb3J0QXJyYXkuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhW3NvcnRfYnldLmxvY2FsZUNvbXBhcmUoYltzb3J0X2J5XSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAvL3NvcnQgYnkgc3RhdGVcblxuICAgICAgICB9IGVsc2UgaWYgKHNvcnRfYnkgPT09IFwic3RhdGVcIikge1xuXG4gICAgICAgICAgICB0aGlzUmVzb3J0QXJyYXkuc29ydChmdW5jdGlvbiAoYSwgYikge1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHV0aWxzLnBhcnNlQWRkcmVzcyhhKS5zdGF0ZS5sb2NhbGVDb21wYXJlKHV0aWxzLnBhcnNlQWRkcmVzcyhiKS5zdGF0ZSk7XG4gICAgICAgICAgICB9KTtcblxuXG4gICAgICAgIH0gZWxzZSB7IC8vZm9yIG51bWJlcmVkIHNvcnRzIGluIHR3byBsZXZlbHNcblxuICAgICAgICAgICAgdmFyIHNvcnRfc3BvdCA9IHNvcnRfYnkuc3BsaXQoXCIuXCIpO1xuXG4gICAgICAgICAgICB0aGlzUmVzb3J0QXJyYXkuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhW3NvcnRfc3BvdFswXV1bc29ydF9zcG90WzFdXSAtIGJbc29ydF9zcG90WzBdXVtzb3J0X3Nwb3RbMV1dO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG5cbiAgICAgICAgaWYgKHNvcnRfb3JkZXIgPT09IFwiYXNjXCIpIHtcbiAgICAgICAgICAgIHRoaXNSZXNvcnRBcnJheS5yZXZlcnNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhY2hlZCA9IHtcbiAgICAgICAgICAgIHNvcnRfb3JkZXI6IHNvcnRfb3JkZXIsXG4gICAgICAgICAgICBzb3J0X2J5OiBzb3J0X2J5XG4gICAgICAgIH1cblxuICAgICAgICAvL3JlYnVpbGQgcmVzb3J0cyBsaXN0IG9uIHNjcmVlblxuICAgICAgICBwcmludFJlc29ydHModGhpcy5zZWxlY3RlZF9qc29uLCB0aGlzLnNlbGVjdGVkX2FyZWEpO1xuICAgICAgICAvLyBlbmFibGUgd2lkZ2V0IGRpc3BsYXkgbGlua3Mgb24gZWFjaCBzbmlwcGV0XG4gICAgICAgIHRvZ2dsZVdpZGdldERpc3BsYXlTZXR1cCgpO1xuXG4gICAgfSxcblxuXG5cbiAgICAvL3NvcnQgYmFyIGluaXRpYWxpemVyIC0gY2FsbGVkIHdoZW4gcGFnZSBsb2Fkc1xuICAgIHNvcnRCYXJJbml0OiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgJChcIiNzb3J0X2JhciAuc29ydF9saW5rXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgdmFyIGNsaWNrZWRfc29ydCA9ICQodGhpcyk7XG4gICAgICAgICAgICB2YXIgc29ydF9ieSA9IGNsaWNrZWRfc29ydC5hdHRyKFwic29ydF9ieVwiKTtcbiAgICAgICAgICAgIHZhciBzb3J0X29yZGVyID0gY2xpY2tlZF9zb3J0LmF0dHIoXCJzb3J0X29yZGVyXCIpO1xuXG4gICAgICAgICAgICAkKFwiI3NvcnRfYmFyIC5zb3J0X2xpbmtfc2VsZWN0ZWRcIikucmVtb3ZlQ2xhc3MoXCJzb3J0X2xpbmtfc2VsZWN0ZWRcIik7XG4gICAgICAgICAgICBjbGlja2VkX3NvcnQuYWRkQ2xhc3MoXCJzb3J0X2xpbmtfc2VsZWN0ZWRcIik7XG5cblxuICAgICAgICAgICAgLy9pZiBhc2NlbmRpbmcsIG1ha2UgZGVzY2VuZGluZyBldGMuXG5cbiAgICAgICAgICAgIHZhciB0cmlhbmdsZSA9IHNvcnRfb3JkZXIgPT09IFwiYXNjXCIgPyBcIlxcdTI1QkNcIiA6IFwiXFx1MjVCMlwiO1xuICAgICAgICAgICAgdmFyIG5ld19zb3J0X29yZGVyID0gc29ydF9vcmRlciA9PT0gXCJhc2NcIiA/IFwiZGVzY1wiIDogXCJhc2NcIjtcblxuXG5cbiAgICAgICAgICAgIC8vIHNvcnQgdGhlIHJlc29ydHMgYXJyYXlcbiAgICAgICAgICAgIHNvcnRpbmcuc29ydFJlc29ydHNBcnJheShzb3J0X2J5LCBzb3J0X29yZGVyKTtcblxuICAgICAgICAgICAgJChcIi5zb3J0X3RyaWFuZ2xlXCIsIGNsaWNrZWRfc29ydCkudGV4dCh0cmlhbmdsZSk7XG5cbiAgICAgICAgICAgIGNsaWNrZWRfc29ydC50b2dnbGVDbGFzcyhcInNvcnRfb3JkZXJfYXNjIHNvcnRfb3JkZXJfZGVzY1wiKS5hdHRyKFwic29ydF9vcmRlclwiLCBuZXdfc29ydF9vcmRlcik7XG5cblxuICAgICAgICB9KTtcbiAgICB9XG5cblxufVxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBzb3J0aW5nOyIsIi8qKiB3aGVuIFwibW9yZVwiIGxpbmsgaXMgY2xpY2tlZCwgZ2V0cyB3aWRnZXQgZm9yIHRoYXQgcmVzb3J0IGFuZCBhcHBlbmRzIGl0IHRvIHJlc29ydCBzbmlwcGV0ICovXG5cbnZhciB0b2dnbGVXaWRnZXREaXNwbGF5U2V0dXAgPSBmdW5jdGlvbigpe1xuICAgIFxuICAgICQoXCIudG9nZ2xlX3dpZGdldF9saW5rXCIpLmNsaWNrKGZ1bmN0aW9uKCl7ICAgIFxuICAgICAgICBcbiAgICAgICAgaWYgKCQodGhpcykudGV4dCgpID09PSBcInNob3cgY3VycmVudCBzdGF0c1wiKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGNvbmRpdGlvbnNfd2lkZ2V0X2NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgY29uZGl0aW9uc193aWRnZXRfY29udGFpbmVyLmNsYXNzTmFtZSA9IFwiY29uZGl0aW9uc193aWRnZXRfY29udGFpbmVyXCI7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBjb25kaXRpb25zX3dpZGdldF9zbm93Y291bnRyeV9saW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICAgICAgICAgICAgY29uZGl0aW9uc193aWRnZXRfc25vd2NvdW50cnlfbGluay5jbGFzc05hbWUgPSBcImNvbmRpdGlvbnNfd2lkZ2V0X3Nub3djb3VudHJ5X2xpbmtcIjtcbiAgICAgICAgICAgICAgICBjb25kaXRpb25zX3dpZGdldF9zbm93Y291bnRyeV9saW5rLnRleHRDb250ZW50ID1cIlBvd2VyZWQgYnkgd3d3LnNub2NvdW50cnkuY29tXCI7XG4gICAgICAgICAgICAgICAgY29uZGl0aW9uc193aWRnZXRfc25vd2NvdW50cnlfbGluay5ocmVmID0gXCJodHRwOi8vd3d3LnNub2NvdW50cnkuY29tXCI7XG4gICAgICAgICAgICAgICAgY29uZGl0aW9uc193aWRnZXRfc25vd2NvdW50cnlfbGluay50YXJnZXQgPSBcIl9ibGFua1wiO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBjb25kaXRpb25zX3dpZGdldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpZnJhbWVcIik7XG4gICAgICAgICAgICAgICAgY29uZGl0aW9uc193aWRnZXQuY2xhc3NOYW1lID0gXCJjb25kaXRpb25zX3dpZGdldFwiO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0LnNyYyA9ICQodGhpcykuYXR0cihcIndpZGdldF9saW5rXCIpO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0LmhlaWdodCA9IFwiMjgwXCI7XG4gICAgICAgICAgICAgICAgY29uZGl0aW9uc193aWRnZXQud2lkdGggPSBcIjU5MFwiO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0LnNlYW1sZXNzPSBcInNlYW1sZXNzXCI7XG4gICAgICAgICAgICAgICAgY29uZGl0aW9uc193aWRnZXQuZnJhbWVCb3JkZXI9XCIwXCI7XG4gICAgICAgICAgICAgICAgY29uZGl0aW9uc193aWRnZXQuc2Nyb2xsaW5nID0gXCJub1wiO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0X2NvbnRhaW5lci5hcHBlbmRDaGlsZChjb25kaXRpb25zX3dpZGdldF9zbm93Y291bnRyeV9saW5rKTtcbiAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0X2NvbnRhaW5lci5hcHBlbmRDaGlsZChjb25kaXRpb25zX3dpZGdldCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJCh0aGlzKS50ZXh0KFwiaGlkZSBjdXJyZW50IHN0YXRzXCIpXG4gICAgICAgICAgICAgICAgLmNsb3Nlc3QoXCIucmVzb3J0X3NuaXBwZXRcIikuYXBwZW5kKGNvbmRpdGlvbnNfd2lkZ2V0X2NvbnRhaW5lcik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgJCh0aGlzKS50ZXh0KFwic2hvdyBjdXJyZW50IHN0YXRzXCIpXG4gICAgICAgICAgICAgICAgLmNsb3Nlc3QoXCIucmVzb3J0X3NuaXBwZXRcIikuZmluZChcIi5jb25kaXRpb25zX3dpZGdldF9jb250YWluZXJcIikucmVtb3ZlKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgIFxuICAgICAgICBcbiAgICB9KTtcbiAgICBcbiAgICBcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvZ2dsZVdpZGdldERpc3BsYXlTZXR1cDsiLCIgICAgICB2YXIgdXRpbHMgPSB7XG5cbiAgICAgICAgICAvKiogYWRkIGNvbW1hcyBmdW5jdGlvbiAqL1xuICAgICAgICAgIGFkZENvbW1hczogZnVuY3Rpb24gKHZhbCkge1xuXG4gICAgICAgICAgICAgIGlmIChpc05hTih2YWwpKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKCh2YWwgPiA5OTkpIHx8ICh2YWwgPCAtOTk5KSkge1xuICAgICAgICAgICAgICAgICAgd2hpbGUgKC8oXFxkKykoXFxkezN9KS8udGVzdCh2YWwudG9TdHJpbmcoKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YWwgPSB2YWwudG9TdHJpbmcoKS5yZXBsYWNlKC8oXFxkKykoXFxkezN9KS8sICckMScgKyAnLCcgKyAnJDInKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICAvKiogcmV0dXJuIF9zbSBmb3IgaW1hZ2UgbmFtZSAqL1xuICAgICAgICAgIHRodW1ibmFpbE5hbWU6IGZ1bmN0aW9uIChpbWFnZV9uYW1lKSB7XG4gICAgICAgICAgICAgIHJldHVybiBpbWFnZV9uYW1lLnJlcGxhY2UoJy5wbmcnLCAnX3NtLnBuZycpLnJlcGxhY2UoJy5qcGcnLCAnX3NtLmpwZycpLnJlcGxhY2UoJy5qcGVnJywgJ19zbS5qcGVnJykucmVwbGFjZSgnLnBkZicsICdfc20ucG5nJyk7XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIC8qKiByZXR1cm4gbW9kZGVkIGxhbmd1YWdlIGZvciB3ZWF0aGVyIGRlc2NyaXB0aW9uICovXG4gICAgICAgICAgd2VhdGhlckRlc2NyaXB0b3I6IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKFwib3ZlcmNhc3QgY2xvdWRzXCIsIFwib3ZlcmNhc3RcIikucmVwbGFjZShcInNreSBpcyBjbGVhclwiLCBcImNsZWFyIHNraWVzXCIpO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBwaG9uZUZvcm1hdDogZnVuY3Rpb24gKHN0cmluZykge1xuICAgICAgICAgICAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoL1xcKHxcXCkvZywgXCJcIikucmVwbGFjZSgvLXwgL2csIFwiJiM4MjA5O1wiKTtcbiAgICAgICAgICB9LFxuXG5cbiAgICAgICAgICBwYXJzZUFkZHJlc3M6IGZ1bmN0aW9uIChyZXNvcnRfb2JqKSB7XG4gICAgICAgICAgICAgIHZhciBwYXJzZWRfYWRkcmVzcyA9IHt9O1xuXG4gICAgICAgICAgICAgIC8vaWYgcGFydHMgYXJlIHRoZXJlLCB1c2UgdGhvc2VcbiAgICAgICAgICAgICAgcGFyc2VkX2FkZHJlc3Muc3RyZWV0X2FkcmVzcyA9IHJlc29ydF9vYmouY29udGFjdF9pbmZvLnN0cmVldF9hZGRyZXNzIHx8IFwiXCI7XG4gICAgICAgICAgICAgIHBhcnNlZF9hZGRyZXNzLmNpdHkgPSByZXNvcnRfb2JqLmNvbnRhY3RfaW5mby5jaXR5IHx8IFwiXCI7XG4gICAgICAgICAgICAgIHBhcnNlZF9hZGRyZXNzLnN0YXRlID0gcmVzb3J0X29iai5jb250YWN0X2luZm8uc3RhdGUgfHwgXCJcIjtcbiAgICAgICAgICAgICAgcGFyc2VkX2FkZHJlc3MuemlwID0gcmVzb3J0X29iai5jb250YWN0X2luZm8uemlwIHx8IFwiXCI7XG5cbiAgICAgICAgICAgICAgLy9mdWxsIGFkZHJlc3MgdXNlcyBmdWxsIGlmIGl0cyB0aGVyZSwgb3IgYSBjb21iaW5hdGlvbiBpZiBpdCdzIG5vdFxuICAgICAgICAgICAgICBwYXJzZWRfYWRkcmVzcy5mdWxsX2FkZHJlc3MgPSByZXNvcnRfb2JqLmNvbnRhY3RfaW5mby5mdWxsX2FkZHJlc3MgfHwgcmVzb3J0X29iai5jb250YWN0X2luZm8uc3RyZWV0X2FkZHJlc3MgKyBcIiwgXCIgKyByZXNvcnRfb2JqLmNvbnRhY3RfaW5mby5jaXR5ICsgXCIsIFwiICsgcmVzb3J0X29iai5jb250YWN0X2luZm8uc3RhdGUgKyBcIiBcIiArIHJlc29ydF9vYmouY29udGFjdF9pbmZvLnppcDtcblxuICAgICAgICAgICAgICAvL2lmIGZ1bGwgYWRkcmVzcyBpcyB0aGVyZSwgcGFyc2UgaXQgZm9yIHBhcnRzIG9mIHRoZSBhZGRyZXNzXG4gICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVzb3J0X29iai5jb250YWN0X2luZm8uZnVsbF9hZGRyZXNzICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgYWRkcmVzc19hcnIgPSByZXNvcnRfb2JqLmNvbnRhY3RfaW5mby5mdWxsX2FkZHJlc3Muc3BsaXQoXCIsXCIpO1xuXG4gICAgICAgICAgICAgICAgICBwYXJzZWRfYWRkcmVzcy56aXAgPSBhZGRyZXNzX2FyclthZGRyZXNzX2Fyci5sZW5ndGggLSAxXS5zbGljZSgzKTtcbiAgICAgICAgICAgICAgICAgIHBhcnNlZF9hZGRyZXNzLnN0YXRlID0gYWRkcmVzc19hcnJbYWRkcmVzc19hcnIubGVuZ3RoIC0gMV0uc2xpY2UoMSwgMyk7XG4gICAgICAgICAgICAgICAgICBwYXJzZWRfYWRkcmVzcy5jaXR5ID0gYWRkcmVzc19hcnJbYWRkcmVzc19hcnIubGVuZ3RoIC0gMl07XG4gICAgICAgICAgICAgICAgICBwYXJzZWRfYWRkcmVzcy5zdHJlZXRfYWRyZXNzID0gYWRkcmVzc19hcnIuc2xpY2UoMCwgYWRkcmVzc19hcnIubGVuZ3RoIC0gMikuam9pbihcIixcIik7XG5cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHJldHVybiBwYXJzZWRfYWRkcmVzcztcblxuICAgICAgICAgIH0sXG4gICAgICAgICAgXG5cbiAgICAgICAgICB1cmxGb3JtYXQ6IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICAgICAgICAgICAgaWYgKHN0cmluZy5zbGljZSgwLCAzKSA9PT0gXCJ3d3dcIikge1xuICAgICAgICAgICAgICAgICAgc3RyaW5nID0gXCJodHRwOi8vXCIgKyBzdHJpbmc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIHN0cmluZztcbiAgICAgICAgICB9XG5cbiAgICAgIH1cblxuXG4gICAgICBtb2R1bGUuZXhwb3J0cyA9IHV0aWxzOyJdfQ==
