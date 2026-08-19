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

// 자동 기록 저장용 로직
export function loadRecords() {
    try {
        const data = localStorage.getItem('dirMatchAutoRecords');
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

export function saveRecord(score, timeTaken, isSuccess) {
    try {
        const records = loadRecords();
        
        // 새 기록을 맨 앞에 추가 (최신순)
        records.unshift({ 
            score: score, 
            timeTaken: timeTaken, 
            isSuccess: isSuccess,
            date: new Date().toLocaleTimeString() // 시간 기록
        });
        
        // 최대 20개까지만 자르기
        const top20 = records.slice(0, 20);
        localStorage.setItem('dirMatchAutoRecords', JSON.stringify(top20));
        
        return top20;
    } catch (e) {
        return [];
    }
}