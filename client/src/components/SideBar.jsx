import { GiBandit, GiTrophiesShelf, GiStarMedal } from "react-icons/gi";

const SideBar = () => {
    return (
        <div className="fixed top-0 left-0 h-screen w-32 m-0 flex flex-col bg-custom-gray text-white shadow-lg
        ">
            <SideBarIcon icon={<GiBandit size="58" />} text={"Játékkönyvtár"}/>
            <SideBarIcon icon={<GiTrophiesShelf size="58" />} text={"Trófeák"}/>
            <SideBarIcon icon={<GiStarMedal size="58" />} text={"Toplista"}/>
         </div>
    )
};

const SideBarIcon = ({ icon, text }) =>
    <div className="sidebar-icon group">
        {icon}

        <span className="sidebar-tooltip group-hover:scale-100">
            {text}
        </span>
    </div>

export default SideBar;