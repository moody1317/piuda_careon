import StatusBar from '../ui/StatusBar';
import PageHeader from '../ui/PageHeader';
import BottomMenu from '../ui/BottomMenu';
import './PrivacyNotice.css';

const POLICIES = [
    {
        id: 1,
        icon: 'bi-mic-fill',
        title: '원본 음성 즉시 폐기',
        desc: '음성 녹음 완료 후 STT 변환이 끝나면 원본 음성 파일은 즉시 삭제됩니다.',
    },
    {
        id: 2,
        icon: 'bi-lock-fill',
        title: '민감 키워드 자동 마스킹',
        desc: '대상자 이름, 주소, 전화번호 등 민감 정보는 자동으로 마스킹 처리됩니다.',
    },
    {
        id: 3,
        icon: 'bi-shield-lock-fill',
        title: '상담 텍스트 암호화 저장',
        desc: '저장되는 모든 상담 데이터는 AES-256 암호화가 적용됩니다.',
    },
    {
        id: 4,
        icon: 'bi-person-check-fill',
        title: '접근 권한 관리',
        desc: '본인의 담당 대상자 데이터에만 접근 가능하며 모든 접근 이력이 기록됩니다.',
    },
    {
        id: 5,
        icon: 'bi-calendar3',
        title: '상담 데이터 보존 기간',
        desc: '상담 데이터는 법적 기준에 따라 3년간 보존 후 자동 삭제됩니다.',
    },
];

function PrivacyNotice() {
    return (
        <div className="cg-privacy">
            <StatusBar />

            <PageHeader title="개인정보 보호 안내" />

            <div className="cg-privacy-body">
                <div className="cg-privacy-notice">
                    <p className="cg-privacy-notice-title">기관에서 설정한 개인정보 보호 정책입니다.</p>
                    <p className="cg-privacy-notice-text">
                        아래 항목은 자동으로 적용 중이며<br />
                        사용자가 변경할 수 없습니다.
                    </p>
                </div>

                <div className="cg-privacy-list">
                    {POLICIES.map((policy) => (
                        <div key={policy.id} className="cg-privacy-item">
                            <span className="cg-privacy-item-icon">
                                <i className={`bi ${policy.icon}`} />
                            </span>
                            <div className="cg-privacy-item-body">
                                <p className="cg-privacy-item-title">{policy.title}</p>
                                <p className="cg-privacy-item-desc">{policy.desc}</p>
                            </div>
                            <span className="cg-privacy-item-badge">
                                <i className="bi bi-check-circle-fill" /> 적용 중
                            </span>
                        </div>
                    ))}
                </div>

                <div className="cg-privacy-link">
                    <span>개인정보처리방침 전문 보기</span>
                    <i className="bi bi-chevron-right" />
                </div>
            </div>

            <BottomMenu />
        </div>
    );
}

export default PrivacyNotice;
