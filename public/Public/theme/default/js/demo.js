/*product main zoom.js*/
(function($){$(document).ready(function(){$('.cloud-zoom, .cloud-zoom-gallery').CloudZoom()});function format(a){for(var i=1;i<arguments.length;i++){a=a.replace('%'+(i-1),arguments[i])}return a}function CloudZoom(g,i){var j=$('img',g);var k;var l;var m=null;var n=null;var o=null;var p=null;var q=null;var r=null;var s;var t=0;var u,ch;var v=0;var z=0;var A=0;var B=0;var C=0;var D,my;var E=this,zw;setTimeout(function(){if(n===null){var w=g.width();g.parent().append(format('<div style="width:%0px;position:absolute;top:75%;left:%1px;text-align:center" class="cloud-zoom-loading" >Loading...</div>',w/3,(w/2)-(w/6))).find(':last').css('opacity',0.5)}},200);var F=function(){if(r!==null){r.remove();r=null}};this.removeBits=function(){if(o){o.remove();o=null}if(p){p.remove();p=null}if(q){q.remove();q=null}F();$('.cloud-zoom-loading',g.parent()).remove()};this.destroy=function(){g.data('zoom',null);if(n){n.unbind();n.remove();n=null}if(m){m.remove();m=null}this.removeBits()};this.fadedOut=function(){if(m){m.remove();m=null}this.removeBits()};this.controlLoop=function(){if(o){var x=(D-j.offset().left-(u*0.5))>>0;var y=(my-j.offset().top-(ch*0.5))>>0;if(x<0){x=0}else if(x>(j.outerWidth()-u)){x=(j.outerWidth()-u)}if(y<0){y=0}else if(y>(j.outerHeight()-ch)){y=(j.outerHeight()-ch)}o.css({left:x,top:y});o.css('background-position',(-x)+'px '+(-y)+'px');v=(((x)/j.outerWidth())*s.width)>>0;z=(((y)/j.outerHeight())*s.height)>>0;B+=(v-B)/i.smoothMove;A+=(z-A)/i.smoothMove;m.css('background-position',(-(B>>0)+'px ')+(-(A>>0)+'px'))}t=setTimeout(function(){E.controlLoop()},30)};this.init2=function(a,b){C++;if(b===1){s=a}if(C===2){this.init()}};this.init=function(){$('.cloud-zoom-loading',g.parent()).remove();n=g.parent().append(format("<div class='mousetrap' style='background-image:url(\".\");z-index:999;position:absolute;width:%0px;height:%1px;left:%2px;top:%3px;\'></div>",j.outerWidth(),j.outerHeight(),0,0)).find(':last');n.bind('mousemove',this,function(a){D=a.pageX;my=a.pageY});n.bind('mouseleave',this,function(a){clearTimeout(t);if(o){o.fadeOut(299)}if(p){p.fadeOut(299)}if(q){q.fadeOut(299)}m.fadeOut(300,function(){E.fadedOut()});return false});n.bind('mouseenter',this,function(a){D=a.pageX;my=a.pageY;zw=a.data;if(m){m.stop(true,false);m.remove()}var b=i.adjustX,yPos=i.adjustY;var c=j.outerWidth();var d=j.outerHeight();var w=i.zoomWidth;var h=i.zoomHeight;if(i.zoomWidth=='auto'){w=c}if(i.zoomHeight=='auto'){h=d}var e=g.parent();switch(i.position){case'top':yPos-=h;break;case'right':b+=c;break;case'bottom':yPos+=d;break;case'left':b-=w;break;case'inside':w=c;h=d;break;default:e=$('#'+i.position);if(!e.length){e=g;b+=c;yPos+=d}else{w=e.innerWidth();h=e.innerHeight()}}m=e.append(format('<div id="cloud-zoom-big" class="cloud-zoom-big" style="display:none;position:absolute;left:%0px;top:%1px;width:%2px;height:%3px;background-image:url(\'%4\');z-index:99;"></div>',b,yPos,w,h,s.src)).find(':last');if(j.attr('title')&&i.showTitle){m.append(format('<div class="cloud-zoom-title">%0</div>',j.attr('title'))).find(':last').css('opacity',i.titleOpacity)}if($.browser.msie&&$.browser.version<7){r=$('<iframe frameborder="0" src="#"></iframe>').css({position:"absolute",left:b,top:yPos,zIndex:99,width:w,height:h}).insertBefore(m)}m.fadeIn(500);if(o){o.remove();o=null}u=(j.outerWidth()/s.width)*m.width();ch=(j.outerHeight()/s.height)*m.height();o=g.append(format("<div class = 'cloud-zoom-lens' style='display:none;z-index:98;position:absolute;width:%0px;height:%1px;'></div>",u,ch)).find(':last');n.css('cursor',o.css('cursor'));var f=false;if(i.tint){o.css('background','url("'+j.attr('src')+'")');p=g.append(format('<div style="display:none;position:absolute; left:0px; top:0px; width:%0px; height:%1px; background-color:0;" />',j.outerWidth(),j.outerHeight(),i.tint)).find(':last');p.css('opacity',i.tintOpacity);f=true;p.fadeIn(500)}if(i.softFocus){o.css('background','url("'+j.attr('src')+'")');q=g.append(format('<div style="position:absolute;display:none;top:2px; left:2px; width:%0px; height:%1px;" />',j.outerWidth()-2,j.outerHeight()-2,i.tint)).find(':last');q.css('background','url("'+j.attr('src')+'")');q.css('opacity',0.5);f=true;q.fadeIn(500)}if(!f){o.css('opacity',i.lensOpacity)}if(i.position!=='inside'){o.fadeIn(500)}zw.controlLoop();return})};k=new Image();$(k).load(function(){E.init2(this,0)});k.src=j.attr('src');l=new Image();$(l).load(function(){E.init2(this,1)});l.src=g.attr('href')}$.fn.CloudZoom=function(d){try{document.execCommand("BackgroundImageCache",false,true)}catch(e){}this.each(function(){var c,opts;eval('var	a = {'+$(this).attr('rel')+'}');c=a;if($(this).is('.cloud-zoom')){$(this).css({'position':'relative','display':'block'});$('img',$(this)).css({'display':'block'});if($(this).parent().attr('id')!='wrap'){$(this).wrap('<div id="wrap" style="top:0px;z-index:9999;position:relative;"></div>')}opts=$.extend({},$.fn.CloudZoom.defaults,d);opts=$.extend({},opts,c);$(this).data('zoom',new CloudZoom($(this),opts))}else if($(this).is('.cloud-zoom-gallery')){opts=$.extend({},c,d);$(this).data('relOpts',opts);$(this).bind('click',$(this),function(a){var b=a.data.data('relOpts');$('#'+b.useZoom).data('zoom').destroy();$('#'+b.useZoom).attr('href',a.data.attr('href'));$('#'+b.useZoom+' img').attr('src',a.data.data('relOpts').smallImage);$('#'+a.data.data('relOpts').useZoom).CloudZoom();return false})}});return this};$.fn.CloudZoom.defaults={zoomWidth:'auto',zoomHeight:'auto',position:'right',tint:false,tintOpacity:0.5,lensOpacity:0.5,softFocus:false,smoothMove:3,showTitle:true,titleOpacity:0.5,adjustX:0,adjustY:0}})(jQuery);



