/* ==========================================================
   0. KONFIGURATION
   ========================================================== */
const SUPABASE_URL = 'https://qkmhdjvvvduwsbmllvpj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_hRTwMKgMggB8TPlThZgKfg_uqCnB8Re';
const HCAPTCHA_SITE_KEY = 'ddc833be-032c-40d4-9d98-2c7aa9a2cf4c';

// WICHTIG: Variable heißt "supabaseClient", NICHT "supabase" (Konflikt mit CDN)
let supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let hcaptchaWidgetLogin = null;
let hcaptchaWidgetRegister = null;
let hcaptchaTokenLogin = null;
let hcaptchaTokenRegister = null;

/* ==========================================================
   1. ÜBERSETZUNGEN (i18n)
   ========================================================== */
const translations = {
    de: {
        appTitle: "Vokabeltrainer", resumeMsg: "Unvollendete Lerneinheit!", btnResume: "Fortsetzen",
        labelLang: "Was möchtest du lernen?", optSelectLang: "-- Sprache wählen --", labelBook: "Welches Buch?",
        optSelectBook: "-- Buch wählen --", optSelectLangFirst: "-- Erst Sprache wählen --",
        labelChapters: "Kapitel (Mehrfachauswahl)", msgSelectBookFirst: "Bitte erst ein Buch wählen.",
        labelDirection: "Abfragerichtung", dirMixed: "Mischung", dirTargetToNative: "Fremdsprache → Muttersprache",
        dirNativeToTarget: "Muttersprache → Fremdsprache", btnStart: "Lernen starten 🚀", btnLoading: "Lade...",
        msgLoadingData: "Lade Vokabeln aus der Cloud...", statQueue: "Warteschlange: ", btnCheck: "Überprüfen",
        btnShowSolution: "Lösung anzeigen", msgCorrect: "Richtig! ✅", msgWrong: "Falsch. ❌",
        msgFinishTitle: "Session Beendet! 🎉", msgFinishSub: "Super gemacht!", msgFinishDesc: "Du hast alle Wörter dieser Auswahl gelernt.",
        btnRestart: "Neue Session starten", alertNoSelection: "Bitte wähle Sprache, Buch und Kapitel aus!",
        confirmExitTitle: "Session beenden?", confirmExit: "Möchtest du die Session unterbrechen? Fortschritt wird gespeichert.",
        btnCancel: "Abbrechen", btnYesExit: "Ja, beenden", errorFetch: "Fehler beim Laden der Vokabeln.",
        typeMC: "Multiple Choice", typeInput: "Tippen", placeholderInput: "Antwort eingeben...",
        btnExport: "📤 Export", btnImport: "📥 Import", btnDifficult: "⚠️ Schwierige Wörter",
        authTitle: "Account", btnLogin: "Einloggen", btnRegister: "Account erstellen", btnLogout: "Logout",
        btnClose: "Schließen", msgDifficultEmpty: "Keine schwierigen Wörter gefunden!",
        msgImportSuccess: "Fortschritt erfolgreich importiert!", msgImportError: "Fehler beim Importieren.",
        msgNoSupabase: "Supabase ist nicht konfiguriert.", msgLoginSuccess: "Erfolgreich angemeldet!",
        msgLoginError: "Login fehlgeschlagen.", msgRegisterSuccess: "Registrierung erfolgreich! Du kannst dich jetzt einloggen.",
        msgPasswordsDontMatch: "Die Passwörter stimmen nicht überein!", msgFieldsEmpty: "Bitte fülle alle Felder aus.",
        msgLogoutSuccess: "Erfolgreich ausgeloggt.", msgCaptchaError: "Bitte bestätige das Captcha.",
        labelUsername: "Benutzername", btnSaveUsername: "Speichern",
        labelCurrentPassword: "Aktuelles Passwort", labelNewPassword: "Neues Passwort", labelConfirmNewPassword: "Neues Passwort wiederholen", btnChangePassword: "Passwort ändern",
        msgUsernameUpdated: "Benutzername erfolgreich aktualisiert!", msgUsernameError: "Fehler beim Aktualisieren des Benutzernamens.",
        msgPasswordUpdated: "Passwort erfolgreich geändert!", msgPasswordError: "Fehler beim Ändern des Passworts.",
        msgCurrentPasswordWrong: "Das aktuelle Passwort ist falsch.", msgPasswordMismatch: "Die neuen Passwörter stimmen nicht überein!",
        mfaLoginTitle: "Zwei-Faktor-Authentifizierung", mfaLoginDesc: "Bitte gib den 6-stelligen Code aus deiner Authenticator-App ein.",
        btnVerify: "Bestätigen", btnVerifyBackup: "Backup-Code einlösen", mfaUseBackup: "Backup-Code verwenden",
        msgMfaSuccess: "2FA erfolgreich aktiviert!", msgMfaError: "Ungültiger Code. Bitte versuche es erneut.",
        msgBackupSuccess: "Login mit Backup-Code erfolgreich!", msgBackupError: "Ungültiger oder bereits verwendeter Backup-Code.",
        msgMfaDisabled: "Status: Deaktiviert ❌", msgMfaEnabled: "Status: Aktiviert ✅", btnEnableMfa: "2FA aktivieren"
    },
    en: {
        appTitle: "Vocabulary Trainer", resumeMsg: "Unfinished session!", btnResume: "Resume",
        labelLang: "What do you want to learn?", optSelectLang: "-- Select language --", labelBook: "Which book?",
        optSelectBook: "-- Select book --", optSelectLangFirst: "-- Select language first --",
        labelChapters: "Chapters (Multiple)", msgSelectBookFirst: "Please select a book first.",
        labelDirection: "Direction", dirMixed: "Mixed", dirTargetToNative: "Target → Native",
        dirNativeToTarget: "Native → Target", btnStart: "Start Learning 🚀", btnLoading: "Loading...",
        msgLoadingData: "Loading vocabulary from cloud...", statQueue: "Queue: ", btnCheck: "Check",
        btnShowSolution: "Show solution", msgCorrect: "Correct! ✅", msgWrong: "Wrong. ❌",
        msgFinishTitle: "Session Finished! 🎉", msgFinishSub: "Well done!", msgFinishDesc: "You learned all words.",
        btnRestart: "Start new session", alertNoSelection: "Please select language, book and chapters!",
        confirmExitTitle: "End Session?", confirmExit: "Do you want to pause? Progress will be saved.",
        btnCancel: "Cancel", btnYesExit: "Yes, end", errorFetch: "Error loading vocabulary.",
        typeMC: "Multiple Choice", typeInput: "Typing", placeholderInput: "Enter answer...",
        btnExport: "📤 Export", btnImport: "📥 Import", btnDifficult: "⚠️ Difficult Words",
        authTitle: "Account", btnLogin: "Log in", btnRegister: "Create Account", btnLogout: "Logout",
        btnClose: "Close", msgDifficultEmpty: "No difficult words found!",
        msgImportSuccess: "Imported successfully!", msgImportError: "Error importing.",
        msgNoSupabase: "Supabase not configured.", msgLoginSuccess: "Logged in!",
        msgLoginError: "Login failed.", msgRegisterSuccess: "Registration successful! You can log in now.",
        msgPasswordsDontMatch: "Passwords do not match!", msgFieldsEmpty: "Please fill all fields.",
        msgLogoutSuccess: "Logged out.", msgCaptchaError: "Please complete the captcha.",
        labelUsername: "Username", btnSaveUsername: "Save",
        labelCurrentPassword: "Current Password", labelNewPassword: "New Password", labelConfirmNewPassword: "Confirm New Password", btnChangePassword: "Change Password",
        msgUsernameUpdated: "Username updated!", msgUsernameError: "Error updating username.",
        msgPasswordUpdated: "Password updated!", msgPasswordError: "Error updating password.",
        msgCurrentPasswordWrong: "Current password is incorrect.", msgPasswordMismatch: "New passwords do not match!",
        mfaLoginTitle: "Two-Factor Authentication", mfaLoginDesc: "Please enter the 6-digit code from your authenticator app.",
        btnVerify: "Verify", btnVerifyBackup: "Redeem Backup Code", mfaUseBackup: "Use Backup Code",
        msgMfaSuccess: "2FA activated successfully!", msgMfaError: "Invalid code. Please try again.",
        msgBackupSuccess: "Login with backup code successful!", msgBackupError: "Invalid or already used backup code.",
        msgMfaDisabled: "Status: Disabled ❌", msgMfaEnabled: "Status: Enabled ✅", btnEnableMfa: "Enable 2FA"
    }
};

