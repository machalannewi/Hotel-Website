
import React from 'react';
import Header from "../components/Navbar"
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

export default function Contact() {
  return (

    <>
    <Header />
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="bg-cover bg-center h-64 flex items-center justify-center"
        style={{ backgroundImage: "url('/images/contact-hero.jpg')" }}>
        <div className="bg-black bg-opacity-50 w-full h-full flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">Contact Us</h1>
        </div>
      </div>

      {/* Contact Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
            <form className="space-y-4">
              <div>
                <label className="block mb-1">Name</label>
                <input 
                  type="text" 
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input 
                  type="email" 
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1">Message</label>
                <textarea 
                  rows="5"
                  className="w-full p-3 border rounded-lg"
                ></textarea>
              </div>
              <button 
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <FaMapMarkerAlt className="text-blue-600 mt-1 text-xl" />
                <div>
                  <h3 className="font-bold">Address</h3>
                  <p className="text-gray-600">123 Coastal Drive, Malibu, CA 90210</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FaPhone className="text-blue-600 mt-1 text-xl" />
                <div>
                  <h3 className="font-bold">Phone</h3>
                  <p className="text-gray-600">+1 (310) 555-1234</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FaEnvelope className="text-blue-600 mt-1 text-xl" />
                <div>
                  <h3 className="font-bold">Email</h3>
                  <p className="text-gray-600">hello@freehandhotels.com</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="mt-8 h-64 bg-gray-200 rounded-lg overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.254676940226!2d-118.6763419242663!3d34.0366253731496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c9f5e9d1e0a3%3A0x2a1a1a1a1a1a1a1a!2sMalibu%20Beach!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}