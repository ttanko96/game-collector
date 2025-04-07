import './App.css'
import GameTracker from './components/GameTracker';
import SideBar from './components/SideBar';

function App() {

  return (
    <div className='flex'>   
      <GameTracker/>
      <SideBar/>
    </div>
  )
}

export default App;
