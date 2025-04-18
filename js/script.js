document.addEventListener('DOMContentLoaded', async () => {

    // AOS init
    if (typeof AOS !== 'undefined') {
        console.log('AOS init...');
        AOS.init({
            duration: 800,
            once: true
        });
    } else {
        console.error('AOS is not defined, skipping init');
    }

});

function changeLanguage(lang) {
    translator.changeLang(lang);

    // Update current language text
    document.getElementById('current-lang').textContent = lang.toUpperCase();

    // Update selected language in dropdown
    document.querySelectorAll('.dropdown-item').forEach(item => {
        if (item.getAttribute('data-lang') === lang) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
}

function toggleTheme() {
    const body = document.body;
    const icon = document.querySelector('#themeToggle i');

    if (body.classList.contains('light-theme')) {
        body.classList.remove('light-theme');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.add('light-theme');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Load theme from localStorage or dark by default
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        document.querySelector('#themeToggle i').classList.replace('fa-sun', 'fa-moon');
    } else {
        // Check if the icon is already set to moon
        document.querySelector('#themeToggle i').classList.replace('fa-moon', 'fa-sun');
    }

    // Set the initial language as selected
    const currentLang = document.getElementById('current-lang').textContent.toLowerCase();
    document.querySelector(`.dropdown-item[data-lang="${currentLang}"]`)?.classList.add('selected');

    // Dropdown animation
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('show.bs.dropdown', function () {
            const menu = this.querySelector('.dropdown-menu');
            menu.style.display = 'block';
            setTimeout(() => menu.classList.add('showing'), 0);
        });

        dropdown.addEventListener('hide.bs.dropdown', function () {
            const menu = this.querySelector('.dropdown-menu');
            menu.classList.remove('showing');
        });
    });

    window.addEventListener('scroll', function() {
        const hero = document.querySelector('.hero-section');
        const bg = document.querySelector('.hero-bg');
        if (!hero || !bg) return;

        // Get scroll position
        const scrolled = window.scrollY;

        // Move background slower than the scroll (parallax effect)
        // 0.5 is the multiplier, adjust it to your needs
        const translateY = scrolled * 0.5;
        const translateX = scrolled * -0.1;

        // Calculate opacity based on scroll position
        // Adjust the values to your needs
        const opacity = 1 - (scrolled / (hero.offsetHeight * 0.5));

        // Apply transformations
        bg.style.transform = `translateY(${translateY}px)`;
        bg.style.transform = `translateX(${translateX}px)`;
        bg.style.opacity = Math.max(0, Math.min(1, opacity));
    });
});