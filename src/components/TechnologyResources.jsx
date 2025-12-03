import { useState, useEffect } from 'react';

function TechnologyResources({ technology }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Функция для загрузки ресурсов из API
  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);

      // Имитируем запрос к API для получения ресурсов технологии
      // В реальном приложении здесь был бы запрос к соответствующему API
      const mockResources = [
        {
          id: 1,
          title: `Официальная документация ${technology.title}`,
          url: technology.resources?.[0] || `https://example.com/docs/${technology.title.toLowerCase()}`,
          type: 'documentation'
        },
        {
          id: 2,
          title: `Учебник по ${technology.title}`,
          url: `https://example.com/tutorial/${technology.title.toLowerCase()}`,
          type: 'tutorial'
        },
        {
          id: 3,
          title: `Примеры кода ${technology.title}`,
          url: `https://github.com/search?q=${encodeURIComponent(technology.title)}`,
          type: 'examples'
        }
      ];

      // Имитируем задержку API
      await new Promise(resolve => setTimeout(resolve, 1000));

      setResources(mockResources);

    } catch (err) {
      setError('Не удалось загрузить ресурсы');
      console.error('Ошибка загрузки ресурсов:', err);
    } finally {
      setLoading(false);
    }
  };

  // Загружаем ресурсы при изменении технологии (только при изменении ID или названия)
  useEffect(() => {
    if (technology?.id) {
      fetchResources();
    }
  }, [technology?.id, technology?.title]);

  if (!technology) return null;

  return (
    <div className="technology-resources">
      <h4>Дополнительные ресурсы</h4>

      {loading && (
        <div className="resources-loading">
          <div className="spinner"></div>
          <p>Загрузка ресурсов...</p>
        </div>
      )}

      {error && (
        <div className="resources-error">
          <p>{error}</p>
          <button onClick={fetchResources} className="retry-button">
            Попробовать снова
          </button>
        </div>
      )}

      {!loading && !error && resources.length > 0 && (
        <div className="resources-list">
          {resources.map(resource => (
            <div key={resource.id} className="resource-item">
              <h5>{resource.title}</h5>
              <p><strong>Тип:</strong> {resource.type}</p>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="resource-link"
              >
                Перейти к ресурсу →
              </a>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && resources.length === 0 && (
        <p>Ресурсы не найдены</p>
      )}
    </div>
  );
}

export default TechnologyResources;