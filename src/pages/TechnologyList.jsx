import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import FilterTabs from '../components/FilterTabs';
import './TechnologyList.css';

function TechnologyList() {
    const [technologies, setTechnologies] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const saved = localStorage.getItem('technologies');
        if (saved) {
            setTechnologies(JSON.parse(saved));
        }
    }, []);

    const updateStatus = (techId, newStatus) => {
        const updated = technologies.map(tech =>
            tech.id === techId ? { ...tech, status: newStatus } : tech
        );
        setTechnologies(updated);
        localStorage.setItem('technologies', JSON.stringify(updated));
    };

    const filteredTechnologies = technologies.filter(tech => {
        const statusMatch = activeFilter === 'all' || tech.status === activeFilter;
        const searchMatch = searchQuery === '' ||
            tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tech.description.toLowerCase().includes(searchQuery.toLowerCase());
        return statusMatch && searchMatch;
    });

    const progress = technologies.length > 0
        ? Math.round((technologies.filter(tech => tech.status === 'completed').length / technologies.length) * 100)
        : 0;

    return (
        <div className="technology-list-page">
            <div className="page-header">
                <h1>Все технологии</h1>
                <button onClick={() => navigate('/')} className="btn btn-primary back-btn">
                    ← На главную
                </button>
            </div>

            <ProgressBar
                progress={progress}
                label="Общий прогресс"
                color="#4CAF50"
                animated={true}
                height={20}
            />

            <FilterTabs
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
            />

            <div className="search-box">
                <input
                    type="text"
                    placeholder="🔍 Поиск технологий по названию или описанию..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
                <span className="search-results-count">
                    Найдено: {filteredTechnologies.length}
                </span>
            </div>

            <div className="technologies-grid">
                {filteredTechnologies.map(tech => (
                    <div key={tech.id} className="technology-item">
                        <div className={`tech-card ${tech.status}`}>
                            <div className="tech-header">
                                <h3>{tech.title}</h3>
                                <span className={`status-badge ${tech.status}`}>
                                    {tech.status === 'completed' && '✅'}
                                    {tech.status === 'in-progress' && '🔄'}
                                    {tech.status === 'not-started' && '⏳'}
                                    {tech.status === 'completed' ? 'Изучено' :
                                     tech.status === 'in-progress' ? 'В процессе' : 'Не начато'}
                                </span>
                            </div>
                            <p className="tech-description">{tech.description}</p>
                            <div className="tech-meta">
                                <div className="tech-actions">
                                    <button 
                                        onClick={() => {
                                            const statusOrder = ['not-started', 'in-progress', 'completed'];
                                            const currentIndex = statusOrder.indexOf(tech.status);
                                            const nextIndex = (currentIndex + 1) % statusOrder.length;
                                            updateStatus(tech.id, statusOrder[nextIndex]);
                                        }}
                                        className="btn-change-status"
                                    >
                                        Изменить статус
                                    </button>
                                    <Link to={`/technology/${tech.id}`} className="btn-link">
                                        Подробнее →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredTechnologies.length === 0 && (
                <div className="empty-state">
                    {technologies.length === 0 ? (
                        <>
                            <p>🚫 В трекере пока нет технологий</p>
                            <button onClick={() => navigate('/')} className="btn btn-primary">
                                Добавить первую технологию
                            </button>
                        </>
                    ) : (
                        <p>🔍 Нет технологий по вашему запросу</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default TechnologyList;