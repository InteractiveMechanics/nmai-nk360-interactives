$(function() {
    /**
     * Universal function to activate the lightGallery
     */

    $('body').on('click tap', '[data-gallery]', function(){
        var image = $(this).data('gallery-image');
        var credit = $(this).data('gallery-credit');
        var caption = $(this).data('gallery-caption');

        $(this).lightGallery({
            download: true,
            fullScreen: false,
            actualSize: false,
            share: false,
            dynamic: true,
            hash: false,
            dynamicEl: [{
                "src": image,
                "subHtml": "<p>" + caption + " <em>" + credit + "</em></p>"
            }]
        });
        
    });
});