let currentUILang = localStorage.getItem('uiLang') || 'de';
const t = (key) => translations[currentUILang][key] || key;

/* ==========================================================
   2. STATE & LOKALER CACHE
   ========================================================== */
let library = {};
let state = { targetLang: '', nativeLang: '', book: '', chapters: [], sessionWords: [], queue: [], stats: { correct: 0, wrong: 0 }, isActive: false };
let gamification = JSON.parse(localStorage.getItem('vocabGamification_v1')) || { xp: 0, level: 1, streak: 0, lastLearningDate: null };
let vocabErrors = JSON.parse(localStorage.getItem('vocabErrors_v1')) || {};

let currentWord = null;
let isLocked = false;
let currentQuestionType = 'mc';
let currentDirection = 'target-to-native';
let currentUser = null;

// DOM
const langSelect = document.getElementById('langSelect');
const bookSelect = document.getElementById('bookSelect');
const chaptersContainer = document.getElementById('chaptersContainer');
const setupScreen = document.getElementById('setupScreen');
const learnScreen = document.getElementById('learnScreen');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const gamificationBar = document.getElementById('gamificationBar');
const resumeBanner = document.getElementById('resumeBanner');
const btnStart = document.getElementById('btnStart');
const btnBack = document.getElementById('btnBack');
const flashcard = document.getElementById('flashcard');
const answerArea = document.getElementById('answerArea');
const feedbackMsg = document.getElementById('feedbackMsg');
const questionTypeLabel = document.getElementById('questionTypeLabel');
const directionLabel = document.getElementById('directionLabel');
const setupFormPanel = document.getElementById('setupFormPanel');
const setupLoadingPanel = document.getElementById('setupLoadingPanel');

/* ==========================================================
   3. INITIALISIERUNG
   ========================================================== */
async function init() {
    document.getElementById('uiLangSelect').value = currentUILang;
    document.getElementById('directionSelect').value = 'mixed';
    applyTranslations();
    renderGamification();
    updateThemeIcon();

    let saved = localStorage.getItem('proVocabTrainerState_v4');
    if (saved) {
        let parsed = JSON.parse(saved);
        if (parsed.isActive && parsed.queue.length > 0) resumeBanner.style.display = 'flex';
    }

    if (supabaseClient) {
        supabaseClient.auth.onAuthStateChange((_event, session) => {
            currentUser = session?.user || null;
            updateAuthUI(session);
            if (session) {
                fetchUserProfile(session.user);
                loadCloudLibrary();
                checkMfaStatus();
            }
        });
        const { data } = await supabaseClient.auth.getSession();
        if (data.session) {
            currentUser = data.session.user;
            updateAuthUI(data.session);
            fetchUserProfile(data.session.user);
            loadCloudLibrary();
            checkMfaStatus();
        } else {
            loadCloudLibrary();
        }
    }
}

