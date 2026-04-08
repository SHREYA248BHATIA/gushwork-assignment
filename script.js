/**
 * MANGALAM HDPE PIPES – script.js
 *
 * 1.  Sticky header          (IntersectionObserver on main header)
 * 2.  Sticky product bar     (IntersectionObserver on hero section)
 * 3.  Modal – catalogue      (triggered by .js-open-catalogue)
 * 4.  Modal – callback       (triggered by .js-open-callback)
 * 5.  Product image carousel (thumbnails, prev/next, keyboard)
 * 6.  Main-image zoom        (lens + overlapping result panel – image 12 style)
 * 7.  Thumbnail hover zoom   (tooltip above thumbnail)
 * 8.  Applications carousel  (prev/next, Section 6)
 * 9.  Manufacturing tabs     (Section 7)
 * 10. FAQ accordion          (Section 5)
 * 11. Catalogue form         (inline email capture)
 * 12. Contact form           (Section 11)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ═══════════════════════════════════════════════
     HELPER – lock/unlock body scroll when modal open
  ════════════════════════════════════════════════ */
  function lockScroll()   { document.body.style.overflow = 'hidden'; }
  function unlockScroll() { document.body.style.overflow = ''; }

  /* ═══════════════════════════════════════════════
     1. STICKY HEADER
     Slides in when main header leaves viewport.
  ════════════════════════════════════════════════ */
  const stickyHeader = document.getElementById('stickyHeader');
  const mainHeader   = document.getElementById('mainHeader');

  if (stickyHeader && mainHeader) {
    new IntersectionObserver(([e]) => {
      const visible = e.isIntersecting;
      stickyHeader.classList.toggle('is-visible', !visible);
      stickyHeader.setAttribute('aria-hidden', String(visible));
    }, { threshold: 0 }).observe(mainHeader);
  }

  /* ═══════════════════════════════════════════════
     2. STICKY PRODUCT BAR
     Appears when the product hero section leaves viewport.
     Sits below sticky-header (top: 60px when header is also visible).
  ════════════════════════════════════════════════ */
  const productBar     = document.getElementById('productBar');
  const productSection = document.getElementById('productSection');

  if (productBar && productSection) {
    new IntersectionObserver(([e]) => {
      const gone = !e.isIntersecting;
      productBar.classList.toggle('is-visible', gone);
      productBar.setAttribute('aria-hidden', String(!gone));

      // Position below sticky header when both visible
      if (gone && stickyHeader?.classList.contains('is-visible')) {
        productBar.style.top = '60px';
      } else {
        productBar.style.top = '0';
      }
    }, { threshold: 0.1 }).observe(productSection);
  }

  /* ═══════════════════════════════════════════════
     3. MODAL – CATALOGUE EMAIL
     Opens on .js-open-catalogue clicks.
     "Download Brochure" button enabled only when email filled.
  ════════════════════════════════════════════════ */
  const modalCatalogue     = document.getElementById('modalCatalogue');
  const closeCatalogue     = document.getElementById('closeCatalogue');
  const catEmailInput      = document.getElementById('catEmail');
  const btnDownloadBrochure= document.getElementById('btnDownloadBrochure');

  function openCatalogueModal() {
    modalCatalogue.classList.add('is-open');
    lockScroll();
    catEmailInput?.focus();
  }
  function closeCatalogueModal() {
    modalCatalogue.classList.remove('is-open');
    unlockScroll();
  }

  // Trigger buttons
  document.querySelectorAll('.js-open-catalogue').forEach(btn =>
    btn.addEventListener('click', openCatalogueModal)
  );

  closeCatalogue?.addEventListener('click', closeCatalogueModal);

  // Close on backdrop click (outside modal card)
  modalCatalogue?.addEventListener('click', e => {
    if (e.target === modalCatalogue) closeCatalogueModal();
  });

  // Enable "Download Brochure" once a valid email is entered
  catEmailInput?.addEventListener('input', () => {
    const valid = catEmailInput.value.trim().includes('@');
    btnDownloadBrochure.disabled = !valid;
    btnDownloadBrochure.classList.toggle('is-ready', valid);
  });

  btnDownloadBrochure?.addEventListener('click', () => {
    if (btnDownloadBrochure.disabled) return;
    // Replace with real download / API call
    closeCatalogueModal();
    alert('Catalogue will be emailed to ' + catEmailInput.value);
  });

  /* ═══════════════════════════════════════════════
     4. MODAL – REQUEST A CALL BACK
     Opens on .js-open-callback clicks.
  ════════════════════════════════════════════════ */
  const modalCallback  = document.getElementById('modalCallback');
  const closeCallback  = document.getElementById('closeCallback');
  const btnSubmitCB    = document.getElementById('btnSubmitCallback');

  function openCallbackModal() {
    modalCallback.classList.add('is-open');
    lockScroll();
    modalCallback.querySelector('.modal__input')?.focus();
  }
  function closeCallbackModal() {
    modalCallback.classList.remove('is-open');
    unlockScroll();
  }

  document.querySelectorAll('.js-open-callback').forEach(btn =>
    btn.addEventListener('click', openCallbackModal)
  );

  closeCallback?.addEventListener('click', closeCallbackModal);
  modalCallback?.addEventListener('click', e => {
    if (e.target === modalCallback) closeCallbackModal();
  });

  btnSubmitCB?.addEventListener('click', () => {
    // Basic validation – highlight empty required fields
    let valid = true;
    modalCallback.querySelectorAll('input[required], input[aria-label="Full name"], input[aria-label="Email address"]').forEach(inp => {
      if (!inp.value.trim()) {
        inp.style.borderColor = '#ef4444';
        valid = false;
      } else {
        inp.style.borderColor = '';
      }
    });
    if (!valid) return;
    closeCallbackModal();
    alert('Thank you! Our team will call you back shortly.');
  });

  // Close both modals on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeCatalogueModal();
      closeCallbackModal();
    }
  });

  /* ═══════════════════════════════════════════════
     5. PRODUCT IMAGE CAROUSEL
  ════════════════════════════════════════════════ */
  const carouselImages = [
    { src: 'https://picsum.photos/seed/hdpe01/550/460', alt: 'HDPE Pipes view 1' },
    { src: 'https://picsum.photos/seed/hdpe02/550/460', alt: 'HDPE Pipes view 2' },
    { src: 'https://picsum.photos/seed/hdpe03/550/460', alt: 'HDPE Pipes view 3' },
    { src: 'https://picsum.photos/seed/hdpe04/550/460', alt: 'HDPE Pipes view 4' },
    { src: 'https://picsum.photos/seed/hdpe05/550/460', alt: 'HDPE Pipes view 5' },
    { src: 'https://picsum.photos/seed/hdpe06/550/460', alt: 'HDPE Pipes view 6' },
  ];

  const mainImage    = document.getElementById('mainImage');
  const thumbStrip   = document.getElementById('thumbStrip');
  const prevBtn      = document.getElementById('prevBtn');
  const nextBtn      = document.getElementById('nextBtn');
  const carouselStage= document.getElementById('carouselStage');
  let   currentIdx   = 0;

  function buildThumbs() {
    if (!thumbStrip) return;
    thumbStrip.innerHTML = '';
    carouselImages.forEach((img, i) => {
      const el = document.createElement('div');
      el.className = 'thumb' + (i === 0 ? ' is-active' : '');
      el.setAttribute('role', 'listitem');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', `View image ${i + 1}`);

      const im = document.createElement('img');
      im.src     = img.src;
      im.alt     = img.alt;
      im.loading = 'lazy';
      el.appendChild(im);

      el.addEventListener('click', () => goTo(i));
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') goTo(i); });
      el.addEventListener('mouseenter', () => showThumbTooltip(img.src, el));
      el.addEventListener('mouseleave', hideThumbTooltip);
      thumbStrip.appendChild(el);
    });
  }

  function goTo(index) {
    if (!mainImage) return;
    currentIdx = (index + carouselImages.length) % carouselImages.length;
    mainImage.style.opacity = '0';
    setTimeout(() => {
      mainImage.src = carouselImages[currentIdx].src;
      mainImage.alt = carouselImages[currentIdx].alt;
      mainImage.style.opacity = '1';
      updateZoomBg();
    }, 160);
    thumbStrip?.querySelectorAll('.thumb').forEach((t, i) =>
      t.classList.toggle('is-active', i === currentIdx)
    );
  }

  prevBtn?.addEventListener('click', () => goTo(currentIdx - 1));
  nextBtn?.addEventListener('click', () => goTo(currentIdx + 1));
  carouselStage?.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  goTo(currentIdx - 1);
    if (e.key === 'ArrowRight') goTo(currentIdx + 1);
  });

  // Mobile swipe support for main product images
  if (carouselStage) {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchDX     = 0;
    let touchLocked = false;

    const MIN_SWIPE_PX = 40;
    const LOCK_DELTA_PX = 10;

    const isButtonTarget = (t) => Boolean(t?.closest && t.closest('button'));

    carouselStage.addEventListener('touchstart', e => {
      if (e.touches.length !== 1) return;
      if (isButtonTarget(e.target)) return; // avoid hijacking button taps

      const t = e.touches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
      touchDX = 0;
      touchLocked = false;
    }, { passive: true });

    carouselStage.addEventListener('touchmove', e => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      touchDX = dx;

      if (!touchLocked) {
        // Lock into horizontal swipe only when it clearly dominates vertical movement
        if (Math.abs(dx) > LOCK_DELTA_PX && Math.abs(dx) > Math.abs(dy)) {
          touchLocked = true;
        }
      }

      if (touchLocked) e.preventDefault();
    }, { passive: false });

    const end = () => {
      if (!touchLocked) return;
      if (Math.abs(touchDX) < MIN_SWIPE_PX) return;
      // Finger swipes left => go to next image
      touchDX < 0 ? goTo(currentIdx + 1) : goTo(currentIdx - 1);
      touchLocked = false;
    };

    carouselStage.addEventListener('touchend', end, { passive: true });
    carouselStage.addEventListener('touchcancel', end, { passive: true });
  }

  buildThumbs();

  /* ═══════════════════════════════════════════════
     6. MAIN-IMAGE ZOOM (image-12 style)
     Lens follows cursor on main image; result panel
     appears overlapping to the right at the same
     vertical position as the cursor.
  ════════════════════════════════════════════════ */
  const zoomLens   = document.getElementById('zoomLens');
  const zoomResult = document.getElementById('zoomResult');
  const ZOOM       = 2.8;

  // Cached stage rect – updated on enter to avoid reflow on every mousemove
  let stageRect   = null;
  let rafPending  = false;
  let pendingX    = 0;
  let pendingY    = 0;

  function updateZoomBg() {
    if (!zoomResult || !mainImage) return;
    zoomResult.style.backgroundImage = `url('${mainImage.src}')`;
  }

  function applyZoom(mouseX, mouseY) {
    const r  = stageRect;
    const lW = zoomLens.offsetWidth;
    const lH = zoomLens.offsetHeight;

    // Clamp lens centre inside stage
    let lx = mouseX - r.left - lW / 2;
    let ly = mouseY - r.top  - lH / 2;
    lx = Math.max(0, Math.min(lx, r.width  - lW));
    ly = Math.max(0, Math.min(ly, r.height - lH));

    // Move lens with transform (GPU composite layer – zero layout cost)
    zoomLens.style.transform = `translate(${lx}px, ${ly}px)`;

    // Shift result background to show zoomed area
    zoomResult.style.backgroundPosition = `${-lx * ZOOM}px ${-ly * ZOOM}px`;

    // Vertically track cursor for result panel (top property, acceptable here
    // because it only runs once per rAF tick, not on every event)
    const rH   = zoomResult.offsetHeight;
    let   rTop = (mouseY - r.top) - rH / 2;
    rTop = Math.max(0, Math.min(rTop, r.height - rH));
    zoomResult.style.top = rTop + 'px';
  }

  if (mainImage && zoomLens && zoomResult && carouselStage) {

    carouselStage.addEventListener('mouseenter', () => {
      if (window.innerWidth < 900) return;
      // Cache rect once on enter (avoids repeated reflow in mousemove)
      stageRect = carouselStage.getBoundingClientRect();
      zoomResult.style.backgroundSize = `${stageRect.width * ZOOM}px ${stageRect.height * ZOOM}px`;
      updateZoomBg();
      zoomLens.classList.add('is-active');
      zoomResult.classList.add('is-active');
    });

    carouselStage.addEventListener('mouseleave', () => {
      zoomLens.classList.remove('is-active');
      zoomResult.classList.remove('is-active');
      rafPending = false;
    });

    carouselStage.addEventListener('mousemove', e => {
      if (window.innerWidth < 900) return;
      // Store latest pointer coords
      pendingX = e.clientX;
      pendingY = e.clientY;
      // Batch DOM writes into a single rAF – silky 60 fps
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(() => {
          applyZoom(pendingX, pendingY);
          rafPending = false;
        });
      }
    });
  }

  /* ═══════════════════════════════════════════════
     7. THUMBNAIL HOVER ZOOM TOOLTIP
  ════════════════════════════════════════════════ */
  const thumbTooltip    = document.getElementById('thumbTooltip');
  const thumbTooltipImg = document.getElementById('thumbTooltipImg');
  const carousel        = document.getElementById('carousel');

  function showThumbTooltip(src, el) {
    if (!thumbTooltip) return;
    thumbTooltipImg.src = src;
    thumbTooltip.style.display = 'block';
    const tR = el.getBoundingClientRect();
    const cR = carousel.getBoundingClientRect();
    let left = tR.left - cR.left;
    left = Math.min(Math.max(0, left), cR.width - 200 - 4);
    thumbTooltip.style.left   = left + 'px';
    thumbTooltip.style.bottom = (cR.bottom - tR.top + 10) + 'px';
    thumbTooltip.setAttribute('aria-hidden', 'false');
  }

  function hideThumbTooltip() {
    if (!thumbTooltip) return;
    thumbTooltip.style.display = 'none';
    thumbTooltip.setAttribute('aria-hidden', 'true');
  }

  /* ═══════════════════════════════════════════════
     8. APPLICATIONS CAROUSEL – INFINITE LOOP
        prev/next buttons + keyboard + mouse wheel
  ════════════════════════════════════════════════ */
  (function () {
    const track = document.getElementById('appsTrack');
    const wrap  = track ? track.closest('.apps-track-wrap') : null;
    const btnPrev = document.getElementById('appsPrev');
    const btnNext = document.getElementById('appsNext');
    if (!track || !wrap) return;

    const originals = Array.from(track.children);
    const TOTAL     = originals.length;
    originals.forEach(c => track.appendChild(c.cloneNode(true)));

    let CARD_W = originals[0].offsetWidth + 18;
    window.addEventListener('resize', () => {
      CARD_W = originals[0].offsetWidth + 18;
      goTo(idx, false);
    });

    let idx = 0;
    let isTransitioning = false;

    function goTo(newIdx, animate = true) {
      idx = newIdx;
      track.style.transition = animate ? 'transform 0.5s cubic-bezier(.4,0,.2,1)' : 'none';
      track.style.transform = `translateX(-${idx * CARD_W}px)`;
    }

    track.addEventListener('transitionend', () => {
      isTransitioning = false;
      if (idx >= TOTAL) goTo(idx - TOTAL, false);
    });

    function next() {
      if (isTransitioning) return;
      isTransitioning = true;
      goTo(idx + 1);
    }
    function prev() {
      if (isTransitioning) return;
      isTransitioning = true;
      if (idx === 0) {
        goTo(TOTAL, false);
        requestAnimationFrame(() => requestAnimationFrame(() => goTo(TOTAL - 1)));
      } else {
        goTo(idx - 1);
      }
    }

    if (btnNext) btnNext.addEventListener('click', next);
    if (btnPrev) btnPrev.addEventListener('click', prev);

    wrap.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); }
    });

    let wheelAccum = 0;
    wrap.addEventListener('wheel', e => {
      const delta = Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
      if (!delta) return;
      e.preventDefault();
      wheelAccum += delta;
      if (Math.abs(wheelAccum) >= CARD_W * 0.3) {
        wheelAccum > 0 ? next() : prev();
        wheelAccum = 0;
      }
    }, { passive: false });

    // Mobile swipe support (touch drag -> discrete next/prev)
    let touchStartX = 0;
    let touchStartY = 0;
    let touchDX = 0;
    let touchLocked = false;

    const LOCK_DELTA_PX = 10;

    wrap.addEventListener('touchstart', e => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
      touchDX = 0;
      touchLocked = false;
    }, { passive: true });

    wrap.addEventListener('touchmove', e => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      touchDX = dx;

      if (!touchLocked) {
        if (Math.abs(dx) > LOCK_DELTA_PX && Math.abs(dx) > Math.abs(dy)) {
          touchLocked = true;
        }
      }

      if (touchLocked) e.preventDefault();
    }, { passive: false });

    const end = () => {
      if (!touchLocked) return;
      const threshold = Math.max(40, CARD_W * 0.15);
      if (Math.abs(touchDX) < threshold) return;
      touchDX < 0 ? next() : prev();
      touchLocked = false;
    };

    wrap.addEventListener('touchend', end, { passive: true });
    wrap.addEventListener('touchcancel', end, { passive: true });
  })();

  /* ═══════════════════════════════════════════════
     9. MANUFACTURING PROCESS TABS + MOBILE STEP NAV
  ════════════════════════════════════════════════ */
  const processTabs   = Array.from(document.querySelectorAll('.process-tab'));
  const processPanels = Array.from(document.querySelectorAll('.process-panel'));
  const stepBadge     = document.getElementById('stepBadge');
  const mobilePrev    = document.getElementById('processMobilePrev');
  const mobileNext    = document.getElementById('processMobileNext');
  const stepLabels    = processTabs.map(t => t.textContent.trim());
  let   activeStep    = 0;

  function activateStep(index) {
    activeStep = Math.max(0, Math.min(index, processTabs.length - 1));

    processTabs.forEach((t, i) => {
      t.classList.toggle('process-tab--active', i === activeStep);
      t.setAttribute('aria-selected', String(i === activeStep));
    });
    processPanels.forEach((p, i) =>
      p.classList.toggle('process-panel--active', i === activeStep)
    );

    // Update mobile step badge
    if (stepBadge) {
      stepBadge.textContent = `Step ${activeStep + 1}/${processTabs.length}: ${stepLabels[activeStep]}`;
    }

    // Dim prev/next at boundaries
    if (mobilePrev) mobilePrev.style.opacity = activeStep === 0 ? '0.35' : '1';
    if (mobileNext) mobileNext.style.opacity = activeStep === processTabs.length - 1 ? '0.35' : '1';
  }

  // Desktop tab clicks
  processTabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activateStep(i));
  });

  // Mobile prev / next
  mobilePrev?.addEventListener('click', () => activateStep(activeStep - 1));
  mobileNext?.addEventListener('click', () => activateStep(activeStep + 1));

  // Initialise
  activateStep(0);

  /* ═══════════════════════════════════════════════
     10. FAQ ACCORDION (Section 5)
  ════════════════════════════════════════════════ */
  const faqList = document.getElementById('faqList');
  if (faqList) {
    faqList.querySelectorAll('.faq-item__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const item   = btn.closest('.faq-item');
        const isOpen = item.classList.contains('faq-item--open');

        faqList.querySelectorAll('.faq-item').forEach(i => {
          i.classList.remove('faq-item--open');
          i.querySelector('.faq-item__btn').setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('faq-item--open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ═══════════════════════════════════════════════
     11. CATALOGUE INLINE FORM (email capture card)
  ════════════════════════════════════════════════ */
  const catalogueForm = document.getElementById('catalogueForm');
  if (catalogueForm) {
    catalogueForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('catalogueEmail')?.value?.trim();
      if (!email || !email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
      }
      catalogueForm.innerHTML =
        '<p style="color:#1e3a6e;font-weight:600;padding:12px 0">✓ Thank you! We\'ll email the catalogue shortly.</p>';
    });
  }

  /* ═══════════════════════════════════════════════
     12. TESTIMONIALS – INFINITE LOOP
         keyboard (←/→) + mouse wheel
  ════════════════════════════════════════════════ */
  (function () {
    const wrap  = document.querySelector('.testi-track-wrap');
    const track = document.getElementById('testiTrack');
    if (!wrap || !track) return;

    const originals = Array.from(track.children);
    const TOTAL     = originals.length;
    originals.forEach(c => track.appendChild(c.cloneNode(true)));

    let CARD_W = originals[0].offsetWidth + 20;
    window.addEventListener('resize', () => {
      CARD_W = originals[0].offsetWidth + 20;
      goTo(idx, false);
    });

    let idx = 0;
    let isTransitioning = false;

    function goTo(newIdx, animate = true) {
      idx = newIdx;
      track.style.transition = animate ? 'transform 0.5s cubic-bezier(.4,0,.2,1)' : 'none';
      track.style.transform = `translateX(-${idx * CARD_W}px)`;
    }

    track.addEventListener('transitionend', () => {
      isTransitioning = false;
      if (idx >= TOTAL) goTo(idx - TOTAL, false);
    });

    function next() {
      if (isTransitioning) return;
      isTransitioning = true;
      goTo(idx + 1);
    }
    function prev() {
      if (isTransitioning) return;
      isTransitioning = true;
      if (idx === 0) {
        goTo(TOTAL, false);
        requestAnimationFrame(() => requestAnimationFrame(() => goTo(TOTAL - 1)));
      } else {
        goTo(idx - 1);
      }
    }

    wrap.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); }
    });

    let wheelAccum = 0;
    wrap.addEventListener('wheel', e => {
      const delta = Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
      if (!delta) return;
      e.preventDefault();
      wheelAccum += delta;
      if (Math.abs(wheelAccum) >= CARD_W * 0.3) {
        wheelAccum > 0 ? next() : prev();
        wheelAccum = 0;
      }
    }, { passive: false });

    // Mobile swipe support (touch drag -> discrete next/prev)
    let touchStartX = 0;
    let touchStartY = 0;
    let touchDX = 0;
    let touchLocked = false;

    const LOCK_DELTA_PX = 10;

    wrap.addEventListener('touchstart', e => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
      touchDX = 0;
      touchLocked = false;
    }, { passive: true });

    wrap.addEventListener('touchmove', e => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      touchDX = dx;

      if (!touchLocked) {
        if (Math.abs(dx) > LOCK_DELTA_PX && Math.abs(dx) > Math.abs(dy)) {
          touchLocked = true;
        }
      }

      if (touchLocked) e.preventDefault();
    }, { passive: false });

    const end = () => {
      if (!touchLocked) return;
      const threshold = Math.max(40, CARD_W * 0.15);
      if (Math.abs(touchDX) < threshold) return;
      touchDX < 0 ? next() : prev();
      touchLocked = false;
    };

    wrap.addEventListener('touchend', end, { passive: true });
    wrap.addEventListener('touchcancel', end, { passive: true });
  })();

  /* ═══════════════════════════════════════════════
     13. CONTACT FORM (Section 11)
  ════════════════════════════════════════════════ */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      contactForm.querySelectorAll('input[required]').forEach(inp => {
        if (!inp.value.trim()) { inp.style.borderColor = '#ef4444'; valid = false; }
        else                   { inp.style.borderColor = ''; }
      });
      if (!valid) return;
      contactForm.innerHTML =
        '<p style="color:#fff;font-weight:600;font-size:1rem;padding:20px 0;text-align:center">✓ Request submitted! Our team will contact you within 24 hours.</p>';
    });
  }

}); // end DOMContentLoaded
