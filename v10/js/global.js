if (typeof($)=="undefined") window.location.reload();
/*---------------------------------------------------iframe跨页面zepto---------------------------------------------*/
$(function () {parent.$$=$;});

/*--------------------------------------------------通用数据处理函数-----------------------------------------------*/

//考虑iframe的情况
//#划分变量的情况
var getQueryString =function (name, url) {	var reg = new RegExp("(^|&|\\?|\\#)" + name + "=([^&^\\?^\\#]*)(\\?|&|$|\\#)", "i"); var r =(url ||document.URL).match(reg); if (r != null) return decodeURIComponent(r[2]); return '';} 
//处理未定义或空变量
//	NNU(A) ->  A or ''
//	NNU(A,B) ->  A or B
//	NNU(A,B,C) ->  B or C
var NNU=parent.NNU || function (info,A,B){return ( typeof(info)=='undefined' ||  info == 'undefined' || info == null || info=='null' || info==undefined ? (arguments[arguments.length-1]==undefined?'':arguments[arguments.length-1]) : arguments[Math.max(0,arguments.length-2)]);};
var NoNullUndefined=NNU;

Date.prototype.dateAdd = function(interval,number) 
{ 
    var d = this; 
    var k={'y':'FullYear', 'q':'Month', 'm':'Month', 'w':'Date', 'd':'Date', 'h':'Hours', 'n':'Minutes', 's':'Seconds', 'ms':'MilliSeconds'}; 
    var n={'q':3, 'w':7}; 
    eval('d.set'+k[interval]+'(d.get'+k[interval]+'()+'+((n[interval]||1)*number)+')'); 
    return d; 
} 
/* 计算两日期相差的日期年月日等 */ 
Date.prototype.dateDiff = function(interval,objDate2) 
{ 
    var d=this, i={}, t=d.getTime(), t2=objDate2.getTime(); 
    i['y']=objDate2.getFullYear()-d.getFullYear(); 
    i['q']=i['y']*4+Math.floor(objDate2.getMonth()/4)-Math.floor(d.getMonth()/4); 
    i['m']=i['y']*12+objDate2.getMonth()-d.getMonth(); 
    i['ms']=objDate2.getTime()-d.getTime(); 
    i['w']=Math.floor((t2+345600000)/(604800000))-Math.floor((t+345600000)/(604800000)); 
    i['d']=Math.floor(t2/86400000)-Math.floor(t/86400000); 
    i['h']=Math.floor(t2/3600000)-Math.floor(t/3600000); 
    i['n']=Math.floor(t2/60000)-Math.floor(t/60000); 
    i['s']=Math.floor(t2/1000)-Math.floor(t/1000); 
    return i[interval]; 
}

