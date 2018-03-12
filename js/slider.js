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

    oldIndex: null,
    newIndex: null,
    $thumbs: $('.js-bxslider-thumbs'),
    $large: $('.js-bxslider-large'),
    slideAmount: null,
    triggerPrevValues: null,
    triggerNextValues: null,
    // sliderThumbs: null,

    sliderConfig:{
        "thumbs":{
            mode: 'vertical',
            slideWidth: 300,
            minSlides: 6,
            slideMargin: 10,
            infiniteLoop: false,
            hideControlOnEnd: true,
            pager: false
        },
        "large":{
            pagerCustom: '.js-bxslider-thumbs',
            onSlideBefore: function($slideElement, oldIndex, newIndex){
                ACC.slider.oldIndex = oldIndex;
                ACC.slider.newIndex = newIndex;
                // console.log('oldIndex: ' + ACC.slider.oldIndex + ', newIndex: ' + ACC.slider.newIndex);
            },
            onSlideNext: function($slideElement, oldIndex, newIndex){
                // How to find if x equals any value in an array in javascript [duplicate]
                // if newIndex == any value of triggerNextValues array, click .next
                // if newIndex == any value of triggerPrevValues array, click .prev
                // if newIndex == 6 ou == 12 click .next
                // if newIndex == 0 ou == 5 ou == 11 click .prev
                if(ACC.slider.triggerNextValues.indexOf(newIndex) !== -1){
                    ACC.slider.$thumbs.closest('.bx-wrapper').children('.bx-controls').find('.bx-next').click();
                    ACC.slider.newIndex = newIndex;
                    console.log('newIndex: ' + newIndex);
                }

            },
            onSlidePrev: function($slideElement, oldIndex, newIndex){
                // How to find if x equals any value in an array in javascript [duplicate]
                // if newIndex == any value of triggerNextValues array, click .next
                // if newIndex == any value of triggerPrevValues array, click .prev
                // if newIndex == 6 ou == 12 click .next
                // if newIndex == 0 ou == 5 ou == 11 click .prev
                if(ACC.slider.triggerPrevValues.indexOf(newIndex) !== -1){
                    ACC.slider.$thumbs.closest('.bx-wrapper').children('.bx-controls').find('.bx-prev').click();
                    ACC.slider.newIndex = newIndex;
                    console.log('newIndex: ' + newIndex);
                }
            }
        }
    },

    bindSlider: function(){
        $('.bxslider', '#productMedia').each(function(){
            var $c = $(this)
            $.each(ACC.slider.sliderConfig,function(key,config){
                if($c.hasClass('js-bxslider-'+key)){
                    var $e = $('.js-bxslider-'+key);
                    $e.bxSlider(config);
                }
            });
        });

        // this.sliderThumbs = $('.js-bxslider-thumbs').bxSlider(ACC.slider.sliderConfig.thumbs);
        // this.sliderThumbs.goToSlide(3);
        // $('.js-bxslider-large').bxSlider(ACC.slider.sliderConfig.large);

        console.log('thumbs minSlides: ' + ACC.slider.sliderConfig.thumbs.minSlides);
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
        // console.log('slideAmount: ', + ACC.slider.slideAmount);

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

        // console.table(ACC.slider.triggerNextValues);
        // console.table(ACC.slider.triggerPrevValues);
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
