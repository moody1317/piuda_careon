// 백엔드 연동 전까지 사용하는 더미데이터.
// 연동 완료 후 이 파일과 users.js의 USE_MOCK 분기를 함께 제거하면 됩니다.
export const MOCK_USERS = [
    {
        id: '1',
        institutionId: '1',
        name: '김관리자',
        email: 'kim@cj.welfare.kr',
        passwordHash: '$2b$10$mockhash.admin.0000000000000',
        role: 'ADMIN',
        phone: '010-1111-1111',
        agreedTerms: true,
        isActive: true,
        lastLoginAt: '2026-05-26T09:12:00.000Z',
        createdAt: '2024-01-15T00:00:00.000Z',
        updatedAt: '2024-01-15T00:00:00.000Z',
    },
    {
        id: '2',
        institutionId: '1',
        name: '이담당',
        email: 'lee@cj.welfare.kr',
        passwordHash: '$2b$10$mockhash.care.0000000000001',
        role: 'CARE_WORKER',
        phone: '010-2222-2222',
        agreedTerms: true,
        isActive: true,
        lastLoginAt: '2026-05-26T08:40:00.000Z',
        createdAt: '2024-01-20T00:00:00.000Z',
        updatedAt: '2024-01-20T00:00:00.000Z',
    },
    {
        id: '3',
        institutionId: '1',
        name: '박복지',
        email: 'park@cj.welfare.kr',
        passwordHash: '$2b$10$mockhash.care.0000000000002',
        role: 'CARE_WORKER',
        phone: '010-3333-3333',
        agreedTerms: true,
        isActive: true,
        lastLoginAt: '2026-05-26T07:55:00.000Z',
        createdAt: '2024-02-01T00:00:00.000Z',
        updatedAt: '2024-02-01T00:00:00.000Z',
    },
    {
        id: '4',
        institutionId: '1',
        name: '김민지',
        email: 'mj@cj.welfare.kr',
        passwordHash: '$2b$10$mockhash.care.0000000000000',
        role: 'CARE_WORKER',
        phone: '010-4444-4444',
        agreedTerms: true,
        isActive: true,
        lastLoginAt: '2026-05-26T06:30:00.000Z',
        createdAt: '2024-02-05T00:00:00.000Z',
        updatedAt: '2024-02-05T00:00:00.000Z',
    },
];

// 로그인/세션 연동 전까지 caregiver-mobile 앱에서 "로그인된 사용자"로 취급할 계정.
// 실제 로그인 연동 후 getCurrentUser()를 세션 기반 조회로 교체하면서 제거하세요.
export const MOCK_CURRENT_USER_ID = '2';
