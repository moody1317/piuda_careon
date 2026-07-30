import { MOCK_CONSULTATIONS } from './consultations.mock';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

// 백엔드 연동 전까지 더미데이터 사용. 연동 완료 후 false로 바꾸고
// 이 파일의 USE_MOCK 분기 + consultations.mock.js를 제거하면 됩니다.
const USE_MOCK = true;

// 상담일지는 앱의 녹음 업로드 → 서버 STT/LLM 처리 후 생성되는 레코드라
// 프론트에서 직접 생성(create)하지 않습니다. 여기서는 조회와,
// 생활지원사/사회복지사가 검토 후 남기는 필드(worker_final_note, social_worker_opinion,
// status) 수정만 제공합니다.

async function request(path, options = {}) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    });

    if (!res.ok) {
        throw new Error(`상담일지 API 요청 실패 (${res.status}): ${path}`);
    }

    if (res.status === 204) return null;
    return res.json();
}

// 상담일지 목록 조회 (institutionId, caregiverId, recipientId, status로 필터링 가능)
export function getConsultations({ institutionId, caregiverId, recipientId, status } = {}) {
    if (USE_MOCK) {
        let list = MOCK_CONSULTATIONS;
        if (institutionId) list = list.filter(c => c.institution_id === institutionId);
        if (caregiverId) list = list.filter(c => c.caregiver_id === caregiverId);
        if (recipientId) list = list.filter(c => c.recipient_id === recipientId);
        if (status) list = list.filter(c => c.status === status);
        return Promise.resolve(list);
    }
    const params = new URLSearchParams();
    if (institutionId) params.set('institution_id', institutionId);
    if (caregiverId) params.set('caregiver_id', caregiverId);
    if (recipientId) params.set('recipient_id', recipientId);
    if (status) params.set('status', status);
    const query = params.toString() ? `?${params}` : '';
    return request(`/consultations${query}`);
}

// 상담일지 단건 조회 (id)
export function getConsultation(id) {
    if (USE_MOCK) {
        const found = MOCK_CONSULTATIONS.find(c => c.id === id);
        return found ? Promise.resolve(found) : Promise.reject(new Error('상담일지를 찾을 수 없습니다.'));
    }
    return request(`/consultations/${id}`);
}

// 생활지원사 최종 검토/사회복지사 소견 등 후속 수정
export function updateConsultation(id, patch) {
    if (USE_MOCK) {
        const consultation = MOCK_CONSULTATIONS.find(c => c.id === id);
        if (!consultation) return Promise.reject(new Error('상담일지를 찾을 수 없습니다.'));
        Object.assign(consultation, patch, { updated_at: new Date().toISOString() });
        return Promise.resolve(consultation);
    }
    return request(`/consultations/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
    });
}
