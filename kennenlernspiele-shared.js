// Cookie-Consent-Banner und Impressum-Panel für die Kennenlernspiele-Seitenfamilie.
(function () {
    const banner = document.getElementById('cookieBanner');
    if (banner) {
        const accept = document.getElementById('cookieAccept');
        const decline = document.getElementById('cookieDecline');

        const hideBanner = () => banner.classList.remove('is-visible');
        const storeConsent = (value) => {
            try {
                localStorage.setItem('cookieConsent', value);
            } catch (error) {
                console.warn('Cookie consent could not be saved', error);
            }
            hideBanner();
        };

        const existingConsent = (() => {
            try {
                return localStorage.getItem('cookieConsent');
            } catch (error) {
                console.warn('Cookie consent could not be read', error);
                return null;
            }
        })();

        if (!existingConsent) {
            banner.classList.add('is-visible');
        }

        accept?.addEventListener('click', () => storeConsent('accepted'));
        decline?.addEventListener('click', () => storeConsent('declined'));
    }

    const panel = document.getElementById('impressumPanel');
    const toggle = document.getElementById('impressumToggle');
    const closeBtn = document.getElementById('impressumClose');
    if (panel && toggle) {
        const applyState = (open) => {
            panel.classList.toggle('is-visible', open);
            panel.setAttribute('aria-hidden', String(!open));
            toggle.setAttribute('aria-expanded', String(open));
            toggle.textContent = open ? 'Impressum verbergen' : 'Impressum anzeigen';
        };

        applyState(false);
        const handleToggle = () => {
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            applyState(!expanded);
        };

        toggle.addEventListener('click', handleToggle);
        closeBtn?.addEventListener('click', () => applyState(false));
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                applyState(false);
            }
        });
    }
})();
