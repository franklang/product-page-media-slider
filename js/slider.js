// Accessing bxslider's slider object inside its “onSliderLoad” callback returns undefined
    // https://github.com/stevenwanderski/bxslider-4/issues/475
    // https://codepen.io/eniosan/pen/XJxMNL

// bxslider slider - Hover on pager
    // https://stackoverflow.com/questions/28110510/bxslider-slider-hover-on-pager
    // http://jsfiddle.net/3b3hkb5m/

var ACC = ACC || {}; // make sure ACC is available

ACC.slider = {

    _autoload: [
        ["init", $(".bxslider").length > 0]
       ,"getViewportHeight"
       ,"handleModal"
       // Uncomment line below to show debug info
       ,["debugInfo", $(".bxslider").length > 0]
    ],

    newIndex: null,
    $thumb: $('.js-bxslider-thumb'),
    $main: $('.js-bxslider-main'),
    thumbSlideCount: null,
    mainSlideCount: null,
    triggerPrevValues: null,
    triggerNextValues: null,
    sliderThumb: null,
        sliderThumbMinSlides: 6,
        sliderThumbModalMinSlides: 9,
    sliderMain: null,

    sliderConfig:{
        "thumb":{
            mode: 'vertical',
            slideWidth: 300,
            minSlides: 0,
            slideMargin: 10,
            infiniteLoop: false,
            hideControlOnEnd: true,
            pager: false
        },
        "main":{
            pagerCustom: '.js-bxslider-thumb',
            onSlideBefore: function($slideElement, oldIndex, newIndex){
                ACC.slider.newIndex = newIndex;
            },
            onSlideNext: function($slideElement, oldIndex, newIndex){
                if(ACC.slider.triggerNextValues.indexOf(newIndex) !== -1){
                    ACC.slider.$thumb.closest('.bx-wrapper').children('.bx-controls').find('.bx-next').click();
                }
                else if(newIndex == 0){
                  ACC.slider.sliderThumb.goToSlide(0);
                }
            },
            onSlidePrev: function($slideElement, oldIndex, newIndex){
                if(ACC.slider.triggerPrevValues.indexOf(newIndex) !== -1){
                    ACC.slider.$thumb.closest('.bx-wrapper').children('.bx-controls').find('.bx-prev').click();
                }
                else if(newIndex == ACC.slider.mainSlideCount -1){
                  ACC.slider.sliderConfig.thumb.startSlide = ACC.slider.thumbSlideCount -1;
                  ACC.slider.sliderThumb.reloadSlider(ACC.slider.sliderConfig.thumb);
                }
            }
        }
    },

    init: function(){
        ACC.slider.sliderConfig.thumb.minSlides = ACC.slider.sliderThumbMinSlides;

        this.sliderThumb = $('.js-bxslider-thumb').bxSlider(this.sliderConfig.thumb);
        this.sliderMain = $('.js-bxslider-main').bxSlider(this.sliderConfig.main);

        this.hoverIntent();
        this.handlePrevNextControls();
    },

    onMouseOverThumb: function(){
        this.newIndex = $($(this).find('a')[0]).attr('data-slide-index');
        $(this).children('a').click();
    },

    hoverIntent: function(){
        this.$thumb.hoverIntent({
            over: this.onMouseOverThumb,
            selector: 'li',
            sensivity: 12
        });
    },

    handlePrevNextControls: function(){
        this.mainSlideCount = this.sliderMain.getSlideCount();
        this.thumbSlideCount = Math.ceil(this.mainSlideCount / this.sliderConfig.thumb.minSlides);

        var triggerNextValues = new Array(this.thumbSlideCount).fill(null).map((u, i) => i);
        for (var i = 0; i < triggerNextValues.length; i++) {
          triggerNextValues[i] *= this.sliderConfig.thumb.minSlides;
        }
        var triggerPrevValues = triggerNextValues.map(function(value){
            return value -1;
        });
        triggerPrevValues[0] = 0;
        triggerNextValues.splice(0, 1);
        this.triggerNextValues = triggerNextValues;
        this.triggerPrevValues = triggerPrevValues;
    },

    getViewportHeight: function(){
        var viewportHeight = $(window).height();
    },

    onWindowResize: function(){
        $(window).on('resize', function(){
            var viewportHeight = $(window).height();
            console.log(viewportHeight);
        });
    },

    handleModal: function(){
        $('#zoomModal').on('shown.bs.modal', function(){
            $('#triggerModal').hide();
            $('#sliders').appendTo('#modalSliders');

            ACC.slider.sliderConfig.thumb.minSlides = ACC.slider.sliderThumbModalMinSlides;
            ACC.slider.sliderThumb.reloadSlider(ACC.slider.sliderConfig.thumb);
            ACC.slider.handlePrevNextControls();
            // ACC.slider.sliderThumb.goToSlide(ACC.slider.newIndex);
        }).on('hide.bs.modal', function(){
            $('#triggerModal').show();
            $('#sliders').appendTo('#pageSliders');

            ACC.slider.sliderConfig.thumb.minSlides = ACC.slider.sliderThumbMinSlides;
            ACC.slider.sliderThumb.reloadSlider(ACC.slider.sliderConfig.thumb);
            ACC.slider.handlePrevNextControls();
            // ACC.slider.sliderThumb.goToSlide(ACC.slider.newIndex);
        });
    },

    debugInfo: function(){
      $('body').append('<div id="debugInfo" />');
      $('#debugInfo').append(
           '<ul>'
          +'    <li>Slides in main slider: <strong id="mainSlideCount"></strong></li>'
          +'    <li>Slides in thumb slider: <strong id="thumbSlideCount"></strong></li>'
          +'    <li>Active slide: <strong id="newIndex"></strong></li>'
          +'</ul>');

      $('#mainSlideCount').text(this.mainSlideCount);
      $('#thumbSlideCount').text(this.thumbSlideCount);
      $('#newIndex').text(+this.newIndex);
      $(document).on('click', function(e) {
          $('#newIndex').text(ACC.slider.newIndex);
      });
    }
};