//fixed-nav
$(document).on("scroll",function(){
	if($(document).scrollTop()>20){ 
		$("header").removeClass("large").addClass("small");
	}
	else{
		$("header").removeClass("small").addClass("large");
	}
});
 

//banner
$(function(){
var interleaveOffset = 0.5;
	var swiperOptions = {
	  loop: true,
	  speed: 1000,
	  autoplay:true,
	  grabCursor: true,
	  watchSlidesProgress: true,
	  mousewheelControl: true,
	  keyboardControl: true,
	  keyboard: {
          enabled: true,
        },
	  pagination: {
          el: ".index_banner .swiper-pagination",
		  clickable: true,
        },
	  navigation: {
		nextEl: ".index_banner .swiper-button-next",
		prevEl: ".index_banner .swiper-button-prev"
	  },

	  on: {
		progress: function(swiper) {
		  for (var i = 0; i < swiper.slides.length; i++) {
			var slideProgress = swiper.slides[i].progress;
			var innerOffset = swiper.width * interleaveOffset;
			var innerTranslate = slideProgress * innerOffset;
			swiper.slides[i].querySelector(".slide-inner").style.transform =
			  "translate3d(" + innerTranslate + "px, 0, 0)";
		  }      
		},
		touchStart: function(swiper) {
		  for (var i = 0; i < swiper.slides.length; i++) {
			swiper.slides[i].style.transition = "";
		  }
		},
		setTransition: function(swiper, speed) {
		  for (var i = 0; i < swiper.slides.length; i++) {
			swiper.slides[i].style.transition = speed + "ms";
			swiper.slides[i].querySelector(".slide-inner").style.transition =
			  speed + "ms";
		  }
		}
	  }
	};
	var swiper = new Swiper(".swiper-banner", swiperOptions);
})

