'use strict';

// ===========================================
// مملكة الكلمات والخيال - النسخة البريميوم
// Game Engine Premium Version
// ===========================================

// ---------- Configuration ----------
const CONFIG = {
    STORAGE_KEYS: {
        PLAYER: 'kingdom_words_player_premium',
        LEADERBOARD: 'kingdom_words_leaderboard_premium',
        SETTINGS: 'kingdom_words_settings_premium'
    },
    
    WORLD_ORDER: ['hamzat', 'taa', 'alif', 'punctuation', 'creative'],
    
    ADAPTIVE_DIFFICULTY: {
        EASY: { timeLimit: 180, hintPenalty: 5, scoreMultiplier: 1 },
        MEDIUM: { timeLimit: 120, hintPenalty: 10, scoreMultiplier: 1.5 },
        HARD: { timeLimit: 90, hintPenalty: 15, scoreMultiplier: 2 }
    },
    
    PROGRESS_TRACKING: {
        MASTERY_THRESHOLD: 0.8,
        RETENTION_DAYS: 7,
        WEAKNESS_THRESHOLD: 0.4
    },
    
    WORLD_NAMES: {
        hamzat: 'وادي الهمزات',
        taa: 'غابة التاءات',
        alif: 'جبل الألف اللينة',
        punctuation: 'بحيرة علامات الترقيم',
        creative: 'قصر الخيال الإبداعي'
    },
    
    REWARDS: {
        CORRECT_ANSWER: 10,
        PERFECT_SCORE_BONUS: 50,
        STAR_1_THRESHOLD: 0.6,
        STAR_2_THRESHOLD: 0.8,
        STAR_3_THRESHOLD: 0.95
    },
    
    AUDIO: {
        VOLUME: {
            MUSIC: 0.5,
            SFX: 0.7
        },
        FILES: {
            BACKGROUND: 'https://cdn.pixabay.com/download/audio/2021/09/30/audio_70b1ec69e2.mp3?filename=kids-game-music-6386.mp3',
            CORRECT: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_6d1c6f8263.mp3?filename=correct-2-46134.mp3',
            WRONG: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_3bdb6f5fe5.mp3?filename=wrong-buzzer-6897.mp3',
            CLICK: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c90b4a56a3.mp3?filename=click-124467.mp3',
            SUCCESS: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_cfe9f0acf7.mp3?filename=success-1-6297.mp3',
            LEVEL_UP: 'https://cdn.pixabay.com/download/audio/2022/03/19/audio_8aa5bde937.mp3?filename=level-up-1-199966.mp3'
        }
    }
};

// ---------- Game State ----------
let player = null;
let currentWorld = null;
let currentActivity = null;
let currentQuestionIndex = 0;
let score = 0;
let correctAnswers = 0;
let totalQuestions = 0;
let gameTimer = null;
let timeLeft = 0;
let hintsUsedInSession = 0;
let hintShownForCurrentQuestion = false;

// Audio elements
let audioElements = {};

// ---------- Player Management ----------
class PlayerManager {
    static loadPlayer() {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.PLAYER);
        if (saved) {
            try {
                const loaded = JSON.parse(saved);
                if (!loaded.settings) {
                    loaded.settings = {};
                }
                if (!Object.prototype.hasOwnProperty.call(loaded.settings, 'theme')) {
                    loaded.settings.theme = 'light';
                }
                return loaded;
            } catch (e) {
                console.error('Error loading player data:', e);
            }
        }
        
        // Default new player
        return {
            name: 'المستكشف',
            level: 1,
            experience: 0,
            spellingPoints: 0,
            imaginationPoints: 0,
            coins: 0,
            avatar: 'assets/premium_assets/avatar_default.png',
            worlds: {
                hamzat: { 
                    name: CONFIG.WORLD_NAMES.hamzat,
                    unlocked: true,
                    stars: 0,
                    completed: false,
                    bestScore: 0,
                    difficulty: 'EASY',
                    mastery: 0,
                    weakAreas: [],
                    progressHistory: [],
                    lastPlayed: null
                },
                taa: { 
                    name: CONFIG.WORLD_NAMES.taa,
                    unlocked: false,
                    stars: 0,
                    completed: false,
                    bestScore: 0,
                    difficulty: 'EASY',
                    mastery: 0,
                    weakAreas: [],
                    progressHistory: [],
                    lastPlayed: null
                },
                alif: { 
                    name: CONFIG.WORLD_NAMES.alif,
                    unlocked: false,
                    stars: 0,
                    completed: false,
                    bestScore: 0,
                    difficulty: 'EASY',
                    mastery: 0,
                    weakAreas: [],
                    progressHistory: [],
                    lastPlayed: null
                },
                punctuation: { 
                    name: CONFIG.WORLD_NAMES.punctuation,
                    unlocked: false,
                    stars: 0,
                    completed: false,
                    bestScore: 0,
                    difficulty: 'EASY',
                    mastery: 0,
                    weakAreas: [],
                    progressHistory: [],
                    lastPlayed: null
                },
                creative: { 
                    name: CONFIG.WORLD_NAMES.creative,
                    unlocked: false,
                    stars: 0,
                    completed: false,
                    bestScore: 0,
                    difficulty: 'EASY',
                    mastery: 0,
                    weakAreas: [],
                    progressHistory: [],
                    lastPlayed: null
                }
            },
            settings: {
                sound: true,
                music: true,
                notifications: true,
                adaptiveDifficulty: true,
                showProgress: true,
                parentalMode: false,
                theme: 'light'
            },
            analytics: {
                totalPlayTime: 0,
                sessionsCount: 0,
                averageAccuracy: 0,
                improvementRate: 0,
                strengthAreas: [],
                focusAreas: [],
                learningStyle: null
            }
        };
    }
    
    static savePlayer() {
        localStorage.setItem(CONFIG.STORAGE_KEYS.PLAYER, JSON.stringify(player));
    }
    
    static calculateLevel() {
        const totalXP = player.experience;
        const level = Math.floor(totalXP / 100) + 1;
        const levelProgress = (totalXP % 100) / 100 * 100;
        
        return { level, progress: levelProgress };
    }
    
    static addExperience(amount) {
        player.experience += amount;
        const oldLevel = player.level;
        const newLevelInfo = this.calculateLevel();
        
        if (newLevelInfo.level > oldLevel) {
            player.level = newLevelInfo.level;
            this.triggerLevelUp();
        }
        
        this.savePlayer();
        return newLevelInfo;
    }
    
    static triggerLevelUp() {
        if (audioElements.levelUp) {
            audioElements.levelUp.currentTime = 0;
            audioElements.levelUp.play();
        }
        
        // Show level up notification
        this.showNotification(`🎉 مبروك! لقد وصلت للمستوى ${player.level}`);
    }
    
    static showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification premium-card';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-star"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    static getTotalPoints() {
        return player.spellingPoints + player.imaginationPoints;
    }
    
    static applyTheme() {
        const isDark = player && player.settings && player.settings.theme === 'dark';
        document.body.classList.toggle('dark-mode', isDark);
    }
}

