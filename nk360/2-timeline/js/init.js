/**
 * All setup and init functions, data and event binding
 */
Init = (function() {

    var lessonPlan1 = '/nk360/pnw-fish-wars/index.cshtml#issues';
    var lessonPlan2 = '/nk360/pnw-fish-wars/index.cshtml#court';
    var lessonPlan3 = '/nk360/pnw-fish-wars/index.cshtml#resolved';
    var lessonPlanComplete = '/nk360/pnw-fish-wars/index.cshtml#summative';

    var init = function() {
        generateCredits();
    	bindEvents();
    }

    var generateCredits = function() {
        var credits = data.credits;
        $('#footer-credits').attr('data-content', credits);
    }

    var getEra = function() {
        var myURL = window.location.href;
    }

    // https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript 
    var getParameterByName = function(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    
        if (!results) return null;
        if (!results[2]) return '';
        
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    var myEra = getParameterByName('era');


    var updateURL = function(era) {
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?era=' + era;
        window.history.pushState({path:newurl},'',newurl);
    }


    var displaySelectionScreen = function() {
        sendAnalyticsScreen('Selection screen');
        $('#return-to-lesson-link').attr('href', lessonPlan1);

    	if ($('#selection').hasClass('hidden')) {
    		$('#selection').removeClass('hidden fadeOut').addClass('fadeIn');
            displayEra1();
            displayEra2();
            displayEra3();
            era3Complete();
    	} else {
            displayEra1();
            displayEra2();
            displayEra3();
            era3Complete();
        }

    	if (!$('#detail').hasClass('hidden')) {
    		$('#detail').addClass('hidden');
    	}

    	if (!$('#explore').hasClass('hidden')) {
    		$('#explore').addClass('hidden');
    	}
    };

    var isSelectionScreen = function() {
        $('#return-to-lesson-link').attr('href', lessonPlan1);

    	if ($('#selection').hasClass('hidden')) {
    		$('.icon-home').removeClass('hidden');
            if (myEra == 1) {
                displayEra1();  
            } else if (myEra == 2) {
                displayEra2();
            } else if (myEra == 3) {
                displayEra3();
            } else if (myEra == 4) {
                era3Complete();
            } else {

            }


    	} else {
    		$('.icon-home').addClass('hidden');

            if (myEra == 1) {
                $('#return-to-lesson-link').attr('href', lessonPlan1);
            }
            else if (myEra == 2) {
                displayEra2();
            } else if (myEra == 3) {
                displayEra3();
            } else if (myEra == 4) {
                era3Complete();
            } else {

            }

    	}
    }

    var displayEra1 = function() {
        if (myEra == 1 && !$('.era-block[data-era="1"]').hasClass('completed')) {
            $('#return-to-lesson-link').attr('href', lessonPlan1);
        } else if (myEra == 1 && $('.era-block[data-era="1"]').hasClass('completed')) {
            $('#return-to-lesson-link').attr('href', lessonPlan1);
            $('.completed').find('.start-timeline-btn').addClass('hidden');
            $('.completed').find('.view-timeline-btn').removeClass('hidden');
        } else {

        }
    }

    var displayEra2 = function() {
        if (myEra == 2 && !$('.era-block[data-era="2"]').hasClass('completed')) {
            $('#return-to-lesson-link').attr('href', lessonPlan2);
            $('.era-block[data-era="1"]').addClass('completed');
            $('.completed').find('.start-timeline-btn').addClass('hidden');
            $('.completed').find('.view-timeline-btn').removeClass('hidden'); 
            $('.era-block[data-era="2"]').find('.start-timeline-btn').removeClass('hidden');
            $('.era-block[data-era="2"]').addClass('active');

        } else if (myEra == 2 && $('.era-block[data-era="2"]').hasClass('completed')) {
            $('#return-to-lesson-link').attr('href', lessonPlan2);
            $('.era-block[data-era="1"]').addClass('completed');
            $('.completed').find('.start-timeline-btn').addClass('hidden');
            $('.completed').find('.view-timeline-btn').removeClass('hidden'); 
            $('.era-block[data-era="2"]').addClass('active');   
        } else {

        }


    }

    

    var displayEra3 = function() {
        if (myEra == 3 && !$('.era-block[data-era="3"]').hasClass('completed')) {
            $('#return-to-lesson-link').attr('href', lessonPlan3);
            $('.era-block[data-era="1"]').addClass('completed');
            $('.era-block[data-era="2"]').addClass('completed');
            $('.completed').find('.start-timeline-btn').addClass('hidden');
            $('.completed').find('.view-timeline-btn').removeClass('hidden'); 
            $('.era-block[data-era="3"]').find('.start-timeline-btn').removeClass('hidden');
            $('.era-block[data-era="2"]').addClass('active');
            $('.era-block[data-era="3"]').addClass('active');

        } else if (myEra == 3 && $('.era-block[data-era="3"]').hasClass('completed')) {
            $('#return-to-lesson-link').attr('href', lessonPlan3);
            $('.era-block[data-era="1"]').addClass('completed');
            $('.era-block[data-era="2"]').addClass('completed');
            $('.completed').find('.start-timeline-btn').addClass('hidden');
            $('.completed').find('.view-timeline-btn').removeClass('hidden'); 
            $('.era-block[data-era="2"]').addClass('active');
            $('.era-block[data-era="3"]').addClass('active');
        } else {

        }

    }
    var era3Complete = function() {
        if (myEra == 4) {
            $('#return-to-lesson-link').attr('href', lessonPlanComplete);
            $('.era-block').addClass('completed');
            $('.completed').find('.start-timeline-btn').addClass('hidden');
            $('.completed').find('.view-timeline-btn').removeClass('hidden');
            $('.era-block[data-era="2"]').addClass('active');
            $('.era-block[data-era="3"]').addClass('active'); 

        }
    }
    

    var bindEvents = function() {
         $(document).on('click tap', '.icon-home', displaySelectionScreen);
         $(document).ready(isSelectionScreen);
    }
    
    return {
        init: init,
        isSelectionScreen: isSelectionScreen,
        getEra: getEra,
        updateURL: updateURL, 
        getParameterByName: getParameterByName
    }
})();
