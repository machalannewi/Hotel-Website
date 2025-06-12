import { Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Home from "./pages/Home.jsx"
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Rooms from "./pages/Rooms.jsx";


function App() {

  const location = useLocation()

  return (
    <>
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
      <Route path="/" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Home />
            </motion.div>
      }/>
      <Route path="/about" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <About />
            </motion.div>
      } />
      <Route path="/contact" element={
                    <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Contact />
            </motion.div>
      } />
      <Route path="/rooms" element={
                    <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Rooms />
            </motion.div>
      } />
    </Routes>
    </AnimatePresence>  

    </>
  )
}

export default App
