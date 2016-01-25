(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var loadResorts = require("./load_Resorts.js");
var printResorts = require("./print_Resorts.js");
var toggleWidgetDisplaySetup = require("./toggle_Widget_Display_setup.js");
var sorting = require("./sorting.js");
var area_selector = require("./area_selector.js");

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





});
},{"./area_selector.js":2,"./load_Resorts.js":5,"./print_Resorts.js":6,"./sorting.js":8,"./toggle_Widget_Display_setup.js":9}],2:[function(require,module,exports){
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
},{"./load_Resorts.js":5,"./print_Resorts.js":6,"./sorting.js":8,"./toggle_Widget_Display_setup.js":9}],3:[function(require,module,exports){
var utils = require('./utils.js');
/** builds html from _resorts.json and returns it as a .resort_snippet div*/

var buildResortBriefDiv = function (resort_obj, parsed_address) {
    


    var name_and_logo = "<a class = 'resort_name' target ='_blank' href ='" + utils.urlFormat(resort_obj.contact_info.url) + "'><h3><img class ='resort_logo_img' src = 'images/resort_logos/" + resort_obj.images.logo + "'/>" + resort_obj.name + " <span class='resort_state'>" + parsed_address.state + "</span></h3></a>";

    var trails = "<span class = 'trails report'>" + resort_obj.stats.trails + "&nbsp;trails </span>";

    var lifts = "<span class = 'lifts report'>" + resort_obj.stats.lifts + "&nbsp;lifts </span>";

    var acres = "<span class = 'acres report'>" + utils.addCommas(resort_obj.stats.skiable_acres) + "&nbsp;acres</span>";

    var vert = "<span class = 'vert report'>" + utils.addCommas(resort_obj.stats.vertical_drop_ft) + "'&nbsp;vertical&nbsp;drop</span>";

    var full_address = "<a target ='_blank' href ='" + resort_obj.contact_info.address_url + "'><span class = 'full_address'>" + parsed_address.full_address + "</span></a> ";

    var rates = "Rates (midweek / weekend): <span class = 'rates_adult report'>Adult:&nbsp;$" + resort_obj.rates.adults_midweek + "&nbsp;/&nbsp;$" + resort_obj.rates.adults_prime + "&nbsp;</span>\
                <span class = 'rates_junior report'>Junior:&nbsp;$" + resort_obj.rates.juniors_midweek + "&nbsp;/&nbsp;$" + resort_obj.rates.juniors_prime + "</span> <a class = 'rates_url' target ='_blank' href ='" + resort_obj.rates.rates_url + "'>Get tickets</a>";

    var phone = "<span class ='resort_phone_number'>" + utils.phoneFormat(resort_obj.contact_info.phone) + "</span>";


    var toggle_widget_link = "<span class = 'toggle_widget_link report' widget_link = " + resort_obj.stats.widget_link + ">show current stats</span>"

    var map_thumbnail = "<div class='map_thumbnail'> <a target ='_blank' href='images/resort_maps/" + resort_obj.images.map + "'><img src='images/resort_maps/" + utils.thumbnailName(resort_obj.images.map) + "'/></a></div>";


    var snippet = "<div class='resort_snippet' id ='" + resort_obj.id + "' >" + name_and_logo + "\
        " + map_thumbnail + "<div class='resort_snippet_text'>\
        <span class='stats_report'>" + trails + lifts + acres + vert + "</span><br/>\
        " + rates + "<br><p class='contact_info'>\
        " + full_address + phone + "</p>\
        " + toggle_widget_link + "</div>\
            <div class='clear_float'></div>\
        </div>";



    return snippet;
}

module.exports = buildResortBriefDiv;
},{"./utils.js":10}],4:[function(require,module,exports){
var utils = require("./utils.js");

/** builds html from weather json and inserts weather report span */

var insertCurrentWeather = function (json, resort_obj) {
    

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
    if (typeof resort_obj.weather_forcast_url != "undefined" && resort_obj.weather_forcast_url.length > 1) {
        five_day_forcast_link.href = resort_obj.weather_forcast_url;

    } else {
        five_day_forcast_link.href = "http://www.weather.com/weather/5day/l/" + resort_obj.contact_info.zip + ":4:US";
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
},{"./utils.js":10}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
            insertCurrentWeather(json, name);
        });
    }

    //insert all resorts on page
    $resorts_results_div.append(allResorts);
    
}


module.exports = printResorts;
},{"./build_Resort_Brief_Div.js":3,"./insert_Current_Weather.js":4,"./request_Current_Weather.js":7,"./utils.js":10}],7:[function(require,module,exports){
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
        console.log(json.name);
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
        });

}