async function loadCloudLibrary() {
    if (!supabaseClient) return;
    setupFormPanel.style.display = 'none';
    setupLoadingPanel.style.display = 'block';

    try {
        const { data: langs } = await supabaseClient.from('languages').select('*');
        const { data: books } = await supabaseClient.from('books').select('*');
        const { data: chapters } = await supabaseClient.from('chapters').select('*');
        const { data: vocabs } = await supabaseClient.from('vocabularies').select('*');

        if (!langs || !books || !chapters || !vocabs) throw new Error("Daten unvollständig");

        library = {};
        langs.forEach(lang => {
            library[lang.name] = {};
            const langBooks = books.filter(b => b.language_id === lang.id);
            langBooks.forEach(book => {
                library[lang.name][book.name] = {};
                const bookChaps = chapters.filter(c => c.book_id === book.id);
                bookChaps.forEach(chap => {
                    const chapVocabs = vocabs.filter(v => v.chapter_id === chap.id);
                    library[lang.name][book.name][chap.name] = chapVocabs;
                });
            });
        });

        langSelect.innerHTML = `<option value="">${t('optSelectLang')}</option>`;
        Object.keys(library).forEach(lp => {
            let option = document.createElement('option');
            option.value = lp; option.textContent = lp.replace('-', ' ➔ ');
            langSelect.appendChild(option);
        });
        setupLoadingPanel.style.display = 'none';
        setupFormPanel.style.display = 'block';
    } catch (err) {
        console.error(err);
        showToast(t('errorFetch'), 'error');
        setupLoadingPanel.innerHTML = `<p style="color:var(--wrong)">${t('errorFetch')}</p>`;
    }
}

/* ==========================================================
   4. USER PROFILE & AUTH
   ========================================================== */
async function fetchUserProfile(user) {
    const { data } = await supabaseClient.from('profiles').select('username').eq('id', user.id).single();
    if (data && data.username) {
        document.getElementById('profileUsername').value = data.username;
    }
    const { data: stats } = await supabaseClient.from('user_stats').select('*').eq('user_id', user.id).single();
    if (stats) {
        gamification.xp = stats.xp;
        gamification.level = stats.level;
        gamification.streak = stats.streak;
        gamification.lastLearningDate = stats.last_learning_date;
        renderGamification();
    }
}

async function updateUsername() {
    if (!currentUser) return;
    const newName = document.getElementById('profileUsername').value.trim();
    if (!newName) return showToast(t('msgFieldsEmpty'), 'error');

    const { error } = await supabaseClient.from('profiles').update({ username: newName }).eq('id', currentUser.id);
    if (error) showToast(t('msgUsernameError'), 'error');
    else showToast(t('msgUsernameUpdated'), 'success');
}

async function updatePassword() {
    if (!currentUser) return;

    const currentPw = document.getElementById('profileCurrentPassword').value;
    const newPw = document.getElementById('profileNewPassword').value;
    const confirmPw = document.getElementById('profileConfirmPassword').value;

    if (!currentPw || !newPw || !confirmPw) return showToast(t('msgFieldsEmpty'), 'error');
    if (newPw !== confirmPw) return showToast(t('msgPasswordMismatch'), 'error');
    if (newPw.length < 6) return showToast("Passwort muss mindestens 6 Zeichen haben.", 'error');

    // 1. Prüfen, ob das aktuelle Passwort korrekt ist (Re-Authentifizierung)
    // Hinweis: Wenn MFA aktiviert ist, könnte dies eine AAL2-Fehler zurückgeben.
    // In dem Fall überspringen wir den stillen Login und vertrauen auf die aktive Session.
    const { error: signInError } = await supabaseClient.auth.signInWithPassword({
        email: currentUser.email,
        password: currentPw
    });

    if (signInError && signInError.message !== "AAL2 required") {
        return showToast(t('msgCurrentPasswordWrong'), 'error');
    }

    // 2. Neues Passwort setzen
    const { error: updateError } = await supabaseClient.auth.updateUser({ password: newPw });

    if (updateError) {
        showToast(t('msgPasswordError') + ': ' + updateError.message, 'error');
    } else {
        showToast(t('msgPasswordUpdated'), 'success');
        document.getElementById('profileCurrentPassword').value = '';
        document.getElementById('profileNewPassword').value = '';
        document.getElementById('profileConfirmPassword').value = '';
    }
}

/* ==========================================================
   5. 2FA (TOTP) SETUP & LOGIN
   ========================================================== */
async function checkMfaStatus() {
    if (!currentUser) return;
    const { data: factors } = await supabaseClient.auth.mfa.listFactors();
    const hasTotp = factors && factors.totp && factors.totp.length > 0;

    const mfaStatusEl = document.getElementById('mfaStatus');
    const btnEnableMfa = document.getElementById('btnEnableMfa');

    if (hasTotp) {
        mfaStatusEl.textContent = t('msgMfaEnabled');
        mfaStatusEl.style.color = "var(--correct)";
        btnEnableMfa.style.display = 'none';
        document.getElementById('mfaSetupArea').style.display = 'none';
    } else {
        mfaStatusEl.textContent = t('msgMfaDisabled');
        mfaStatusEl.style.color = "var(--text-muted)";
        btnEnableMfa.style.display = 'inline-block';
    }
}

