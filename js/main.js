    // Mobile nav toggle
    const toggle = document.getElementById('mobileToggle');
    const links = document.getElementById('navLinks');
    toggle.addEventListener('click', () => links.classList.toggle('open'));

    // Shrink nav on scroll
    window.addEventListener('scroll', () => {
        document.querySelector('nav').style.padding =
            window.scrollY > 50 ? '10px 0' : '18px 0';
    });

    // Highlight today's row in hours table
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const today = days[new Date().getDay()];
    document.querySelectorAll('.hours-table tr').forEach(row => {
        if (row.children[0].textContent === today) row.classList.add('hours-today');
    });

    // Active nav link based on visible section
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navAnchors.forEach(a => a.classList.remove('active'));
                const active = document.querySelector('.nav-links a[href="#' + entry.target.id + '"]');
                if (active) active.classList.add('active');
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => observer.observe(s));

    // Smooth close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.addEventListener('click', () => links.classList.remove('open'));
    });

    // IG gallery: drag-to-scroll + arrow buttons
    const igScroll = document.getElementById('igScroll');
    if (igScroll) {
        // Center the scroll on load
        igScroll.scrollLeft = (igScroll.scrollWidth - igScroll.clientWidth) / 2;

        const scrollAmt = 316; // card width + gap
        document.getElementById('igArrowLeft').addEventListener('click', () => {
            igScroll.scrollBy({ left: -scrollAmt, behavior: 'smooth' });
        });
        document.getElementById('igArrowRight').addEventListener('click', () => {
            igScroll.scrollBy({ left: scrollAmt, behavior: 'smooth' });
        });

        let isDown = false, startX, scrollLeft, dragged = false;
        igScroll.addEventListener('mousedown', e => {
            isDown = true; dragged = false;
            igScroll.style.cursor = 'grabbing';
            startX = e.pageX - igScroll.offsetLeft;
            scrollLeft = igScroll.scrollLeft;
        });
        igScroll.addEventListener('mouseleave', () => { isDown = false; igScroll.style.cursor = 'grab'; });
        igScroll.addEventListener('mouseup', () => { isDown = false; igScroll.style.cursor = 'grab'; });
        igScroll.addEventListener('mousemove', e => {
            if (!isDown) return;
            e.preventDefault();
            dragged = true;
            const x = e.pageX - igScroll.offsetLeft;
            igScroll.scrollLeft = scrollLeft - (x - startX) * 1.5;
        });
        // Prevent link navigation when dragging
        igScroll.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', e => { if (dragged) e.preventDefault(); });
        });
        igScroll.style.cursor = 'grab';
    }

