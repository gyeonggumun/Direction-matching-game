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

export function loadRecords() {
    try {
        const data = localStorage.getItem('dirMatchAutoRecords');
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

// 매개변수에 difficultyName 추가
export function saveRecord(score, timeTaken, isSuccess, difficultyName) {
    try {
        const records = loadRecords();
        
        records.unshift({ 
            score: score, 
            timeTaken: timeTaken, 
            isSuccess: isSuccess,
            difficultyName: difficultyName, // 난이도 저장
            date: new Date().toLocaleTimeString()
        });
        
        const top20 = records.slice(0, 20);
        localStorage.setItem('dirMatchAutoRecords', JSON.stringify(top20));
        
        return top20;
    } catch (e) {
        return [];
    }
}

export function clearRecords() {
    try {
        localStorage.removeItem('dirMatchAutoRecords');
        return [];
    } catch (e) {
        return [];
    }
}