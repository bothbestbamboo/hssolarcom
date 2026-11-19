$(function(){
    
    function getQueryVariable(variable){
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(false);
    }

    function scrollTo(id) {
        var d = $(id).offset().top - $('.header').height();
        $('html,body').stop().animate({
                scrollTop : d
        }, 'slow');
    }


    // Header
    (function header(){
        var $header = $('.header'),
        $body = $('body');
        function headerHeight() {
            var winSTop = $(window).scrollTop();
            if (winSTop > 0) {
                $body.addClass('fixed-menu');
            }else {
                $body.removeClass('fixed-menu');
            }
        }
        $(window).on('scroll', function() {
            headerHeight();
        }).trigger('scroll');

        $header.on('mouseenter', function() {
            $body.addClass('hover-menu');
        });
        $header.on('mouseleave', function() {
            $body.removeClass('hover-menu');
        });


        var tcloud = {};
        $('[data-sub]').on('mouseenter', function() {
            var nav = $(this).attr('data-sub');
            clearTimeout(tcloud['timer_'+nav]);
            tcloud['timer_'+nav] = setTimeout(function(){
                $('[data-sub]').each(function() {
                    if (nav == $(this).attr('data-sub')) {
                        $(this).addClass('active');
                        $body.addClass('hover-menu');
                    } else {
                        $(this).removeClass('active');
                    }
                })
            }, 10);
        });
        $('[data-sub]').on('mouseleave', function() {
            var nav = $(this).attr('data-sub');
            clearTimeout(tcloud['timer_'+nav]);
            tcloud['timer_'+nav] = setTimeout(function(){
                $('[data-sub]').removeClass('active');
            }, 10);
        });

        var imgurl = $('.pmc-link').eq(0).attr('data-img');
        $('.js-pmc-img').attr('src', imgurl);
        var imgPlaceholder = $('.js-pmc-img').attr('data-placeholder');

        $('.pm-link').on('mouseenter', function(){
            $(this).addClass('current').siblings().removeClass('current');
            var id = $(this).attr('data-id');
            $('.pmc-item').removeClass('active');
            if ($('.pm-sub-'+id).length) {
                $('.pm-sub-'+id).addClass('active');
                var img = $('.pm-sub-'+id).find('.pmc-link').eq(0).attr('data-img');
                $('.pm-sub-'+id).find('.pmc-link').removeClass('current');
                $('.pm-sub-'+id).find('.pmc-link').eq(0).addClass('current');
                $('.js-pmc-img').attr('src', img);
                $('.js-product-menu').removeClass('no-border');
            } else {
                $('.js-pmc-img').attr('src', imgPlaceholder);
                $('.js-product-menu').addClass('no-border');
            }
        });
        $('.pmc-link').on('mouseenter', function(){
            var img = $(this).attr('data-img');
            $(this).addClass('current').siblings().removeClass('current');
            $('.js-pmc-img').attr('src', img);
        });

        // Mobile Menu
        $('.js-btn-menu').on('click', function(){
            if ($body.hasClass('menu-open')) {
                $('.m-submenu').removeClass('active');
                $body.removeClass('menu-open');
            } else {
                $body.addClass('menu-open');
            }
            
        });

        $('.js-m-menu-link').on('click', function() {
            var id = $(this).attr('data-id');
            if ($(this).hasClass('has-sub')) {
                $('.m-submenu').addClass('active');
                $('.m-submenu-content').removeClass('active');
                $('.m-submenu-'+id).addClass('active');
            }
        });

        $('.m-submenu-header').on('click', function(){
            $('.m-submenu').removeClass('active');
        });


    })();

    // Footer
    (function footer(){
        // goTop
        $('.js-goTop').on('click', function(){
            if ($('body').hasClass('page-index')) {
                console.log('jj');
                fullpage_api.moveTo(1);
            } else {
                $('html,body').stop().animate({
                        scrollTop : 0
                }, 'slow');
            }

        });

        $(window).on('load', function(){
            var id = getQueryVariable('s');
            if (id != '') {
                scrollTo('#'+id);
            }
        });
    })();

    // Index 
    (function index(){
        var isLoad360 = true;
        var isAniNum = false;
        var product360 = null;

        var threeObj = [
            {
                name: 'CLD',
                floder: 'cld',
                prefix: 'CLD27_20200525_'
            },
            {
                name: 'E',
                floder: 'e',
                prefix: 'E_'
            },
            {
                name: 'CV',
                floder: 'cv',
                prefix: 'CV_'
            },
            {
                name: 'MXC',
                floder: 'mxc',
                prefix: 'MXC_'
            }
        ]

        function threejsCircle() {
            var scene, camera, renderer;
        
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 1000);
            camera.position.set(150, 20, 150);
            camera.lookAt(new THREE.Vector3(0,0,0)); 
            scene.add(camera);

            var r = 130;
            
            for (var i = 0; i < 280; i++) {
                var size = .15;
                // size = size + i*.01;
                var geometry = new THREE.SphereGeometry(size, 32, 32 );
                var material = new THREE.MeshBasicMaterial( {color: 0xaaaaaa} );
                var sphere = new THREE.Mesh( geometry, material );

                var angle = 2*Math.PI*i/280;
                var x = Math.cos(angle)*r,
                    z = Math.sin(angle)*r;
                sphere.position.set(x, 0, z);

                scene.add(sphere);
            }

            renderer = new THREE.WebGLRenderer({alpha: false, antialias: true});
            renderer.setSize($('.led-box').width(), $('.led-box').outerHeight());
            renderer.setClearColor(0xF5F7F9);
            // renderer.setClearAlpha(0);
            document.getElementById('ledCanvas').appendChild(renderer.domElement);


            var controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableZoom = false;
            controls.enableKeys = false;
            controls.enablePan = false;
            controls.enableRotate = true;
            controls.enableDamping = true;
            controls.dampingFactor = .1;
            controls.rotateSpeed = .25;
            controls.minPolarAngle = Math.PI/2.36;
            controls.maxPolarAngle = Math.PI/2.36;


            // renderer.render(scene, camera);
            var t1 = 0;
            function render() {
                requestAnimationFrame(render)
                // box.rotation.x += .01;
                // box.rotation.y += .01;

                controls.update();
                var angle = controls.getAzimuthalAngle()
                // console.log(tangle);

                var t = parseInt(angle/(Math.PI/180)/10);
                if (t < 0) {
                    t = 18 + (18 + t);
                }
                if (t != t1 && product360) {
                    product360.gotoAndPlay(t);
                }
                t1 = t;
                
                renderer.render(scene, camera)
            }

            render();

            window.addEventListener('resize', function() {
                var ledW = $('.led-box').width(),
                    ledH = $('.led-box').outerHeight();
                camera.aspect = ledW / ledH;
                camera.updateProjectionMatrix();
                renderer.setSize(ledW, ledH);
            }, false);
        }

        function load360(obj) {
            var f = obj.floder,
                pre = obj.prefix;
            $('.threesixty').html('<div class="spinner"><span>0%</span></div><ol class="threesixty_images"></ol>');
            product360 = $('.threesixty').ThreeSixty({
                totalFrames: 36,
                endFrame: 24,
                currentFrame: 1,
                drag: true,
                imgList: '.threesixty_images',
                progress: '.spinner',
                imagePath:'/themes/en/default/upload/360/'+f+'/',
                filePrefix: pre,
                ext: '.png',
                height: 640,
                width: 960,
                navigation: true,
                disableSpin: false,
                navigation: false,
                onReady: function () {
                    // threejsCircle()
                }
            });
        }

        var slick360t = $('.js-slick-pro360t').slick({
            arrows: true,
            centerMode: true,
            variableWidth: true,
            infinite: true,
            initialSlide: 2,
            prevArrow: '.js-pro360-left',
            nextArrow: '.js-pro360-right'
        });

        slick360t.on('beforeChange', function(event, slick, currentSlide, nextSlide){
            // $('.ib-pager-item').removeClass('current');
            // console.log('tttt', threeObj[nextSlide]);
            load360(threeObj[nextSlide]);
            $('.js-360-bg-txt').html(threeObj[nextSlide].name);
        });

        if ($('.fullpage').length) {
            $('.js-goTop').addClass('d-none');
            new fullpage('#fullPage', {
                scrollBar: false,
                scrollOverflow: true,
                responsiveWidth: 1200,
                responsiveHeight: 680,
                normalScrollElements: '.section-cases, .section-footer',
                onLeave: function(origin, destination, direction){
                    console.log(direction);
                    var leavingSection = this;
                    if (origin.index == 0) {
                        $('.header').addClass('hide');
                        $('.js-goTop').removeClass('d-none');
                    }
                    if (destination.index == 0) {
                        $('.header').removeClass('hide');
                        $('.js-goTop').addClass('d-none');
                    }
                    if (destination.index == 2) {
                        if (!isAniNum) {
                            isAniNum = true;
                            $('.animNum').each(function(){
                                $(this).prop('Counter',0).animate({
                                    Counter: $(this).text()
                                },{
                                    duration: 1000,
                                    easing: 'swing',
                                    step: function (now){
                                        $(this).text(Math.ceil(now));
                                    }
                                });
                            });
                        }
                    }
                    if (destination.index == 3) {
                        // threejsCircle();
                        
                        if (isLoad360) {
                            load360(threeObj[2]);
                            isLoad360 = false;
                        }
                        
                    }
                }
            });

            var isSectionScroll = true;
            $('.section-cases').on('mousewheel', function(event) {
                var sH = $(this).outerHeight(),
                    wH = $(window).height();
                if (event.deltaY < 0 && isSectionScroll) {
                    isSectionScroll = false;
                    if ($(this).hasClass('scroll')) {
                        fullpage_api.moveSectionDown();
                    } else {
                        isSectionScroll = false;
                        $(this).css({
                            transform: 'translate3d(0, '+(wH-sH)+'px, 0)'
                        })
                        $(this).addClass('scroll');
                    }
                    setTimeout(function(){
                        isSectionScroll = true;
                    }, 700)
                    
                }

                if (event.deltaY > 0 && isSectionScroll) {
                    isSectionScroll = false;
                    if ($(this).hasClass('scroll')) {
                        $(this).css({
                            transform: 'translate3d(0, 0, 0)'
                        })
                        $(this).removeClass('scroll');
                        setTimeout(function(){
                            isSectionScroll = true;
                        }, 700)
                    } else {
                        fullpage_api.moveSectionUp();
                    }

                    setTimeout(function(){
                        isSectionScroll = true;
                    }, 700)
                    
                }

            });

            $('.section-footer').on('mousewheel', function(event) {
                var sH = $(this).outerHeight(),
                    wH = $(window).height();
                if (event.deltaY < 0 && isSectionScroll) {
                    isSectionScroll = false;
                    if ($(this).hasClass('scroll')) {
                        // fullpage_api.moveSectionDown();
                    } else {
                        isSectionScroll = false;
                        $(this).css({
                            transform: 'translate3d(0, '+(wH-sH)+'px, 0)'
                        })
                        $(this).addClass('scroll');
                    }
                    setTimeout(function(){
                        isSectionScroll = true;
                    }, 700)
                    
                }

                if (event.deltaY > 0 && isSectionScroll) {
                    isSectionScroll = false;
                    if ($(this).hasClass('scroll')) {
                        $(this).css({
                            transform: 'translate3d(0, 0, 0)'
                        })
                        $(this).removeClass('scroll');
                        setTimeout(function(){
                            isSectionScroll = true;
                        }, 700)
                    } else {
                        fullpage_api.moveSectionUp();
                    }

                    setTimeout(function(){
                        isSectionScroll = true;
                    }, 700)
                    
                }

            });

            $(window).on('load', function(){
                this.setTimeout(function(){
                    threejsCircle()
                }, 10000)
            });
            // threejsCircle();
            // Index Banner
            var slickIb = $('.js-slick-ib').slick({
                arrows: false,
                fade: true,
                autoplay: true,
                autoplaySpeed: 5000,
                speed: 0,
                cssEase: 'linear',
                pauseOnHover: false
            });
            slickIb.on('beforeChange', function(event, slick, currentSlide, nextSlide){
                $('.ib-pager-item').removeClass('current');
                setTimeout(function(){
                    $('.ib-pager-item').eq(nextSlide).addClass('current');
                }, 300);
            });
            $('.js-ib-pager').on('click', function() {
                slickIb.slick('slickGoTo', $(this).index());
            });

            
            var winW = $(window).width();
            if (winW > 750) {
                $('.js-banner-img').each(function() {
                    $(this).attr('src', $(this).attr('data-pc'))
                });
            } else {
                $('.js-banner-img').each(function() {
                    $(this).attr('src', $(this).attr('data-m'))
                });
            }

            // Index Map
            $('.office-item').each(function(index, item) {
            
                var left = parseInt($(item).attr('data-left')),
                    top = parseInt($(item).attr('data-top'));
                $(this).css({
                    top: top/7.5 + '%',
                    left: left/13.12 + '%'
                });
    
                (function(num) {
                    setTimeout(function(){
                        $(item).addClass('current');
                    }, index*250)
                })(index, item)
                
            });
    
            $('.office-item').on('mouseenter', function(){
                $(this).addClass('current').siblings().removeClass('current')
            });
            $('.office-item').on('mouseleave', function(){
                $('.office-item').removeClass('current')
                $('.office-item').each(function(index, item) {
                    (function(num) {
                        setTimeout(function(){
                            $(item).addClass('current');
                        }, index*250)
                    })(index, item)
                });
            });


            $('.office-item').on('click', function(){
                var winW = $(window).width();
                if (winW < 1025) {
                    var info = $(this).find('.office-item__info').html();
                    $('.js-office-minfo').html(info);
                    $('.js-office-m').fadeIn();
                }
            });
            $('.js-office-m').on('click', function(){
                $('.js-office-m').fadeOut();
            })
        }

        

    })();

    
    (function about(){

        // slick about-honor
        if ($('.js-slcik-honor').length > 0) {
            var slickHonor = $('.js-slcik-honor').slick({
                slidesToShow: 5,
                slidesToScroll: 5,
                arrows: false,
                responsive: [
                    {
                        breakpoint: 1400,
                        settings: {
                            slidesToShow: 4,
                            slidesToScroll: 4
                        }
                    },
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2
                        }
                    }
                ]
            });

            
        }
        
        // About History
        if ($('.js-history-main').length) {
            var pathPadding = ($(window).width() - (374*3) - 400) / 4;
            $('.path-item').css({
                'padding-left': pathPadding,
                'padding-right': pathPadding
            });
            var slickPath = $('.js-slick-path').slick({
                arrows: false,
                centerMode: true,
                variableWidth: true,
                infinite: false,
                autoplay: true,
                autoplaySpeed: 5000,
                pauseOnHover: false,
                responsive: [
                    {
                        breakpoint: 1280,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            variableWidth: false,
                            centerMode: false
                        }
                    }
                ]
            });
            slickPath.on('beforeChange', function(event, slick, currentSlide, nextSlide){
                hMove(nextSlide)
            });

            var len = $('.history-item').length;
            var hbWidth = $('.history-body').width();

            var currentIndex = 0;

            var max = parseInt(hbWidth/180);
            var itemW = parseInt(hbWidth/max);
            $('.history-item').css({
                width: itemW
            });
            $('.history-list').css({
                width: itemW*len
            });
            $('.history-progress').css({
                width: itemW/2
            });
            $('.history-item').on('mouseenter', function() {
                currentIndex = $(this).index();
                hMove(currentIndex)
                slickPath.slick('slickGoTo', currentIndex)
            });

            function hMove(index) {
                var tLeft = parseInt($('.history-list').attr('data-left'));
                if ((itemW*(index+1) + tLeft) > hbWidth) {
                    $('.history-list').css({
                        transform: 'translateX('+(-(index+1-max)*itemW)+'px)'
                    })
                    $('.history-list').attr('data-left', -(index+1-max)*itemW)
                }

                if ((itemW*index + tLeft) < 0) {
                    $('.history-list').css({
                        transform: 'translateX('+(-(itemW*index)+'px)')
                    })
                    $('.history-list').attr('data-left', (-itemW*index))
                }

                
                $('.history-item').eq(index).addClass('current').siblings().removeClass('current')
                var w = (index+.5) * parseInt(hbWidth/max);
                $('.history-progress').css({
                    width: w
                });
                $('.about-devlpment__bg span').css({
                    transform: 'rotate('+(45*index)+'deg)'
                });

            }
            $('.js-history-next').on('click', function(){
                // console.log(currentIndex, len);
                if (currentIndex < len-1) {
                    currentIndex++
                    hMove(currentIndex)
                    slickPath.slick('slickGoTo', currentIndex)
                }
            });
            $('.js-history-prev').on('click', function(){
                if (currentIndex > 0) {
                    currentIndex--
                    hMove(currentIndex)
                    slickPath.slick('slickGoTo', currentIndex)
                }
            });

        }

    })();

    (function product(){


        if ($('.js-slick-prod-img').length) {
            var slickProdImg = $('.js-slick-prod-img').slick({
                dots: true,
                autoplay: true,
                arrows: false,
                dotsClass: 'banner-dots'
            });
        }

        if ($('.js-3d-product').length) {
            var $box = $('.js-3d-product');
            var obj = $box.attr('data-obj'),
                mtl = $box.attr('data-mtl'),
                objSize = parseInt($box.attr('data-size'));

                console.log(obj, mtl)
            
                var camera, scene, renderer;

                // 创建场景
                scene = new THREE.Scene();
                scene.background = new THREE.Color(0xffffff);
                // scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000);
            
                // 创建相机(远景相机)
                

                camera = new THREE.PerspectiveCamera(45, $box.width() / $box.height(), .1, 2000);
                camera.position.set(300, 50, 700);
        
                // 渲染器
                renderer = new THREE.WebGLRenderer({
                    antialias: true
                });
                renderer.setSize($box.width(), $box.height());
                document.getElementById('objCanvas').appendChild(renderer.domElement);
        
                // 显示坐标轴
                var controls = new THREE.OrbitControls(camera, renderer.domElement);
        
                // 增加环境光
                var ambientLight = new THREE.AmbientLight(0xffffff);
                scene.add(ambientLight);
    
        
                // 增加平行光
                var dLight = new THREE.DirectionalLight(0xffffff);
                dLight.position.set(2000, 2000, 0);
                dLight.castShadow = true;
                scene.add(dLight);
        
        
                var mtlLoader = new THREE.MTLLoader();
    
                mtlLoader.load(mtl, function (material) {
                    
                    var objLoader = new THREE.OBJLoader();
                    objLoader.setMaterials(material);
                    objLoader.load(
                        // resource URL
                        obj,
                        function ( object ) {
                            // $('.js-obj-progress').addClass('d-none');
                            $('.obj-loading').fadeOut(300);
                            scene.add( object );
                        },
                        // called when loading is in progresses
                        function ( xhr ) {

                            // console.log(xhr);
                            // console.log(xhr.loaded);
                            // console.log( ( xhr.loaded / objSize * 100 ) + '% loaded' );
                            $('.js-obj-progress').css({
                                'width': (xhr.loaded / objSize * 100) + '%'
                            })
                            $('.obj-progress-txt').html(parseInt(xhr.loaded / objSize * 100)+'%');
                        },
                        function ( error ) {
                            console.log( 'An error happened' );
                        }
                    );
        
                });
                
            
                // 渲染场景
                function render() {
                    requestAnimationFrame(render);
                    controls.update();
                    renderer.render(scene, camera);
                }
                render();
        }

    })();

    (function layerVideo(){
        if ($('.js-video').length) {
            $('.js-video').on('click', function(){
                var poster = $(this).attr('data-poster'),
                    title = $(this).attr('data-title'),
                    source = $(this).attr('data-source')
                var videoHTML = '<div class="layer-video"><div class="layer-close icon-close js-layer-close"></div><div class="layer-vmain"><div class="layer-video-box js-video-box img-box"><video autoplay webkit-playsinline="true" x5-video-player-type="”h5″" playsinline="true" controlslist="nodownload" loop poster="'+poster+'"><source src="'+source+'" type="video/mp4"></div><div class="layer-video-title mt-30">'+title+'' +'</div></div></div>';
                $('body').append(videoHTML);
                $('.layer-video').addClass('show');
            });
            $(document).on('click', '.js-video-box', function(){
                var video = $(this).find('video')[0];
                if ($(this).hasClass('play')) {
                    $(this).removeClass('play');
                    video.pause();
                } else {
                    $(this).addClass('play');
                    video.play();
                }
            });
            $(document).on('click', '.js-layer-close', function(){
                $('.layer-video').remove();
            });
        }
    })();

    // Fixed Link Tab
    (function fixedTab(){
        var tabBox = $('.js-page-nav-box');

        if (tabBox.length) {
            var tabTop = tabBox.offset().top;
            var tab = $('.js-page-nav');
            if (tab.length) {
                $(window).on('scroll', function(e){
                
                    var headerH = $('.header').outerHeight();
                    // console.log(headerH)
        
                    if ($(window).scrollTop() > (tabTop - headerH)) {
                        tab.addClass('fixed');
                    } else {
                        tab.removeClass('fixed');
                    }
        
        
                    $('.nav-page').each(function(){
                        var _h = $(this).offset().top - headerH - 60;
                        var _maxH = $(this).offset().top + $(this).height() - headerH - 60;
                        var _id = $(this).attr('id');
                        if ($(window).scrollTop() > _h && $(window).scrollTop() < _maxH) {
                            // console.log(_id);
                            $('.pnav-item').removeClass('current');
                            $('.pnav-link').each(function() {
                                if ($(this).attr('data-href') == '#'+_id) {
                                    $(this).parent().addClass('current');
                                }
                            });
                            // $('.js-about-tab a[href=#'+_id+']').addClass('current');
                        }
                    });
        
        
                });
            }
            

            $('.pnav-link,.header-pnav-link').on('click', function(e){
                // e.preventDefault();
                var id = $(this).attr("data-href");
                // $('.js-about-tab a').removeClass('current');
                // $(this).addClass('current');
                if (id) {
                    var bodyScroll = $(id).offset().top - $('.header').height() - 60;
                    $('html,body').stop().animate({
                            scrollTop : bodyScroll
                    }, 'slow');
                }
                
            });
        }
        

    })();

 
  

});