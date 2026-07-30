import { MOCK_CLIENTS } from './clients.mock';
import { STATUS_LABELS } from './status';
import { getToken } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

// 백엔드 연동 전까지 더미데이터 사용. 연동 완료 후 false로 바꾸고 이 파일의 USE_MOCK 분기 + clients.mock.js 제거
const USE_MOCK = true;

// 대상자 상태(정상/검토필요/특이사항)
export const STATUS_META = {
    NORMAL: { key: 'normal', label: STATUS_LABELS.NORMAL },
    NEED_REVIEW: { key: 'caution', label: STATUS_LABELS.NEED_REVIEW },
    SPECIAL_NOTE: { key: 'urgent', label: STATUS_LABELS.SPECIAL_NOTE },
};

export const CARE_LEVEL_LABELS = {
    LEVEL1: '1등급',
    LEVEL2: '2등급',
    LEVEL3: '3등급',
    LEVEL4: '4등급',
    LEVEL5: '5등급',
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
        throw new Error(`대상자 API 요청 실패 (${res.status}): ${path}`);
    }

    if (res.status === 204) return null;
    return res.json();
}

// 대상자 단건 조회
export function getClient(id) {
    if (USE_MOCK) {
        const found = MOCK_CLIENTS.find(c => c.id === id);
        return found ? Promise.resolve(found) : Promise.reject(new Error('대상자를 찾을 수 없습니다.'));
    }
    return request(`/care-recipients/${id}`);
}

// 담당 생활지원사 기준 대상자 목록 조회
export function getRecipientsByCaregiver(caregiverId) {
    if (USE_MOCK) {
        return Promise.resolve(MOCK_CLIENTS.filter(c => c.caregiverId === caregiverId));
    }
    return request(`/care-recipients/caregiver/${caregiverId}`);
}

// 대상자 등록
export function createClient({ name, age, gender, address, careLevel, mainDisease, phone, familyContactName, familyRelation, familyContactPhone, caregiverId }) {
    if (USE_MOCK) {
        const caregiver = MOCK_CLIENTS.find(c => c.caregiverId === caregiverId);
        const client = {
            id: String(Date.now()),
            caregiverId,
            name,
            age,
            gender,
            address,
            careLevel,
            mainDisease,
            phone,
            familyContactName,
            familyRelation,
            familyContactPhone,
            caregiverName: caregiver?.caregiverName ?? '',
        };
        MOCK_CLIENTS.push(client);
        return Promise.resolve(client);
    }
    return request('/care-recipients', {
        method: 'POST',
        body: JSON.stringify({ name, age, gender, address, careLevel, mainDisease, phone, familyContactName, familyRelation, familyContactPhone, caregiverId }),
    });
}

// 대상자 삭제
export function deleteClient(id) {
    if (USE_MOCK) {
        const index = MOCK_CLIENTS.findIndex(c => c.id === id);
        if (index !== -1) MOCK_CLIENTS.splice(index, 1);
        return Promise.resolve(null);
    }
    return request(`/care-recipients/${id}`, { method: 'DELETE' });
}