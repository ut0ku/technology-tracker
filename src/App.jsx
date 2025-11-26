import { useState } from 'react';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';
import FilterTabs from './components/FilterTabs';

function App() {
    // Состояние для массива технологий
    const [technologies, setTechnologies] = useState([
        { 
            id: 1, 
            title: 'React Components', 
            description: 'Изучение функциональных и классовых компонентов, их жизненного цикла и особенностей использования', 
            status: 'not-started' 
        },
        { 
            id: 2, 
            title: 'JSX Syntax', 
            description: 'Освоение синтаксиса JSX, работа с выражениями JavaScript в разметке', 
            status: 'not-started' 
        },
        { 
            id: 3, 
            title: 'State Management', 
            description: 'Работа с состоянием компонентов, использование хуков useState и useEffect', 
            status: 'not-started' 
        },
        { 
            id: 4, 
            title: 'Props and Data Flow', 
            description: 'Передача данных между компонентами через props, однонаправленный поток данных', 
            status: 'not-started' 
        },
        { 
            id: 5, 
            title: 'Event Handling', 
            description: 'Обработка событий в React, работа с формами и пользовательским вводом', 
            status: 'not-started' 
        }
    ]);

    // Состояние для активного фильтра
    const [activeFilter, setActiveFilter] = useState('all');

    // Функция для изменения статуса технологии по ID
    const handleStatusChange = (technologyId) => {
        setTechnologies(prevTechnologies => 
            prevTechnologies.map(tech => {
                if (tech.id === technologyId) {
                    // Циклическое переключение статусов
                    const statusOrder = ['not-started', 'in-progress', 'completed'];
                    const currentIndex = statusOrder.indexOf(tech.status);
                    const nextIndex = (currentIndex + 1) % statusOrder.length;
                    return {
                        ...tech,
                        status: statusOrder[nextIndex]
                    };
                }
                return tech;
            })
        );
    };

    // Функция для обновления всех статусов
    const handleUpdateAllStatuses = (newStatus) => {
        setTechnologies(prevTechnologies =>
            prevTechnologies.map(tech => ({
                ...tech,
                status: newStatus
            }))
        );
    };

    // Функция для случайного выбора технологии
    const handleRandomSelect = () => {
        const notStartedTechs = technologies.filter(tech => tech.status === 'not-started');
        if (notStartedTechs.length > 0) {
            const randomTech = notStartedTechs[Math.floor(Math.random() * notStartedTechs.length)];
            alert(`🎯 Следующая технология для изучения: ${randomTech.title}`);
        } else {
            alert('🎉 Все технологии уже начаты или завершены!');
        }
    };

    // Фильтрация технологий по активному фильтру
    const filteredTechnologies = technologies.filter(tech => {
        if (activeFilter === 'all') return true;
        return tech.status === activeFilter;
    });

    return (
        <div className="App">
            <header className="App-header">
                <h1>🚀 Трекер изучения технологий</h1>
                <p>Отслеживание моего прогресса в изучении современных технологий</p>
            </header>

            <ProgressHeader technologies={technologies} />
            
            <QuickActions 
                technologies={technologies}
                onUpdateAllStatuses={handleUpdateAllStatuses}
                onRandomSelect={handleRandomSelect}
            />

            <FilterTabs 
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
            />
            
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
                        <TechnologyCard
                            key={tech.id}
                            id={tech.id}
                            title={tech.title}
                            description={tech.description}
                            status={tech.status}
                            onStatusChange={handleStatusChange}
                        />
                    ))}
                </div>

                {filteredTechnologies.length === 0 && (
                    <div className="empty-state">
                        <p>🚫 Нет технологий с выбранным статусом</p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;