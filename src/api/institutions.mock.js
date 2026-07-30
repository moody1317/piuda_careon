// 백엔드 연동 전까지 사용하는 더미데이터.
// 연동 완료 후 이 파일과 institutions.js의 USE_MOCK 분기를 함께 제거하면 됩니다.
export const MOCK_INSTITUTIONS = [
    {
        id: '1',
        name: '청주 복지관',
        code: 'CJ-2024-0011',
        address: '충청북도 청주시 흥덕구 복지로 123',
        phone: '043-000-0000',
        created_at: '2024-01-15T00:00:00.000Z',
        updated_at: '2024-01-15T00:00:00.000Z',
    },
    {
        id: '2',
        name: '세종 복지원',
        code: 'SJ-2024-0022',
        address: '세종특별자치시 도움3로 22',
        phone: '044-000-0000',
        created_at: '2024-02-10T00:00:00.000Z',
        updated_at: '2024-02-10T00:00:00.000Z',
    },
    {
        id: '3',
        name: '광주 노인복지관',
        code: 'GJ-2024-0033',
        address: '광주광역시 서구 상무누리로 33',
        phone: '062-000-0000',
        created_at: '2024-03-05T00:00:00.000Z',
        updated_at: '2024-03-05T00:00:00.000Z',
    },
];
