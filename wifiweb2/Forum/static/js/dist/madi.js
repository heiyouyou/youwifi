!function i(r,s,u){function d(n,e){if(!s[n]){if(!r[n]){var t="function"==typeof require&&require;if(!e&&t)return t(n,!0);if(c)return c(n,!0);var a=new Error("Cannot find module '"+n+"'");throw a.code="MODULE_NOT_FOUND",a}var o=s[n]={exports:{}};r[n][0].call(o.exports,function(e){var t=r[n][1][e];return d(t||e)},o,o.exports,i,r,s,u)}return s[n].exports}for(var c="function"==typeof require&&require,e=0;e<u.length;e++)d(u[e]);return d}({1:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.b_notify=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},t=e.message,n=void 0===t?"Error!":t,a=e.type,o=void 0===a?"success":a,i=e.enter,r=void 0===i?"animated fadeInDown":i,s=e.exit,u=void 0===s?"animated fadeOutUp":s,d=e.mouse_over,c=void 0===d?"pause":d;$.notify({message:n},{type:o,animate:{enter:r,exit:u},mouse_over:c})};n.global={wifi:{}},n.SERVER_BAIDU_KEY="5K3kPVyuMqBvZcinxZuLNWvwxiiN0Eyk",n.CLIENT_BAIDU_KEY="FYjp179jiNXWaRytow8a4N0oe1jEfXiK",n.geotableId=184953},{}],2:[function(e,t,n){"use strict";var c=e("../common.js");$(function(){var t,d=new BMap.Map("map-container");new BMap.Point(116.403694,39.927552);function a(e){t&&d.removeTileLayer(t),t=new BMap.CustomLayer({geotableId:184953,q:"",tags:"",filter:""}),d.addTileLayer(t),t.addEventListener("hotspotclick",n)}function n(e){var u=e.customPoi,t=e.content.my_id;$.ajax({url:"/hotspot/detail?pid="+t,success:function(e){if(1==e.code){var t=e.ssid,n=e.mac,a=e.encrypt,o=e.location,i='<p style="line-height:20px;">SSID：'+t+"<br/>密码："+e.password+"<br/>加密方式："+a+"<br/>物理位置："+o+"<br/></p>",r=new BMapLib.SearchInfoWindow(d,i,{title:n,width:290,height:40,panel:"panel",enableAutoPan:!0,enableSendToPhone:!1,searchTypes:[]}),s=new BMap.Point(u.point.lng,u.point.lat);r.open(s)}else(0,c.b_notify)({message:e.msg,type:"danger"})}})}d.centerAndZoom("深圳",12),d.enableScrollWheelZoom(),d.addControl(new BMap.NavigationControl),a(),c.global.wifi.maditu={init:function(){this.common(),this.updateData(),this.getUpdateTime()},task_timer:null,updateData:function(){var a=this;$("#update-data-btn").on("click",function(){$.get("/hotspot/upgradelbs").done(function(e){var t=JSON.parse(e);if(console.log(t),0==t.status){var n=t.job_id;a.getUpdateTime(),(0,c.b_notify)({message:t.message}),a.task_timer=setInterval(function(){a.getTaskProgress(n)},2e3)}else(0,c.b_notify)({message:t.message,type:"danger"})}).fail(function(){(0,c.b_notify)({message:"失败",type:"danger"})})})},getTaskProgress:function(e){var t=this,n={geotable_id:c.geotableId,ak:c.SERVER_BAIDU_KEY,job_id:e};$.ajax({url:"http://api.map.baidu.com/geodata/v3/job/listimportdata",type:"GET",data:n,dataType:"JSONP"}).done(function(e){0==e.status?(console.log(e),clearInterval(t.task_timer),a(),(0,c.b_notify)({message:e.message+"上传最新数据"})):(0,c.b_notify)({message:e.message,type:"danger"})}).fail(function(){(0,c.b_notify)({message:"失败",type:"danger"})})},getUpdateTime:function(){$.get("/hotspot/getupdatetime",function(e){e.time&&$("#update-data-time").text(e.time)})},common:function(){}},c.global.wifi.maditu.init()})},{"../common.js":1}]},{},[2]);