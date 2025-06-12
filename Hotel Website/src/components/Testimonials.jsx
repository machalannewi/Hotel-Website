// components/Testimonials.js
const testimonials = [
  {
    quote: "Best hotel experience ever! The ocean view was unforgettable.",
    author: "Jane D.",
    rating: "★★★★★"
  },
  {
    quote: "Impeccable service and stunning rooms. Will definitely return.",
    author: "Michael T.",
    rating: "★★★★★"
  },
  {
    quote: "Impeccable service and stunning rooms. Will definitely return.",
    author: "Michael T.",
    rating: "★★★★★"
  },
  {
    quote: "Impeccable service and stunning rooms. Will definitely return.",
    author: "Michael T.",
    rating: "★★★★★"
  }
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-blue-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Guest Reviews</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 italic mb-4">"{item.quote}"</p>
              <div className="flex justify-between items-center">
                <p className="font-semibold">{item.author}</p>
                <p className="text-yellow-500">{item.rating}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}