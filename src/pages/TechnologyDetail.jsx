import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useTechnologies } from '../contexts/TechnologyContext';
import Modal from '../components/Modal';
import './TechnologyDetail.css';
import TechnologyNotes from '../components/TechnologyNotes';
import TechnologyResources from '../components/TechnologyResources';

function TechnologyDetail() {
    const { techId } = useParams();
    const navigate = useNavigate();
    const { technologies, updateTechnologyStatus, updateTechnologyNotes, updateTechnologyDeadline, deleteTechnology } = useTechnologies();
    const [technology, setTechnology] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isEditingDeadline, setIsEditingDeadline] = useState(false);
    const [editingDeadline, setEditingDeadline] = useState('');

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

    const handleDeleteTechnology = async () => {
        try {
            await deleteTechnology(parseInt(techId));
            alert('✅ Технология успешно удалена!');
            navigate('/technologies');
        } catch (err) {
            alert(`Ошибка удаления технологии: ${err.message}`);
        }
    };

    const calculateTimeRemaining = (deadline) => {
        if (!deadline) return null;

        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diffMs = deadlineDate - now;

        if (diffMs < 0) {
            return { expired: true, text: 'Срок истек' };
        }

        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        if (diffDays > 0) {
            return { expired: false, text: `${diffDays} д. ${diffHours} ч.` };
        } else if (diffHours > 0) {
            return { expired: false, text: `${diffHours} ч. ${diffMinutes} мин.` };
        } else if (diffMinutes > 0) {
            return { expired: false, text: `${diffMinutes} мин.` };
        } else {
            return { expired: false, text: 'Менее минуты' };
        }
    };

    const handleEditDeadline = () => {
        setEditingDeadline(technology.deadline || '');
        setIsEditingDeadline(true);
    };

    const handleSaveDeadline = async () => {
        try {
            // Validate deadline is not in the past
            if (editingDeadline) {
                const deadlineDate = new Date(editingDeadline);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (deadlineDate < today) {
                    alert('Дедлайн не может быть в прошлом');
                    return;
                }
            }

            await updateTechnologyDeadline(parseInt(techId), editingDeadline || undefined);
            setIsEditingDeadline(false);
        } catch (err) {
            alert(`Ошибка обновления дедлайна: ${err.message}`);
        }
    };

    const handleCancelDeadlineEdit = () => {
        setIsEditingDeadline(false);
        setEditingDeadline('');
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

                <div className="detail-section">
                    <h3>Дедлайн</h3>
                    {isEditingDeadline ? (
                        <div className="deadline-editor">
                            <label htmlFor="deadline-edit">Установить дедлайн:</label>
                            <input
                                id="deadline-edit"
                                type="date"
                                value={editingDeadline}
                                onChange={(e) => setEditingDeadline(e.target.value)}
                                className="deadline-input"
                            />
                            <div className="deadline-actions">
                                <button
                                    onClick={handleSaveDeadline}
                                    className="btn btn-success save-deadline-btn"
                                >
                                    💾 Сохранить
                                </button>
                                <button
                                    onClick={handleCancelDeadlineEdit}
                                    className="btn btn-secondary cancel-deadline-btn"
                                >
                                    Отмена
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="deadline-display">
                            {technology.deadline ? (
                                <div className="deadline-info">
                                    <div className="deadline-date">
                                        📅 <strong>{new Date(technology.deadline).toLocaleDateString('ru-RU')}</strong>
                                    </div>
                                    <div className={`deadline-status ${calculateTimeRemaining(technology.deadline)?.expired ? 'expired' : 'active'}`}>
                                        {calculateTimeRemaining(technology.deadline)?.expired ? (
                                            <span className="expired-text">⏰ {calculateTimeRemaining(technology.deadline).text}</span>
                                        ) : (
                                            <span className="remaining-text">⏱️ Осталось: {calculateTimeRemaining(technology.deadline).text}</span>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="no-deadline">
                                    📅 Дедлайн не установлен
                                </div>
                            )}
                            <button
                                onClick={handleEditDeadline}
                                className="btn btn-primary edit-deadline-btn"
                            >
                                ✏️ {technology.deadline ? 'Изменить' : 'Установить'} дедлайн
                            </button>
                        </div>
                    )}
                </div>

                <div className="detail-section">
                    <h3>Действия</h3>
                    <div className="action-buttons">
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="btn btn-danger delete-btn"
                        >
                            🗑️ Удалить технологию
                        </button>
                    </div>
                </div>

                <TechnologyNotes
                    notes={technology.notes || ''}
                    onNotesChange={(notes) => updateNotes(notes)}
                    techId={parseInt(techId)}
                />

                <TechnologyResources technology={technology} />
            </div>

            <Modal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                title="Удаление технологии"
            >
                <div className="delete-confirm-content">
                    <p>⚠️ Вы уверены, что хотите удалить технологию <strong>"{technology.title}"</strong>?</p>
                    <p>Это действие нельзя отменить. Будут удалены:</p>
                    <ul>
                        <li>Вся информация о технологии</li>
                        <li>Статус изучения</li>
                        <li>Заметки и ресурсы</li>
                    </ul>
                    <div className="modal-actions">
                        <button
                            onClick={handleDeleteTechnology}
                            className="btn btn-danger"
                        >
                            🗑️ Да, удалить
                        </button>
                        <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="btn btn-secondary"
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default TechnologyDetail;