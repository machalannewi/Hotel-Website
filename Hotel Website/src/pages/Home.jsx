import Hero from '../components/Hero.jsx';
import Header from '../components/Navbar.jsx';
import RoomCard from '../components/RoomCard.jsx';
import Footer from "../components/Footer.jsx";
import Amenities  from "../components/Amenities.jsx"
import Testimonials from '@/components/Testimonials.jsx';
import LocalAttractions from '@/components/LocalAttraction.jsx';
import Newsletter from '@/components/Newsletter.jsx';

export default function Home() {

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      <Header />
      <Hero />
      <RoomCard />
      <Amenities />
      <Testimonials />
      <LocalAttractions />
      <Newsletter />
      <Footer />
    </div>
  );
}