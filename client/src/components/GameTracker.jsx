import { HiArrowCircleLeft, HiArrowCircleRight } from "react-icons/hi";
import { useEffect, useRef, useState } from 'react';

const GameTracker = ({ items, onResetGames }) => {
    const [startIndex, setStartIndex] = useState(0);
    const [sortAlphabetically, setSortAlphabetically] = useState(false);
    const carouselRef = useRef(null);
    const prevBtnRef = useRef(null); 
    const nextBtnRef = useRef(null);

    const handleReset = () => {
        if(window.confirm('Are you sue?')) {
            onResetGames([]);
        }
    }

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
            
            prevBtnRef.current.style.opacity = startIndex === 0 ? '0' : '1';
            prevBtnRef.current.style.visibility = startIndex === 0 ? 'hidden' : 'visible';
            nextBtnRef.current.style.opacity = startIndex >= items.length - 4 ? '0' : '1';
            nextBtnRef.current.style.visibility = startIndex >= items.length - 4 ? 'hidden' : 'visible';         
        };

        updatePosition();
        updateButtons();
    }, [startIndex]); 

    const shiftRight = () => {
        if (startIndex < items.length - 4) {
            setStartIndex(index => index + 1);
        }
    };

    const shiftLeft = () => {
        if (startIndex > 0) {
            setStartIndex(index => index - 1);
        }
    };

    return (
        <div className='flex py-20 items-start justify-center w-screen h-screen bg-matte-black'>
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
                    className="p-2 rounded-full mr-2 text-red-600 hover:text-orange-500"
                >
                    <HiArrowCircleLeft size="50" />
                </button>
                
                <div className="carousel-container">
                    <div 
                        ref={carouselRef} 
                        className="carousel-track flex"
                    >
                        {displayedItems.map((game) => (
                            <div key={game} className="carousel-item">
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
                    className="p-2 rounded-full mr-2 text-red-600 hover:text-orange-500"
                >
                    <HiArrowCircleRight size="50" />
                </button>
            </div>
        </div>
    );
};

export default GameTracker;