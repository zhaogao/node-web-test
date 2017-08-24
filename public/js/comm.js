$(function() {
	$.fn.extend({
		show_error: function(str) {
			var res_str = str ? str : $(this).attr('requiredMsg');
			if ($(this).siblings('.error').length > 0) {
				return;
			}
			$(this).after('<span class="error" >' + res_str + '</span>');
		},
		reomve_error: function() {
			$(this).siblings('.error').remove();
		},
		format: function() {

			$(this).each(function() {
				if ($(this).val().trim() == '') {
					$(this).show_error();
				} else {
					$(this).reomve_error();
				}
			});
		}
	});
});