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

// 2. 파일 맨 아래에 새로운 임팩트 함수 추가
export function triggerImpact(type) {
    // 움직임 줄이기가 켜져 있으면 DOM 생성 자체를 스킵하여 최적화
    if (document.body.classList.contains('reduced-motion')) return;

    // 배경 번쩍임 효과
    const flashClass = type === 'success' ? 'flash-success' : 'flash-danger';
    els.gameContainer.classList.add(flashClass);
    setTimeout(() => els.gameContainer.classList.remove(flashClass), 300);

    // 떠오르는 텍스트 생성
    const floatEl = document.createElement('div');
    floatEl.className = 'floating-text';
    
    // 약간의 무작위성을 주어 텍스트가 겹치지 않고 역동적으로 보이게 처리
    const randomOffset = Math.random() * 20 - 10; 
    floatEl.style.left = `calc(50% + ${randomOffset}px)`;
    floatEl.style.top = '35%'; // 화살표 살짝 위쪽

    if (type === 'success') {
        floatEl.innerText = 'PERFECT!';
        floatEl.style.color = 'var(--success-color)';
    } else {
        floatEl.innerText = 'MISS!';
        floatEl.style.color = 'var(--danger-color)';
    }

    els.gameContainer.appendChild(floatEl);

    // CSS 애니메이션 시간(0.6초)이 끝나면 DOM 트리에서 제거하여 메모리 관리
    setTimeout(() => {
        floatEl.remove();
    }, 600);
}