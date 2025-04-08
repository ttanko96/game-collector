import { useEffect, useState } from 'react';
import { HiSearchCircle } from "react-icons/hi";
import { FaHourglassHalf  } from "react-icons/fa";

const GameSearch = ({ onAddGame }) => {
  const [games, setGames] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [myGames, setMyGames] = useState(() => {
    try {
      const savedGames = localStorage.getItem('myGames');
      return savedGames ? JSON.parse(savedGames) : [];
    } catch (error) {
      console.error('Hiba a localStorage betöltésekor:', error);
      return [];
    }
  });

  useEffect(() => {
    onAddGame(myGames);
  }, [myGames]);

  const handleSearch = async () => {
    if (searchTerm.length < 1) {
      setError('Legalább 1 karakter szükséges');
      return;
    };
  
    setIsLoading(true);
    setError(null);
  
    try {
      const response = await fetch(`/api/games?search=${encodeURIComponent(searchTerm)}`);
      
      console.log('Válasz státusz:', response.status);
      if (!response.ok) {
        throw new Error('Hiba a keresés során');
      }
  
      const data = await response.json();

      const processedGames = data.map(game => ({
        id: game.id,
        name: game.name,
        releaseDate: game.release,
        image: game.cover,
        rating: game.rating,
        platforms: game.platforms?.join(', ') || 'N/A',
        metacritic: game.metacritic,
        description: game.description
      }));
  
      setGames(processedGames);
  
    } catch (err) {
      console.error('Hiba a keresés során:', err);
      setError(err.message);
      setGames([]);
    } finally {
      setIsLoading(false);
    }
  };

  const followGame = (game) => {
    const isGameSaved = myGames.some(savedGame => savedGame.id === game.id);
    let updatedGames;
  
    if (isGameSaved) {
      updatedGames = myGames.filter(savedGame => savedGame.id !== game.id);
    } else {
      updatedGames = [...myGames, game];
    }
  
    setMyGames(updatedGames);
    localStorage.setItem('myGames', JSON.stringify(updatedGames));
    onAddGame(updatedGames);
  }

  const SearchIcon = ({ icon }) =>
    <div>
        {icon}
    </div>

  return (
    <div className='bg-matte-black min-h-screen flex flex-col font-mono'>
      <div className='search-bar container mx-auto p-4 flex-shrink-0'>
          <h1 className='text-3xl font-bold text-red-500 mb-6 text-center'>Játékkönyvtár</h1>
            <div className='flex justify-center'>
            <form className='search-bar-form flex gap-4 mb-8' onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}>
              <input
                type="text"
                value={searchTerm}
                className="search-bar-input"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Játékok keresése..."
              />
              <button 
                type="submit" 
                disabled={loading}
                className="px-2 py-2 text-red-700 hover:text-orange-600 transition-colors disabled:text-red-700 disabled:cursor-not-allowed"
              >
                {loading ? <SearchIcon icon={<FaHourglassHalf size='30'/>} /> : <SearchIcon icon={<HiSearchCircle size='30'/>} />
                }
              </button>
            </form>
            </div>
        {error && <p className="text-red-500 mb-6 flex justify-center">{error}</p>}
      </div>
  
      <div className="games-list container mx-auto p-4 flex-1" style={{
        overflowY: games.length > 0 ? 'auto' : 'visible',
        maxHeight: games.length > 0 ? 'calc(100vh - 200px)' : 'none',
        scrollbarWidth: 'thin',
        scrollbarColor: '#4a5568 #2d3748'
      }}>
        <style>
          {`
            .games-list::-webkit-scrollbar {
              width: 8px;
            }
            .games-list::-webkit-scrollbar-track {
              background: #2d3748;
              border-radius: 4px;
            }
            .games-list::-webkit-scrollbar-thumb {
              background: #4a5568;
              border-radius: 4px;
            }
            .games-list::-webkit-scrollbar-thumb:hover {
              background: #718096;
            }
          `}
        </style>
        {games.length > 0 ? (
          games.map((game, index) => (
            <div key={game.id}>
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <div className="flex gap-4">
                  {game.image && (
                    <img 
                      src={game.image} 
                      alt={game.name}
                      className="w-24 h-32 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white mb-2">{game.name}</h2>
                    <button 
                      onClick={() => followGame(game)}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mb-2 text-sm"
                    >
                      {myGames.some(savedGame => savedGame.id === game.id) ? 'Unfollow' : 'Follow'}
                    </button>
                    <div className="text-gray-300 text-sm space-y-1">
                      <p><strong>Release:</strong> {game.releaseDate}</p>
                      <p><strong>Rating:</strong> {game.rating}</p>
                      <p><strong>Platforms:</strong> {game.platforms}</p>
                      <p><strong>Metacritic:</strong> {game.metacritic}</p>
                      <p className="multi-line-truncate" title={game.description}>
                        <strong>Description:</strong> {game.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {index < games.length - 1 && (
                <div className="border-b border-gray-600 my-4"></div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center col-span-full">No games found</p>
        )}
      </div>
    </div>
  );
}

export default GameSearch;