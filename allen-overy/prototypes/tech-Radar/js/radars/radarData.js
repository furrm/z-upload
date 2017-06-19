//This is the title for your window tab, and your Radar
document.title = "Technology Radar";

var h = 650;
var w = 650;

var yearsToDisplay = 7;

var baseYearSize = (h / 2) / yearsToDisplay;

baseYearSize = Math.floor(baseYearSize);

var percentageAdjustment = 0.80;

var ring6 = baseYearSize * 6;
var ring5 = ring6 - (baseYearSize * percentageAdjustment);
var ring4 = ring5 - (baseYearSize * percentageAdjustment);
var ring3 = ring4 - (baseYearSize * percentageAdjustment);
var ring2 = ring3 - (baseYearSize * percentageAdjustment);
var ring1 = ring2 - (baseYearSize * percentageAdjustment);

//This is the concentic circles that want on your radar
var radar_arcs = [
//    {'r':100,'name':'Adopt'}
//    ,{'r':200,'name':'Trial'}
//    ,{'r':300,'name':'Assess'}
//    ,{'r':400,'name':'Hold'}
    // ,{'r':500,'name':'Possible Extra if you want it'}
//    {'r':80,'name':'2015'}
//    ,{'r':160,'name':'2016'}
//    ,{'r':240,'name':'2017'}
//    ,{'r':320,'name':'2018'}

//    {'r': ring1, 'name': '2015'}
//    ,
//    {'r': ring2, 'name': '2016'}
//    ,
//    {'r': ring3, 'name': '2017'}
//    ,
//    {'r': ring4, 'name': '2018'}
//    ,
//    {'r': ring5, 'name': '2019'}
//    ,
//    {'r': ring6, 'name': '2020'}

    {'r': baseYearSize, 'name': ''}
    ,
    {'r': baseYearSize * 2, 'name': '2015'}
    ,
    {'r': baseYearSize * 3, 'name': '2016'}
    ,
    {'r': baseYearSize * 4, 'name': '2017'}
    ,
    {'r': baseYearSize * 5, 'name': '2018'}
    ,
    {'r': baseYearSize * 6, 'name': '2019'}
    ,
    {'r': baseYearSize * 7, 'name': '2020'}
];

var blipSize = 120;

//This is your raw data
//
// Key
//
// movement:
//   t = moved
//   c = stayed put
//
// blipSize: 
//  intValue; This is optional, if you omit this property, then your blip will be size 70.
//            This give you the ability to be able to indicate information by blip size too
//
// url:
// StringValue : This is optional, If you add it then your blips will be clickable to some URL
//
// pc: polar coordinates
//   r = distance away from origin ("radial coordinate")
//     - Each level is 100 points away from origin
//     t = angle of the point from origin ("angular coordinate")
//     - 0 degrees is due east
//
// Coarse-grained quadrants
// - Techniques: elements of a software development process, such as experience design; and ways of structuring software, such micro-services.
// - Tools: components, such as databases, software development tools, such as versions control systems; or more generic categories of tools, such as the notion of polyglot persistance.
// - Platforms: things that we build software on top of: mobile technologies like Android, virtual platforms like the JVM, or generic kinds of platforms like hybrid clouds
// - Programming Languages and Frameworks
//
// Rings:
// - Adopt: blips you should be using now; proven and mature for use
// - Trial: blips ready for use, but not as completely proven as those in the adopt ring; use on a trial basis, to decide whether they should be part of your toolkit
// - Assess: things that you should look at closely, but not necessarily trial yet - unless you think they would be a particularly good fit for you
// - Hold: things that are getting attention in the industry, but not ready for use; sometimes they are not mature enough yet, sometimes they are irredeemably flawed
//      Note: there's no "avoid" ring, but throw things in the hold ring that people shouldn't use.

var radialCoordinateInner2015 = 45;
var radialCoordinateOuter2015 = 70;
var radialCoordinate2016 = 120;
var radialCoordinate2017 = 160;
var radialCoordinate2018 = 210;
var radialCoordinate2019 = 255;
var radialCoordinate2020 = 300;
var radialCoordinateLabel = 350;

var quadrantLabelAdjustment = 10;

// note: movement
// n = circle with green border - assess - added since last publication.
// c = circle - feel strongly that we should adopt technology - no movement since last publication date
// t = triangle - feel strongly that we should adopt technology  moved since last publication date
// h = circle with red border - hold - consider removing by next publication


