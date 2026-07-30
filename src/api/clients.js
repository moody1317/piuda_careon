import { MOCK_USERS, MOCK_CURRENT_USER_ID } from './users.mock';
import { getToken } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

// 백엔드 연동 전까지 더미데이터 사용. 연동 완료 후 false로 바꾸고 이 파일의 USE_MOCK 분기 + users.mock.js 제거
const USE_MOCK = true;

export const ROLE_LABELS = {
    ADMIN: '기관 관리자',
    SOCIAL_WORKER: '사회복지사',
    CARE_WORKER: '생활지원사',
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
        throw new Error(`사용자 API 요청 실패 (${res.status}): ${path}`);
    }

    if (res.status === 204) return null;
    return res.json();
}

// passwordHash는 서버 전용 필드이므로 응답에서 제외
function sanitize(user) {
    if (!user) return user;
    const safe = { ...user };
    delete safe.passwordHash;
    return safe;
}

// 사용자 목록 조회 (institutionId로 소속 기관 필터링 가능)
export function getUsers({ institutionId } = {}) {
    if (USE_MOCK) {
        const list = institutionId
            ? MOCK_USERS.filter(u => u.institutionId === institutionId)
            : MOCK_USERS;
        return Promise.resolve(list.map(sanitize));
    }
    const query = institutionId ? `?institutionId=${encodeURIComponent(institutionId)}` : '';
    return request(`/users${query}`);
}

// 사용자 단건 조회 (id)
export function getUser(id) {
    if (USE_MOCK) {
        const found = MOCK_USERS.find(u => u.id === id);
        return found ? Promise.resolve(sanitize(found)) : Promise.reject(new Error('사용자를 찾을 수 없습니다.'));
    }
    return request(`/users/${id}`);
}

// 현재 로그인한 사용자 조회
export function getCurrentUser() {
    return getUser(MOCK_CURRENT_USER_ID);
}

// 사용자(계정) 등록
export function createUser({ institutionId, name, email, phone, role, password }) {
    if (USE_MOCK) {
        const user = {
            id: String(Date.now()),
            institutionId,
            name,
            email,
            passwordHash: `mock:${password}`,
            role,
            phone,
            agreedTerms: false,
            isActive: true,
            lastLoginAt: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        MOCK_USERS.push(user);
        return Promise.resolve(sanitize(user));
    }
    return request('/users', {
        method: 'POST',
        body: JSON.stringify({ institutionId, name, email, phone, role, password }),
    });
}

// 사용자 정보 수정
export function updateUser(id, { name, email, phone, role, isActive }) {
    if (USE_MOCK) {
        const user = MOCK_USERS.find(u => u.id === id);
        if (!user) return Promise.reject(new Error('사용자를 찾을 수 없습니다.'));
        Object.assign(user, { name, email, phone, role, isActive, updatedAt: new Date().toISOString() });
        return Promise.resolve(sanitize(user));
    }
    return request(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name, email, phone, role, isActive }),
    });
}

// 비밀번호 변경
export function changePassword(id, { currentPassword, newPassword }) {
    if (USE_MOCK) {
        const user = MOCK_USERS.find(u => u.id === id);
        if (!user) return Promise.reject(new Error('사용자를 찾을 수 없습니다.'));
        if (user.passwordHash !== `mock:${currentPassword}`) {
            return Promise.reject(new Error('현재 비밀번호가 일치하지 않습니다.'));
        }
        user.passwordHash = `mock:${newPassword}`;
        user.updatedAt = new Date().toISOString();
        return Promise.resolve(null);
    }
    return request(`/users/${id}/password`, {
        method: 'PATCH',
        body: JSON.stringify({ currentPassword, newPassword }),
    });
}

// 사용자 삭제
export function deleteUser(id) {
    if (USE_MOCK) {
        const index = MOCK_USERS.findIndex(u => u.id === id);
        if (index !== -1) MOCK_USERS.splice(index, 1);
        return Promise.resolve(null);
    }
    return request(`/users/${id}`, { method: 'DELETE' });
}