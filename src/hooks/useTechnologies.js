import useLocalStorage from './useLocalStorage';

// Начальные данные для технологий
const initialTechnologies = [
    {
        id: 1,
        title: 'React Components',
        description: 'Изучение функциональных и классовых компонентов, их жизненного цикла и особенностей использования',
        status: 'not-started',
        notes: '',
        category: 'frontend'
    },
    {
        id: 2,
        title: 'Node.js Basics',
        description: 'Основы серверного JavaScript',
        status: 'not-started',
        notes: '',
        category: 'backend'
    },
    {
        id: 3,
        title: 'State Management',
        description: 'Работа с состоянием компонентов, использование хуков useState и useEffect',
        status: 'not-started',
        notes: '',
        category: 'frontend'
    },
    {
        id: 4,
        title: 'Props and Data Flow',
        description: 'Передача данных между компонентами через props, однонаправленный поток данных',
        status: 'not-started',
        notes: '',
        category: 'frontend'
    },
    {
        id: 5,
        title: 'Event Handling',
        description: 'Обработка событий в React, работа с формами и пользовательским вводом',
        status: 'not-started',
        notes: '',
        category: 'frontend'
    }
];

function useTechnologies() {
    const [technologies, setTechnologies] = useLocalStorage('technologies', initialTechnologies);

    // Функция для обновления статуса технологии
    const updateStatus = (techId, newStatus) => {
        setTechnologies(prev =>
            prev.map(tech =>
                tech.id === techId ? { ...tech, status: newStatus } : tech
            )
        );
    };

    // Функция для обновления заметок
    const updateNotes = (techId, newNotes) => {
        setTechnologies(prev =>
            prev.map(tech =>
                tech.id === techId ? { ...tech, notes: newNotes } : tech
            )
        );
    };

    // Функция для расчета общего прогресса
    const calculateProgress = () => {
        if (technologies.length === 0) return 0;
        const completed = technologies.filter(tech => tech.status === 'completed').length;
        return Math.round((completed / technologies.length) * 100);
    };

    // Функция для отметки всех технологий как выполненных
    const markAllCompleted = () => {
        setTechnologies(prev =>
            prev.map(tech => ({ ...tech, status: 'completed' }))
        );
    };

    // Функция для сброса всех статусов
    const resetAllStatuses = () => {
        setTechnologies(prev =>
            prev.map(tech => ({ ...tech, status: 'not-started' }))
        );
    };

    return {
        technologies,
        updateStatus,
        updateNotes,
        markAllCompleted,
        resetAllStatuses,
        progress: calculateProgress()
    };
}

export default useTechnologies;