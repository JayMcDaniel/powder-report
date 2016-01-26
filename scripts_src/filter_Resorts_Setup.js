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