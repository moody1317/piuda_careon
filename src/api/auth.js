import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
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

// "로그인 상태 유지" 체크 시엔 기기 재시작 후에도 남아야 하니 Android Keystore/iOS Keychain 기반
// 암호화 저장소(SecureStoragePlugin)에 저장한다. 체크 해제 시엔 디스크에 아예 안 남기고
// 메모리에만 들고 있어서 새로고침/앱 재시작하면 사라진다 (기존 sessionStorage 역할을 대체).
let inMemoryToken = null;

export async function getToken() {
    if (inMemoryToken) return inMemoryToken;
    try {
        const { value } = await SecureStoragePlugin.get({ key: TOKEN_KEY });
        return value;
    } catch {
        return null;
    }
}

async function setToken(token, persist = true) {
    if (!token) return;
    if (persist) {
        inMemoryToken = null;
        await SecureStoragePlugin.set({ key: TOKEN_KEY, value: token });
    } else {
        inMemoryToken = token;
        try {
            await SecureStoragePlugin.remove({ key: TOKEN_KEY });
        } catch {
            // 저장된 게 없으면 무시
        }
    }
}

export async function logout() {
    inMemoryToken = null;
    try {
        await SecureStoragePlugin.remove({ key: TOKEN_KEY });
    } catch {
        // 이미 없으면 무시
    }
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
export async function login({ institutionCode, email, password }, persist = true) {
    if (USE_MOCK) {
        const institution = findInstitutionByCode(institutionCode);
        const user = institution
            ? MOCK_USERS.find((u) => u.institutionId === institution.id && u.email === email)
            : null;
        if (!institution || !user || password !== MOCK_LOGIN_PASSWORD) {
            throw new Error('기관 코드, 이메일 또는 비밀번호가 올바르지 않습니다.');
        }
        const accessToken = `mock-token:${user.id}`;
        await setToken(accessToken, persist);
        return {
            accessToken,
            userId: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            institutionId: institution.id,
            institutionCode: institution.code,
            institutionName: institution.name,
        };
    }
    const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ institutionCode, email, password }),
    });
    await setToken(res.accessToken, persist);
    return res;
}

// 내 정보 조회
export async function me() {
    const token = await getToken();
    if (!token) throw new Error('로그인이 필요합니다.');

    if (USE_MOCK) {
        const userId = token.replace('mock-token:', '');
        const user = MOCK_USERS.find((u) => u.id === userId);
        if (!user) throw new Error('로그인이 필요합니다.');
        const institution = MOCK_INSTITUTIONS.find((inst) => inst.id === user.institutionId);
        return {
            userId: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            institutionId: institution?.id,
            institutionCode: institution?.code,
            institutionName: institution?.name,
        };
    }
    return request('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
    });
}