import { MOCK_CONSULTATIONS } from './consultations.mock';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

// 백엔드 연동 전까지 더미데이터 사용. 연동 완료 후 false로 바꾸고 이 파일의 USE_MOCK 분기 + consultations.mock.js 제거
const USE_MOCK = true;

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

function toSummary(c) {
    const { id, recipientName, recipientAge, caregiverName, consultedAt, status, riskScore, aiTags, aiSummaryPreview } = c;
    return { id, recipientName, recipientAge, caregiverName, consultedAt, status, riskScore, aiTags, aiSummaryPreview };
}

// 상담일지 목록 조회
export function getConsultations() {
    if (USE_MOCK) {
        return Promise.resolve(MOCK_CONSULTATIONS.map(toSummary));
    }
    return request('/consultations');
}

// 상담일지 상세 조회
export function getConsultation(id) {
    if (USE_MOCK) {
        const found = MOCK_CONSULTATIONS.find(c => c.id === id);
        return found ? Promise.resolve(found) : Promise.reject(new Error('상담일지를 찾을 수 없습니다.'));
    }
    return request(`/consultations/${id}`);
}

// 상담일지 수동 생성
export function createConsultation({ recipientName, recipientAge, caregiverId, consultedAt, audioUrl }) {
    if (USE_MOCK) {
        const consultation = {
            id: String(Date.now()),
            recipientName,
            recipientAge,
            caregiverName: '',
            consultedAt,
            audioUrl: audioUrl ?? null,
            status: 'NORMAL',
            riskScore: null,
            aiTags: [],
            sttText: null,
            aiSummary: null,
            aiSummaryPreview: null,
            workerFinalNote: null,
            socialWorkerOpinion: null,
        };
        MOCK_CONSULTATIONS.push(consultation);
        return Promise.resolve(toSummary(consultation));
    }
    return request('/consultations', {
        method: 'POST',
        body: JSON.stringify({ recipientName, recipientAge, caregiverId, consultedAt, audioUrl }),
    });
}

// 녹음 파일 업로드
export function uploadAudio(id, file) {
    if (USE_MOCK) {
        const consultation = MOCK_CONSULTATIONS.find(c => c.id === id);
        if (!consultation) return Promise.reject(new Error('상담일지를 찾을 수 없습니다.'));
        consultation.audioUrl = `mock://${file?.name ?? 'audio'}`;
        return Promise.resolve(consultation);
    }
    const formData = new FormData();
    formData.append('file', file);
    return fetch(`${API_BASE_URL}/consultations/${id}/audio`, { method: 'POST', body: formData })
        .then((res) => {
            if (!res.ok) throw new Error(`녹음 업로드 실패 (${res.status})`);
            return res.json();
        });
}

// 방문 상담 녹음 → STT/LLM 일괄 처리
export function processConsultation({ caregiverId, recipientId, consultedAt, file }) {
    if (USE_MOCK) {
        return Promise.reject(new Error('목업 모드에서는 지원하지 않는 기능입니다.'));
    }
    const formData = new FormData();
    formData.append('caregiverId', caregiverId);
    formData.append('recipientId', recipientId);
    formData.append('consultedAt', consultedAt);
    formData.append('file', file);
    return fetch(`${API_BASE_URL}/consultations/process`, { method: 'POST', body: formData })
        .then((res) => {
            if (!res.ok) throw new Error(`상담 처리 요청 실패 (${res.status})`);
            return res.json();
        });
}

// 생활지원사 최종 메모 / 사회복지사 소견 저장용 함수.
export function updateConsultation(id, patch) {
    if (USE_MOCK) {
        const consultation = MOCK_CONSULTATIONS.find(c => c.id === id);
        if (!consultation) return Promise.reject(new Error('상담일지를 찾을 수 없습니다.'));
        Object.assign(consultation, patch);
        return Promise.resolve(consultation);
    }
    return request(`/consultations/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
    });
}