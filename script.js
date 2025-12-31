// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links li a');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Custom Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Animate outline with delay
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Cursor Hover Effect
const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item, .contact-card');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursorOutline.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursorOutline.classList.remove('cursor-hover'));
});

// Scroll Animation Implementation
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in-up').forEach(el => {
    observer.observe(el);
});

// Smooth Scroll
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

// Navbar background & Scroll Progress
const navbar = document.querySelector('.navbar');
const scrollProgress = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
    // Navbar
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Scroll Progress
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollProgress.style.width = scrolled + "%";
});

// Typing Text Animation
const typingText = document.querySelector('.typing-text');
const roles = ['Full-Stack Developer', 'CSE Student', 'Problem Solver', 'Tech Enthusiast'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeDelay = 100;
let eraseDelay = 50;
let newTextDelay = 2000;

function type() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typeDelay = eraseDelay;
    } else {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typeDelay = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typeDelay = newTextDelay;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeDelay = 100;
    }

    setTimeout(type, typeDelay);
}
document.addEventListener('DOMContentLoaded', type);

// Particle Background
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particlesArray;

function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
setCanvasSize();
window.addEventListener('resize', setCanvasSize);

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = '#38bdf8';
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    const numberOfParticles = (canvas.width * canvas.height) / 15000; // Density
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        // Connect particles
        for (let j = i; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(56, 189, 248, ${1 - distance / 100})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}
initParticles();
animateParticles();


// Magnetic & Tilt Effect
class MagneticEffect {
    constructor(selector, options = {}) {
        this.elements = document.querySelectorAll(selector);
        this.maxTilt = options.maxTilt || 15; // Degrees
        this.maxMove = options.maxMove || 20; // Pixels
        this.scale = options.scale || 1.05;
        this.smoothness = options.smoothness || '0.1s ease-out';
        this.init();
    }

    init() {
        this.elements.forEach(el => {
            el.addEventListener('mousemove', (e) => this.handleMove(e, el));
            el.addEventListener('mouseleave', () => this.handleLeave(el));
        });
    }

    handleMove(e, el) {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Mouse position relative to center
        const x = e.clientX - centerX;
        const y = e.clientY - centerY;

        // Calculate rotation (Tilt)
        // RotateX is based on Y-axis movement (up/down tilts x-axis)
        // RotateY is based on X-axis movement (left/right tilts y-axis)
        const rotateX = ((y / (rect.height / 2)) * -this.maxTilt).toFixed(2);
        const rotateY = ((x / (rect.width / 2)) * this.maxTilt).toFixed(2);

        // Calculate translation (Magnetic Pull)
        const moveX = ((x / (rect.width / 2)) * this.maxMove).toFixed(2);
        const moveY = ((y / (rect.height / 2)) * this.maxMove).toFixed(2);

        // Apply styles
        el.style.transition = `transform ${this.smoothness}`;
        el.style.transform = `
            perspective(1000px) 
            translate3d(${moveX}px, ${moveY}px, 0) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            scale(${this.scale})
        `;

        // Add gloss/shine position update if needed here
        el.style.zIndex = 10; // Bring to front
    }

    handleLeave(el) {
        el.style.transition = 'transform 0.5s ease-out';
        el.style.transform = 'perspective(1000px) translate3d(0, 0, 0) rotateX(0) rotateY(0) scale(1)';
        el.style.zIndex = ''; // Reset z-index
    }
}

// Initialize Magnetic Effect for Cards (Stronger)
new MagneticEffect('.project-card, .stat-box, .do-item, .edu-badge, .skill-item, .holo-card, .shard-card, .nexus-card', {
    maxTilt: 15,
    maxMove: 15,
    scale: 1.05
});

// Initialize Magnetic Effect for Buttons (Subtler)
new MagneticEffect('.btn-primary, .btn-secondary, .btn-live, .nav-links a.btn-primary', {
    maxTilt: 5,   // Subtle tilt
    maxMove: 8,   // Subtle movement
    scale: 1.1    // Slightly larger pop
});

