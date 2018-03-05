
// Tabs
$(document).ready(function() {
  $(".js-left-menu").on('click', 'li:not(.active)', function() {
    $(this)
    .addClass('li').siblings().removeClass('li') // Необязательно - добавляет к Li класс и удаляет у других Li
    .closest('.content').find('.tabs-content2').removeClass('active') // Удалить если используется 1 tab
    .closest('.content').find('.tabs-content').removeClass('active').eq($(this).index(0)).addClass('active');
  });
  // Tabs - 2 
  $(".js-right-menu").on('click', 'li:not(.active)', function() {
    $(this)
    .addClass('li').siblings().removeClass('li') // Необязательно - добавляет к Li класс и удаляет у других Li
    .closest('.content').find('.tabs-content').removeClass('active') // Удалить если используется 1 tab
    .closest('.content').find('.tabs-content2').removeClass('active').eq($(this).index(0)).addClass('active');
  });
});