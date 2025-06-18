import  { motion } from "framer-motion"
const attractions = [
  {
    name: "Sunset Beach",
    distance: "5 min walk",
    image: "/images/sky-pool-background-swimming-travel.jpg"
  },
  {
    name: "Downtown Shopping",
    distance: "10 min drive",
    image: "/images/Hero-banner.jpg"
  }
];

export default function LocalAttractions() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Explore Nearby</h2>
          <motion.div
            initial={{ opacity: 0, y: 150 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
          >
        <div className="grid md:grid-cols-2 gap-8">
          {attractions.map((item, index) => (
            <div key={index} className="relative rounded-xl overflow-hidden h-64">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                <h3 className="text-white text-xl font-bold">{item.name}</h3>
                <p className="text-white">{item.distance}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      </div>
    </section>
  );
}