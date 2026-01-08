export const saveConfig = async (data) => {
    if (window.electron && window.electron.saveConfig) {
        return await window.electron.saveConfig(data);
    } else {
        // Fallback for browser dev mode
        try {
            localStorage.setItem('user-config', JSON.stringify(data));
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
};

export const loadConfig = async () => {
    if (window.electron && window.electron.loadConfig) {
        return await window.electron.loadConfig();
    } else {
        // Fallback for browser dev mode
        try {
            const data = localStorage.getItem('user-config');
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error(e);
            return null;
        }
    }
};
