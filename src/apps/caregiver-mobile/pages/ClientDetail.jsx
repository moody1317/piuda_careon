import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StatusBar from '../ui/StatusBar';
import PageHeader from '../ui/PageHeader';
import BottomMenu from '../ui/BottomMenu';
import { getClient } from '../../../api/clients';
import './ClientDetail.css';

const DEFAULT_CLIENT = {
    initials: '박영',
    name: '박영희',
    age: 77,
    gender: '여',
    tenure: '3년째',
    tags: ['식사 거부 (2회)', '수면 문제', '약 복용 확인'],
};

const FALLBACK_BASIC_INFO = [
    { label: '주소', value: '청주시 흥덕구 사직동 45' },
    { label: '주요 질환', value: '고혈압, 당뇨' },
    { label: '연락처', value: '010-XXXX-XXXX' },
    { label: '보호자명', value: '박○○' },
    { label: '보호자 연락처', value: '010-XXXX-XXXX' },
    { label: '보호자 관계', value: '자녀' },
];

const HISTORY = [
    { date: '05.19', text: '식사 잘 안 드신다고 하심. 기분이 처진 편.' },
    { date: '05.12', text: '혈압 정상 확인. 수면 불편하다고 언급하셨음.' },
];

function ClientDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const client = location.state?.log ?? DEFAULT_CLIENT;
    const tags = client.tags ?? DEFAULT_CLIENT.tags;
    const fromHome = (location.state?.source ?? 'home') === 'home';
    const [fullClient, setFullClient] = useState(null);

    useEffect(() => {
        if (!client.clientId) return;
        getClient(client.clientId).then(setFullClient).catch(() => {});
    }, [client.clientId]);

    const basicInfo = fullClient
        ? [
            { label: '주소', value: fullClient.address ?? '-' },
            { label: '주요 질환', value: fullClient.mainDisease ?? '-' },
            { label: '연락처', value: fullClient.phone ?? '-' },
            { label: '보호자명', value: fullClient.familyContactName ?? '-' },
            { label: '보호자 연락처', value: fullClient.familyContactPhone ?? '-' },
            { label: '보호자 관계', value: fullClient.familyRelation ?? '-' },
        ]
        : FALLBACK_BASIC_INFO;

    return (
        <div className="cg-cd">
            <StatusBar />

            <PageHeader title="대상자 프로필" />

            <div className="cg-cd-body">
                <div className="cg-cd-card">
                    <span className="cg-cd-avatar">{client.initials}</span>
                    <div className="cg-cd-info">
                        <p className="cg-cd-name">
                            {client.name} ({client.age}세 · {client.gender ?? DEFAULT_CLIENT.gender})
                        </p>
                        <p className="cg-cd-meta">
                            담당 {client.tenure ?? DEFAULT_CLIENT.tenure}
                        </p>
                    </div>
                </div>

                <div className="cg-cd-section">
                    <p className="cg-cd-section-title">기본 정보</p>
                    <div className="cg-cd-basic">
                        {basicInfo.map((info) => (
                            <div key={info.label} className="cg-cd-basic-row">
                                <span className="cg-cd-basic-label">{info.label}</span>
                                <span className="cg-cd-basic-value">{info.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="cg-cd-section">
                    <p className="cg-cd-section-title">최근 특이사항 태그</p>
                    <div className="cg-cd-tags">
                        {tags.map((tag) => (
                            <span key={tag} className="cg-cd-tag">{tag}</span>
                        ))}
                    </div>
                </div>

                <div className="cg-cd-section">
                    <p className="cg-cd-section-title">최근 상담 이력</p>
                    <div className="cg-cd-history">
                        {HISTORY.map((item) => (
                            <div key={item.date} className="cg-cd-history-row">
                                <span className="cg-cd-history-date">{item.date}</span>
                                <p className="cg-cd-history-text">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {fromHome && (
                    <button
                        className="cg-cd-start-button"
                        type="button"
                        onClick={() => navigate('/visit-recording', { state: { client } })}
                    >
                        방문 상담 시작
                    </button>
                )}
                <button className="cg-cd-back-button" type="button" onClick={() => navigate(-1)}>
                    돌아가기
                </button>
            </div>

            <BottomMenu />
        </div>
    );
}

export default ClientDetail;