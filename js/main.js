$(".div");
// $('.btn').click(function(){
//   $(".div").hide(1000);
// })

// $('.btn').click(function(){
//   $(".div").show(1000);
// })

// $('.btn').click(function(){
//   $(".div").toggle(1000);
// })

// $('.btn').click(function(){
//   $(".div").slideDown(1000);
// })

// $('.btn').click(function(){
//   $(".div").slideUp(1000);
// })


// $('.btn').click(function(){
//   $(".div").slideToggle(1000);
// })

// $('.btn').click(function(){
//   $(".div").fadeIn(1000);
// })

// $('.btn').click(function(){
//   $(".div").fadeOut(1000);
// })

// $('.btn').click(function(){
//   $(".div").fadeToggle(1000);
// })

// $('.btn').click(function(){
//   $(".div").fadeToggle(1000);
// })

// $('.btn').click(function(){
//   $(".div").fadeTo(1000,0.7);
// })

$('.home').animate({ width:'100%'},2000)
.animate({height:'100%'},2000,function(){
  $('h1').show(2000,function(){
    $('.item').slideDown(2000)
  });
})