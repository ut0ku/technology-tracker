import { useState, useEffect } from 'react';

function useTechnologiesApi() {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка технологий из API
  const fetchTechnologies = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock данные без реального запроса для стабильности
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

  return {
    technologies,
    loading,
    error,
    refetch: fetchTechnologies,
    addTechnology,
    addMultipleTechnologies,
    updateTechnologyStatus,
    updateTechnologyNotes
  };
}

export default useTechnologiesApi;