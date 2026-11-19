jQuery(function ($) {
  'use strict';

  /* 1. 合并全局滚动监听：顶部导航收缩 + 返回顶部 + 右侧悬浮联系栏 */
  var $header = $('header');
  var $backTop = $('.back_top');
  var $fixedContact = $('.fixed-contact');
  var $carouselBar = $('.page-header-bar');
  var isHeaderSmall = false;
  var isBackTopShown = false;
  var isContactShown = false;
  var scrollTicking = false;

  function onScrollUpdate() {
    scrollTicking = false;
    var top = window.pageYOffset || document.documentElement.scrollTop || 0;

    if ($header.length) {
      var shouldBeSmall = top > 20;
      if (shouldBeSmall !== isHeaderSmall) {
        isHeaderSmall = shouldBeSmall;
        $header.toggleClass('small', shouldBeSmall).toggleClass('large', !shouldBeSmall);
      }
    }

    if ($backTop.length) {
      var shouldShowTop = top > 300;
      if (shouldShowTop !== isBackTopShown) {
        isBackTopShown = shouldShowTop;
        shouldShowTop ? $backTop.stop(true, true).fadeIn(300) : $backTop.stop(true, true).fadeOut(300);
      }
    }

    if ($fixedContact.length && window.innerWidth > 992) {
      var shouldShowContact = top > window.innerHeight / 2;
      if (shouldShowContact !== isContactShown) {
        isContactShown = shouldShowContact;
        $fixedContact.toggleClass('show', shouldShowContact);
        if ($carouselBar.length) $carouselBar.toggleClass('active', shouldShowContact);
      }
    }
  }

  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      scrollTicking = true;
      window.requestAnimationFrame(onScrollUpdate);
    }
  }, { passive: true });
  onScrollUpdate();

  $backTop.on('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  $fixedContact.hover(
    function () { $(this).addClass('active'); },
    function () { $(this).removeClass('active'); }
  );

  /* 2. 顶部搜索框展开/收起 */
  $('.attr-nav .search').on('click', function (e) {
    e.preventDefault();
    $('.top-search').slideToggle(220);
    $('.top_overly').fadeIn(100);
  });
  $('.input-group-addon.close-search').on('click', function () {
    $('.top-search').slideUp(220);
    $('.top_overly').fadeOut(100);
  });
  $('.search_section .mob_search').on('click', function (e) {
    e.preventDefault();
    $('.search_input').css({ height: '160px' });
  });
  $('.close-search').on('click', function () {
    $('.search_input').css({ height: '0' });
  });

  /* 3. 右下角在线询盘浮窗 */
  if ($('.animated-circles').length) {
    setInterval(function () {
      $('.animated-circles').toggleClass('animated');
    }, 3000);
  }

  $('#floatShow').on('click', function (e) {
    e.preventDefault();
    $('#onlineService').stop(true, true).animate({ height: 'show', opacity: 'show' }, 'normal');
    $('#floatShow').css({ display: 'none', opacity: 0 });
    $('#floatHide').css({ display: 'block', opacity: 1 });
  });

  $('#floatHide').on('click', function (e) {
    e.preventDefault();
    $('#onlineService').stop(true, true).animate({ height: 'hide', opacity: 'hide' }, 'normal');
    $('#floatShow').css({ display: 'block', opacity: 1 });
    $('#floatHide').css({ display: 'none', opacity: 0 });
  });

  /* 4. FAQ 折叠面板（仅存在 .accordion 时运行） */
  var $accordions = $('.accordion');
  if ($accordions.length) {
    $accordions.find('> li:eq(0) a').addClass('active').next().slideDown();
    $accordions.on('click', 'a', function (e) {
      e.preventDefault();
      var $this = $(this);
      var $dropDown = $this.closest('li').find('p');
      $this.closest('.accordion').find('p').not($dropDown).slideUp();
      if ($this.hasClass('active')) {
        $this.removeClass('active');
      } else {
        $this.closest('.accordion').find('a.active').removeClass('active');
        $this.addClass('active');
      }
      $dropDown.stop(false, true).slideToggle();
    });
  }

  /* 5. 页内锚点平滑滚动（修复 jQuery 3 属性选择器引号报错） */
  $('.main-more a[href*="#"], area[href*="#"]').on('click', function () {
    if (
      location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') &&
      location.hostname === this.hostname &&
      this.hash.length > 1
    ) {
      var $target = $(this.hash);
      $target = $target.length ? $target : $('[name="' + this.hash.slice(1) + '"]');
      if ($target.length) {
        $('html, body').animate({ scrollTop: $target.offset().top }, 800);
        return false;
      }
    }
  });

  /* 6. 按需初始化 Swiper（仅当页面存在对应容器时才创建实例） */
  if (typeof Swiper === 'undefined') return;

  if (document.querySelector('.swiper-banner')) {
    var interleaveOffset = 0.5;
    new Swiper('.swiper-banner', {
      loop: true,
      speed: 900,
      autoplay: { delay: 5000, disableOnInteraction: false },
      grabCursor: true,
      watchSlidesProgress: true,
      keyboard: { enabled: true },
      pagination: {
        el: '.index_banner .swiper-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.index_banner .swiper-button-next',
        prevEl: '.index_banner .swiper-button-prev'
      },
      on: {
        progress: function (swiper) {
          for (var i = 0; i < swiper.slides.length; i++) {
            var inner = swiper.slides[i].querySelector('.slide-inner');
            if (!inner) continue;
            var slideProgress = swiper.slides[i].progress;
            var innerTranslate = slideProgress * (swiper.width * interleaveOffset);
            inner.style.transform = 'translate3d(' + innerTranslate + 'px, 0, 0)';
          }
        },
        touchStart: function (swiper) {
          for (var i = 0; i < swiper.slides.length; i++) {
            swiper.slides[i].style.transition = '';
          }
        },
        setTransition: function (swiper, speed) {
          for (var i = 0; i < swiper.slides.length; i++) {
            swiper.slides[i].style.transition = speed + 'ms';
            var inner = swiper.slides[i].querySelector('.slide-inner');
            if (inner) inner.style.transition = speed + 'ms';
          }
        }
      }
    });
  }

  if (document.querySelector('.cat_content .pro_scrollbar')) {
    new Swiper('.cat_content .pro_scrollbar', {
      slidesPerView: 'auto',
      loop: false,
      autoplay: { delay: 4500, disableOnInteraction: false },
      navigation: {
        nextEl: '.cat_content .swiper-button-next',
        prevEl: '.cat_content .swiper-button-prev'
      },
      pagination: {
        el: '.cat_content .swiper-pagination',
        clickable: true
      }
    });
  }

  if (document.querySelector('.case_scrollbar')) {
    new Swiper('.case_scrollbar', {
      slidesPerView: 'auto',
      loop: false,
      autoplay: { delay: 5000, disableOnInteraction: false },
      navigation: {
        nextEl: '.case_content .swiper-button-next',
        prevEl: '.case_content .swiper-button-prev'
      },
      pagination: {
        el: '.case_content .swiper-pagination',
        clickable: true
      }
    });
  }

  if (document.querySelector('.scrollbar_4')) {
    new Swiper('.scrollbar_4', {
      slidesPerView: 'auto',
      loop: true,
      autoplay: { delay: 4500, disableOnInteraction: false },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      }
    });
  }

  if (document.querySelector('.scrollbar_news')) {
    new Swiper('.scrollbar_news', {
      slidesPerView: 'auto',
      loop: false,
      autoplay: false,
      pagination: {
        el: '.news_content .swiper-pagination',
        clickable: true
      }
    });
  }

  if (document.querySelector('#tabs-container')) {
    var tabsSwiper = new Swiper('#tabs-container', {
      speed: 500,
      scrollbar: { el: '#tabs-container .swiper-scrollbar' },
      on: {
        slideChangeTransitionStart: function () {
          $('.tabs .active').removeClass('active');
          $('.tabs a').eq(this.activeIndex).addClass('active');
        }
      }
    });
    $('.tabs a').on('click', function (e) {
      e.preventDefault();
      $('.tabs .active').removeClass('active');
      $(this).addClass('active');
      tabsSwiper.slideTo($(this).index());
    });
  }
});