//格式化时间
Date.prototype.Format = function (fmt) { //author: meizz 
  var o = {
      "M+": this.getMonth() + 1, //月份 
      "m+": this.getMonth() + 1, //月份  
      "d+": this.getDate(), //日 
      "h+": this.getHours(), //小时 
      "n+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

/*--------------------------------------------------信息显示函数-----------------------------------------------*/

//界面弹出层扩展功能
var isLoading=false;
var Loading;
var Loaded;
var notice;
var alertNew;
var lastNoticeTimeoutAnimate;
var lastNoticeTimeoutRemove;

$(function(){
	Loading=parent.Loading || function (){ if(typeof($.AMUI) == "undefined") return; isLoading=true; if ($('.am-loading').length==0) $('body').append('<div class="am-dimmer am-active am-loading" style="display: block;"></div><div class="am-loading am-modal am-modal-loading am-modal-no-btn am-modal-active" tabindex="-1" id="my-loading" style="display: block; margin-top: -3.5rem;width: 12rem;margin-left: -6rem;"><div class="am-modal-dialog" style="border-radius: 0.25rem;"><div class="am-modal-hd" style="font-size: 0.8rem;">正在载入...</div><div class="am-modal-bd"><span class="am-icon-spinner am-icon-spin"></span></div></div></div>'); else $('.am-loading').show();}
		
	Loaded=parent.Loaded ||  function (){ if(typeof($.AMUI) == "undefined") return; $('.am-loading').hide()};
	alertNew= parent.alertNew || function (content, title, btncallback){
		Loaded();
		if ($('#my-alert').length==0)
			$('body').append('<div style="display: table; width: 100%; height: 100%; position: fixed; top: 0px; z-index: 9999; vertical-align: middle; padding: 10%;"><div class="am-modal am-modal-alert am-modal-active" tabindex="-1" id="my-alert" style="display: table-cell; top: 0px; position: static; vertical-align: middle; "><div class="am-modal-dialog" style="border-radius: 0.5rem; overflow: hidden;"><div class="am-modal-hd" id="alert-title" style="background-color: #eee; border-bottom: 0.05rem solid #DDD;padding: 0.2rem;text-align: center;font-size: 0.8rem;">请注意</div><div class="am-modal-bd" id="alert-content" style="word-break:break-all; padding: 0.5rem 0.1rem; max-height: 10rem; overflow-y:auto;font-size: 0.6rem;font-weight: normal;">1</div><div class="am-modal-footer" id="my-alert-btns" style="background-color: #eee;"><span class="am-modal-btn" btnfn="确定" style="font-size: 0.6rem; padding: 0.1rem;">确定</span></div></div></div></div>');
		$('#my-alert-btns').children().remove();
		btncallback = btncallback || {'确定':function(){}};
		for (var p in btncallback){
			var btn=$('<span class="am-modal-btn" style="font-size: 0.6rem; padding: 0.1rem;">' + p + '</span>').appendTo('#my-alert-btns');
			btn.attr('btnfn',p);
			btn.one('click',function(){
				var p = $(this).attr('btnfn');
				$('#my-alert').one('closed:modal:amui', function(){setTimeout(btncallback[p],0)});
				$('#my-alert').one('closed.modal.amui', function(){setTimeout(btncallback[p],0)});
				$('#my-alert').modal('close');
			});
		}
		$('#alert-title').html(NNU(title,'请注意')); $('#alert-content').html(content);
		$('#my-alert').one('open:modal:amui',function(){$('[data-am-dimmer]').off('click');});
		$('#my-alert').one('open.modal.amui',function(){$('[data-am-dimmer]').off('click');});
		$('#my-alert').modal('open');
	};
	alert=alertNew;
	
	notice=function(text){
		if (lastNoticeTimeoutAnimate) clearTimeout(lastNoticeTimeoutAnimate);
		if (lastNoticeTimeoutRemove) clearTimeout(lastNoticeTimeoutRemove);
		$('.ajax-notice').remove();

		if (text){
			text=text.toString();
			$('<div class="ajax-notice" style="position: fixed; bottom: 10%; width: 100%;text-align: center; opacity: 0; z-index:10000;"><span style="background: rgba(0,0,0,0.6); padding: 0.25rem 0.5rem; border-radius: 0.25rem; color: #fff; font-size:0.6rem">' + text + '</span></div>').appendTo('body').animate({opacity: 1},100);;
			lastNoticeTimeoutAnimate= setTimeout(function(){
				var noticediv=$('.ajax-notice');
				if (noticediv.length>0){
					noticediv.animate({opacity: 0},600);
					lastNoticeTimeoutRemove = setTimeout(function(){
						$('.ajax-notice').remove();
					},600);
				}
			},600 + text.length*100);
		}
	};
	
	var documentLoading=true;
	$(document).on('ajaxStart', function(e, xhr, options) {
		documentLoading=true;
		setTimeout(function(){ if (documentLoading) Loading();}, 300);
	});
	$(document).on('ajaxStop', function(e, xhr, options) {	
		documentLoading=false;
		Loaded();
	});
	$(document).on('ajaxError', function(e, xhr, options) {
		alert('无法访问相关网络资源<br>'+options.url ,'错误',{'重试':function(){$.ajax(options);},'取消':function(){}});
	});
});

