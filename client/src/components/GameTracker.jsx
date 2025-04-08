import { HiArrowCircleLeft, HiArrowCircleRight } from "react-icons/hi";
import { useEffect, useRef, useState } from 'react';

const GameTracker = ({ items, onResetGames }) => {
    const [startIndex, setStartIndex] = useState(0);
    const carouselRef = useRef(null);
    const prevBtnRef = useRef(null); 
    const nextBtnRef = useRef(null);

    const handleReset = () => {
        if(window.confirm('Are you sue?')) {
            onResetGames([]);
        }
    }
    
    useEffect(() => {
        const updatePosition = () => {
            if (!carouselRef.current) return;
            
            const slideWidth = carouselRef.current.children[0]?.offsetWidth;
            if (!slideWidth) return;
            
            const itemGap = 8;
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
        <div className='flex items-center justify-center w-screen h-screen bg-matte-black'>
            <button
          onClick={handleReset}
          className="mb-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 hidden"
        >
          Reset Game List
        </button>
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
                        {items.map((game) => (
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