var buildResortBriefDiv = function (resort_obj) {
    var name = "<a target ='_blank' href ='http://" + resort_obj.contact_info.url + "'><h3><img class ='resort_logo_img' src = 'images/resort_logos/" + resort_obj.images.logo + "'/>" + resort_obj.name + "</h3></a>";

    var full_address = "<a target ='_blank' href ='" + resort_obj.contact_info.address_url + "'><span class = 'full_address'>" + resort_obj.contact_info.street_address + ", " + resort_obj.contact_info.city + ", " + resort_obj.contact_info.state + " " + resort_obj.contact_info.zip + "</span></a>";

    var phone = "<span class ='resort_phone_number'>" + resort_obj.contact_info.phone.replace(/-/g, "&#8209;") + "</span>";

    var trails_report = "<span class = 'trails_report'><span class = 'trails_open'>5</span> / " + resort_obj.stats.trails + " trails open</span>";
    
    var acres_report = "<span class = 'acres_report'><span class = 'acres_open'>5</span> / " + resort_obj.stats.skiable_acres + " acres open</span>";
    
    var map_thumbnail = "<a href='images/resort_maps/"+resort_obj.images.map+"'><span class = 'map_thumbnail'><img src='images/resort_maps/" + resort_obj.images.map.replace('.png', '_sm.png') + "'/></span></a>";


    var snippet = "<div id='resort_snippet'><p>\
        " + name + trails_report + acres_report + "<br/>" + full_address + " | " + phone + "</p>\
        " + map_thumbnail + "\
        </div>";
    


    return snippet;
}

//module.exports = Resort_brief_div;