//search
 $(function(){
     $(".attr-nav").each(function(){  
                $(".search", this).on("click", function(e){
                    e.preventDefault();
                    $(".top-search").slideToggle();
                    $('.top_overly').fadeIn(100);
                });
            });
            $(".input-group-addon.close-search").on("click", function(){
                $(".top-search").slideUp();
                $('.top_overly').fadeOut(100);
            });
  })
  
  
  $(function(){
	 $(".search_section").each(function(){  
			$(".mob_search", this).on("click", function(e){
				e.preventDefault();
				$(".search_input").css({"height":"160px"});
			});
		});
		$(".close-search").on("click", function(){
			$(".search_input").css({"height":"0"});
		})
	})
 
//back-top
$(function(){
	$(window).scroll(function(){
		var _top = $(window).scrollTop();
		if(_top>300){
			$('.back_top').fadeIn(600);
		}else{
			$('.back_top').fadeOut(600);
		}
	});
	$(".back_top").click(function(){
		$("html,body").animate({scrollTop:0},500);
	});
});


//fixed inquiry
$(function( ) {
	setInterval(function(){
		if($(".animated-circles").hasClass("animated")){
			$(".animated-circles").removeClass("animated");
		}else{
			$(".animated-circles").addClass('animated');
		}
	},3000);
	var wait = setInterval(function(){
		$(".livechat-hint").removeClass("show_hint").addClass("hide_hint");
		clearInterval(wait);
	},4500);
	$(".livechat-girl").hover(function(){
		clearInterval(wait);
		$(".livechat-hint").removeClass("hide_hint").addClass("show_hint");
	},function(){
		$(".livechat-hint").removeClass("show_hint").addClass("hide_hint");
	}).click(function(){
		
	});
});


$(document).ready(function(){
    $("#floatShow").bind("click",function(){
        $("#onlineService").animate({
            height:"show", 
            opacity:"show"
        }, "normal" ,function(){
            $("#onlineService").show();
        });
        $("#floatShow").attr("style","display:none;opacity: 0");
        $("#floatHide").attr("style","display:block;opacity: 1");
        return false;
    });
	
    $("#floatHide").bind("click",function(){
        $("#onlineService").animate({
            height:"hide", 
            opacity:"hide"
        }, "normal" ,function(){
            $("#onlineService").hide();
        });
        $("#floatShow").attr("style","display:block;opacity: 1");
        $("#floatHide").attr("style","display:none;opacity: 0");
        return false;
    });
  
});

//FAQ点击伸缩
$('.accordion > li:eq(0) a').addClass('active').next().slideDown(); 
	$('.accordion a').on( 'click',function(j) {
		var dropDown = $(this).closest('li').find('p');

		$(this).closest('.accordion').find('p').not(dropDown).slideUp();

		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
		} else {
			$(this).closest('.accordion').find('a.active').removeClass('active');
			$(this).addClass('active');
		}

		dropDown.stop(false, true).slideToggle();

		j.preventDefault();
	});


/*service*/
$(function(){
	$(".service ul li").hover(function(){
		$(this).find(".sidebox").stop().animate({"width":"240px"},100).css({"opacity":"1","filter":"Alpha(opacity=100)"})	
	},function(){
		$(this).find(".sidebox").stop().animate({"width":"48px"},100).css({"opacity":"1","filter":"Alpha(opacity=100)"})	
	});
});


