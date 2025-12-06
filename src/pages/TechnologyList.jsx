import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTechnologies } from '../contexts/TechnologyContext';
import ProgressBar from '../components/ProgressBar';
import FilterTabs from '../components/FilterTabs';
import QuickActions from '../components/QuickActions';
import RoadmapImporter from '../components/RoadmapImporter';
import TechnologySearch from '../components/TechnologySearch';
import BulkStatusEditor from '../components/BulkStatusEditor';
import './TechnologyList.css';

function TechnologyList() {
    const {
        technologies,
        loading,
        error,
        refetch,
        addMultipleTechnologies,
        updateTechnologyStatus,
        updateTechnologyNotes,
        resetAllData
    } = useTechnologies();

    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showBulkEditor, setShowBulkEditor] = useState(false);
    const navigate = useNavigate();

    // Функции для работы с технологиями
    const updateStatus = async (techId, newStatus) => {
        try {
            await updateTechnologyStatus(techId, newStatus);
        } catch (err) {
            alert(`Ошибка обновления статуса: ${err.message}`);
        }
    };

    const updateNotes = async (techId, newNotes) => {
        try {
            await updateTechnologyNotes(techId, newNotes);
        } catch (err) {
            alert(`Ошибка обновления заметок: ${err.message}`);
        }
    };

    const markAllCompleted = async () => {
        try {
            const updates = technologies.map(tech => ({
                ...tech,
                status: 'completed'
            }));

            // Обновляем все технологии
            for (const tech of technologies) {
                await updateTechnologyStatus(tech.id, 'completed');
            }

            alert('✅ Все технологии отмечены как завершенные!');
        } catch (err) {
            alert(`Ошибка: ${err.message}`);
        }
    };

    const resetAllStatuses = async () => {
        try {
            // Сбрасываем все статусы на 'not-started'
            for (const tech of technologies) {
                await updateTechnologyStatus(tech.id, 'not-started');
            }

            alert('🔄 Все статусы сброшены!');
        } catch (err) {
            alert(`Ошибка: ${err.message}`);
        }
    };

    const handleRandomSelect = () => {
        const notStartedTechs = technologies.filter(tech => tech.status === 'not-started');
        if (notStartedTechs.length > 0) {
            const randomTech = notStartedTechs[Math.floor(Math.random() * notStartedTechs.length)];
            updateStatus(randomTech.id, 'in-progress');
            alert(`🎯 Следующая технология для изучения: ${randomTech.title}\nСтатус изменен на "В процессе"`);
        } else {
            alert('🎉 Все технологии уже начаты или завершены!');
        }
    };


    const handleSearchResults = (results) => {
        setSearchResults(results);
    };

    // Объединяем основные технологии и результаты поиска
    const allTechnologies = [...technologies, ...searchResults];

    const filteredTechnologies = allTechnologies.filter(tech => {
        const statusMatch = activeFilter === 'all' || tech.status === activeFilter;
        const searchMatch = searchQuery === '' ||
            tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tech.description.toLowerCase().includes(searchQuery.toLowerCase());
        return statusMatch && searchMatch;
    });

    const progress = technologies.length > 0
        ? Math.round((technologies.filter(tech => tech.status === 'completed').length / technologies.length) * 100)
        : 0;

    if (loading) {
        return (
            <div className="technology-list-page loading">
                <div className="spinner"></div>
                <p>Загрузка технологий...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="technology-list-page error">
                <h2>Ошибка при загрузке технологий</h2>
                <p>{error}</p>
                <button onClick={refetch}>Попробовать снова</button>
            </div>
        );
    }

    return (
        <div className="technology-list-page">
            <div className="page-header">
                <h1>Все технологии</h1>
            </div>

            <ProgressBar
                progress={progress}
                label="Общий прогресс"
                color="#4CAF50"
                animated={true}
                height={20}
            />

            <QuickActions
                onMarkAllCompleted={markAllCompleted}
                onResetAll={resetAllStatuses}
                technologies={technologies}
                onRandomSelect={handleRandomSelect}
            />

            <div className="bulk-actions">
                <button
                    onClick={() => setShowBulkEditor(true)}
                    className="btn btn-primary bulk-edit-btn"
                    disabled={technologies.length === 0}
                >
                    📝 Редактировать статусы
                </button>
            </div>

            <RoadmapImporter />

            <TechnologySearch onSearch={handleSearchResults} />

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
                        <p>🚫 В трекере пока нет технологий</p>
                    ) : (
                        <p>🔍 Нет технологий по вашему запросу</p>
                    )}
                </div>
            )}

            {showBulkEditor && (
                <BulkStatusEditor onClose={() => setShowBulkEditor(false)} />
            )}
        </div>
    );
}

export default TechnologyList;