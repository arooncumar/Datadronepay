// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in animation to sections
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.feature-box, .demo-card, .industry-card, .testimonial-card, .efficiency-card');
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeInObserver.observe(section);
    });
});

// Currency option selection
document.querySelectorAll('.currency-option').forEach(option => {
    option.addEventListener('click', function() {
        // Remove selected class from all options
        document.querySelectorAll('.currency-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        // Add selected class to clicked option
        this.classList.add('selected');
        // Check the radio button
        this.querySelector('input[type="radio"]').checked = true;
    });
});

// Animate flag circles
const flagCircles = document.querySelectorAll('.flag-circle');
flagCircles.forEach((flag, index) => {
    flag.style.animationDelay = `${index * 0.2}s`;
});

// Add hover effect to company logos
document.querySelectorAll('.company-logos img, .investor-logos img').forEach(logo => {
    logo.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    logo.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Simulate conversion animation
const conversionInputs = document.querySelectorAll('.conversion-input');
if (conversionInputs.length > 0) {
    setInterval(() => {
        conversionInputs.forEach(input => {
            input.style.transform = 'scale(1.02)';
            setTimeout(() => {
                input.style.transform = 'scale(1)';
            }, 200);
        });
    }, 3000);
}

// Add pulse animation to badges
const badges = document.querySelectorAll('.badge-green');
badges.forEach((badge, index) => {
    setTimeout(() => {
        badge.style.animation = 'pulse 2s infinite';
    }, index * 500);
});

// Add pulse keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
`;
document.head.appendChild(style);

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const flagsContainer = document.querySelector('.flags-container');
    
    if (flagsContainer && scrolled < 800) {
        flagsContainer.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
});

// Button hover effects
document.querySelectorAll('.btn-get-started, .btn-contact, .btn-learn-more, .btn-learn-white').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Mobile menu toggle (for responsive design)
const createMobileMenu = () => {
    if (window.innerWidth <= 768) {
        const navMenu = document.querySelector('.nav-menu');
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-toggle';
        mobileToggle.innerHTML = '☰';
        mobileToggle.style.cssText = `
            display: block;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
        `;
        
        const navWrapper = document.querySelector('.nav-wrapper');
        const navButtons = document.querySelector('.nav-buttons');
        
        if (!document.querySelector('.mobile-toggle')) {
            navWrapper.insertBefore(mobileToggle, navButtons);
        }
        
        mobileToggle.addEventListener('click', () => {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
            navMenu.style.position = 'absolute';
            navMenu.style.top = '100%';
            navMenu.style.left = '0';
            navMenu.style.right = '0';
            navMenu.style.background = 'white';
            navMenu.style.flexDirection = 'column';
            navMenu.style.padding = '20px';
            navMenu.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        });
    }
};

// Initialize mobile menu on load and resize
window.addEventListener('load', createMobileMenu);
window.addEventListener('resize', createMobileMenu);

// Testimonial card hover effect
document.querySelectorAll('.testimonial-card:not(.with-image)').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
        this.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
        this.style.transition = 'all 0.3s ease';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });
});

// Industry card hover effect
document.querySelectorAll('.industry-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Console message
console.log('%cTazapay Clone Website', 'font-size: 20px; font-weight: bold; color: #00D4AA;');
console.log('%cBuilt with HTML, CSS, and JavaScript', 'font-size: 14px; color: #0A4D4D;');
console.log('%c💚 Exact replica created', 'font-size: 12px; color: #00D4AA;');

// Loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