// ---------- Question Bank ----------
class QuestionBank {
    static getQuestionsForWorld(worldKey) {
        const questions = {
            hamzat: [
                {
                    text: 'اختر الهمزة الصحيحة: (  _مـ ــــ ـــــ ـــــ ) البحر',
                    options: ['أ', 'إ', 'ؤ', 'ئ'],
                    correctIndex: 0,
                    hint: 'الهمزة في أول الكلمة تأخذ شكل الألف إذا كانت مفتوحة',
                    type: 'spelling'
                },
                {
                    text: 'اختر الهمزة الصحيحة: (مسـ _ ــــ ـــة) جميلة',
                    options: ['أ', 'إ', 'ئ'],
                    correctIndex: 2,
                    hint: 'الهمزة على نبرة تكتب على ياء عندما تأتي بعد ساكن',
                    type: 'spelling'
                },
                {
                    text: 'اختر الهمزة الصحيحة: (مسـ _ ــؤولة)',
                    options: ['أ', 'ؤ', 'ئ'],
                    correctIndex: 1,
                    hint: 'الهمزة على واو تكتب على واو عندما تأتي مضمومة',
                    type: 'spelling'
                },
                {
                    text: 'اختر الهمزة الصحيحة: (يسـ _ ــأل)',
                    options: ['أ', 'إ', 'ئ'],
                    correctIndex: 0,
                    hint: 'الهمزة في أول الكلمة تأخذ شكل الألف إذا كانت مفتوحة',
                    type: 'spelling'
                },
                {
                    text: 'اختر الهمزة الصحيحة: (مـ _ ــمنين)',
                    options: ['ؤ', 'ئ', 'إ'],
                    correctIndex: 2,
                    hint: 'الهمزة في أول الكلمة تكتب تحت الألف إذا كانت مكسورة',
                    type: 'spelling'
                },
                {
                    text: 'اختر الهمزة الصحيحة: (أحمد)',
                    options: ['أ', 'إ', 'ؤ'],
                    correctIndex: 0,
                    hint: 'الهمزة في أول الكلمة تأخذ شكل الألف إذا كانت مفتوحة',
                    type: 'spelling'
                },
                {
                    text: 'اختر الهمزة الصحيحة: (إسلام)',
                    options: ['أ', 'إ', 'ؤ'],
                    correctIndex: 1,
                    hint: 'الهمزة في أول الكلمة تأخذ شكل الألف إذا كانت مكسورة',
                    type: 'spelling'
                },
                {
                    text: 'اختر الهمزة الصحيحة: (ؤمن)',
                    options: ['أ', 'إ', 'ؤ'],
                    correctIndex: 2,
                    hint: 'الهمزة على واو تكتب على واو عندما تأتي مضمومة',
                    type: 'spelling'
                },
                {
                    text: 'اختر الهمزة الصحيحة: (ئد)',
                    options: ['أ', 'إ', 'ئ'],
                    correctIndex: 2,
                    hint: 'الهمزة على ياء تكتب على ياء عندما تأتي بعد ساكن',
                    type: 'spelling'
                },
                {
                    text: 'اختر الهمزة الصحيحة: (أب)',
                    options: ['أ', 'إ', 'ؤ'],
                    correctIndex: 0,
                    hint: 'الهمزة في أول الكلمة تأخذ شكل الألف إذا كانت مفتوحة',
                    type: 'spelling'
                }
            ],

            taa: [
                {
                    text: 'اختر التاء الصحيحة: مدرسـ _',
                    options: ['ة', 'ت'],
                    correctIndex: 0,
                    hint: 'التاء المربوطة تأتي في نهاية الأسماء المؤنثة',
                    type: 'spelling'
                },
                {
                    text: 'اختر التاء الصحيحة: بنـ _',
                    options: ['ة', 'ت'],
                    correctIndex: 0,
                    hint: 'التاء المربوطة تأتي في نهاية الأسماء المؤنثة',
                    type: 'spelling'
                },
                {
                    text: 'اختر التاء الصحيحة: بنـ _',
                    options: ['ات', 'ة'],
                    correctIndex: 0,
                    hint: 'جمع المؤنث السالم ينتهي بـ (ات)',
                    type: 'spelling'
                },
                {
                    text: 'اختر التاء الصحيحة: مكـ _',
                    options: ['ة', 'ت'],
                    correctIndex: 1,
                    hint: 'التاء المفتوحة تأتي في الأفعال',
                    type: 'spelling'
                },
                {
                    text: 'اختر التاء الصحيحة: أصـدقـ _',
                    options: ['ة', 'اء', 'ت'],
                    correctIndex: 2,
                    hint: 'جمع المذكر السالم ينتهي بـ (ون) أو (ين)',
                    type: 'spelling'
                },
                {
                    text: 'اختر التاء الصحيحة: فاتـ _',
                    options: ['ة', 'ت'],
                    correctIndex: 1,
                    hint: 'التاء المفتوحة تأتي في الأفعال',
                    type: 'spelling'
                },
                {
                    text: 'اختر التاء الصحيحة: قالت',
                    options: ['ة', 'ت'],
                    correctIndex: 1,
                    hint: 'التاء المفتوحة تأتي في الأفعال',
                    type: 'spelling'
                },
                {
                    text: 'اختر التاء الصحيحة: جلبت',
                    options: ['ة', 'ت'],
                    correctIndex: 1,
                    hint: 'التاء المفتوحة تأتي في الأفعال',
                    type: 'spelling'
                },
                {
                    text: 'اختر التاء الصحيحة: كتبت',
                    options: ['ة', 'ت'],
                    correctIndex: 1,
                    hint: 'التاء المفتوحة تأتي في الأفعال',
                    type: 'spelling'
                },
                {
                    text: 'اختر التاء الصحيحة: قرأت',
                    options: ['ة', 'ت'],
                    correctIndex: 1,
                    hint: 'التاء المفتوحة تأتي في الأفعال',
                    type: 'spelling'
                }
            ],

            alif: [
                {
                    text: 'اختر الشكل الصحيح: دعـ _',
                    options: ['ا', 'ى'],
                    correctIndex: 1,
                    hint: 'الألف اللينة في آخر الأسماء تكتب على صورة ياء غير منقوطة (ى)',
                    type: 'spelling'
                },
                {
                    text: 'اختر الشكل الصحيح: هديـ _',
                    options: ['ا', 'ى'],
                    correctIndex: 1,
                    hint: 'الألف اللينة في آخر الأسماء تكتب على صورة ياء غير منقوطة (ى)',
                    type: 'spelling'
                },
                {
                    text: 'اختر الشكل الصحيح: سماـ _',
                    options: ['ا', 'ى'],
                    correctIndex: 0,
                    hint: 'الألف اللينة في آخر الأفعال تكتب على صورة ألف (ا)',
                    type: 'spelling'
                },
                {
                    text: 'اختر الشكل الصحيح: عصـ _',
                    options: ['ا', 'ى'],
                    correctIndex: 0,
                    hint: 'الألف اللينة في آخر الأفعال تكتب على صورة ألف (ا)',
                    type: 'spelling'
                },
                {
                    text: 'اختر الشكل الصحيح: فتى الصغير',
                    options: ['ا', 'ى'],
                    correctIndex: 1,
                    hint: 'الألف اللينة في آخر الأسماء تكتب على صورة ياء غير منقوطة (ى)',
                    type: 'spelling'
                },
                {
                    text: 'اختر الشكل الصحيح: قام',
                    options: ['ا', 'ى'],
                    correctIndex: 0,
                    hint: 'الألف اللينة في آخر الأفعال تكتب على صورة ألف (ا)',
                    type: 'spelling'
                },
                {
                    text: 'اختر الشكل الصحيح: جري',
                    options: ['ا', 'ى'],
                    correctIndex: 0,
                    hint: 'الألف اللينة في آخر الأفعال تكتب على صورة ألف (ا)',
                    type: 'spelling'
                },
                {
                    text: 'اختر الشكل الصحيح: كتب',
                    options: ['ا', 'ى'],
                    correctIndex: 0,
                    hint: 'الألف اللينة في آخر الأفعال تكتب على صورة ألف (ا)',
                    type: 'spelling'
                },
                {
                    text: 'اختر الشكل الصحيح: قرأ',
                    options: ['ا', 'ى'],
                    correctIndex: 0,
                    hint: 'الألف اللينة في آخر الأفعال تكتب على صورة ألف (ا)',
                    type: 'spelling'
                },
                {
                    text: 'اختر الشكل الصحيح: دعا',
                    options: ['ا', 'ى'],
                    correctIndex: 0,
                    hint: 'الألف اللينة في آخر الأفعال تكتب على صورة ألف (ا)',
                    type: 'spelling'
                }
            ],

            punctuation: [
                {
                    text: 'ذهبت إلى المدرسة مبكرًا',
                    options: ['.', '؟', '!'],
                    correctIndex: 0,
                    hint: 'النقطة تأتي في نهاية الجملة الخبرية',
                    type: 'spelling'
                },
                {
                    text: 'هل تحب القراءة',
                    options: ['.', '؟', '!'],
                    correctIndex: 1,
                    hint: 'علامة الاستفهام تأتي في نهاية الجملة الاستفهامية',
                    type: 'spelling'
                },
                {
                    text: 'ما أجمل الطبيعة',
                    options: ['.', '؟', '!'],
                    correctIndex: 2,
                    hint: 'علامة التعجب تأتي في نهاية الجملة التعجبية',
                    type: 'spelling'
                },
                {
                    text: 'أحضرَ عليٌّ القلم الدفتر الحقيبة',
                    options: [',', '؛', '.'],
                    correctIndex: 2,
                    hint: 'الفاصلة المنقوطة تفصل بين جمل طويلة مترابطة',
                    type: 'spelling'
                },
                {
                    text: 'انتبه الطريق مزدحم',
                    options: ['.', '؟', '!'],
                    correctIndex: 2,
                    hint: 'علامة التعجب تأتي في نهاية الجملة الإنشائية الطلبية',
                    type: 'spelling'
                },
                {
                    text: 'ذهب إلى المدرسة',
                    options: ['.', '؟', '!'],
                    correctIndex: 0,
                    hint: 'النقطة تأتي في نهاية الجملة الخبرية',
                    type: 'spelling'
                },
                {
                    text: 'ماذا فعلت اليوم',
                    options: ['.', '؟', '!'],
                    correctIndex: 1,
                    hint: 'علامة الاستفهام تأتي في نهاية الجملة الاستفهامية',
                    type: 'spelling'
                },
                {
                    text: 'ما أجمل هذا اليوم',
                    options: ['.', '؟', '!'],
                    correctIndex: 2,
                    hint: 'علامة التعجب تأتي في نهاية الجملة التعجبية',
                    type: 'spelling'
                },
                {
                    text: 'ذهب إلى المدرسة، ثم ذهب إلى البيت',
                    options: [',', '؛', '.'],
                    correctIndex: 0,
                    hint: 'الفاصلة تفصل بين جمل قصيرة مترابطة',
                    type: 'spelling'
                },
                {
                    text: 'انتبه! الطريق مزدحم',
                    options: ['.', '؟', '!'],
                    correctIndex: 2,
                    hint: 'علامة التعجب تأتي في نهاية الجملة الإنشائية الطلبية',
                    type: 'spelling'
                }
            ],

            creative: [
                {
                    text: 'شيء له أسنان كثيرة لكنه لا يعض، ما هو؟',
                    options: ['المشط', 'الأسد', 'الفرشاة'],
                    correctIndex: 0,
                    hint: 'يستخدمه الناس لترتيب الشعر',
                    type: 'imagination'
                },
                {
                    text: 'شيء نراه في الليل فقط، ما هو؟',
                    options: ['الشمس', 'القمر', 'البحر'],
                    correctIndex: 1,
                    hint: 'يظهر في السماء ليلاً ويعكس ضوء الشمس',
                    type: 'imagination'
                },
                {
                    text: 'شيء يمشي بلا قدمين، ويبكي بلا عينين، ما هو؟',
                    options: ['السحابة', 'النهر', 'الهواء'],
                    correctIndex: 1,
                    hint: 'جسم مائي يجري بين الضفتين',
                    type: 'imagination'
                },
                {
                    text: 'أخبرني قصة قصيرة عن مغامرة في المملكة',
                    type: 'creative_writing',
                    hint: 'يمكنك استخدام الخيال والإبداع في كتابة قصتك'
                },
                {
                    text: 'ما هو الشيء الذي يبدأ بالحرف (أ) وينتهي بالحرف (ة)؟',
                    options: ['الأرض', 'السماء', 'البحر'],
                    correctIndex: 0,
                    hint: 'يحيط بالكرة الأرضية',
                    type: 'imagination'
                },
                {
                    text: 'ما هو الشيء الذي يبدأ بالحرف (ب) وينتهي بالحرف (ة)؟',
                    options: ['البحر', 'البرق', 'البقرة'],
                    correctIndex: 0,
                    hint: 'جسم مائي كبير',
                    type: 'imagination'
                },
                {
                    text: 'ما هو الشيء الذي يبدأ بالحرف (ت) وينتهي بالحرف (ة)؟',
                    options: ['التوت', 'التفاحة', 'التمرة'],
                    correctIndex: 0,
                    hint: 'فاكهة حلوة',
                    type: 'imagination'
                },
                {
                    text: 'ما هو الشيء الذي يبدأ بالحرف (ث) وينتهي بالحرف (ة)؟',
                    options: ['الثعلب', 'الثلج', 'الثمرة'],
                    correctIndex: 0,
                    hint: 'حيوان مفترس',
                    type: 'imagination'
                },
                {
                    text: 'ما هو الشيء الذي يبدأ بالحرف (ج) وينتهي بالحرف (ة)؟',
                    options: ['الجبل', 'الجسر', 'الجنة'],
                    correctIndex: 0,
                    hint: 'مكان مرتفع',
                    type: 'imagination'
                },
                {
                    text: 'ما هو الشيء الذي يبدأ بالحرف (ح) وينتهي بالحرف (ة)؟',
                    options: ['الحوت', 'الحمامة', 'الحنة'],
                    correctIndex: 0,
                    hint: 'حيوان بحري كبير',
                    type: 'imagination'
                }
            ]
        };

        return questions[worldKey] || [];
    }
}

