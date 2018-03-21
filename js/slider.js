// Accessing bxslider's slider object inside its “onSliderLoad” callback returns undefined
    // https://github.com/stevenwanderski/bxslider-4/issues/475
    // https://codepen.io/eniosan/pen/XJxMNL

// bxslider slider - Hover on pager
    // https://stackoverflow.com/questions/28110510/bxslider-slider-hover-on-pager
    // http://jsfiddle.net/3b3hkb5m/

var ACC = ACC || {}; // make sure ACC is available

ACC.slider = {

  _autoload: [
    ["test", $("#sliders").length != 0]
  ],

  newIndex: null,
  $thumb: $('#sliderThumb'),
  $main: $('#sliderMain'),
  $thumbZoom: $('#sliderThumbZoom'),
  $mainZoom: $('#sliderMainZoom'),
  sliderThumb: null,
    sliderThumbMinSlides: 6,
    // Currently not implemented
    // sliderThumbModalMinSlides: 6,
  sliderMain: null,
  activeSliderThumb: null,
  thumbSlideCount: null,
  mainSlideCount: null,
  activeSlideInThumbSlider: null,
  thumbSlideTriggerValues: null,

  sliderConfig:{
    "thumb":{
      mode: 'vertical',
      controls: true,
      nextText: '',
      prevText: '',
      minSlides: 0,
      slideMargin: 10,
      infiniteLoop: false,
      hideControlOnEnd: true,
      pager: false,
      startSlide: 0,
      onSlideNext: function($slideElement, oldIndex, newIndex){
        ACC.slider.activeSlideInThumbSlider = newIndex;
      },
      onSlidePrev: function($slideElement, oldIndex, newIndex){
        ACC.slider.activeSlideInThumbSlider = newIndex;
      }
    },
    "main":{
      nextText: '',
      prevText: '',
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

  test: function(){
    var amountOfImages = $('#sliderMain').children('li').length;
    ACC.slider.mainSlideCount = amountOfImages;

    if(ACC.slider.mainSlideCount > 1){
      this.init();
    }
    else{
      this.handleModal();
    }
  },

  init: function(){
    ACC.slider.sliderConfig.thumb.minSlides = ACC.slider.sliderThumbMinSlides;

    if(ACC.slider.mainSlideCount <= ACC.slider.sliderThumbMinSlides){
      this.sliderConfig.thumb.controls = false;
      this.sliderThumb = this.$thumb.bxSlider(this.sliderConfig.thumb);
    }
    else if(ACC.slider.mainSlideCount > ACC.slider.sliderThumbMinSlides){
      this.sliderThumb = this.$thumb.bxSlider(this.sliderConfig.thumb);
    }

    this.sliderMain = this.$main.bxSlider(this.sliderConfig.main);

    this.hoverIntent(ACC.slider.$thumb);
    this.handleSlideChanges();
    this.getActiveSlideInThumbSlider();
    this.handleModal();
  },

  onMouseOverThumb: function(){
    this.newIndex = $($(this).find('a')[0]).attr('data-slide-index');
    $(this).children('a').click();

    ACC.slider.getActiveSlideInThumbSlider();
  },

  hoverIntent: function($pager){
    $pager.hoverIntent({
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

    // $('a', '.bxslider-thumb').on('click', function(){
    //   ACC.slider.activeSlideInThumbSlider = $(this).attr('data-slide-index');
    // });
  },

  handleModal: function(){
    var $pageSlidersControls = $('.bx-controls', '#pageSliders');

    $('#zoomModal').on('shown.bs.modal', function(){
      if(ACC.slider.mainSlideCount > 1){
        $pageSlidersControls.hide();

        ACC.slider.sliderConfig.main.pagerCustom = '#sliderThumbZoom';
        ACC.slider.sliderThumb = ACC.slider.$thumbZoom.bxSlider(ACC.slider.sliderConfig.thumb);
        ACC.slider.sliderMainZoom = ACC.slider.$mainZoom.bxSlider(ACC.slider.sliderConfig.main);

        ACC.slider.sliderThumb.goToSlide(ACC.slider.activeSlideInThumbSlider);
        ACC.slider.$thumbZoom.find('li:eq('+ACC.slider.newIndex+')').children('a').click();

        ACC.slider.hoverIntent(ACC.slider.$thumbZoom);
      }

      ACC.slider.triggerWindowResizeEvent();
    }).on('hidden.bs.modal', function(){
      if(ACC.slider.mainSlideCount > 1){
        $pageSlidersControls.show();

        ACC.slider.sliderConfig.main.pagerCustom = '#sliderThumb';
        ACC.slider.sliderThumb = ACC.slider.$thumb.bxSlider(ACC.slider.sliderConfig.thumb);

        ACC.slider.sliderThumb.goToSlide(ACC.slider.activeSlideInThumbSlider);
        ACC.slider.$thumb.find('li:eq('+ACC.slider.newIndex+')').children('a').click();
      }

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
  }
};
