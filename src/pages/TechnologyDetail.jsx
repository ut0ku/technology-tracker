import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useTechnologies } from '../contexts/TechnologyContext';
import './TechnologyDetail.css';
import TechnologyNotes from '../components/TechnologyNotes';
import TechnologyResources from '../components/TechnologyResources';

function TechnologyDetail() {
    const { techId } = useParams();
    const navigate = useNavigate();
    const { technologies, updateTechnologyStatus, updateTechnologyNotes } = useTechnologies();
    const [technology, setTechnology] = useState(null);

    useEffect(() => {
        const tech = technologies.find(t => t.id === parseInt(techId));
        setTechnology(tech);
    }, [techId, technologies]);

    const updateStatus = async (newStatus) => {
        try {
            await updateTechnologyStatus(parseInt(techId), newStatus);
            // Status will be updated via useEffect when technologies change
        } catch (err) {
            alert(`Ошибка обновления статуса: ${err.message}`);
        }
    };

    const updateNotes = async (newNotes) => {
        try {
            await updateTechnologyNotes(parseInt(techId), newNotes);
            // Notes will be updated via useEffect when technologies change
        } catch (err) {
            alert(`Ошибка обновления заметок: ${err.message}`);
        }
    };

    if (!technology) {
        return (
            <div className="page">
                <h1>Технология не найдена</h1>
                <p>Технология с ID {techId} не существует.</p>
                <Link to="/technologies" className="btn">
                    ← Назад к списку
                </Link>
            </div>
        );
    }

    return (
        <div className="technology-detail-page">
            <div className="page-header">
                <Link to="/technologies" className="back-link">
                    ← Назад к списку
                </Link>
                <h1>{technology.title}</h1>
            </div>

            <div className="technology-detail">
                <div className="detail-section">
                    <h3>Описание</h3>
                    <p>{technology.description}</p>
                </div>

                <div className="detail-section">
                    <h3>Статус изучения</h3>
                    <div className="status-buttons">
                        <button
                            onClick={() => updateStatus('not-started')}
                            className={technology.status === 'not-started' ? 'active' : ''}
                        >
                            ⏳ Не начато
                        </button>
                        <button
                            onClick={() => updateStatus('in-progress')}
                            className={technology.status === 'in-progress' ? 'active' : ''}
                        >
                            🔄 В процессе
                        </button>
                        <button
                            onClick={() => updateStatus('completed')}
                            className={technology.status === 'completed' ? 'active' : ''}
                        >
                            ✅ Завершено
                        </button>
                    </div>
                    <div className="current-status">
                        Текущий статус: <strong>{technology.status === 'completed' ? 'Изучено' :
                          technology.status === 'in-progress' ? 'В процессе' : 'Не начато'}</strong>
                    </div>
                </div>

                <TechnologyNotes
                    notes={technology.notes || ''}
                    onNotesChange={(notes) => updateNotes(notes)}
                    techId={parseInt(techId)}
                />

                <TechnologyResources technology={technology} />
            </div>
        </div>
    );
}

export default TechnologyDetail;