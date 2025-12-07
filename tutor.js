// AI Tutor & Lessons JavaScript - Add to end of script.js

// Google Gemini API Key (you'll need to get your own from https://makersuite.google.com/app/apikey)
const GEMINI_API_KEY = 'AIzaSyCBzvM_NkXU4yzoJddchjtRD6U5zzf_qpU'; // Replace with your actual API key

// Tutor Modal Elements
const openTutorBtn = document.getElementById('openTutorBtn');
const tutorModal = document.getElementById('tutorModal');
const closeTutorBtn = document.getElementById('closeTutorBtn');
const subjectSelection = document.getElementById('subjectSelection');
const tutorChat = document.getElementById('tutorChat');
const currentSubjectSpan = document.getElementById('currentSubject');
const changeSubjectBtn = document.getElementById('changeSubjectBtn');
const questionInput = document.getElementById('questionInput');
const sendQuestionBtn = document.getElementById('sendQuestionBtn');
const chatMessages = document.getElementById('chatMessages');

let selectedSubject = '';

// Subject Button Click
document.querySelectorAll('.subject-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        selectedSubject = btn.getAttribute('data-subject');
        currentSubjectSpan.textContent = selectedSubject;
        subjectSelection.style.display = 'none';
        tutorChat.style.display = 'block';

        // Add welcome message
        addMessage('ai', `Hi! I'm your ${selectedSubject} tutor. Ask me any question about ${selectedSubject} and I'll help you understand it! 📚`);
    });
});

// Open Tutor
if (openTutorBtn) {
    openTutorBtn.addEventListener('click', () => {
        tutorModal.classList.add('show');
    });
}

// Close Tutor
if (closeTutorBtn) {
    closeTutorBtn.addEventListener('click', () => {
        tutorModal.classList.remove('show');
        resetTutor();
    });
}

// Change Subject
if (changeSubjectBtn) {
    changeSubjectBtn.addEventListener('click', () => {
        resetTutor();
    });
}

// Send Question
if (sendQuestionBtn) {
    sendQuestionBtn.addEventListener('click', () => {
        sendQuestion();
    });
}

// Enter to send
if (questionInput) {
    questionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendQuestion();
        }
    });
}

// Close modal on background click
if (tutorModal) {
    tutorModal.addEventListener('click', (e) => {
        if (e.target === tutorModal) {
            tutorModal.classList.remove('show');
            resetTutor();
        }
    });
}

// Add message to chat
function addMessage(type, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}-message`;

    if (type === 'ai') {
        messageDiv.innerHTML = `<div class="message-icon">🤖</div><div class="message-text">${text}</div>`;
    } else {
        messageDiv.innerHTML = `<div class="message-text">${text}</div><div class="message-icon">👤</div>`;
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send question to AI
async function sendQuestion() {
    const question = questionInput.value.trim();
    if (!question) return;

    // Add user message
    addMessage('user', question);
    questionInput.value = '';

    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message ai-message typing';
    typingDiv.innerHTML = `<div class="message-icon">🤖</div><div class="message-text">Thinking...</div>`;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        // Call Gemini API
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are a helpful ${selectedSubject} tutor for 5th grade students. Answer this question in English, clearly and simply: ${question}`
                    }]
                }]
            })
        });

        const data = await response.json();

        // Remove typing indicator
        typingDiv.remove();

        if (data.candidates && data.candidates[0]) {
            const answer = data.candidates[0].content.parts[0].text;
            addMessage('ai', answer);
        } else {
            addMessage('ai', "Sorry, I couldn't answer that. Please try rephrasing your question!");
        }
    } catch (error) {
        // Remove typing indicator
        typingDiv.remove();

        // Fallback answers (without API)
        const fallbackAnswers = {
            'Mathematics': "I can help with math! Try asking: 'How do I solve 2x + 5 = 15?' or 'What is a fraction?'",
            'Romanian': "I can help with Romanian! Try asking about grammar, vocabulary, or literature.",
            'English': "I can help with English! Ask me about grammar, vocabulary, or writing tips.",
            'French': "I can help with French! Ask me about vocabulary, grammar, or pronunciation.",
            'History': "I can help with History! Ask me about events, people, or time periods.",
            'Geography': "I can help with Geography! Ask me about countries, maps, or natural features.",
            'Biology': "I can help with Biology! Ask me about animals, plants, or the human body.",
            'Science': "I can help with Science! Ask me about experiments, physics, or chemistry."
        };

        addMessage('ai', fallbackAnswers[selectedSubject] || "Sorry, I'm having trouble connecting. Please try again!");
    }
}

// Reset tutor
function resetTutor() {
    subjectSelection.style.display = 'block';
    tutorChat.style.display = 'none';
    chatMessages.innerHTML = '';
    questionInput.value = '';
    selectedSubject = '';
}

// ===== LESSONS MANAGEMENT =====

const addLessonBtn = document.getElementById('addLessonBtn');
const addLessonModal = document.getElementById('addLessonModal');
const addLessonForm = document.getElementById('addLessonForm');
const cancelLessonBtn = document.getElementById('cancelLesson');
const lessonsGrid = document.getElementById('lessonsGrid');

// Open Add Lesson Modal
if (addLessonBtn) {
    addLessonBtn.addEventListener('click', () => {
        addLessonModal.classList.add('show');
    });
}