// ---------- Leaderboard Manager ----------
class LeaderboardManager {
    static loadLeaderboard() {
        try {
            const raw = localStorage.getItem(CONFIG.STORAGE_KEYS.LEADERBOARD);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error('Error loading leaderboard:', e);
            return [];
        }
    }

    static saveLeaderboard(entries) {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEYS.LEADERBOARD, JSON.stringify(entries || []));
        } catch (e) {
            console.error('Error saving leaderboard:', e);
        }
    }

    static getLeaderboard() {
        return this.loadLeaderboard();
    }

    static addCurrentPlayer() {
        if (!player) return;

        const entries = this.loadLeaderboard();
        const totalPoints = PlayerManager.getTotalPoints();
        const totalStars = Object.values(player.worlds || {}).reduce((sum, world) => {
            return sum + (world && world.stars ? world.stars : 0);
        }, 0);

        const newEntry = {
            name: player.name || 'المستكشف',
            level: player.level || 1,
            points: totalPoints,
            stars: totalStars,
            date: new Date().toISOString()
        };

        entries.push(newEntry);
        entries.sort((a, b) => (b.points || 0) - (a.points || 0));

        this.saveLeaderboard(entries);

        UIManager.updateLeaderboardUI();
        PlayerManager.showNotification('تمت إضافة نتيجتك إلى قاعة الشرف ✨');
    }
}

