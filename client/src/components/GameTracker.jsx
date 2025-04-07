import { HiArrowCircleLeft, HiArrowCircleRight } from "react-icons/hi";
import { useEffect, useRef, useState } from 'react';

const GameTracker = () => {
    const [myGames, setMyGames] = useState([]);
    const items = Array.from({ length: 20 }, (_, i) => i + 1); 
    //const items = Array.from(myGames);
    const [startIndex, setStartIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const carouselRef = useRef(null);
    const prevBtnRef = useRef(null); 
    const nextBtnRef = useRef(null);

    useEffect(() => {
        const savedGames = localStorage.getItem('myGames');
        if (savedGames) {
            setMyGames(JSON.parse(savedGames));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('myGames', JSON.stringify(myGames));
    }, [myGames]);
    
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
        <div className='flex items-center justify-center w-screen h-screen bg-gray-800'>
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
                        {items.map((item) => (
                            <div key={item} className="carousel-item">
                                {item}
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