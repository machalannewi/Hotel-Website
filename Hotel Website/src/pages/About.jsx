import React from 'react';
import Header from "../components/Navbar"

const team = [
  {
    name: "Alex Johnson",
    role: "General Manager",
    image: "/images/front-desk-staff-managing-guest-checkin.jpg"
  },
  {
    name: "Maria Garcia",
    role: "Head Chef",
    image: "/images/front-desk-staff-managing-guest-checkin.jpg"
  }
];

export default function About() {
  return (
    <>
   <Header />
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="bg-blue-600 text-white py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Our Story</h1>
        <p className="max-w-2xl mx-auto">
          Founded in 2010, Freehand Hotels redefines luxury with a personal touch.
        </p>
      </div>

      {/* Brand Story */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">The Freehand Experience</h2>
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

      {/* Team */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Team</h2>
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
    </>
  );
}