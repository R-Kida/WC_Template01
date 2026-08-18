const breakPoint = 576;


$(window).on('load', function () {
    $('.cmsbody').addClass('loaded');
})





$('#globalNav .navUl li').on('mouseenter', function () {
    $(this).children('.navUl').stop(true, false).slideDown();
}).on('mouseleave', function () {
    $(this).children('.navUl').stop(true, false).slideUp();
})



$('.slider-pro').sliderPro({
    width: 600, //横幅
    autoHeight: true,
    arrows: true, //左右の矢印
    buttons: true, //ナビゲーションボタンを出す
    slideDistance: 0, //スライド同士の距離
    visibleSize: '100%', //前後のスライドを表示

});


$(window).on('load scroll', function () {
    var w = $('#contentsWrap.page').length ? 300 : $(window).height();

    if ($(window).height() + 300 >= $(document).height()) {
        w = 0;
    }

    if ($(window).scrollTop() >= w) {
        $('body').addClass('scrolled')
    } else {
        $('body').removeClass('scrolled')
    }
});


$(window).on('load resize scroll', function () {
    $('.contentsImg').each(function (key, value) {
        var top = $(this).offset().top;
        var scrollTop = $(window).scrollTop();
        var windowHeight = $(window).height();
        var imgHeight = $(this).height();


        var offset = -(top - (windowHeight + scrollTop)) / imgHeight * 100 * 0.2;

        $(this).find('img').css({
            'object-position': '50% ' + offset + '%'
        });

    })

})


$('#globalNavbtn a').on('click', function () {
    $('#globalNav').toggleClass('open');
    return false;
})


$('#topMovieBg').sliderPro({
    width: '100%',
    height: '100vh',
    autoplayOnHover: 'none',
    fade: true,
    fadeDuration: 2000
});