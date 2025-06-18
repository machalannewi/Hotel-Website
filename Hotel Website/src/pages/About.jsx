import React from 'react';
import Header from "../components/Navbar"
import Footer from "../components/Footer"

const team = [
  {
    name: "Alex Johnson",
    role: "General Manager",
    image: "/images/african-american-man-wearing-stylish-hat.jpg"
  },
  {
    name: "Maria Garcia",
    role: "Head Chef",
    image: "/images/smiley-african-woman-with-golden-earrings.jpg"
  }
];

export default function About() {
  return (
    <>
   <Header />
    <div className="min-h-screen">
      <div className="relative text-white py-20 text-center bg-[url('/images/happy-confident-business-team-posing-with-arms-folded.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/50"></div>
        <h1 className="relative text-4xl font-bold mb-4">Our Story</h1>
        <p className="relative max-w-2xl mx-auto">
          Founded in 2010, Freehand Hotels redefines luxury with a personal touch.
        </p>
      </div>


      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">The Freehand Experience</h2>
            <p className="text-gray-600 mb-4">
              Nestled along the California coast, our hotel blends modern comfort with timeless elegance. 
              Every detail is crafted to create unforgettable memories.
            </p>
            <p className="text-gray-600">
              We partner with local artisans to bring you authentic experiences, from farm-to-table dining 
              to guided coastal hikes.
            </p>
          </div>
          <img 
            src="/images/front-desk-staff-managing-guest-checkin.jpg" 
            alt="Hotel exterior"
            className="rounded-lg shadow-xl"
          />
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-blue-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
}