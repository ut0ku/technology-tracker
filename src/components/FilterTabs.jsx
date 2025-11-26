import './FilterTabs.css';
function FilterTabs({ activeFilter, onFilterChange }) {
    const filters = [
        { key: 'all', label: 'Все технологии' },
        { key: 'not-started', label: 'Не начатые' },
        { key: 'in-progress', label: 'В процессе' },
        { key: 'completed', label: 'Выполненные' }
    ];

    return (
        <div className="filter-tabs">
            <h3>Фильтр по статусу</h3>
            <div className="tab-buttons">
                {filters.map(filter => (
                    <button
                        key={filter.key}
                        className={`tab-btn ${activeFilter === filter.key ? 'active' : ''}`}
                        onClick={() => onFilterChange(filter.key)}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default FilterTabs;