// ---------- Audio Manager ----------
class AudioManager {
    static init() {
        audioElements = {
            background: document.getElementById('audio-bg'),
            click: document.getElementById('audio-click'),
            correct: document.getElementById('audio-correct'),
            wrong: document.getElementById('audio-wrong'),
            success: document.getElementById('audio-success'),
            levelUp: document.getElementById('audio-level-up')
        };

        // Set audio sources
        audioElements.background.src = CONFIG.AUDIO.FILES.BACKGROUND;
        audioElements.click.src = CONFIG.AUDIO.FILES.CLICK;
        audioElements.correct.src = CONFIG.AUDIO.FILES.CORRECT;
        audioElements.wrong.src = CONFIG.AUDIO.FILES.WRONG;
        audioElements.success.src = CONFIG.AUDIO.FILES.SUCCESS;
        audioElements.levelUp.src = CONFIG.AUDIO.FILES.LEVEL_UP;

        // Configure audio elements
        Object.values(audioElements).forEach(audio => {
            audio.volume = CONFIG.AUDIO.VOLUME.SFX;
            audio.preload = 'auto';
        });

        audioElements.background.volume = CONFIG.AUDIO.VOLUME.MUSIC;
        audioElements.background.loop = true;
    }

    static playSound(soundName) {
        if (!player.settings.sound) return;

        const audio = audioElements[soundName];
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log('Audio play failed:', e));
        }
    }

    static toggleMusic() {
        player.settings.music = !player.settings.music;
        if (player.settings.music) {
            audioElements.background.play();
        } else {
            audioElements.background.pause();
        }
        PlayerManager.savePlayer();
    }

    static toggleSound() {
        player.settings.sound = !player.settings.sound;
        PlayerManager.savePlayer();
    }
}

