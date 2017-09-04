;(function($, window, document, undefined) {
	var $win = $(window);
	var $doc = $(document);
	
	/* ------------------------------------------------------------ *\
		#FUNCTION DEFINITIONS
	\* ------------------------------------------------------------ */

	/**
	 * Connects elements.
	 *
	 * Required:
	 * - 'data-active-target' - Get CSS style selector. Set the attribute to a target element.
	 *
	 * Optional:
	 * - 'data-active-scope' - Get CSS style selector. Use it to work with multiple targets. 
	 * 
	 * @private
	 * @return {void}
	 */
	var makeActiveInit = function() {
		var $triggers = $('[data-active-target]');

		// stop execution when elements does missing 
		if (!$triggers.length) {
			// console.error('makeActiveInit: Invalid parameters');
			return;	
		}

		$triggers.on('click', function() {
			var $currentElement = $(this);
			var $currentScope;
			var $currentTarget;
			
			if (!$currentElement.data('active-scope')) {
				$currentTarget = $($currentElement.data('active-target'));
				
				// handle missing target
				if (!$currentTarget.length) {
					console.error('makeActiveInit: Missing target element!');
					return;
				}

				// handle multiple targets
				if ($currentTarget.length > 1) {
					console.error('makeActiveInit: Detect multiple target elements. Require "data-active-scope"!');
					return;
				}
			} else {
				$currentScope = $currentElement.closest($currentElement.data('active-scope'));
				$currentTarget = $currentScope.find($currentElement.data('active-target'));

				// handle missing scope
				if (!$currentScope.length) {
					console.error('makeActiveInit: Missing scope element! Remove "data-active-scope" attribute or add scope element!');
					return;
				}
			}
			
			// switch classes
			if ($currentElement.hasClass('is-active')) {
				$currentElement.removeClass('is-active');	
				$currentTarget.removeClass('is-active');

				if ($currentElement.data('active-scope')) {
					if ($currentScope.length) {
						$currentScope.removeClass('is-active');
					}
				}
			} else {
				$currentElement.addClass('is-active');	
				$currentTarget.addClass('is-active');

				if ($currentElement.data('active-scope')) {
					if ($currentScope.length) {
						$currentScope.addClass('is-active');
					}
				}
			}
		});
	};

	/**
	 * Universal hide function. Check if event's target matches given selectors or esc key is pressed.
	 *
	 * Example:
	 * basicHide(event, '.accordionItemHead, .accordionItemBody, .accordionItem');
	 * 
	 * @private
	 * @param  {event}
	 * @param  {string|Object}
	 * @return {void}
	 */
	var basicHide = function(evt, selector) {
		// stop execution when parameters are not valid
		if (typeof evt === undefined || !$(selector).length) {
			// console.error('basicHide: Invalid parameters!');
			return;
		}

		var $target = $(evt.target);

		if ((!$target.closest(selector).length) || (evt.keyCode == 27 /* esc key*/)) {
			$(selector).removeClass('is-active');
		}
	};

	/* ------------------------------------------------------------ *\
		#EVENT BINDS
	\* ------------------------------------------------------------ */

	$doc.on('click keyup touchstart', function(event) {
		
	});

	$doc.ready(function() {
		makeActiveInit();

		/**
		 * Inline external svg sprite to all pages
		 *
		 * plugin: svg4everybody
		 * https://github.com/jonathantneal/svg4everybody
		 * 
		 */
		svg4everybody();

		/**
		 * All notifications configuration
		 *
		 * plugin: toastr
		 * https://github.com/CodeSeven/toastr
		 * 
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

	$win.on('resize', function() {
		
	});
})(jQuery, window, document);