// Close Add Lesson Modal
if (cancelLessonBtn) {
    cancelLessonBtn.addEventListener('click', () => {
        addLessonModal.classList.remove('show');
        addLessonForm.reset();
    });
}

// Close on background click
if (addLessonModal) {
    addLessonModal.addEventListener('click', (e) => {
        if (e.target === addLessonModal) {
            addLessonModal.classList.remove('show');
            addLesson Form.reset();
        }
    });
}

// Submit Lesson
if (addLessonForm) {
    addLessonForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('lessonTitle').value;
        const subject = document.getElementById('lessonSubject').value;
        const imageUrl = document.getElementById('lessonImageUrl').value;
        const description = document.getElementById('lessonDescription').value;

        const lesson = {
            id: Date.now().toString(),
            title,
            subject,
            imageUrl,
            description,
            timestamp: new Date().toISOString()
        };

        if (database) {
            // Save to Firebase
            database.ref('lessons/' + lesson.id).set(lesson)
                .then(() => {
                    showNotification('✓ Lesson added successfully!', 'success');
                    addLessonModal.classList.remove('show');
                    addLessonForm.reset();
                })
                .catch((error) => {
                    showNotification('✗ Error adding lesson!', 'error');
                    console.error(error);
                });
        } else {
            // Save to localStorage
            let lessons = JSON.parse(localStorage.getItem('lessons') || '[]');
            lessons.unshift(lesson);
            localStorage.setItem('lessons', JSON.stringify(lessons));

            addLessonToDOM(lesson);

            addLessonModal.classList.remove('show');
            addLessonForm.reset();
            showNotification('✓ Lesson added successfully!', 'success');
        }
    });
}

// Load lessons
function loadLessons() {
    if (database) {
        // Load from Firebase
        const lessonsRef = database.ref('lessons');

        lessonsRef.on('value', (snapshot) => {
            if (!lessonsGrid) return;

            // Clear existing lessons
            const dynamicLessons = lessonsGrid.querySelectorAll('.lesson-card[data-lesson-id]');
            dynamicLessons.forEach(card => card.remove());

            const lessons = snapshot.val();
            if (lessons) {
                // Remove empty state
                const emptyState = lessonsGrid.querySelector('.empty-lessons');
                if (emptyState) emptyState.remove();

                // Add lessons
                const lessonsArray = Object.entries(lessons).map(([id, data]) => ({
                    id,
                    ...data
                })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                lessonsArray.forEach(lesson => {
                    addLessonToDOM(lesson);
                });
            }
        });
    } else {
        // Load from localStorage
        const lessons = JSON.parse(localStorage.getItem('lessons') || '[]');
        if (lessons.length > 0) {
            const emptyState = lessonsGrid?.querySelector('.empty-lessons');
            if (emptyState) emptyState.remove();

            lessons.forEach(lesson => {
                addLessonToDOM(lesson);
            });
        }
    }
}

// Add lesson to DOM
function addLessonToDOM(lesson) {
    if (!lessonsGrid) return;

    // Remove empty state if exists
    const emptyState = lessonsGrid.querySelector('.empty-lessons');
    if (emptyState) emptyState.remove();

    const lessonCard = document.createElement('div');
    lessonCard.className = 'lesson-card';
    lessonCard.setAttribute('data-lesson-id', lesson.id);

    lessonCard.innerHTML = `
        <img src="${lesson.imageUrl}" alt="${lesson.title}" class="lesson-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22300%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 fill=%22%23999%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22sans-serif%22 font-size=%2218%22%3EImage not found%3C/text%3E%3C/svg%3E'">
        <div class="lesson-content">
            <span class="lesson-subject">${lesson.subject}</span>
            <h3 class="lesson-title">${lesson.title}</h3>
            ${lesson.description ? `<p class="lesson-description">${lesson.description}</p>` : ''}
            ${isAdmin ? `<button class="delete-lesson-btn" onclick="deleteLesson('${lesson.id}')">🗑️ Delete</button>` : ''}
        </div>
    `;

    lessonsGrid.insertBefore(lessonCard, lessonsGrid.firstChild);
}

// Delete lesson
function deleteLesson(lessonId) {
    if (!confirm('Are you sure you want to delete this lesson?')) {
        return;
    }

    if (database) {
        database.ref('lessons/' + lessonId).remove()
            .then(() => {
                showNotification('✓ Lesson deleted successfully!', 'success');
            })
            .catch((error) => {
                showNotification('✗ Error deleting lesson!', 'error');
                console.error(error);
            });
    } else {
        let lessons = JSON.parse(localStorage.getItem('lessons') || '[]');
        lessons = lessons.filter(l => l.id !== lessonId);
        localStorage.setItem('lessons', JSON.stringify(lessons));

        const card = document.querySelector(`[data-lesson-id="${lessonId}"]`);
        if (card) card.remove();

        // Check if no lessons left
        if (lessons.length === 0 && lessonsGrid) {
            lessonsGrid.innerHTML = `
                <div class="lesson-card empty-lessons">
                    <div class="empty-icon">📚</div>
                    <p>Nicio lecție încă. Administratorul poate adăuga lecții!</p>
                </div>
            `;
        }

        showNotification('✓ Lesson deleted successfully!', 'success');
    }
}

// Load lessons on page load
if (lessonsGrid) {
    loadLessons();
}


