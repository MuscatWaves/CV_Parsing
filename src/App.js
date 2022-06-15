import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Login from './pages/Login';
import DashBoard from './pages/DashBoard';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route path="/" element={<Login/>}></Route>
            <Route path="/DashBoard" element={<DashBoard/>}></Route>
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
