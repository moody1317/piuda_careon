import { MOCK_CONSULTATION_TAGS } from './consultationTags.mock';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

// 백엔드 연동 전까지 더미데이터 사용. 연동 완료 후 false로 바꾸고
// 이 파일의 USE_MOCK 분기 + consultationTags.mock.js를 제거하면 됩니다.
const USE_MOCK = true;

async function request(path, options = {}) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    });

    if (!res.ok) {
        throw new Error(`상담일지 태그 API 요청 실패 (${res.status}): ${path}`);
    }

    if (res.status === 204) return null;
    return res.json();
}

// 상담일지 AI 태그 조회 (consultationId로 필터링 가능)
export function getConsultationTags({ consultationId } = {}) {
    if (USE_MOCK) {
        const list = consultationId
            ? MOCK_CONSULTATION_TAGS.filter(t => t.consultation_id === consultationId)
            : MOCK_CONSULTATION_TAGS;
        return Promise.resolve(list);
    }
    const query = consultationId ? `?consultation_id=${encodeURIComponent(consultationId)}` : '';
    return request(`/consultation-tags${query}`);
}
