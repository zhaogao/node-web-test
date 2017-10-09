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
		blur: function() {
			$(this).each(function() {
				$(this).on('blur keyup', function() {
					$(this).format();
				})
			});
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
	//全局ajax设置 
	$.ajaxSetup({
		complete: function(data){ //session失效就跳转登录页
			if(data.responseJSON.ret_code&&data.responseJSON.ret_code==99){
				var realWindow = window.top == window.self ? window.self : window.top
				realWindow.location.href='/login';
			}
		}
	});

});