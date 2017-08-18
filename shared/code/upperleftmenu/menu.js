$(document).ready(function() {
		
	$(".module-menu").on('mouseenter', function() {
		$('.module-menu .black-logo').hide();
		$('.module-menu .color-logo').show(); 
		$('#cbp-spmenu-s1').addClass('cbp-spmenu-open');
		//$('.nk360-back-arrow svg').addClass('rotated');
		$('.nk360-back-arrow svg').attr('class', 'rotated');
			$('.module-menu').on('mouseleave', function() {
				$('#cbp-spmenu-s1').removeClass('cbp-spmenu-open');
				//$('.nk360-back-arrow svg').removeClass('rotated');
				$('.nk360-back-arrow svg').attr('class', '');
				$('.color-logo').hide();
				$('.black-logo').show();
			});
	}); 
			
});