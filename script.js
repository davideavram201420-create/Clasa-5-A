// Main JavaScript for Class 5 A Website with Firebase Integration

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyB...",
    authDomain: "clasa-5a-website.firebaseapp.com",
    databaseURL: "https://clasa-5a-website-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "clasa-5a-website",
    storageBucket: "clasa-5a-website.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
}

// Initialize Firebase
let database;
try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    database = firebase.database();
} catch (error) {
    console.log("Firebase not available, using localStorage fallback");
}

// Check if user is logged in as admin
let isAdmin = false;

window.addEventListener('DOMContentLoaded', () => {
    const isAdminLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    const loginTime = sessionStorage.getItem('loginTime');

    if (isAdminLoggedIn && loginTime) {
        const loginDate = new Date(loginTime);
        const now = new Date();
        const hoursSinceLogin = (now - loginDate) / (1000 * 60 * 60);

        if (hoursSinceLogin < 2) {
            isAdmin = true;
            showAdminControls();
        } else {
            sessionStorage.removeItem('adminLoggedIn');
            sessionStorage.removeItem('loginTime');
        }
    }

    // Load announcements from Firebase or localStorage
    loadAnnouncements();
});

// Load announcements from storage
function loadAnnouncements() {
    if (database) {
        // Load from Firebase
        const announcementsRef = database.ref('announcements');

        announcementsRef.on('value', (snapshot) => {
            const activitiesGrid = document.querySelector('.activities-grid');
            if (!activitiesGrid) return;

            // Clear existing dynamic announcements (keep only static ones)
            const dynamicCards = activitiesGrid.querySelectorAll('.activity-card[data-announcement-id]');
            dynamicCards.forEach(card => card.remove());

            const announcements = snapshot.val();
            if (announcements) {
                // Convert to array and sort by date
                const announcementsArray = Object.entries(announcements).map(([id, data]) => ({
                    id,
                    ...data
                })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                // Add each announcement
                announcementsArray.forEach(announcement => {
                    addAnnouncementToDOM(announcement);
                });
            }
        });
    } else {
        // Fallback to localStorage
        const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
        announcements.forEach(announcement => {
            addAnnouncementToDOM(announcement);
        });
    }
}

// Add announcement to DOM
function addAnnouncementToDOM(announcement) {
    const activitiesGrid = document.querySelector('.activities-grid');
    if (!activitiesGrid) return;

    const newActivity = document.createElement('div');
    newActivity.className = 'activity-card';
    newActivity.setAttribute('data-announcement-id', announcement.id);

    // Format date
    const dateObj = new Date(announcement.date);
    const formattedDate = dateObj.toLocaleDateString('ro-RO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    newActivity.innerHTML = `
        <div class="activity-header">
            <span class="activity-date">${formattedDate}</span>
            <span class="activity-tag">${announcement.category}</span>
        </div>
        <h3 class="activity-title">${announcement.title}</h3>
        <p class="activity-description">${announcement.description}</p>
        ${isAdmin ? `<button class="delete-announcement-btn" onclick="deleteAnnouncement('${announcement.id}')">🗑️ Șterge</button>` : ''}
    `;

    // Add to beginning of grid
    activitiesGrid.insertBefore(newActivity, activitiesGrid.firstChild);
}

// Delete announcement
function deleteAnnouncement(announcementId) {
    if (!confirm('Sigur doriți să ștergeți acest anunț?')) {
        return;
    }

    if (database) {
        // Delete from Firebase
        database.ref('announcements/' + announcementId).remove()
            .then(() => {
                showNotification('✓ Anunț șters cu succes!', 'success');
            })
            .catch((error) => {
                showNotification('✗ Eroare la ștergere!', 'error');
                console.error(error);
            });
    } else {
        // Delete from localStorage
        let announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
        announcements = announcements.filter(a => a.id !== announcementId);
        localStorage.setItem('announcements', JSON.stringify(announcements));

        // Remove from DOM
        const card = document.querySelector(`[data-announcement-id="${announcementId}"]`);
        if (card) card.remove();

        showNotification('✓ Anunț șters cu succes!', 'success');
    }
}

// Show admin controls
function showAdminControls() {
    const openBtn = document.getElementById('openAdminPanel');
    if (openBtn) {
        openBtn.style.display = 'flex';
    }

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

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #6B8E23, #556B2F)' : 'linear-gradient(135deg, #C74440, #A03632)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        z-index: 3000;
        animation: slideInRight 0.5s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => notification.remove(), 500);
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

        const announcement = {
            id: Date.now().toString(),
            title,
            category,
            date,
            description,
            timestamp: new Date().toISOString()
        };

        if (database) {
            // Save to Firebase
            database.ref('announcements/' + announcement.id).set(announcement)
                .then(() => {
                    showNotification('✓ Anunț publicat cu succes!', 'success');
                    announcementModal.classList.remove('show');
                    announcementForm.reset();

                    // Scroll to activities section
                    setTimeout(() => {
                        document.getElementById('activitati').scrollIntoView({ behavior: 'smooth' });
                    }, 500);
                })
                .catch((error) => {
                    showNotification('✗ Eroare la publicare!', 'error');
                    console.error(error);
                });
        } else {
            // Save to localStorage
            let announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
            announcements.unshift(announcement);
            localStorage.setItem('announcements', JSON.stringify(announcements));

            addAnnouncementToDOM(announcement);

            announcementModal.classList.remove('show');
            announcementForm.reset();
            showNotification('✓ Anunț publicat cu succes!', 'success');

            setTimeout(() => {
                document.getElementById('activitati').scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
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
document.querySelectorAll('.info-card, .activity-card, .gallery-item, .day-schedule, .subject-card').forEach(el => {
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
    
    .delete-announcement-btn {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background: linear-gradient(135deg, #C74440, #A03632);
        color: white;
        border: none;
        border-radius: 8px;
        font-family: var(--font-primary);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.25s ease;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .delete-announcement-btn:hover {
        background: #8B2F2B;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(199, 68, 64, 0.3);
    }
`;
document.head.appendChild(animationStyles);
