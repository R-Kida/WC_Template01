(function(){
  var navToggle = document.getElementById('navToggle');
  var globalNav = document.getElementById('globalNav');
  if(navToggle && globalNav){
    navToggle.addEventListener('click', function(){
      navToggle.classList.toggle('isOpen');
      globalNav.classList.toggle('isOpen');
    });
  }

  var heroSlider = document.getElementById('heroSlider');
  if(heroSlider){
    var heroSlides = heroSlider.querySelectorAll('.slide');
    var heroDots = document.getElementById('heroDots');
    var heroIndex = 0;
    heroSlides.forEach(function(slide, i){
      var b = document.createElement('button');
      if(i === 0){ b.classList.add('isActive'); }
      b.addEventListener('click', function(){ goToSlide(i); });
      heroDots.appendChild(b);
    });
    var heroDotEls = heroDots.querySelectorAll('button');
    function goToSlide(i){
      heroSlides[heroIndex].classList.remove('isActive');
      heroDotEls[heroIndex].classList.remove('isActive');
      heroIndex = i;
      heroSlides[heroIndex].classList.add('isActive');
      heroDotEls[heroIndex].classList.add('isActive');
    }
    setInterval(function(){
      goToSlide((heroIndex + 1) % heroSlides.length);
    }, 5000);
  }

  var revealEls = document.querySelectorAll('.reveal');
  if(revealEls.length && 'IntersectionObserver' in window){
    var revealIo = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('isVisible');
          revealIo.unobserve(entry.target);
        }
      });
    }, {threshold: 0.12});
    revealEls.forEach(function(el){ revealIo.observe(el); });
  }
})();
