import './Toggle.css';

function Toggle({ checked, onChange, disabled = false }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            className={`toggle${checked ? ' toggle--on' : ''}`}
            onClick={() => onChange?.(!checked)}
        >
            <span className="toggle-knob" />
        </button>
    );
}

export default Toggle;
