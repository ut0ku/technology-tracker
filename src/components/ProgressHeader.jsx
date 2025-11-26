import './ProgressHeader.css';
function ProgressHeader({ technologies }) {
    const totalTechnologies = technologies.length;
    const completedTechnologies = technologies.filter(tech => tech.status === 'completed').length;
    const inProgressTechnologies = technologies.filter(tech => tech.status === 'in-progress').length;
    const notStartedTechnologies = technologies.filter(tech => tech.status === 'not-started').length;
    
    const progressPercentage = totalTechnologies > 0 
        ? Math.round((completedTechnologies / totalTechnologies) * 100) 
        : 0;

    return (
        <div className="progress-header">
            <div className="progress-stats">
                <div className="stat-item">
                    <span className="stat-number">{totalTechnologies}</span>
                    <span className="stat-label">Всего технологий</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{completedTechnologies}</span>
                    <span className="stat-label">Изучено</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{inProgressTechnologies}</span>
                    <span className="stat-label">В процессе</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{notStartedTechnologies}</span>
                    <span className="stat-label">Не начато</span>
                </div>
            </div>
            
            <div className="progress-bar-container">
                <div className="progress-bar-background">
                    <div 
                        className="progress-bar-fill"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
                <div className="progress-text">
                    {progressPercentage === 100 ? '🎉 Все технологии изучены!' : 
                     `Изучено ${completedTechnologies} из ${totalTechnologies} технологий (${progressPercentage}%)`}
                </div>
            </div>
        </div>
    );
}

export default ProgressHeader;