async function startMfaSetup() {
    if (!currentUser) return;

    // 1. Alte, nicht verifizierte Faktoren aufräumen
    const { data: factors } = await supabaseClient.auth.mfa.listFactors();
    if (factors && factors.all) {
        for (const factor of factors.all) {
            if (factor.factor_type === 'totp' && factor.status === 'unverified') {
                await supabaseClient.auth.mfa.unenroll({ factorId: factor.id });
            }
        }
    }

    const { data, error } = await supabaseClient.auth.mfa.enroll({ factorType: 'totp' });
    if (error) return showToast(error.message, 'error');

    // 2. Container leeren, falls er schon benutzt wurde
    const qrContainer = document.getElementById('mfaQrCode');
    qrContainer.innerHTML = '';

    // 3. QR-Code sauber mit der Library generieren
    new QRCode(qrContainer, {
        text: data.totp.uri, // Die otpauth:// URI ist standardisiert und perfekt für die Library
        width: 180,
        height: 180,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    // 4. Den manuellen Secret Key anzeigen
    document.getElementById('mfaManualSecret').textContent = data.totp.secret;

    // 5. UI aufklappen
    document.getElementById('mfaSetupArea').style.display = 'block';
    document.getElementById('btnEnableMfa').style.display = 'none';

    window.currentMfaFactorId = data.id;
}

async function verifyMfaSetup() {
    const code = document.getElementById('mfaSetupCode').value;
    if (!code) return showToast(t('msgFieldsEmpty'), 'error');

    const factorId = window.currentMfaFactorId;
    const { data: challenge, error: challengeError } = await supabaseClient.auth.mfa.challenge({ factorId });
    if (challengeError) return showToast(challengeError.message, 'error');

    const { error: verifyError } = await supabaseClient.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code: code
    });

    if (verifyError) {
        showToast(t('msgMfaError'), 'error');
    } else {
        showToast(t('msgMfaSuccess'), 'success');
        document.getElementById('mfaSetupArea').style.display = 'none';
        document.getElementById('mfaSetupCode').value = '';
        checkMfaStatus();
        generateBackupCodes();
    }
}

async function generateBackupCodes() {
    const codes = [];
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    for (let i = 0; i < 8; i++) {
        let code = '';
        for (let j = 0; j < 4; j++) code += chars[Math.floor(Math.random() * chars.length)];
        code += '-';
        for (let j = 0; j < 4; j++) code += chars[Math.floor(Math.random() * chars.length)];
        codes.push(code);
    }

    const grid = document.getElementById('backupCodesGrid');
    grid.innerHTML = '';
    codes.forEach(c => {
        const span = document.createElement('span');
        span.textContent = c;
        grid.appendChild(span);
    });
    document.getElementById('mfaBackupArea').style.display = 'block';

    const payload = codes.map(c => ({ user_id: currentUser.id, code: c }));
    await supabaseClient.from('mfa_backup_codes').insert(payload);
}

async function verifyMfaLogin() {
    const code = document.getElementById('mfaLoginCode').value;
    if (!code) return showToast(t('msgFieldsEmpty'), 'error');

    const { data: factors } = await supabaseClient.auth.mfa.listFactors();
    const totpFactor = factors.totp[0];
    if (!totpFactor) return showToast("2FA nicht eingerichtet.", 'error');

    const { data: challenge, error: challengeError } = await supabaseClient.auth.mfa.challenge({ factorId: totpFactor.id });
    if (challengeError) return showToast(challengeError.message, 'error');

    const { error: verifyError } = await supabaseClient.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: challenge.id,
        code: code
    });

    if (verifyError) {
        showToast(t('msgMfaError'), 'error');
    } else {
        showToast(t('msgLoginSuccess'), 'success');
        document.getElementById('mfaLoginModal').style.display = 'none';
        closeAuthModal();
        document.getElementById('mfaLoginCode').value = '';
    }
}

function toggleBackupCodeLogin() {
    const section = document.getElementById('backupCodeLoginSection');
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

async function verifyBackupCodeLogin() {
    const code = document.getElementById('mfaBackupCode').value.trim().toUpperCase();
    if (!code) return showToast(t('msgFieldsEmpty'), 'error');

    const { data, error } = await supabaseClient
        .from('mfa_backup_codes')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('code', code)
        .eq('used', false)
        .single();

    if (error || !data) {
        return showToast(t('msgBackupError'), 'error');
    }

    await supabaseClient.from('mfa_backup_codes').update({ used: true }).eq('id', data.id);

    showToast(t('msgBackupSuccess'), 'success');
    document.getElementById('mfaLoginModal').style.display = 'none';
    closeAuthModal();
    document.getElementById('mfaBackupCode').value = '';
}

/* ==========================================================
   6. TOAST & MODAL SYSTEM
   ========================================================== */
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    let icon = type === 'error' ? '❌' : (type === 'success' ? '✅' : 'ℹ️');
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 4000);
}

