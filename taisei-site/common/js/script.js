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

  // 数値カウントアップ（#statsの.num）。静的HTML側には最終値（50/13/130等）を
  // そのまま書いておき、JSが実際に動いた時だけ0から数え上げる方式にしている。
  // WebChangerの編集画面ではJSが一切動かないため（8節）、静的な最終値がそのまま
  // 表示され続ける＝壊れない。目標値もJSにハードコードせずDOM側から読み取るため、
  // 将来.numの中身が編集されても書き換え不要。
  // [WC] ✅2026-08-21・#statsをWebChangerのテキストブロックとして登録すると、
  // 自動<p>挿入（CLAUDE.md 3節・13節G）で.numの中身が<div class="num"><p>50</p>
  // <span>年</span></div>のように書き換わる可能性がある。el.firstChildが単純な
  // テキストノードである前提だと、これだけで「.firstChildがp要素になり
  // カウントアップが動かなくなる」（うにさんの報告）。対策として、firstChildに
  // 決め打ちせず配下の全テキストノードを走査し、数字で始まる最初のノードを探す
  // 方式に変更した。見つからなければ何もしない（静的な最終値がそのまま表示され
  // 続けるだけなので、編集画面と同様に壊れずフォールバックする）。
  function findLeadingNumberTextNode(el){
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var node;
    while((node = walker.nextNode())){
      if(/^\s*\d+/.test(node.textContent)){ return node; }
    }
    return null;
  }
  function animateCountUp(el){
    var textNode = findLeadingNumberTextNode(el);
    if(!textNode){ return; }
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
    revealEls.forEach(function(el){ el.classList.add('revealArmed'); });
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
