import { MOCK_SETTINGS } from './settings.mock';
import { getToken } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

// 백엔드 연동 전까지 더미데이터 사용. 연동 완료 후 false로 바꾸고 이 파일의 USE_MOCK 분기 + settings.mock.js 제거
const USE_MOCK = true;

export const STT_PROVIDER_LABELS = {
    GOOGLE: 'Google Speech-to-Text v2',
};

export const LLM_PROVIDER_LABELS = {
    GEMINI: 'Google Gemini API',
};

export const AUDIO_RETENTION_LABELS = {
    DELETE_AFTER_STT: 'STT 완료 후 자동 삭제',
    RETAIN: '보관',
};

async function request(path, options = {}) {
    const token = getToken();
    const res = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
        ...options,
    });

    if (!res.ok) {
        throw new Error(`설정 API 요청 실패 (${res.status}): ${path}`);
    }

    if (res.status === 204) return null;
    return res.json();
}

// 기관별 설정 조회 (기관당 1건)
export function getSettings(institutionId) {
    if (USE_MOCK) {
        const found = MOCK_SETTINGS.find(s => s.institution_id === institutionId);
        return found ? Promise.resolve(found) : Promise.reject(new Error('설정을 찾을 수 없습니다.'));
    }
    return request(`/settings?institution_id=${encodeURIComponent(institutionId)}`);
}

// 기관별 설정 수정
export function updateSettings(id, patch) {
    if (USE_MOCK) {
        const settings = MOCK_SETTINGS.find(s => s.id === id);
        if (!settings) return Promise.reject(new Error('설정을 찾을 수 없습니다.'));
        Object.assign(settings, patch, { updated_at: new Date().toISOString() });
        return Promise.resolve(settings);
    }
    return request(`/settings/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
    });
}