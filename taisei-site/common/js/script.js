(function(){
  var navToggle = document.getElementById('navToggle');
  var globalNav = document.getElementById('globalNav');
  var navBackdrop = document.getElementById('navBackdrop');
  function closeNav(){
    if(navToggle){ navToggle.classList.remove('isOpen'); }
    if(globalNav){ globalNav.classList.remove('isOpen'); }
    if(navBackdrop){ navBackdrop.classList.remove('isOpen'); }
  }
  if(navToggle && globalNav){
    navToggle.addEventListener('click', function(){
      var willOpen = !globalNav.classList.contains('isOpen');
      navToggle.classList.toggle('isOpen', willOpen);
      globalNav.classList.toggle('isOpen', willOpen);
      if(navBackdrop){ navBackdrop.classList.toggle('isOpen', willOpen); }
    });
    if(navBackdrop){
      navBackdrop.addEventListener('click', closeNav);
    }
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape'){ closeNav(); }
    });
  }

  var toTopBtn = document.getElementById('toTop');
  if(toTopBtn){
    window.addEventListener('scroll', function(){
      if(window.scrollY > 480){ toTopBtn.classList.add('isVisible'); }
      else{ toTopBtn.classList.remove('isVisible'); }
    }, {passive: true});
    toTopBtn.addEventListener('click', function(){
      window.scrollTo({top: 0, behavior: 'smooth'});
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

  // 数値カウントアップ（#statsの.num）。静的HTML側には最終値（50/13/130等）を
  // そのまま書いておき、JSが実際に動いた時だけ0から数え上げる方式にしている。
  // WebChangerの編集画面ではJSが一切動かないため（8節）、静的な最終値がそのまま
  // 表示され続ける＝壊れない。目標値もJSにハードコードせずDOM側から読み取るため、
  // 将来.numの中身が編集されても書き換え不要。
  function animateCountUp(el){
    var textNode = el.firstChild;
    if(!textNode || textNode.nodeType !== Node.TEXT_NODE){ return; }
    var target = parseInt(textNode.textContent.trim(), 10);
    if(isNaN(target)){ return; }
    if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      return;
    }
    var duration = 1100;
    var start = null;
    function step(ts){
      if(start === null){ start = ts; }
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      textNode.textContent = Math.round(eased * target);
      if(progress < 1){
        requestAnimationFrame(step);
      } else {
        textNode.textContent = target;
      }
    }
    textNode.textContent = '0';
    requestAnimationFrame(step);
  }

  var revealEls = document.querySelectorAll('.reveal');
  if(revealEls.length && 'IntersectionObserver' in window){
    var revealIo = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('isVisible');
          if(entry.target.id === 'stats'){
            entry.target.querySelectorAll('.num').forEach(function(el, i){
              setTimeout(function(){ animateCountUp(el); }, i * 100);
            });
          }
          revealIo.unobserve(entry.target);
        }
      });
    }, {threshold: 0.12});
    revealEls.forEach(function(el){ revealIo.observe(el); });
  }
})();
