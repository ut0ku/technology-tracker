import { createContext, useContext, useState, useEffect } from 'react';

const TechnologyContext = createContext();

export function TechnologyProvider({ children }) {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка технологий из localStorage или mock данных
  const fetchTechnologies = async () => {
    try {
      setLoading(true);
      setError(null);

      // Проверяем, был ли выполнен сброс данных
      const dataReset = localStorage.getItem('dataReset');
      if (dataReset === 'true') {
        // Если сброс был выполнен, не загружаем mock данные
        setTechnologies([]);
        setLoading(false);
        return;
      }

      // Пытаемся загрузить из localStorage
      const savedTechnologies = localStorage.getItem('technologies');
      if (savedTechnologies) {
        const parsedTechnologies = JSON.parse(savedTechnologies);
        setTechnologies(parsedTechnologies);
        setLoading(false);
        return;
      }

      // Если данных нет, используем mock данные
      const mockTechnologies = [
        {
          id: 1,
          title: 'React',
          description: 'Библиотека для создания пользовательских интерфейсов',
          category: 'frontend',
          difficulty: 'beginner',
          status: 'not-started',
          notes: '',
          resources: ['https://react.dev', 'https://ru.reactjs.org']
        },
        {
          id: 2,
          title: 'Node.js',
          description: 'Среда выполнения JavaScript на сервере',
          category: 'backend',
          difficulty: 'intermediate',
          status: 'in-progress',
          notes: 'Изучаю основы',
          resources: ['https://nodejs.org', 'https://nodejs.org/ru/docs/']
        },
        {
          id: 3,
          title: 'TypeScript',
          description: 'Типизированное надмножество JavaScript',
          category: 'language',
          difficulty: 'intermediate',
          status: 'completed',
          notes: 'Освоил базовые типы и интерфейсы',
          resources: ['https://www.typescriptlang.org']
        }
      ];

      // Имитируем задержку загрузки
      await new Promise(resolve => setTimeout(resolve, 500));
      setTechnologies(mockTechnologies);

    } catch (err) {
      setError('Не удалось загрузить технологии');
      console.error('Ошибка загрузки:', err);
    } finally {
      setLoading(false);
    }
  };

  // Сохранение технологий в localStorage
  const saveTechnologies = (techs) => {
    try {
      localStorage.setItem('technologies', JSON.stringify(techs));
      // Очищаем флаг сброса данных, если есть сохраненные технологии
      if (techs.length > 0) {
        localStorage.removeItem('dataReset');
      }
    } catch (err) {
      console.error('Ошибка сохранения технологий:', err);
    }
  };

  // Добавление новой технологии
  const addTechnology = async (techData) => {
    try {
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 500));

      const newTech = {
        id: Date.now(), // В реальном приложении ID генерируется на сервере
        ...techData,
        status: techData.status || 'not-started',
        notes: techData.notes || '',
        createdAt: new Date().toISOString()
      };

      setTechnologies(prev => [...prev, newTech]);
      return newTech;

    } catch (err) {
      throw new Error('Не удалось добавить технологию');
    }
  };

  // Добавление нескольких технологий
  const addMultipleTechnologies = async (techArray) => {
    try {
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 300));

      const newTechs = techArray.map(tech => ({
        ...tech,
        status: tech.status || 'not-started',
        notes: tech.notes || '',
        createdAt: new Date().toISOString()
      }));

      setTechnologies(prev => [...prev, ...newTechs]);
      return newTechs;

    } catch (err) {
      throw new Error('Не удалось добавить технологии');
    }
  };

  // Загружаем технологии при монтировании
  useEffect(() => {
    fetchTechnologies();
  }, []);

  // Сохраняем технологии в localStorage при изменении
  useEffect(() => {
    if (technologies.length > 0) {
      saveTechnologies(technologies);
    }
  }, [technologies]);

  // Обновление статуса технологии
  const updateTechnologyStatus = async (techId, newStatus) => {
    try {
      // Имитируем API запрос
      await new Promise(resolve => setTimeout(resolve, 300));

      setTechnologies(prev =>
        prev.map(tech =>
          tech.id === techId ? { ...tech, status: newStatus } : tech
        )
      );
    } catch (err) {
      console.error('Ошибка обновления статуса:', err);
      throw err;
    }
  };

  // Обновление заметок технологии
  const updateTechnologyNotes = async (techId, newNotes) => {
    try {
      // Имитируем API запрос
      await new Promise(resolve => setTimeout(resolve, 300));

      setTechnologies(prev =>
        prev.map(tech =>
          tech.id === techId ? { ...tech, notes: newNotes } : tech
        )
      );
    } catch (err) {
      console.error('Ошибка обновления заметок:', err);
      throw err;
    }
  };

  // Сброс всех данных
  const resetAllData = () => {
    localStorage.removeItem('technologies');
    localStorage.setItem('dataReset', 'true');
    setTechnologies([]);
  };

  const value = {
    technologies,
    loading,
    error,
    refetch: fetchTechnologies,
    addTechnology,
    addMultipleTechnologies,
    updateTechnologyStatus,
    updateTechnologyNotes,
    resetAllData
  };

  return (
    <TechnologyContext.Provider value={value}>
      {children}
    </TechnologyContext.Provider>
  );
}

export function useTechnologies() {
  const context = useContext(TechnologyContext);
  if (!context) {
    throw new Error('useTechnologies must be used within a TechnologyProvider');
  }
  return context;
}