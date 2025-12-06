import { useState } from 'react';
import { useTechnologies } from '../contexts/TechnologyContext';

function RoadmapImporter() {
  const { addMultipleTechnologies } = useTechnologies();
  const [importing, setImporting] = useState(false);

  const handleImportRoadmap = async () => {
    try {
      setImporting(true);

      // Загрузка из Json
      const response = await fetch('/technology-tracker/technologies.json');
      if (!response.ok) {
        throw new Error('Не удалось загрузить файл технологий');
      }
      const allTechnologies = await response.json();

      // Рандомный выбор
      const numToImport = Math.floor(Math.random() * 5) + 3; // 3-7 технологий
      const shuffled = [...allTechnologies].sort(() => 0.5 - Math.random());
      const technologiesToImport = shuffled.slice(0, numToImport);

      const baseId = Date.now();
      const technologiesWithIds = technologiesToImport.map((tech, index) => ({
        ...tech,
        id: baseId + index
      }));

      // Добавление всех технологий одним вызовом
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