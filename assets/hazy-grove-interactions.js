/* ==========================================================================
   Hazy Grove Interactions
   Deferred JS for behaviors the static mockups couldn't show
   ========================================================================== */

/* --------------------------------------------------------------------------
   Age Gate
   -------------------------------------------------------------------------- */

function initAgeGate() {
  var gate = document.querySelector('.hg-age-gate');
  if (!gate) return;

  if (localStorage.getItem('ageVerified') === 'true') {
    gate.remove();
    return;
  }

  gate.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Trap focus inside the age gate
  var focusableEls = gate.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
  var firstFocusable = focusableEls[0];
  var lastFocusable = focusableEls[focusableEls.length - 1];

  if (firstFocusable) firstFocusable.focus();

  gate.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  });

  var yesBtn = gate.querySelector('.hg-age-gate__btn--yes');
  var noBtn = gate.querySelector('.hg-age-gate__btn--no');

  if (yesBtn) {
    yesBtn.addEventListener('click', function () {
      localStorage.setItem('ageVerified', 'true');
      document.body.style.overflow = '';
      gate.classList.add('hiding');
      gate.addEventListener('transitionend', function () {
        gate.remove();
      }, { once: true });
    });
  }

  if (noBtn) {
    noBtn.addEventListener('click', function () {
      window.location.href = 'https://www.google.com';
    });
  }
}

/* --------------------------------------------------------------------------
   FAQ Category Filter
   -------------------------------------------------------------------------- */

function initFaqFilter() {
  var pills = document.querySelectorAll('.hg-faq-pill');
  var sections = document.querySelectorAll('.hg-faq-section[data-category]');

  if (!pills.length || !sections.length) return;

  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      var category = this.getAttribute('data-filter');

      // Update active pill
      pills.forEach(function (p) { p.classList.remove('active'); });
      this.classList.add('active');

      // Show/hide sections
      sections.forEach(function (section) {
        if (category === 'all' || section.getAttribute('data-category') === category) {
          section.classList.remove('hidden');
        } else {
          section.classList.add('hidden');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   FAQ Accordion
   -------------------------------------------------------------------------- */

function initFaqAccordion() {
  document.querySelectorAll('.hg-faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = this.closest('.hg-faq-item');
      var wasOpen = item.classList.contains('open');

      // Close all items in same section
      var section = item.closest('.hg-faq-section');
      if (section) {
        section.querySelectorAll('.hg-faq-item.open').forEach(function (el) {
          el.classList.remove('open');
          el.querySelector('.hg-faq-question').setAttribute('aria-expanded', 'false');
        });
      }

      // Toggle clicked item
      if (!wasOpen) {
        item.classList.add('open');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Init
   -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', function () {
  initAgeGate();
  initFaqFilter();
  initFaqAccordion();
});

// Support theme editor section reload
document.addEventListener('shopify:section:load', function () {
  initFaqFilter();
  initFaqAccordion();
});
