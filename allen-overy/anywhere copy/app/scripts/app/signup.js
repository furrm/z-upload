/**
 * Signup view model
 */
var app = app || {};

app.Signup = (function () {
    'use strict';
    
    var singupViewModel = (function () {
        
        var dataSource;
        var $signUpForm;
        var $formFields;
        var $signupBtnWrp;
        var validator;

        var isAnalytics = analytics.isAnalytics();

        var errorMessage = kendo.observable({
            name: null
        });

        var getMessage = function () {
            return errorMessage.get("name");
        };


        // Register user after required fields (username and password) are validated in Everlive
        var signup = function () {

            errorMessage.set("name", "");

            Everlive.$.Users.register(
                dataSource.Username,
                dataSource.Password,
                dataSource)
            .then(function () {

                if (isAnalytics) {
                    analytics.Start();
                    analytics.TrackFeature('Register.Success');
                    analytics.Stop();
                }

                app.mobileApp.navigate('#view-all-tiles');

                console.log('Registration successful')

            },
            function (err) {

                // app.showError(err.message);
                errorMessage.set("name", err.message);

                dataSource.Message = err.message;

                if (isAnalytics) {
                    analytics.Start();
                    analytics.TrackExceptionMessage(err, err.message);
                    analytics.Stop();
                }

                console.log(err.message);

            });
        };
        
        // Executed after Signup view initialization
        // init form validator
        var init = function () {

            if (!isAnalytics) {
                console.log('EQATEC product key is not set. You cannot use EQATEC Analytics service.');
            } else
            {
                console.log(analytics.isAnalytics());
            }

            
            $signUpForm = $('#signup-form');
            $formFields = $signUpForm.find('input, textarea, select');
            $signupBtnWrp = $('#signupBtnWrp');
            validator = $signUpForm.kendoValidator({ validateOnBlur: false }).data('kendoValidator');
            
            $formFields.on('keyup keypress blur change input', function () {
                if (validator.validate()) {
                    $signupBtnWrp.removeClass('disabled');
                } else {
                    $signupBtnWrp.addClass('disabled');
                }
            });
        }
        
        // Executed after show of the Signup view
        var show = function () {
            
            dataSource = kendo.observable({
                Username: '',
                Password: '',
                DisplayName: '',
                Email: ''

            });
            kendo.bind($('#signup-form'), dataSource, kendo.mobile.ui);
            errorMessage.set("name", '');
        };
        
        // Executed after hide of the Signup view
        // disable signup button
        var hide = function () {
            $signupBtnWrp.addClass('disabled');
        };
        
        var onSelectChange = function (sel) {
            var selected = sel.options[sel.selectedIndex].value;
            sel.style.color = (selected == 0) ? '#b6c5c6' : '#34495e';
        }
        
        return {
            init: init,
            show: show,
            hide: hide,
            getMessage: getMessage,
            errorMessage: errorMessage,
            onSelectChange: onSelectChange,
            signup: signup
        };
        
    }());
    
    return singupViewModel;
    
}());
