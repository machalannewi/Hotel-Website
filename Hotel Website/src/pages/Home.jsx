import Hero from '../components/Hero.jsx';
import NavigationMenuDemo from '../components/Navbar.jsx';
import RoomCard from '../components/RoomCard.jsx';
import Footer from "../components/Footer.jsx";

export default function Home() {
  const rooms = [
    { id: 1, name: "Ocean View Suite", price: 299, image: "/images/Hotel-room1.jpg" },
    { id: 2, name: "Deluxe Room", price: 199, image: "/images/Hotel-room2.jpg" },
  ];

  return (
    <div className="font-sans">
      <NavigationMenuDemo />
      <Hero />
      
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Rooms</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {rooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}