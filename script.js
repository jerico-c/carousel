// Get references to all the necessary DOM elements
const carouselContainer = document.querySelector('.carousel-container'); // NEW: Get the main container
const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.carousel-button--right');
const prevButton = document.querySelector('.carousel-button--left');
const dotsNav = document.querySelector('.carousel-nav');
const dots = Array.from(dotsNav.children);

// Get the width of a single slide
const slideWidth = slides[0].getBoundingClientRect().width;

// 1. Arrange the slides next to one another
const setSlidePosition = (slide, index) => {
    slide.style.left = slideWidth * index + 'px';
};
slides.forEach(setSlidePosition);

// --- Helper Functions ---

// Moves the carousel track to the target slide
const moveToSlide = (track, currentSlide, targetSlide) => {
    // If no target slide, loop back to the first slide (for autoplay)
    if (!targetSlide) { // NEW: Handle looping for autoplay
        targetSlide = slides[0];
    }
    track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
    currentSlide.classList.remove('current-slide');
    targetSlide.classList.add('current-slide');
    
    // Also update the dots when moving slide
    const currentDot = dotsNav.querySelector('.current-slide');
    const targetIndex = slides.findIndex(slide => slide === targetSlide);
    const targetDot = dots[targetIndex];
    
    updateDots(currentDot, targetDot);
    hideShowArrows(slides, prevButton, nextButton, targetIndex);
};

// Updates the active dot in the navigation
const updateDots = (currentDot, targetDot) => {
    if (currentDot) { // NEW: Check if currentDot exists before removing class
        currentDot.classList.remove('current-slide');
    }
    if (targetDot) { // NEW: Check if targetDot exists
        targetDot.classList.add('current-slide');
    }
}

// Hides/shows arrows based on the current slide index
const hideShowArrows = (slides, prevButton, nextButton, targetIndex) => {
    if (targetIndex === 0) {
        prevButton.classList.add('is-hidden');
        nextButton.classList.remove('is-hidden');
    } else if (targetIndex === slides.length - 1) {
        prevButton.classList.remove('is-hidden');
        nextButton.classList.add('is-hidden');
    } else {
        prevButton.classList.remove('is-hidden');
        nextButton.classList.remove('is-hidden');
    }
}

// --- Event Listeners ---

// When I click left, move slides to the left
prevButton.addEventListener('click', e => {
    const currentSlide = track.querySelector('.current-slide');
    const prevSlide = currentSlide.previousElementSibling;
    
    moveToSlide(track, currentSlide, prevSlide);
});

// When I click right, move slides to the right
nextButton.addEventListener('click', e => {
    const currentSlide = track.querySelector('.current-slide');
    const nextSlide = currentSlide.nextElementSibling;

    moveToSlide(track, currentSlide, nextSlide);
});

// When I click the nav indicators, move to that slide
dotsNav.addEventListener('click', e => {
    const targetDot = e.target.closest('button');

    if (!targetDot) return;

    const currentSlide = track.querySelector('.current-slide');
    const targetIndex = dots.findIndex(dot => dot === targetDot);
    const targetSlide = slides[targetIndex];

    moveToSlide(track, currentSlide, targetSlide);
});


// --- NEW: Autoplay Feature ---

let autoplayInterval; // Variable to hold our interval

const startAutoplay = () => {
    autoplayInterval = setInterval(() => {
        const currentSlide = track.querySelector('.current-slide');
        const nextSlide = currentSlide.nextElementSibling;
        
        // If there is a next slide, move to it. Otherwise, loop to the first slide.
        if (nextSlide) {
            moveToSlide(track, currentSlide, nextSlide);
        } else {
            moveToSlide(track, currentSlide, slides[0]);
        }
    }, 3000); // Change 3000 to whatever interval you want (in milliseconds)
};

const stopAutoplay = () => {
    clearInterval(autoplayInterval);
};

// Pause autoplay when mouse is over the carousel
carouselContainer.addEventListener('mouseenter', stopAutoplay);

// Resume autoplay when mouse leaves the carousel
carouselContainer.addEventListener('mouseleave', startAutoplay);

// Start the autoplay when the page loads
startAutoplay();
