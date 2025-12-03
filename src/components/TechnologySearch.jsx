import { useState, useEffect, useRef } from 'react';

function TechnologySearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Используем useRef для хранения таймера, AbortController и кэша
  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);
  const searchCacheRef = useRef(new Map());

  // Функция для поиска технологий
  const searchTechnologies = async (query) => {
    // Отменяем предыдущий запрос, если он существует
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Создаем новый AbortController для текущего запроса
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      // Если поисковый запрос пустой, очищаем результаты
      if (!query.trim()) {
        onSearch([]);
        setLoading(false);
        return;
      }

      // Проверяем кэш
      const cacheKey = query.trim().toLowerCase();
      if (searchCacheRef.current.has(cacheKey)) {
        console.log(`📋 Результаты для "${query}" взяты из кэша`);
        const cachedTechnologies = searchCacheRef.current.get(cacheKey);
        onSearch(cachedTechnologies);
        setLoading(false);
        return;
      }

      console.log(` Поиск технологий по запросу: "${query}"`);

      // Имитируем API запрос с поиском
      const response = await fetch(
        `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`,
        { signal: abortControllerRef.current.signal }
      );

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const data = await response.json();

      console.log(`✅ Найдено ${data.products?.length || 0} технологий для запроса "${query}"`);

      // Преобразуем продукты в формат технологий
      const technologies = data.products?.map(product => ({
        id: product.id + 1000, // Чтобы не пересекаться с существующими ID
        title: product.title,
        description: product.description,
        category: 'api-search',
        difficulty: 'unknown',
        status: 'not-started',
        notes: '',
        price: product.price,
        thumbnail: product.thumbnail
      })) || [];

      // Сохраняем в кэш
      searchCacheRef.current.set(cacheKey, technologies);

      onSearch(technologies);

    } catch (err) {
      // Игнорируем ошибки отмены запроса
      if (err.name !== 'AbortError') {
        setError(err.message);
        console.error('Ошибка при поиске технологий:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Обработчик изменения поискового запроса
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Очищаем предыдущий таймер
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Устанавливаем новый таймер для debounce (500ms)
    searchTimeoutRef.current = setTimeout(() => {
      searchTechnologies(value);
    }, 500);
  };

  // Очистка при размонтировании компонента
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="technology-search">
      <h3>Поиск технологий в API</h3>

      <div className="search-box">
        <input
          type="text"
          placeholder="Введите название технологии..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        {loading && <span className="search-loading">⌛</span>}
      </div>

      {error && (
        <div className="error-message">
          Ошибка: {error}
        </div>
      )}

    </div>
  );
}

export default TechnologySearch;