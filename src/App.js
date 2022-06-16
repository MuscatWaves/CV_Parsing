import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './pages/Login';
import DashBoard from './pages/DashBoard';
import BuildCV from './pages/BuildCV';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route path="/" element={<Login/>}></Route>
            <Route path="/dashboard" element={<DashBoard/>}></Route>
            <Route path="/buildcv" element={<BuildCV/>}></Route>
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
