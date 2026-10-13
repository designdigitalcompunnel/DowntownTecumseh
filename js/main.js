// Shared site utilities. Navigation, search, event filtering, and reveal effects
// are handled in tecumseh.js to avoid duplicate event listeners.
(() => {
  const header = document.getElementById('header');
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 45);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // Smooth-scroll only for valid in-page targets.
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Accessibility preferences persist, while the color theme follows the OS by default.
  // A manual theme choice is saved only after the visitor explicitly switches it.
  const preferenceKey = 'tecumseh-accessibility-preferences';
  const body = document.body;
  const readPreferences = () => {
    try { return JSON.parse(localStorage.getItem(preferenceKey) || '{}'); }
    catch (_) { return {}; }
  };
  const savedPreferences = readPreferences();
  const systemTheme = window.matchMedia('(prefers-color-scheme: light)');
  let userThemeOverride = savedPreferences.themeMode === 'light' || savedPreferences.themeMode === 'dark'
    ? savedPreferences.themeMode
    : null;
  const applyTheme = () => {
    const isLight = userThemeOverride ? userThemeOverride === 'light' : systemTheme.matches;
    body.classList.toggle('light-theme', isLight);
    const themeButton = document.querySelector('[data-accessibility="theme"]');
    if (themeButton) {
      themeButton.setAttribute('aria-pressed', String(!isLight));
      themeButton.textContent = isLight ? 'Switch to dark theme' : 'Switch to light theme';
    }
  };
  const savePreferences = () => {
    const prefs = {
      themeMode: userThemeOverride,
      larger: body.classList.contains('a11y-larger'),
      smaller: body.classList.contains('a11y-smaller'),
      highContrast: body.classList.contains('a11y-high-contrast'),
      underlineLinks: body.classList.contains('a11y-underline')
    };
    try { localStorage.setItem(preferenceKey, JSON.stringify(prefs)); } catch (_) {}
  };
  // Ignore the old saved lightTheme flag so first visit now respects the system setting.
  body.classList.toggle('a11y-larger', !!savedPreferences.larger);
  body.classList.toggle('a11y-smaller', !!savedPreferences.smaller);
  body.classList.toggle('a11y-high-contrast', !!savedPreferences.highContrast);
  body.classList.toggle('a11y-underline', !!savedPreferences.underlineLinks);
  applyTheme();
  systemTheme.addEventListener?.('change', () => { if (!userThemeOverride) applyTheme(); });

  // Shared accessibility panel controls.
  const fab = document.getElementById('accessibilityFab');
  const panel = document.getElementById('accessibilityPanel');
  const close = document.getElementById('accessibilityClose');
  if (!fab || !panel) return;
  const setOpen = open => {
    panel.hidden = !open;
    fab.setAttribute('aria-expanded', String(open));
    if (open) panel.querySelector('button')?.focus();
  };
  fab.addEventListener('click', () => setOpen(panel.hidden));
  close?.addEventListener('click', () => { setOpen(false); fab.focus(); });
  // Close the accessibility panel when a user clicks/taps outside it.
  document.addEventListener('pointerdown', event => {
    if (panel.hidden) return;
    if (!panel.contains(event.target) && !fab.contains(event.target)) setOpen(false);
  });
  const themeButton = panel.querySelector('[data-accessibility="theme"]');
  applyTheme();
  panel.querySelectorAll('[data-accessibility]').forEach(button => {
    button.addEventListener('click', () => {
      const action = button.dataset.accessibility;
      const body = document.body;
      if (action === 'larger') { body.classList.remove('a11y-smaller'); body.classList.add('a11y-larger'); }
      else if (action === 'smaller') { body.classList.remove('a11y-larger'); body.classList.add('a11y-smaller'); }
      else if (action === 'contrast') body.classList.toggle('a11y-high-contrast');
      else if (action === 'links') body.classList.toggle('a11y-underline');
      else if (action === 'theme') {
        const nextIsLight = !body.classList.contains('light-theme');
        userThemeOverride = nextIsLight ? 'light' : 'dark';
        applyTheme();
      } else {
        body.classList.remove('a11y-larger', 'a11y-smaller', 'a11y-high-contrast', 'a11y-underline');
        userThemeOverride = null;
        applyTheme();
      }
      savePreferences();
      applyTheme();
    });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) { setOpen(false); fab.focus(); }
  });
})();
