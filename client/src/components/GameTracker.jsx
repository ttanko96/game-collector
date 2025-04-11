import { HiArrowCircleLeft, HiArrowCircleRight } from "react-icons/hi";
import { FaTrash, FaTrophy, FaStar } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const GameTracker = ({ items, onResetGames }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [sortType, setSortType] = useState("alphabetical");
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState("all");
  const carouselRef = useRef(null);
  const prevBtnRef = useRef(null);
  const nextBtnRef = useRef(null);
  const [selectedGame, setSelectedGame] = useState(null);

  const getStatistics = () => {
    const totalGames = items.length;
    const completedGames = items.filter((game) => game.completed).length;
    const inProgressGames = items.filter((game) => !game.completed).length;
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
      inProgressGames,
      platinumGames,
      platformCounts,
    };
  };

  const statistics = getStatistics();

  const completionData = {
    labels: ["Completed", "In Progress"],
    datasets: [
      {
        label: "",
        data: [statistics.completedGames, statistics.inProgressGames],
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const platinumData = {
    labels: ["Platinum Trophy earned", "No Platinum yet"],
    datasets: [
      {
        label: "",
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
        label: "",
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

  const getUniquePlatforms = () => {
    const platforms = new Set();
    items.forEach((game) => {
      if (game.selectedPlatforms) {
        game.selectedPlatforms.forEach((platform) => platforms.add(platform));
      }
    });
    return ["all", ...Array.from(platforms).sort()];
  };

  const displayedItems = items
    .filter(
      (game) =>
        selectedPlatformFilter === "all" ||
        (game.selectedPlatforms &&
          game.selectedPlatforms.includes(selectedPlatformFilter))
    )
    .sort((a, b) => {
      switch (sortType) {
        case "alphabetical":
          return a.name.localeCompare(b.name);
        case "reverse-alphabetical":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

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
  }, [startIndex, items.length]);

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
      <div className="flex justify-evenly">
        <div className="flex items-center gap-2">
          <label className="text-gray-100 font-mono">Sort by:</label>
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="bg-custom-dark-purple text-gray-100 p-2 rounded font-mono"
          >
            <option value="default">Date of Tracking</option>
            <option value="alphabetical">A-Z</option>
            <option value="reverse-alphabetical">Z-A</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-gray-100 font-mono">Filter by platform:</label>
          <select
            value={selectedPlatformFilter}
            onChange={(e) => setSelectedPlatformFilter(e.target.value)}
            className="bg-custom-dark-purple text-gray-100 p-2 rounded"
          >
            {getUniquePlatforms().map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </div>
      </div>
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
                className="carousel-item border-2 border-gray-500 cursor-pointer relative"
                onClick={() => handleGameClick(game)}
              >
                {" "}
                <div className="relative w-full h-full">
                  <img
                    className={`carousel-item w-full h-full object-cover ${
                      !game.selectedPlatforms ||
                      game.selectedPlatforms.length === 0
                        ? "grayscale brightness-75"
                        : ""
                    }`}
                    src={game.image}
                    alt={game.name}
                  />
                  {(!game.selectedPlatforms ||
                    game.selectedPlatforms.length === 0) && (
                    <div className="absolute bottom-2 left-2 bg-red-600 text-white px-2 py-1 text-[0.6rem]	 rounded">
                      No Platform selected
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 p-2 flex justify-between items-start">
                  {game.completed && (
                    <FaStar
                      size="24"
                      className="text-yellow-500 border-2 border-custom-onyx-black bg-black/80 rounded-full"
                    />
                  )}
                  {game.platinum && (
                    <FaTrophy
                      size="24"
                      className="text-platinum rounded-full border-2 border-custom-onyx-black bg-black/80"
                    />
                  )}
                </div>
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

      <div className="mt-8 grid grid-cols-4 gap-4 font-mono">
        <div className="bg-custom-dark-purple p-4 rounded-lg">
          <h3 className="text-white text-center mb-2">Total Games</h3>
          <div className="flex flex-col items-center justify-center h-48">
            <span className="text-6xl font-bold text-crimson animate-bounce">
              {statistics.totalGames}
            </span>{" "}
            <span className="text-gray-400 mt-2 font-mono">
              🎮 Games Tracked
            </span>
          </div>
        </div>

        <div className="bg-custom-dark-purple p-4 rounded-lg">
          <h3 className="text-white text-center mb-2">Completed Games</h3>
          <div className="w-48 h-48 mx-auto">
            <Pie data={completionData} />
          </div>
        </div>

        <div className="bg-custom-dark-purple p-4 rounded-lg">
          <h3 className="text-white text-center mb-2">Platinum Count</h3>
          <div className="w-48 h-48 mx-auto">
            <Pie data={platinumData} />
          </div>
        </div>

        <div className="bg-custom-dark-purple p-4 rounded-lg">
          <h3 className="text-white text-center mb-2">Platform Distribution</h3>
          <div className="w-48 h-48 mx-auto">
            <Bar
              data={platformData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      precision: 0,
                      stepSize: 1,
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
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
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to remove this game from you page?"
                      )
                    ) {
                      const updatedItems = items.filter(
                        (g) => g.id !== selectedGame.id
                      );
                      onResetGames(updatedItems);
                      setSelectedGame(null);
                    }
                  }}
                  className="absolute bottom-2 right-2 text-crimson hover:text-orange-600 transition-colors"
                >
                  <FaTrash size="25" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[70vh] games-list">
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

                    <span className="text-gray-100"> Completed</span>
                    <FaStar
                      size="24"
                      className="text-yellow-500 border-2 border-custom-onyx-black bg-black/80 rounded-full"
                    />
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

                    <span className="text-gray-300">Platinum Trophy</span>
                    <FaTrophy
                      size="24"
                      className="text-platinum rounded-full border-2 border-custom-onyx-black bg-black/80"
                    />
                  </label>
                </div>
                <button
                  onClick={() => setSelectedGame(null)}
                  className="w-full bg-crimson text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Close
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
