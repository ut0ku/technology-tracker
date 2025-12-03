import { useState } from 'react';
import { useTechnologies } from '../contexts/TechnologyContext';

function RoadmapImporter() {
  const { addMultipleTechnologies } = useTechnologies();
  const [importing, setImporting] = useState(false);

  const handleImportRoadmap = async () => {
    try {
      setImporting(true);

      // Имитируем загрузку дорожной карты из API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Большой пул технологий из разных категорий
      const allTechnologies = [
        // Frontend
        { title: 'HTML5 & CSS3', description: 'Современная верстка и стилизация', category: 'frontend', difficulty: 'beginner' },
        { title: 'JavaScript ES6+', description: 'Современный JavaScript', category: 'frontend', difficulty: 'intermediate' },
        { title: 'React.js', description: 'Библиотека для создания UI', category: 'frontend', difficulty: 'intermediate' },
        { title: 'Vue.js', description: 'Прогрессивный JavaScript фреймворк', category: 'frontend', difficulty: 'intermediate' },
        { title: 'Angular', description: 'Фреймворк для создания веб-приложений', category: 'frontend', difficulty: 'advanced' },
        { title: 'TypeScript', description: 'Типизированный JavaScript', category: 'frontend', difficulty: 'advanced' },
        { title: 'Sass/SCSS', description: 'Препроцессор CSS', category: 'frontend', difficulty: 'intermediate' },

        // Backend
        { title: 'Node.js', description: 'JavaScript на сервере', category: 'backend', difficulty: 'intermediate' },
        { title: 'Express.js', description: 'Фреймворк для Node.js', category: 'backend', difficulty: 'intermediate' },
        { title: 'Python', description: 'Язык программирования', category: 'backend', difficulty: 'beginner' },
        { title: 'Django', description: 'Фреймворк для Python', category: 'backend', difficulty: 'intermediate' },
        { title: 'MongoDB', description: 'NoSQL база данных', category: 'backend', difficulty: 'intermediate' },
        { title: 'PostgreSQL', description: 'Реляционная база данных', category: 'backend', difficulty: 'advanced' },
        { title: 'REST API', description: 'Проектирование веб-сервисов', category: 'backend', difficulty: 'intermediate' },
        { title: 'GraphQL', description: 'Язык запросов для API', category: 'backend', difficulty: 'advanced' },

        // DevOps & Tools
        { title: 'Git', description: 'Система контроля версий', category: 'tools', difficulty: 'beginner' },
        { title: 'Docker', description: 'Контейнеризация приложений', category: 'devops', difficulty: 'intermediate' },
        { title: 'Kubernetes', description: 'Оркестрация контейнеров', category: 'devops', difficulty: 'advanced' },
        { title: 'AWS', description: 'Облачная платформа Amazon', category: 'devops', difficulty: 'advanced' },
        { title: 'Linux', description: 'Операционная система', category: 'tools', difficulty: 'intermediate' },
        { title: 'CI/CD', description: 'Непрерывная интеграция и доставка', category: 'devops', difficulty: 'advanced' },

        // Mobile & Other
        { title: 'React Native', description: 'Кроссплатформенная мобильная разработка', category: 'mobile', difficulty: 'advanced' },
        { title: 'Flutter', description: 'Фреймворк для мобильной разработки', category: 'mobile', difficulty: 'intermediate' },
        { title: 'Testing', description: 'Модульное и интеграционное тестирование', category: 'tools', difficulty: 'intermediate' },
        { title: 'Security', description: 'Безопасность веб-приложений', category: 'tools', difficulty: 'advanced' }
      ];

      // Рандомно выбираем 3-7 технологий
      const numToImport = Math.floor(Math.random() * 5) + 3; // 3-7 технологий
      const shuffled = [...allTechnologies].sort(() => 0.5 - Math.random());
      const technologiesToImport = shuffled.slice(0, numToImport);

      // Добавляем выбранные технологии
      const baseId = Date.now();
      const technologiesWithIds = technologiesToImport.map((tech, index) => ({
        ...tech,
        id: baseId + index
      }));

      // Добавляем все технологии одним вызовом
      await addMultipleTechnologies(technologiesWithIds);

      setTimeout(() => {
        alert(`🎉 Успешно импортирована дорожная карта!\nДобавлено ${technologiesToImport.length} случайных технологий из разных категорий.`);
      }, 100);

    } catch (err) {
      console.error('Import error:', err);
      alert(`Ошибка импорта: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="roadmap-importer">
      <h3>
        <span className="icon">📚</span>
        Импорт дорожной карты
      </h3>
      <p>
        <span className="highlight">Быстрое добавление технологий</span> -
        импортируйте случайный набор технологий из разных областей разработки
      </p>

      <div className="import-controls">
        <button
          onClick={handleImportRoadmap}
          disabled={importing}
          className="import-button"
        >
          <span className="button-icon">
            {importing ? '⏳' : '📥'}
          </span>
          <span className="button-text">
            {importing ? 'Импорт...' : 'Импортировать дорожную карту'}
          </span>
          <span className="button-arrow">
            {importing ? '⏳' : '→'}
          </span>
        </button>
      </div>

      {importing && (
        <div className="import-status">
          <div className="spinner"></div>
          <p>Добавление технологий в трекер...</p>
          <div className="progress-hint">
            Выбираем случайный набор из разных категорий
          </div>
        </div>
      )}
    </div>
  );
}

export default RoadmapImporter;