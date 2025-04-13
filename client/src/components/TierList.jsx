import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const DraggableItems = ({ game, sourceTier }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "IMAGE",
    item: { game, sourceTier },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <img
      ref={drag}
      src={game.image}
      className={`cursor-move w-[120px] h-[150px] m-[5px] ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
      alt={game.name}
    />
  );
};

const TierRow = ({ tier, images, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "IMAGE",
    drop: (item) => onDrop(item, tier.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div className="justify-start w-full bg-matte-black">
      <div
        ref={drop}
        className={`border-2 mx-10 border-[#333] m-[10px] min-h-[150px] flex ${
          isOver ? "bg-[#5e3b65]" : "bg-[#301934]"
        }`}
      >
        <div
          className="w-[100px] flex items-center justify-center text-[24px] font-bold"
          style={{ backgroundColor: tier.color }}
        >
          {tier.label}
        </div>
        <div className="flex flex-wrap">
          {images.map((game, index) => (
            <DraggableItems
              key={`${game.id}-${index}`}
              game={game}
              sourceTier={tier.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const TierList = ({ initialTiers, initialGames }) => {
  const [tiers, setTiers] = useState(
    initialTiers.map((tier) => ({ ...tier, images: [] }))
  );
  const [games, setGames] = useState(initialGames);

  const getAvailableGames = () => {
    const gamesInTiers = tiers.flatMap((tier) => tier.images);
    const gamesInTiersIds = new Set(gamesInTiers.map((game) => game.id));
    return games.filter((game) => !gamesInTiersIds.has(game.id));
  };

  useEffect(() => {
    const savedState = localStorage.getItem("tierListState");
    const { savedTiers, savedGames } = JSON.parse(savedState);
    console.log("Loaded state:", { savedTiers, savedGames });
    setTiers(savedTiers);
    setGames(savedGames);
  }, []);

  useEffect(() => {
    const stateToSave = { savedTiers: tiers, savedGames: games };
    console.log("State being saved:", stateToSave);
    localStorage.setItem("tierListState", JSON.stringify(stateToSave));
  }, [tiers, games]);

  const handleDrop = (draggedItem, targetTier) => {
    const { game, sourceTier } = draggedItem;

    setTiers((prev) => {
      const newTiers = prev.map((tier) => ({
        ...tier,
        images: [...tier.images],
      }));

      if (sourceTier) {
        const sourceTierIndex = newTiers.findIndex((t) => t.id === sourceTier);
        if (sourceTierIndex !== -1) {
          newTiers[sourceTierIndex].images = newTiers[
            sourceTierIndex
          ].images.filter((img) => img.id !== game.id);
        }
      } else {
        setGames((prevGames) => prevGames.filter((g) => g.id !== game.id));
      }

      const targetTierIndex = newTiers.findIndex((t) => t.id === targetTier);
      if (targetTierIndex !== -1) {
        newTiers[targetTierIndex].images.push(game);
      }

      return newTiers;
    });
  };

  const handleReset = () => {
    setTiers(initialTiers.map((tier) => ({ ...tier, images: [] })));
    setGames(initialGames);
  };

  return (
    <div className="flex w-full">
      <DndProvider backend={HTML5Backend}>
        <div>
          <div className="mx-20 my-5">
          <p className="text-crimson text-2xl font-mono font-bold tracking-wider drop-shadow-md py-3">My Games:</p>
          <div className="flex flex-wrap min-h-[120px] justify-center bg-[rgba(27,25,25,0.58)] rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[20px] border border-[rgba(27,25,25,0.94)]">
              {getAvailableGames().map((game, index) => {
                return (
                  <DraggableItems
                    key={`${game.id}-${index}`}
                    game={game}
                    sourceTier={null}
                  />
                );
              })}
            </div>
          </div>
          <div>
            <button
              onClick={handleReset}
              className="w-28 px-4 py-2 mx-10 bg-crimson hover:bg-orange-600 text-white border-none rounded cursor-pointer"
            >
              Reset
            </button>
            {tiers.map((tier) => (
              <TierRow
                key={tier.id}
                tier={tier}
                images={tier.images}
                onDrop={handleDrop}
              />
            ))}
          </div>
        </div>
      </DndProvider>
    </div>
  );
};

const TierListApp = ({ items }) => {
  const [tiers, setTiers] = useState(() => {
    const savedState = localStorage.getItem("tierListState");
    if (savedState) {
      const { savedTiers } = JSON.parse(savedState);
      return savedTiers;
    }
    // If no saved state, use the default tiers
    return [
      { id: "S", label: "S", color: "#ff7f7f", images: [] },
      { id: "A", label: "A", color: "#ffbf7f", images: [] },
      { id: "B", label: "B", color: "#ffff7f", images: [] },
      { id: "C", label: "C", color: "#7fff7f", images: [] },
      { id: "D", label: "D", color: "#7fbfff", images: [] },
      { id: "E", label: "E", color: "#B0B0B0", images: [] },
    ];
  });

  const [games, setGames] = useState(
    items ? items.filter((game) => game && game.id && game.image) : []
  );

  const handleReset = () => {
    setTiers([
      { id: "S", label: "S", color: "#ff7f7f", images: [] },
      { id: "A", label: "A", color: "#ffbf7f", images: [] },
      { id: "B", label: "B", color: "#ffff7f", images: [] },
      { id: "C", label: "C", color: "#7fff7f", images: [] },
      { id: "D", label: "D", color: "#7fbfff", images: [] },
      { id: "E", label: "E", color: "#B0B0B0", images: [] },
    ]);
    setGames(
      items ? items.filter((game) => game && game.id && game.image) : []
    );
  };

  useEffect(() => {
    if (items) {
      const validGames = items.filter((game) => game && game.id && game.image);
      setGames(validGames);
    }
  }, [items]);

  useEffect(() => {
    localStorage.setItem(
      "tierListState",
      JSON.stringify({ savedTiers: tiers, savedGames: games })
    );
  }, [tiers, games]);

  return (
    <div className="grid grid-rows-[auto_auto] px-28 items-center justify-center h-full w-full bg-matte-black">
      <TierList
        initialTiers={tiers}
        initialGames={games}
        onReset={handleReset}
      />
    </div>
  );
};

export default TierListApp;
