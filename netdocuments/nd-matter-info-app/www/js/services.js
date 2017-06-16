angular.module('services', [])
    .factory('Members', [function () {
        return{
            "name": "Members",
            data: [
                {id: "1", firstName: "Sara", lastName: "Daniels", role:"Associate", photo: "danielss.jpg", o365email: "ctouser2@allenovery.onmicrosoft.com", tel: "1442002"},
                {id: "2", firstName: "Caroline", lastName: "Howard", role:"Matter Manager", photo: "howardc.jpg", o365email: "ctouser4@allenovery.onmicrosoft.com", tel: "1442003"},
                {id: "3", firstName: "Bushra", lastName: "Vashida", role:"Associate", photo: "vashidab.jpg", o365email: "ctouser4@allenovery.onmicrosoft.com", tel: "1442004"},
                {id: "4", firstName: "Toby", lastName: "Roberts", role:"Associate", photo: "robertst.jpg", o365email: "ctouser1@allenovery.onmicrosoft.com", tel: "1442001"},
                {id: "5", firstName: "Ian", lastName: "Verrico", role:"Partner", photo: "verricoi.jpg", o365email: "ian.verrico@allenovery.onmicrosoft.com", tel: "1444254"},
                {id: "5", firstName: "Dave", lastName: "Gifford", role:"Partner", photo: "giffordd.jpg", o365email: "dave.gifford@allenovery.onmicrosoft.com", tel: "1444219"}
            ],
            selectedMember:{}

        }
    }])
    .factory('MatterFinance', [function () {
        return {
            "name": 'MatterFinance',
            "data": [
                {
                    "clientId": "0056789",
                    "matterId": "0000001",
                    "clientName": "ABY Capital Bank",
                    "matterName": "2014 NCW Program",
                    "matterManager": "Carolyn",
                    "leadAssociate": "Toby Roberts",
                    "billedToDate": "£3,500,000",
                    "lastBilled": "15/4/2015",
                    "wip": "GBP 53,123",
                    "billedPlusWIP": "GBP 53,123",
                    "feeLimit": "GBP 40,000",
                    "feeDeadline": "31 Mar 2015",
                    osTimeSheets:0,
                    "projectVar_inception": 75,
                    "projectVar_startDate": "01/01/2015",
                    "projectVar3": ""
                },
                {
                    "clientId": "0012345",
                    "matterId": "0000001",
                    "clientName": "AdventureWorks Ltd",
                    "matterName": "Facilities Agreement",
                    "matterManager": "Carolyn",
                    "leadAssociate": "Sara Daniels",
                    "billedToDate": "0",
                    "lastBilled": "",
                    "wip": "£65,000",
                    "billedPlusWIP": "£65,000",
                    "feeLimit": "not set",
                    "feeDeadline": "not set",
                    osTimeSheets:5,
                    "projectVar_inception": 5,
                    "projectVar_startDate": "01/04/2015",
                    "projectVar3": ""
                }
            ],
            selectedMatter:{clientId:"", matterId:""}

        }
    }])
;