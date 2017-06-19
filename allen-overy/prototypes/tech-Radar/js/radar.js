function init(h, w) {
    $('#title').text(document.title);

    var radar = new pv.Panel()
        .width(w)
        .height(h)
        .canvas('radar')

// arcs
    radar.add(pv.Dot)
        .data(radar_arcs)
        .left(w / 2)
        .bottom(h / 2)
        .radius(function (d) {
            return d.r;
        })
        .lineWidth(1) // width od the stroke
        .strokeStyle(function(d){
            if(d.name === "")
            {return "";}
            else
            {return "#000"}
        })
//        .strokeStyle("#000")
            .fillStyle("rgba(189,189,189,0.2)") // fills the entire circle
//        .fillStyle("rgba(255, 224, 130,0.2)") // fills the entire circle
//        .fillStyle("rgba(194, 205, 35,.1)") // fills the entire circle
        .anchor("top")
        .add(pv.Label)
        .text(function (d) {
            return d.name;
        })
        .font("15px arial") // css specific font
        .textMargin(15) // margin to pad away from the arc line
        .textBaseline("top") // label position in relation to arc line
        .textStyle("rgba(0,0,0,1.0)"); // label colour
//        .textStyle("#F44336"); // label colour


//quadrant lines -- vertical
    radar.add(pv.Line)
        .data([(h / 2 - radar_arcs[radar_arcs.length - 1].r), h - (h / 2 - radar_arcs[radar_arcs.length - 1].r)])
        .lineWidth(1) // width od the stroke
        .left(w / 2)
        .bottom(function (d) {
            return d;
        })
        .strokeStyle("rgba(0,0,0,0.3)");

//quadrant lines -- horizontal 
    radar.add(pv.Line)
        .data([(w / 2 - radar_arcs[radar_arcs.length - 1].r), w - (w / 2 - radar_arcs[radar_arcs.length - 1].r)])
        .lineWidth(1)
        .bottom(h / 2)
        .left(function (d) {
            return d;
        })
        .strokeStyle("rgba(0,0,0,0.3)");


// blips
    var total_index = 1;
    var counter = 0;

    _.forEach(radar_data, function(quadrant){

        _.forEach(quadrant.items, function(item){
            counter++;
            _.assign(item, {id:counter});
            _.assign(item, {color:quadrant.color});
            _.assign(item, {quadrant:quadrant.quadrant});
        })
    });

    for (var i = 0; i < radar_data.length; i++) {
        radar.add(pv.Dot)
            .def("active", false)
            .data(radar_data[i].items)
            .size(function (d) {
                return ( d.blipSize !== undefined ? d.blipSize : 70 );
            })
            .left(function (d) {
                var x = polar_to_raster(d.pc.r, d.pc.t)[0];
//                console.log("name:" + d.name + ", x:" + x);
                return x;
            })
            .bottom(function (d) {
                var y = polar_to_raster(d.pc.r, d.pc.t)[1];
//                console.log("name:" + d.name + ", y:" + y);
                return y;
            })
            .title(function (d) {
                return d.name;
            })
            .cursor(function (d) {
//                return ( d.url !== undefined ? "pointer" : "auto" );
                return "auto";
            })
            .event("click", function (d) {

                // Integration with AngularJS
                var scope = angular.element(document.querySelector('#body')).scope();
                scope.$apply(function () {
                    scope.selectBlimp(d);
                })
            })
//            .event("mouseover",pv.Behavior.tipsy({"gravity": "sw",fade:true}))
            .angle(Math.PI)  // 180 degrees in radians !
            .lineWidth(4) // width od the stroke
            .strokeStyle(function(d){
                if(d.movement == "d"){
//                    return "rgb(67,160,71)"; // Green
                    return d.color

                }
                else if(d.movement == "s"){
//                    return "rgb(239,83,80)"; // Red
                    return d.color

                }
                else {
                    return d.color
                }
            })
//            .strokeStyle(radar_data[i].color)
            .fillStyle(radar_data[i].color)
            .shape(function (d) {
                //return (d.movement === 't' ? "triangle" : "circle"); // can be any shape e.g square, diamond
                if(d.movement === "t"){
                    return "triangle";
                }
                else if(d.movement === "c") {
                    return "circle";
                }
                else if(d.movement === "s"){
                    return "square";
                }
                else{
                    return "diamond";
                }
            })
            .anchor("center")
            .add(pv.Label)
            .text(function (d) {
//                return "<a>TEST</a>"
                return total_index++;
            })
            .textBaseline("middle")
            .textStyle("white");
    }

    // Quadrant Ledgends
    _.forEach(radar_data, function(quadrant){
    console.log("Quad",quadrant); // todo: delete me

//        radar.add(pv.Label)
//            .left(quadrant.left)
//            .top(quadrant.top)
//            .text(quadrant.quadrant)
//            .font("18px sans-serif")
//        ;

        radar.add(pv.Dot)
//            .left(quadrant.left)
//            .top(quadrant.top)
            .left(function () {
                var x = polar_to_raster(quadrant.r, quadrant.t)[0];
//                console.log("name:" + d.name + ", x:" + x);
                return x;
            })
            .bottom(function () {
                var y = polar_to_raster(quadrant.r, quadrant.t)[1];
//                console.log("name:" + d.name + ", y:" + y);
                return y;
            })
            .strokeStyle("rgba(255,255,255,0)")
            .fillStyle("rgba(255,255,255,0)")
            .shape("circle")
            .anchor("center")
            .add(pv.Label)
            .text(function(){
                return quadrant.quadrant;
            })
            .textAngle(quadrant.textAngle)
            .font("16px sans-serif")
        ;

    });



//Quadrant Ledgends
//    var radar_quadrant_ctr = 1;
//    for (var i = 0; i < radar_data.length; i++) {
//        radar.add(pv.Label)
//            .left(radar_data[i].left)
//            .top(radar_data[i].top)
//            .text(radar_data[i].quadrant)
//            .strokeStyle(radar_data[i].color)
//            .fillStyle(radar_data[i].color)
//            .font("18px sans-serif")
//            .add(pv.Dot)
//            .def("i", radar_data[i].top)
//            .data(radar_data[i].items)
//            .top(function () {
//                return ( this.i() + 18 + this.index * 18 );
//            })
//            .shape(function (d) {
//                return (d.movement === 't' ? "triangle" : "circle");
//            })
//            .cursor(function (d) {
//                return ( d.url !== undefined ? "pointer" : "auto" );
//            })
//            .event("click", function (d) {
//                if (d.url !== undefined) {
//                    self.location = d.url
//                }
//            })
//            .size(10)
//            .angle(45)
//            .anchor("right")
//            .add(pv.Label)
//            .text(function (d) {
//                return radar_quadrant_ctr++ + ". " + d.name;
//            });
//    }

    radar.anchor('radar');
    radar.render();

};