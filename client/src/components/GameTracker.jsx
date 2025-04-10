import { HiArrowCircleLeft, HiArrowCircleRight } from "react-icons/hi";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const GameTracker = ({ items, onResetGames }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [sortAlphabetically, setSortAlphabetically] = useState(false);
  const carouselRef = useRef(null);
  const prevBtnRef = useRef(null);
  const nextBtnRef = useRef(null);
  const [selectedGame, setSelectedGame] = useState(null);

  const getStatistics = () => {
    const totalGames = items.length;
    const completedGames = items.filter((game) => game.completed).length;
    const platinumGames = items.filter((game) => game.platinum).length;
    const platformCounts = {};
    items.forEach((game) => {
      if (game.selectedPlatforms) {
        game.selectedPlatforms.forEach((platform) => {
          platformCounts[platform] = (platformCounts[platform] || 0) + 1;
        });
      }
    });

    return {
      totalGames,
      completedGames,
      platinumGames,
      platformCounts,
    };
  };

  const statistics = getStatistics();

  const totalGamesData = {
    labels: ["Total Games"],
    datasets: [
      {
        label: "Games",
        data: [statistics.totalGames],
        backgroundColor: ["rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const completionData = {
    labels: ["Completed", "In Progress"],
    datasets: [
      {
        label: "Summary",
        data: [statistics.completedGames],
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const platinumData = {
    labels: ["Platinum trophy earned", "No Platinum yet"],
    datasets: [
      {
        label: "Summary",
        data: [
          statistics.platinumGames,
          statistics.totalGames - statistics.platinumGames,
        ],
        backgroundColor: [
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: ["rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const platformData = {
    labels: Object.keys(statistics.platformCounts),
    datasets: [
      {
        label: "Platform Distribution",
        data: Object.values(statistics.platformCounts),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  const handleReset = () => {
    if (window.confirm("Are you sue?")) {
      onResetGames([]);
    }
  };

  const displayedItems = sortAlphabetically
    ? [...items].sort((a, b) => a.name.localeCompare(b.name))
    : items;

  useEffect(() => {
    const updatePosition = () => {
      if (!carouselRef.current) return;

      const slideWidth = carouselRef.current.children[0]?.offsetWidth;
      if (!slideWidth) return;

      const itemGap = 24;
      const offset = -startIndex * (slideWidth + itemGap);
      carouselRef.current.style.transform = `translateX(${offset}px)`;
    };

    const updateButtons = () => {
      if (!prevBtnRef.current || !nextBtnRef.current) return;

      prevBtnRef.current.style.opacity = startIndex === 0 ? "0" : "1";
      prevBtnRef.current.style.visibility =
        startIndex === 0 ? "hidden" : "visible";
      nextBtnRef.current.style.opacity =
        startIndex >= items.length - 4 ? "0" : "1";
      nextBtnRef.current.style.visibility =
        startIndex >= items.length - 4 ? "hidden" : "visible";
    };

    updatePosition();
    updateButtons();
  }, [startIndex]);

  const shiftRight = () => {
    if (startIndex < items.length - 4) {
      setStartIndex((index) => index + 1);
    }
  };

  const shiftLeft = () => {
    if (startIndex > 0) {
      setStartIndex((index) => index - 1);
    }
  };

  return (
    <div className="grid grid-rows-[auto_auto] gap-8 py-20 items-center justify-center w-screen h-screen bg-matte-black">
      <button
        onClick={handleReset}
        className="mb-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 "
      >
        Reset Game List
      </button>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={sortAlphabetically}
          onChange={() => setSortAlphabetically(!sortAlphabetically)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
      </label>
      <div className="flex items-center">
        <button
          ref={prevBtnRef}
          onClick={shiftLeft}
          className="p-2 rounded-full mr-2 text-crimson hover:text-orange-500"
        >
          <HiArrowCircleLeft size="50" />
        </button>

        <div className="carousel-container">
          <div ref={carouselRef} className="carousel-track flex">
            {displayedItems.map((game) => (
              <div
                key={game.id}
                className="carousel-item cursor-pointer"
                onClick={() => handleGameClick(game)}
              >
                {" "}
                <img
                  className="carousel-item"
                  src={game.image}
                  alt={game.name}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          ref={nextBtnRef}
          onClick={shiftRight}
          className="p-2 rounded-full mr-2 text-crimson hover:text-orange-500"
        >
          <HiArrowCircleRight size="50" />
        </button>
      </div>

    {/* Statistics Section */}
    <div className="mt-8 grid grid-cols-4 gap-4">
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-white text-center mb-2">Total Games</h3>
        <div className="w-48 h-48 mx-auto">
          <Pie data={totalGamesData} />
        </div>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-white text-center mb-2">Completion Status</h3>
        <div className="w-48 h-48 mx-auto">
          <Pie data={completionData} />
        </div>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-white text-center mb-2">Platinum Status</h3>
        <div className="w-48 h-48 mx-auto">
          <Pie data={platinumData} />
        </div>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-white text-center mb-2">Platform Distribution</h3>
        <div className="w-48 h-48 mx-auto">
          <Pie data={platformData} />
        </div>
      </div>
    </div>

      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="bg-custom-dark-purple rounded-xl max-w-md w-full overflow-hidden relative"
            >
              <div className="relative">
                <img
                  src={selectedGame.image}
                  className="w-full h-64 object-cover brightness-50 blur-sm "
                />
                <img
                  src={selectedGame.image}
                  className=" w-full h-64 object-contain absolute top-0 left-0 "
                />
              </div>
              <div className="p-4">
                <h2 className="flex justify-center text-white font-mono text-2xl font-bold mb-2">
                  {selectedGame.name}
                </h2>
                <hr className="border-custom-onyx-black mb-4"></hr>
                <div className="flex flex-wrap gap-2 mb-4 justify-center">
                  {selectedGame.platforms?.split(",").map((platform, index) => {
                    const trimmedPlatform = platform.trim();
                    const isSelected =
                      selectedGame.selectedPlatforms?.includes(trimmedPlatform);
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          const currentPlatforms =
                            selectedGame.selectedPlatforms || [];
                          const updatedPlatforms = isSelected
                            ? currentPlatforms.filter(
                                (p) => p !== trimmedPlatform
                              )
                            : [...currentPlatforms, trimmedPlatform];

                          const updated = {
                            ...selectedGame,
                            selectedPlatforms: updatedPlatforms,
                          };
                          setSelectedGame(updated);
                          const updatedItems = items.map((g) =>
                            g.id === selectedGame.id ? updated : g
                          );
                          onResetGames(updatedItems);
                        }}
                        className={`px-3 py-1 rounded-full text-sm transition-colors
                        ${
                          isSelected
                            ? "bg-crimson text-white"
                            : "bg-custom-dark-purple text-gray-100 hover:bg-gray-800"
                        }`}
                      >
                        {trimmedPlatform}
                      </button>
                    );
                  })}
                </div>
                <hr className="border-custom-onyx-black mb-4"></hr>

                <p className="text-sm font-serif font-black text-gray-400 mb-4">
                  {selectedGame.description}
                </p>
                <hr className="border-custom-onyx-black mb-4"></hr>
                <div className="flex justify-evenly">
                  <label className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      checked={selectedGame.completed || false}
                      onChange={(e) => {
                        const updated = {
                          ...selectedGame,
                          completed: e.target.checked,
                        };
                        setSelectedGame(updated);
                        const updatedItems = items.map((g) =>
                          g.id === selectedGame.id ? updated : g
                        );
                        onResetGames(updatedItems);
                      }}
                      className="w-4 h-4"
                    />

                    <span className="text-gray-100">100%-os teljesítés</span>
                  </label>

                  <label className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      checked={selectedGame.platinum || false}
                      onChange={(e) => {
                        const updated = {
                          ...selectedGame,
                          platinum: e.target.checked,
                        };
                        setSelectedGame(updated);
                        const updatedItems = items.map((g) =>
                          g.id === selectedGame.id ? updated : g
                        );
                        onResetGames(updatedItems);
                      }}
                      className="w-4 h-4"
                    />

                    <span className="text-gray-300">Platina</span>
                  </label>
                </div>
                <button
                  onClick={() => setSelectedGame(null)}
                  className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-crimson transition-colors"
                >
                  Bezárás
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameTracker;
