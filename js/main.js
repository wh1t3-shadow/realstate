/**
 * SPRINGS ESTATE - ULTRA ADVANCED & PREMIUM SCROLL ANIMATION ENGINE
 * Features: Editorial Preloader, Ambient Gold Particles, Magnetic Physics,
 * Pinned Multi-directional Cascades, 3D Dynamic Lighting Reel,
 * Mobile App Layout (Bottom Tab Bar, Slide Drawer, Bottom Sheets), Lenis + GSAP.
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  initLenis();
  initPreloader();
  initAmbientDustParticles();
  initCustomCursorAndMagnetics();
  initSideDotNavigation();
  initMobileAppNavigation();

  // Section-by-Section Pinned & Directional Animations
  initHeroSectionAnimation();
  initDoorsPortalAnimation();
  initNaturePinnedAnimation();
  initDualSplitScroll();
  initArchitectureHorizontalScroll();
  init3DRotatingFilmReel();
  initResidencesCurtainAnimation();
  initInteriorsPinnedAnimation();
  initLocationPinnedAnimation();
  initFooterAnimation();

  // UI Interactive Systems
  initResidencesFilter();
  initInteriorsShowcase();
  initModals();
  initAudioEngine();
  initHeaderScroll();
});

/* 1. LENIS SMOOTH SCROLL ENGINE */
let lenis;

function initLenis() {
  if (typeof Lenis === 'undefined') return;

  const isMobile = window.innerWidth <= 768;

  lenis = new Lenis({
    duration: isMobile ? 1.1 : 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: isMobile ? 1.8 : 1.5,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

/* 2. EDITORIAL PRELOADER SEQUENCE */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const bar = document.getElementById('preloaderBar');
  const num = document.getElementById('preloaderNum');
  if (!preloader || !bar || !num) return;

  if (lenis) lenis.stop();

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 8) + 5;
    if (progress > 100) progress = 100;

    bar.style.width = `${progress}%`;
    num.textContent = `${progress < 10 ? '0' + progress : progress}%`;

    if (progress === 100) {
      clearInterval(interval);
      setTimeout(openPreloaderCurtain, 250);
    }
  }, 35);

  function openPreloaderCurtain() {
    const tl = gsap.timeline({
      onComplete: () => {
        preloader.style.display = 'none';
        if (lenis) lenis.start();
        animateHeroEntrance();
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 150);
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 450);
      }
    });

    tl.to('.preloader-content', { opacity: 0, scale: 0.9, duration: 0.45, ease: 'power2.in' })
      .to('.preloader-curtain.left', { xPercent: -100, duration: 1.1, ease: 'power3.inOut' }, '-=0.2')
      .to('.preloader-curtain.right', { xPercent: 100, duration: 1.1, ease: 'power3.inOut' }, '<');
  }

  function animateHeroEntrance() {
    gsap.fromTo('.hero-title',
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }
    );
    gsap.fromTo('.hero-description',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, delay: 0.15, ease: 'power3.out' }
    );
    gsap.fromTo('.hero-actions',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: 'power3.out' }
    );
    gsap.fromTo('.stat-item',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, delay: 0.45, ease: 'back.out(1.4)' }
    );
  }
}

/* 3. AMBIENT GOLD PARTICLES DUST CANVAS */
function initAmbientDustParticles() {
  const canvas = document.getElementById('dustCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const isMobile = window.innerWidth <= 768;
  const particleCount = isMobile ? 22 : 45;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * 0.02,
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      p.opacity += Math.sin(Date.now() * p.pulse) * 0.01;
      const safeOpacity = Math.max(0.1, Math.min(0.75, p.opacity));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${safeOpacity})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#d4af37';
      ctx.fill();
    });

    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}

