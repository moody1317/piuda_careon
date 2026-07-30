import { MOCK_CLIENTS } from './clients.mock';
import { STATUS_LABELS } from './status';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

// 백엔드 연동 전까지 더미데이터 사용. 연동 완료 후 false로 바꾸고
// 이 파일의 USE_MOCK 분기 + clients.mock.js를 제거하면 됩니다.
const USE_MOCK = true;

// current_status 값과 UI 표시(css 키/라벨) 매핑
// key는 심각도 단계별 CSS 클래스(cg-client-item-badge.normal 등)와 연결되는 내부 표시용 값입니다.
export const STATUS_META = {
    NORMAL: { key: 'normal', label: STATUS_LABELS.NORMAL },
    NEED_REVIEW: { key: 'caution', label: STATUS_LABELS.NEED_REVIEW },
    SPECIAL_NOTE: { key: 'urgent', label: STATUS_LABELS.SPECIAL_NOTE },
};

async function request(path, options = {}) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    });

    if (!res.ok) {
        throw new Error(`대상자 API 요청 실패 (${res.status}): ${path}`);
    }

    if (res.status === 204) return null;
    return res.json();
}

// 대상자 목록 조회 (institutionId, caregiverId로 필터링 가능)
export function getClients({ institutionId, caregiverId } = {}) {
    if (USE_MOCK) {
        let list = MOCK_CLIENTS;
        if (institutionId) list = list.filter(c => c.institution_id === institutionId);
        if (caregiverId) list = list.filter(c => c.assigned_caregiver_id === caregiverId);
        return Promise.resolve(list);
    }
    const params = new URLSearchParams();
    if (institutionId) params.set('institution_id', institutionId);
    if (caregiverId) params.set('assigned_caregiver_id', caregiverId);
    const query = params.toString() ? `?${params}` : '';
    return request(`/clients${query}`);
}

// 대상자 단건 조회 (id)
export function getClient(id) {
    if (USE_MOCK) {
        const found = MOCK_CLIENTS.find(c => c.id === id);
        return found ? Promise.resolve(found) : Promise.reject(new Error('대상자를 찾을 수 없습니다.'));
    }
    return request(`/clients/${id}`);
}

// 대상자 등록
export function createClient({ institution_id, name, age, gender, address, phone, assigned_caregiver_id, guardian_name, guardian_phone, guardian_relation }) {
    if (USE_MOCK) {
        const client = {
            id: String(Date.now()),
            institution_id,
            name,
            age,
            gender,
            address,
            phone,
            assigned_caregiver_id,
            current_status: 'NORMAL',
            last_consulted_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            guardian_name,
            guardian_phone,
            guardian_relation,
        };
        MOCK_CLIENTS.push(client);
        return Promise.resolve(client);
    }
    return request('/clients', {
        method: 'POST',
        body: JSON.stringify({ institution_id, name, age, gender, address, phone, assigned_caregiver_id, guardian_name, guardian_phone, guardian_relation }),
    });
}

// 대상자 정보 수정
export function updateClient(id, patch) {
    if (USE_MOCK) {
        const client = MOCK_CLIENTS.find(c => c.id === id);
        if (!client) return Promise.reject(new Error('대상자를 찾을 수 없습니다.'));
        Object.assign(client, patch, { updated_at: new Date().toISOString() });
        return Promise.resolve(client);
    }
    return request(`/clients/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
    });
}

// 대상자 삭제
export function deleteClient(id) {
    if (USE_MOCK) {
        const index = MOCK_CLIENTS.findIndex(c => c.id === id);
        if (index !== -1) MOCK_CLIENTS.splice(index, 1);
        return Promise.resolve(null);
    }
    return request(`/clients/${id}`, { method: 'DELETE' });
}
