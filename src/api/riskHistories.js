import { MOCK_RISK_HISTORIES } from './riskHistories.mock';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

// 백엔드 연동 전까지 더미데이터 사용. 연동 완료 후 false로 바꾸고
// 이 파일의 USE_MOCK 분기 + riskHistories.mock.js를 제거하면 됩니다.
const USE_MOCK = true;

// 상담일지 처리 결과를 기반으로 서버가 자동 생성하는 이력이라
// 프론트에서 직접 생성(create)하지 않고 조회만 제공합니다.

async function request(path, options = {}) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    });

    if (!res.ok) {
        throw new Error(`위험 이력 API 요청 실패 (${res.status}): ${path}`);
    }

    if (res.status === 204) return null;
    return res.json();
}

// 위험 상태 변화 이력 조회 (institutionId, recipientId, consultationId로 필터링 가능)
// 최신순(created_at 내림차순)으로 정렬해 반환합니다.
export function getRiskHistories({ institutionId, recipientId, consultationId } = {}) {
    if (USE_MOCK) {
        let list = MOCK_RISK_HISTORIES;
        if (institutionId) list = list.filter(h => h.institution_id === institutionId);
        if (recipientId) list = list.filter(h => h.recipient_id === recipientId);
        if (consultationId) list = list.filter(h => h.consultation_id === consultationId);
        list = [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return Promise.resolve(list);
    }
    const params = new URLSearchParams();
    if (institutionId) params.set('institution_id', institutionId);
    if (recipientId) params.set('recipient_id', recipientId);
    if (consultationId) params.set('consultation_id', consultationId);
    const query = params.toString() ? `?${params}` : '';
    return request(`/risk-histories${query}`);
}
