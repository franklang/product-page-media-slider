// https://web.archive.org/web/20131127012941/http://bxslider.com:80/options

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
        ,"hoverIntent"
        ,"handlePrevNextControls"

        ,"debugInfo"
    ],

    newIndex: null,
    $thumbs: $('.js-bxslider-thumbs'),
    $large: $('.js-bxslider-large'),
    slideAmount: null,
    triggerPrevValues: null,
    triggerNextValues: null,
    initSliderThumbs: null,
    initSliderLarge: null,

    sliderConfig:{
        "thumbs":{
            mode: 'vertical',
            slideWidth: 300,
            minSlides: 6,
            slideMargin: 10,
            infiniteLoop: false,
            hideControlOnEnd: true,
            pager: false,
            startSlide: 0
        },
        "large":{
            pagerCustom: '.js-bxslider-thumbs',
            onSlideBefore: function($slideElement, oldIndex, newIndex){
                ACC.slider.newIndex = newIndex;
            },
            onSlideNext: function($slideElement, oldIndex, newIndex){
                if(ACC.slider.triggerNextValues.indexOf(newIndex) !== -1){
                    ACC.slider.$thumbs.closest('.bx-wrapper').children('.bx-controls').find('.bx-next').click();
                }
                else if(newIndex == 0){
                  ACC.slider.initSliderThumbs.goToSlide(0);
                }

            },
            onSlidePrev: function($slideElement, oldIndex, newIndex){
                if(ACC.slider.triggerPrevValues.indexOf(newIndex) !== -1){
                    ACC.slider.$thumbs.closest('.bx-wrapper').children('.bx-controls').find('.bx-prev').click();
                }
                else if(newIndex == ACC.slider.slideAmount -1){
                  var numGroups = Math.ceil(ACC.slider.slideAmount / ACC.slider.sliderConfig.thumbs.minSlides);

                  ACC.slider.sliderConfig.thumbs.startSlide = numGroups -1;
                  ACC.slider.initSliderThumbs.reloadSlider(ACC.slider.sliderConfig.thumbs);
                }
            }
        }
    },

    bindSlider: function(){
        this.initSliderThumbs = $('.js-bxslider-thumbs').bxSlider(ACC.slider.sliderConfig.thumbs);
        this.initSliderLarge = $('.js-bxslider-large').bxSlider(ACC.slider.sliderConfig.large);
    },

    onMouseOverThumb: function(){
        ACC.slider.newIndex = $($(this).find('a')[0]).attr('data-slide-index');
        $(this).children('a').click();
    },

    hoverIntent: function(){
        ACC.slider.$thumbs.hoverIntent({
            over: ACC.slider.onMouseOverThumb,
            selector: 'li',
            sensivity: 12
        });
    },

    handlePrevNextControls: function(){
        // get amount of slides in slider
        var slideAmount = ACC.slider.$large.children('li:not(.bx-clone)').length;
        ACC.slider.slideAmount = slideAmount;

        //
        var triggerNextValues = new Array(Math.ceil(ACC.slider.slideAmount / ACC.slider.sliderConfig.thumbs.minSlides)).fill(null).map((u, i) => i);
        for (var i = 0; i < triggerNextValues.length; i++) {
          triggerNextValues[i] *= ACC.slider.sliderConfig.thumbs.minSlides;
        }
        var triggerPrevValues = triggerNextValues.map(function(value){
            return value - 1;
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
          +'    <li>slides in slider: <strong id="slideAmount"></strong></li>'
          +'    <li>active slide: <strong id="newIndex"></strong></li>'
          +'</ul>');

      $('#slideAmount').text(+ACC.slider.slideAmount);
      $('#newIndex').text(+ACC.slider.newIndex);
      $(document).on('click', function(e) {
          $('#newIndex').text(+ACC.slider.newIndex);
      });
    }
};
