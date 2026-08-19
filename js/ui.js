export const screens = {
    start: document.getElementById('screen-start'),
    playing: document.getElementById('screen-playing'),
    gameover: document.getElementById('screen-gameover'),
    ranking: document.getElementById('screen-ranking')
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
    btnRestart: document.getElementById('btn-restart'),
    inputName: document.getElementById('input-name'),
    btnSubmitScore: document.getElementById('btn-submit-score'),
    rankingList: document.getElementById('ranking-list'),
    btnBackToStart: document.getElementById('btn-back-to-start'),
    rankingForm: document.getElementById('ranking-form')
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

export function renderLeaderboard(rankings) {
    els.rankingList.innerHTML = '';
    
    if (rankings.length === 0) {
        els.rankingList.innerHTML = '<li class="ranking-item">등록된 랭킹이 없습니다.</li>';
        return;
    }

    rankings.forEach((rank, index) => {
        const li = document.createElement('li');
        li.className = 'ranking-item';
        if (index < 3) li.classList.add('top-rank');
        
        li.innerHTML = `
            <span>${index + 1}위 - ${rank.name}</span>
            <span>${rank.score}점</span>
        `;
        els.rankingList.appendChild(li);
    });
}