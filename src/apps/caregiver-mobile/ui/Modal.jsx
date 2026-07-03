import './Modal.css';

function Modal({ title, onClose, children }) {
    return (
        <div className="cg-modal-overlay" onClick={onClose}>
            <div className="cg-modal" onClick={(e) => e.stopPropagation()}>
                <div className="cg-modal-header">
                    <p className="cg-modal-title">{title}</p>
                    <button type="button" className="cg-modal-close" onClick={onClose}>
                        <i className="bi bi-x-lg" />
                    </button>
                </div>
                <div className="cg-modal-body">{children}</div>
            </div>
        </div>
    );
}

export default Modal;