$(function($) {
          var $nav = $('#main-nav');
          var $toggle = $('.toggle');
          var defaultData = {
            maxWidth: false,
            customToggle: $toggle,
            levelTitles: true
          };
          var $clone = null;
          var data = {};
          const initNav = function(conf) {
            if ($clone) {
              $clone.remove();
            }
            $toggle.off('click');
            $clone = $nav.clone();
            $.extend(data, conf)
            $clone.hcMobileNav($.extend({}, defaultData, data));
          }
          initNav({});

          $('.actions').find('a').on('click', function(e) {
            e.preventDefault();

            var $this = $(this).addClass('active');
            var $siblings = $this.parent().siblings().children('a').removeClass('active');

            initNav(eval('(' + $this.data('demo') + ')'));
          });
        });


$(function(){
(function( window , document ){
		'use strict';
		var hotcss = {};
		(function() {
			var viewportEl = document.querySelector('meta[name="viewport"]'),
				hotcssEl = document.querySelector('meta[name="hotcss"]'),
				dpr = window.devicePixelRatio || 1,
				maxWidth = 640,
				designWidth = 0;
			document.documentElement.setAttribute('data-dpr', dpr);
			hotcss.dpr = dpr;
			document.documentElement.setAttribute('max-width', maxWidth);
			hotcss.maxWidth = maxWidth;
			if( designWidth ){
				document.documentElement.setAttribute('design-width', designWidth);
				hotcss.designWidth = designWidth;
			}
		})();
		hotcss.px2rem = function( px , designWidth ){
			if( !designWidth ){
				designWidth = parseInt(hotcss.designWidth , 10);
			}
			return parseInt(px,10)*640/designWidth/20;
		}
		hotcss.rem2px = function( rem , designWidth ){
			if( !designWidth ){
				designWidth = parseInt(hotcss.designWidth , 10);
			}
			return rem*20*designWidth/640;
		}
		hotcss.mresize = function(){
			var innerWidth = document.documentElement.getBoundingClientRect().width || window.innerWidth;
			if( hotcss.maxWidth && (innerWidth/hotcss.dpr > hotcss.maxWidth) ){
				innerWidth = hotcss.maxWidth*hotcss.dpr;
			}
		};
		hotcss.mresize();
		window.addEventListener( 'resize' , function(){
			clearTimeout( hotcss.tid );
			hotcss.tid = setTimeout( hotcss.mresize , 400 );
		} , false );
		window.addEventListener( 'load' , hotcss.mresize , false );
		setTimeout(function(){
			hotcss.mresize();
		},333)
		window.hotcss = hotcss;
	})( window , document );
	(function($){
		var mainWit = $(window).width(),
			mainHit = $(window).height(),
			carouselBar = $(".page-header-bar"),
			fixedContact = $(".fixed-contact");

/*fixed-contact*/
		$(".fixed-contact").hover(function(){
			$(this).addClass("active");
		},function(){
			$(this).removeClass("active");
		});
		$(window).scroll(function() {
			if($(window).width() > 992){
				if ($(this).scrollTop() > mainHit/2 ){
					carouselBar.addClass("active");
					fixedContact.addClass("show");
				} else {
					carouselBar.removeClass("active");
					fixedContact.removeClass("show");
				}
			}
		});
	})(jQuery);
	
});

$(function(){  
  $('.main-more a[href*=#],area[href*=#]').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var $target = $(this.hash);
      $target = $target.length && $target || $('[name=' + this.hash.slice(1) + ']');
      if ($target.length) {
        var targetOffset = $target.offset().top;
        $('html,body').animate({
          scrollTop: targetOffset
        },
        1000);
        return false;
      }
    }
  });
});


$(function(){  
var swiper = new Swiper('.cat_content .pro_scrollbar', {
	slidesPerView: 'auto',
	loop: false,
	autoplay:true,
	  navigation: {
		nextEl: ".cat_content .swiper-button-next",
		prevEl: ".cat_content .swiper-button-prev"
	  }, 
	pagination: {
          el: ".swiper-pagination",
		  clickable: true,
        },
    });
}); 




