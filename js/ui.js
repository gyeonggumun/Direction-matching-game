// js/ui.js
export const screens = {
    start: document.getElementById('screen-start'),
    playing: document.getElementById('screen-playing'),
    gameover: document.getElementById('screen-gameover')
};

export const els = {
    promptArrow: document.getElementById('prompt-arrow'),
    score: document.getElementById('ui-score'),
    mistakes: document.getElementById('ui-mistakes'),
    bestScore: document.getElementById('ui-best-score'),
    timerBar: document.getElementById('timer-bar'),
    resultTitle: document.getElementById('result-title'),
    resultDesc: document.getElementById('result-desc'),
    pauseOverlay: document.getElementById('pause-overlay'),
    muteToggle: document.getElementById('mute-toggle'),
    motionToggle: document.getElementById('motion-toggle'),
    btnStart: document.getElementById('btn-start'),
    btnRestart: document.getElementById('btn-restart')
};

export function triggerAnimation(animClass) {
    els.promptArrow.classList.add(animClass);
    setTimeout(() => {
        els.promptArrow.classList.remove(animClass);
    }, 300);
}

export function updateHUD(score, mistakes) {
    els.score.innerText = score;
    els.mistakes.innerText = mistakes;
}

export function switchScreen(screenName) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenName].classList.add('active');
}