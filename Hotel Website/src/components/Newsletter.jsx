
export default function Newsletter() {
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Get Exclusive Offers</h2>
        <p className="mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter for special discounts and updates.
        </p>
        <form className="flex flex-col md:flex-row gap-4 justify-center max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Your email" 
            className="px-4 py-3 rounded-lg flex-grow text-white"
          />
          <button 
            type="submit"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}