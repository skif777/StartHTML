
// ajax form
$("#js-form").submit(function() {
  var th = $(this);
  $.ajax({
    type: "POST",
    url: "php/send.php",
    data: th.serialize()
  }).done(function() {
    $(th).find(".form-success").addClass('active').css('display', 'flex').hide().fadeIn();
    setTimeout(function() {
      $(th).find(".form-success").removeClass('active').fadeOut();
      th.trigger("reset");
    }, 5000);
  });
  return false;
});

// Валидация формы
$(document).ready(function() {
  $("input[name='button']").click(function() {
    var name = $('.name');
    var pass = $('.pass');

    if (!name.val()) {
      pass.css("border", "3px solid red");
      name.css("border", "3px solid red");
      $(".html").html('Введите имя');
      return false;
    } else if (!pass.val()) {
      pass.css("border", "3px solid red");
    }  else {
      pass.css("border", "3px solid green");
      name.css("border", "3px solid green");
    } 
    return true;
  });
  $("input[name='button2']").click(function() {
    var email = $('.email');
    if (!email.val()) {
      email.css("border", "3px solid red");
      $(".html").html('Введите имя');
      return false;
    } else {
      email.css("border", "3px solid green");
    } 
    return true; 
  });
});