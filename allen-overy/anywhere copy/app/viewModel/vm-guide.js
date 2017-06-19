/**
 * guide view model
 */

var app = app || {};

app.Guide = (function () {
    'use strict'



    // Activities model
    var guideModel = (function () {

        console.log('define guide model');


        var model = {
            message: 'This is a message from the view model'
        };



//        return {
//            seed: model
//        };

        return model

    }());

    // Seed view model
    var guideViewModel = (function () {

        var data = {
                "title":"Dawn Raid",
                "checklists":[
                    {
                        "title":"",
                        "questions":{

                        }
                    }
                ]
            };

        console.log('define guideViewModel');

        var init = function () {
            console.log('guide init Hit!');
        };

        var show = function(){
            console.log('guide show Hit!');
        };

        // Navigate to activityView When some activity is selected
        var selectChecklist = function (e) {
            console.log("CHECKLIST SELECTED");
            console.log("CHECKLIST SELECTED e", e);

            app.mobileApp.navigate('views/v-checklist-questions.html');
        };

        var selectChecklist2 =  function (custom) {

            var pane = $("#rightPane").data("kendoMobilePane");

            console.log('PANE', pane);

//            pane.replace("#dawnRaidIntro");


//            console.log("CHECKLIST2 SELECTED");
//            console.log("CHECKLIST2 SELECTED custom", custom);

//            app.mobileApp.navigate('views/v-checklist-questions.html');
        };


        var check = function(e){

            // create a jQuery elem to the sidebar question using the data passed by the event (e)
            // NOTE: Not sure whether toElement is the right property to use here.
            var answerElem = $(e.toElement);

            // create a jQuery elem using the data attribute passed by the event
            var questionElemName = '#' + $(e.toElement).attr("data-related-question");
            var questionElem = $(questionElemName);

            console.log('questionElemName', questionElemName);
            console.log('questionElem', questionElem);

            toggleCheck(answerElem, questionElem);

        };

        function toggleCheck(answer, question)
        {

            var isChecked = answer.attr("data-checked");


            if(isChecked === 'false'){

                // change the classes to reflect a checked operation
                // turn checked indicator on.
                question.children(".questionIndicator").children("i").addClass("questionChecked");
                // swap out font from dot circle to checked circle
                question.children(".questionIndicator").children("i").removeClass("fa-dot-circle-o");
                question.children(".questionIndicator").children("i").addClass("fa-check-circle-o");


                // turn the answer checked indicator on
                answer.addClass("checked");
                answer.removeClass("inactive");

                answer.attr("data-checked", true);

            }
            else{

                // change the classes to reflect a unchecked operation
                // turn checked indicator off.
                question.children(".questionIndicator").children("i").removeClass("questionChecked");
                // swap out font from checked circle to dot circle
                question.children(".questionIndicator").children("i").removeClass("fa-check-circle-o");
                question.children(".questionIndicator").children("i").addClass("fa-dot-circle-o");

                // turn the answer checked indicator off
                answer.addClass("inactive");
                answer.removeClass("checked");


                answer.attr("data-checked", false);

            }
        }

        var navigatePane = function(e){
            var pane = $("#rightPane").data("kendoMobilePane");
        };

        // Navigate to app home
        var navigateHome = function () {

            app.mobileApp.navigate('#welcome');
        };


        return {
            init:init(),
            show:show(),
            data:data,
            testText:'Hello',
            seed: guideModel,
            selectChecklist: selectChecklist,
            selectChecklist2: selectChecklist2,
            check:check
        };

    }());

    return guideViewModel;

}());
