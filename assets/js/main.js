import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { SearchManager } from './search.js';
import { PaginationManager } from './pagination.js';

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
    size: 0.005,
    color: 0x4facfe,
    transparent: true,
    opacity: 0.4
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

// Initialize Search and Pagination
function initApp() {
    new SearchManager();
    new PaginationManager();
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