let confirmActionCallback = null;
function askConfirmExit() {
    document.getElementById('confirmModal').style.display = 'flex';
    confirmActionCallback = () => {
        saveState();
        learnScreen.classList.remove('active');
        setupScreen.classList.add('active');
        progressContainer.style.display = 'none';
        gamificationBar.style.display = 'none';
        btnBack.style.display = 'none';
        document.getElementById('appTitle').textContent = t('appTitle');
        progressBar.style.width = '0%';
        resumeBanner.style.display = state.queue.length > 0 ? 'flex' : 'none';
        closeConfirmModal();
    };
}
function closeConfirmModal() {
    document.getElementById('confirmModal').style.display = 'none';
    confirmActionCallback = null;
}
function executeConfirmAction() {
    if (confirmActionCallback) confirmActionCallback();
}

/* ==========================================================
   7. LERN-SESSION & SYNC
   ========================================================== */
async function startLearning(difficultOnly = false) {
    let words = [];
    let lang, book, chapters;

    if (difficultOnly) {
        const ids = Object.keys(vocabErrors);
        if (ids.length === 0) return showToast(t('msgDifficultEmpty'), 'info');
        Object.keys(library).forEach(l => Object.keys(library[l]).forEach(b => Object.keys(library[l][b]).forEach(c => {
            library[l][b][c].forEach(v => {
                if (ids.includes(v.id)) {
                    words.push({ ...v, langPair: l, book: b });
                }
            });
        })));
        if (words.length === 0) return showToast(t('msgDifficultEmpty'), 'info');
        lang = words[0].langPair; book = words[0].book; chapters = ['difficult'];
    } else {
        lang = langSelect.value; book = bookSelect.value;
        const checked = chaptersContainer.querySelectorAll('input[type="checkbox"]:checked');
        if (!lang || !book || checked.length === 0) return showToast(t('alertNoSelection'), 'error');
        chapters = Array.from(checked).map(c => c.value);

        chapters.forEach(ch => {
            if (library[lang] && library[lang][book] && library[lang][book][ch]) {
                words = words.concat(library[lang][book][ch].map(w => ({ ...w, langPair: lang, book: book })));
            }
        });
    }

    btnStart.disabled = true;
    btnStart.textContent = t('btnLoading');

    let cloudProgress = {};
    if (currentUser) {
        const { data } = await supabaseClient.from('user_progress').select('*').eq('user_id', currentUser.id);
        if (data) {
            data.forEach(p => { cloudProgress[p.vocab_id] = p; });
        }
    }

    state = {
        targetLang: lang.split('-')[0], nativeLang: lang.split('-')[1], book: book, chapters: chapters,
        sessionWords: [...words],
        queue: words.map(w => {
            const p = cloudProgress[w.id] || { streak: 0, errors: 0, box: 1 };
            return { ...w, streak: p.streak, errors: p.errors, box: p.box };
        }),
        stats: { correct: 0, wrong: 0 }, isActive: true
    };

    shuffleArray(state.queue);
    setupScreen.classList.remove('active');
    learnScreen.classList.add('active');
    progressContainer.style.display = 'block';
    gamificationBar.style.display = 'flex';
    btnBack.style.display = 'block';
    resumeBanner.style.display = 'none';
    saveState();
    nextCard();
    btnStart.disabled = false;
    btnStart.textContent = t('btnStart');
}

function resumeSession() {
    const saved = localStorage.getItem('proVocabTrainerState_v4');
    if (saved) {
        state = JSON.parse(saved);
        setupScreen.classList.remove('active');
        learnScreen.classList.add('active');
        progressContainer.style.display = 'block';
        gamificationBar.style.display = 'flex';
        btnBack.style.display = 'block';
        resumeBanner.style.display = 'none';
        nextCard();
    }
}

async function syncProgressToCloud(word, isCorrect) {
    if (!currentUser) return;

    const payload = {
        user_id: currentUser.id,
        vocab_id: word.id,
        streak: word.streak,
        errors: word.errors,
        box: word.box,
        updated_at: new Date().toISOString()
    };
    await supabaseClient.from('user_progress').upsert(payload);

    if (isCorrect) {
        const today = new Date().toISOString().split('T')[0];
        if (gamification.lastLearningDate !== today) {
            if (gamification.lastLearningDate) {
                const diff = Math.floor((new Date(today) - new Date(gamification.lastLearningDate)) / 86400000);
                gamification.streak = diff === 1 ? gamification.streak + 1 : 1;
            } else {
                gamification.streak = 1;
            }
            gamification.lastLearningDate = today;
        }
        gamification.xp += 10;
        if (gamification.xp >= gamification.level * 100) gamification.level++;

        await supabaseClient.from('user_stats').upsert({
            user_id: currentUser.id,
            xp: gamification.xp,
            level: gamification.level,
            streak: gamification.streak,
            last_learning_date: gamification.lastLearningDate
        });
    }
}

/* ==========================================================
   8. DER LERN-PROZESS
   ========================================================== */
function pickDirection() {
    const sel = document.getElementById('directionSelect').value;
    if (sel === 'mixed') return Math.random() < 0.5 ? 'target-to-native' : 'native-to-target';
    return sel;
}

function nextCard() {
    if (state.queue.length === 0) return finishSession();
    isLocked = false;
    flashcard.classList.remove('flipped');
    feedbackMsg.textContent = '';
    feedbackMsg.className = 'feedback';
    answerArea.innerHTML = '';
    questionTypeLabel.style.display = 'block';
    directionLabel.style.display = 'block';

    currentWord = state.queue.shift();
    currentDirection = pickDirection();

    if (currentDirection === 'target-to-native') {
        document.getElementById('frontWord').textContent = currentWord.latin;
        document.getElementById('backWord').textContent = currentWord.german;
    } else {
        document.getElementById('frontWord').textContent = currentWord.german;
        document.getElementById('backWord').textContent = currentWord.latin;
    }

    directionLabel.textContent = currentDirection === 'target-to-native' ? '→ DE' : '→ LAT';
    updateStats();

    if (Math.random() < 0.5) { currentQuestionType = 'mc'; renderMC(); }
    else { currentQuestionType = 'input'; renderInput(); }
}

