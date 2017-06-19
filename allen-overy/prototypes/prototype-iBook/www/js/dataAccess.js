"use strict";

var dataAccess = (function () {

    return {
        getData: function () {

            var data = [
                {name: "Asia", uid: "mac-01", image: "asia.png",
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
                    },
                    RepetitionOfWarranties:{
                        transform: {"a":"11","b":0,"c":0,"d":"11","e":"3","f":"-5"},
                        text1:"In 70% of deals in Asia (56% in 2012) all warranties were repeated at closing;" +
                            " in 20% of deals, some business warranties only were repeated;" +
                            " in 5% of deals, title and capacity warranties only were repeated;" +
                            " and in 5% of deals, no warranties were repeated.",
                        text2:"In 50% of deals, there was a pre-closing termination right for material breach of warranty."
                    },
                    PriceAdjustment:{
                        transform: {"a":"25","b":0,"c":0,"d":"26","e":"-668","f":"-130"},
                        text1:"Price Adjustment text1 text goes here...",
                        text2:"Price Adjustment text2 text goes here..."
                    }
                },
                {name: "Australia", uid: "mac-02", image: "australia.png",
                    MaterialAdverseChange: {
                        transform: {"a": "33", "b": 0, "c": 0, "d": "33", "e": "-934", "f": "-499"}
                    },
                    metrics: {
                        macProvisionDeals: {
                            dealsPercent2013: "60%", dealsPercent2012: "46%", dealUpOrDown: "up"
                        },
                        macProvisionGeneric: {
                            deals: "40%", financialEffect: "20%", specificEvents: "none"
                        }
                    },
                    RepetitionOfWarranties:{
                        transform: {"a":"11","b":0,"c":0,"d":"11","e":"-133","f":"-5"},
                        text1:"In all the deals in Australia (75% in 2012), all warranties were repeated at closing.",
                        text2:"In 40% of deals, there was a pre-closing termination right for material breach of warranty."
                    },
                    PriceAdjustment:{
                        transform: {"a":"25","b":0,"c":0,"d":"26","e":"-814","f":"-363"},
                        text1:"Price Adjustment text1 text goes here...",
                        text2:"Price Adjustment text2 text goes here..."
                    }
                },
                {name: "CEE", uid: "mac-03", image: "cee.png",
                    MaterialAdverseChange: {
                        transform: {"a": "37", "b": 0, "c": 0, "d": "37", "e": "-259", "f": "249"}
                    },
                    metrics: {
                        macProvisionDeals: {
                            dealsPercent2013: "50%", dealsPercent2012: "67%", dealUpOrDown: "down"
                        },
                        macProvisionGeneric: {
                            deals: "13%", financialEffect: "25%", specificEvents: "12%"
                        }
                    },
                    RepetitionOfWarranties:{
                        transform: {"a":"11","b":0,"c":0,"d":"11","e":"290","f":"-5"},
                        text1:"In 81% of deals in Central and Eastern Europe (78% in 2012), all warranties were repeated at closing;" +
                            " in 6% of deals, title and capacity warranties only were repeated;" +
                            " and in 13% of deals, no warranties were repeated.",
                        text2:"In 56% of deals, there was a pre-closing termination right for material breach of warranty."
                    },
                    PriceAdjustment:{
                        transform: {"a":"34","b":0,"c":0,"d":"34","e":"-475","f":"243"},
                        text1:"Price Adjustment text1 text goes here...",
                        text2:"Price Adjustment text2 text goes here..."
                    }
                },
                {name: "Western Europe", uid: "mac-04", image: "western-europe.png",
                    MaterialAdverseChange: {
                        transform: {"a": "36", "b": 0, "c": 0, "d": "36", "e": "10", "f": "100"}
                    },
                    metrics: {
                        macProvisionDeals: {
                            dealsPercent2013: "56%", dealsPercent2012: "41%", dealUpOrDown: "up"
                        },
                        macProvisionGeneric: {
                            deals: "36%", financialEffect: "15%", specificEvents: "5%"
                        }
                    },
                    RepetitionOfWarranties:{
                        transform: {"a":"11","b":0,"c":0,"d":"11","e":"424","f":"-5"},
                        text1:"In 58% of deals in Western Europe (25% in 2012), all warranties were repeated at closing;" +
                            " in 35% of deals, some business warranties only were repeated;" +
                            " and in 7% of deals, no warranties were repeated.",
                        text2:"In 43% of deals, there was a pre-closing termination right for material breach of warranty."
                    },
                    PriceAdjustment:{
                        transform: {"a":"34","b":0,"c":0,"d":"34","e":"-247","f":"167"},
                        text1:"Price Adjustment text1 text goes here...",
                        text2:"Price Adjustment text2 text goes here..."
                    }
                },
                {name: "MENASA", uid: "mac-05", image: "menasa.png",
                    MaterialAdverseChange: {
                        transform: {"a": "36", "b": 0, "c": 0, "d": "36", "e": "-373", "f": "-70"}
                    },
                    metrics: {
                        macProvisionDeals: {
                            dealsPercent2013: "60%", dealsPercent2012: "73%", dealUpOrDown: "down"
                        },
                        macProvisionGeneric: {
                            deals: "30%", financialEffect: "none", specificEvents: "30%"
                        }
                    },
                    RepetitionOfWarranties:{
                        transform: {"a":"11","b":0,"c":0,"d":"11","e":"154","f":"-5"},
                        text1:"In 80% of deals in MENASA (60% in 2012), all warranties were repeated at closing;" +
                            " in 10% of deals, title and capacity warranties only were repeated;" +
                            " and in 10% of deals, no warranties were repeated.",
                        text2:"In 40% of deals, there was a pre-closing termination right for material breach of warranty."
                    },
                    PriceAdjustment:{
                        transform: {"a":"43","b":0,"c":0,"d":"43","e":"-657","f":"-47"},
                        text1:"Price Adjustment text1 text goes here...",
                        text2:"Price Adjustment text2 text goes here..."
                    }
                },
                {name: "UK", uid: "mac-06", image: "uk.png",
                    MaterialAdverseChange: {
                        transform: {"a": "42", "b": 0, "c": 0, "d": "42", "e": "124", "f": "409"}
                    },
                    metrics: {
                        macProvisionDeals: {
                            dealsPercent2013: "88%", dealsPercent2012: "75%", dealUpOrDown: "up"
                        },
                        macProvisionGeneric: {
                            deals: "19%", financialEffect: "6%", specificEvents: "none"
                        }
                    },
                    RepetitionOfWarranties:{
                        transform: {"a":"11","b":0,"c":0,"d":"11","e":"-434","f":"-5"},
                        text1:"In 13% of deals in the UK (31% in 2012), all warranties were repeated at closing;" +
                            " in 7% of deals, some business warranties only were repeated;" +
                            " in 67% of deals, title and capacity warranties only were repeated;" +
                            " and in 13% of deals, no warranties were repeated.",
                        text2:"In 13% of deals, there was a pre-closing termination right for material breach of warranty."
                    },
                    PriceAdjustment:{
                        transform: {"a":"34","b":0,"c":0,"d":"34","e":"-44","f":"368"},
                        text1:"Price Adjustment text1 text goes here...",
                        text2:"Price Adjustment text2 text goes here..."
                    }
                },
                {name: "Americas", uid: "mac-07", image: "americas.png",
                    MaterialAdverseChange: {
                        transform: {"a": "33", "b": 0, "c": 0, "d": "33", "e": "653", "f": "130"}
                    },
                    metrics: {
                        macProvisionDeals: {
                            dealsPercent2013: "50%", dealsPercent2012: "40%", dealUpOrDown: "up"
                        },
                        macProvisionGeneric: {
                            deals: "75%", financialEffect: "none", specificEvents: "13%"
                        }
                    },
                    RepetitionOfWarranties:{
                        transform: {"a":"11","b":0,"c":0,"d":"11","e":"-305","f":"-5"},
                        text1:"In 75% of deals in the Americas (100% in 2012), all warranties were repeated at closing;" +
                            " in 13% of deals, some business warranties only were repeated; " +
                            " and in 12% of deals, title and capacity warranties only were repeated.",
                        text2:"In 75% of deals, there was a pre-closing termination right for material breach of warranty."
                    },
                    PriceAdjustment:{
                        transform: {"a":"34","b":0,"c":0,"d":"34","e":"343","f":"224"},
                        text1:"Price Adjustment text1 text goes here...",
                        text2:"Price Adjustment text2 text goes here..."
                    }
                }

            ]

            return data;

        }
    };

})();