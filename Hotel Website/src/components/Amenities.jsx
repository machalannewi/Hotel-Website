const amenities = [
  { icon: "🏊", title: "Infinity Pool", description: "Unwind with panoramic views" },
  { icon: "🍽️", title: "Fine Dining", description: "Gourmet restaurant on-site" },
  { icon: "🚿", title: "Spa", description: "Relax with our luxury treatments" },
];

export default function Amenities() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Amenities</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {amenities.map((item, index) => (
            <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
              <span className="text-4xl mb-4 block">{item.icon}</span>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}