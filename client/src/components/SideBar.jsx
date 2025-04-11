import { GiBandit, GiBookshelf  } from "react-icons/gi";
import { HiQuestionMarkCircle } from "react-icons/hi";

const SideBar = ({ onNavigate }) => {    
    return (
        <div className="fixed top-0 left-0 h-screen w-32 m-0 flex flex-col bg-custom-gray text-white shadow-lg drop-shadow-md
        ">
            <SideBarIcon
                icon={<GiBookshelf size="58" />}
                text={"Game Library"}
                onClick={() => onNavigate('search')}
            />
            <SideBarIcon 
                icon={<GiBandit size="58" />} 
                text={"Player Shelf"}
                onClick={() => onNavigate('tracker')}
            />
            <SideBarIcon 
                icon={<HiQuestionMarkCircle  size="58" />} 
                text={"Coming soon.."}
            />
         </div>
    )
};

const SideBarIcon = ({ icon, text, onClick }) =>
    <div className="sidebar-icon group " onClick={onClick}>
        {icon}
        <span className="sidebar-tooltip group-hover:scale-100">
            {text}
        </span>
    </div>

export default SideBar;