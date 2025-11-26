import './TechnologyCard.css';
function TechnologyCard({ id, title, description, status, onStatusChange }) {
    const handleClick = () => {
        onStatusChange(id);
    };

    return (
        <div 
            className={`technology-card ${status}`}
            onClick={handleClick}
        >
            <div className="card-header">
                <h3 className="card-title">{title}</h3>
                <span className={`status-badge ${status}`}>
                    {status === 'completed' && '✅'}
                    {status === 'in-progress' && '🔄'}
                    {status === 'not-started' && '⏳'}
                    {status === 'completed' ? 'Изучено' : 
                     status === 'in-progress' ? 'В процессе' : 'Не начато'}
                </span>
            </div>
            <p className="card-description">{description}</p>
            <div className="progress-indicator">
                <div className={`progress-bar ${status}`}></div>
            </div>
        </div>
    );
}

export default TechnologyCard;