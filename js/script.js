document.addEventListener('DOMContentLoaded', async () => {

    // AOS init
    if (typeof AOS !== 'undefined') {
        console.log('AOS init...');
        AOS.init({
            offset: 250,
            duration: 1000,
            once: true
        });
    } else {
        console.error('AOS is not defined, skipping init');
    }
});

function changeLanguage(lang) {
    translator.changeLang(lang)
        .then(() => {
            console.log('Language changed');
            renderTeamCarousel(); // Renderizar el carrusel después de cambiar el idioma
        })
        .catch(error => {
            console.error('Error changing language', error);
        });

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

function renderNewsGrid() {
    const newsItems = translator.getText('news.items');
    if (!newsItems) return;

    const newsGrid = document.getElementById('newsGrid');
    if (!newsGrid) return;

    newsGrid.innerHTML = newsItems.map((item, idx) => `
        <div class="col-12 col-md-6 col-lg-4 mb-4">
            <div class="news-card h-100 rounded">
                <div class="news-card-img-wrapper">
                    <img src="${item.image}" alt="${item.title}" class="news-card-img">
                </div>
                <div class="news-card-body p-3">
                    <div class="news-card-date mb-2">${new Date(item.date).toLocaleDateString()}</div>
                    <h5 class="news-card-title mb-2">${item.title}</h5>
                    <p class="news-card-summary mb-3">${item.summary}</p>
                    ${item.content ? `<button class="btn btn-sm btn-primary" data-news-idx="${idx}" data-i18n="news.readMore">Leer más</button>` : ''}
                </div>
            </div>
        </div>
    `).join('');

    // Añadir listeners a los botones "Leer más"
    document.querySelectorAll('[data-news-idx]').forEach(btn => {
        btn.addEventListener('click', function() {
            showNewsModal(parseInt(this.getAttribute('data-news-idx')));
        });
    });
}

function showNewsModal(idx) {
    const newsItems = translator.getText('news.items');
    if (!newsItems || !newsItems[idx]) return;
    const item = newsItems[idx];

    document.getElementById('newsModalLabel').textContent = item.title;
    document.getElementById('newsModalImg').src = item.image;
    document.getElementById('newsModalImg').alt = item.title;
    document.getElementById('newsModalDate').textContent = new Date(item.date).toLocaleDateString();
    document.getElementById('newsModalContent').textContent = item.content || '';

    // Mostrar el modal con Bootstrap 5
    const modal = new bootstrap.Modal(document.getElementById('newsModal'));
    modal.show();
}


document.addEventListener('DOMContentLoaded', async () => {
    await translator.changeLang('ca');

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

    // Load news
    renderNewsGrid();

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