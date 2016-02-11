/** sticks the sort bar to the top when page is scrolled. sort_bar_anchor is an empty div about the sort bar div **/

var stickySortBarSetup = function stickySortBarSetup(){

    function stickyRelocate() {
        var window_top = $(window).scrollTop();
        var div_top = $('#sort_bar_anchor').offset().top;
        if (window_top > div_top) {
            $('#sort_bar').addClass('stick');
            $("#sort_bar_anchor").addClass('stuck');
            $("#sort_by_p").slideUp(100);
            
            if ($("#sort_bar h3 #filter_resorts_span").length < 1){ 
                $("#filter_resorts_span").appendTo($("#sort_bar h3"));  //move filter bar to top
            }
        } else {
            $('#sort_bar').removeClass('stick');
            $("#sort_bar_anchor").removeClass('stuck');
            $("#sort_by_p").slideDown(100);
            $("#filter_resorts_span").appendTo($("#sort_by_p")); //move filterbar to bottom
        }
    }

    $(function () {
        $(window).scroll(stickyRelocate);
            stickyRelocate();
    });
    
}

module.exports = stickySortBarSetup;