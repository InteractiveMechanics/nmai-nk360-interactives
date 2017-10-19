$(function() {
    $('#footer-credits').on('click tap', function(){ 
        var content = $(this).data('content');
        var html = '<div id="credits-container" class="fade hidden"><h1>Credits</h1>' + content + '<span>Click anywhere to close</span></div>';

        $('body').append(html);
        $('#credits-container').removeClass('hidden');
        setTimeout(function() {
            $('#credits-container').addClass('show');
        }, 100);

        $('#credits-container').on('click tap', function(){ 
            $('#credits-container').removeClass('show');
            setTimeout(function() {
                $('#credits-container').addClass('hidden');
            }, 500);
        });
    });
});
