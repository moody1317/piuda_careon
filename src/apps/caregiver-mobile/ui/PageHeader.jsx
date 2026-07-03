import './PageHeader.css';

function PageHeader({ title, subtitle, children }) {
    return (
        <div className="cg-page-header">
            <p className="cg-page-header-title">{title}</p>
            {subtitle && <p className="cg-page-header-subtitle">{subtitle}</p>}
            {children}
        </div>
    );
}

export default PageHeader;
