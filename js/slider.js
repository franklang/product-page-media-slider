// Accessing bxslider's slider object inside its “onSliderLoad” callback returns undefined
    // https://github.com/stevenwanderski/bxslider-4/issues/475
    // https://codepen.io/eniosan/pen/XJxMNL

// bxslider slider - Hover on pager
    // https://stackoverflow.com/questions/28110510/bxslider-slider-hover-on-pager
    // http://jsfiddle.net/3b3hkb5m/

var ACC = ACC || {}; // make sure ACC is available

ACC.slider = {

  _autoload: [
    ["init", $(".bxslider").length > 0],
    "getSliderMainHeight",
    "setSliderThumbHeight"
  ],

  newIndex: null,
  $thumb: $('#sliderThumb'),
  $main: $('#sliderMain'),
  sliderThumb: null,
    sliderThumbMinSlides: 6,
    // Currently not implemented
    // sliderThumbModalMinSlides: 6,
  sliderMain: null,
    sliderMainHeight: null,
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

        // Lazy load
        var $lazy = $slideElement.find('.lazy')
        var $load = $lazy.attr('data-src');
        $lazy.attr('src', $load).removeClass('lazy');
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

  getSliderMainHeight: function(){
    ACC.slider.sliderMainHeight = $('#sliderMain').closest('.bx-viewport').height();
    console.log(ACC.slider.sliderMainHeight);
  },

  setSliderThumbHeight: function(){
    var slideMarginCumulatedHeight = (ACC.slider.sliderThumbMinSlides - 1) * ACC.slider.sliderConfig.thumb.slideMargin;
    var heightWithoutMargins = ACC.slider.sliderMainHeight - slideMarginCumulatedHeight;
    var singleImageWidth = heightWithoutMargins / ACC.slider.sliderThumbMinSlides;

    this.$thumb.closest('.bx-viewport').height(ACC.slider.sliderMainHeight);
    this.$thumb.children('li').width(singleImageWidth);

    // console.log('slideMarginCumulatedHeight: ' + slideMarginCumulatedHeight);
    // console.log('singleImageWidth: ' + singleImageWidth);
  },

  onWindowResize: function(){
    this.getSliderMainHeight();
    this.setSliderThumbHeight();
  }
};