/* 4. CUSTOM CURSOR & MAGNETIC PHYSICS (Desktop only) */
function initCustomCursorAndMagnetics() {
  if (window.innerWidth <= 1024) return;

  const dot = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.cursor-follower');
  const cursorText = document.querySelector('.cursor-follower .cursor-text');

  if (!dot || !follower) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.16;
    followerY += (mouseY - followerY) * 0.16;
    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;
    requestAnimationFrame(animateFollower);
  }
  requestAnimationFrame(animateFollower);

  document.querySelectorAll('a, button, .residence-card, .filter-pill-btn, .material-card, .metric-box').forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  const reelViewport = document.querySelector('.reel-3d-viewport');
  if (reelViewport) {
    reelViewport.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-drag');
      if (cursorText) cursorText.textContent = 'DRAG';
    });
    reelViewport.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-drag');
      if (cursorText) cursorText.textContent = '';
    });
  }

  const magnetics = document.querySelectorAll('[data-magnetic="true"]');
  magnetics.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);

      gsap.to(btn, {
        x: relX * 0.25,
        y: relY * 0.25,
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)',
      });
    });
  });
}

/* 5. SIDE PROGRESS DOT NAVIGATION MATRIX */
function initSideDotNavigation() {
  const dots = document.querySelectorAll('.side-dot');
  if (!dots.length) return;

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetId = dot.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        if (lenis) {
          lenis.scrollTo(targetEl, { duration: 1.4 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  const sections = document.querySelectorAll('section[id], footer[id]');
  sections.forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onEnter: () => setActiveDot(section.id),
      onEnterBack: () => setActiveDot(section.id),
    });
  });

  function setActiveDot(id) {
    dots.forEach((dot) => {
      dot.classList.toggle('active', dot.getAttribute('data-target') === id);
    });
  }
}

/* 6. MOBILE APP BOTTOM BAR & DRAWER NAVIGATION */
function initMobileAppNavigation() {
  const bottomTabs = document.querySelectorAll('.mobile-app-tab[data-tab]');
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  // Bottom Tabs Click Smooth Scroll
  bottomTabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = tab.getAttribute('data-tab');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        if (lenis) {
          lenis.scrollTo(targetEl, { duration: 1.1 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Track active section for bottom app bar
  const sectionMapping = ['hero', 'wellness', 'reel', 'residences'];
  sectionMapping.forEach((id) => {
    const sec = document.getElementById(id);
    if (sec) {
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => updateBottomBarTab(id),
        onEnterBack: () => updateBottomBarTab(id),
      });
    }
  });

  function updateBottomBarTab(id) {
    bottomTabs.forEach((tab) => {
      tab.classList.toggle('active', tab.getAttribute('data-tab') === id);
    });
  }

  // Mobile Drawer Toggle
  if (menuToggleBtn && mobileDrawer) {
    menuToggleBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      if (lenis) lenis.stop();
    });
  }

  function closeDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.remove('open');
      if (lenis) lenis.start();
    }
  }

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (mobileDrawer) {
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) closeDrawer();
    });
  }

  drawerLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetEl = document.getElementById(targetId);
      closeDrawer();
      if (targetEl) {
        setTimeout(() => {
          if (lenis) lenis.scrollTo(targetEl, { duration: 1.2 });
          else targetEl.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    });
  });
}

/* 7. SECTION 1: HERO PINNED PARALLAX */
function initHeroSectionAnimation() {
  const isMobile = window.innerWidth <= 768;

  const heroTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: isMobile ? '+=60%' : '+=100%',
      pin: !isMobile,
      scrub: 1,
    }
  });

  heroTl
    .to('.hero-video-or-img', { scale: 1.35, ease: 'none' }, 0)
    .to('.hero-content', { y: -70, opacity: 0, scale: 0.9, ease: 'power2.in' }, 0)
    .to('.scroll-indicator', { opacity: 0, ease: 'power1.out' }, 0);
}

