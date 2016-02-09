/** sticks the sort bar to the top when page is scrolled. sort_bar_anchor is an empty div about the sort bar div **/

var stickySortBarSetup = function stickySortBarSetup(){

    function stickyRelocate() {
        var window_top = $(window).scrollTop();
        var div_top = $('#sort_bar_anchor').offset().top;
        if (window_top > div_top) {
            $('#sort_bar').addClass('stick');
            $("#sort_bar_anchor").addClass('stuck');
            
        } else {
            $('#sort_bar').removeClass('stick');
            $("#sort_bar_anchor").removeClass('stuck');
        }
    }

    $(function () {
        $(window).scroll(stickyRelocate);
            stickyRelocate();
    });
    
}

module.exports = stickySortBarSetup;