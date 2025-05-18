document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    

    const cardData = [
        { img: '../Assets/science-divulgation.svg', title: 'Jornalismo de dados' },
        { img: '../Assets/newspaper-icon.svg', title: 'Divulgação científica' },

    ];
    

    function createCards() {

        cardData.slice(-2).forEach(data => {
            track.appendChild(createCardElement(data));
        });
        

        cardData.forEach(data => {
            track.appendChild(createCardElement(data));
        });
        

        cardData.slice(0, 2).forEach(data => {
            track.appendChild(createCardElement(data));
        });
    }
    
    function createCardElement(data) {
        const card = document.createElement('div');
        card.className = 'tech-card';
        card.innerHTML = `
            <img src="${data.img}" alt="${data.title}" class="tech-icon">
            <h3>${data.title}</h3>
        `;
        return card;
    }
    
    createCards();
    
    const cards = document.querySelectorAll('.tech-card');
    const cardCount = cards.length;
    const cardWidth = cards[0].offsetWidth + 60;
    let currentIndex = 2; 
    let isAnimating = false;
    
    function updateCarousel(direction) {
        if (isAnimating) return;
        isAnimating = true;
        
        cards.forEach((card, index) => {
            card.classList.toggle('active', index === currentIndex);
        });
        
        const offset = -currentIndex * cardWidth + (track.offsetWidth / 2 - cardWidth / 2);
        track.style.transition = 'transform 0.5s ease';
        track.style.transform = `translateX(${offset}px)`;
        
        setTimeout(() => {
            isAnimating = false;
            

            if (direction === 'next' && currentIndex >= cardCount - 2) {
                currentIndex = 2;
                track.style.transition = 'none';
                track.style.transform = `translateX(${-currentIndex * cardWidth + (track.offsetWidth / 2 - cardWidth / 2)}px`;
            } 
            else if (direction === 'prev' && currentIndex <= 1) {
                currentIndex = cardCount - 3;
                track.style.transition = 'none';
                track.style.transform = `translateX(${-currentIndex * cardWidth + (track.offsetWidth / 2 - cardWidth / 2)}px`;
            }
        }, 500);
    }
    
    function handleNavigation(direction) {
        currentIndex += direction === 'next' ? 1 : -1;
        updateCarousel(direction);
    }
    
    nextBtn.addEventListener('click', () => handleNavigation('next'));
    prevBtn.addEventListener('click', () => handleNavigation('prev'));
    

    cards[currentIndex].classList.add('active');
    updateCarousel();
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