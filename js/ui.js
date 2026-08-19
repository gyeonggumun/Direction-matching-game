export const screens = {
    start: document.getElementById('screen-start'),
    playing: document.getElementById('screen-playing'),
    gameover: document.getElementById('screen-gameover'),
    ranking: document.getElementById('screen-ranking')
};

export const els = {
    gameContainer: document.getElementById('game-container'),
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
    
    btnStartEasy: document.getElementById('btn-start-easy'),
    btnStartNormal: document.getElementById('btn-start-normal'),
    btnStartHard: document.getElementById('btn-start-hard'),
    
    btnRestart: document.getElementById('btn-restart'),
    btnBackToDiff: document.getElementById('btn-back-to-diff'),
    btnViewRecords: document.getElementById('btn-view-records'),
    rankingList: document.getElementById('ranking-list'),
    btnBackToStart: document.getElementById('btn-back-to-start'),
    btnClearRecords: document.getElementById('btn-clear-records'),
    
    // 💡 추가됨: 일시정지 시간 텍스트 요소
    pauseTime: document.getElementById('ui-pause-time')
};

export function triggerAnimation(animClass) {
    els.promptArrow.classList.remove(animClass);
    void els.promptArrow.offsetWidth; 
    els.promptArrow.classList.add(animClass);
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
        const diffTag = `<span style="font-size: 0.8em; background:#e2e8f0; padding:2px 6px; border-radius:4px; margin-right:8px;">${rec.difficultyName || '-'}</span>`;
        
        li.innerHTML = `
            <span style="color: #64748b; font-size: 0.9em; width: 30px;">${index + 1}</span>
            <span style="flex: 1;">${diffTag}<b>${rec.score}점</b> (${rec.timeTaken}초)</span>
            <span style="font-weight: bold;">${statusText}</span>
        `;
        els.rankingList.appendChild(li);
    });
}

export function triggerImpact(type) {
    if (document.body.classList.contains('reduced-motion')) return;

    const flashClass = type === 'success' ? 'flash-success' : 'flash-danger';
    els.gameContainer.classList.add(flashClass);
    setTimeout(() => els.gameContainer.classList.remove(flashClass), 300);

    const floatEl = document.createElement('div');
    floatEl.className = 'floating-text';
    
    const randomOffset = Math.random() * 20 - 10; 
    floatEl.style.left = `calc(50% + ${randomOffset}px)`;
    floatEl.style.top = '35%';

    if (type === 'success') {
        floatEl.innerText = 'PERFECT!';
        floatEl.style.color = 'var(--success-color)';
    } else {
        floatEl.innerText = 'MISS!';
        floatEl.style.color = 'var(--danger-color)';
    }

    els.gameContainer.appendChild(floatEl);

    setTimeout(() => { floatEl.remove(); }, 600);
}