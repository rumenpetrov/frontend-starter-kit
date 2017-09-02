;(function($, window, document, undefined) {
	var $win = $(window);
	var $doc = $(document);
	
	window.Global = window.Global || {};
	window.Cart = window.Cart || {};


	/* ------------------------------------------------------------ *\
		#FUNCTION DEFINITIONS
	\* ------------------------------------------------------------ */

	Cart = (function() {
		if (typeof cartAjaxUrl === 'undefined') {
			// stop execution when url does missing
			return;
		}

		// url comes form html template
		var ajaxUrl = cartAjaxUrl;

		function ajax(params, type, extra_params) {
			$.ajax(ajaxUrl, $.extend({
				type: 'POST',
				dataType: 'json',
				data: $.extend(params, {action: type}),
				success: function(json) {
					if (json.success) {
						// console.log(params);
						// console.log(json);

						var $cartQuickTrigger = $('#js-nav-cart-trigger');
						var	$cartBlock = $('#js-cart-block');

						if (json.products_count > 0) {
							$cartQuickTrigger.removeClass('is-disabled');
							$cartQuickTrigger.find('sup').text(json.products_count);
							
							// update headerca
							if ('cart_quick' in json) {
								var $cartQuickSummary = $('#js-cart-quick-summary');

								$cartQuickSummary.find('table').remove();
								$cartQuickSummary.append(json.cart_quick);
							}

							// update cart
							if ('cart' in json) {
								var $cartTable = $('#js-cart-table');
								var $cartSummary = $('#js-cart-summary');

								$cartTable.find('.price[data-product-id="'+ params.product_id +'"] strong').text(json.cart.row_total);
								$cartSummary.find('.summary').remove();
								$cartSummary.prepend(json.cart.summary);
							}
						}
						
						// empty cart
						if (json.products_count === 0) {
							if ('cart_empty' in json) {
								$cartQuickTrigger.addClass('is-disabled');
								$cartQuickTrigger.find('sup').text(0);

								$cartBlock.find('.pad').remove();
								$cartBlock.append(json.cart_empty);
							}
						}
					}
				}
			}, extra_params || {}));
		}

		return {
			add: function(product_id, quantity, extra_params) {
				ajax({product_id: product_id, quantity: quantity}, 'add', extra_params);
			},
			edit: function(product_id, quantity, extra_params) {
				ajax({product_id: product_id, quantity: quantity}, 'edit', extra_params);
			},
			remove: function(product_id, extra_params) {
				ajax({product_id: product_id}, 'remove', extra_params);
			}
		};
	})();

	/**
	 * Get string and extract only digits from it.
	 *
	 * @public
	 * @param  {string}
	 * @return {string}
	 */
	Global.getDigits = function(str) {
		str = str.replace(/^\D+|\D+$/g, ''); // replace all non-digits with nothing

		return str;
	};

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
	 * Global.basicHide(event, '.accordionItemHead, .accordionItemBody, .accordionItem');
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

	/**
	 * Show/hide content when certan checkbox is checked. 
	 * Can handle multiple triggers and targets.
	 *
	 * Requred:
	 * - class "js-related-trigger" for input triggers
	 * - class "js-related-target" for targeted content
	 * - [data-related-id] attribute to create relation between elements
	 * 
	 * @return {void}
	 */
	var checkRelatedInit = function() {
		var $triggers = $('.js-related-trigger[data-related-id]');

		// stop execution when elements does missing 
		if (!$triggers.length || ($triggers.attr('type') !== 'checkbox' && $triggers.attr('type') !== 'radio')) {
			// console.error('checkRelated: Invalid parameters');
			return;	
		}

		if (!$('.js-related-target[data-related-id]').length) {
			// console.error('checkRelated: Invalid parameters');
			return;
		}

		// show/hide related targets
		function toggleTargets(trigger) {
			var $currentElement = $(trigger);
			var currentElementType = $currentElement.attr('type');
			var currentId = $currentElement.attr('data-related-id');
			var $currentTriggers = $('.js-related-trigger[data-related-id="'+ currentId +'"]');
			var $currentTargets = $('.js-related-target[data-related-id="'+ currentId +'"]');
			var isChecked = $currentElement.prop('checked');

			$currentTriggers.not($currentElement).prop('checked', isChecked);

			if (isChecked) {
				$currentTargets.each(function() {
					$(this).addClass('is-active');
				});
			} else {
				$currentTargets.each(function() {
					$(this).removeClass('is-active');
				});
			}
		}

		$triggers.each(function() {
			toggleTargets($(this));
		});

		$triggers.on('change', function() {
			toggleTargets($(this));
		});
	};

	/**
	 * Scroll the window to element.
	 *
	 * Required:
	 * - 'data-scrollto' - Get only CSS style ID selector.
	 *
	 * Optional:
	 * -'data-scrollto-offset' - Get CSS style selector.
	 * -'data-prevent' - Get true or false. Default value is false.
	 *
	 * @private
	 * @return {void}
	 */
	var scrollToSelectorInit = function() {
		var $triggers = $('[data-scrollto]');
		var offsetTop = 0;
		var prevent = $('[data-prevent]').data('prevent');

		// stop execution when element does not exist
		if (!$triggers.length) {
			// console.error('scrollToSelectorInit: Invalid parameters!');
			return;
		}

		$triggers.on('click', function(evt) {
			if (prevent) {
				evt.preventDefault();
			}

			var $currentElement = $(this);
			var targetSelector = $(this).data('scrollto');
			var $target = $(targetSelector);

			if (parseInt($currentElement.data('scrollto-offset'))) {
				offsetTop = parseInt($currentElement.data('scrollto-offset'));
			}
			
			// stop execution when target does not exists
			if (!$target.length) {
				console.error('scrollToSelectorInit: Scroll target does not exist!');
				console.warn('Function gets CSS style selector');
				return;
			}
			
			// stop execution when multiple targets are present
			if ($target.length > 1) {
				console.error('scrollToSelectorInit: Multiple scroll targets detected!');
				return;
			}

			$('html, body').stop(true, true).animate({
				scrollTop: $target.offset().top-offsetTop
			}, 1000);
		});
	};

	/**
	 * Tabs/Accordion.
	 * 
	 * Required:
	 * - 'data-tabs-trigger' - Set to all triggers. Need unique, random string to link with contents
	 * - 'data-tabs-content' - Set to each tab's content. Need unique, random string to link with triggers
	 *
	 * Optional:
	 * - 'data-tabs-scope' - Set to each trigger and tab's content. Need unique, random string to link with triggers
	 * 
	 * @private
	 * @return {void}
	 * 
	 */
	var tabsInit = function() {
		var $tabsTriggers = $('[data-tabs-trigger]');
		var $tabsContents = $('[data-tabs-content]');

		// stop execution when parameters are not valid
		if (!$tabsTriggers.length || !$tabsContents.length) {
			// console.error('tabsInit: Invalid parameters!');
			return;
		}

		// handle active triggers and tabs
		function show(id, scope) {
			var $current;

			if (scope === "" || scope === undefined || scope === false) {
				console.warn('tabsInit: Require "data-tabs-scope" attribute to handle multiple instances!', scope);

				$tabsTriggers.removeClass('is-active');
				$tabsContents.removeClass('is-active');

				
				for (var i = 0; i < $tabsTriggers.length; i++) {
					$current = $($tabsTriggers[i]);

					if ($current.data('tabs-trigger') === id) {
						$current.addClass('is-active');
						window.location.hash = id;
					}
				}

				for (var ii = 0; ii < $tabsContents.length; ii++) {
					$current = $($tabsContents[ii]);

					if ($current.data('tabs-content') === id) {
						$current.addClass('is-active');
					}
				}
			} else {
				for (var j = 0; j < $tabsTriggers.length; j++) {
					$current = $($tabsTriggers[j]);

					if ($current.data('tabs-scope') === scope) {
						$current.removeClass('is-active');
					}
					if ($current.data('tabs-trigger') === id && $current.data('tabs-scope') === scope) {
						$current.addClass('is-active');
						window.location.hash = id;
					}
				}

				for (var jj = 0; jj < $tabsContents.length; jj++) {
					$current = $($tabsContents[jj]);

					if ($current.data('tabs-scope') === scope) {
						$current.removeClass('is-active');
					}
					if ($current.data('tabs-content') === id && $current.data('tabs-scope') === scope) {
						$current.addClass('is-active');
					}
				}
			}
		}

		function hashWatcher() {
			var hash = window.location.hash.replace('#', '');

			// stop execution when hash is not valid
			if (!hash.length) {
				return;
			}

			var $current;
			var id = '';
			var scope = '';

			$tabsTriggers.each(function() {
				$current = $(this);

				if ($current.data('tabs-trigger') === hash) {
					id = $current.data('tabs-trigger');
					scope = $current.data('tabs-scope');
				}
			});

			if (id.length && scope.length) {
				show(id, scope);				
			}
		}

		// watch url on tabs init
		hashWatcher();

		// switch between tabs
		$tabsTriggers.on('click', function(evt) {
			evt.preventDefault();

			var $this = $(this);
			var	id = $this.data('tabs-trigger');
			var	scope = $this.data('tabs-scope');

			if (!$this.hasClass('is-active')) {
				show(id, scope);
			}
		});

		// watch url
		$win.on('hashchange', function() {
			hashWatcher();
		});
		
		// show active tabs after init
		$tabsTriggers.filter('.is-active').each(function() {
			var $this = $(this);

			show($this.data('tabs-trigger'), $this.data('tabs-scope'));
		});
	};

	/**
	 * Header cart slide effect
	 * 
	 * @return {void}
	 */
	var showCartInit = function() {
		var $wrapper = $('#js-nav-cart');
		var $trigger = $('#js-nav-cart-trigger');
		var $target = $('#js-nav-cart-target');
		var $close = $('#js-nav-cart-close');
		var $body = $('body');
		var $overlay = $('#js-overlay');

		// stop execution when elements does missing 
		if (!$wrapper.length || !$trigger.length || !$target.length || !$close.length) {
			return;
		}

		function addClasses() {
			if (!$body.hasClass('is-active') && !$body.hasClass('has-cart-active')) {
				$body.addClass('is-active');
				$body.addClass('has-cart-active');
			}
			if (!$trigger.hasClass('is-active')) {
				$trigger.addClass('is-active');
			}
			if (!$target.hasClass('is-active')) {
				$target.addClass('is-active');
			}
			if (!$wrapper.hasClass('is-active')) {
				$wrapper.addClass('is-active');
			}
		}

		function removeClasses() {
			if ($body.hasClass('is-active') && $body.hasClass('has-cart-active')) {
				$body.removeClass('is-active');
				$body.removeClass('has-cart-active');
			}
			if ($trigger.hasClass('is-active')) {
				$trigger.removeClass('is-active');
			}
			if ($target.hasClass('is-active')) {
				$target.removeClass('is-active');
			}
			if ($wrapper.hasClass('is-active')) {
				$wrapper.removeClass('is-active');
			}
		}

		$trigger.on('click', function() {
			// stop opening when cart is empty
			if ($trigger.hasClass('is-disabled')) {
				return;
			}

			addClasses();
		});

		$close.on('click', function() {
			removeClasses();
		});

		$overlay.on('click', function() {
			removeClasses();
		});

		$doc.on('keyup', function(evt) {
			if (typeof evt === undefined) {
				return;
			}

			if (evt.keyCode == 27 /* esc key*/) {
				removeClasses();
			}
		});
	};

	/**
	 * Desktop menu's dropdown
	 * 
	 * @return {void}
	 */
	var menuDesktopInit = function() {
		var $wrapper = $('#js-nav-primary');
		var $triggers = $wrapper.find('.level-1 > li');
		var $body = $('body');
		var myInterval;

		function timer() {
			$body.addClass('is-active');
			$body.addClass('has-menu-active');
		}
		
		$triggers.on('mouseenter', function() {
			myInterval = setTimeout(function() {
				timer();
			}, 300);
		}).on('mouseleave', function() {
			clearInterval(myInterval);

			$body.removeClass('is-active');
			$body.removeClass('has-menu-active');
		});
	};

	/* ------------------------------------------------------------ *\
		#EVENT BINDS
	\* ------------------------------------------------------------ */

	$doc.on('click keyup touchstart', function(event) {
		basicHide(event, '#js-search-target, #js-search-trigger');
	});

	$doc.ready(function() {
		makeActiveInit();
		scrollToSelectorInit();
		showCartInit();
		menuDesktopInit();
		tabsInit();
		checkRelatedInit();

		/**
		 * Custom scrolls init
		 *
		 * plugin: perfectScrollbar
		 * https://github.com/noraesae/perfect-scrollbar
		 * 
		 */
		$('.js-custom-scroll').perfectScrollbar();

		/**
		 * Input spinner init
		 *
		 * plugin: Bootstrap TouchSpin
		 * https://github.com/istvan-ujjmeszaros/bootstrap-touchspin
		 * 
		 */
		if ($('.js-qty-product').length) {
			$('.js-qty-product').TouchSpin({
				min: 1,
				max: 100,
				verticalbuttons: true,
				postfix: "бр."
			});
		}

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