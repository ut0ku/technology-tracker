import { useState } from 'react';
import useTechnologies from '../hooks/useTechnologies';
import ProgressHeader from '../components/ProgressHeader';
import QuickActions from '../components/QuickActions';
import FilterTabs from '../components/FilterTabs';
import TechnologyCard from '../components/TechnologyCard';
import TechnologyNotes from '../components/TechnologyNotes';
import ProgressBar from '../components/ProgressBar';
import './Home.css';

function Home() {
    const { 
        technologies, 
        updateStatus, 
        updateNotes, 
        markAllCompleted, 
        resetAllStatuses, 
        progress 
    } = useTechnologies();

    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

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

    const filteredTechnologies = technologies.filter(tech => {
        const statusMatch = activeFilter === 'all' || tech.status === activeFilter;
        const searchMatch = searchQuery === '' || 
            tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tech.description.toLowerCase().includes(searchQuery.toLowerCase());
        return statusMatch && searchMatch;
    });

    return (
        <div className="home-page">
            <header className="page-header">
                <h1>🚀 Трекер изучения технологий</h1>
                <p>Отслеживание моего прогресса в изучении современных технологий</p>
                <ProgressBar
                    progress={progress}
                    label="Общий прогресс"
                    color="#4CAF50"
                    animated={true}
                    height={20}
                />
            </header>

            <ProgressHeader technologies={technologies} />
            
            <QuickActions 
                onMarkAllCompleted={markAllCompleted}
                onResetAll={resetAllStatuses}
                technologies={technologies}
                onRandomSelect={handleRandomSelect}
            />

            <FilterTabs 
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
            />
            
            <div className="search-box-home">
                <input
                    type="text"
                    placeholder="🔍 Поиск технологий по названию или описанию..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input-home"
                />
                <span className="search-results-count-home">
                    Найдено: {filteredTechnologies.length}
                </span>
            </div>
            
            <main className="technologies-container">
                <h2>
                    {activeFilter === 'all' && 'Все технологии'}
                    {activeFilter === 'not-started' && 'Не начатые технологии'}
                    {activeFilter === 'in-progress' && 'Технологии в процессе изучения'}
                    {activeFilter === 'completed' && 'Изученные технологии'}
                    <span className="counter"> ({filteredTechnologies.length})</span>
                </h2>
                
                <div className="technologies-list">
                    {filteredTechnologies.map(tech => (
                        <div key={tech.id} className="technology-card-wrapper">
                            <TechnologyCard
                                id={tech.id}
                                title={tech.title}
                                description={tech.description}
                                status={tech.status}
                                onStatusChange={() => {
                                    const statusOrder = ['not-started', 'in-progress', 'completed'];
                                    const currentIndex = statusOrder.indexOf(tech.status);
                                    const nextIndex = (currentIndex + 1) % statusOrder.length;
                                    updateStatus(tech.id, statusOrder[nextIndex]);
                                }}
                            />
                            <TechnologyNotes
                                notes={tech.notes}
                                onNotesChange={updateNotes}
                                techId={tech.id}
                            />
                        </div>
                    ))}
                </div>

                {filteredTechnologies.length === 0 && (
                    <div className="empty-state">
                        <p>🚫 Нет технологий с выбранным статусом или по вашему запросу</p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Home;