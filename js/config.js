export const GOAL_SCORE = 20;
export const MAX_MISTAKES = 3;

// CSS Color 적용을 위해 이모지 대신 텍스트 특수기호 사용
export const ARROWS = {
    'ArrowUp': '▲',
    'ArrowDown': '▼',
    'ArrowLeft': '◀',
    'ArrowRight': '▶'
};

export const ARROW_KEYS = Object.keys(ARROWS);

// 💡 난이도별 설정값 통합 객체
export const DIFFICULTY_SETTINGS = {
    easy: { id: 'easy', name: '쉬움', timeLimit: 30.0, useColor: true },
    normal: { id: 'normal', name: '보통', timeLimit: 20.0, useColor: true },
    hard: { id: 'hard', name: '어려움', timeLimit: 10.0, useColor: false }
};