$(function(){  
var swiper = new Swiper('.case_scrollbar', {
	slidesPerView: 'auto',
	loop: false,
	autoplay:true,
	  navigation: {
		nextEl: ".case_content .swiper-button-next",
		prevEl: ".case_content .swiper-button-prev"
	  }, 
	pagination: {
          el: ".case_content .swiper-pagination",
		  clickable: true,
        },
    });
}); 


 


$(function(){  
var swiper = new Swiper('.scrollbar_4', {
	slidesPerView: 'auto',
	loop: true,
	autoplay:true,
	  navigation: {
		nextEl: ".swiper-button-next",
		prevEl: ".swiper-button-prev"
	  }, 
	pagination: {
          el: ".swiper-pagination",
		  clickable: true,
        },
    });
}); 
 


$(function(){  
var swiper = new Swiper('.scrollbar_news', {
	slidesPerView: 'auto',
	loop: false,
	autoplay:false, 
	pagination: {
          el: ".swiper-pagination",
		  clickable: true,
        },
    });
}); 
  

//number
(function(){var a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G=[].slice;q='<span class="odometer-value"></span>',n='<span class="odometer-ribbon"><span class="odometer-ribbon-inner">'+q+"</span></span>",d='<span class="odometer-digit"><span class="odometer-digit-spacer">8</span><span class="odometer-digit-inner">'+n+"</span></span>",g='<span class="odometer-formatting-mark"></span>',c="(,ddd).dd",h=/^\(?([^)]*)\)?(?:(.)(d+))?$/,i=30,f=2e3,a=20,j=2,e=.5,k=1e3/i,b=1e3/a,o="transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd",y=document.createElement("div").style,p=null!=y.transition||null!=y.webkitTransition||null!=y.mozTransition||null!=y.oTransition,w=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame,l=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver,s=function(a){var b;return b=document.createElement("div"),b.innerHTML=a,b.children[0]},v=function(a,b){return a.className=a.className.replace(new RegExp("(^| )"+b.split(" ").join("|")+"( |$)","gi")," ")},r=function(a,b){return v(a,b),a.className+=" "+b},z=function(a,b){var c;return null!=document.createEvent?(c=document.createEvent("HTMLEvents"),c.initEvent(b,!0,!0),a.dispatchEvent(c)):void 0},u=function(){var a,b;return null!=(a=null!=(b=window.performance)&&"function"==typeof b.now?b.now():void 0)?a:+new Date},x=function(a,b){return null==b&&(b=0),b?(a*=Math.pow(10,b),a+=.5,a=Math.floor(a),a/=Math.pow(10,b)):Math.round(a)},A=function(a){return 0>a?Math.ceil(a):Math.floor(a)},t=function(a){return a-x(a)},C=!1,(B=function(){var a,b,c,d,e;if(!C&&null!=window.jQuery){for(C=!0,d=["html","text"],e=[],b=0,c=d.length;c>b;b++)a=d[b],e.push(function(a){var b;return b=window.jQuery.fn[a],window.jQuery.fn[a]=function(a){var c;return null==a||null==(null!=(c=this[0])?c.odometer:void 0)?b.apply(this,arguments):this[0].odometer.update(a)}}(a));return e}})(),setTimeout(B,0),m=function(){function a(b){var c,d,e,g,h,i,l,m,n,o,p=this;if(this.options=b,this.el=this.options.el,null!=this.el.odometer)return this.el.odometer;this.el.odometer=this,m=a.options;for(d in m)g=m[d],null==this.options[d]&&(this.options[d]=g);null==(h=this.options).duration&&(h.duration=f),this.MAX_VALUES=this.options.duration/k/j|0,this.resetFormat(),this.value=this.cleanValue(null!=(n=this.options.value)?n:""),this.renderInside(),this.render();try{for(o=["innerHTML","innerText","textContent"],i=0,l=o.length;l>i;i++)e=o[i],null!=this.el[e]&&!function(a){return Object.defineProperty(p.el,a,{get:function(){var b;return"innerHTML"===a?p.inside.outerHTML:null!=(b=p.inside.innerText)?b:p.inside.textContent},set:function(a){return p.update(a)}})}(e)}catch(q){c=q,this.watchForMutations()}}return a.prototype.renderInside=function(){return this.inside=document.createElement("div"),this.inside.className="odometer-inside",this.el.innerHTML="",this.el.appendChild(this.inside)},a.prototype.watchForMutations=function(){var a,b=this;if(null!=l)try{return null==this.observer&&(this.observer=new l(function(){var a;return a=b.el.innerText,b.renderInside(),b.render(b.value),b.update(a)})),this.watchMutations=!0,this.startWatchingMutations()}catch(c){a=c}},a.prototype.startWatchingMutations=function(){return this.watchMutations?this.observer.observe(this.el,{childList:!0}):void 0},a.prototype.stopWatchingMutations=function(){var a;return null!=(a=this.observer)?a.disconnect():void 0},a.prototype.cleanValue=function(a){var b;return"string"==typeof a&&(a=a.replace(null!=(b=this.format.radix)?b:".","<radix>"),a=a.replace(/[.,]/g,""),a=a.replace("<radix>","."),a=parseFloat(a,10)||0),x(a,this.format.precision)},a.prototype.bindTransitionEnd=function(){var a,b,c,d,e,f,g=this;if(!this.transitionEndBound){for(this.transitionEndBound=!0,b=!1,e=o.split(" "),f=[],c=0,d=e.length;d>c;c++)a=e[c],f.push(this.el.addEventListener(a,function(){return b?!0:(b=!0,setTimeout(function(){return g.render(),b=!1,z(g.el,"odometerdone")},0),!0)},!1));return f}},a.prototype.resetFormat=function(){var a,b,d,e,f,g,i,j;if(a=null!=(i=this.options.format)?i:c,a||(a="d"),d=h.exec(a),!d)throw new Error("Odometer: Unparsable digit format");return j=d.slice(1,4),g=j[0],f=j[1],b=j[2],e=(null!=b?b.length:void 0)||0,this.format={repeating:g,radix:f,precision:e}},a.prototype.render=function(a){var b,c,d,e,f,g,h;for(null==a&&(a=this.value),this.stopWatchingMutations(),this.resetFormat(),this.inside.innerHTML="",f=this.options.theme,b=this.el.className.split(" "),e=[],g=0,h=b.length;h>g;g++)c=b[g],c.length&&((d=/^odometer-theme-(.+)$/.exec(c))?f=d[1]:/^odometer(-|$)/.test(c)||e.push(c));return e.push("odometer"),p||e.push("odometer-no-transitions"),e.push(f?"odometer-theme-"+f:"odometer-auto-theme"),this.el.className=e.join(" "),this.ribbons={},this.formatDigits(a),this.startWatchingMutations()},a.prototype.formatDigits=function(a){var b,c,d,e,f,g,h,i,j,k;if(this.digits=[],this.options.formatFunction)for(d=this.options.formatFunction(a),j=d.split("").reverse(),f=0,h=j.length;h>f;f++)c=j[f],c.match(/0-9/)?(b=this.renderDigit(),b.querySelector(".odometer-value").innerHTML=c,this.digits.push(b),this.insertDigit(b)):this.addSpacer(c);else for(e=!this.format.precision||!t(a)||!1,k=a.toString().split("").reverse(),g=0,i=k.length;i>g;g++)b=k[g],"."===b&&(e=!0),this.addDigit(b,e)},a.prototype.update=function(a){var b,c=this;return a=this.cleanValue(a),(b=a-this.value)?(v(this.el,"odometer-animating-up odometer-animating-down odometer-animating"),b>0?r(this.el,"odometer-animating-up"):r(this.el,"odometer-animating-down"),this.stopWatchingMutations(),this.animate(a),this.startWatchingMutations(),setTimeout(function(){return c.el.offsetHeight,r(c.el,"odometer-animating")},0),this.value=a):void 0},a.prototype.renderDigit=function(){return s(d)},a.prototype.insertDigit=function(a,b){return null!=b?this.inside.insertBefore(a,b):this.inside.children.length?this.inside.insertBefore(a,this.inside.children[0]):this.inside.appendChild(a)},a.prototype.addSpacer=function(a,b,c){var d;return d=s(g),d.innerHTML=a,c&&r(d,c),this.insertDigit(d,b)},a.prototype.addDigit=function(a,b){var c,d,e,f;if(null==b&&(b=!0),"-"===a)return this.addSpacer(a,null,"odometer-negation-mark");if("."===a)return this.addSpacer(null!=(f=this.format.radix)?f:".",null,"odometer-radix-mark");if(b)for(e=!1;;){if(!this.format.repeating.length){if(e)throw new Error("Bad odometer format without digits");this.resetFormat(),e=!0}if(c=this.format.repeating[this.format.repeating.length-1],this.format.repeating=this.format.repeating.substring(0,this.format.repeating.length-1),"d"===c)break;this.addSpacer(c)}return d=this.renderDigit(),d.querySelector(".odometer-value").innerHTML=a,this.digits.push(d),this.insertDigit(d)},a.prototype.animate=function(a){return p&&"count"!==this.options.animation?this.animateSlide(a):this.animateCount(a)},a.prototype.animateCount=function(a){var c,d,e,f,g,h=this;if(d=+a-this.value)return f=e=u(),c=this.value,(g=function(){var i,j,k;return u()-f>h.options.duration?(h.value=a,h.render(),void z(h.el,"odometerdone")):(i=u()-e,i>b&&(e=u(),k=i/h.options.duration,j=d*k,c+=j,h.render(Math.round(c))),null!=w?w(g):setTimeout(g,b))})()},a.prototype.getDigitCount=function(){var a,b,c,d,e,f;for(d=1<=arguments.length?G.call(arguments,0):[],a=e=0,f=d.length;f>e;a=++e)c=d[a],d[a]=Math.abs(c);return b=Math.max.apply(Math,d),Math.ceil(Math.log(b+1)/Math.log(10))},a.prototype.getFractionalDigitCount=function(){var a,b,c,d,e,f,g;for(e=1<=arguments.length?G.call(arguments,0):[],b=/^\-?\d*\.(\d*?)0*$/,a=f=0,g=e.length;g>f;a=++f)d=e[a],e[a]=d.toString(),c=b.exec(e[a]),e[a]=null==c?0:c[1].length;return Math.max.apply(Math,e)},a.prototype.resetDigits=function(){return this.digits=[],this.ribbons=[],this.inside.innerHTML="",this.resetFormat()},a.prototype.animateSlide=function(a){var b,c,d,f,g,h,i,j,k,l,m,n,o,p,q,s,t,u,v,w,x,y,z,B,C,D,E;if(s=this.value,j=this.getFractionalDigitCount(s,a),j&&(a*=Math.pow(10,j),s*=Math.pow(10,j)),d=a-s){for(this.bindTransitionEnd(),f=this.getDigitCount(s,a),g=[],b=0,m=v=0;f>=0?f>v:v>f;m=f>=0?++v:--v){if(t=A(s/Math.pow(10,f-m-1)),i=A(a/Math.pow(10,f-m-1)),h=i-t,Math.abs(h)>this.MAX_VALUES){for(l=[],n=h/(this.MAX_VALUES+this.MAX_VALUES*b*e),c=t;h>0&&i>c||0>h&&c>i;)l.push(Math.round(c)),c+=n;l[l.length-1]!==i&&l.push(i),b++}else l=function(){E=[];for(var a=t;i>=t?i>=a:a>=i;i>=t?a++:a--)E.push(a);return E}.apply(this);for(m=w=0,y=l.length;y>w;m=++w)k=l[m],l[m]=Math.abs(k%10);g.push(l)}for(this.resetDigits(),D=g.reverse(),m=x=0,z=D.length;z>x;m=++x)for(l=D[m],this.digits[m]||this.addDigit(" ",m>=j),null==(u=this.ribbons)[m]&&(u[m]=this.digits[m].querySelector(".odometer-ribbon-inner")),this.ribbons[m].innerHTML="",0>d&&(l=l.reverse()),o=C=0,B=l.length;B>C;o=++C)k=l[o],q=document.createElement("div"),q.className="odometer-value",q.innerHTML=k,this.ribbons[m].appendChild(q),o===l.length-1&&r(q,"odometer-last-value"),0===o&&r(q,"odometer-first-value");return 0>t&&this.addDigit("-"),p=this.inside.querySelector(".odometer-radix-mark"),null!=p&&p.parent.removeChild(p),j?this.addSpacer(this.format.radix,this.digits[j-1],"odometer-radix-mark"):void 0}},a}(),m.options=null!=(E=window.odometerOptions)?E:{},setTimeout(function(){var a,b,c,d,e;if(window.odometerOptions){d=window.odometerOptions,e=[];for(a in d)b=d[a],e.push(null!=(c=m.options)[a]?(c=m.options)[a]:c[a]=b);return e}},0),m.init=function(){var a,b,c,d,e,f;if(null!=document.querySelectorAll){for(b=document.querySelectorAll(m.options.selector||".odometer"),f=[],c=0,d=b.length;d>c;c++)a=b[c],f.push(a.odometer=new m({el:a,value:null!=(e=a.innerText)?e:a.textContent}));return f}},null!=(null!=(F=document.documentElement)?F.doScroll:void 0)&&null!=document.createEventObject?(D=document.onreadystatechange,document.onreadystatechange=function(){return"complete"===document.readyState&&m.options.auto!==!1&&m.init(),null!=D?D.apply(this,arguments):void 0}):document.addEventListener("DOMContentLoaded",function(){return m.options.auto!==!1?m.init():void 0},!1),"function"==typeof define&&define.amd?define(["jquery"],function(){return m}):"undefined"!=typeof exports&&null!==exports?module.exports=m:window.Odometer=m}).call(this);


