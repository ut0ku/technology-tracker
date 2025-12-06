import { useState, useEffect, useRef } from 'react';

function TechnologySearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // useRef для хранения таймера, AbortController и кэша
  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);
  const searchCacheRef = useRef(new Map());

  // Поиск технологий
  const searchTechnologies = async (query) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Новый AbortController для текущего запроса
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      if (!query.trim()) {
        onSearch([]);
        setLoading(false);
        return;
      }

      const cacheKey = query.trim().toLowerCase();
      if (searchCacheRef.current.has(cacheKey)) {
        console.log(`📋 Результаты для "${query}" взяты из кэша`);
        const cachedTechnologies = searchCacheRef.current.get(cacheKey);
        onSearch(cachedTechnologies);
        setLoading(false);
        return;
      }

      console.log(` Поиск технологий по запросу: "${query}"`);

      const response = await fetch(
        `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`,
        { signal: abortControllerRef.current.signal }
      );

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const data = await response.json();

      console.log(`✅ Найдено ${data.products?.length || 0} технологий для запроса "${query}"`);

      const technologies = data.products?.map(product => ({
        id: product.id + 1000,
        title: product.title,
        description: product.description,
        category: 'api-search',
        difficulty: 'unknown',
        status: 'not-started',
        notes: '',
        price: product.price,
        thumbnail: product.thumbnail
      })) || [];

      searchCacheRef.current.set(cacheKey, technologies);

      onSearch(technologies);

    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
        console.error('Ошибка при поиске технологий:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Очистка предыдущего таймера
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Новый таймер для debounce (500ms)
    searchTimeoutRef.current = setTimeout(() => {
      searchTechnologies(value);
    }, 500);
  };

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