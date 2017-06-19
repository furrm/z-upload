angular.module('starter.controllers', [])

    .controller('CssMatrixCtrl', function ($scope, $timeout) {

        var data = dataAccess.getData();

        $scope.matrixString = "matrix(0.9,0,0,0.9,-63,-1);";

        $scope.pageData = "#Repetition of warranties";

        $scope.regionId = "0";

        $scope.question = "CSS Matrix";

        $scope.mac1RegionSelected = function(item){

            console.log("SELECTED", item); // todo: delete me

            $scope.activeItem = item;

            $scope.regionId = item.uid;

            $scope.filter = item.uid;

            $scope.matrixString = utilities.buildMatrixString(item.MaterialAdverseChange.transform);
        };





//        $scope.questions = macQuestions;
        $scope.menuItems = data;
        $scope.answers = data;



    })
    .controller('materialAdverseChangePart1Ctrl', function ($scope, $timeout) {

        var data = dataAccess.getData();

        $scope.pageData = "#Material adverse change";

        $scope.regionId = "0";

        $scope.question = "In what proportion of deals was there a material adverse change provision in";

        $scope.mac1RegionSelected = function(item){

            console.log("SELECTED", item); // todo: delete me

            $scope.activeItem = item;

            $scope.regionId = item.uid;

            $scope.filter = item.uid;

            $scope.matrixString = utilities.buildMatrixString(item.MaterialAdverseChange.transform);
        };

        $scope.reset = function(){
            var resetMatrix = { 'a': 10, b: 0, c: 0, d: 10, e: 0, f: 0 };
            $scope.matrixString = utilities.buildMatrixString(resetMatrix);
        };



//        $scope.questions = macQuestions;
        $scope.menuItems = data;
        $scope.answers = data;



    })
    .controller('materialAdverseChangePart2Ctrl', function ($scope, $timeout) {

        var data = dataAccess.getData();

        $scope.pageData = "#Material adverse change";

        $scope.regionId = "0";

        $scope.question = "In what proportion of deals were MAC provisions generic, tied to financial effect or tied to events in";

        $scope.mac1RegionSelected = function(item){

            console.log("SELECTED", item); // todo: delete me

            $scope.activeItem = item;

            $scope.regionId = item.uid;

            $scope.filter = item.uid;

            $scope.matrixString = utilities.buildMatrixString(item.MaterialAdverseChange.transform);
        };

        $scope.reset = function(){
            var resetMatrix = { 'a': 10, b: 0, c: 0, d: 10, e: 0, f: 0 };
            $scope.matrixString = utilities.buildMatrixString(resetMatrix);
        };

        $scope.menuItems = data;
        $scope.answers = data;

    })
    .controller('repetitionOfWarrantiesPart1Ctrl', function ($scope, $timeout) {

        var data = dataAccess.getData();

        var maxtrixStart = {"a":"8","b":0,"c":0,"d":"8","e":"-103","f":0};

//        $scope.matrixString = "matrix(0.8,0,0,0.8,-105,16);";
        $scope.matrixString = utilities.buildMatrixString(maxtrixStart);

        $scope.pageData = "#Repetition of Warranties";

        $scope.regionId = "0";

        $scope.question = "In what proportion of deals were warranties repeated at closing in";

        $scope.mac1RegionSelected = function(item){

            console.log("SELECTED", item); // todo: delete me

            $scope.activeItem = item;

            $scope.regionId = item.uid;

            $scope.filter = item.uid;

            $scope.matrixString = utilities.buildMatrixString(item.RepetitionOfWarranties.transform);
        };

        $scope.reset = function(){
            var resetMatrix = maxtrixStart;
            $scope.matrixString = utilities.buildMatrixString(resetMatrix);
        };



//        $scope.questions = macQuestions;
        $scope.menuItems = data;
        $scope.answers = data;



    })
    .controller('repetitionOfWarrantiesPart2Ctrl', function ($scope, $timeout) {

        var data = dataAccess.getData();

        var maxtrixStart = {"a":"8","b":0,"c":0,"d":"8","e":"-103","f":0};

//        $scope.matrixString = "matrix(0.8,0,0,0.8,-105,16);";
        $scope.matrixString = utilities.buildMatrixString(maxtrixStart);

        $scope.pageData = "#Repetition of Warranties";

        $scope.regionId = "0";

        $scope.question = "In what proportion of deals were warranties repeated at closing in";

        $scope.mac1RegionSelected = function(item){

            console.log("SELECTED", item); // todo: delete me

            $scope.activeItem = item;

            $scope.regionId = item.uid;

            $scope.filter = item.uid;

            $scope.matrixString = utilities.buildMatrixString(item.RepetitionOfWarranties.transform);
        };

        $scope.reset = function(){
            var resetMatrix = maxtrixStart;
            $scope.matrixString = utilities.buildMatrixString(resetMatrix);
        };


//        $scope.questions = macQuestions;
        $scope.menuItems = data;
        $scope.answers = data;



    })
    .controller('priceAdjustmentPart1Ctrl', function ($scope, $timeout) {

        var data = dataAccess.getData();

        var maxtrixStart = {"a":10,"b":0,"c":0,"d":10,"e":"-94","f":"28"};

//        $scope.matrixString = "matrix(0.8,0,0,0.8,-105,16);";
        $scope.matrixString = utilities.buildMatrixString(maxtrixStart);

        $scope.pageData = "#Price Adjustment";

        $scope.regionId = "0";

        $scope.question = "In what proportion of deals were warranties repeated at closing in";

        $scope.mac1RegionSelected = function(item){

            console.log("SELECTED", item); // todo: delete me

            $scope.activeItem = item;

            $scope.regionId = item.uid;

            $scope.filter = item.uid;

            $scope.matrixString = utilities.buildMatrixString(item.PriceAdjustment.transform);

        };

        $scope.reset = function(){
            var resetMatrix = maxtrixStart
            $scope.matrixString = utilities.buildMatrixString(resetMatrix);
        };


//        $scope.questions = macQuestions;
        $scope.menuItems = data;
        $scope.answers = data;



    })
    .controller('materialAdverseChangePart2OLDCtrl', function ($scope, $timeout) {


        $scope.pageData = "#Material adverse change";

        $scope.regionId = "0";

        $scope.$on('materialAdverseChangePart2-region-selected', function (event, item) {

            console.log(event, item); // todo: delete me

            $scope.activeItem = item;

            $scope.regionId = item.uid;

            $scope.filter = item.uid;
//            $scope.filter = "Australia";

            $scope.transform = "Not implemented";
//            $scope.transform = item.MaterialAdverseChange.transform;


        });

        var data = [
            {name: "Asia", uid: "mac-01", image:"asia.png",
                MaterialAdverseChange: {
                    transform: {"a": "33", "b": 0, "c": 0, "d": "33", "e": "-778", "f": "-130"}
                },
                metrics: {
                    macProvisionDeals: {
                        dealsPercent2013: "50%", dealsPercent2012: "40%", dealUpOrDown: "up"
                    },
                    macProvisionGeneric: {
                        deals: "40%", financialEffect: "none", specificEvents: "10%"
                    }
                }
            },
            {name: "Australia", uid: "mac-02", image:"australia.png",
                MaterialAdverseChange: {
                    transform: {"a": "33", "b": 0, "c": 0, "d": "33", "e": "-934", "f": "-499"}
                },
                metrics: {
                    macProvisionDeals: {
                        dealsPercent2013: "60%", dealsPercent2012: "46%", dealUpOrDown: "up"
                    },
                    macProvisionGeneric: {
                        deals: "40%", financialEffect: "none", specificEvents: "10%"
                    }
                }
            },
            {name: "CEE", uid: "mac-03", image:"cee.png",
                MaterialAdverseChange: {
                    transform: {"a": "37", "b": 0, "c": 0, "d": "37", "e": "-259", "f": "249"}
                },
                metrics: {
                    macProvisionDeals: {
                        dealsPercent2013: "50%", dealsPercent2012: "67%", dealUpOrDown: "down"
                    },
                    macProvisionGeneric: {
                        deals: "40%", financialEffect: "none", specificEvents: "10%"
                    }
                }
            },
            {name: "Western Europe", uid: "mac-04", image:"western-europe.png",
                MaterialAdverseChange: {
                    transform: {"a": "36", "b": 0, "c": 0, "d": "36", "e": "10", "f": "100"}
                },
                metrics: {
                    macProvisionDeals: {
                        dealsPercent2013: "56%", dealsPercent2012: "41%", dealUpOrDown: "up"
                    },
                    macProvisionGeneric: {
                        deals: "40%", financialEffect: "none", specificEvents: "10%"
                    }
                }
            },
            {name: "MENASA", uid: "mac-05", image:"menasa.png",
                MaterialAdverseChange: {
                    transform: {"a": "36", "b": 0, "c": 0, "d": "36", "e": "-373", "f": "-70"}
                },
                metrics: {
                    macProvisionDeals: {
                        dealsPercent2013: "60%", dealsPercent2012: "73%", dealUpOrDown: "down"
                    },
                    macProvisionGeneric: {
                        deals: "40%", financialEffect: "none", specificEvents: "10%"
                    }
                }
            },
            {name: "UK", uid: "mac-06", image:"uk.png",
                MaterialAdverseChange: {
                    transform: {"a": "42", "b": 0, "c": 0, "d": "42", "e": "124", "f": "409"}
                },
                metrics: {
                    macProvisionDeals: {
                        dealsPercent2013: "88%", dealsPercent2012: "75%", dealUpOrDown: "up"
                    },
                    macProvisionGeneric: {
                        deals: "40%", financialEffect: "none", specificEvents: "10%"
                    }
                }
            },
            {name: "Americas", uid: "mac-07", image:"americas.png",
                MaterialAdverseChange: {
                    transform: {"a": "33", "b": 0, "c": 0, "d": "33", "e": "653", "f": "130"}
                },
                metrics: {
                    macProvisionDeals: {
                        dealsPercent2013: "50%", dealsPercent2012: "40%", dealUpOrDown: "up"
                    },
                    macProvisionGeneric: {
                        deals: "40%", financialEffect: "none", specificEvents: "10%"
                    }
                }
            }

        ]

        var macQuestions = [
            {id: "0", question: "Please select a question from the drop-down list..."},
            {id: "2", question: "In what proportion of deals was there a material adverse change provision in:"},
            {id: "3", question: "In what proportion of deals were MAC provisions generic, tied to financial effect or tied to events in:"},
        ];

        $scope.questions = macQuestions;
        $scope.menuItems = data;
        $scope.answers = data;

        var tiles = [
            {id: 1, title: '1by1', size: '5,9', template: 'zoom-image', imageUrl: "", caption: ""},
            {id: 1, title: '1by1', size: '5,3', template: 'region selector', imageUrl: "", caption: ""}

        ];

        $scope.items = tiles;

    })
    .controller('FriendsCtrl', function ($scope, Friends) {
        $scope.friends = Friends.all();
    })
    .controller('FriendDetailCtrl', function ($scope, $stateParams, Friends) {
        $scope.friend = Friends.get($stateParams.friendId);
    })
    .controller('AccountCtrl', function ($scope) {
    })
    .controller('SlideTwoCtrl', ['$scope', function ($scope) {

        $scope.name = 'SlideTwoCtrl';

        var pageData = {
            body: "#Introduction and Market Trends\n" +
                "##Introduction\n" +
                "- To produce this report, we analysed the terms of 130 private M&A deals that Allen & Overy advised on in 2013 with targets in the Americas, the UK, Western Europe, Central & Eastern Europe, MENASA, Asia and Australia.\n" +
                "- It identifies global trends and regional differences in market practice, and contrasts deal terms in 2013 with those in 2012.\n" +
                "- The Appendices to this report show the regions of principal operation of the targets and buyers in our sample, and the sectors in which the targets operate.\n\n" +
                "##Market trends\n" +
                "- Auction environment remains challenging\n" +
                "- Still some evidence of valuation gaps and occasional funding issues\n" +
                "- Buyer friendly market continues but different regions focusing on different deal terms\n" +
                "- More private equity sellers agreeing completion accounts and warranties\n" +
                "- Sellers negotiating stronger financial limits\n" +
                "- Significant divergence between UK and U.S. practice"
                };

        $scope.pageData = pageData.body;


    }])
    .controller('AppCtrl', function ($scope) {
        $scope.name = "AppCtrl";
    })
;