(function () {
  // COUNTER
  $(document).scroll(function () {
    $('.odometer').each(function () {
      var parent_section_postion = $(this).closest('.number_content').position();
      var parent_section_top = parent_section_postion.top;
      if ($(document).scrollTop() > parent_section_top - 500) {
        if ($(this).data('status') == 'yes') {
          $(this).html($(this).data('count'));
          $(this).data('status', 'no');
        }
      }
    });
  });
	
})(jQuery);


/*select*/
( function( window ) { 
'use strict'; 
// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
} 
// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
} 
function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
} 
var classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
}; 
// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else {
  // browser global
  window.classie = classie;
} 
})( window ); 
var ModalEffects = (function() { 
	function init() { 
		var overlay = document.querySelector( '.select-overlay' ); 
		[].slice.call( document.querySelectorAll( '.select-trigger' ) ).forEach( function( el, i ) { 
			var modal = document.querySelector( '#' + el.getAttribute( 'data-modal' ) ),
				close = modal.querySelector( '.select-close' ); 
			function removeModal( hasPerspective ) {
				classie.remove( modal, 'select-show' ); 
				if( hasPerspective ) {
					classie.remove( document.documentElement, 'select-perspective' );
				}
			} 
			function removeModalHandler() {
				removeModal( classie.has( el, 'select-setperspective' ) ); 
			} 
			el.addEventListener( 'click', function( ev ) {
				classie.add( modal, 'select-show' );
				overlay.removeEventListener( 'click', removeModalHandler );
				overlay.addEventListener( 'click', removeModalHandler );

				if( classie.has( el, 'select-setperspective' ) ) {
					setTimeout( function() {
						classie.add( document.documentElement, 'select-perspective' );
					}, 25 );
				}
			});

			close.addEventListener( 'click', function( ev ) {
				ev.stopPropagation();
				removeModalHandler();
			});

		} );

	}

	init();
})();


//tab
window.onload = function() {
    var tabsSwiper = new Swiper('#tabs-container', {
        speed: 500, 
        scrollbar: {
          el: "#tabs-container .swiper-scrollbar", 
        },
        on: {
            slideChangeTransitionStart: function() {
                $(".tabs .active").removeClass('active');
                $(".tabs a").eq(this.activeIndex).addClass('active');
            }
        }
    })
    $(".tabs a").on('click', function(e) {
        e.preventDefault()
        $(".tabs .active").removeClass('active')
        $(this).addClass('active')
        tabsSwiper.slideTo($(this).index())
    })
}


 



 



 










