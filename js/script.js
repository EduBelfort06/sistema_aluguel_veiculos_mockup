document.addEventListener('DOMContentLoaded', function () {
    const forms = document.querySelectorAll('form');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const storageKey = 'dudsmobirent-theme';

    function setTheme(theme) {
        document.documentElement.setAttribute('data-bs-theme', theme);
        if (themeToggleBtn) {
            themeToggleBtn.textContent = theme === 'dark' ? 'Modo Claro' : 'Modo Escuro';
            themeToggleBtn.classList.toggle('btn-outline-light', theme === 'dark');
            themeToggleBtn.classList.toggle('btn-outline-dark', theme === 'light');
        }
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem(storageKey);
        if (savedTheme === 'light' || savedTheme === 'dark') {
            return savedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    if (themeToggleBtn) {
        const initialTheme = loadTheme();
        setTheme(initialTheme);

        themeToggleBtn.addEventListener('click', function () {
            const nextTheme = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
            setTheme(nextTheme);
            localStorage.setItem(storageKey, nextTheme);
        });
    } else {
        setTheme(loadTheme());
    }

    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Ação realizada com sucesso! (Mockup)');
            form.reset();
        });
    });
});