function getCorrectAnswer() {
    return currentDirection === 'target-to-native' ? currentWord.german : currentWord.latin;
}

function renderMC() {
    questionTypeLabel.textContent = t('typeMC');
    const correct = getCorrectAnswer();
    let options = [correct];
    const field = currentDirection === 'target-to-native' ? 'german' : 'latin';
    let pool = state.sessionWords.filter(w => w[field] !== correct);

    while (options.length < 4 && pool.length > 0) {
        const rnd = pool[Math.floor(Math.random() * pool.length)];
        if (!options.includes(rnd[field])) options.push(rnd[field]);
    }
    shuffleArray(options);

    const grid = document.createElement('div');
    grid.className = 'mc-grid';
    options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'mc-btn';
        btn.innerHTML = `<span style="opacity:0.4; font-size:11px; margin-right:6px;">${i+1}</span> ${opt}`;
        btn.onclick = () => handleAnswer(opt === correct, btn);
        grid.appendChild(btn);
    });
    answerArea.appendChild(grid);
}

function renderInput() {
    questionTypeLabel.textContent = t('typeInput');
    const group = document.createElement('div');
    group.className = 'input-group';
    const input = document.createElement('input');
    input.type = 'text'; input.className = 'text-input';
    input.placeholder = t('placeholderInput');
    input.autocomplete = 'off';
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.textContent = t('btnCheck');
    input.addEventListener('keypress', e => { if (e.key === 'Enter') btn.click(); });

    btn.onclick = () => {
        if (isLocked) return;
        const user = input.value.trim().toLowerCase();
        const correct = getCorrectAnswer().toLowerCase();
        const alternatives = correct.split(',').map(s => s.trim());
        if (currentDirection === 'native-to-target') alternatives.push(correct.split(',')[0].trim());
        const ok = alternatives.includes(user) || user === correct;

        if (ok) {
            input.classList.add('correct'); btn.disabled = true;
            handleAnswer(true, null);
        } else {
            input.classList.add('wrong'); input.disabled = true; btn.disabled = true;
            btn.textContent = t('btnShowSolution');
            btn.classList.replace('btn-primary', 'btn-secondary');
            setTimeout(() => handleAnswer(false, null), 500);
        }
    };
    group.appendChild(input); group.appendChild(btn);
    answerArea.appendChild(group);
    setTimeout(() => input.focus(), 100);
}

function handleAnswer(isCorrect, btn) {
    if (isLocked) return;
    isLocked = true;
    flashcard.classList.add('flipped');
    document.querySelectorAll('.mc-btn').forEach(b => b.disabled = true);

    if (isCorrect) {
        state.stats.correct++;
        feedbackMsg.textContent = t('msgCorrect');
        feedbackMsg.className = 'feedback text-green';
        if (btn) btn.classList.add('correct');

        currentWord.streak = (currentWord.streak || 0) + 1;
        currentWord.errors = 0;
        if (currentWord.streak < 2) {
            state.queue.splice(Math.min(3, state.queue.length), 0, currentWord);
        } else {
            if (vocabErrors[currentWord.id]) { delete vocabErrors[currentWord.id]; localStorage.setItem('vocabErrors_v1', JSON.stringify(vocabErrors)); }
        }
    } else {
        state.stats.wrong++;
        feedbackMsg.textContent = t('msgWrong');
        feedbackMsg.className = 'feedback text-red';
        document.querySelectorAll('.mc-btn').forEach(b => {
            if (b.textContent.includes(getCorrectAnswer())) b.classList.add('correct');
        });

        currentWord.streak = 0;
        currentWord.errors = (currentWord.errors || 0) + 1;
        currentWord.box = 1;
        state.queue.splice(1, 0, currentWord);

        if (currentWord.id) {
            vocabErrors[currentWord.id] = { count: currentWord.errors, word: currentWord };
            localStorage.setItem('vocabErrors_v1', JSON.stringify(vocabErrors));
        }
    }

    if (isCorrect) {
        const today = new Date().toISOString().split('T')[0];
        if (gamification.lastLearningDate !== today) {
            if (gamification.lastLearningDate) {
                const diff = Math.floor((new Date(today) - new Date(gamification.lastLearningDate)) / 86400000);
                gamification.streak = diff === 1 ? gamification.streak + 1 : 1;
            } else { gamification.streak = 1; }
            gamification.lastLearningDate = today;
        }
        gamification.xp += 10;
        if (gamification.xp >= gamification.level * 100) gamification.level++;
        localStorage.setItem('vocabGamification_v1', JSON.stringify(gamification));
        renderGamification();
    }

    syncProgressToCloud(currentWord, isCorrect);
    saveState();
    updateStats();
    setTimeout(() => nextCard(), isCorrect ? 1200 : 2400);
}

/* ==========================================================
   9. HELPER-FUNKTIONEN
   ========================================================== */
