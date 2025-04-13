import { useEffect, useState } from "react";
import { IoHeartCircleSharp } from "react-icons/io5";
import { HiSearchCircle } from "react-icons/hi";
import { FaHourglassHalf } from "react-icons/fa";

const GameSearch = ({ onAddGame }) => {
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [myGames, setMyGames] = useState(() => {
    try {
      const savedGames = localStorage.getItem("myGames");
      return savedGames ? JSON.parse(savedGames) : [];
    } catch (error) {
      console.error("An error occurred during the loading of LocaleStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    onAddGame(myGames);
  }, [myGames, onAddGame]);

  const handleSearch = async () => {
    if (searchTerm.length < 1) {
      setError("At least one letter required!");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/games?search=${encodeURIComponent(searchTerm)}`
      );

      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error("An error occurred during the search progress.");
      }

      const data = await response.json();

      const processedGames = data.map((game) => ({
        id: game.id,
        name: game.name,
        releaseDate: game.release,
        image: game.cover,
        platforms: game.platforms?.join(", ") || "N/A",
        metacritic: game.metacritic,
        description: game.description,
      }));

      setGames(processedGames);
    } catch (err) {
      console.error("An error occurred during the search progress:", err);
      setError(err.message);
      setGames([]);
    } finally {
      setIsLoading(false);
    }
  };

  const followGame = (game) => {
    const isGameSaved = myGames.some((savedGame) => savedGame.id === game.id);
    let updatedGames;

    if (isGameSaved) {
      updatedGames = myGames.filter((savedGame) => savedGame.id !== game.id);
    } else {
      updatedGames = [...myGames, game];
    }

    setMyGames(updatedGames);
    localStorage.setItem("myGames", JSON.stringify(updatedGames));
    onAddGame(updatedGames);
  };

  return (
    <div className="bg-matte-black min-h-screen flex flex-col font-mono mobile-search-container">
      <div className="search-bar container mx-auto p-4 flex-shrink-0">
        <h1 className="text-3xl font-bold text-crimson mb-6 text-center">
          Game Library
        </h1>
        <div className="flex justify-center">
          <form
            className="search-bar-form flex gap-4 mb-8"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <input
              type="text"
              value={searchTerm}
              className="search-bar-input"
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Games..."
            />
            <button
              type="submit"
              disabled={loading}
              className="px-2 py-2 text-crimson hover:text-orange-600 transition-colors disabled:text-red-700 disabled:cursor-not-allowed"
            >
              {loading ? (
                <FaHourglassHalf size="30" className="animate-spin"/>
              ) : (
                <HiSearchCircle size="30" />
              )}
            </button>
          </form>
        </div>
        {error && (
          <p className="text-crimson mb-6 flex justify-center">{error}</p>
        )}
      </div>

      <div
        className="games-list container mx-auto p-4 flex-1"
        style={{
          overflowY: games.length > 0 ? "auto" : "visible",
          maxHeight: games.length > 0 ? "calc(100vh - 200px)" : "none",
          scrollbarWidth: "thin",
          scrollbarColor: "#4a5568 #2d3748",
        }}
      >
        {games.length > 0 ? (
          games.map((game, index) => (
            <div key={game.id}>
              <div className="bg-custom-dark-purple p-4 rounded-2xl shadow-lg drop-shadow-xl relative">
                <div className="absolute top-6 right-16 z-10">
                  <button
                    onClick={() => followGame(game)}
                    className="transition-all duration-300 hover:scale-110"
                  >
                    <IoHeartCircleSharp
                      size={32}
                      className={
                        myGames.some((savedGame) => savedGame.id === game.id)
                          ? "text-crimson animate-heartbeat"
                          : "text-white"
                      }
                    />
                  </button>
                </div>
                <div className="flex gap-6">
                  {game.image && (
                    <img
                      src={game.image}
                      alt={game.name}
                      className="w-40 h-52 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {game.name}
                    </h2>
                    <div className="text-gray-300 text-sm space-y-1">
                      <p>
                        <strong>Release:</strong> {game.releaseDate}
                      </p>
                      <p>
                        <strong>Platforms:</strong> {game.platforms}
                      </p>
                      <p>
                        <strong>Metacritic:</strong> {game.metacritic}
                      </p>
                      <p>
                        <strong>Description:</strong> {game.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {index < games.length - 1 && (
                <div className="border-b border-custom-onyx-black my-5"></div>
              )}
            </div>
          ))
        ) : (
          <p
            className={`text-center col-span-full ${
              searchTerm ? "text-red-500" : "typewriter text-gray-400"
            }`}
          >
            {loading
              ? "Search in progress..."
              : searchTerm
              ? "Game not found!"
              : "Search for a game you would like to check!"}
          </p>
        )}
      </div>
    </div>
  );
};

export default GameSearch;
