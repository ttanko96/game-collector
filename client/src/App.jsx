import { useState, useEffect  } from 'react';
import GameTracker from './components/GameTracker';
import GameSearch from './components/GameSearch';
import SideBar from './components/SideBar';

function App() {
  const [myGames, setMyGames] = useState(() => {
    const savedGames = localStorage.getItem('myGames');
    return savedGames ? JSON.parse(savedGames) : [];
  });
  const [currentPage, setCurrentPage] = useState('search');

  const renderPage = () => {
    switch (currentPage) {
      case 'search':
        return <GameSearch onAddGame={addGame}/>;
      case 'tracker':
        return <GameTracker items={myGames} onResetGames={handleResetGames}/>;
      default:
        return <GameSearch onAddGame={addGame}/>;
    }
  }

  const handleResetGames = (newList) => {
    setMyGames(newList);
    localStorage.setItem('myGames', JSON.stringify(newList));
  };

  useEffect(() => {
    localStorage.setItem('myGames', JSON.stringify(myGames));
  }, [myGames]);

  const addGame = (updatedGames) => {
    setMyGames(updatedGames);
  };

  return (
    <div>
      <SideBar onNavigate={setCurrentPage} currentPage={currentPage} />
      <div>
        {renderPage()}
      </div>
    </div>
  );
};

export default App;
