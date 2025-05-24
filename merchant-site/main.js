$(document).ready(function () {
  refreshSequraWidget();
  $('.item-color').on('click', function () {
    $('.item-color')
      .removeClass('ring hover:ring-gray-200')
      .addClass('hover:ring-gray-200');
    $(this).addClass('ring').removeClass('hover:ring-gray-200');
  });

  $('.product-capacity').on('click', function () {
    $('.product-capacity').removeClass('ring');
    $(this).addClass('ring');
    $('#product-price').html($(this).find('span').attr('data-price'));
    refreshSequraWidget();
  });

  $('.btn-decrement').on('click', function () {
    var now = $('.quantity > div > input').val();
    if ($.isNumeric(now)) {
      if (parseInt(now) - 1 > 0) {
        now--;
      }
      $('.quantity > div > input').val(now);
    } else {
      $('.quantity > div > input').val('1');
    }

    refreshSequraWidget();
  });

  $('.btn-increment').on('click', function () {
    var now = $('.quantity > div > input').val();
    if ($.isNumeric(now)) {
      $('.quantity > div > input').val(parseInt(now) + 1);
    } else {
      $('.quantity > div > input').val('1');
    }

    refreshSequraWidget();
  });

  function refreshSequraWidget() {
    const price = $('#product-price').text();
    const quantity = $('.quantity > div > input').val();

    const cleaned = price
      .replace(/[^\d,.-]/g, '') // Remove currency and other symbols
      .replace(',', '.'); // Convert comma to dot

    const euros = parseFloat(cleaned) * quantity;
    const cents = Math.round(euros * 100);

    window.seQura.refresh('product-sequra-widget', cents);
  }
});
