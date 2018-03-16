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
       // Uncomment line below to show debug info
       ,["debugInfo", $(".bxslider").length > 0]
    ],

    newIndex: null,
    $thumb: $('#sliderThumb'),
    $main: $('#sliderMain'),
    sliderThumb: null,
        sliderThumbMinSlides: 6,
        sliderThumbModalMinSlides: 6,
    sliderMain: null,
    thumbSlideCount: null,
    mainSlideCount: null,
    activeSlideInThumbSlider: null,
    thumbSlideTriggerValues: null,

    sliderConfig:{
        "thumb":{
            mode: 'vertical',
            slideWidth: 300,
            minSlides: 0,
            slideMargin: 10,
            infiniteLoop: false,
            hideControlOnEnd: true,
            pager: false,
            startSlide: 0
        },
        "main":{
            pagerCustom: '#sliderThumb',
            onSlideBefore: function($slideElement, oldIndex, newIndex){
                ACC.slider.newIndex = newIndex;
            },
            onSlideNext: function($slideElement, oldIndex, newIndex){
                ACC.slider.getActiveSlideInThumbSlider();
                ACC.slider.sliderThumb.goToSlide(ACC.slider.activeSlideInThumbSlider);
            },
            onSlidePrev: function($slideElement, oldIndex, newIndex){
                ACC.slider.getActiveSlideInThumbSlider();
                ACC.slider.sliderThumb.goToSlide(ACC.slider.activeSlideInThumbSlider);
            }
        }
    },

    init: function(){
        ACC.slider.sliderConfig.thumb.minSlides = ACC.slider.sliderThumbMinSlides;

        this.sliderThumb = this.$thumb.bxSlider(this.sliderConfig.thumb);
        this.sliderMain = this.$main.bxSlider(this.sliderConfig.main);

        this.hoverIntent();
        this.handleSlideChanges();
        this.getActiveSlideInThumbSlider();
        this.handleModal();
    },

    onMouseOverThumb: function(){
        this.newIndex = $($(this).find('a')[0]).attr('data-slide-index');
        $(this).children('a').click();

        ACC.slider.getActiveSlideInThumbSlider();
    },

    hoverIntent: function(){
        this.$thumb.hoverIntent({
            over: this.onMouseOverThumb,
            selector: 'li',
            sensivity: 12
        });
    },

    handleSlideChanges: function(){
        this.mainSlideCount = this.sliderMain.getSlideCount();
        this.thumbSlideCount = Math.ceil(this.mainSlideCount / this.sliderConfig.thumb.minSlides);

        var thumbSlideTriggerValues = new Array(this.thumbSlideCount).fill(null).map((u, i) => i);
        for (var i = 0; i < thumbSlideTriggerValues.length; i++) {
          thumbSlideTriggerValues[i] *= this.sliderConfig.thumb.minSlides;
        }
        this.thumbSlideTriggerValues = thumbSlideTriggerValues;
    },

    handleModal: function(){
        $('#zoomModal').on('shown.bs.modal', function(){
            $('#triggerModal').hide();
            $('#sliders').appendTo('#modalSliders');

            ACC.slider.triggerWindowResizeEvent();
        }).on('hidden.bs.modal', function(){
            $('#triggerModal').show();
            $('#sliders').appendTo('#pageSliders');

            ACC.slider.sliderThumb.goToSlide(ACC.slider.activeSlideInThumbSlider);
            ACC.slider.triggerWindowResizeEvent();
        });
    },

    getActiveSlideInThumbSlider: function(){
        var i; var y = 0; var val = ACC.slider.newIndex; var zones = ACC.slider.thumbSlideTriggerValues;
        for (i = 0; i < zones.length; i++){
            if (val >= zones[i]){
                y = i;
            }
        }

        ACC.slider.activeSlideInThumbSlider = y;
    },

    triggerWindowResizeEvent: function(){
        var evt = window.document.createEvent('UIEvents');
        evt.initUIEvent('resize', true, false, window, 0);
        window.dispatchEvent(evt);
    },

    debugInfo: function(){
      $('body').append('<div id="debugInfo" />');
      $('#debugInfo').append(
           '<ul>'
          +'    <li>Slides in main slider: <strong id="mainSlideCount"></strong> <small>(incl. 0)</small></li>'
          +'    <li>Slides in thumb slider: <strong id="thumbSlideCount"></strong> <small>(incl. 0)</small></li>'
          +'    <li>Active image: <strong id="newIndex"></strong></li>'
          +'    <li>Active slide in main slider: <strong id="activeSlideInMainSlider"></strong></li>'
          +'    <li>Active slide in thumb slider: <strong id="activeSlideInThumbSlider"></strong></li>'
          +'    <li>Images that trigger a slide change in Thumb slider: <strong id="imagesThatTriggerASlideChangeInThumbSlider"></strong></li>'
          +'</ul>');

      $('#mainSlideCount, #mainSlideCount2').text(this.mainSlideCount);
      $('#thumbSlideCount').text(this.thumbSlideCount);
      $('#newIndex, #activeSlideInMainSlider').text(+this.newIndex);
      $('#activeSlideInThumbSlider').text(ACC.slider.activeSlideInThumbSlider);
      $('#imagesThatTriggerASlideChangeInThumbSlider').text(ACC.slider.thumbSlideTriggerValues);
      $(document).on('click', ['.bx-prev', '.bx-next'], function(e) {
          $('#newIndex, #activeSlideInMainSlider').text(ACC.slider.newIndex);
          $('#activeSlideInThumbSlider').text(ACC.slider.activeSlideInThumbSlider);
      });
      $(document).on('mouseover', '#sliderThumb li', function(e) {
          $('#imagesThatTriggerASlideChangeInThumbSlider').text(ACC.slider.thumbSlideTriggerValues);
      });
      $('#zoomModal').on('shown.bs.modal', function(){
          $('#thumbSlideCount').text(ACC.slider.thumbSlideCount);
      }).on('hidden.bs.modal', function(){
          $('#thumbSlideCount').text(ACC.slider.thumbSlideCount);
          $('#activeSlideInThumbSlider').text(ACC.slider.activeSlideInThumbSlider);
      });
    }
};
