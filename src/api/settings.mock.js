// 백엔드 연동 전까지 사용하는 더미데이터.
// 연동 완료 후 이 파일과 settings.js의 USE_MOCK 분기를 함께 제거하면 됩니다.
export const MOCK_SETTINGS = [
    {
        id: '1',
        institution_id: '1',
        notification_enabled: true,
        stt_provider: 'GOOGLE',
        llm_provider: 'GEMINI',
        audio_retention_policy: 'DELETE_AFTER_STT',
        audio_input_format: 'M4A',
        audio_convert_policy: 'FFMPEG_TO_WAV_16K',
        created_at: '2024-01-15T00:00:00.000Z',
        updated_at: '2024-01-15T00:00:00.000Z',
    },
];
