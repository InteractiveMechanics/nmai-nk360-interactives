$(function() {
    /**
     * Universal function to activate the lightGallery
     */

    $(document).on('keypress', '[data-gallery]', function(e){ if(e.which == 13){ $(this).click(); }});
    $(document).on('click tap', '[data-gallery]', generateLightGallery);

    function generateLightGallery(){
        var credit = '';
        var caption = '';

        var image = $(this).data('gallery-image');

        if ($(this).data('gallery-credit')) {
            credit = $(this).data('gallery-credit');
        }
        if ($(this).data('gallery-caption')) {
            caption = $(this).data('gallery-caption');
        }

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
        $(this).on('onCloseAfter.lg',function(){
            sendAnalyticsEvent('Lightbox', 'close');
        });
        
        sendAnalyticsEvent('Lightbox', 'open');
    }
});