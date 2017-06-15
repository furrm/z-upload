"use strict";

angular.module('services-data', [])
    .factory('subscribedMatters', function ($http) {
        return{
            'data': [
                {
                    "matterId": "0017242123-0000010123",
                    "clientId": "0017242123",
                    "clientName": "Client1",
                    "matterNumber": "0000010123",
                    "matterName": "Project Alpha",
                    "matterNickName": "Nickname - Project Alpha",
                    "status": "Open"
                },
                {
                    "matterId": "0011767123-0000677123",
                    "clientId": "0011767123",
                    "clientName": "WClient2",
                    "matterNumber": "0000677123",
                    "matterName": "Project Beta",
                    "matterNickName": "Nickname - Project Beta",
                    "status": "OpenInactive"
                },
                {
                    "matterId": "0010023123-0026050123",
                    "clientId": "0010023123",
                    "clientName": "Client3",
                    "matterNumber": "Project Charlie",
                    "matterName": "Project Charlie",
                    "matterNickName": "Nickname - Project Charlie",
                    "status": "Open"
                },
                {
                    "matterId": "0044607123-0000015123",
                    "clientId": "0044607123",
                    "clientName": "Client4",
                    "matterNumber": "0000015123",
                    "matterName": "Project Delta",
                    "matterNickName": "Nickname - Project Delta",
                    "status": "Open"
                },
                {
                    "matterId": "1111111111-2222222222",
                    "clientId": "1111111111",
                    "clientName": "OK Something Bank, N.A",
                    "matterNumber": "2222222222",
                    "matterName": "Project Echo",
                    "matterNickName": "Nickname - Project Echo",
                    "status": "Open"
                },
                {
                    "matterId": "1111111111-2222222222",
                    "clientId": "1111111111",
                    "clientName": "OK Something Bank, N.A",
                    "matterNumber": "2222222222",
                    "matterName": "Project Foxtrot",
                    "matterNickName": "Nickname - Project Foxtrot",
                    "status": "Open"
                },
                {
                    "matterId": "1111111111-2222222222",
                    "clientId": "1111111111",
                    "clientName": "OK Something Bank, N.A",
                    "matterNumber": "2222222222",
                    "matterName": "Project Golf",
                    "matterNickName": "Nickname - Project Golf",
                    "status": "Open"
                },
                {
                    "matterId": "1111111111-2222222222",
                    "clientId": "1111111111",
                    "clientName": "OK Something Bank, N.A",
                    "matterNumber": "2222222222",
                    "matterName": "Project Hotel",
                    "matterNickName": "Nickname - Project Hotel",
                    "status": "Open"
                },
                {
                    "matterId": "1111111111-2222222222",
                    "clientId": "1111111111",
                    "clientName": "OK Something Bank, N.A",
                    "matterNumber": "2222222222",
                    "matterName": "Project India",
                    "matterNickName": "Nickname - Project India",
                    "status": "Open"
                }
            ]
        }


    })
    .factory('matterInfo', function () {
        return{
            "matterInfo": {
                "matterBilling": {
                    "budgetType": "Estimate",
                    "budgetValue": "10,000.00",
                    "percentOfFeeBudgetBilled": "946.2%",
                    "percentOfFeeBudgetReached": "812.1%",
                    "billFees": "315,640.22",
                    "currency": ""
                },
                "matterStanding": {
                    "matterId": "1847364378-1726352738",
                    "matterCurrency": "GBP",
                    "matterName": "Servicing Agreement with Bedrock",
                    "clientName": "Something or another Bank, N.A",
                    "clientContact": "David A Fellowes-Freeman",
                    "matterPartner": "Benny Hill",
                    "matterManager": "Tom Jones",
                    "matterDepartment": "Department Zed",
                    "matterOffice": "Planet Mars",
                    "matterWorkType": "Outsourcing",
                    "matterType": "Own Account",
                    "openDate": "2010-07-16",
                    "closeDate": ""
                }
            }

        }
    })
    .factory('matterLifeToDate', function () {
        return{
            'matterLifeToDate': {
                "valueCollectionFees": {
                    "column": "Fees",
                    "net": "256,193.00",
                    "volumeDiscount": "-6,579.00",
                    "billed": "262,772.00",
                    "variance": "684.00",
                    "agreed": "262,088.00",
                    "variance2": "-92,469.00",
                    "standard": "354,556.00",
                    "totalWriteDown": "-91,784.00",
                    "percentage": "-25.89 %"
                },
                "valueCollectionEffectiveRate": {
                    "column": "Effective Rate",
                    "net": "376.15",
                    "volumeDiscount": "",
                    "billed": "385.81",
                    "variance": "",
                    "agreed": "384.80",
                    "variance2": "",
                    "standard": "520.56",
                    "totalWriteDown": "-134.76",
                    "percentage": "-25.89 %"
                },
                "valueCollectionHours": {
                    "column": "Hours",
                    "net": "676.57",
                    "volumeDiscount": "",
                    "billed": "676.57",
                    "variance": "",
                    "agreed": "681.10",
                    "variance2": "",
                    "standard": "",
                    "totalWriteDown": "-4.53",
                    "percentage": "-0.67 %"
                },
                "valueCollectionLeverage": {
                    "column": "Leverage",
                    "net": "3.03",
                    "volumeDiscount": "",
                    "billed": "",
                    "variance": "",
                    "agreed": "",
                    "variance2": "",
                    "standard": "",
                    "totalWriteDown": "",
                    "percentage": ""
                },
                "matterStanding": {
                    "matterId": "1847364378-1726352738",
                    "matterCurrency": "GBP",
                    "matterName": "OK - Servicing Agreement with Bedrock",
                    "clientName": "OK Something Bank, N.A",
                    "clientContact": "David A Fellowes-Freeman",
                    "matterPartner": "Benny Hill",
                    "matterManager": "Tom Jones",
                    "matterDepartment": "Muppet Department",
                    "matterOffice": "Planet Mars",
                    "matterWorkType": "Outsourcing",
                    "matterType": "Own Account",
                    "openDate": "2010-07-16",
                    "closeDate": ""
                }
            }
        }
    })
    .factory('workInProgress', function () {
        return{
            'workInProgress': {
                "bucketTotals": {
                    "column": "Total",
                    "fees": "2,460.80",
                    "costs": "14.35",
                    "charges": "0.00",
                    "total": "2,475.15"
                },
                "bucket0To30": {
                    "column": "0To30",
                    "fees": "0.00",
                    "costs": "0.00",
                    "charges": "0.00",
                    "total": "0.00"
                },
                "bucket31To90": {
                    "column": "31To90",
                    "fees": "0.00",
                    "costs": "0.00",
                    "charges": "0.00",
                    "total": "0.00"
                },
                "bucket91To180": {
                    "column": "91To180",
                    "fees": "2,460.80",
                    "costs": "0.00",
                    "charges": "0.00",
                    "total": "2,460.80"
                },
                "bucket180Plus": {
                    "column": "180Plus",
                    "fees": "0.00",
                    "costs": "14.35",
                    "charges": "0.00",
                    "total": "14.35"
                },
                "bucketGreater90Days": {
                    "column": "%Greater90Days",
                    "fees": "100.00 %",
                    "costs": "100.00 %",
                    "charges": "0.00 %",
                    "total": "100.00 %"
                },
                "wipByLocation": {
                    "grandTotal": "2,460.80",
                    "offices": [
                        {
                            "name": "London (100)",
                            "totalWipInMattCur": "2,460.80",
                            "totalWipHours": "6.80",
                            "departments": [
                                {
                                    "name": "Banking B6 (100-106)",
                                    "totalWipInMattCur": "2,180.00",
                                    "totalWipHours": "5.00",
                                    "wipItems": [
                                        {
                                            "workDate": "2013-04-12",
                                            "billInitials": "FF",
                                            "timekeeperName": "Fred Flintstone",
                                            "wipHours": "5.00",
                                            "wipCurrency": "GBP",
                                            "wipAmount": "2,180.00",
                                            "matterCurrency": "GBP",
                                            "effectiveRate": "436.00",
                                            "wipInMattterCurency": "2,180.00",
                                            "narrative": "Blah Blah Blah, Blah de blah... Blah Blah Blah, Blah de blah... Blah Blah Blah, Blah de blah... Blah Blah Blah, Blah de blah... Blah Blah Blah, Blah de blah... Blah Blah Blah, Blah de blah... Blah Blah Blah, Blah de blah...",
                                            "task": "Blowing the horn!! Yabba Dabba Doooo!!!! "
                                        }
                                    ]
                                },
                                {
                                    "name": "ICM CT (100-253)",
                                    "totalWipInMattCur": "280.80",
                                    "totalWipHours": "1.80",
                                    "wipItems": [
                                        {
                                            "workDate": "2013-04-03",
                                            "billInitials": "FF",
                                            "timekeeperName": "Fred Flintstone",
                                            "wipHours": "1.80",
                                            "wipCurrency": "GBP",
                                            "wipAmount": "280.80",
                                            "matterCurrency": "GBP",
                                            "effectiveRate": "156.00",
                                            "wipInMattterCurency": "280.80",
                                            "narrative": "Instructions to the boss",
                                            "task": "Diggin Rocks"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                "matterStanding": {
                    "matterId": "1847364378-1726352738",
                    "matterCurrency": "GBP",
                    "matterName": "OK - Servicing Agreement with Bedrock",
                    "clientName": "OK Something Bank, N.A",
                    "clientContact": "David A Fellowes-Freeman",
                    "matterPartner": "Benny Hill",
                    "matterManager": "Tom Jones",
                    "matterDepartment": "Muppet Department",
                    "matterOffice": "Planet Mars",
                    "matterWorkType": "Outsourcing",
                    "matterType": "Own Account",
                    "openDate": "2010-07-16",
                    "closeDate": ""
                }
            }
        }
    })
    .factory('unpaidInvoice', function() {        return{
        'unpaidInvoices' :  {
            "bucketTotals": {
                "column": "Total",
                "fees": "-601.26",
                "costs": "0.00",
                "charges": "0.00",
                "unallocated": "0.00",
                "total": "-601.26"
            },
            "bucket0To30": {
                "column": "0-30",
                "fees": "0.00",
                "costs": "0.00",
                "charges": "0.00",
                "unallocated": "0.00",
                "total": "0.00"
            },
            "bucket31To90": {
                "column": "31-90",
                "fees": "0.00",
                "costs": "0.00",
                "charges": "0.00",
                "unallocated": "0.00",
                "total": "0.00"
            },
            "bucket91To180": {
                "column": "91-180",
                "fees": "0.00",
                "costs": "0.00",
                "charges": "0.00",
                "unallocated": "0.00",
                "total": "0.00"
            },
            "bucket180Plus": {
                "column": "180Plus",
                "fees": "-601.26",
                "costs": "0.00",
                "charges": "0.00",
                "unallocated": "0.00",
                "total": "-601.26"
            },
            "bucketGreater90Days": {
                "column": "%Greater90Days",
                "fees": "100 %",
                "costs": "0 %",
                "charges": "0 %",
                "unallocated": "0 %",
                "total": "100 %"
            },
            "matterStanding": {
                "matterId": "1847364378-1726352738",
                "matterCurrency": "GBP",
                "matterName": "OK - Servicing Agreement with Bedrock",
                "clientName": "OK Something Bank, N.A",
                "clientContact": "David A Fellowes-Freeman",
                "matterPartner": "Benny Hill",
                "matterManager": "Tom Jones",
                "matterDepartment": "Muppet Department",
                "matterOffice": "Planet Mars",
                "matterWorkType": "Outsourcing",
                "matterType": "Own Account",
                "openDate": "2010-07-16",
                "closeDate": ""
            }
        }
    }
    })
;