;(function($, window, document, undefined) {
	"use strict";

	var $win = $(window);
	var $doc = $(document);
	var globalKeys = {
		'esc': 27
	};
	
	window.Helper = window.Helper || {};
	window.Component = window.Component || {};


	/* ------------------------------------------------------------ *\
		# Helpers
	\* ------------------------------------------------------------ */

	/**
	 * Returns a function, that, as long as it continues to be invoked, will not be triggered. The function will be called after it stops being called for N milliseconds. If `immediate` is passed, trigger the function on the leading edge, instead of the trailing.
	 * 
	 * @param  {function}
	 * @param  {int}
	 * @param  {bool}
	 * @return {function}
	 */
	Helper.debounce = function(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};

	/**
	 * Check if event's target matches given selectors.
	 *
	 * Example:
	 * elementMatch(event, '.accordion-item-head, .accordion-item-body, .accordion-item');
	 * 
	 * @param  {event}
	 * @param  {string|Object}
	 * @return {bool}
	 */
	Helper.elementMatch = function(e, selector) {
		// stop execution when parameters are not valid
		if (typeof e === 'undefined' || !$(selector).length) {
			console.error('Helper.elementMatch: Invalid parameters!');
			return;
		}

		var $target = $(e.target);

		if ($target.closest(selector).length) {
			return true;
		} else {
			return false;
		}
	};

	/**
	 * Get url params.
	 * 
	 * @param  {string}
	 * @param  {string}
	 * @return {string}
	 */
	Helper.getParameterByName = function(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
		var results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	};

	Helper.getJsonFromParameters = function(string) {
		var result = {};
		string.split("&").forEach(function(part) {
			var item = part.split("=");
			result[item[0]] = decodeURIComponent(item[1]);
		});
		return result;
	};

	/**
	 * Ajax related helper methods.
	 * 
	 * @type {object}
	 */
	Helper.ajax = {
		sendForm: function(form, callback) {
			var self = this;
			var $form = $(form);
			var action = $form.attr('action');
			var method = $form.attr('method');
			var params = $form.serialize();

			if (typeof action === 'undefined' || typeof method === 'undefined') {
				console.error('Helper.ajax.send: Invalid "action" or "method" attributes on form!');
				return;
			}

			if (typeof callback !== 'function') {
				console.error('Helper.ajax.send: Invalid callback function!');
				return;
			}

			$.ajax({
				url: action,
				type: method,
				dataType: 'json',
				data: params,
				success: function(response) {
					callback(response);
				},
				error: function(jqXHR, exception) {
					self.errors(jqXHR, exception);
				}
			});
		},
		sendParams: function(url, params, callback) {
			var self = this;

			$.ajax({
				url: url,
				type: 'POST',
				dataType: 'json',
				data: params,
				success: function(response) {
					callback(response);
				},
				error: function(jqXHR, exception) {
					self.errors(jqXHR, exception);
				}
			});
		},
		validateForm: function(form) {
			var self = this;
			var $form = $(form);

			// remove error classes
			function errorsClean() {
				$form.find('.field.error').removeClass('error');
				$form.find('.choose.error').removeClass('error');
				$form.find('.form-msg.error').remove();
			}

			// add error classes for different form element types
			function errorsShow(response) {
				for (var key in response.errors) {
					var $element = $(form[key]);
					var type = $element.attr('type');
					var $holder;
					
					if (type === 'checkbox' || type === 'radio') {
						$holder = $element.closest('.choose');
					} else {
						$holder = $element.closest('.field');

						if (!$holder.find('.form-msg.error').length) {
							$('<p class="form-msg error">' + response.errors[key] + '</p>').insertAfter($holder);
						}
					}

					if (!$holder.hasClass('error')) {
						$holder.addClass('error');
					}
				}
			}

			// handle ajax response
			function render(response) {
				if(response.success) {
					// show notification
					if ('msg' in response) {
						toastr.success(response.msg);
					}

					if ('reload' in response) {
						window.location = window.location;
					} else if ('redirectTo' in response) {
						window.location = response.redirectTo;
					}

					errorsClean();
				} else {
					// show notification
					if ('msg' in response) {
						toastr.error(response.msg);
					}

					errorsClean();
					
					errorsShow(response);
				}
			}

			// send form for validation
			$.ajax({
				url: $form.attr('action'),
				method: $form.attr('method'),
				data: $form.serialize(),
				dataType: 'json',
				success: function(response) {
					render(response);
				},
				error: function(jqXHR, exception) {
					self.errors(jqXHR, exception);
				}
			});
		},
		errors: function(jqXHR, exception) {
			if (jqXHR.status === 0) {
				console.error('Not connect.\n Verify Network.');
			} else if (jqXHR.status == 404) {
				console.error('Requested page not found. [404]');
			} else if (jqXHR.status == 500) {
				console.error('Internal Server Error [500].');
			} else if (exception === 'parsererror') {
				console.error('Requested JSON parse failed.');
			} else if (exception === 'timeout') {
				console.error('Time out error.');
			} else if (exception === 'abort') {
				console.error('Ajax request aborted.');
			} else {
				console.error('Uncaught Error.\n' + jqXHR.responseText);
			}
		}
	};


	/* ------------------------------------------------------------ *\
		# Components
	\* ------------------------------------------------------------ */


	/* ------------------------------------------------------------ *\
		# Events
	\* ------------------------------------------------------------ */

	$doc.on('keyup', function(e) {
		if (e.keyCode == globalKeys.esc) {
			$doc.trigger('key:esc');
		}
	});

	$doc.ready(function() {
		/**
		 * Inline external svg sprite to all pages
		 *
		 * plugin: svg4everybody
		 * https://github.com/jonathantneal/svg4everybody
		 */
		svg4everybody();

		/**
		 * All notifications configuration
		 *
		 * plugin: toastr
		 * https://github.com/CodeSeven/toastr
		 */
		toastr.options = {
			"closeButton": true,
			"debug": false,
			"newestOnTop": false,
			"progressBar": true,
			"positionClass": "toast-top-full-width",
			"preventDuplicates": false,
			"onclick": null,
			"showDuration": "300",
			"hideDuration": "1000",
			"timeOut": "10000",
			"extendedTimeOut": "1000",
			"showEasing": "swing",
			"hideEasing": "linear",
			"showMethod": "fadeIn",
			"hideMethod": "fadeOut"
		};
	});
})(jQuery, window, document);