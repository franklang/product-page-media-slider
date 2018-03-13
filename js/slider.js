// Accessing bxslider's slider object inside its “onSliderLoad” callback returns undefined
    // https://github.com/stevenwanderski/bxslider-4/issues/475
    // https://codepen.io/eniosan/pen/XJxMNL

// bxslider slider - Hover on pager
    // https://stackoverflow.com/questions/28110510/bxslider-slider-hover-on-pager
    // http://jsfiddle.net/3b3hkb5m/

var ACC = ACC || {}; // make sure ACC is available

ACC.slider = {

    _autoload: [
        ["bindSlider", $(".bxslider").length > 0]
       ,["hoverIntent", $(".bxslider").length > 0]
       ,["handlePrevNextControls", $(".bxslider").length > 0]
       // ,["debugInfo", $(".bxslider").length > 0]
    ],

    newIndex: null,
    $thumb: $('.js-bxslider-thumb'),
    $main: $('.js-bxslider-main'),
    thumbSlideCount: null,
    mainSlideCount: null,
    triggerPrevValues: null,
    triggerNextValues: null,
    initThumb: null,
    initMain: null,

    sliderConfig:{
        "thumb":{
            mode: 'vertical',
            slideWidth: 300,
            minSlides: 6,
            slideMargin: 10,
            infiniteLoop: false,
            hideControlOnEnd: true,
            pager: false,
            startSlide: 0
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
                  ACC.slider.initThumb.goToSlide(0);
                }
            },
            onSlidePrev: function($slideElement, oldIndex, newIndex){
                if(ACC.slider.triggerPrevValues.indexOf(newIndex) !== -1){
                    ACC.slider.$thumb.closest('.bx-wrapper').children('.bx-controls').find('.bx-prev').click();
                }
                else if(newIndex == ACC.slider.mainSlideCount -1){
                  ACC.slider.sliderConfig.thumb.startSlide = ACC.slider.thumbSlideCount -1;
                  ACC.slider.initThumb.reloadSlider(ACC.slider.sliderConfig.thumb);
                }
            }
        }
    },

    bindSlider: function(){
        this.initThumb = $('.js-bxslider-thumb').bxSlider(ACC.slider.sliderConfig.thumb);
        this.initMain = $('.js-bxslider-main').bxSlider(ACC.slider.sliderConfig.main);
    },

    onMouseOverThumb: function(){
        ACC.slider.newIndex = $($(this).find('a')[0]).attr('data-slide-index');
        $(this).children('a').click();
    },

    hoverIntent: function(){
        ACC.slider.$thumb.hoverIntent({
            over: ACC.slider.onMouseOverThumb,
            selector: 'li',
            sensivity: 12
        });
    },

    handlePrevNextControls: function(){
        ACC.slider.mainSlideCount = ACC.slider.initMain.getSlideCount();
        ACC.slider.thumbSlideCount = Math.ceil(ACC.slider.mainSlideCount / ACC.slider.sliderConfig.thumb.minSlides);

        var triggerNextValues = new Array(ACC.slider.thumbSlideCount).fill(null).map((u, i) => i);
        for (var i = 0; i < triggerNextValues.length; i++) {
          triggerNextValues[i] *= ACC.slider.sliderConfig.thumb.minSlides;
        }
        var triggerPrevValues = triggerNextValues.map(function(value){
            return value -1;
        });
        triggerPrevValues[0] = 0;
        triggerNextValues.splice(0, 1);
        ACC.slider.triggerNextValues = triggerNextValues;
        ACC.slider.triggerPrevValues = triggerPrevValues;
    },

    debugInfo: function(){
      $('body').append('<div id="debugInfo" />');
      $('#debugInfo').append(
           '<ul>'
          +'    <li>Slides in main slider: <strong id="mainSlideCount"></strong></li>'
          +'    <li>Slides in thumb slider: <strong id="thumbSlideCount"></strong></li>'
          +'    <li>Active slide: <strong id="newIndex"></strong></li>'
          +'</ul>');

      $('#mainSlideCount').text(+ACC.slider.mainSlideCount);
      $('#thumbSlideCount').text(+ACC.slider.thumbSlideCount);
      $('#newIndex').text(+ACC.slider.newIndex);
      $(document).on('click', function(e) {
          $('#newIndex').text(+ACC.slider.newIndex);
      });
    }
};
