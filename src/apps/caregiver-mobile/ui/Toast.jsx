import './Toast.css';

function Toast({ message, visible }) {
    if (!visible) return null;

    return (
        <div className="cg-toast">
            <i className="bi bi-check-circle-fill" />
            <span>{message}</span>
        </div>
    );
}

export default Toast;
