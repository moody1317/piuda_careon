// 백엔드 연동 전까지 사용하는 더미데이터.
// 연동 완료 후 이 파일과 consultationTags.js의 USE_MOCK 분기를 함께 제거하면 됩니다.
//
// AI가 STT/LLM 처리 중 자동으로 추출하는 태그이므로 프론트에서 생성하지 않고 조회만 합니다.
//
// 상단 상태 배지(정상/검토필요/특이사항)는 consultations.status가 담당하므로
// 이 테이블에는 그 값을 중복 저장하지 않고, 세부 위험 요인 태그만 둡니다.
// 위험 요인이 없는(정상) 상담일지는 태그가 아예 없을 수 있습니다.
export const MOCK_CONSULTATION_TAGS = [
    { id: '1', consultation_id: '1', tag: '식사감소' },
    { id: '2', consultation_id: '1', tag: '우울감' },
    { id: '3', consultation_id: '2', tag: '반복발화' },
    { id: '4', consultation_id: '3', tag: '낙상위험' },
    { id: '5', consultation_id: '3', tag: '병원동행필요' },
    { id: '6', consultation_id: '4', tag: '약복용' },
    { id: '7', consultation_id: '5', tag: '우울감' },
    { id: '8', consultation_id: '8', tag: '식사감소' },
    { id: '9', consultation_id: '10', tag: '수면문제' },
];
