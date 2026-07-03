import './StatusBar.css';

function StatusBar() {
    return (
        <div className="cg-status-bar">
            <span className="cg-status-bar-time">9:41</span>
            <div className="cg-status-bar-icons">
                <i className="bi bi-wifi" />
                <i className="bi bi-battery-full" />
            </div>
        </div>
    );
}

export default StatusBar;
