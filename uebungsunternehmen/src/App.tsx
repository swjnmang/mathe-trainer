import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Buchungssaetze from './pages/Buchungssaetze';
import Kalkulation from './pages/Kalkulation';
import Angebotsvergleich from './pages/Angebotsvergleich';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buchungssaetze" element={<Buchungssaetze />} />
        <Route path="/kalkulation" element={<Kalkulation />} />
        <Route path="/angebotsvergleich" element={<Angebotsvergleich />} />
      </Routes>
    </Router>
  );
}

export default App;
