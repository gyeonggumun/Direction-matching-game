// js/main.js
import { DIFFICULTY_TIME_LIMIT, GOAL_SCORE, MAX_MISTAKES, ARROWS, ARROW_KEYS } from './config.js';
import { loadBestScore, saveBestScore } from './storage.js';
import { playSound } from './audio.js';
import { els, triggerAnimation, updateHUD, switchScreen } from './ui.js';

let state = {
    status: 'IDLE',
    score: 0,
    mistakes: 0,
    timeLeft: DIFFICULTY_TIME_LIMIT,
    currentKey: '',
    lastFrameTime: 0
};

let animationFrameId;

function init() {
    els.bestScore.innerText = loadBestScore();
    
    els.btnStart.addEventListener('click', startGame);
    els.btnRestart.addEventListener('click', startGame);
    els.pauseOverlay.addEventListener('click', resumeGame);

    els.motionToggle.addEventListener('change', (e) => {
        document.body.classList.toggle('reduced-motion', e.target.checked);
    });

    window.addEventListener('keydown', handleInput);
    window.addEventListener('blur', () => {
        if (state.status === 'PLAYING') pauseGame();
    });
}

function startGame() {
    state.status = 'PLAYING';
    state.score = 0;
    state.mistakes = 0;
    state.timeLeft = DIFFICULTY_TIME_LIMIT;
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

    const percentage = Math.max(0, (state.timeLeft / DIFFICULTY_TIME_LIMIT) * 100);
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
    
    els.promptArrow.classList.remove('pulse', 'shake');
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

    els.resultTitle.innerText = isSuccess ? '🎯 성공!' : '💀 실패!';
    els.resultTitle.className = isSuccess ? 'text-success' : 'text-danger';
    
    const timeTaken = (DIFFICULTY_TIME_LIMIT - state.timeLeft).toFixed(1);
    els.resultDesc.innerHTML = `${message}<br><br>
        최종 점수: <b>${state.score}</b>점<br>
        걸린 시간: <b>${timeTaken}</b>초`;

    switchScreen('gameover');
}

window.addEventListener('DOMContentLoaded', init);