module.exports = requestCurrentWeather;
},{}],8:[function(require,module,exports){
var printResorts = require("./print_Resorts.js");


/** set up the sort bar functionality */

var sorting = {
    
    //have a copy of the selected json and area in this object to use in sortResortsArray();
    selected_json: {},
    selected_area: {},
    
    setSelected: function(json, area){
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
        if (sort_by === "name") {
            thisResortArray.sort(function (a, b) {
                return a[sort_by].localeCompare(b[sort_by]);
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
},{"./print_Resorts.js":6}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzX3NyYy9hcHAuanMiLCJzY3JpcHRzX3NyYy9hcmVhX3NlbGVjdG9yLmpzIiwic2NyaXB0c19zcmMvYnVpbGRfUmVzb3J0X0JyaWVmX0Rpdi5qcyIsInNjcmlwdHNfc3JjL2luc2VydF9DdXJyZW50X1dlYXRoZXIuanMiLCJzY3JpcHRzX3NyYy9sb2FkX1Jlc29ydHMuanMiLCJzY3JpcHRzX3NyYy9wcmludF9SZXNvcnRzLmpzIiwic2NyaXB0c19zcmMvcmVxdWVzdF9DdXJyZW50X1dlYXRoZXIuanMiLCJzY3JpcHRzX3NyYy9zb3J0aW5nLmpzIiwic2NyaXB0c19zcmMvdG9nZ2xlX1dpZGdldF9EaXNwbGF5X3NldHVwLmpzIiwic2NyaXB0c19zcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGxvYWRSZXNvcnRzID0gcmVxdWlyZShcIi4vbG9hZF9SZXNvcnRzLmpzXCIpO1xudmFyIHByaW50UmVzb3J0cyA9IHJlcXVpcmUoXCIuL3ByaW50X1Jlc29ydHMuanNcIik7XG52YXIgdG9nZ2xlV2lkZ2V0RGlzcGxheVNldHVwID0gcmVxdWlyZShcIi4vdG9nZ2xlX1dpZGdldF9EaXNwbGF5X3NldHVwLmpzXCIpO1xudmFyIHNvcnRpbmcgPSByZXF1aXJlKFwiLi9zb3J0aW5nLmpzXCIpO1xudmFyIGFyZWFfc2VsZWN0b3IgPSByZXF1aXJlKFwiLi9hcmVhX3NlbGVjdG9yLmpzXCIpO1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgYXJlYSA9IGFyZWFfc2VsZWN0b3IucGFnZUxvYWQoKTtcblxuICAgIC8qKiBnZXQgdGhlIHJlc29ydCBqc29uIGZyb20gc2VsZWN0ZWQgYXJlYSAqL1xuICAgIGxvYWRSZXNvcnRzKGFyZWEsIGZ1bmN0aW9uIChqc29uLCBhcmVhKSB7XG5cbiAgICAgICAgcHJpbnRSZXNvcnRzKGpzb24sIGFyZWEpO1xuICAgICAgICB0b2dnbGVXaWRnZXREaXNwbGF5U2V0dXAoKTtcbiAgICAgICAgc29ydGluZy5zZXRTZWxlY3RlZChqc29uLCBhcmVhKTtcbiAgICAgICAgc29ydGluZy5zb3J0QmFySW5pdCgpO1xuXG4gICAgICAgIC8vaW5pdGlhbGl6ZSBhcmUgZHJvcGRvd24gbWVudTtcblxuICAgICAgICBhcmVhX3NlbGVjdG9yLmRyb3Bkb3duSW5pdCgpO1xuXG4gICAgfSk7XG5cblxuXG5cblxufSk7IiwidmFyIGxvYWRSZXNvcnRzID0gcmVxdWlyZShcIi4vbG9hZF9SZXNvcnRzLmpzXCIpO1xudmFyIHByaW50UmVzb3J0cyA9IHJlcXVpcmUoXCIuL3ByaW50X1Jlc29ydHMuanNcIik7XG52YXIgdG9nZ2xlV2lkZ2V0RGlzcGxheVNldHVwID0gcmVxdWlyZShcIi4vdG9nZ2xlX1dpZGdldF9EaXNwbGF5X3NldHVwLmpzXCIpO1xudmFyIHNvcnRpbmcgPSByZXF1aXJlKFwiLi9zb3J0aW5nLmpzXCIpO1xuXG5cbnZhciBhcmVhX3NlbGVjdG9yID0ge1xuXG4gICAgcGFnZUxvYWQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAvL2xvb2sgYXQgaW5pdGlhbCBwYWdlIHVybCBhbmQgcSBzdHJpbmcgdG8gZ2V0IGFyZWFcblxuICAgICAgICB2YXIgYXJlYSA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnNsaWNlKDEpIHx8IFwibWlkX2F0bGFudGljXCI7XG5cbiAgICAgICAgLy9zZXQgaW5pdGlhbCB2YWx1ZSBvZiByZXNvcnRfc2VsZWN0aW9uX2Ryb3Bkb3duIFxuICAgICAgICAkKFwiI3Jlc29ydF9zZWxlY3Rpb25fZHJvcGRvd25cIikudmFsKGFyZWEpO1xuXG4gICAgICAgIHJldHVybiBhcmVhO1xuXG4gICAgfSxcblxuICAgIGRyb3Bkb3duSW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAkKFwiI3Jlc29ydF9zZWxlY3Rpb25fZHJvcGRvd25cIikuY2hhbmdlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhcmVhID0gJCh0aGlzKS52YWwoKTtcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gYXJlYTtcblxuXG4gICAgICAgICAgICAvKiogZ2V0IHRoZSByZXNvcnQganNvbiBmcm9tIHNlbGVjdGVkIGFyZWEgKi9cbiAgICAgICAgICAgIGxvYWRSZXNvcnRzKGFyZWEsIGZ1bmN0aW9uIChqc29uLCBhcmVhKSB7XG4gICAgICAgICAgICAgICAgc29ydGluZy5zZXRTZWxlY3RlZChqc29uLCBhcmVhKTtcbiAgICAgICAgICAgICAgICBzb3J0aW5nLnNvcnRSZXNvcnRzQXJyYXkoKTsgLy9ub3Qgc3VwcGx5aW5nIHNvcnRfYnkgYW5kIHNvcnRfb3JkZXIgdG8gdXNlIGZ1bmN0aW9uIGNhY2hlO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRvZ2dsZVdpZGdldERpc3BsYXlTZXR1cCgpO1xuXG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcmVhX3NlbGVjdG9yOyIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMuanMnKTtcbi8qKiBidWlsZHMgaHRtbCBmcm9tIF9yZXNvcnRzLmpzb24gYW5kIHJldHVybnMgaXQgYXMgYSAucmVzb3J0X3NuaXBwZXQgZGl2Ki9cblxudmFyIGJ1aWxkUmVzb3J0QnJpZWZEaXYgPSBmdW5jdGlvbiAocmVzb3J0X29iaiwgcGFyc2VkX2FkZHJlc3MpIHtcbiAgICBcblxuXG4gICAgdmFyIG5hbWVfYW5kX2xvZ28gPSBcIjxhIGNsYXNzID0gJ3Jlc29ydF9uYW1lJyB0YXJnZXQgPSdfYmxhbmsnIGhyZWYgPSdcIiArIHV0aWxzLnVybEZvcm1hdChyZXNvcnRfb2JqLmNvbnRhY3RfaW5mby51cmwpICsgXCInPjxoMz48aW1nIGNsYXNzID0ncmVzb3J0X2xvZ29faW1nJyBzcmMgPSAnaW1hZ2VzL3Jlc29ydF9sb2dvcy9cIiArIHJlc29ydF9vYmouaW1hZ2VzLmxvZ28gKyBcIicvPlwiICsgcmVzb3J0X29iai5uYW1lICsgXCIgPHNwYW4gY2xhc3M9J3Jlc29ydF9zdGF0ZSc+XCIgKyBwYXJzZWRfYWRkcmVzcy5zdGF0ZSArIFwiPC9zcGFuPjwvaDM+PC9hPlwiO1xuXG4gICAgdmFyIHRyYWlscyA9IFwiPHNwYW4gY2xhc3MgPSAndHJhaWxzIHJlcG9ydCc+XCIgKyByZXNvcnRfb2JqLnN0YXRzLnRyYWlscyArIFwiJm5ic3A7dHJhaWxzIDwvc3Bhbj5cIjtcblxuICAgIHZhciBsaWZ0cyA9IFwiPHNwYW4gY2xhc3MgPSAnbGlmdHMgcmVwb3J0Jz5cIiArIHJlc29ydF9vYmouc3RhdHMubGlmdHMgKyBcIiZuYnNwO2xpZnRzIDwvc3Bhbj5cIjtcblxuICAgIHZhciBhY3JlcyA9IFwiPHNwYW4gY2xhc3MgPSAnYWNyZXMgcmVwb3J0Jz5cIiArIHV0aWxzLmFkZENvbW1hcyhyZXNvcnRfb2JqLnN0YXRzLnNraWFibGVfYWNyZXMpICsgXCImbmJzcDthY3Jlczwvc3Bhbj5cIjtcblxuICAgIHZhciB2ZXJ0ID0gXCI8c3BhbiBjbGFzcyA9ICd2ZXJ0IHJlcG9ydCc+XCIgKyB1dGlscy5hZGRDb21tYXMocmVzb3J0X29iai5zdGF0cy52ZXJ0aWNhbF9kcm9wX2Z0KSArIFwiJyZuYnNwO3ZlcnRpY2FsJm5ic3A7ZHJvcDwvc3Bhbj5cIjtcblxuICAgIHZhciBmdWxsX2FkZHJlc3MgPSBcIjxhIHRhcmdldCA9J19ibGFuaycgaHJlZiA9J1wiICsgcmVzb3J0X29iai5jb250YWN0X2luZm8uYWRkcmVzc191cmwgKyBcIic+PHNwYW4gY2xhc3MgPSAnZnVsbF9hZGRyZXNzJz5cIiArIHBhcnNlZF9hZGRyZXNzLmZ1bGxfYWRkcmVzcyArIFwiPC9zcGFuPjwvYT4gXCI7XG5cbiAgICB2YXIgcmF0ZXMgPSBcIlJhdGVzIChtaWR3ZWVrIC8gd2Vla2VuZCk6IDxzcGFuIGNsYXNzID0gJ3JhdGVzX2FkdWx0IHJlcG9ydCc+QWR1bHQ6Jm5ic3A7JFwiICsgcmVzb3J0X29iai5yYXRlcy5hZHVsdHNfbWlkd2VlayArIFwiJm5ic3A7LyZuYnNwOyRcIiArIHJlc29ydF9vYmoucmF0ZXMuYWR1bHRzX3ByaW1lICsgXCImbmJzcDs8L3NwYW4+XFxcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcyA9ICdyYXRlc19qdW5pb3IgcmVwb3J0Jz5KdW5pb3I6Jm5ic3A7JFwiICsgcmVzb3J0X29iai5yYXRlcy5qdW5pb3JzX21pZHdlZWsgKyBcIiZuYnNwOy8mbmJzcDskXCIgKyByZXNvcnRfb2JqLnJhdGVzLmp1bmlvcnNfcHJpbWUgKyBcIjwvc3Bhbj4gPGEgY2xhc3MgPSAncmF0ZXNfdXJsJyB0YXJnZXQgPSdfYmxhbmsnIGhyZWYgPSdcIiArIHJlc29ydF9vYmoucmF0ZXMucmF0ZXNfdXJsICsgXCInPkdldCB0aWNrZXRzPC9hPlwiO1xuXG4gICAgdmFyIHBob25lID0gXCI8c3BhbiBjbGFzcyA9J3Jlc29ydF9waG9uZV9udW1iZXInPlwiICsgdXRpbHMucGhvbmVGb3JtYXQocmVzb3J0X29iai5jb250YWN0X2luZm8ucGhvbmUpICsgXCI8L3NwYW4+XCI7XG5cblxuICAgIHZhciB0b2dnbGVfd2lkZ2V0X2xpbmsgPSBcIjxzcGFuIGNsYXNzID0gJ3RvZ2dsZV93aWRnZXRfbGluayByZXBvcnQnIHdpZGdldF9saW5rID0gXCIgKyByZXNvcnRfb2JqLnN0YXRzLndpZGdldF9saW5rICsgXCI+c2hvdyBjdXJyZW50IHN0YXRzPC9zcGFuPlwiXG5cbiAgICB2YXIgbWFwX3RodW1ibmFpbCA9IFwiPGRpdiBjbGFzcz0nbWFwX3RodW1ibmFpbCc+IDxhIHRhcmdldCA9J19ibGFuaycgaHJlZj0naW1hZ2VzL3Jlc29ydF9tYXBzL1wiICsgcmVzb3J0X29iai5pbWFnZXMubWFwICsgXCInPjxpbWcgc3JjPSdpbWFnZXMvcmVzb3J0X21hcHMvXCIgKyB1dGlscy50aHVtYm5haWxOYW1lKHJlc29ydF9vYmouaW1hZ2VzLm1hcCkgKyBcIicvPjwvYT48L2Rpdj5cIjtcblxuXG4gICAgdmFyIHNuaXBwZXQgPSBcIjxkaXYgY2xhc3M9J3Jlc29ydF9zbmlwcGV0JyBpZCA9J1wiICsgcmVzb3J0X29iai5pZCArIFwiJyA+XCIgKyBuYW1lX2FuZF9sb2dvICsgXCJcXFxuICAgICAgICBcIiArIG1hcF90aHVtYm5haWwgKyBcIjxkaXYgY2xhc3M9J3Jlc29ydF9zbmlwcGV0X3RleHQnPlxcXG4gICAgICAgIDxzcGFuIGNsYXNzPSdzdGF0c19yZXBvcnQnPlwiICsgdHJhaWxzICsgbGlmdHMgKyBhY3JlcyArIHZlcnQgKyBcIjwvc3Bhbj48YnIvPlxcXG4gICAgICAgIFwiICsgcmF0ZXMgKyBcIjxicj48cCBjbGFzcz0nY29udGFjdF9pbmZvJz5cXFxuICAgICAgICBcIiArIGZ1bGxfYWRkcmVzcyArIHBob25lICsgXCI8L3A+XFxcbiAgICAgICAgXCIgKyB0b2dnbGVfd2lkZ2V0X2xpbmsgKyBcIjwvZGl2PlxcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPSdjbGVhcl9mbG9hdCc+PC9kaXY+XFxcbiAgICAgICAgPC9kaXY+XCI7XG5cblxuXG4gICAgcmV0dXJuIHNuaXBwZXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYnVpbGRSZXNvcnRCcmllZkRpdjsiLCJ2YXIgdXRpbHMgPSByZXF1aXJlKFwiLi91dGlscy5qc1wiKTtcblxuLyoqIGJ1aWxkcyBodG1sIGZyb20gd2VhdGhlciBqc29uIGFuZCBpbnNlcnRzIHdlYXRoZXIgcmVwb3J0IHNwYW4gKi9cblxudmFyIGluc2VydEN1cnJlbnRXZWF0aGVyID0gZnVuY3Rpb24gKGpzb24sIHJlc29ydF9vYmopIHtcbiAgICBcblxuICAgICQoXCIjXCIgKyByZXNvcnRfb2JqLmlkICsgXCIgLndlYXRoZXJfcmVwb3J0XCIpLnJlbW92ZSgpO1xuXG4gICAgdmFyIHdlYXRoZXJfcmVwb3J0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgd2VhdGhlcl9yZXBvcnQuY2xhc3NOYW1lID0gXCJ3ZWF0aGVyX3JlcG9ydFwiO1xuXG4gICAgdmFyIGljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgIGljb24uY2xhc3NOYW1lID0gXCJ3ZWF0aGVyX2ljb25cIjtcbiAgICBpY29uLnNyYyA9IFwiaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvdy9cIiArIGpzb24ud2VhdGhlclswXS5pY29uICsgXCIucG5nXCI7XG5cbiAgICB2YXIgZGVzY3JpcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICBkZXNjcmlwdGlvbi5jbGFzc05hbWUgPSBcIndlYXRoZXJfZGVzY3JpcHRpb25cIjtcbiAgICBkZXNjcmlwdGlvbi50ZXh0Q29udGVudCA9IHV0aWxzLndlYXRoZXJEZXNjcmlwdG9yKGpzb24ud2VhdGhlclswXS5kZXNjcmlwdGlvbikgKyBcIiBcIjtcblxuICAgIHZhciB0ZW1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgdGVtcC5jbGFzc05hbWUgPSBcIndlYXRoZXJfdGVtcFwiO1xuICAgIHRlbXAudGV4dENvbnRlbnQgPSBqc29uLm1haW4udGVtcC50b0ZpeGVkKDEpICsgXCJcXHUyMTA5IFwiOyAvL3N5bWJvbCBmb3IgZGVncmVlcyBGXG5cbiAgICB2YXIgd2luZF9zcGVlZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgIHdpbmRfc3BlZWQuY2xhc3NOYW1lID0gXCJ3ZWF0aGVyX3dpbmRfc3BlZWRcIjtcbiAgICB3aW5kX3NwZWVkLnRleHRDb250ZW50ID0gXCJ3aW5kOlxcdTAwYTBcIiArIGpzb24ud2luZC5zcGVlZC50b0ZpeGVkKDEpICsgXCJcXHUwMGEwbXBoXCI7XG5cbiAgICB2YXIgZml2ZV9kYXlfZm9yY2FzdF9zcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgdmFyIGZpdmVfZGF5X2ZvcmNhc3RfbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgIGZpdmVfZGF5X2ZvcmNhc3RfbGluay5jbGFzc05hbWUgPSBcImZpdmVfZGF5X2ZvcmNhc3RfbGlua1wiO1xuICAgIGZpdmVfZGF5X2ZvcmNhc3RfbGluay50ZXh0Q29udGVudCA9IFwiNVxcdTIwMTFkYXlcXHUwMEEwZm9yY2FzdFwiO1xuXG4gICAgLy9pZiBtb3JlIGFjY3VyYXRlIHdlYXRoZXIgbGluayBpcyBhdmFpbGFibGUsIHVzZSB0aGF0IGluc3RlYWQgb2YgemlwIGNvZGVcbiAgICBpZiAodHlwZW9mIHJlc29ydF9vYmoud2VhdGhlcl9mb3JjYXN0X3VybCAhPSBcInVuZGVmaW5lZFwiICYmIHJlc29ydF9vYmoud2VhdGhlcl9mb3JjYXN0X3VybC5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZpdmVfZGF5X2ZvcmNhc3RfbGluay5ocmVmID0gcmVzb3J0X29iai53ZWF0aGVyX2ZvcmNhc3RfdXJsO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgZml2ZV9kYXlfZm9yY2FzdF9saW5rLmhyZWYgPSBcImh0dHA6Ly93d3cud2VhdGhlci5jb20vd2VhdGhlci81ZGF5L2wvXCIgKyByZXNvcnRfb2JqLmNvbnRhY3RfaW5mby56aXAgKyBcIjo0OlVTXCI7XG4gICAgfVxuXG5cbiAgICBmaXZlX2RheV9mb3JjYXN0X2xpbmsudGFyZ2V0ID0gXCJfYmxhbmtcIjtcbiAgICBmaXZlX2RheV9mb3JjYXN0X3NwYW4uYXBwZW5kQ2hpbGQoZml2ZV9kYXlfZm9yY2FzdF9saW5rKTtcblxuXG5cblxuICAgIHdlYXRoZXJfcmVwb3J0LmFwcGVuZENoaWxkKGljb24pO1xuICAgIHdlYXRoZXJfcmVwb3J0LmFwcGVuZENoaWxkKGRlc2NyaXB0aW9uKTtcbiAgICB3ZWF0aGVyX3JlcG9ydC5hcHBlbmRDaGlsZCh0ZW1wKTtcbiAgICB3ZWF0aGVyX3JlcG9ydC5hcHBlbmRDaGlsZCh3aW5kX3NwZWVkKTtcbiAgICB3ZWF0aGVyX3JlcG9ydC5hcHBlbmRDaGlsZChmaXZlX2RheV9mb3JjYXN0X3NwYW4pO1xuXG4gICAgJCh3ZWF0aGVyX3JlcG9ydCkuaW5zZXJ0QmVmb3JlKCQoXCIjXCIgKyByZXNvcnRfb2JqLmlkICsgXCIgLnRvZ2dsZV93aWRnZXRfbGlua1wiKSk7XG5cblxuXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRDdXJyZW50V2VhdGhlcjsiLCIvKiogZ2V0cyBzdGF0aWMgcmVzb3J0IGNvbmRpdGlvbiBmcm9tIC5qc29uIGZpbGUgKi9cblxudmFyIGxvYWRSZXNvcnRzID0gZnVuY3Rpb24gKGFyZWEsIGNhbGxiYWNrKSB7XG5cbiAgICB2YXIgZmlsZSA9IFwianNvbi9cIiArIGFyZWEgKyBcIl9yZXNvcnRzLmpzb25cIjtcblxuICAgICQuZ2V0SlNPTihmaWxlKVxuICAgICAgICAuZG9uZShmdW5jdGlvbiAoanNvbikge1xuICAgICAgICAgICAgY2FsbGJhY2soanNvbiwgYXJlYSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5mYWlsKGZ1bmN0aW9uIChqcXhociwgdGV4dFN0YXR1cywgZXJyb3IpIHtcbiAgICAgICAgICAgIHZhciBlcnIgPSB0ZXh0U3RhdHVzICsgXCIsIFwiICsgZXJyb3I7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlcXVlc3QgRmFpbGVkOiBcIiArIGVycik7XG4gICAgICAgIH0pO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gbG9hZFJlc29ydHM7IiwidmFyIGJ1aWxkUmVzb3J0QnJpZWZEaXYgPSByZXF1aXJlKFwiLi9idWlsZF9SZXNvcnRfQnJpZWZfRGl2LmpzXCIpO1xudmFyIHJlcXVlc3RDdXJyZW50V2VhdGhlciA9IHJlcXVpcmUoXCIuL3JlcXVlc3RfQ3VycmVudF9XZWF0aGVyLmpzXCIpO1xudmFyIGluc2VydEN1cnJlbnRXZWF0aGVyID0gcmVxdWlyZShcIi4vaW5zZXJ0X0N1cnJlbnRfV2VhdGhlci5qc1wiKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzLmpzXCIpO1xuXG4vKiogY2FsbHMgYnVpbGRlciBhbmQgaW5zZXJ0cyBuZXcgcmVzb3J0IHNuaXBwZXRzIG9uIHBhZ2UgKi9cblxudmFyIHByaW50UmVzb3J0cyA9IGZ1bmN0aW9uIChqc29uLCBhcmVhKSB7XG4gICAgXG4gICAgJChcIi5yZWdpb25fc2VsZWN0ZWRcIikudGV4dChhcmVhLnRvVXBwZXJDYXNlKCkucmVwbGFjZSgvXy9nLFwiIFwiKSk7XG4gICAgXG4gICAgdmFyICRyZXNvcnRzX3Jlc3VsdHNfZGl2ID0gJChcIiNyZXNvcnRzX3Jlc3VsdHNfZGl2XCIpO1xuXG4gICAgJHJlc29ydHNfcmVzdWx0c19kaXYuZW1wdHkoKTtcblxuICAgIHZhciByZXNvcnRzX2FyciA9IGpzb25bYXJlYV07XG4gICAgdmFyIGFsbFJlc29ydHMgPSBcIlwiO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSByZXNvcnRzX2Fyci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXG4gICAgICAgIHJlc29ydHNfYXJyW2ldLmlkID0gcmVzb3J0c19hcnJbaV0ubmFtZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoLyAvZywgXCJfXCIpLnJlcGxhY2UoL1xcLi9nLCBcIlwiKTtcbiAgICAgICAgXG4gICAgICAgIHZhciBwYXJzZWRfYWRkcmVzcyA9IHV0aWxzLnBhcnNlQWRkcmVzcyhyZXNvcnRzX2FycltpXSk7XG4gICAgICAgIFxuICAgICAgICB2YXIgcmVzb3J0X2JyaWVmX2RpdiA9IGJ1aWxkUmVzb3J0QnJpZWZEaXYocmVzb3J0c19hcnJbaV0sIHBhcnNlZF9hZGRyZXNzKTtcbiAgICAgICAgYWxsUmVzb3J0cyA9IGFsbFJlc29ydHMgKyByZXNvcnRfYnJpZWZfZGl2O1xuXG4gICAgICAgIHJlcXVlc3RDdXJyZW50V2VhdGhlcihyZXNvcnRzX2FycltpXSwgcGFyc2VkX2FkZHJlc3MsIGZ1bmN0aW9uIChqc29uLCBuYW1lKSB7XG4gICAgICAgICAgICBpbnNlcnRDdXJyZW50V2VhdGhlcihqc29uLCBuYW1lKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy9pbnNlcnQgYWxsIHJlc29ydHMgb24gcGFnZVxuICAgICRyZXNvcnRzX3Jlc3VsdHNfZGl2LmFwcGVuZChhbGxSZXNvcnRzKTtcbiAgICBcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHByaW50UmVzb3J0czsiLCIvKiogZ2V0cyBjdXJyZW50IHdlYXRoZXIgY29uZGl0aW9ucyBmcm9tIG9wZW53ZWF0aGVybWFwLm9yZyAqL1xuXG52YXIgcmVxdWVzdEN1cnJlbnRXZWF0aGVyID0gZnVuY3Rpb24gKHJlc29ydF9vYmosIHBhcnNlZF9hZGRyZXNzLCBjYWxsYmFjaykge1xuXG4gICAgdmFyIGxhdF9sb24gPSByZXNvcnRfb2JqLmNvbnRhY3RfaW5mby5sYXRfbG9uO1xuICAgIGlmIChsYXRfbG9uLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGF0X2xvbiA9IGxhdF9sb24uc3BsaXQoXCIsXCIpO1xuICAgICAgICB2YXIgbGF0ID0gbGF0X2xvblswXTtcbiAgICAgICAgdmFyIGxvbiA9ICQudHJpbShsYXRfbG9uWzFdKTtcbiAgICAgICAgdmFyIHVybCA9IFwiaHR0cDovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvd2VhdGhlcj9sYXQ9XCIgKyBsYXQgKyBcIiZsb249XCIgKyBsb24gKyBcIiZ1bml0cz1JbXBlcmlhbCZhcHBpZD1jY2E3MDFhMDI1NDEwNzJkZThhZTg5MjA2YzlmYWVlOVwiO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHVybCA9IFwiaHR0cDovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvd2VhdGhlcj96aXA9XCIgKyBwYXJzZWRfYWRkcmVzcy56aXAgKyBcIix1cyZ1bml0cz1JbXBlcmlhbCZhcHBpZD1jY2E3MDFhMDI1NDEwNzJkZThhZTg5MjA2YzlmYWVlOVwiO1xuXG5cbiAgICB9XG5cblxuICAgICQuZ2V0SlNPTih1cmwpXG4gICAgICAgIC5kb25lKGZ1bmN0aW9uIChqc29uKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhqc29uLCByZXNvcnRfb2JqKTtcbiAgICAgICAgY29uc29sZS5sb2coanNvbi5uYW1lKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmZhaWwoZnVuY3Rpb24gKGpxeGhyLCB0ZXh0U3RhdHVzLCBlcnJvcikge1xuICAgICAgICAgICAgdmFyIGVyciA9IHRleHRTdGF0dXMgKyBcIiwgXCIgKyBlcnJvcjtcbiAgICAgICAgfSk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1ZXN0Q3VycmVudFdlYXRoZXI7IiwidmFyIHByaW50UmVzb3J0cyA9IHJlcXVpcmUoXCIuL3ByaW50X1Jlc29ydHMuanNcIik7XG5cblxuLyoqIHNldCB1cCB0aGUgc29ydCBiYXIgZnVuY3Rpb25hbGl0eSAqL1xuXG52YXIgc29ydGluZyA9IHtcbiAgICBcbiAgICAvL2hhdmUgYSBjb3B5IG9mIHRoZSBzZWxlY3RlZCBqc29uIGFuZCBhcmVhIGluIHRoaXMgb2JqZWN0IHRvIHVzZSBpbiBzb3J0UmVzb3J0c0FycmF5KCk7XG4gICAgc2VsZWN0ZWRfanNvbjoge30sXG4gICAgc2VsZWN0ZWRfYXJlYToge30sXG4gICAgXG4gICAgc2V0U2VsZWN0ZWQ6IGZ1bmN0aW9uKGpzb24sIGFyZWEpe1xuICAgICAgICB0aGlzLnNlbGVjdGVkX2pzb24gPSBqc29uO1xuICAgICAgICB0aGlzLnNlbGVjdGVkX2FyZWEgPSBhcmVhO1xuICAgIH0sXG4gICAgXG4gICAgXG4gICAgXG4gICAgXG5cbiAgICAvL3NvcnRzIHJlc29ydCBqc29uLiBjYWxsZWQgd2hlbiBzb3J0IGxpbmsgaXMgY2xpY2tlZCBvciByZWdpb24gZHJvcGRvd24gaXMgY2hhbmdlZFxuICAgIHNvcnRSZXNvcnRzQXJyYXk6IGZ1bmN0aW9uIChzb3J0X2J5LCBzb3J0X29yZGVyKSB7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBzb3J0X2J5ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBzb3J0X2J5ID0gdGhpcy5jYWNoZWQgPyB0aGlzLmNhY2hlZC5zb3J0X2J5IDogXCJuYW1lXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBzb3J0X29yZGVyID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBzb3J0X29yZGVyID0gdGhpcy5jYWNoZWQgPyB0aGlzLmNhY2hlZC5zb3J0X29yZGVyIDogXCJkZXNjXCI7XG4gICAgICAgIH1cblxuICAgICAgICBcbiAgICAgICAgdmFyIHRoaXNSZXNvcnRBcnJheSA9IHRoaXMuc2VsZWN0ZWRfanNvblt0aGlzLnNlbGVjdGVkX2FyZWFdO1xuICAgICAgICBpZiAoc29ydF9ieSA9PT0gXCJuYW1lXCIpIHtcbiAgICAgICAgICAgIHRoaXNSZXNvcnRBcnJheS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFbc29ydF9ieV0ubG9jYWxlQ29tcGFyZShiW3NvcnRfYnldKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgeyAvL2ZvciBudW1iZXJlZCBzb3J0cyBpbiB0d28gbGV2ZWxzXG5cbiAgICAgICAgICAgIHZhciBzb3J0X3Nwb3QgPSBzb3J0X2J5LnNwbGl0KFwiLlwiKTtcblxuICAgICAgICAgICAgdGhpc1Jlc29ydEFycmF5LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYVtzb3J0X3Nwb3RbMF1dW3NvcnRfc3BvdFsxXV0gLSBiW3NvcnRfc3BvdFswXV1bc29ydF9zcG90WzFdXTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuXG4gICAgICAgIGlmIChzb3J0X29yZGVyID09PSBcImFzY1wiKSB7XG4gICAgICAgICAgICB0aGlzUmVzb3J0QXJyYXkucmV2ZXJzZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYWNoZWQgPSB7XG4gICAgICAgICAgICBzb3J0X29yZGVyOiBzb3J0X29yZGVyLFxuICAgICAgICAgICAgc29ydF9ieTogc29ydF9ieVxuICAgICAgICB9XG5cbiAgICAgICAvL3JlYnVpbGQgcmVzb3J0cyBsaXN0IG9uIHNjcmVlblxuICAgICAgICAgICAgcHJpbnRSZXNvcnRzKHRoaXMuc2VsZWN0ZWRfanNvbiwgdGhpcy5zZWxlY3RlZF9hcmVhKTtcbiAgICB9LFxuXG4gICAgLy9zb3J0IGJhciBpbml0aWFsaXplciAtIGNhbGxlZCB3aGVuIHBhZ2UgbG9hZHNcbiAgICBzb3J0QmFySW5pdDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICQoXCIjc29ydF9iYXIgLnNvcnRfbGlua1wiKS5jbGljayhmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIHZhciBjbGlja2VkX3NvcnQgPSAkKHRoaXMpO1xuICAgICAgICAgICAgdmFyIHNvcnRfYnkgPSBjbGlja2VkX3NvcnQuYXR0cihcInNvcnRfYnlcIik7XG4gICAgICAgICAgICB2YXIgc29ydF9vcmRlciA9IGNsaWNrZWRfc29ydC5hdHRyKFwic29ydF9vcmRlclwiKTtcblxuICAgICAgICAgICAgJChcIiNzb3J0X2JhciAuc29ydF9saW5rX3NlbGVjdGVkXCIpLnJlbW92ZUNsYXNzKFwic29ydF9saW5rX3NlbGVjdGVkXCIpO1xuICAgICAgICAgICAgY2xpY2tlZF9zb3J0LmFkZENsYXNzKFwic29ydF9saW5rX3NlbGVjdGVkXCIpO1xuXG5cbiAgICAgICAgICAgIC8vaWYgYXNjZW5kaW5nLCBtYWtlIGRlc2NlbmRpbmcgZXRjLlxuXG4gICAgICAgICAgICB2YXIgdHJpYW5nbGUgPSBzb3J0X29yZGVyID09PSBcImFzY1wiID8gXCJcXHUyNUJDXCIgOiBcIlxcdTI1QjJcIjtcbiAgICAgICAgICAgIHZhciBuZXdfc29ydF9vcmRlciA9IHNvcnRfb3JkZXIgPT09IFwiYXNjXCIgPyBcImRlc2NcIiA6IFwiYXNjXCI7XG5cblxuXG4gICAgICAgICAgICAvLyBzb3J0IHRoZSByZXNvcnRzIGFycmF5XG4gICAgICAgICAgICBzb3J0aW5nLnNvcnRSZXNvcnRzQXJyYXkoc29ydF9ieSwgc29ydF9vcmRlcik7XG5cbiAgICAgICAgICAgICQoXCIuc29ydF90cmlhbmdsZVwiLCBjbGlja2VkX3NvcnQpLnRleHQodHJpYW5nbGUpO1xuXG4gICAgICAgICAgICBjbGlja2VkX3NvcnQudG9nZ2xlQ2xhc3MoXCJzb3J0X29yZGVyX2FzYyBzb3J0X29yZGVyX2Rlc2NcIikuYXR0cihcInNvcnRfb3JkZXJcIiwgbmV3X3NvcnRfb3JkZXIpO1xuXG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbn1cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gc29ydGluZzsiLCIvKiogd2hlbiBcIm1vcmVcIiBsaW5rIGlzIGNsaWNrZWQsIGdldHMgd2lkZ2V0IGZvciB0aGF0IHJlc29ydCBhbmQgYXBwZW5kcyBpdCB0byByZXNvcnQgc25pcHBldCAqL1xuXG52YXIgdG9nZ2xlV2lkZ2V0RGlzcGxheVNldHVwID0gZnVuY3Rpb24oKXtcbiAgICBcbiAgICBcbiAgICAkKFwiLnRvZ2dsZV93aWRnZXRfbGlua1wiKS5jbGljayhmdW5jdGlvbigpeyAgICAgICAgXG4gICAgICAgIGlmICgkKHRoaXMpLnRleHQoKSA9PT0gXCJzaG93IGN1cnJlbnQgc3RhdHNcIil7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBjb25kaXRpb25zX3dpZGdldF9jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0X2NvbnRhaW5lci5jbGFzc05hbWUgPSBcImNvbmRpdGlvbnNfd2lkZ2V0X2NvbnRhaW5lclwiO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgY29uZGl0aW9uc193aWRnZXRfc25vd2NvdW50cnlfbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0X3Nub3djb3VudHJ5X2xpbmsuY2xhc3NOYW1lID0gXCJjb25kaXRpb25zX3dpZGdldF9zbm93Y291bnRyeV9saW5rXCI7XG4gICAgICAgICAgICAgICAgY29uZGl0aW9uc193aWRnZXRfc25vd2NvdW50cnlfbGluay50ZXh0Q29udGVudCA9XCJQb3dlcmVkIGJ5IHd3dy5zbm9jb3VudHJ5LmNvbVwiO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0X3Nub3djb3VudHJ5X2xpbmsuaHJlZiA9IFwiaHR0cDovL3d3dy5zbm9jb3VudHJ5LmNvbVwiO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0X3Nub3djb3VudHJ5X2xpbmsudGFyZ2V0ID0gXCJfYmxhbmtcIjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgY29uZGl0aW9uc193aWRnZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaWZyYW1lXCIpO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0LmNsYXNzTmFtZSA9IFwiY29uZGl0aW9uc193aWRnZXRcIjtcbiAgICAgICAgICAgICAgICBjb25kaXRpb25zX3dpZGdldC5zcmMgPSAkKHRoaXMpLmF0dHIoXCJ3aWRnZXRfbGlua1wiKTtcbiAgICAgICAgICAgICAgICBjb25kaXRpb25zX3dpZGdldC5oZWlnaHQgPSBcIjI4MFwiO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0LndpZHRoID0gXCI1OTBcIjtcbiAgICAgICAgICAgICAgICBjb25kaXRpb25zX3dpZGdldC5zZWFtbGVzcz0gXCJzZWFtbGVzc1wiO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0LmZyYW1lQm9yZGVyPVwiMFwiO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0LnNjcm9sbGluZyA9IFwibm9cIjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25kaXRpb25zX3dpZGdldF9jb250YWluZXIuYXBwZW5kQ2hpbGQoY29uZGl0aW9uc193aWRnZXRfc25vd2NvdW50cnlfbGluayk7XG4gICAgICAgICAgICBjb25kaXRpb25zX3dpZGdldF9jb250YWluZXIuYXBwZW5kQ2hpbGQoY29uZGl0aW9uc193aWRnZXQpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgICQodGhpcykudGV4dChcImhpZGUgY3VycmVudCBzdGF0c1wiKVxuICAgICAgICAgICAgICAgIC5jbG9zZXN0KFwiLnJlc29ydF9zbmlwcGV0XCIpLmFwcGVuZChjb25kaXRpb25zX3dpZGdldF9jb250YWluZXIpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICQodGhpcykudGV4dChcInNob3cgY3VycmVudCBzdGF0c1wiKVxuICAgICAgICAgICAgICAgIC5jbG9zZXN0KFwiLnJlc29ydF9zbmlwcGV0XCIpLmZpbmQoXCIuY29uZGl0aW9uc193aWRnZXRfY29udGFpbmVyXCIpLnJlbW92ZSgpO1xuICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgICBcbiAgICAgICAgXG4gICAgfSk7XG4gICAgXG4gICAgXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB0b2dnbGVXaWRnZXREaXNwbGF5U2V0dXA7IiwiICAgICAgdmFyIHV0aWxzID0ge1xuXG4gICAgICAgICAgLyoqIGFkZCBjb21tYXMgZnVuY3Rpb24gKi9cbiAgICAgICAgICBhZGRDb21tYXM6IGZ1bmN0aW9uICh2YWwpIHtcblxuICAgICAgICAgICAgICBpZiAoaXNOYU4odmFsKSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICgodmFsID4gOTk5KSB8fCAodmFsIDwgLTk5OSkpIHtcbiAgICAgICAgICAgICAgICAgIHdoaWxlICgvKFxcZCspKFxcZHszfSkvLnRlc3QodmFsLnRvU3RyaW5nKCkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFsID0gdmFsLnRvU3RyaW5nKCkucmVwbGFjZSgvKFxcZCspKFxcZHszfSkvLCAnJDEnICsgJywnICsgJyQyJyk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgLyoqIHJldHVybiBfc20gZm9yIGltYWdlIG5hbWUgKi9cbiAgICAgICAgICB0aHVtYm5haWxOYW1lOiBmdW5jdGlvbiAoaW1hZ2VfbmFtZSkge1xuICAgICAgICAgICAgICByZXR1cm4gaW1hZ2VfbmFtZS5yZXBsYWNlKCcucG5nJywgJ19zbS5wbmcnKS5yZXBsYWNlKCcuanBnJywgJ19zbS5qcGcnKS5yZXBsYWNlKCcuanBlZycsICdfc20uanBlZycpO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICAvKiogcmV0dXJuIG1vZGRlZCBsYW5ndWFnZSBmb3Igd2VhdGhlciBkZXNjcmlwdGlvbiAqL1xuICAgICAgICAgIHdlYXRoZXJEZXNjcmlwdG9yOiBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzdHJpbmcucmVwbGFjZShcIm92ZXJjYXN0IGNsb3Vkc1wiLCBcIm92ZXJjYXN0XCIpLnJlcGxhY2UoXCJza3kgaXMgY2xlYXJcIiwgXCJjbGVhciBza2llc1wiKTtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgcGhvbmVGb3JtYXQ6IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC9cXCh8XFwpL2csIFwiXCIpLnJlcGxhY2UoLy18IC9nLCBcIiYjODIwOTtcIik7XG4gICAgICAgICAgfSxcblxuXG4gICAgICAgICAgcGFyc2VBZGRyZXNzOiBmdW5jdGlvbiAocmVzb3J0X29iaikge1xuICAgICAgICAgICAgICB2YXIgcGFyc2VkX2FkZHJlc3MgPSB7fTtcblxuICAgICAgICAgICAgICAvL2lmIHBhcnRzIGFyZSB0aGVyZSwgdXNlIHRob3NlXG4gICAgICAgICAgICAgIHBhcnNlZF9hZGRyZXNzLnN0cmVldF9hZHJlc3MgPSByZXNvcnRfb2JqLmNvbnRhY3RfaW5mby5zdHJlZXRfYWRkcmVzcyB8fCBcIlwiO1xuICAgICAgICAgICAgICBwYXJzZWRfYWRkcmVzcy5jaXR5ID0gcmVzb3J0X29iai5jb250YWN0X2luZm8uY2l0eSB8fCBcIlwiO1xuICAgICAgICAgICAgICBwYXJzZWRfYWRkcmVzcy5zdGF0ZSA9IHJlc29ydF9vYmouY29udGFjdF9pbmZvLnN0YXRlIHx8IFwiXCI7XG4gICAgICAgICAgICAgIHBhcnNlZF9hZGRyZXNzLnppcCA9IHJlc29ydF9vYmouY29udGFjdF9pbmZvLnppcCB8fCBcIlwiO1xuXG4gICAgICAgICAgICAgIC8vZnVsbCBhZGRyZXNzIHVzZXMgZnVsbCBpZiBpdHMgdGhlcmUsIG9yIGEgY29tYmluYXRpb24gaWYgaXQncyBub3RcbiAgICAgICAgICAgICAgcGFyc2VkX2FkZHJlc3MuZnVsbF9hZGRyZXNzID0gcmVzb3J0X29iai5jb250YWN0X2luZm8uZnVsbF9hZGRyZXNzIHx8IHJlc29ydF9vYmouY29udGFjdF9pbmZvLnN0cmVldF9hZGRyZXNzICsgXCIsIFwiICsgcmVzb3J0X29iai5jb250YWN0X2luZm8uY2l0eSArIFwiLCBcIiArIHJlc29ydF9vYmouY29udGFjdF9pbmZvLnN0YXRlICsgXCIgXCIgKyByZXNvcnRfb2JqLmNvbnRhY3RfaW5mby56aXA7XG5cbiAgICAgICAgICAgICAgLy9pZiBmdWxsIGFkZHJlc3MgaXMgdGhlcmUsIHBhcnNlIGl0IGZvciBwYXJ0cyBvZiB0aGUgYWRkcmVzc1xuICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlc29ydF9vYmouY29udGFjdF9pbmZvLmZ1bGxfYWRkcmVzcyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgdmFyIGFkZHJlc3NfYXJyID0gcmVzb3J0X29iai5jb250YWN0X2luZm8uZnVsbF9hZGRyZXNzLnNwbGl0KFwiLFwiKTtcblxuICAgICAgICAgICAgICAgICAgcGFyc2VkX2FkZHJlc3MuemlwID0gYWRkcmVzc19hcnJbYWRkcmVzc19hcnIubGVuZ3RoIC0gMV0uc2xpY2UoMyk7XG4gICAgICAgICAgICAgICAgICBwYXJzZWRfYWRkcmVzcy5zdGF0ZSA9IGFkZHJlc3NfYXJyW2FkZHJlc3NfYXJyLmxlbmd0aCAtIDFdLnNsaWNlKDEsIDMpO1xuICAgICAgICAgICAgICAgICAgcGFyc2VkX2FkZHJlc3MuY2l0eSA9IGFkZHJlc3NfYXJyW2FkZHJlc3NfYXJyLmxlbmd0aCAtIDJdO1xuICAgICAgICAgICAgICAgICAgcGFyc2VkX2FkZHJlc3Muc3RyZWV0X2FkcmVzcyA9IGFkZHJlc3NfYXJyLnNsaWNlKDAsIGFkZHJlc3NfYXJyLmxlbmd0aCAtIDIpLmpvaW4oXCIsXCIpO1xuXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICByZXR1cm4gcGFyc2VkX2FkZHJlc3M7XG5cbiAgICAgICAgICB9LFxuICAgICAgICAgIFxuXG4gICAgICAgICAgdXJsRm9ybWF0OiBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gICAgICAgICAgICAgIGlmIChzdHJpbmcuc2xpY2UoMCwgMykgPT09IFwid3d3XCIpIHtcbiAgICAgICAgICAgICAgICAgIHN0cmluZyA9IFwiaHR0cDovL1wiICsgc3RyaW5nO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBzdHJpbmc7XG4gICAgICAgICAgfVxuXG4gICAgICB9XG5cblxuICAgICAgbW9kdWxlLmV4cG9ydHMgPSB1dGlsczsiXX0=
