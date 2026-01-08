import React, { useState, useEffect } from 'react';
import TitleBar from './components/TitleBar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SettingsModal from './components/SettingsModal';
import ContextMenu from './components/ContextMenu';
import AddCategoryModal from './components/AddCategoryModal';
import RenameCategoryModal from './components/RenameCategoryModal';
import RenameItemModal from './components/RenameItemModal';
import PropertiesModal from './components/PropertiesModal';
import AIAssistant from './components/AIAssistant';
import { useTranslation } from 'react-i18next';
import { loadConfig, saveConfig } from './utils/storage';
import './App.css';

// Mock initial data as fallback
const INITIAL_CATEGORIES = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'apps', label: 'Applications', icon: 'apps' },
  { id: 'games', label: 'Games', icon: 'games' },
  { id: 'docs', label: 'Documents', icon: 'folder' },
  { id: 'ai', label: 'AI Assistant', icon: 'bot', special: true },
];

const INITIAL_ITEMS = {
  home: [],
  apps: [],
  games: [],
  docs: [],
  ai: [],
};

function App() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [activeCategory, setActiveCategory] = useState('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('win11');
  const [contextMenu, setContextMenu] = useState(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [renameCategoryData, setRenameCategoryData] = useState(null);
  const [renameItemData, setRenameItemData] = useState(null);
  const [clipboard, setClipboard] = useState(null);
  const [showProperties, setShowProperties] = useState(null);
  const [apiSettings, setApiSettings] = useState({});

  // Load config on mount
  useEffect(() => {
    const loadData = async () => {
      const config = await loadConfig();
      if (config) {
        // Ensure AI category exists even in old configs
        let loadedCategories = config.categories || INITIAL_CATEGORIES;
        if (!loadedCategories.find(c => c.id === 'ai')) {
          loadedCategories = [...loadedCategories, { id: 'ai', label: 'AI Assistant', icon: 'bot', special: true }];
        }

        // Ensure AI items array exists
        let loadedItems = config.items || INITIAL_ITEMS;
        if (!loadedItems.ai) {
          loadedItems = { ...loadedItems, ai: [] };
        }

        setCategories(loadedCategories);
        setItems(loadedItems);
        if (config.theme) setCurrentTheme(config.theme);
        if (config.aiSettings) setApiSettings(config.aiSettings);
      }
      setIsLoaded(true);
    };
    loadData();
  }, []);

  // Update theme on body
  useEffect(() => {
    // Remove all theme classes
    document.body.classList.remove('theme-win11', 'theme-winxp', 'theme-win7', 'theme-win8', 'theme-win2000', 'theme-linux', 'theme-kali');
    // Add current theme
    if (currentTheme !== 'win11') {
      document.body.classList.add(`theme-${currentTheme}`);
    }
  }, [currentTheme]);

  // Save config when data changes
  useEffect(() => {
    if (isLoaded) {
      saveConfig({ categories, items, theme: currentTheme });
    }
  }, [categories, items, currentTheme, isLoaded]);

  const handleAddItem = async () => {
    const filePaths = await window.electron?.openFileDialog();
    if (filePaths && filePaths.length > 0) {
      const newItems = await Promise.all(filePaths.map(async (filePath) => {
        const iconData = await window.electron?.getFileIcon(filePath);
        return {
          id: Date.now() + Math.random(),
          name: filePath.split('\\').pop().split('/').pop(),
          path: filePath,
          icon: '',
          iconData: iconData
        };
      }));

      setItems(prev => ({
        ...prev,
        [activeCategory]: [...prev[activeCategory], ...newItems]
      }));
    }
  };

  const handleAddFolder = async () => {
    const folderPath = await window.electron?.openFolderDialog();
    if (folderPath) {
      const files = await window.electron?.scanFolder(folderPath);
      if (files && files.length > 0) {
        const newItems = await Promise.all(files.map(async (filePath) => {
          const iconData = await window.electron?.getFileIcon(filePath);
          return {
            id: Date.now() + Math.random(),
            name: filePath.split('\\').pop().split('/').pop(),
            path: filePath,
            icon: '',
            iconData: iconData
          };
        }));

        setItems(prev => ({
          ...prev,
          [activeCategory]: [...prev[activeCategory], ...newItems]
        }));
      }
    }
  };

  const handleAddCategory = (categoryName) => {
    if (categoryName && categoryName.trim()) {
      const newCategory = {
        id: 'cat_' + Date.now(),
        label: categoryName.trim(),
        icon: 'folder'
      };
      setCategories(prev => [...prev, newCategory]);
      setItems(prev => ({
        ...prev,
        [newCategory.id]: []
      }));
    }
  };

  const handleRenameCategory = (categoryId, newName) => {
    setCategories(prev => prev.map(cat =>
      cat.id === categoryId ? { ...cat, label: newName } : cat
    ));
  };

  const handleRenameItem = (itemId, newName) => {
    setItems(prev => ({
      ...prev,
      [activeCategory]: prev[activeCategory].map(item =>
        item.id === itemId ? { ...item, name: newName } : item
      )
    }));
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const newItems = await Promise.all(files.map(async (file) => {
        const iconData = await window.electron?.getFileIcon(file.path);
        return {
          id: Date.now() + Math.random(),
          name: file.name,
          path: file.path,
          icon: file.path,
          iconData: iconData
        };
      }));

      setItems(prev => ({
        ...prev,
        [activeCategory]: [...prev[activeCategory], ...newItems]
      }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Required to allow drop
  };

  const handleDeleteItem = (itemId) => {
    setItems(prev => ({
      ...prev,
      [activeCategory]: prev[activeCategory].filter(i => i.id !== itemId)
    }));
  };

  const handleLaunchItem = async (item) => {
    if (item.path) {
      const result = await window.electron?.openPath(item.path);
      if (result && !result.success) {
        alert(`Failed to open: ${result.error}`);
      }
    }
  };

  const handleOpenAsAdmin = async (item) => {
    if (item.path) {
      const result = await window.electron?.openAsAdmin(item.path);
      if (result && !result.success) {
        alert(`Failed to run as admin: ${result.error}`);
      }
    }
  };

  const handleShowInFolder = async (item) => {
    if (item.path) {
      await window.electron?.showInFolder(item.path);
    }
  };

  const handleCopy = (item) => {
    setClipboard(item);
  };

  const handlePaste = () => {
    if (clipboard) {
      const newItem = {
        ...clipboard,
        id: Date.now() + Math.random()
      };
      setItems(prev => ({
        ...prev,
        [activeCategory]: [...prev[activeCategory], newItem]
      }));
    }
  };

  const handleProperties = (item) => {
    setShowProperties(item);
  };

  const handleContextMenu = (e, type, item) => {
    e.preventDefault();
    const x = e.pageX;
    const y = e.pageY;

    let options = [];

    if (type === 'item') {
      options = [
        { label: t('contextMenu.open'), onClick: () => handleLaunchItem(item) },
        { label: t('contextMenu.openAsAdmin'), onClick: () => handleOpenAsAdmin(item) },
        { label: t('contextMenu.showInFolder'), onClick: () => handleShowInFolder(item) },
        { label: t('contextMenu.copy'), onClick: () => handleCopy(item) },
        { label: t('contextMenu.rename'), onClick: () => setRenameItemData({ id: item.id, name: item.name }) },
        { label: t('contextMenu.properties'), onClick: () => handleProperties(item) },
        { label: t('contextMenu.delete'), onClick: () => handleDeleteItem(item.id) },
      ];
    } else {
      options = [
        { label: t('contextMenu.addItem'), onClick: handleAddItem },
        { label: t('contextMenu.importFolder'), onClick: handleAddFolder },
      ];
      if (clipboard) {
        options.push({ label: t('contextMenu.paste'), onClick: handlePaste });
      }
      options.push({ label: t('contextMenu.settings'), onClick: () => setIsSettingsOpen(true) });
    }

    setContextMenu({ x, y, options });
  };

  const handleCategoryContextMenu = (e, category) => {
    e.preventDefault();
    e.stopPropagation();
    const x = e.pageX;
    const y = e.pageY;

    const options = [
      { label: t('contextMenu.renameCategory'), onClick: () => setRenameCategoryData({ id: category.id, name: category.label }) },
    ];

    setContextMenu({ x, y, options });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  // Filter items based on search query
  const filteredItems = (items[activeCategory] || []).filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container" onClick={handleCloseContextMenu}>
      <TitleBar />
      <div className="main-content">
        <Sidebar
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onAddCategory={() => setIsAddCategoryOpen(true)}
          onCategoryContextMenu={handleCategoryContextMenu}
        />
        {activeCategory === 'ai' ? (
          <AIAssistant apiSettings={apiSettings} />
        ) : (
          <Dashboard
            category={categories.find(c => c.id === activeCategory)}
            items={filteredItems}
            onAddItem={handleAddItem}
            onContextMenu={handleContextMenu}
            onLaunchItem={handleLaunchItem}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        apiSettings={apiSettings}
        onApiSettingsChange={setApiSettings}
      />
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          options={contextMenu.options}
          onClose={handleCloseContextMenu}
        />
      )}
      <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onAdd={handleAddCategory}
      />
      <RenameCategoryModal
        isOpen={renameCategoryData !== null}
        onClose={() => setRenameCategoryData(null)}
        onRename={(newName) => {
          if (renameCategoryData) {
            handleRenameCategory(renameCategoryData.id, newName);
          }
        }}
        currentName={renameCategoryData?.name}
      />
      <RenameItemModal
        isOpen={renameItemData !== null}
        onClose={() => setRenameItemData(null)}
        onRename={(newName) => {
          if (renameItemData) {
            handleRenameItem(renameItemData.id, newName);
          }
        }}
        currentName={renameItemData?.name}
      />
      <PropertiesModal
        isOpen={showProperties !== null}
        onClose={() => setShowProperties(null)}
        item={showProperties}
      />
    </div>
  );
}

export default App;