// ---------- UI Manager ----------
class UIManager {
    static showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        const targetScreen = document.getElementById(`screen-${screenId}`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            targetScreen.style.animation = 'fadeIn 0.5s ease-out';
        }

        // Update UI based on screen
        switch(screenId) {
            case 'main':
                this.updateQuickStats();
                break;
            case 'worlds':
                this.updateWorldsUI();
                break;
            case 'profile':
                this.updateProfileUI();
                break;
            case 'leaderboard':
                this.updateLeaderboardUI();
                break;
            case 'reports':
                this.updateReportsUI();
                break;
        }
    }

    static updateQuickStats() {
        if (!player) return;

        const spellingEl = document.getElementById('quick-spelling');
        const imaginationEl = document.getElementById('quick-imagination');
        const starsEl = document.getElementById('quick-stars');

        if (spellingEl) {
            spellingEl.textContent = String(player.spellingPoints || 0);
        }
        if (imaginationEl) {
            imaginationEl.textContent = String(player.imaginationPoints || 0);
        }
        if (starsEl) {
            const totalStars = Object.values(player.worlds || {}).reduce((sum, world) => {
                return sum + (world && world.stars ? world.stars : 0);
            }, 0);
            const filled = Math.min(3, totalStars);
            starsEl.textContent = '★'.repeat(filled) + '☆'.repeat(3 - filled);
        }
    }

    static updateWorldsUI() {
        if (!player || !player.worlds) return;

        const cards = document.querySelectorAll('.world-card');
        cards.forEach(card => {
            const worldKey = card.dataset.world;
            const world = player.worlds[worldKey];
            if (!world) return;

            const progressBar = card.querySelector('.world-progress .progress-fill');
            const progressText = card.querySelector('.world-progress .progress-text');
            const status = card.querySelector('.world-status');
            const playBtn = card.querySelector('.world-play-btn');

            if (progressBar) {
                const mastery = world.mastery || 0;
                progressBar.style.width = `${Math.max(0, Math.min(100, mastery * 100))}%`;
            }

            if (progressText) {
                if (world.unlocked) {
                    progressText.textContent = `${world.stars || 0}/3 نجوم`;
                } else {
                    progressText.textContent = 'مغلق';
                }
            }

            if (status) {
                status.classList.toggle('locked', !world.unlocked);
                status.classList.toggle('unlocked', !!world.unlocked);
                const icon = status.querySelector('i');
                if (icon) {
                    icon.className = world.unlocked ? 'fas fa-lock-open' : 'fas fa-lock';
                }
            }

            if (playBtn) {
                playBtn.disabled = !world.unlocked;
            }
        });
    }

    static updateProfileUI() {
        if (!player) return;

        const nameEl = document.getElementById('player-name');
        const avatarEl = document.getElementById('player-avatar');
        const levelEl = document.getElementById('player-level');
        const levelFill = document.querySelector('.profile-header .level-progress .progress-fill');
        const spellingEl = document.getElementById('stat-spelling');
        const imaginationEl = document.getElementById('stat-imagination');
        const starsEl = document.getElementById('stat-stars');
        const coinsEl = document.getElementById('stat-coins');
        const worldsList = document.getElementById('worlds-progress-list');

        if (nameEl) nameEl.textContent = player.name || 'المستكشف';
        if (avatarEl && player.avatar) avatarEl.src = player.avatar;

        const levelInfo = PlayerManager.calculateLevel();
        player.level = levelInfo.level;

        if (levelEl) levelEl.textContent = String(levelInfo.level);

            const overlay = document.getElementById('settings-modal-overlay');
            const soundInput = document.getElementById('setting-sound');
            const musicInput = document.getElementById('setting-music');
            const themeInput = document.getElementById('theme-toggle');
            const adaptiveInput = document.getElementById('setting-adaptive');
            const parentalInput = document.getElementById('setting-parental');
            const closeIcon = document.getElementById('btn-close-settings');
            const closeButton = document.getElementById('btn-settings-close');

            if (!overlay) return;

            // Initial checkbox states
            if (soundInput) {
                soundInput.checked = player.settings.sound !== false;
            }
            if (musicInput) {
                musicInput.checked = player.settings.music !== false;
            }
            if (themeInput) {
                themeInput.checked = player.settings.theme === 'dark';
            }
            if (adaptiveInput) {
                adaptiveInput.checked = player.settings.adaptiveDifficulty !== false;
            }
            if (parentalInput) {
                parentalInput.checked = !!player.settings.parentalMode;
            }

            const hideOverlay = () => {
                overlay.classList.add('hidden');
            };

            if (closeIcon) {
                closeIcon.onclick = hideOverlay;
            }
            if (closeButton) {
                closeButton.onclick = hideOverlay;
            }

            overlay.onclick = (event) => {
                if (event.target === overlay) {
                    hideOverlay();
                }
            };

            if (soundInput) {
                soundInput.onchange = () => {
                    player.settings.sound = soundInput.checked;
                    PlayerManager.savePlayer();
                };
            }

            if (musicInput) {
                musicInput.onchange = () => {
                    player.settings.music = musicInput.checked;
                    PlayerManager.savePlayer();

                    if (audioElements && audioElements.background) {
                        if (player.settings.music) {
                            audioElements.background.play().catch(() => {});
                        } else {
                            audioElements.background.pause();
                        }
                    }
                };
            }

            if (themeInput) {
                themeInput.onchange = () => {
                    player.settings.theme = themeInput.checked ? 'dark' : 'light';
                    UIManager.applyTheme();
                    PlayerManager.savePlayer();
                };
            }

            if (adaptiveInput) {
                adaptiveInput.onchange = () => {
                    player.settings.adaptiveDifficulty = adaptiveInput.checked;
                    PlayerManager.savePlayer();
                };
            }

            if (parentalInput) {
                parentalInput.onchange = () => {
                    player.settings.parentalMode = parentalInput.checked;
                    PlayerManager.savePlayer();
                };
            }
        }

        static showSettings() {
            const overlay = document.getElementById('settings-modal-overlay');
            if (!overlay) return;

            overlay.classList.remove('hidden');
            UIManager.updateSettingsUI();
        }

        static applyTheme() {
            PlayerManager.applyTheme();
        }
    }

