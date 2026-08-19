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
    btnViewRecords: document.getElementById('btn-view-records'),
    rankingList: document.getElementById('ranking-list'),
    btnBackToStart: document.getElementById('btn-back-to-start')
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

export function renderRecords(records) {
    els.rankingList.innerHTML = '';
    
    if (records.length === 0) {
        els.rankingList.innerHTML = '<li class="ranking-item">아직 플레이 기록이 없습니다.</li>';
        return;
    }

    records.forEach((rec, index) => {
        const li = document.createElement('li');
        li.className = 'ranking-item';
        
        const statusText = rec.isSuccess ? '🟢 성공' : '🔴 실패';
        
        li.innerHTML = `
            <span style="color: #64748b; font-size: 0.9em; width: 30px;">${index + 1}</span>
            <span style="flex: 1;"><b>${rec.score}점</b> (${rec.timeTaken}초)</span>
            <span style="font-weight: bold;">${statusText}</span>
        `;
        els.rankingList.appendChild(li);
    });
}