var radar_data = [
    { "quadrant": "Services/Applications",
        "guid": "aaa-aaa-aaa",
        "description": "Some interesting techniques being looked at by the CTO Team.",
        "left": 45,
        "top": 18,
        "r": radialCoordinateLabel,
        "t": 135,
        "textAngle": (-0.90),
        "textAngle": (-Math.PI / 4),
//        "color" : "#8FA227",
        "color": "rgb(251,140,0)", // orange
        "items": [
            {
                "name": "Finance (SaaS)",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2019",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinate2019, "t": 135},
                "movement": "c",
                "blipSize": blipSize
            },
            {
                "name": "Customer Relationship Management (CRM) (SaaS)",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2019",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinate2019, "t": 155},
                "movement": "c",
                "blipSize": blipSize
            },

            {
                "name": "Human Resource Management (SaaS)",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2018",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinate2018, "t": 135},
                "movement": "c",
                "blipSize": blipSize
            }
            ,
            {
                "name": "Email (SaaS)",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2017",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinate2017, "t": 120},
                "movement": "c",
                "blipSize": blipSize
            }
            ,
            {
                "name": "Office 365",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2015",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinateOuter2015, "t": 170},
                "movement": "c",
                "blipSize": blipSize
            }
            ,
            {
                "name": "Omnia Replacement (SaaS)",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2017",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinate2017, "t": 160},
                "movement": "c",
                "blipSize": blipSize
            }
            ,
            {
                "name": "Business Intelligence (BI)",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2016",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinate2016  - 15, "t": 100},
                "movement": "c",
                "blipSize": blipSize
            },
            {
                "name": "Website (SaaS)",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2016",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinate2016 + 5, "t": 110},
                "movement": "c",
                "blipSize": blipSize
            }
            ,
            {
                "name": "Intelligent Systems",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2016",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinate2016 - 15, "t": 115},
                "movement": "c",
                "blipSize": blipSize
            }
            ,
            {
                "name": "Unified Comms",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2016",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinate2016 + 5, "t": 125},
                "movement": "c",
                "blipSize": blipSize
            }
            ,
            {
                "name": "Mobile Working",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2016",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinate2016 - 15, "t": 135},
                "movement": "c",
                "blipSize": blipSize
            }
            ,
            {
                "name": "Legacy Application Delivery as a Service",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2016",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinate2016 + 5, "t": 145},
                "movement": "c",
                "blipSize": blipSize
            }
            ,
            {
                "name": "Machine Translation as a Service",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2016",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinate2016 - 15, "t": 155},
                "movement": "c",
                "blipSize": blipSize
            }
            ,
            {
                "name": "User Behaviour and Business Transaction Monitoring",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2016",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinate2016 + 5, "t": 165},
                "movement": "c",
                "blipSize": blipSize
            }
            ,
            {
                "name": "Docker",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2016",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinate2016 - 15, "t": 173},
                "movement": "c",
                "blipSize": blipSize
            }
            ,
            {
                "name": "External Integration Services",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2015",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinateOuter2015, "t": 150},
                "movement": "c",
                "blipSize": blipSize
            }
            ,
            {
                "name": "Information Visualisation",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2015",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinateOuter2015, "t": 120},
                "movement": "c",
                "blipSize": blipSize
            }
            ,
            {
                "name": "Intelligent Composition Environment (ICE)",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2015",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinateInner2015, "t": 120},
                "movement": "c",
                "blipSize": blipSize
            }
            ,
            {
                "name": "Crowdsourcing",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2015",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinateInner2015, "t": 150},
                "movement": "c",
                "blipSize": blipSize
            }
        ]
    },
    { "quadrant": "Access/Information",
        "guid": "bbb-bbb-bbb",
        "description": "Some interesting _tools_ being looked at by the CTO Team.",
        "left": w - 200 + 30,
        "top": 18,
        "r": radialCoordinateLabel,
        "t": "45",
        "textAngle": (Math.PI / 4),
        "color": "rgb(3,169,244)", // blue
        "items": [
            {
                "name": "Internet of Things",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2019",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinate2019, "t": 60},
                "movement": "c",
                "blipSize": blipSize},
            {
                "name": "Biometric Authentication",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2018",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinate2018, "t": 20},
                "movement": "t",
                "blipSize": blipSize},
            {
                "name": "Near Field Communication (NFC)",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2016",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinate2016, "t": 20},
                "movement": "t",
                "blipSize": blipSize},
            {
                "name": "Encryption",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2016",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinate2016, "t": 40},
                "movement": "c",
                "blipSize": blipSize},
            {
                "name": "Classification",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2015",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinateOuter2015, "t": 60},
                "movement": "c",
                "blipSize": blipSize},
            {
                "name": "Asset Radio-Frequency Identification (RFID)",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2015",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinateOuter2015, "t": 20},
                "movement": "c",
                "blipSize": blipSize},
            {
                "name": "Big Data Analytics",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2016",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinate2016, "t": 70},
                "movement": "c",
                "blipSize": blipSize},
            {
                "name": "Security Information and Event Management (SIEM)",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2015",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinateInner2015, "t": 40},
                "movement": "c",
                "blipSize": blipSize},
            {
                "name": "Privileged Identity Management (PIM)",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2015",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinateInner2015, "t": 10},
                "movement": "c",
                "blipSize": blipSize},
            {
                "name": "Federated Identity Management",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2015",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinateInner2015 - 30, "t": 50},
                "movement": "c",
                "blipSize": blipSize}


        ]
    },
    { "quadrant": "Networks",
        "guid": "ccc-ccc-ccc",
        "description": "Here we cover off cloud, web and application platforms.",
        "left": 45,
        "top": (h / 2 + 18),
        "r": radialCoordinateLabel,
        "t": "225",
        "textAngle": (Math.PI / 4),
        "color": "rgb(126,87,194)", // purple
        "items": [
            {
                "name": "5G",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2020",
                "description": "Description goes **here**.",
                "pc": {"r": radialCoordinate2020, "t": 200},
                "movement": "c",
                "blipSize": blipSize
            },
            {
                "name": "All Offices Wireless",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2020",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinate2020, "t": 250},
                "movement": "t",
                "blipSize": blipSize
            },
            {
                "name": "Software-Defined Networks",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2017",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinate2017, "t": 210},
                "movement": "c",
                "blipSize": blipSize
            },
            {
                "name": "Soft Phones",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2016",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinate2016, "t": 190},
                "movement": "c",
                "blipSize": blipSize
            },
            {
                "name": "IPv6",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2016",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinate2016, "t": 210},
                "movement": "c",
                "blipSize": blipSize
            },
            {
                "name": "Hotspots 2.0",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2016",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinate2016, "t": 230},
                "movement": "c",
                "blipSize": blipSize
            },
            {
                "name": "Bluetooth Low Energy (iBeacon)",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2016",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinate2016, "t": 250},
                "movement": "c",
                "blipSize": blipSize
            },
            {
                "name": "Adopt 802.11ac",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2015",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinateOuter2015, "t": 220},
                "movement": "c",
                "blipSize": blipSize
            },
            {
                "name": "Global Web Acceleration/Optimisation",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2015",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinateInner2015, "t": 250},
                "movement": "c",
                "blipSize": blipSize
            },
            {
                "name": "Content Delivery Networks (CDN)",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2015",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinateOuter2015, "t": 250},
                "movement": "c",
                "blipSize": blipSize
            }


        ]
    },
    { "quadrant": "Infrastructure",
        "guid": "ddd-dddd-ddd",
        "description": "Some of the languages we are looking at around web and mobile development.",
        "color": "rgb(0,150,136)", // light green
//        "color": "#8BC34A", // light green
        "left": (w - 200 + 30),
        "top": (h / 2 + 18),
        "r": radialCoordinateLabel,
        "t": "315",
        "textAngle": (-Math.PI / 4),
        "items": [
            {
                "name": "Datacenter Consolidation",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2019",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinate2019, "t": 340},
                "movement": "c",
                "blipSize": blipSize
            }
            ,
            {
                "name": "Global Managed Print Service",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2017",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinate2017, "t": 340},
                "movement": "c",
                "blipSize": blipSize
            }
            ,
            {
                "name": "CTE/PROD Merged",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2016",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinate2016, "t": 350},
                "movement": "c",
                "blipSize": blipSize
            },
            {
                "name": "Flash-based Storage",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2016",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinate2016, "t": 330},
                "movement": "c",
                "blipSize": blipSize
            },
            {
                "name": "Wearable Devices",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2016",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinate2016, "t": 310},
                "movement": "t",
                "blipSize": blipSize
            },
            {
                "name": "SharePoint (PaaS)",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2016",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinate2016, "t": 290},
                "movement": "c",
                "blipSize": blipSize
            },
            {
                "name": "Converged Infrastructure",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2015",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinateOuter2015, "t": 320},
                "movement": "c",
                "blipSize": blipSize
            },
            {
                "name": "Internal Private Cloud",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2015",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": radialCoordinateOuter2015, "t": 290},
                "movement": "c",
                "blipSize": blipSize
            },
            {
                "name": "100% Dev Cloud",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2015",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": 40, "t": 300},
                "movement": "c",
                "blipSize": blipSize
            }
            ,
            {
                "name": "Choose Your Own Device",
                "team": "Technical Authority; Technical Lead; Project Manager; Business Analyst; Application Developer",
                "targetYear": "2015",
                "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.",
                "pc": {"r": 40, "t": 330},
                "movement": "c",
                "blipSize": blipSize
            }

        ]
    }
];
