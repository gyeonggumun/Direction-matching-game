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

export function loadRankings() {
    try {
        const data = localStorage.getItem('dirMatchRankings');
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

export function saveRanking(name, score) {
    try {
        const rankings = loadRankings();
        rankings.push({ name: name, score: score, date: new Date().getTime() });
        
        rankings.sort((a, b) => b.score - a.score || b.date - a.date);
        
        const top10 = rankings.slice(0, 10);
        localStorage.setItem('dirMatchRankings', JSON.stringify(top10));
        
        return top10;
    } catch (e) {
        return [];
    }
}