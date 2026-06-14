import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { SearchManager } from './search.js';
import { PaginationManager } from './pagination.js';
import { ArticleNavManager } from './article-nav.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 3000;
const posArray = new Float32Array(particlesCount * 3);

for(let i=0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.012,
    color: 0x083A59,
    transparent: true,
    opacity: 0.85
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

camera.position.z = 2;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    particlesMesh.rotation.y += 0.0005;
    particlesMesh.rotation.x += 0.0002;
    
    renderer.render(scene, camera);
}

animate();

// Setup Mobile Menu dynamically
function setupMobileMenu() {
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');
    
    if (!navContainer || !navLinks) return;
    
    // Create button
    const btn = document.createElement('button');
    btn.className = 'mobile-menu-btn';
    btn.id = 'mobile-menu-btn';
    btn.setAttribute('aria-label', 'Menú móvil');
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`;
    
    // Append button to nav container
    navContainer.appendChild(btn);
    
    // Click listener
    btn.addEventListener('click', () => {
        const isActive = navLinks.classList.toggle('active');
        btn.classList.toggle('active');
        
        if (isActive) {
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
            document.body.style.overflow = 'hidden'; // prevent scrolling when menu is open
        } else {
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`;
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            btn.classList.remove('active');
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`;
            document.body.style.overflow = '';
        });
    });
    
    // Close menu on resize if screen becomes desktop width
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            btn.classList.remove('active');
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`;
            document.body.style.overflow = '';
        }
    });
}

// Timeline Stepper Logic
function setupTimeline() {
    const steps = document.querySelectorAll('.timeline-step');
    const progressBar = document.getElementById('timeline-progress');
    const cards = document.querySelectorAll('.grid > .card, .grid > .card-link');
    const grid = document.querySelector('#trayectoria .grid');
    
    if (steps.length === 0 || !grid) return;
    
    // Set initial progress
    updateProgress(0);
    
    // Set transition class to grid items
    cards.forEach(card => card.classList.add('grid-transition'));
    
    steps.forEach((step, index) => {
        step.addEventListener('click', () => {
            // Remove active class from all steps
            steps.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked step
            step.classList.add('active');
            
            // Update progress bar
            updateProgress(index);
            
            // Filter cards with fade transition
            const stage = step.getAttribute('data-stage');
            filterCards(stage);
        });
    });
    
    function updateProgress(index) {
        if (!progressBar) return;
        
        let percentage = 0;
        if (window.innerWidth <= 768) {
            // Vertical timeline progress
            percentage = (index / (steps.length - 1)) * 100;
            progressBar.style.height = `${percentage}%`;
            progressBar.style.width = '4px'; // match vertical line width
        } else {
            // Horizontal timeline progress
            percentage = (index / (steps.length - 1)) * 100;
            progressBar.style.width = `${percentage}%`;
            progressBar.style.height = '4px'; // match horizontal line height
        }
    }
    
    function filterCards(stage) {
        // Step 1: Fade out grid
        grid.style.opacity = '0';
        grid.style.transform = 'translateY(15px)';
        grid.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        setTimeout(() => {
            // Step 2: Toggle visibility
            cards.forEach(card => {
                const cardStage = card.getAttribute('data-stage');
                if (cardStage === stage) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Step 3: Fade in grid
            grid.style.opacity = '1';
            grid.style.transform = 'translateY(0)';
            
            // Re-run card hover 3D animations
            document.querySelectorAll('.card').forEach(card => {
                if (card.style.display !== 'none') {
                    window.initCardEffects(card);
                }
            });
        }, 300);
    }
    
    // Adjust progress bar style on resize (horizontal vs vertical)
    window.addEventListener('resize', () => {
        const activeIndex = Array.from(steps).findIndex(s => s.classList.contains('active'));
        if (activeIndex !== -1) {
            updateProgress(activeIndex);
        }
    });
}

// Initialize Search, Pagination, Mobile Menu and Timeline
function initApp() {
    new SearchManager();
    new PaginationManager();
    new ArticleNavManager();
    setupMobileMenu();
    setupTimeline();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Interaction Logic
// Reusable Card Interaction Logic
window.initCardEffects = function(card) {
    if (card.classList.contains('upcoming-card') || card.classList.contains('semester-locked')) {
        card.style.transform = '';
        return;
    }
    
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateX(0) rotateY(0) scale(1)';
    });

    // Video Preview Logic
    const videoId = card.getAttribute('data-video-id');
    if (videoId) {
        const container = card.querySelector('.video-container');
        const img = container.querySelector('img');
        let iframe = null;

        card.addEventListener('mouseenter', () => {
            if (!iframe) {
                iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`;
                iframe.allow = "autoplay; encrypted-media";
                container.appendChild(iframe);
                
                setTimeout(() => {
                    if (iframe) iframe.style.opacity = '1';
                }, 500);
            }
        });

        card.addEventListener('mouseleave', () => {
            if (iframe) {
                iframe.remove();
                iframe = null;
                img.style.opacity = '1';
            }
        });
    }
};

// Initialize existing cards (Blog, etc)
document.querySelectorAll('.card').forEach(card => window.initCardEffects(card));


// Smooth scroll for nav links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Only prevent default if it's an internal link on the same page
        if (href.startsWith('#')) {
            e.preventDefault();
            const section = document.querySelector(href);
            if (section) {
                section.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
        // If it's a link to another page (like index.html#blog), let the browser handle it
    });
});

// Mouse movement effect
document.addEventListener('mousemove', (event) => {
    const mouseX = (event.clientX / window.innerWidth) - 0.5;
    const mouseY = (event.clientY / window.innerHeight) - 0.5;
    
    particlesMesh.position.x = mouseX * 0.5;
    particlesMesh.position.y = -mouseY * 0.5;
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'all 1s ease-out';
    observer.observe(section);
});

// Secure Email Decryption (Anti-Spam)
document.querySelectorAll('.secure-email').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const user = link.getAttribute('data-u');
        const domain = link.getAttribute('data-d');
        if (user && domain) {
            window.location.href = `mailto:${user}@${domain}`;
        }
    });
});
