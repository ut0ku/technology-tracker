import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTechnologies } from '../contexts/TechnologyContext';
import './Statistics.css';

function Statistics() {
    const { technologies } = useTechnologies();
    const [chartData, setChartData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Подготовка данных для графика
        const completed = technologies.filter(t => t.status === 'completed').length;
        const inProgress = technologies.filter(t => t.status === 'in-progress').length;
        const notStarted = technologies.filter(t => t.status === 'not-started').length;
        const total = technologies.length;

        setChartData({
            completed,
            inProgress,
            notStarted,
            total,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
            inProgressRate: total > 0 ? Math.round((inProgress / total) * 100) : 0,
            notStartedRate: total > 0 ? Math.round((notStarted / total) * 100) : 0
        });
    }, [technologies]);

    return (
        <div className="statistics-page">
            <div className="page-header">
                <h1>📊 Статистика прогресса</h1>
                <button onClick={() => navigate('/technologies')} className="btn btn-primary back-btn">
                    ← К технологиям
                </button>
            </div>

            <div className="stats-overview">
                <div className="stat-card">
                    <h3>Общий прогресс</h3>
                    <div className="stat-value">{chartData?.completionRate || 0}%</div>
                    <div className="progress-bar-large">
                        <div 
                            className="progress-fill"
                            style={{ width: `${chartData?.completionRate || 0}%` }}
                        ></div>
                    </div>
                    <p className="stat-subtitle">
                        Изучено: {chartData?.completed || 0} из {chartData?.total || 0}
                    </p>
                </div>

                <div className="stat-card">
                    <h3>Всего технологий</h3>
                    <div className="stat-value">{chartData?.total || 0}</div>
                    <p className="stat-subtitle">в трекере</p>
                </div>
            </div>

            <div className="distribution-chart">
                <h2>Распределение по статусам</h2>
                <div className="chart-container">
                    <div className="chart-bar completed-bar" 
                         style={{ 
                             height: chartData?.total > 0 
                                 ? `${(chartData.completed / chartData.total) * 200}px` 
                                 : '20px' 
                         }}>
                        <span className="bar-label">Изучено: {chartData?.completed || 0}</span>
                    </div>
                    <div className="chart-bar inprogress-bar" 
                         style={{ 
                             height: chartData?.total > 0 
                                 ? `${(chartData.inProgress / chartData.total) * 200}px` 
                                 : '20px' 
                         }}>
                        <span className="bar-label">В процессе: {chartData?.inProgress || 0}</span>
                    </div>
                    <div className="chart-bar notstarted-bar" 
                         style={{ 
                             height: chartData?.total > 0 
                                 ? `${(chartData.notStarted / chartData.total) * 200}px` 
                                 : '20px' 
                         }}>
                        <span className="bar-label">Не начато: {chartData?.notStarted || 0}</span>
                    </div>
                </div>
            </div>

            <div className="detailed-stats">
                <h2>Детальная статистика</h2>
                <table className="stats-table">
                    <thead>
                        <tr>
                            <th>Статус</th>
                            <th>Количество</th>
                            <th>Процент</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <span className="status-icon">✅</span> Изучено
                            </td>
                            <td>{chartData?.completed || 0}</td>
                            <td>{chartData?.completionRate || 0}%</td>
                        </tr>
                        <tr>
                            <td>
                                <span className="status-icon">🔄</span> В процессе
                            </td>
                            <td>{chartData?.inProgress || 0}</td>
                            <td>{chartData?.inProgressRate || 0}%</td>
                        </tr>
                        <tr>
                            <td>
                                <span className="status-icon">⏳</span> Не начато
                            </td>
                            <td>{chartData?.notStarted || 0}</td>
                            <td>{chartData?.notStartedRate || 0}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {technologies.length === 0 && (
                <div className="empty-stats-message">
                    <p>📝 Статистика пока пуста. Добавьте технологии в трекер, чтобы увидеть прогресс!</p>
                    <button onClick={() => navigate('/')} className="btn btn-primary">
                        Перейти к добавлению технологий
                    </button>
                </div>
            )}
        </div>
    );
}

export default Statistics;