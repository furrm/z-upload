// JavaScript Document

$().ready(function () {
  $("#language_select").selectBox();
  $(".select").selectBox();
  res();
  $("#header").css("visibility","visible");
}); 

function res() {
  $('#photos').cycle('destroy');
  w = parseInt($(window).width());
  if(w > 1280) w = 1280;
  if(w < 990) w = 990;
  $('#header').css("width",w+"px");
  $('#frame').css("width",w+"px");
  $("#photos div").html("<img src='/images/null.png' width='"+w+"px' height='490px'>");
  $("#photos div").css("width",w+"px");
  $("#photos div").css("height","490px");  
  $('#photos').cycle({timeout: 5000,prev:   '#photo-prev', next: '#photo-next'});    
}

$(window).resize(function() {res()});    

var v=0;
function mtoggle(){
  if(v==0) {  $("#ob-arrow").css("bottom","-5px"); $("#ar").attr("src","/images/ob-arrow-up.png"); $("#onlineform").slideToggle("slow"); v=1;}
  else { $("#ob-arrow").css("bottom","-18px"); $("#ar").attr("src","/images/ob-arrow.png"); $("#onlineform").slideToggle("slow"); v=0}
}

var v1=0;
function mtoggle1(){
  if(v1==0) {  $("#inner-ob-arrow").css("bottom","-24px"); $("#ar").attr("src","/images/ob-arrow-up.png"); $("#onlineform").slideToggle("slow"); v1=1;}
  else { $("#inner-ob-arrow").css("bottom","-35px"); $("#ar").attr("src","/images/ob-arrow.png"); $("#onlineform").slideToggle("slow"); v1=0}
}

function changeLang() {
  document.location.href='/'+$("#language_select").val()+'.aspx';
}

function init_map() {
  try {initialize_map()}catch(e){}  
}