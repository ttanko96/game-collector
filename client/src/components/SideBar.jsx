import { GiBandit, GiBookshelf, GiCrown  } from "react-icons/gi";

const SideBar = ({ onNavigate }) => {    
    return (
        <div className="mobile-view fixed top-0 left-0 h-screen w-32 m-0 flex flex-col bg-custom-gray text-white shadow-lg drop-shadow-md
        ">
            <SideBarIcon
                icon={<GiBookshelf size="58" />}
                text={"Game Library"}
                onClick={() => onNavigate('search')}
            />
            <SideBarIcon 
                icon={<GiBandit size="58" />} 
                text={"Dashboard"}
                onClick={() => onNavigate('tracker')}
            />
            <SideBarIcon 
                icon={<GiCrown  size="58" />} 
                text={"Tier List"}
                onClick={() => onNavigate('tier')}
            />
         </div>
    )
};

const SideBarIcon = ({ icon, text, onClick }) =>
    <div className="sidebar-icon sidebar-icon-mobile group " onClick={onClick}>
        {icon}
        <span className="sidebar-tooltip sidebar-tooltip-mobile group-hover:scale-100">
            {text}
        </span>
    </div>

export default SideBar;