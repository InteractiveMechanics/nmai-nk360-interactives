$(function() {
    /**
     * Universal trigger to play an audio clip
     */

    $('body').on('click', '[data-pronounce]', function(){
        var file = $(this).data('pronounce');
        var audio = new Audio(file);
        audio.play();
    });
});
