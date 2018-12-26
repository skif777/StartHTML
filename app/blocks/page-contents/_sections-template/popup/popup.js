
// Popup
$(document).ready(function() {
  var container = $('body'),
      popup = $('.popup-bg, .popup'),
      bg = $('.popup-bg');

  setTimeout(function() {
    bg.fadeIn();
    $('.popup').css('display', 'flex').fadeIn();
  }
  ,1000);  

  $('.close').click(function (){
    popup.fadeOut();
  });

  popup.click(function() {
    container.on('click', function(event) {
      var select = $('.popup-content');
      if ($(event.target).closest(select).length)
        return;
      popup.fadeOut();
      container.unbind('click');
    });
  });
});