function updateStats() {
    const uniqueRemaining = new Set(state.queue.map(w => w.id)).size;
    const total = new Set(state.sessionWords.map(w => w.id)).size;
    const mastered = total - uniqueRemaining;
    document.getElementById('statLeft').textContent = `${t('statQueue')}${uniqueRemaining}`;
    document.getElementById('statScore').textContent = `✅ ${state.stats.correct} | ❌ ${state.stats.wrong}`;
    document.getElementById('masteredDisplay').textContent = `${mastered}/${total}`;
    progressBar.style.width = `${total > 0 ? (mastered / total) * 100 : 0}%`;
}

function finishSession() {
    saveState(true);
    document.getElementById('appTitle').textContent = t('msgFinishTitle');
    flashcard.classList.remove('flipped');
    document.getElementById('frontWord').textContent = t('msgFinishSub');
    document.getElementById('backWord').textContent = t('msgFinishDesc');
    questionTypeLabel.style.display = 'none';
    directionLabel.style.display = 'none';
    answerArea.innerHTML = `<button class="btn btn-primary" onclick="location.reload()">${t('btnRestart')}</button>`;
    progressBar.style.width = '100%';
}

function saveState(complete = false) {
    if (complete) state.isActive = false;
    localStorage.setItem('proVocabTrainerState_v4', JSON.stringify(state));
}

function shuffleArray(a) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
}

function updateGamificationUI() {
    document.getElementById('streakDisplay').textContent = gamification.streak;
    document.getElementById('xpDisplay').textContent = gamification.xp;
    document.getElementById('levelDisplay').textContent = gamification.level;
}
function renderGamification() { updateGamificationUI(); }

function toggleTheme() {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon();
}
function updateThemeIcon() {
    document.getElementById('themeToggle').textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
}

function updateBooks() {
    const lang = langSelect.value;
    bookSelect.innerHTML = `<option value="">${t('optSelectBook')}</option>`;
    chaptersContainer.innerHTML = `<p style="color:var(--text-muted); font-size:13px;">${t('msgSelectBookFirst')}</p>`;
    if (lang && library[lang]) {
        bookSelect.disabled = false;
        Object.keys(library[lang]).forEach(book => {
            let option = document.createElement('option'); option.value = book; option.textContent = book;
            bookSelect.appendChild(option);
        });
    } else {
        bookSelect.disabled = true;
        bookSelect.innerHTML = `<option value="">${t('optSelectLangFirst')}</option>`;
    }
}

function updateChapters() {
    const lang = langSelect.value, book = bookSelect.value;
    chaptersContainer.innerHTML = '';
    if (lang && book && library[lang][book]) {
        Object.keys(library[lang][book]).forEach(chapter => {
            let label = document.createElement('label'); label.className = 'chapter-checkbox';
            let cb = document.createElement('input'); cb.type = 'checkbox'; cb.value = chapter;
            cb.onchange = (e) => label.classList.toggle('selected', e.target.checked);
            label.appendChild(cb); label.appendChild(document.createTextNode(chapter));
            chaptersContainer.appendChild(label);
        });
    }
}

/* ==========================================================
   10. AUTH MODAL UI LOGIK
   ========================================================== */
function openAuthModal() {
    document.getElementById('authModal').style.display = 'flex';
    if (supabaseClient) {
        supabaseClient.auth.getSession().then(({ data }) => {
            updateAuthUI(data.session);
            if (data.session) checkMfaStatus();
        });
    }
}
function closeAuthModal() { document.getElementById('authModal').style.display = 'none'; }

function switchAuthTab(tab) {
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const formLogin = document.getElementById('formLogin');
    const formRegister = document.getElementById('formRegister');
    if (tab === 'login') {
        tabLogin.classList.add('active'); tabRegister.classList.remove('active');
        formLogin.style.display = 'flex'; formRegister.style.display = 'none';
    } else {
        tabRegister.classList.add('active'); tabLogin.classList.remove('active');
        formRegister.style.display = 'flex'; formLogin.style.display = 'none';
    }
}

function updateAuthUI(session) {
    const loggedView = document.getElementById('authLoggedInView');
    const formsView = document.getElementById('authFormsView');
    const status = document.getElementById('authStatus');
    const syncBtn = document.getElementById('syncStatusBtn');
    if (session) {
        loggedView.style.display = 'block'; formsView.style.display = 'none';
        status.textContent = `Angemeldet als: ${session.user.email}`;
        syncBtn.classList.add('logged-in');
    } else {
        loggedView.style.display = 'none'; formsView.style.display = 'block';
        syncBtn.classList.remove('logged-in');
    }
}

async function handleLogin() {
    if (!supabaseClient) return showToast(t('msgNoSupabase'), 'error');
    const email = document.getElementById('loginEmail').value.trim();
    const pw = document.getElementById('loginPassword').value;
    if (!email || !pw) return showToast(t('msgFieldsEmpty'), 'error');
    if (!hcaptchaTokenLogin) return showToast(t('msgCaptchaError'), 'error');

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email, password: pw, options: { captchaToken: hcaptchaTokenLogin }
    });

    if (error) {
        showToast(t('msgLoginError') + ': ' + error.message, 'error');
        if (hcaptchaWidgetLogin !== null) { hcaptcha.reset(hcaptchaWidgetLogin); hcaptchaTokenLogin = null; }
    } else {
        // Prüfen, ob MFA erforderlich ist
        const { data: aal } = await supabaseClient.auth.mfa.getAuthenticatorAssuranceLevel();

        if (aal && aal.nextLevel === 'aal2' && aal.currentLevel === 'aal1') {
            document.getElementById('mfaLoginModal').style.display = 'flex';
            document.getElementById('authFormsView').style.display = 'none';
            showToast("Bitte 2FA-Code eingeben.", 'info');
        } else {
            showToast(t('msgLoginSuccess'), 'success');
            closeAuthModal();
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginPassword').value = '';
        }
        if (hcaptchaWidgetLogin !== null) { hcaptcha.reset(hcaptchaWidgetLogin); hcaptchaTokenLogin = null; }
    }
}

