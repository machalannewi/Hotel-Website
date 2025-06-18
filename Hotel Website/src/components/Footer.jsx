import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  Wifi,
  Car,
  Coffee,
  Waves,
  Dumbbell,
  UtensilsCrossed
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <img
                src="images/logo-icon.png"
                alt="Monarch Hotel"
                className="w-8 h-8 mr-3"
              />
              <h3 className="text-2xl font-bold">
                <span className="text-white">MON</span>
                <span className="text-blue-400">ARCH</span>
              </h3>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Experience luxury and comfort at Monarch Hotel. Where every stay becomes an unforgettable memory with world-class service and stunning accommodations.
            </p>
            

            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-pink-600 p-2 rounded-full transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-blue-400 p-2 rounded-full transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-red-600 p-2 rounded-full transition-colors duration-300">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>


          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-400">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Rooms & Suites</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Dining</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Amenities</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Events</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Gallery</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Privacy Policy</a></li>
            </ul>
          </div>


          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-400">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">123 Luxury Avenue</p>
                  <p className="text-gray-300">Victoria Island, Lagos</p>
                  <p className="text-gray-300">Nigeria</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">+234 809 123 4567</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">info@monarchhotel.com</p>
                  <p className="text-gray-300">reservations@monarchhotel.com</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">24/7 Front Desk</p>
                  <p className="text-gray-300">Concierge Available</p>
                </div>
              </div>
            </div>
          </div>


          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-400">Amenities</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Wifi className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300 text-sm">Free WiFi</span>
              </div>
              <div className="flex items-center space-x-2">
                <Car className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300 text-sm">Parking</span>
              </div>
              <div className="flex items-center space-x-2">
                <Waves className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300 text-sm">Pool</span>
              </div>
              <div className="flex items-center space-x-2">
                <Dumbbell className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300 text-sm">Fitness</span>
              </div>
              <div className="flex items-center space-x-2">
                <UtensilsCrossed className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300 text-sm">Restaurant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Coffee className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300 text-sm">Room Service</span>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="bg-gray-950 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} Monarch Hotel. All rights reserved.
            </div>
            
          </div>
        </div>
      </div>
    </footer>
  );
}