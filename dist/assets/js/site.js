'use strict';
(() => {
  const header=document.querySelector('[data-header]');
  const toggle=document.querySelector('[data-menu-toggle]');
  const mobile=document.querySelector('#mobile-navigation');
  const closeMenu=()=>{header?.classList.remove('menu-active');document.body.classList.remove('menu-open');toggle?.setAttribute('aria-expanded','false');toggle?.setAttribute('aria-label','Open navigation');if(mobile)mobile.inert=true;};
  const openMenu=()=>{header?.classList.add('menu-active');document.body.classList.add('menu-open');toggle?.setAttribute('aria-expanded','true');toggle?.setAttribute('aria-label','Close navigation');if(mobile)mobile.inert=false;mobile?.querySelector('a')?.focus();};
  toggle?.addEventListener('click',()=>header?.classList.contains('menu-active')?closeMenu():openMenu());
  mobile?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();if(e.key==='Tab'&&header?.classList.contains('menu-active')){const items=[...mobile.querySelectorAll('a'),toggle].filter(x=>x);let pos=items.indexOf(document.activeElement);if(e.shiftKey&&pos===0){e.preventDefault();items.at(-1).focus()}else if(!e.shiftKey&&pos===items.length-1){e.preventDefault();items[0].focus()}}});
  document.querySelectorAll('[data-submenu]').forEach(btn=>btn.addEventListener('click',()=>{const parent=btn.closest('.nav-dropdown');const isOpen=parent.classList.toggle('is-open');btn.setAttribute('aria-expanded',String(isOpen));}));
  const scroll=()=>header?.classList.toggle('is-scrolled',window.scrollY>30);window.addEventListener('scroll',scroll,{passive:true});scroll();
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveal=document.querySelectorAll('.reveal');
  if(!reduce&&'IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target)}}),{threshold:.13});reveal.forEach(x=>observer.observe(x));}else reveal.forEach(x=>x.classList.add('in-view'));
  if(!reduce)document.querySelectorAll('[data-ambient]').forEach(video=>{const stage=video.closest('.media-stage');if(!video.querySelector('source')?.getAttribute('src'))return;video.addEventListener('playing',()=>stage?.classList.add('has-video'));video.addEventListener('error',()=>stage?.classList.remove('has-video'));const p=video.play();if(p&&typeof p.catch==='function')p.catch(()=>{});});
  document.querySelectorAll('[data-video-shell]').forEach(shell=>{
    const btn=shell.querySelector('[data-video-play]');
    const video=shell.querySelector('video');
    const notice=shell.querySelector('[data-video-notice]');
    if(!btn||!video)return;
    const showPlayback=()=>{video.hidden=false;btn.hidden=true;if(notice)notice.hidden=true;};
    const showReplay=()=>{video.hidden=true;btn.hidden=false;btn.querySelector('small')?.replaceChildren('Replay the reel');btn.setAttribute('aria-label','Replay NGD Media sizzle reel');};
    const showError=()=>{video.hidden=true;btn.hidden=true;if(notice)notice.hidden=false;};
    video.addEventListener('playing',showPlayback);
    video.addEventListener('ended',showReplay);
    video.addEventListener('error',showError);
    btn.addEventListener('click',async()=>{
      const source=video.querySelector('source')?.src;
      if(!source)return;
      try{
        showPlayback();
        await video.play();
      }catch{showError();}
    });
  });

  // Choose a single hero video source. Reevaluate on resize/orientation change.
  document.querySelectorAll('[data-responsive-video]').forEach(stage=>{
    const video=stage.querySelector('video');
    const mq=window.matchMedia('(max-width: 767px), (orientation: portrait)');
    let active='';
    const update=()=>{
      if(reduce){video.pause();video.removeAttribute('src');video.load();stage.classList.remove('has-video');return;}
      const next=mq.matches?stage.dataset.mobileSrc:stage.dataset.desktopSrc;
      if(next===active)return;
      active=next;stage.classList.remove('has-video');video.pause();video.src=next;video.load();
      video.play().catch(()=>{});
    };
    video.addEventListener('playing',()=>stage.classList.add('has-video'));
    video.addEventListener('error',()=>stage.classList.remove('has-video'));
    mq.addEventListener?.('change',update);
    update();
    document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else if(!reduce)video.play().catch(()=>{});});
  });
  // Compositor-friendly parallax, only while visible and for users who allow motion.
  if(!reduce&&'IntersectionObserver' in window){
    const nodes=[...document.querySelectorAll('[data-parallax]')];
    const visible=new Set();let queued=false;
    const observer=new IntersectionObserver(items=>{for(const item of items){if(item.isIntersecting)visible.add(item.target);else visible.delete(item.target)}requestFrame()},{rootMargin:'120px'});
    nodes.forEach(el=>observer.observe(el));
    function render(){queued=false;for(const el of visible){const box=el.parentElement.getBoundingClientRect();const center=box.top+box.height/2-window.innerHeight/2;const offset=Math.max(-130,Math.min(130,-center*Number(el.dataset.speed||.08)));el.style.setProperty('--parallax-y',`${offset.toFixed(1)}px`);}}
    function requestFrame(){if(!queued&&visible.size){queued=true;requestAnimationFrame(render)}}
    window.addEventListener('scroll',requestFrame,{passive:true});window.addEventListener('resize',requestFrame,{passive:true});
  }

  // Scroll choreography uses the actual hero displacement, not scrollY alone.
  // Fade is deliberately finished early enough to be visible in the viewport.
  const logoScene=document.querySelector('[data-logo-scene]');
  const scrollLogo=logoScene?.querySelector('[data-scroll-logo]');
  const scrollCopy=logoScene?.querySelector('.launch-hero-copy');
  if(scrollLogo&&scrollCopy&&!reduce){
    let logoQueued=false;
    const clamp=(v)=>Math.max(0,Math.min(1,v));
    const ease=(t)=>t*t*(3-2*t);
    const updateLogo=()=>{
      logoQueued=false;
      const heroRect=logoScene.getBoundingClientRect();
      // A complete logo fade happens within the first ~45% of the viewport's
      // scrolling distance, before the hero leaves the screen.
      const distance=Math.max(1,Math.min(heroRect.height*.72,window.innerHeight*.95));
      const progress=clamp(-heroRect.top/distance);
      const markWidth=scrollLogo.offsetWidth;
      const currentCenter=scrollLogo.offsetLeft+markWidth/2;
      const targetCenter=logoScene.clientWidth/2;
      const travel=ease(clamp(progress/.72));
      const x=(targetCenter-currentCenter)*travel;
      const mobile=window.matchMedia('(max-width: 800px)').matches;
      // The mobile mark descends into the composition, then vanishes;
      // desktop retains the gentle upward movement toward center.
      const y=(mobile?Math.min(175,window.innerHeight*.21):-Math.min(110,window.innerHeight*.13))*travel;
      const scale=1-.68*travel;
      // Complete the fade before the hero has finished scrolling out of view.
      const opacity=1-ease(clamp((progress-.04)/.43));
      scrollLogo.style.transform=`translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${scale.toFixed(3)})`;
      scrollLogo.style.opacity=opacity.toFixed(3);

      // Start smaller and grow the entire copy group with the scroll.
      // On desktop, bring the headline composition closer to viewport center.
      const grow=ease(clamp(progress/.82));
      const copyScale=.83+.23*grow;
      let copyX=0;
      if(!mobile){
        const copyStyle=getComputedStyle(scrollCopy);
        const rightPad=parseFloat(copyStyle.paddingRight)||0;
        const visibleWidth=Math.max(0,scrollCopy.offsetWidth-rightPad);
        const copyLeft=scrollCopy.offsetParent?.getBoundingClientRect().left||0;
        const sourceCenter=copyLeft+scrollCopy.offsetLeft+visibleWidth/2;
        const desiredX=logoScene.getBoundingClientRect().left+logoScene.clientWidth/2-sourceCenter;
        copyX=Math.max(-260,Math.min(260,desiredX))*grow;
      }
      scrollCopy.style.transform=`translate3d(${copyX.toFixed(1)}px,0,0) scale(${copyScale.toFixed(3)})`;
    };
    const requestLogo=()=>{if(!logoQueued){logoQueued=true;requestAnimationFrame(updateLogo)}};
    window.addEventListener('scroll',requestLogo,{passive:true});
    window.addEventListener('resize',requestLogo,{passive:true});
    requestLogo();
  }

  if(new URLSearchParams(location.search).get('submitted')==='1'){const success=document.querySelector('[data-form-success]');if(success){success.hidden=false;success.scrollIntoView({block:'nearest'});}}
})();
