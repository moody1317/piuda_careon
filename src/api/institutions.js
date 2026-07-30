import { MOCK_INSTITUTIONS } from './institutions.mock';
import { getToken } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

// 백엔드 연동 전까지 더미데이터 사용. 연동 완료 후 false로 바꾸고 이 파일의 USE_MOCK 분기 + institutions.mock.js 제거
const USE_MOCK = true;

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
        throw new Error(`기관 API 요청 실패 (${res.status}): ${path}`);
    }

    if (res.status === 204) return null;
    return res.json();
}

// 기관 목록 조회
export function getInstitutions() {
    if (USE_MOCK) return Promise.resolve(MOCK_INSTITUTIONS);
    return request('/institutions');
}

// 기관 단건 조회 (id)
export function getInstitution(id) {
    if (USE_MOCK) {
        const found = MOCK_INSTITUTIONS.find(inst => inst.id === id);
        return found ? Promise.resolve(found) : Promise.reject(new Error('기관을 찾을 수 없습니다.'));
    }
    return request(`/institutions/${id}`);
}

// 기관 코드로 조회 (회원가입 시 기관 코드 인증 등에 사용)
export function getInstitutionByCode(code) {
    if (USE_MOCK) {
        const found = MOCK_INSTITUTIONS.find(inst => inst.code === code);
        return found ? Promise.resolve(found) : Promise.reject(new Error('등록되지 않은 기관 코드입니다.'));
    }
    return request(`/institutions/code/${encodeURIComponent(code)}`);
}

// 기관 등록
export function createInstitution({ name, code, address, phone }) {
    if (USE_MOCK) {
        const institution = {
            id: String(Date.now()),
            name,
            code,
            address,
            phone,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        MOCK_INSTITUTIONS.push(institution);
        return Promise.resolve(institution);
    }
    return request('/institutions', {
        method: 'POST',
        body: JSON.stringify({ name, code, address, phone }),
    });
}

// 기관 정보 수정
export function updateInstitution(id, { name, code, address, phone }) {
    if (USE_MOCK) {
        const institution = MOCK_INSTITUTIONS.find(inst => inst.id === id);
        if (!institution) return Promise.reject(new Error('기관을 찾을 수 없습니다.'));
        Object.assign(institution, { name, code, address, phone, updated_at: new Date().toISOString() });
        return Promise.resolve(institution);
    }
    return request(`/institutions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name, code, address, phone }),
    });
}

// 기관 삭제
export function deleteInstitution(id) {
    if (USE_MOCK) {
        const index = MOCK_INSTITUTIONS.findIndex(inst => inst.id === id);
        if (index !== -1) MOCK_INSTITUTIONS.splice(index, 1);
        return Promise.resolve(null);
    }
    return request(`/institutions/${id}`, { method: 'DELETE' });
}