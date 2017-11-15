/**
 * All setup and init functions, data and event binding
 */
Init = (function() {
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
        console.log(myURL);
        console.log('this is getEra');
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
        console.log('displaySelectionScreen is running');
        var lessonPlan1 = 'http://nmai-webdev01.si.edu:84/nk360/pnw-fish-wars-tactics/index.html';
        $('#back-to-module-btn').attr('href', lessonPlan1);
        $('#return-to-lesson-link').attr('href', lessonPlan1);

    	if ($('#selection').hasClass('hidden')) {
    		$('#selection').removeClass('hidden fadeOut').addClass('fadeIn');
            displayEra2();
            displayEra3();
            era3Complete();
    	} else {
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
        var lessonPlan1 = 'http://nmai-webdev01.si.edu:84/nk360/pnw-fish-wars-tactics/index.html';
        $('#back-to-module-btn').attr('href', lessonPlan1);
        $('#return-to-lesson-link').attr('href', lessonPlan1);

    	if ($('#selection').hasClass('hidden')) {
    		$('.icon-home').removeClass('hidden');
            if (myEra ==1) {
                var lessonPlan1 = 'http://nmai-webdev01.si.edu:84/nk360/pnw-fish-wars-tactics/index.html';
                $('#back-to-module-btn').attr('href', lessonPlan1);
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


    	} else {
    		$('.icon-home').addClass('hidden');

            if (myEra ==1) {
                var lessonPlan1 = 'http://nmai-webdev01.si.edu:84/nk360/pnw-fish-wars-tactics/index.html';
                $('#back-to-module-btn').attr('href', lessonPlan1);
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

    var displayEra2 = function() {
        if (myEra == 2 && !$('.era-block[data-era="2"]').hasClass('completed')) {
            // Change this URL for ?era=2
            var lessonPlan2 = 'http://nmai-webdev01.si.edu:84/nk360/pnw-fish-wars/backlash.cshtml';
            $('#return-to-lesson-link').attr('href', lessonPlan2);

            $('.era-block[data-era="1"]').addClass('completed');
            $('.completed').find('.start-timeline-btn').addClass('hidden');
            $('.completed').find('.view-timeline-btn').removeClass('hidden'); 
            $('.era-block[data-era="2"]').find('.start-timeline-btn').removeClass('hidden');
            $('.era-block[data-era="2"]').addClass('active');

        } else if (myEra == 2 && $('.era-block[data-era="2"]').hasClass('completed')) {
            // Change this URL for ?era=2
            var lessonPlan2 = 'http://nmai-webdev01.si.edu:84/nk360/pnw-fish-wars/backlash.cshtml';
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
            // Change this URL for ?era=3
            var lessonPlan3 = 'http://nmai-webdev01.si.edu:84/nk360/pnw-fish-wars/justice.cshtml';
            $('#return-to-lesson-link').attr('href', lessonPlan3);

            $('.era-block[data-era="1"]').addClass('completed');
            $('.era-block[data-era="2"]').addClass('completed');
            $('.completed').find('.start-timeline-btn').addClass('hidden');
            $('.completed').find('.view-timeline-btn').removeClass('hidden'); 
            $('.era-block[data-era="3"]').find('.start-timeline-btn').removeClass('hidden');
            $('.era-block[data-era="2"]').addClass('active');
            $('.era-block[data-era="3"]').addClass('active');

        } else if (myEra == 3 && $('.era-block[data-era="3"]').hasClass('completed')) {
            // Change this URL for ?era=3
            var lessonPlan3 = 'http://nmai-webdev01.si.edu:84/nk360/pnw-fish-wars/justice.cshtml';
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
            // Change this URL for ?era=4
            var lessonPlanComplete = 'http://nmai-webdev01.si.edu:84/nk360/pnw-fish-wars/index.cshtml#summative';
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