/* 8. SECTION 2: DOORS PINNED PORTAL REVEAL */
function initDoorsPortalAnimation() {
  const isMobile = window.innerWidth <= 768;

  const doorsTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.doors-portal-section',
      start: 'top top',
      end: isMobile ? '+=100%' : '+=150%',
      pin: true,
      scrub: 1.2,
      anticipatePin: 1,
    }
  });

  doorsTl
    .to('.door-left', { xPercent: -100, ease: 'power2.inOut' }, 0)
    .to('.door-right', { xPercent: 100, ease: 'power2.inOut' }, 0)
    .fromTo('.portal-center-content',
      { scale: 0.85, opacity: 0, filter: 'blur(10px)' },
      { scale: 1, opacity: 1, filter: 'blur(0px)', ease: 'power2.out' },
      0.2
    );
}

/* 9. SECTION 3: NATURE PINNED HORIZONTAL SWEEP */
function initNaturePinnedAnimation() {
  if (window.innerWidth <= 1024) {
    // Natural slide-up for mobile
    gsap.fromTo('.nature-left-panel, .nature-right-panel',
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.nature-pinned-section',
          start: 'top 75%',
        }
      }
    );
    return;
  }

  const natureTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.nature-pinned-section',
      start: 'top top',
      end: '+=140%',
      pin: true,
      scrub: 1.2,
      anticipatePin: 1,
    }
  });

  natureTl
    .fromTo('.nature-left-panel',
      { xPercent: -120, opacity: 0 },
      { xPercent: 0, opacity: 1, ease: 'power3.out' },
      0
    )
    .fromTo('.nature-right-panel',
      { xPercent: 120, opacity: 0, scale: 0.85 },
      { xPercent: 0, opacity: 1, scale: 1, ease: 'power3.out' },
      0
    );
}

