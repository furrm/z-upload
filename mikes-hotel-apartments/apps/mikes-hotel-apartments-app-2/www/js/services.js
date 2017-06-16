angular.module('app.services', [])
    .factory('AccommodationInfo', [function () {
        return {
            "name": 'AccommodationInfo'
        }
    }])
    .factory('Tiles', [function () {
        return {
            "name": 'Tiles',
            "data": [
                {
                    id: 1, title: '1by1', size: '2,4', template: 'home', imageUrl: "img/logo.png",
                    caption: "#Welcome to Mikes Hotel and Apartments"
                },
                {
                    id: 3, title: '1by1', size: '2,4', template: 'image', imageUrl: "img/assets/apartments/default.jpg",
                    caption: "#Mikes Apartments",
                    link: {
                        title: "Apartments",
                        id: "link-1234",
                        type: "bottom-sheet",
                        ref:"1234-apartments"
                    }

                },
                {
                    id: 2, title: '1by1', size: '2,2', template: 'image', imageUrl: "img/assets/hotel/default.jpg",
                    caption: "#Mikes Hotel"
                },
                {
                    id: 3, title: '1by1', size: '2,2', template: 'image', imageUrl: "img/assets/apartments-superior/default.jpg",
                    caption: "#Mikes Superior Apartments"
                },
                //{id: 1, title: '1by1', size: '4,4', template: 'card', imageUrl: "img/superior1.jpg",
                //    caption: "#Elevating Women\nA look inside eBay’s effort to encourage gender diversity"},
                {
                    id: 1, title: '1by1', size: '2,2', template: 'image', imageUrl: "img/robot.jpg",
                    caption: "#Manager vs. machine\nTechnology is getting smarter and faster. Are you?"
                },
                {
                    id: 1, title: '1by1', size: '2,2', template: 'card', imageUrl: "img/binary.jpg",
                    caption: "#Getting the CMO and CIO to work as partners\nTo turn new technologies into profits and growth, marketing and IT will need to change how they work—and how they work together."
                }
            ]
        }
    }])
    .factory('BottomSheet', [function () {
        return {
            "name": 'BottomSheet',
            "data": [
                {
                    id: "1234-apartments", type: "list", links: [
                    {
                        title: "Hotel",
                        id: "link-1234-hotel",
                        type: "page",
                        ref:"app.accommodation",
                        imageUrl: "img/assets/hotel/default.jpg"
                    },
                    {
                        title: "Apartments",
                        id: "link-1234-apartments",
                        type: "page",
                        ref:"app.accommodation",
                        imageUrl: "img/assets/apartments/default.jpg"
                    },
                    {
                        title: "Superior Apartments",
                        id: "link-1234-superior-apartments",
                        type: "page",
                        ref:"app.accommodation",
                        imageUrl: "img/assets/apartments-superior/default.jpg"
                    }
                ]
                },
                {
                    id: "1234-something-else", type: "grid", data: [
                    {name: "Sugar"},
                    {name: "And"},
                    {name: "Spice"}
                ]
                }
            ]
        }
    }])
;