// ---------- Game Manager ----------
class GameManager {
    static init() {
        player = PlayerManager.loadPlayer();
        PlayerManager.savePlayer();

        AudioManager.init();
        PlayerManager.applyTheme();

        this.setupEventListeners();

        UIManager.updateWorldsUI();
        UIManager.updateProfileUI();
        UIManager.updateLeaderboardUI();
        UIManager.updateQuickStats();
        UIManager.showScreen('main');
    }

    static setupEventListeners() {
        // Main menu buttons
        document.getElementById('btn-start').onclick = () => UIManager.showScreen('worlds');
        document.getElementById('btn-world-map').onclick = () => UIManager.showScreen('worlds');
        document.getElementById('btn-profile').onclick = () => UIManager.showScreen('profile');
        document.getElementById('btn-leaderboard').onclick = () => UIManager.showScreen('leaderboard');
        document.getElementById('btn-reports').onclick = () => UIManager.showScreen('reports');

        // Back buttons
        document.getElementById('btn-back-to-main').onclick = () => UIManager.showScreen('main');
        document.getElementById('btn-back-to-main-2').onclick = () => UIManager.showScreen('main');
        document.getElementById('btn-back-to-main-3').onclick = () => UIManager.showScreen('main');
        document.getElementById('btn-back-to-main-4').onclick = () => UIManager.showScreen('main');

        // ... (rest of the code remains the same)

        const worldCards = document.querySelectorAll('.world-card');
        worldCards.forEach(card => {
            const worldKey = card.dataset.world;
            const playBtn = card.querySelector('.world-play-btn');
            if (!playBtn) return;
            playBtn.onclick = () => {
                const world = player && player.worlds ? player.worlds[worldKey] : null;
                if (!world || !world.unlocked) {
                    PlayerManager.showNotification('أكمل العوالم السابقة لفتح هذا العالم');
                    return;
                }
                GameManager.startWorld(worldKey);
            };
        });

        const quitButton = document.getElementById('btn-quit-game');
        if (quitButton) {
            quitButton.onclick = () => {
                if (gameTimer) {
                    clearInterval(gameTimer);
                }
                UIManager.showScreen('main');
                UIManager.updateQuickStats();
            };
        }

        document.getElementById('btn-hint').onclick = () => {
            const questions = QuestionBank.getQuestionsForWorld(currentWorld);
            const question = questions[currentQuestionIndex];

            if (question && question.hint) {
                if (!hintShownForCurrentQuestion) {
                    hintShownForCurrentQuestion = true;
                    hintsUsedInSession += 1;
                    const world = player && player.worlds ? player.worlds[currentWorld] : null;
                    if (world && player.settings && player.settings.adaptiveDifficulty) {
                        const difficultyKey = world.difficulty || 'EASY';
                        const difficultyConfig = CONFIG.ADAPTIVE_DIFFICULTY[difficultyKey] || CONFIG.ADAPTIVE_DIFFICULTY.EASY;
                        score = Math.max(0, score - difficultyConfig.hintPenalty);
                        const scoreElement = document.getElementById('game-score');
                        if (scoreElement) {
                            scoreElement.textContent = score;
                        }
                    }
                }
                const hintContainer = document.querySelector('.hint-container');
                const hintText = document.getElementById('question-hint');
                hintText.textContent = question.hint;
                hintContainer.classList.remove('hidden');
            }
        };

        document.getElementById('btn-skip').onclick = () => {
            const questions = QuestionBank.getQuestionsForWorld(currentWorld);
            if (currentQuestionIndex < questions.length - 1) {
                UIManager.loadQuestion(currentWorld, currentQuestionIndex + 1);
            }
        };

        // Leaderboard actions
        document.getElementById('btn-add-to-leaderboard').onclick = () => {
            LeaderboardManager.addCurrentPlayer();
        };

        // Share button
        document.getElementById('btn-share-score').onclick = () => {
            this.shareScore();
        };

        // Settings button
        document.getElementById('btn-settings').onclick = () => {
            UIManager.showSettings();
        };
        
        const changeAvatarButton = document.getElementById('btn-change-avatar');
        if (changeAvatarButton) {
            changeAvatarButton.onclick = () => {
                PlayerManager.showNotification('تخصيص الصورة سيكون متاحاً في تحديث قادم');
            };
        }
        
        const footerButtons = document.querySelectorAll('.footer-social .social-btn');
        if (footerButtons[0]) {
            footerButtons[0].onclick = () => {
                PlayerManager.showNotification('للاستفسارات أو المساعدة، يمكن للوالد أو المعلم مرافقة الطفل أثناء اللعب');
            };
        }
        if (footerButtons[1]) {
            footerButtons[1].onclick = () => {
                AudioManager.toggleSound();
            };
        }
        if (footerButtons[2]) {
            footerButtons[2].onclick = () => {
                if (!player.settings) {
                    player.settings = {};
                }
                if (!player.settings.theme) {
                    player.settings.theme = 'light';
                }
                player.settings.theme = player.settings.theme === 'dark' ? 'light' : 'dark';
                UIManager.applyTheme();
                PlayerManager.savePlayer();
                const themeToggleElement = document.getElementById('theme-toggle');
                if (themeToggleElement) {
                    themeToggleElement.checked = player.settings.theme === 'dark';
                }
            };
        }
    }

