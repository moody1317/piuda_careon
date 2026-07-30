import { MOCK_USERS } from './users.mock';
import { MOCK_INSTITUTIONS } from './institutions.mock';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';
const TOKEN_KEY = 'careon_access_token';

// 백엔드 연동 전까지 더미데이터 사용. 연동 완료 후 false로 바꾸고 이 파일의 USE_MOCK 분기 제거
const USE_MOCK = true;

const MOCK_LOGIN_PASSWORD = '1234';

async function request(path, options = {}) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    });

    if (!res.ok) {
        throw new Error(`인증 API 요청 실패 (${res.status}): ${path}`);
    }

    if (res.status === 204) return null;
    return res.json();
}

function findInstitutionByCode(institutionCode) {
    return MOCK_INSTITUTIONS.find(
        (inst) => inst.code.toUpperCase() === institutionCode?.trim().toUpperCase()
    );
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
}

function setToken(token, persist = true) {
    if (!token) return;
    if (persist) {
        localStorage.setItem(TOKEN_KEY, token);
        sessionStorage.removeItem(TOKEN_KEY);
    } else {
        sessionStorage.setItem(TOKEN_KEY, token);
        localStorage.removeItem(TOKEN_KEY);
    }
}

export function logout() {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
}

// 기관 코드 확인
export function checkInstitution(institutionCode) {
    if (USE_MOCK) {
        const institution = findInstitutionByCode(institutionCode);
        if (!institution) return Promise.reject(new Error('등록되지 않은 기관 코드입니다.'));
        return Promise.resolve({
            institutionId: institution.id,
            institutionCode: institution.code,
            institutionName: institution.name,
        });
    }
    return request('/auth/check-institution', {
        method: 'POST',
        body: JSON.stringify({ institutionCode }),
    });
}

// 회원가입
export function signup({ institutionCode, name, phone, email, password, role, agreedTerms }) {
    if (USE_MOCK) {
        const institution = findInstitutionByCode(institutionCode);
        if (!institution) return Promise.reject(new Error('등록되지 않은 기관 코드입니다.'));
        MOCK_USERS.push({
            id: String(Date.now()),
            institutionId: institution.id,
            name,
            email,
            passwordHash: `mock:${password}`,
            role,
            phone,
            agreedTerms: agreedTerms ?? false,
            isActive: true,
            lastLoginAt: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
        return Promise.resolve('회원가입이 완료되었습니다.');
    }
    return fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ institutionCode, name, phone, email, password, role, agreedTerms }),
    }).then((res) => {
        if (!res.ok) throw new Error(`회원가입 실패 (${res.status})`);
        return res.text();
    });
}

// 로그인
export function login({ institutionCode, email, password }, persist = true) {
    if (USE_MOCK) {
        const institution = findInstitutionByCode(institutionCode);
        const user = institution
            ? MOCK_USERS.find((u) => u.institutionId === institution.id && u.email === email)
            : null;
        if (!institution || !user || password !== MOCK_LOGIN_PASSWORD) {
            return Promise.reject(new Error('기관 코드, 이메일 또는 비밀번호가 올바르지 않습니다.'));
        }
        const accessToken = `mock-token:${user.id}`;
        setToken(accessToken, persist);
        return Promise.resolve({
            accessToken,
            userId: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            institutionId: institution.id,
            institutionCode: institution.code,
            institutionName: institution.name,
        });
    }
    return request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ institutionCode, email, password }),
    }).then((res) => {
        setToken(res.accessToken, persist);
        return res;
    });
}

// 내 정보 조회
export function me() {
    const token = getToken();
    if (!token) return Promise.reject(new Error('로그인이 필요합니다.'));

    if (USE_MOCK) {
        const userId = token.replace('mock-token:', '');
        const user = MOCK_USERS.find((u) => u.id === userId);
        if (!user) return Promise.reject(new Error('로그인이 필요합니다.'));
        const institution = MOCK_INSTITUTIONS.find((inst) => inst.id === user.institutionId);
        return Promise.resolve({
            userId: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            institutionId: institution?.id,
            institutionCode: institution?.code,
            institutionName: institution?.name,
        });
    }
    return request('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
    });
}