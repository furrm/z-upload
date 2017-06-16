// JavaScript Document

maxRooms = 4;
maxAdults = 3;
maxChildren = 4;
maxChildAge = 18;
currentRoom = 0;
maxSelChildren=0;

function createAdultSelect(idx) {
  var x;
  txt = "<select id='room"+idx+"_Adults' class='select' style='width:10px;'>";
  for(x=1;x<=maxAdults;x++) txt +="<option value='"+x+"'>"+x+"</option>"; 
  txt += "</select>";
  return txt;
}

function createChildrenSelect(idx) {
  var x;
  txt = "<select id='room"+idx+"_Children' class='select' onChange='showRoomAges("+idx+")' style='width:10px;'>";
  for(x=0;x<=maxChildren;x++) txt +="<option value='"+x+"'>"+x+"</option>"; 
  txt += "</select>";
  return txt;
}

function createChildrenAgesSelect(idx,ch) {
  var x;
  txt = "<select id='room"+idx+"_ChildAge"+ch+"' class='select' style='width:10px;'>";
  for(x=1;x<=maxChildAge;x++) txt +="<option value='"+x+"'>"+x+"</option>"; 
  txt += "</select>";
  return txt;
}  

function createRoomAgesRow(idx) {
  var x;
  txt = "<tr id='childAge_"+idx+"'>";
  txt += "<td>"+Room+" "+idx+"</td>";
  for(x=1;x<=maxChildren;x++) {
    txt += "<td>";
    txt += "<div id='divroom"+idx+"_ChildAge"+x+"' class='divroom"+idx+"' style='display:none'>";
    txt += createChildrenAgesSelect(idx,x);
    txt += "</div>";
    txt += "</td>";
  }
  txt += "</tr>";

  var row = $('#childageshead');
  $('#childages tr').each(function(n){
    var sbr = $(this).attr('id').split('_');
    if(sbr[1] < idx) row = $(this);
  });
  
  row.after(txt);
  $("#childAge_"+idx+" .select").selectBox();
}

function showRoomAges(idx) {
  var x;
  var ageval = $("#room"+idx+"_Children").val();
  
  if($('#childAge_'+idx).length) {
    if(ageval==0) $('#childAge_'+idx).hide();
    else $('#childAge_'+idx).show();
  } else {
    if(ageval>0) {
      createRoomAgesRow(idx);
      $('#childAge_'+idx).show();
    }
  }
  
  maxSelChildren = 0;
  for(x=1;x<=maxRooms;x++){
    if($("#roomRow"+x).is(":visible") && maxSelChildren < $("#room"+x+"_Children").val()) maxSelChildren = $("#room"+x+"_Children").val();
  }
  if(maxSelChildren==0) $("#childages").hide();
  else $("#childages").show();
      
  for(x=1;x<=maxChildren;x++) {
    if(x <= maxSelChildren) $('#r'+x).show();
    else $('#r'+x).hide();
    if(x<=ageval) $('#divroom'+idx+'_ChildAge'+x).show();
    else $('#divroom'+idx+'_ChildAge'+x).hide();
  }
}

function hideRoomAges(idx) {
  var x;
  if($('#childAge_'+idx).length) $('#childAge_'+idx).hide();  
  
  maxSelChildren = 0;
  for(x=1;x<=maxRooms;x++){
    if($("#roomRow"+x).is(":visible") && maxSelChildren < $("#room"+x+"_Children").val()) maxSelChildren = $("#room"+x+"_Children").val();
  }
  if(maxSelChildren==0) $("#childages").hide();
  else $("#childages").show();    
      
  for(x=1;x<=maxChildren;x++) {
    if(x <= maxSelChildren) $('#r'+x).show();
    else $('#r'+x).hide();
  }      
}


