import './QuickActions.css';
function QuickActions({ technologies, onUpdateAllStatuses, onRandomSelect }) {
    const handleMarkAllCompleted = () => {
        onUpdateAllStatuses('completed');
    };

    const handleResetAll = () => {
        onUpdateAllStatuses('not-started');
    };

    const handleRandomSelect = () => {
        onRandomSelect();
    };

    return (
        <div className="quick-actions">
            <h3>Быстрые действия</h3>
            <div className="action-buttons">
                <button 
                    className="action-btn completed" 
                    onClick={handleMarkAllCompleted}
                >
                    ✅ Отметить все как выполненные
                </button>
                <button 
                    className="action-btn reset" 
                    onClick={handleResetAll}
                >
                    🔄 Сбросить все статусы
                </button>
                <button 
                    className="action-btn random" 
                    onClick={handleRandomSelect}
                >
                    🎲 Случайный выбор следующей технологии
                </button>
            </div>
        </div>
    );
}

export default QuickActions;