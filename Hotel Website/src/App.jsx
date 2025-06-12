import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home.jsx"
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Rooms from "./pages/Rooms.jsx";


function App() {


  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/rooms" element={<Rooms />} />
    </Routes>
    </>
  )
}

export default App
