// Main JavaScript for Class 5 A Website

// Check if user is logged in as admin
window.addEventListener('DOMContentLoaded', () => {
    const isAdminLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    const loginTime = sessionStorage.getItem('loginTime');

    if (isAdminLoggedIn && loginTime) {
        const loginDate = new Date(loginTime);
        const now = new Date();
        const hoursSinceLogin = (now - loginDate) / (1000 * 60 * 60);

        if (hoursSinceLogin < 2) {
            // Show admin controls
            showAdminControls();
        } else {
            // Session expired
            sessionStorage.removeItem('adminLoggedIn');
            sessionStorage.removeItem('loginTime');
        }
    }
});

// Show admin controls
function showAdminControls() {
    const openBtn = document.getElementById('openAdminPanel');
    if (openBtn) {
        openBtn.style.display = 'flex';
    }

    // Show welcome message
    const welcomeMsg = document.createElement('div');
    welcomeMsg.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #6B8E23, #556B2F);
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        z-index: 3000;
        animation: fadeInDown 0.5s ease-out;
        text-align: center;
    `;
    welcomeMsg.innerHTML = '✓ Mod Administrator Activat';
    document.body.appendChild(welcomeMsg);

    setTimeout(() => {
        welcomeMsg.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => welcomeMsg.remove(), 500);
    }, 3000);
}

// Admin panel controls
const openAdminPanelBtn = document.getElementById('openAdminPanel');
const closeAdminPanelBtn = document.getElementById('closeAdminPanel');
const adminPanel = document.getElementById('adminPanel');
const makeAnnouncementBtn = document.getElementById('makeAnnouncementBtn');
const logoutAdminBtn = document.getElementById('logoutAdminBtn');
const announcementModal = document.getElementById('announcementModal');
const announcementForm = document.getElementById('announcementForm');
const cancelAnnouncementBtn = document.getElementById('cancelAnnouncement');

if (openAdminPanelBtn) {
    openAdminPanelBtn.addEventListener('click', () => {
        adminPanel.style.display = 'block';
        openAdminPanelBtn.style.display = 'none';
    });
}

if (closeAdminPanelBtn) {
    closeAdminPanelBtn.addEventListener('click', () => {
        adminPanel.style.display = 'none';
        openAdminPanelBtn.style.display = 'flex';
    });
}

if (makeAnnouncementBtn) {
    makeAnnouncementBtn.addEventListener('click', () => {
        announcementModal.classList.add('show');
    });
}

if (logoutAdminBtn) {
    logoutAdminBtn.addEventListener('click', () => {
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('loginTime');
        window.location.reload();
    });
}

if (cancelAnnouncementBtn) {
    cancelAnnouncementBtn.addEventListener('click', () => {
        announcementModal.classList.remove('show');
        announcementForm.reset();
    });
}

if (announcementForm) {
    announcementForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('announcementTitle').value;
        const category = document.getElementById('announcementCategory').value;
        const date = document.getElementById('announcementDate').value;
        const description = document.getElementById('announcementDescription').value;

        // Format date
        const dateObj = new Date(date);
        const formattedDate = dateObj.toLocaleDateString('ro-RO', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        // Create new activity card
        const activitiesGrid = document.querySelector('.activities-grid');
        const newActivity = document.createElement('div');
        newActivity.className = 'activity-card';
        newActivity.innerHTML = `
            <div class="activity-header">
                <span class="activity-date">${formattedDate}</span>
                <span class="activity-tag">${category}</span>
            </div>
            <h3 class="activity-title">${title}</h3>
            <p class="activity-description">${description}</p>
        `;

        // Add to beginning of grid
        activitiesGrid.insertBefore(newActivity, activitiesGrid.firstChild);

        // Close modal and reset form
        announcementModal.classList.remove('show');
        announcementForm.reset();

        // Show success message
        const successMsg = document.createElement('div');
        successMsg.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #6B8E23, #556B2F);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            z-index: 3000;
            animation: slideInRight 0.5s ease-out;
        `;
        successMsg.textContent = '✓ Anunț publicat cu succes!';
        document.body.appendChild(successMsg);

        setTimeout(() => {
            successMsg.style.animation = 'fadeOut 0.5s ease-out';
            setTimeout(() => successMsg.remove(), 500);
        }, 3000);

        // Scroll to activities section
        document.getElementById('activitati').scrollIntoView({ behavior: 'smooth' });
    });
}

// Close modal on background click
if (announcementModal) {
    announcementModal.addEventListener('click', (e) => {
        if (e.target === announcementModal) {
            announcementModal.classList.remove('show');
            announcementForm.reset();
        }
    });
}

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

// Add scroll animation to elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.info-card, .activity-card, .gallery-item, .day-schedule').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-section');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / 600);
    }
});

// Add active state to navigation links based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link:not(.admin-link)');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Initialize effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add welcome message (optional)
    console.log('%c🎓 Bine ați venit la Clasa 5 A! 🎓', 'color: #D4A574; font-size: 24px; font-weight: bold;');
    console.log('%cWebsite creat cu ❤️ pentru elevii noștri', 'color: #5A4E3C; font-size: 14px;');
});

// Add CSS animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .nav-link.active {
        color: var(--color-accent-dark);
        background: var(--color-paper-dark);
    }
`;
document.head.appendChild(animationStyles);
