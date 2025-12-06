import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import DataImportExport from '../components/DataImportExport';
import { useTechnologies } from '../contexts/TechnologyContext';
import { useNotification } from '../contexts/NotificationContext';
import './Settings.css';

function Settings() {
    const { technologies, resetAllData } = useTechnologies();
    const { showNotification } = useNotification();
    const [settings, setSettings] = useState({});
    const [showImportModal, setShowImportModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showResetModal, setShowResetModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedSettings = localStorage.getItem('appSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    const handleExportData = () => {
        try {
            // Export full app backup with technologies and settings
            const exportData = {
                technologies: technologies,
                settings: settings,
                exportDate: new Date().toISOString(),
                version: '1.0'
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `technology-tracker-backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            showNotification('Резервная копия успешно экспортирована!', 'info');
        } catch (error) {
            alert('Ошибка экспорта данных');
            console.error('Ошибка экспорта:', error);
        }
    };

    const handleFileSelect = (file) => {
        if (file && file.type === 'application/json') {
            setSelectedFile(file);
        } else {
            alert('❌ Пожалуйста, выберите файл в формате JSON');
        }
    };

    const handleImportData = () => {
        if (!selectedFile) {
            alert('❌ Пожалуйста, выберите файл для импорта');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsedData = JSON.parse(e.target.result);

                // Handle both old format (array) and new format (object with technologies)
                let technologiesToImport = [];
                let settingsToImport = {};

                if (Array.isArray(parsedData)) {
                    // Old format: just an array of technologies
                    technologiesToImport = parsedData;
                    console.log('Importing old format (technologies array)');
                } else if (parsedData.technologies && Array.isArray(parsedData.technologies)) {
                    // New format: full backup with technologies and settings
                    technologiesToImport = parsedData.technologies;
                    settingsToImport = parsedData.settings || {};
                    console.log('Importing new format (full backup)');
                } else {
                    alert('❌ Некорректный формат данных. Ожидается массив технологий или объект с полем "technologies"');
                    return;
                }

                // Validate that we have technologies to import
                if (technologiesToImport.length === 0) {
                    alert('❌ В файле нет технологий для импорта');
                    return;
                }

                // Save to localStorage
                localStorage.setItem('technologies', JSON.stringify(technologiesToImport));

                if (Object.keys(settingsToImport).length > 0) {
                    localStorage.setItem('appSettings', JSON.stringify(settingsToImport));
                }

                // Удаляем флаг сброса данных, чтобы данные загрузились
                localStorage.removeItem('dataReset');

                showNotification(`Данные успешно импортированы! (${technologiesToImport.length} технологий)`, 'success');
                setShowImportModal(false);
                setSelectedFile(null);
                window.location.reload();

            } catch (error) {
                showNotification('Ошибка при импорте данных: ' + error.message, 'error');
                console.error('Import error:', error);
            }
        };
        reader.readAsText(selectedFile);
    };

    const handleResetData = () => {
        // Удаляем ВСЕ данные приложения
        localStorage.removeItem('technologies');
        localStorage.removeItem('appSettings');

        // Сбрасываем состояние в контексте
        resetAllData();

        showNotification('Все данные приложения сброшены!', 'warning');
        setShowResetModal(false);

        // Перенаправляем на главную страницу
        navigate('/', { replace: true });
    };

    return (
        <div className="settings-page">
            <div className="page-header">
                <h1>⚙️ Настройки приложения</h1>
                <button onClick={() => navigate('/')} className="btn btn-primary back-btn">
                    ← На главную
                </button>
            </div>

            <div className="settings-container">
                <div className="settings-section">
                    <h2>Управление данными</h2>
                    <div className="data-management">
                        <button onClick={handleExportData} className="btn btn-success">
                            📤 Экспорт всех данных
                        </button>
                        <button onClick={() => setShowImportModal(true)} className="btn btn-info">
                            📥 Импорт данных
                        </button>
                        <button onClick={() => setShowResetModal(true)} className="btn btn-warning">
                            🗑️ Сбросить все данные
                        </button>
                    </div>

                    <div className="localStorage-section">
                        <DataImportExport />
                    </div>
                    <div className="data-info">
                        <p>Всего технологий в базе: <strong>{technologies.length}</strong></p>
                        <p>Изучено: <strong>{technologies.filter(t => t.status === 'completed').length}</strong></p>
                        <p>В процессе: <strong>{technologies.filter(t => t.status === 'in-progress').length}</strong></p>
                    </div>

                </div>

            </div>

            <Modal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
                title="Импорт данных"
            >
                <div className="import-modal-content">
                    <p>Выберите JSON-файл для импорта или перетащите его сюда:</p>
                    <div
                        className={`file-drop-zone ${selectedFile ? 'file-selected' : ''}`}
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const files = e.dataTransfer.files;
                            if (files.length > 0) {
                                handleFileSelect(files[0]);
                            }
                        }}
                    >
                        {selectedFile ? (
                            <div className="file-info">
                                <span className="file-icon">📄</span>
                                <span className="file-name">{selectedFile.name}</span>
                                <span className="file-size">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                            </div>
                        ) : (
                            <div className="drop-placeholder">
                                <span className="drop-icon">📂</span>
                                <p>Перетащите JSON-файл сюда или нажмите "Выбрать файл"</p>
                            </div>
                        )}
                        <input
                            type="file"
                            accept=".json"
                            onChange={(e) => handleFileSelect(e.target.files[0])}
                            style={{ display: 'none' }}
                            id="file-input"
                        />
                        <label htmlFor="file-input" className="btn btn-secondary file-select-btn">
                            Выбрать файл
                        </label>
                    </div>
                    <div className="modal-actions">
                        <button onClick={handleImportData} className="btn btn-success" disabled={!selectedFile}>
                            Импортировать
                        </button>
                        <button onClick={() => { setShowImportModal(false); setSelectedFile(null); }} className="btn btn-secondary">
                            Отмена
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={showResetModal}
                onClose={() => setShowResetModal(false)}
                title="Сброс всех данных"
            >
                <div className="reset-modal-content">
                    <p>⚠️ Внимание!</p>
                    <p>Вы собираетесь удалить ВСЕ данные приложения:</p>
                    <ul>
                        <li>Все технологии ({technologies.length} записей)</li>
                        <li>Все заметки и статусы</li>
                        <li>Все настройки приложения</li>
                    </ul>
                    <p className="warning-note">
                        🔄 После сброса вы будете перенаправлены на главную страницу.
                    </p>
                    <p>Это действие нельзя отменить!</p>
                    <div className="modal-actions">
                        <button onClick={handleResetData} className="btn btn-danger">
                            Да, сбросить все
                        </button>
                        <button onClick={() => setShowResetModal(false)} className="btn btn-secondary">
                            Отмена
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default Settings;