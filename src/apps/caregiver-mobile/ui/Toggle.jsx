import './Toggle.css';

function Toggle({ checked, onChange, disabled = false }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            className={`cg-toggle${checked ? ' cg-toggle--on' : ''}`}
            onClick={() => onChange?.(!checked)}
        >
            <span className="cg-toggle-knob" />
        </button>
    );
}

export default Toggle;