function addRoom() {
  if(currentRoom == maxRooms) return;

  currentRoom = currentRoom+1;    

  if(currentRoom > 1) $( "#removeRoom" ).show();
  if(currentRoom == maxRooms) $( "#addRoom" ).hide();
  
  if(currentRoom > 1 && currentRoom < maxRooms) $("#button-spacer").show();
  else $("#button-spacer").hide();
  
  if($('#roomRow'+currentRoom).length) {
    $('#roomRow'+currentRoom).show();
  } else {
    $('#roomsTable tr:last').after('<tr id="roomRow'+currentRoom+'"><td>'+Room+' '+currentRoom+'</td><td>'+createAdultSelect(currentRoom)+'</td><td>'+createChildrenSelect(currentRoom)+'</td></tr>');
  
    $("#room"+currentRoom+"_Adults").selectBox();
    $("#room"+currentRoom+"_Children").selectBox();
  }
  
  showRoomAges(currentRoom);
}

function removeRoom() {
  if(currentRoom == 1) return;

  $('#roomRow'+currentRoom).hide();
  
  hideRoomAges(currentRoom);
  
  currentRoom = currentRoom-1;
  if(currentRoom == 1) $( "#removeRoom" ).hide();
  if(currentRoom < maxRooms) $( "#addRoom" ).show();

  if(currentRoom > 1 && currentRoom < maxRooms) $("#button-spacer").show();
  else $("#button-spacer").hide();
  
}  

function submitreq() {
  var x;
  var y;
  var prms = "";
  var lang = $("#lang").val();
  var ci = $("#ci").val();
  var co = $("#co").val();  
      
  for(x=1;x<=currentRoom;x++) {
    tmp = "";
    adults = $("#room"+x+"_Adults").val();
    tmp += adults
    if($("#room"+x+"_Children").val() > 0) {
      for(y=1;y<=$("#room"+x+"_Children").val();y++) {
        tmp += "/"+$("#room"+x+"_ChildAge"+y).val()
      }
    }
    if(prms != "") prms += "^";
    prms += tmp;
  }
  
  prms = "lang="+lang+"&ci="+ci+"&co="+co+"&r="+prms;

  window.open("https://hotel-mike.hotelproxy.net/reservations/step1.aspx?"+prms)
}

$().ready(function () {
  
  addRoom();
  
  $( "#removeRoom" ).hide();
        
  $("input[id$='dtCheckIn']").datepicker({ minDate: '0', numberOfMonths: 1, showOn: "button", dateFormat: 'dd/mm/yy',altField: "#ci",altFormat: "yy-mm-dd",buttonText:"" });
    $("input[id$='dtCheckOut']").datepicker({ minDate: '0', numberOfMonths: 1, showOn: "button", dateFormat: 'dd/mm/yy', altField: "#co",altFormat: "yy-mm-dd",buttonText:"" });

    var d = new Date();
    var checkInDate = $("input[id$='dtCheckIn']").datepicker('getDate');
    if (checkInDate < d) {
        checkInDate = d;
        $("input[id$='dtCheckIn']").datepicker('setDate', d);
    }
    var checkOutDate = $("input[id$='dtCheckOut']").datepicker('getDate');
    var nextDayDate = $("input[id$='dtCheckIn']").datepicker('getDate', '+1d');

    if (checkOutDate < nextDayDate) {
        nextDayDate.setDate(nextDayDate.getDate() + 1);
    } else {
        nextDayDate.setDate(checkOutDate.getDate());
    }
    $("input[id$='dtCheckOut']").datepicker('setDate', nextDayDate);
    $("input[id$='dtCheckOut']").datepicker('option', 'minDate', nextDayDate);

    //set the checkout date to be one day after of the checkin date
    $("input[id$='dtCheckIn']").change(function () {
        var nextDayDate = $("input[id$='dtCheckIn']").datepicker('getDate', '+1d');
        nextDayDate.setDate(nextDayDate.getDate() + 1);
        $("input[id$='dtCheckOut']").datepicker('setDate', nextDayDate);
        $("input[id$='dtCheckOut']").datepicker('option', 'minDate', nextDayDate);
    });    
  
})