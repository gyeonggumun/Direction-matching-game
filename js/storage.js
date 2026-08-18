// js/storage.js
export function loadBestScore() {
    try {
        const saved = localStorage.getItem('dirMatchBestScore');
        const parsed = parseInt(saved, 10);
        return isNaN(parsed) ? 0 : parsed;
    } catch (e) {
        return 0;
    }
}

export function saveBestScore(score, updateUI) {
    try {
        const currentBest = loadBestScore();
        if (score > currentBest) {
            localStorage.setItem('dirMatchBestScore', score);
            if (updateUI) updateUI(score);
        }
    } catch (e) {}
}