async function handleRegister() {
    if (!supabaseClient) return showToast(t('msgNoSupabase'), 'error');
    const email = document.getElementById('regEmail').value.trim();
    const pw = document.getElementById('regPassword').value;
    const pwConfirm = document.getElementById('regPasswordConfirm').value;
    if (!email || !pw || !pwConfirm) return showToast(t('msgFieldsEmpty'), 'error');
    if (pw !== pwConfirm) return showToast(t('msgPasswordsDontMatch'), 'error');
    if (!hcaptchaTokenRegister) return showToast(t('msgCaptchaError'), 'error');

    const { error } = await supabaseClient.auth.signUp({ email, password: pw, options: { captchaToken: hcaptchaTokenRegister } });
    if (error) {
        showToast(error.message, 'error');
        if (hcaptchaWidgetRegister !== null) { hcaptcha.reset(hcaptchaWidgetRegister); hcaptchaTokenRegister = null; }
    } else {
        showToast(t('msgRegisterSuccess'), 'success');
        switchAuthTab('login');
        document.getElementById('loginEmail').value = email;
        document.getElementById('regEmail').value = ''; document.getElementById('regPassword').value = ''; document.getElementById('regPasswordConfirm').value = '';
        if (hcaptchaWidgetRegister !== null) { hcaptcha.reset(hcaptchaWidgetRegister); hcaptchaTokenRegister = null; }
    }
}

async function handleLogout() {
    if (!supabaseClient) return;
    await supabaseClient.auth.signOut();
    updateAuthUI(null);
    closeAuthModal();
    showToast(t('msgLogoutSuccess'), 'info');
}

/* ==========================================================
   11. HCAPTCHA
   ========================================================== */
window.onloadHCaptcha = function() {
    if (HCAPTCHA_SITE_KEY === 'DEIN_HCAPTCHA_SITEKEY') return;
    const loginContainer = document.getElementById('hcaptcha-login');
    if (loginContainer) {
        hcaptchaWidgetLogin = hcaptcha.render('hcaptcha-login', {
            sitekey: HCAPTCHA_SITE_KEY,
            callback: (token) => { hcaptchaTokenLogin = token; },
            'expired-callback': () => { hcaptchaTokenLogin = null; }
        });
    }
    const regContainer = document.getElementById('hcaptcha-register');
    if (regContainer) {
        hcaptchaWidgetRegister = hcaptcha.render('hcaptcha-register', {
            sitekey: HCAPTCHA_SITE_KEY,
            callback: (token) => { hcaptchaTokenRegister = token; },
            'expired-callback': () => { hcaptchaTokenRegister = null; }
        });
    }
};

/* ==========================================================
   12. DIFFICULT WORDS, IMPORT/EXPORT & UI LANG
   ========================================================== */
function showDifficultWords() {
    const ids = Object.keys(vocabErrors);
    if (ids.length === 0) { return showToast(t('msgDifficultEmpty'), 'info'); }
    startLearning(true);
}

function exportProgress() {
    const data = {
        state: localStorage.getItem('proVocabTrainerState_v4'),
        gamification: localStorage.getItem('vocabGamification_v1'),
        errors: localStorage.getItem('vocabErrors_v1'),
        version: 1, timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `vokabeltrainer_${Date.now()}.json`;
    a.click(); URL.revokeObjectURL(url);
}

function importProgress() {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.json';
    input.onchange = e => {
        const reader = new FileReader();
        reader.onload = ev => {
            try {
                const d = JSON.parse(ev.target.result);
                if (d.state) localStorage.setItem('proVocabTrainerState_v4', d.state);
                if (d.gamification) localStorage.setItem('vocabGamification_v1', d.gamification);
                if (d.errors) localStorage.setItem('vocabErrors_v1', d.errors);
                showToast(t('msgImportSuccess'), 'success');
                setTimeout(() => location.reload(), 1500);
            } catch (err) {
                showToast(t('msgImportError'), 'error');
            }
        };
        reader.readAsText(e.target.files[0]);
    };
    input.click();
}

function changeUILanguage(lang) {
    currentUILang = lang;
    localStorage.setItem('uiLang', lang);
    applyTranslations();
    updateBooks();
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.getAttribute('data-i18n'));
    });
    if (langSelect) {
        langSelect.innerHTML = `<option value="">${t('optSelectLang')}</option>`;
        Object.keys(library).forEach(lp => {
            let option = document.createElement('option');
            option.value = lp; option.textContent = lp.replace('-', ' ➔ ');
            langSelect.appendChild(option);
        });
    }
    if (state.isActive) updateStats();
}

/* ==========================================================
   13. TASTATUR-STEUERUNG
   ========================================================== */
document.addEventListener('keydown', e => {
    if (currentQuestionType === 'mc' && !isLocked) {
        const btns = document.querySelectorAll('.mc-btn');
        if (btns.length === 4) {
            if (e.key === '1') btns[0].click();
            if (e.key === '2') btns[1].click();
            if (e.key === '3') btns[2].click();
            if (e.key === '4') btns[3].click();
        }
    }
});

/* ==========================================================
   START
   ========================================================== */
init();