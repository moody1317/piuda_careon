import { MOCK_DASHBOARD_SUMMARY } from './dashboard.mock';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

// 백엔드 연동 전까지 더미데이터 사용. 연동 완료 후 false로 바꾸고 이 파일의 USE_MOCK 분기 + dashboard.mock.js를 제거
const USE_MOCK = true;

async function request(path, options = {}) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    });

    if (!res.ok) {
        throw new Error(`대시보드 API 요청 실패 (${res.status}): ${path}`);
    }

    return res.json();
}

// 대시보드 요약 통계 조회
export function getDashboardSummary() {
    if (USE_MOCK) {
        return Promise.resolve(MOCK_DASHBOARD_SUMMARY);
    }
    return request('/dashboard');
}