/* 10. SECTION 4: DUAL SCREEN PINNED / SPLIT-SCREEN STICKY SCROLL */
function initDualSplitScroll() {
  const navItems = document.querySelectorAll('.split-nav-item');
  const cardItems = document.querySelectorAll('.split-card-item');

  if (!cardItems.length || !navItems.length) return;

  navItems.forEach((nav) => {
    nav.addEventListener('click', () => {
      const targetId = nav.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        if (lenis) {
          lenis.scrollTo(targetEl, { offset: -80, duration: 1.2 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  cardItems.forEach((card, index) => {
    gsap.fromTo(card,
      { x: window.innerWidth > 768 ? 80 : 0, y: window.innerWidth <= 768 ? 40 : 0, opacity: 0.3 },
      {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    ScrollTrigger.create({
      trigger: card,
      start: 'top 55%',
      end: 'bottom 45%',
      onEnter: () => setActiveSplitTab(index),
      onEnterBack: () => setActiveSplitTab(index),
    });
  });

  function setActiveSplitTab(idx) {
    navItems.forEach((n, i) => n.classList.toggle('active', i === idx));
    cardItems.forEach((c, i) => c.classList.toggle('active-in-view', i === idx));
  }
}

/* 11. SECTION 5: INSPIRED ARCHITECTURE HORIZONTAL CASCADE */
function initArchitectureHorizontalScroll() {
  const track = document.querySelector('.arch-slider-track');
  const section = document.querySelector('.arch-horizontal-section');

  if (!track || !section) return;

  function getScrollAmount() {
    const trackWidth = track.scrollWidth;
    return -(trackWidth - window.innerWidth + 80);
  }

  const isMobile = window.innerWidth <= 768;

  const archTl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${track.scrollWidth * (isMobile ? 0.8 : 1)}`,
      pin: true,
      scrub: 1.2,
      invalidateOnRefresh: true,
    }
  });

  archTl.to(track, {
    x: getScrollAmount,
    ease: 'none',
  });
}

/* 12. SECTION 6: 3D ROTATING FILM REEL */
function init3DRotatingFilmReel() {
  const cylinder = document.querySelector('.reel-cylinder');
  const items = document.querySelectorAll('.reel-item');
  const prevBtn = document.querySelector('.reel-prev-btn');
  const nextBtn = document.querySelector('.reel-next-btn');
  const reelSection = document.querySelector('.film-reel-section');

  if (!cylinder || !items.length || !reelSection) return;

  const totalItems = items.length;
  const anglePerItem = 360 / totalItems;

  let currentRotation = 0;
  let manualOffset = 0;
  let isDragging = false;
  let startX = 0;
  let startRotation = 0;
  let dragDistance = 0;

  function calculateRadius() {
    const cardWidth = cylinder.offsetWidth || (window.innerWidth < 768 ? 200 : 230);
    const angleRad = (360 / totalItems) * (Math.PI / 180);
    const baseRadius = (cardWidth / 2) / Math.tan(angleRad / 2);
    return Math.round(baseRadius + (window.innerWidth < 768 ? 14 : 20));
  }

  let radius = calculateRadius();

  function updateCardDepthLighting() {
    const isMobile = window.innerWidth < 768;
    items.forEach((item) => {
      const baseAngle = parseFloat(item.getAttribute('data-base-angle')) || 0;
      const relativeAngle = ((baseAngle + currentRotation) % 360 + 360) % 360;

      const distanceToFront = Math.min(relativeAngle, 360 - relativeAngle);
      const normalizedFactor = 1 - distanceToFront / 180;

      const brightness = 0.5 + normalizedFactor * 0.65;
      const blurAmount = isMobile ? 0 : (1 - normalizedFactor) * 2.5;
      const opacity = 0.45 + normalizedFactor * 0.55;

      item.style.filter = `brightness(${brightness}) ${blurAmount > 0 ? `blur(${blurAmount}px)` : ''}`;
      item.style.opacity = opacity;
      if (normalizedFactor > 0.88) {
        item.style.borderColor = 'rgba(212, 175, 55, 0.85)';
        item.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.8), 0 0 25px rgba(212, 175, 55, 0.3)';
      } else {
        item.style.borderColor = 'rgba(212, 175, 55, 0.25)';
        item.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.6)';
      }
    });
  }

  function applyRotation(angle) {
    currentRotation = angle;
    cylinder.style.transform = `rotateY(${currentRotation}deg)`;
    updateCardDepthLighting();
  }

  function layoutCards() {
    radius = calculateRadius();
    items.forEach((item, i) => {
      const angle = i * anglePerItem;
      item.setAttribute('data-base-angle', angle);
      item.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
    });
    updateCardDepthLighting();
  }

  layoutCards();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      layoutCards();
      ScrollTrigger.refresh();
    }, 120);
  });

  // 1. PIN SECTION & COMPLETE EXACTLY ONE FULL 360° ROUND ON SCROLL
  const reelObj = { angle: 0 };
  const isMobile = window.innerWidth <= 768;

  const reelTl = gsap.timeline({
    scrollTrigger: {
      trigger: reelSection,
      start: 'top top',
      end: isMobile ? '+=150%' : '+=200%',
      pin: true,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    }
  });

  // Exactly one full 360-degree round rotation across the pinned scroll duration
  reelTl.to(reelObj, {
    angle: -360,
    ease: 'none',
    onUpdate: () => {
      if (!isDragging) {
        applyRotation(reelObj.angle + manualOffset);
      }
    }
  });

  // 2. ARROW BUTTON CONTROLS (Smooth transition to next/prev card)
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const animObj = { val: manualOffset };
      gsap.to(animObj, {
        val: manualOffset - anglePerItem,
        duration: 0.55,
        ease: 'power2.out',
        onUpdate: () => {
          manualOffset = animObj.val;
          applyRotation(reelObj.angle + manualOffset);
        }
      });
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const animObj = { val: manualOffset };
      gsap.to(animObj, {
        val: manualOffset + anglePerItem,
        duration: 0.55,
        ease: 'power2.out',
        onUpdate: () => {
          manualOffset = animObj.val;
          applyRotation(reelObj.angle + manualOffset);
        }
      });
    });
  }

  // 3. CLICK CARD TO ROTATE DIRECTLY TO FRONT
  items.forEach((item) => {
    item.addEventListener('click', () => {
      if (Math.abs(dragDistance) > 8) return;
      const baseAngle = parseFloat(item.getAttribute('data-base-angle')) || 0;
      let diff = -baseAngle - (currentRotation % 360);
      diff = ((diff + 180) % 360 + 360) % 360 - 180;
      const targetOffset = manualOffset + diff;
      const animObj = { val: manualOffset };
      gsap.to(animObj, {
        val: targetOffset,
        duration: 0.65,
        ease: 'power2.out',
        onUpdate: () => {
          manualOffset = animObj.val;
          applyRotation(reelObj.angle + manualOffset);
        }
      });
    });
  });

  // 4. MOUSE DRAG & TOUCH SWIPE INTERACTION
  const viewport = document.querySelector('.reel-3d-viewport');
  if (viewport) {
    viewport.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startRotation = currentRotation;
      dragDistance = 0;
      viewport.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      dragDistance = deltaX;
      currentRotation = startRotation + deltaX * 0.38;
      manualOffset = currentRotation - reelObj.angle;
      cylinder.style.transform = `rotateY(${currentRotation}deg)`;
      updateCardDepthLighting();
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        viewport.style.cursor = 'grab';
        const snapped = Math.round(currentRotation / anglePerItem) * anglePerItem;
        const animObj = { val: currentRotation };
        gsap.to(animObj, {
          val: snapped,
          duration: 0.45,
          ease: 'power2.out',
          onUpdate: () => {
            currentRotation = animObj.val;
            manualOffset = currentRotation - reelObj.angle;
            cylinder.style.transform = `rotateY(${currentRotation}deg)`;
            updateCardDepthLighting();
          }
        });
      }
    });

    // Touch support for Mobile
    viewport.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].clientX;
      startRotation = currentRotation;
      dragDistance = 0;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const deltaX = e.touches[0].clientX - startX;
      dragDistance = deltaX;
      currentRotation = startRotation + deltaX * 0.52;
      manualOffset = currentRotation - reelObj.angle;
      cylinder.style.transform = `rotateY(${currentRotation}deg)`;
      updateCardDepthLighting();
    }, { passive: true });

    window.addEventListener('touchend', () => {
      if (isDragging) {
        isDragging = false;
        const snapped = Math.round(currentRotation / anglePerItem) * anglePerItem;
        const animObj = { val: currentRotation };
        gsap.to(animObj, {
          val: snapped,
          duration: 0.45,
          ease: 'power2.out',
          onUpdate: () => {
            currentRotation = animObj.val;
            manualOffset = currentRotation - reelObj.angle;
            cylinder.style.transform = `rotateY(${currentRotation}deg)`;
            updateCardDepthLighting();
          }
        });
      }
    });
  }
}

/* 13. SECTION 7: RESIDENCES STAGGERED ENTRY */
function initResidencesCurtainAnimation() {
  const grid = document.querySelector('.residences-grid');
  const cards = document.querySelectorAll('.residence-card');
  if (!grid || !cards.length) return;

  cards.forEach(card => card.classList.add('is-animating'));

  gsap.fromTo(cards,
    { y: 45, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.85,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: grid,
        start: 'top 85%',
        once: true
      },
      onComplete: () => {
        cards.forEach(c => {
          c.classList.remove('is-animating');
          gsap.set(c, { clearProps: 'transform' });
        });
      }
    }
  );
}

/* 14. SECTION 8: INTERIORS PINNED SPLIT-REVEAL */
function initInteriorsPinnedAnimation() {
  if (window.innerWidth <= 1024) {
    gsap.fromTo('.interior-preview-slider, .interior-text-panel',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.interiors-pinned-section', start: 'top 75%' }
      }
    );
    return;
  }

  const interiorTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.interiors-pinned-section',
      start: 'top top',
      end: '+=140%',
      pin: true,
      scrub: 1.2,
      anticipatePin: 1,
    }
  });

  interiorTl
    .fromTo('.interior-preview-slider',
      { yPercent: -80, opacity: 0, scale: 0.9 },
      { yPercent: 0, opacity: 1, scale: 1, ease: 'power2.out' },
      0
    )
    .fromTo('.interior-text-panel',
      { yPercent: 80, opacity: 0 },
      { yPercent: 0, opacity: 1, ease: 'power2.out' },
      0
    )
    .fromTo('.material-card',
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, stagger: 0.1, ease: 'back.out(1.5)' },
      0.3
    );
}

/* 15. SECTION 9: LOCATION PINNED CIRCLE EXPANSION */
function initLocationPinnedAnimation() {
  const isMobile = window.innerWidth <= 768;

  const locationTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.location-pinned-section',
      start: 'top top',
      end: isMobile ? '+=100%' : '+=150%',
      pin: true,
      scrub: 1.2,
    }
  });

  locationTl
    .fromTo('.location-bg-mask',
      { clipPath: 'circle(15% at 50% 50%)' },
      { clipPath: 'circle(100% at 50% 50%)', ease: 'power2.inOut' },
      0
    )
    .fromTo('.location-content-wrap h2, .location-content-wrap p, .location-content-wrap .tagline',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, ease: 'power2.out' },
      0.2
    )
    .fromTo('.metric-box',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, ease: 'power3.out' },
      0.4
    );
}

/* 16. SECTION 10: FOOTER REVEAL */
function initFooterAnimation() {
  gsap.fromTo('.footer-cta',
    { scale: 0.9, opacity: 0, y: 50 },
    {
      scale: 1,
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.site-footer',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    }
  );
}

/* 17. RESIDENCES FILTER & SPEC SWITCHER */
function initResidencesFilter() {
  const filterBtns = document.querySelectorAll('.filter-pill-btn');
  const cards = Array.from(document.querySelectorAll('.residence-card'));
  if (!filterBtns.length || !cards.length) return;

  let currentFilter = 'all';

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      if (filter === currentFilter) return;

      currentFilter = filter;
      filterBtns.forEach((b) => b.classList.toggle('active', b === btn));

      const toShow = [];
      const toHide = [];

      cards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          toShow.push(card);
        } else {
          toHide.push(card);
        }
      });

      // Stop previous tweens and disable CSS transform transitions while animating
      cards.forEach(c => {
        gsap.killTweensOf(c);
        c.classList.add('is-animating');
      });

      function animateIn() {
        toShow.forEach((c) => {
          c.style.display = 'flex';
          c.classList.add('is-animating');
        });

        gsap.fromTo(toShow,
          { opacity: 0, scale: 0.97, y: 14 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.28,
            stagger: 0.03,
            ease: 'power2.out',
            onComplete: () => {
              toShow.forEach((c) => {
                c.classList.remove('is-animating');
                gsap.set(c, { clearProps: 'transform' });
              });
              if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
              }
            }
          }
        );
      }

      if (toHide.length > 0) {
        gsap.to(toHide, {
          opacity: 0,
          scale: 0.97,
          y: 8,
          duration: 0.16,
          ease: 'power2.in',
          onComplete: () => {
            toHide.forEach((c) => {
              c.style.display = 'none';
              c.classList.remove('is-animating');
            });
            animateIn();
          }
        });
      } else {
        animateIn();
      }
    });
  });
}

/* 18. INTERIORS CROSSFADE SHOWCASE */
function initInteriorsShowcase() {
  const slides = document.querySelectorAll('.interior-slide-img');
  let currentSlide = 0;

  if (slides.length <= 1) return;

  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 4000);
}

/* 19. MODALS & BOTTOM SHEETS (MOBILE SWIPE DISMISSAL) */
function initModals() {
  const callbackModal = document.getElementById('callbackModal');
  const floorplanModal = document.getElementById('floorplanModal');
  const openCallbackBtns = document.querySelectorAll('.open-callback-modal');
  const openFloorplanBtns = document.querySelectorAll('.open-floorplan-btn');
  const closeBtns = document.querySelectorAll('.modal-close-btn, .modal-backdrop');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('open');
    if (lenis) lenis.stop();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    if (lenis) lenis.start();
  }

  openCallbackBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(floorplanModal);
      openModal(callbackModal);
    });
  });

  openFloorplanBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const planName = btn.getAttribute('data-title') || 'Residence Floor Plan';
      const planImg = btn.getAttribute('data-plan-img') || '';
      const modalTitle = document.getElementById('floorplanTitle');
      const modalImg = document.getElementById('floorplanImg');

      if (modalTitle) modalTitle.textContent = planName;
      if (modalImg && planImg) modalImg.src = planImg;

      openModal(floorplanModal);
    });
  });

  closeBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (e.target === btn || btn.classList.contains('modal-close-btn') || btn.closest('.modal-close-btn')) {
        closeModal(callbackModal);
        closeModal(floorplanModal);
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(callbackModal);
      closeModal(floorplanModal);
    }
  });

  const callbackForm = document.getElementById('callbackForm');
  if (callbackForm) {
    callbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = callbackForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = '<span>Request Sent ✓</span>';
        submitBtn.style.background = '#4CAF50';
        submitBtn.style.color = '#fff';
      }
      setTimeout(() => {
        closeModal(callbackModal);
        callbackForm.reset();
        if (submitBtn) {
          submitBtn.innerHTML = '<span>Submit Request</span>';
          submitBtn.style.background = '';
          submitBtn.style.color = '';
        }
      }, 1500);
    });
  }
}

/* 20. LUXURY AMBIENT SOUND ENGINE */
function initAudioEngine() {
  const soundBtn = document.getElementById('soundToggle');
  const soundWaves = document.querySelector('.sound-waves');
  let audioCtx = null;
  let isPlaying = false;
  let oscillator1, oscillator2, gainNode;

  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    if (!isPlaying) {
      startAmbientSound();
      isPlaying = true;
      if (soundWaves) soundWaves.classList.remove('paused');
    } else {
      stopAmbientSound();
      isPlaying = false;
      if (soundWaves) soundWaves.classList.add('paused');
    }
  });

  function startAmbientSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtx) audioCtx = new AudioContext();

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 3);
      gainNode.connect(audioCtx.destination);

      oscillator1 = audioCtx.createOscillator();
      oscillator1.type = 'sine';
      oscillator1.frequency.setValueAtTime(216, audioCtx.currentTime);
      oscillator1.connect(gainNode);
      oscillator1.start();

      oscillator2 = audioCtx.createOscillator();
      oscillator2.type = 'sine';
      oscillator2.frequency.setValueAtTime(324, audioCtx.currentTime);
      oscillator2.connect(gainNode);
      oscillator2.start();
    } catch (e) {
      console.log('Audio Context error:', e);
    }
  }

  function stopAmbientSound() {
    if (gainNode && audioCtx) {
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
      setTimeout(() => {
        if (oscillator1) oscillator1.stop();
        if (oscillator2) oscillator2.stop();
      }, 800);
    }
  }
}

/* 21. HEADER SHRINK & SCROLL DETECTOR */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = (y) => {
    header.classList.toggle('scrolled', y > 45);
  };

  if (lenis) {
    lenis.on('scroll', (e) => onScroll(e.scroll));
  } else {
    window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });
  }
}

// Ensure all ScrollTriggers are precisely synchronized once all assets finish loading
window.addEventListener('load', () => {
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
});
