// 백엔드 연동 전까지 사용하는 더미데이터.
// 연동 완료 후 이 파일과 riskHistories.js의 USE_MOCK 분기를 함께 제거하면 됩니다.
//
// 상담일지 처리 결과를 기반으로 서버가 자동 생성하는 이력이므로 프론트에서 생성하지 않고
// 조회만 합니다. recipient_id/consultation_id는 대상자 레코드가 없는 경우(예: 아직
// 정식 등록되지 않은 대상자) null일 수 있습니다.
export const MOCK_RISK_HISTORIES = [
    // 박영희 - 4주에 걸쳐 정상 → 검토필요 → 특이사항으로 악화된 이력
    { id: '1', institution_id: '1', recipient_id: '1', consultation_id: null, previous_status: null, new_status: 'NORMAL', score: 18, reason: '건강 양호. 이웃과 어울림 확인.', created_at: '2026-04-21T09:00:00.000Z' },
    { id: '2', institution_id: '1', recipient_id: '1', consultation_id: null, previous_status: 'NORMAL', new_status: 'NORMAL', score: 22, reason: '건강 양호. 특이사항 없음.', created_at: '2026-04-28T09:00:00.000Z' },
    { id: '3', institution_id: '1', recipient_id: '1', consultation_id: null, previous_status: 'NORMAL', new_status: 'NEED_REVIEW', score: 54, reason: '전반적 양호. 식욕 약간 감소 언급.', created_at: '2026-05-05T09:00:00.000Z' },
    { id: '4', institution_id: '1', recipient_id: '1', consultation_id: null, previous_status: 'NEED_REVIEW', new_status: 'NEED_REVIEW', score: 62, reason: '수면 불편 언급. 혈압 120/80 정상. 반복발화 시작.', created_at: '2026-05-12T09:00:00.000Z' },
    { id: '5', institution_id: '1', recipient_id: '1', consultation_id: null, previous_status: 'NEED_REVIEW', new_status: 'SPECIAL_NOTE', score: 78, reason: '식사 거부 3회. 전주 대비 우울감 표현 증가.', created_at: '2026-05-19T09:00:00.000Z' },
    { id: '6', institution_id: '1', recipient_id: '1', consultation_id: '1', previous_status: 'SPECIAL_NOTE', new_status: 'SPECIAL_NOTE', score: 92, reason: "식사 거부 4회. 우울감 표현 반복. '외롭다' 발화 증가.", created_at: '2026-05-26T11:07:00.000Z' },

    { id: '7', institution_id: '1', recipient_id: '2', consultation_id: '2', previous_status: 'NEED_REVIEW', new_status: 'SPECIAL_NOTE', score: 88, reason: '반복 발화·기억 혼동 표현 증가.', created_at: '2026-05-26T09:32:00.000Z' },
    { id: '8', institution_id: '1', recipient_id: '3', consultation_id: '3', previous_status: 'NEED_REVIEW', new_status: 'SPECIAL_NOTE', score: 84, reason: '낙상 위험·수면장애 지속.', created_at: '2026-05-25T14:20:00.000Z' },
    { id: '9', institution_id: '1', recipient_id: '4', consultation_id: '4', previous_status: 'NORMAL', new_status: 'NEED_REVIEW', score: 62, reason: '약 복용 불규칙 2회 연속.', created_at: '2026-05-25T11:47:00.000Z' },
    { id: '10', institution_id: '1', recipient_id: '5', consultation_id: '5', previous_status: 'NORMAL', new_status: 'NEED_REVIEW', score: 58, reason: '우울감 표현 증가 추이.', created_at: '2026-05-24T14:27:00.000Z' },
    { id: '11', institution_id: '1', recipient_id: '6', consultation_id: '8', previous_status: 'NORMAL', new_status: 'NEED_REVIEW', score: 54, reason: '식욕 감소·체중 변화.', created_at: '2026-05-23T09:17:00.000Z' },

    // 한복순 - 아직 별도 대상자 레코드가 없어 recipient_id가 없음
    { id: '12', institution_id: '1', recipient_id: null, consultation_id: '10', previous_status: 'NORMAL', new_status: 'NEED_REVIEW', score: 50, reason: '수면 불규칙 패턴.', created_at: '2026-05-22T13:18:00.000Z' },

    // 오철수 - 대상자/상담일지 레코드 없이 위험 이력만 존재하는 사례
    { id: '13', institution_id: '1', recipient_id: null, consultation_id: null, previous_status: 'NORMAL', new_status: 'NEED_REVIEW', score: 45, reason: '반복 발화 시작 단계.', created_at: '2026-05-22T09:00:00.000Z' },
];
