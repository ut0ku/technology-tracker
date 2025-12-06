import { useState, useEffect } from 'react';
import { useTechnologies } from '../contexts/TechnologyContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNotification } from '../contexts/NotificationContext';
import './DataImportExport.css';

function DataImportExport() {
    const { technologies, updateTechnologyStatus } = useTechnologies();
    const { isDarkMode, toggleTheme } = useTheme();
    const { showNotification } = useNotification();
    const [status, setStatus] = useState('');

    // Debug: log when technologies change
    useEffect(() => {
        console.log('Technologies updated, count:', technologies.length);
    }, [technologies]);

    const loadFromLocalStorage = () => {
        try {
            // Load from manual backup instead of main technologies key
            const saved = localStorage.getItem('technologies_manual_backup');

            if (saved) {
                const parsed = JSON.parse(saved);
                console.log('Loading from manual localStorage backup:', parsed);

                let technologiesToLoad = [];
                let themeToLoad = null;

                // Handle both old format (array) and new format (object with technologies and theme)
                if (Array.isArray(parsed)) {
                    // Old format: just an array of technologies
                    technologiesToLoad = parsed;
                    console.log(`Loading ${parsed.length} technologies from old format backup`);
                } else if (parsed.technologies && Array.isArray(parsed.technologies)) {
                    // New format: object with technologies and theme
                    technologiesToLoad = parsed.technologies;
                    themeToLoad = parsed.theme;
                    console.log(`Loading ${technologiesToLoad.length} technologies and theme "${themeToLoad}" from new format backup`);
                } else {
                    showNotification('Некорректный формат данных в localStorage', 'error');
                    setStatus('Некорректный формат данных в localStorage');
                    setTimeout(() => setStatus(''), 3000);
                    return;
                }

                // Load theme if present
                if (themeToLoad) {
                    const shouldBeDark = themeToLoad === 'dark';
                    if (shouldBeDark !== isDarkMode) {
                        console.log(`Switching theme from ${isDarkMode ? 'dark' : 'light'} to ${themeToLoad}`);
                        toggleTheme();
                    }
                }

                // Update each technology individually using the existing update function
                const updatePromises = technologiesToLoad.map(async (tech) => {
                    try {
                        // Find current technology with same ID
                        const currentTech = technologies.find(t => t.id === tech.id);
                        if (currentTech && currentTech.status !== tech.status) {
                            await updateTechnologyStatus(tech.id, tech.status);
                        }
                    } catch (error) {
                        console.error(`Error updating ${tech.title}:`, error);
                    }
                });

                // Wait for all updates to complete
                Promise.all(updatePromises).then(() => {
                    const message = themeToLoad
                        ? `Данные и тема "${themeToLoad}" загружены из localStorage`
                        : 'Данные загружены из localStorage (резервная копия)';
                    showNotification(message, 'success');
                    setStatus(message);
                    setTimeout(() => setStatus(''), 3000);
                }).catch((error) => {
                    setStatus('Ошибка при обновлении данных');
                    setTimeout(() => setStatus(''), 3000);
                });
            } else {
                showNotification('Резервная копия в localStorage не найдена', 'warning');
                setStatus('Резервная копия в localStorage не найдена');
                setTimeout(() => setStatus(''), 3000);
            }
        } catch (error) {
            showNotification('Ошибка загрузки данных из localStorage', 'error');
            setStatus('Ошибка загрузки данных из localStorage');
            console.error('Ошибка загрузки:', error);
        }
    };

    const saveToLocalStorage = () => {
        try {
            console.log('Saving to manual localStorage backup...');
            const backupData = {
                technologies: technologies,
                theme: isDarkMode ? 'dark' : 'light',
                savedAt: new Date().toISOString()
            };
            console.log('Data to save:', backupData);
            const jsonData = JSON.stringify(backupData);
            console.log('JSON data:', jsonData);

            // Use a separate key for manual saves to avoid conflict with automatic saving
            localStorage.setItem('technologies_manual_backup', jsonData);
            console.log('Data saved successfully to manual backup');

            // Verify it was saved
            const verify = localStorage.getItem('technologies_manual_backup');
            console.log('Verification - manual backup exists:', verify ? 'yes' : 'no');

            showNotification('Данные и тема сохранены в localStorage!', 'info');
            setStatus('Данные и тема сохранены в localStorage (резервная копия)');
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            showNotification('Ошибка сохранения данных', 'error');
            setStatus('Ошибка сохранения данных');
            console.error('Ошибка сохранения:', error);
            console.error('Error details:', error.message, error.stack);
        }
    };

    const exportToJSON = () => {
        try {
            const dataStr = JSON.stringify(technologies, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `technologies_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            setStatus('Данные экспортированы в JSON');
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            setStatus('Ошибка экспорта данных');
            console.error('Ошибка экспорта:', error);
        }
    };


    return (
        <div className="data-import-export">
            {status && (
                <div className="status-message">
                    {status}
                </div>
            )}

            <div className="localStorage-controls">
                <button onClick={saveToLocalStorage} disabled={technologies.length === 0}>
                    Сохранить в localStorage
                </button>

                <button onClick={loadFromLocalStorage}>
                    Загрузить из localStorage
                </button>
            </div>
        </div>
    );
}

export default DataImportExport;