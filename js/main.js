import { GOAL_SCORE, MAX_MISTAKES, ARROWS, ARROW_KEYS, DIFFICULTY_SETTINGS } from './config.js';
import { loadBestScore, saveBestScore, loadRecords, saveRecord, clearRecords } from './storage.js';
import { playSound } from './audio.js';
import { els, triggerAnimation, updateHUD, switchScreen, renderRecords, triggerImpact } from './ui.js';

let state = {
    status: 'IDLE',
    score: 0,
    mistakes: 0,
    timeLeft: 30.0, // 기본값
    currentKey: '',
    lastFrameTime: 0,
    currentDifficulty: null // 현재 플레이 중인 난이도 객체 저장
};

let animationFrameId;

function init() {
    els.bestScore.innerText = loadBestScore();
    
    // 난이도별 시작 버튼 이벤트
    els.btnStartEasy.addEventListener('click', () => startGame('easy'));
    els.btnStartNormal.addEventListener('click', () => startGame('normal'));
    els.btnStartHard.addEventListener('click', () => startGame('hard'));
    
    // 다시 시작 시 마지막에 선택했던 난이도로 재시작
    els.btnRestart.addEventListener('click', () => startGame(state.currentDifficulty.id));
    
    els.pauseOverlay.addEventListener('click', resumeGame);
    
    els.btnViewRecords.addEventListener('click', () => {
        const records = loadRecords();
        renderRecords(records);
        switchScreen('ranking');
    });

    els.btnBackToStart.addEventListener('click', () => {
        els.bestScore.innerText = loadBestScore();
        switchScreen('start');
    });

    els.btnClearRecords.addEventListener('click', () => {
        if (confirm("정말로 모든 기록을 삭제하시겠습니까?")) {
            const emptyRecords = clearRecords();
            renderRecords(emptyRecords);
        }
    });

    els.motionToggle.addEventListener('change', (e) => {
        document.body.classList.toggle('reduced-motion', e.target.checked);
    });

    window.addEventListener('keydown', handleInput);
    window.addEventListener('blur', () => {
        if (state.status === 'PLAYING') pauseGame();
    });
}

function startGame(levelId) {
    state.currentDifficulty = DIFFICULTY_SETTINGS[levelId];
    
    state.status = 'PLAYING';
    state.score = 0;
    state.mistakes = 0;
    state.timeLeft = state.currentDifficulty.timeLimit; // 난이도별 시간 할당
    state.lastFrameTime = performance.now();

    updateHUD(state.score, state.mistakes);
    setNextArrow();
    switchScreen('playing');
    
    cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(gameLoop);
}

function gameLoop(currentTime) {
    if (state.status !== 'PLAYING') return;

    const deltaTime = (currentTime - state.lastFrameTime) / 1000;
    state.lastFrameTime = currentTime;
    state.timeLeft -= deltaTime;

    const percentage = Math.max(0, (state.timeLeft / state.currentDifficulty.timeLimit) * 100);
    els.timerBar.style.width = `${percentage}%`;
    
    if (percentage < 30) els.timerBar.style.background = 'var(--danger-color)';
    else els.timerBar.style.background = 'var(--primary-color)';

    if (state.timeLeft <= 0) {
        endGame(false, "시간이 다 되었습니다.");
        return;
    }

    animationFrameId = requestAnimationFrame(gameLoop);
}

function setNextArrow() {
    const randomIndex = Math.floor(Math.random() * ARROW_KEYS.length);
    state.currentKey = ARROW_KEYS[randomIndex];
    els.promptArrow.innerText = ARROWS[state.currentKey];
    
    // ✨ 난이도 규칙에 따른 색상 적용
    els.promptArrow.className = ''; // 기존 애니메이션 및 색상 클래스 리셋
    
    if (state.currentDifficulty.useColor) {
        if (state.currentKey === 'ArrowUp') els.promptArrow.classList.add('color-up');
        if (state.currentKey === 'ArrowDown') els.promptArrow.classList.add('color-down');
        if (state.currentKey === 'ArrowLeft') els.promptArrow.classList.add('color-left');
        if (state.currentKey === 'ArrowRight') els.promptArrow.classList.add('color-right');
    } else {
        els.promptArrow.classList.add('color-none'); // 어려움 모드는 검정색 고정
    }
    
    void els.promptArrow.offsetWidth; 
}

function handleInput(e) {
    if (state.status !== 'PLAYING') return;
    if (!ARROW_KEYS.includes(e.key)) return;

    e.preventDefault();

    if (e.key === state.currentKey) {
        handleSuccess();
    } else {
        handleMistake();
    }
}

function handleSuccess() {
    playSound('success', els.muteToggle.checked);
    triggerAnimation('pulse');  
    triggerImpact('success');   

    state.score++;
    updateHUD(state.score, state.mistakes);

    if (state.score >= GOAL_SCORE) {
        endGame(true, "목표 점수에 도달했습니다! 축하합니다.");
    } else {
        setNextArrow();
    }
}

function handleMistake() {
    playSound('error', els.muteToggle.checked);
    triggerAnimation('shake'); 
    triggerImpact('error');    

    state.mistakes++;
    updateHUD(state.score, state.mistakes);

    if (state.mistakes >= MAX_MISTAKES) {
        endGame(false, `3번 실수하여 실패했습니다.`);
    } else {
        setNextArrow(); 
    }
}

function pauseGame() {
    state.status = 'PAUSED';
    els.pauseOverlay.style.display = 'flex';
}

function resumeGame() {
    state.status = 'PLAYING';
    els.pauseOverlay.style.display = 'none';
    state.lastFrameTime = performance.now();
    animationFrameId = requestAnimationFrame(gameLoop);
}

function endGame(isSuccess, message) {
    state.status = 'OVER';
    
    saveBestScore(state.score, (newBest) => {
        els.bestScore.innerText = newBest;
    }); 

    const timeTaken = (state.currentDifficulty.timeLimit - state.timeLeft).toFixed(1);
    
    // 💡 저장할 때 난이도 이름(쉬움, 보통, 어려움)도 함께 넘김
    saveRecord(state.score, timeTaken, isSuccess, state.currentDifficulty.name);

    els.resultTitle.innerText = isSuccess ? '🎯 성공!' : '💀 실패!';
    els.resultTitle.className = isSuccess ? 'text-success' : 'text-danger';
    
    els.resultDesc.innerHTML = `${message}<br><br>
        진행 난이도: <b>${state.currentDifficulty.name}</b><br>
        최종 점수: <b>${state.score}</b>점<br>
        걸린 시간: <b>${timeTaken}</b>초`;

    switchScreen('gameover');
}

window.addEventListener('DOMContentLoaded', init);