// Back to Top Logic
const backToTopBtn = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('active');
    } else {
        backToTopBtn.classList.remove('active');
    }
});

backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Counter Animation
const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
    counter.innerText = '0';
    const updateCounter = () => {
        const target = +counter.getAttribute('data-target');
        const c = +counter.innerText.replace('+', ''); // Remove + for calculation
        const increment = target / 200;

        if (c < target) {
            counter.innerText = `${Math.ceil(c + increment)}+`;
            setTimeout(updateCounter, 20);
        } else {
            counter.innerText = `${target}+`;
        }
    };

    // Trigger animation when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateCounter();
                observer.unobserve(entry.target);
            }
        });
    });
    observer.observe(counter);
});

// --- System Activity Log Logic ---
const logContainer = document.getElementById('activity-log');

function addLog(message) {
    if (!logContainer) return;

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0]; // HH:MM:SS

    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `
        <span class="log-time">[${timeStr}]</span>
        <span class="log-msg">${message}</span>
    `;

    logContainer.appendChild(entry);

    // Limit log entries to 20
    while (logContainer.children.length > 20) {
        logContainer.removeChild(logContainer.firstChild);
    }

    // Auto-scroll to bottom
    logContainer.scrollTop = logContainer.scrollHeight;
}

// Initial Boot Log
window.addEventListener('load', () => {
    setTimeout(() => addLog('System online. Monitoring...'), 500);
});

// Interaction Logs
let lastScrollTime = 0;
window.addEventListener('scroll', () => {
    const now = Date.now();
    if (now - lastScrollTime > 2000) { // Throttle scroll logs to every 2s
        addLog('User scrolling...');
        lastScrollTime = now;
    }
});

window.addEventListener('click', (e) => {
    const target = e.target.closest('a, button, .project-card, .skill-item') ? 'interactive element' : 'page';
    addLog(`Click detected on ${target} at ${e.clientX}, ${e.clientY}`);
});

// Custom Log for specific events
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function () {
        const section = this.getAttribute('href').substring(1);
        if (section) addLog(`Navigating to section: ${section}`);
    });
});

// --- Custom Context Menu Logic (SantoshOs) ---
const contextMenu = document.getElementById('custom-context-menu');

window.addEventListener('contextmenu', (e) => {
    e.preventDefault();

    // Show menu
    contextMenu.style.display = 'block';

    const { clientX: mouseX, clientY: mouseY } = e;
    const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
    const menuWidth = contextMenu.offsetWidth || 250;
    const menuHeight = contextMenu.offsetHeight || 220;

    // Boundary checks
    let posX = mouseX;
    let posY = mouseY;

    if (mouseX + menuWidth > windowWidth) posX = windowWidth - menuWidth - 10;
    if (mouseY + menuHeight > windowHeight) posY = windowHeight - menuHeight - 10;

    contextMenu.style.left = `${posX}px`;
    contextMenu.style.top = `${posY}px`;

    if (typeof addLog === 'function') addLog('SantoshOs Accessing Context Menu...');
});

// Close menu on click outside
window.addEventListener('click', (e) => {
    if (!contextMenu.contains(e.target)) {
        contextMenu.style.display = 'none';
    }
});

// Menu Item Handlers
document.getElementById('menu-resume').addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = 'SantoshTech2025 update .pdf';
    link.download = 'SantoshTech2025 update .pdf';
    link.click();
    contextMenu.style.display = 'none';
});

document.getElementById('menu-email').addEventListener('click', () => {
    navigator.clipboard.writeText('santoshx.dev@gmail.com').then(() => {
        if (typeof addLog === 'function') addLog('Email copied to clipboard!');
        alert('Email copied to clipboard!');
    });
    contextMenu.style.display = 'none';
});

document.getElementById('menu-github').addEventListener('click', () => {
    window.open('https://github.com/Santosh6665', '_blank');
    contextMenu.style.display = 'none';
});

document.getElementById('menu-refresh').addEventListener('click', () => {
    if (typeof addLog === 'function') addLog('Refreshing system...');
    setTimeout(() => location.reload(), 500);
});
