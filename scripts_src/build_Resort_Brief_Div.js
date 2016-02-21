var utils = require('./utils.js');
/** builds html from _resorts.json and returns it as a .resort_snippet div*/

var buildResortBriefDiv = function (resort_obj, parsed_address) {
    

    var name_and_logo = "<a class = 'resort_name' target ='_blank' href ='" + utils.urlFormat(resort_obj.contact_info.url) + "'><h3><img title='" + resort_obj.name + " logo' alt='" + resort_obj.name + " logo' class ='resort_logo_img' src = 'images/resort_logos/" + resort_obj.images.logo + "'/>" + resort_obj.name + " <span class='resort_state'>" + parsed_address.state + "</span></h3></a>";

    var trails = `<span class = 'trails report'> ${resort_obj.stats.trails} &nbsp;trails </span>`;

    var lifts = `<span class = 'lifts report'> ${resort_obj.stats.lifts} &nbsp;lifts </span>`;

    var acres = "<span class = 'acres report'>" + utils.addCommas(resort_obj.stats.skiable_acres) + "&nbsp;acres</span>";
    
    var peak = "<span class = 'peak report'>" + utils.addCommas(resort_obj.stats.peak) + "'&nbsp;peak</span>";

    var vert = "<span class = 'vert report'>" + utils.addCommas(resort_obj.stats.vertical_drop_ft) + "'&nbsp;vertical&nbsp;drop</span>";

    var full_address = "<a target ='_blank' href ='" + resort_obj.contact_info.address_url + "'><span class = 'full_address'>" + parsed_address.full_address + "</span></a> ";

    var rates = "<span class = 'rates_adult report'>Adult:&nbsp;$" + resort_obj.rates.adults_midweek + "&nbsp;to&nbsp;$" + resort_obj.rates.adults_prime + "&nbsp;</span>\
                <span class = 'rates_junior report'>Junior:&nbsp;$" + resort_obj.rates.juniors_midweek + "&nbsp;to&nbsp;$" + resort_obj.rates.juniors_prime + "</span> <a class = 'rates_url' target ='_blank' href ='" + resort_obj.rates.rates_url + "'>Get&nbsp;tickets</a>";

    var phone = "<span class ='resort_phone_number'>" + utils.phoneFormat(resort_obj.contact_info.phone) + "</span>";


    var toggle_widget_link = "<span class = 'toggle_widget_link report' widget_link = " + resort_obj.stats.widget_link + "><span class='underline'>current stats</span> <span class = 'hide_show_caret'>+</span></span>";
    
    var toggle_contact_info_link ="<span class = 'toggle_contact_info_link'><span class='underline'>contact info</span> <span class = 'hide_show_caret'>+</span></span> "

    var map_thumbnail = "<div class='map_thumbnail'> <a target ='_blank' href='images/resort_maps/" + resort_obj.images.map + "'><img title='" + resort_obj.name + " trail map' alt='" + resort_obj.name + " trail map' src='images/resort_maps/small/" + utils.thumbnailName(resort_obj.images.map) + "'/></a></div>";


    var snippet = "<div class='resort_snippet' id ='" + resort_obj.id + "' alt='" + resort_obj.name + "  stats and prices'>" + name_and_logo + "\
        " + map_thumbnail + "<div class='resort_snippet_text'>\
        <span class='stats_report' alt ='" + resort_obj.name + " mountain stats' title ='" + resort_obj.name + " mountain stats'>" + trails + lifts + acres + peak + vert + "</span><br/>\
        " + rates + "<br>\
        " + toggle_widget_link + " " + toggle_contact_info_link + "</div>\
            <div class='clear_float'></div>\
        <p class='contact_info'>" + full_address + phone + "\
        </div>";



    return snippet;
}

module.exports = buildResortBriefDiv;