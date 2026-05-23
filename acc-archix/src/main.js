/**
 * Main JS for ACC Archix v2
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-in-out'
        });
    }

    // Scroll Navbar effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('py-2', 'shadow');
            navbar.classList.remove('py-3', 'shadow-sm');
        } else {
            navbar.classList.add('py-3', 'shadow-sm');
            navbar.classList.remove('py-2', 'shadow');
        }
    });

    // Simple Portfolio Filter (Conceptual)
    const filterLinks = document.querySelectorAll('.filter-nav .nav-link');
    filterLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Update UI
            filterLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const filter = link.getAttribute('data-filter');
            const items = document.querySelectorAll('.portfolio-item');

            items.forEach(item => {
                if (filter === '*' || item.classList.contains(filter.replace('.', ''))) {
                    item.style.display = 'block';
                    setTimeout(() => item.style.opacity = '1', 10);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => item.style.display = 'none', 400);
                }
            });
        });
    });

    // Form Submission (Demo)
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'Enviando...';
            btn.disabled = true;

            // Mock success
            setTimeout(() => {
                btn.innerText = '¡Mensaje Enviado!';
                btn.classList.add('bg-success');
                contactForm.reset();

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.classList.remove('bg-success');
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }
});
