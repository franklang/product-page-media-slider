ACC.sliderDebug = {

  _autoload: [
    ["debugInfo", $(".bxslider").length != 0]
  ],

  debugInfo: function(){
    $('body').append('<div id="debugInfo" />');
    $('#debugInfo').append(
       '<ul>'
      +'  <li>Slides in main slider: <strong id="mainSlideCount"></strong> <small>(incl. 0)</small></li>'
      +'  <li>Slides in thumb slider: <strong id="thumbSlideCount"></strong> <small>(incl. 0)</small></li>'
      +'  <li>Active image: <strong id="newIndex"></strong></li>'
      +'  <li>Active slide in main slider: <strong id="activeSlideInMainSlider"></strong></li>'
      +'  <li>Active slide in thumb slider: <strong id="activeSlideInThumbSlider"></strong></li>'
      +'  <li>First item of each slide in thumb slider: <strong id="firstItemOfEachSlideInThumbSlider"></strong></li>'
      +'</ul>');

    $('#mainSlideCount, #mainSlideCount2').text(ACC.slider.mainSlideCount);
    $('#thumbSlideCount').text(ACC.slider.thumbSlideCount);
    $('#newIndex, #activeSlideInMainSlider').text(+ACC.slider.activeSlideInMainSlider);
    $('#activeSlideInThumbSlider').text(ACC.slider.activeSlideInThumbSlider);
    $('#firstItemOfEachSlideInThumbSlider').text(ACC.slider.firstItemOfEachSlideInThumbSlider);
    $(document).on('click', ['.bx-prev', '.bx-next'], function(e) {
      $('#newIndex, #activeSlideInMainSlider').text(ACC.slider.activeSlideInMainSlider);
      $('#activeSlideInThumbSlider').text(ACC.slider.activeSlideInThumbSlider);
    });
    $(document).on('mouseover', '#sliderThumb li', function(e) {
      $('#firstItemOfEachSlideInThumbSlider').text(ACC.slider.firstItemOfEachSlideInThumbSlider);
    });
    $('#zoomModal').on('shown.bs.modal', function(){
      $('#thumbSlideCount').text(ACC.slider.thumbSlideCount);
    }).on('hidden.bs.modal', function(){
      $('#thumbSlideCount').text(ACC.slider.thumbSlideCount);
      $('#activeSlideInThumbSlider').text(ACC.slider.activeSlideInThumbSlider);
    });
  }
};
