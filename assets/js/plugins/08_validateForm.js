
(function() {
    var FormValidator = {
        validations: {},
        addValidation: function(targetClass, callback) {
            this.validations[targetClass] = callback;
        },
        addAllThese: function(validations) {
            for (var i = 0; i < validations.length; i++) {
                this.addValidation(validations[i][0], validations[i][1]);
            }
        },
        validate: function(el) {
            var $el = $(el);
            var elementClasses = $el.prop('class').split(' ');
            for (var i = 0; i < elementClasses.length; i++) {
                if (elementClasses[i].length && typeof this.validations[elementClasses[i]] != 'undefined') {
                    if (!this.validations[elementClasses[i]]($el.val())) {
                        $el.data('failed_validation', elementClasses[i]);
                        return false;
                    }
                }
            }
            $el.data('failed_validation', '');
            return true;
        }
    };

    FormValidator.addAllThese([
        ['validation-digits', function(val) {
            return /^\d*$/.test(val);
        }],
        ['required-entry', function(val) {
            return val != '';
        }],
        ['g-recaptcha-response', function(val) {
            return val != '';
        }],
        ['validation-email', function(val) {
           var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
           return re.test(val);
       }],
       ['validation-phone', function(val) {
           if (val != '') {
               return /^(\+|0)[ 0-9]+$/.test(val);
           } else {
               return true;
           }
       }],
      ['validation-number', function(val) {
           if (val != '') {
               return /^[0-9]+$/.test(val);
           } else {
               return true;
           }
       }]
    ]);

    $.fn.formValidator = function(options) {
        var defaultOptions = {
            validCallback: null, //function(el, isValid) {}
            valideteOnEvents: ['submit']
        }
        var $form = $(this);
        var formValidator = {
            $form: $form,
            validationOptions: $.extend(defaultOptions, options),
            isFormValid: false,
            validateElement: function() {
                var $el = $(this);
                var fv = $el.data('stenik_form_validator');
                if (typeof fv == 'undefined') {
                    return;
                }

                var isElValid = FormValidator.validate(this);
                if (isElValid) {
                    $(this).addClass('validation-passed');
                    $(this).removeClass('validation-failed');
                } else {
                    $(this).removeClass('validation-passed');
                    $(this).addClass('validation-failed');
                    fv.isFormValid = false;
                }

                if (fv.validationOptions.validCallback) {
                    fv.validationOptions.validCallback(this, isElValid);
                }
            },
            validateForm: function(e) {
                this.isFormValid = true;

                var fv = this;
                $(this.$form.prop('elements')).each(function() {
                    if (!$(this).data('stenik_form_validator')) {
                        $(this).data('stenik_form_validator', fv);
                    }
                });

                $(this.$form.prop('elements')).each(this.validateElement);

                if (!this.isFormValid) {
                    if (e) e.preventDefault();
                    return false;
                } else {
                    return true;
                }
            }
        }

        $($form.prop('elements')).each(function() {
            $(this).data('stenik_form_validator', formValidator);
        });

        $form.data('stenik_form_validator', formValidator);
        $form.submit(formValidator.validateForm.bind(formValidator));

        return formValidator;
    }
})();