    static startWorld(worldKey) {
        currentWorld = worldKey;
        currentQuestionIndex = 0;
        score = 0;
        correctAnswers = 0;
        hintsUsedInSession = 0;
        totalQuestions = QuestionBank.getQuestionsForWorld(worldKey).length;

        UIManager.showGameScreen(worldKey);
    }

    static handleAnswer(selectedIndex, correctIndex) {
        AudioManager.playSound('click');

        const questions = QuestionBank.getQuestionsForWorld(currentWorld);
        const question = questions[currentQuestionIndex];

        // Disable all buttons
        const optionButtons = document.querySelectorAll('.option-btn');
        optionButtons.forEach(btn => {
            btn.disabled = true;
            if (parseInt(btn.dataset.index) === correctIndex) {
                btn.classList.add('correct');
            } else if (parseInt(btn.dataset.index) === selectedIndex) {
                btn.classList.add('wrong');
            }
        });

        // Check answer
        if (selectedIndex === correctIndex) {
            correctAnswers++;
            let reward = CONFIG.REWARDS.CORRECT_ANSWER;
            const world = player && player.worlds ? player.worlds[currentWorld] : null;
            if (world && player.settings && player.settings.adaptiveDifficulty) {
                const difficultyKey = world.difficulty || 'EASY';
                const difficultyConfig = CONFIG.ADAPTIVE_DIFFICULTY[difficultyKey] || CONFIG.ADAPTIVE_DIFFICULTY.EASY;
                reward = Math.round(reward * difficultyConfig.scoreMultiplier);
            }
            score += reward;

            const scoreElement = document.getElementById('game-score');
            if (scoreElement) {
                scoreElement.textContent = score;
            }

            AudioManager.playSound('correct');
            UIManager.showFeedback('إجابة صحيحة! أحسنت 🎉', true);

            if (question.type === 'spelling') {
                player.spellingPoints += reward;
            } else if (question.type === 'imagination') {
                player.imaginationPoints += reward;
            }
        } else {
            AudioManager.playSound('wrong');
            UIManager.showFeedback('إجابة خاطئة، حاول مرة أخرى!', false);
        }

        // Update player
        PlayerManager.savePlayer();

        // Load next question after delay
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                UIManager.loadQuestion(currentWorld, currentQuestionIndex + 1);
            } else {
                this.finishWorld();
            }
        }, 1500);
    }

    static handleCreativeStory(storyText) {
        if (!storyText.trim()) {
            UIManager.showFeedback('اكتب قصة أولاً قبل الإرسال', false);
            return;
        }

        AudioManager.playSound('success');

        // Score the story based on length and creativity
        let storyScore = Math.min(storyText.length / 10, 20); // Max 20 points for length

        // Bonus for using certain words
        const creativeWords = ['خيال', 'مغامرة', 'ملك', 'كنز', 'سحر'];
        creativeWords.forEach(word => {
            if (storyText.includes(word)) storyScore += 5;
        });

        // Add to imagination points
        player.imaginationPoints += Math.floor(storyScore);
        player.coins += 10; // Bonus coins for creativity

        // Mark as correct answer
        correctAnswers++;
        score += Math.floor(storyScore);

        PlayerManager.savePlayer();

        UIManager.showFeedback(`قصة رائعة! حصلت على ${Math.floor(storyScore)} نقطة`, true);

        // Finish the world after creative writing
        setTimeout(() => {
            this.finishWorld();
        }, 2000);
    }

    static finishWorld() {
        clearInterval(gameTimer);

        const questions = QuestionBank.getQuestionsForWorld(currentWorld);
        const accuracy = questions.length > 0 ? (correctAnswers / questions.length) : 0;

        // Calculate stars
        let starsEarned = 0;
        if (accuracy >= CONFIG.REWARDS.STAR_3_THRESHOLD) starsEarned = 3;
        else if (accuracy >= CONFIG.REWARDS.STAR_2_THRESHOLD) starsEarned = 2;
        else if (accuracy >= CONFIG.REWARDS.STAR_1_THRESHOLD) starsEarned = 1;

        // Add bonus for perfect score
        if (starsEarned === 3) {
            score += CONFIG.REWARDS.PERFECT_SCORE_BONUS;
            player.coins += 25;
        }

        // Update world progress
        const world = player.worlds[currentWorld];
        world.completed = true;
        if (starsEarned > world.stars) {
            world.stars = starsEarned;
        }
        if (score > world.bestScore) {
            world.bestScore = score;
        }

        world.mastery = accuracy;
        world.lastPlayed = new Date().toISOString();
        if (!Array.isArray(world.progressHistory)) {
            world.progressHistory = [];
        }
        world.progressHistory.push({
            date: world.lastPlayed,
            accuracy,
            stars: starsEarned,
            score
        });

        if (player.settings && player.settings.adaptiveDifficulty) {
            const difficultyOrder = ['EASY', 'MEDIUM', 'HARD'];
            const currentDifficultyIndex = difficultyOrder.indexOf(world.difficulty || 'EASY');
            if (accuracy >= CONFIG.PROGRESS_TRACKING.MASTERY_THRESHOLD && currentDifficultyIndex < difficultyOrder.length - 1) {
                world.difficulty = difficultyOrder[currentDifficultyIndex + 1];
            } else if (accuracy <= CONFIG.PROGRESS_TRACKING.WEAKNESS_THRESHOLD && currentDifficultyIndex > 0) {
                world.difficulty = difficultyOrder[currentDifficultyIndex - 1];
            }
        }

        if (player.analytics) {
            const previousSessions = player.analytics.sessionsCount || 0;
            const previousAverage = player.analytics.averageAccuracy || 0;
            const newSessions = previousSessions + 1;
            const newAverage = ((previousAverage * previousSessions) + accuracy) / newSessions;
            player.analytics.sessionsCount = newSessions;
            player.analytics.averageAccuracy = newAverage;
            player.analytics.improvementRate = newSessions > 1 ? accuracy - previousAverage : 0;

            if (!Array.isArray(player.analytics.strengthAreas)) {
                player.analytics.strengthAreas = [];
            }
            if (!Array.isArray(player.analytics.focusAreas)) {
                player.analytics.focusAreas = [];
            }
            if (accuracy >= CONFIG.PROGRESS_TRACKING.MASTERY_THRESHOLD) {
                if (!player.analytics.strengthAreas.includes(currentWorld)) {
                    player.analytics.strengthAreas.push(currentWorld);
                }
                player.analytics.focusAreas = player.analytics.focusAreas.filter(area => area !== currentWorld);
            } else if (accuracy <= CONFIG.PROGRESS_TRACKING.WEAKNESS_THRESHOLD) {
                if (!player.analytics.focusAreas.includes(currentWorld)) {
                    player.analytics.focusAreas.push(currentWorld);
                }
            }
        }

        // Unlock next world
        this.unlockNextWorld(currentWorld);

        // Add experience
        const expEarned = starsEarned * 20 + Math.floor(score / 10);
        PlayerManager.addExperience(expEarned);

        // Add coins
        player.coins += starsEarned * 10;

        // Save player data
        PlayerManager.savePlayer();

        // Play success sound
        AudioManager.playSound('success');

        // Show result
        UIManager.showResult(starsEarned, score);

        // Update UI
        UIManager.updateQuickStats();
    }

    static unlockNextWorld(currentWorldKey) {
        const worldIndex = CONFIG.WORLD_ORDER.indexOf(currentWorldKey);
        if (worldIndex === -1 || worldIndex >= CONFIG.WORLD_ORDER.length - 1) return;

        const nextWorldKey = CONFIG.WORLD_ORDER[worldIndex + 1];
        const nextWorld = player.worlds[nextWorldKey];

        if (nextWorld && !nextWorld.unlocked) {
            nextWorld.unlocked = true;
            PlayerManager.showNotification(`✨ تم فتح العالم الجديد: ${nextWorld.name}`);
        }
    }

    static shareScore() {
        const totalScore = PlayerManager.getTotalPoints();
        const totalStars = Object.values(player.worlds).reduce((sum, world) => sum + world.stars, 0);

        const shareText = `حصلت على ${totalScore} نقطة و${totalStars} نجوم في لعبة "مملكة الكلمات والخيال"! 🏰✨\nجربها الآن: ${window.location.href}`;

        if (navigator.share) {
            navigator.share({
                title: 'مملكة الكلمات والخيال',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                PlayerManager.showNotification('تم نسخ النتيجة للحافظة 📋');
            });
        }
    }
}

// ---------- Initialize Game ----------
document.addEventListener('DOMContentLoaded', () => {
    GameManager.init();
});

// ---------- Service Worker Registration (PWA) ----------
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful');
        }).catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}