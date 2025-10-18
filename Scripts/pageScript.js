document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const container = document.querySelector('.carousel-container');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');

    // Data for the cards
    const cardData = [
        { img: '/Assets/science-divulgation.svg', title: 'Jornalismo de dados' },
        { img: '/Assets/newspaper-icon.svg', title: 'Divulgação científica' },
        // Adicione mais itens aqui quando necessário
    ];

    // State
    let itemsPerView = 1;
    let clonesCount = 1; // equals itemsPerView but capped by data length
    let cards = [];
    let cardCount = 0; // total including clones
    let currentIndex = 0; // will start at clonesCount
    let cardWidth = 0;
    let isAnimating = false;
    let resizeTimer = null;

    function createCardElement(data) {
        const card = document.createElement('div');
        card.className = 'tech-card';
        card.innerHTML = `
            <img src="${data.img}" alt="${data.title}" class="tech-icon">
            <h3>${data.title}</h3>
        `;
        return card;
    }

    function getItemsPerView() {
        const w = window.innerWidth;
        if (w <= 480) return 1;
        if (w <= 1024) return 2;
        return 3;
    }

    function computeCardWidth() {
        const first = track.querySelector('.tech-card');
        if (!first) return 0;
        const styles = window.getComputedStyle(first);
        const marginLeft = parseFloat(styles.marginLeft) || 0;
        const marginRight = parseFloat(styles.marginRight) || 0;
        return first.offsetWidth + marginLeft + marginRight;
    }

    function clearTrack() {
        while (track.firstChild) track.removeChild(track.firstChild);
    }

    function buildCarousel() {
        clearTrack();

        const dataLen = cardData.length;
        if (dataLen === 0) return;

        itemsPerView = Math.min(getItemsPerView(), dataLen);
        clonesCount = itemsPerView;

        const leading = cardData.slice(-clonesCount);
        leading.forEach(d => track.appendChild(createCardElement(d)));

        cardData.forEach(d => track.appendChild(createCardElement(d)));

        const trailing = cardData.slice(0, clonesCount);
        trailing.forEach(d => track.appendChild(createCardElement(d)));

        cards = Array.from(track.querySelectorAll('.tech-card'));
        cardCount = cards.length;

        cardWidth = computeCardWidth();

        currentIndex = clonesCount;
        setActiveClasses();
        positionCarousel(false);
    }

    function setActiveClasses() {
        if (!cards || cards.length === 0) return;
        cards.forEach((card, index) => {
            const start = currentIndex;
            const end = currentIndex + itemsPerView - 1;
            card.classList.toggle('active', index >= start && index <= end);
        });
    }

    function getCenteredOffset() {
        const containerWidth = container ? container.clientWidth : track.offsetWidth;
        const visibleWidth = itemsPerView * cardWidth;
        const leftGutter = (containerWidth - visibleWidth) / 2;
        return -currentIndex * cardWidth + leftGutter;
    }

    function positionCarousel(animate = true) {
        const offset = getCenteredOffset();
        track.style.transition = animate ? 'transform 0.5s ease' : 'none';
        track.style.transform = `translateX(${offset}px)`;
    }

    function snapIfAtEdges(direction) {
        const originalsLen = cardData.length;
        const firstReal = clonesCount;
        const lastReal = clonesCount + originalsLen - 1;

        if (direction === 'next' && currentIndex > lastReal) {
            currentIndex = firstReal;
            positionCarousel(false);
        }

        if (direction === 'prev' && currentIndex < firstReal) {
            currentIndex = lastReal;
            positionCarousel(false);
        }
    }

    function navigate(direction) {
        if (isAnimating || cardCount === 0) return;
        isAnimating = true;

        currentIndex += direction === 'next' ? 1 : -1;
        setActiveClasses();
        positionCarousel(true);

        setTimeout(() => {
            snapIfAtEdges(direction);
            isAnimating = false;
        }, 500);
    }

    buildCarousel();

    if (nextBtn) nextBtn.addEventListener('click', () => navigate('next'));
    if (prevBtn) prevBtn.addEventListener('click', () => navigate('prev'));

    window.addEventListener('resize', () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const prevItemsPerView = itemsPerView;
            const prevCenteredItem = (currentIndex - clonesCount); // index in originals
            buildCarousel();

            if (!isNaN(prevCenteredItem) && prevCenteredItem >= 0) {
                currentIndex = Math.min(clonesCount + prevCenteredItem, cardCount - clonesCount - 1);
                setActiveClasses();
                positionCarousel(false);
            }
        }, 150);
    });
});

window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                toggle: false
            });
            bsCollapse.hide();
        }
    });
});
