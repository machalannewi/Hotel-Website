import {motion} from "framer-motion";


export default function Newsletter() {
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.div
        initial={{opacity: 0, y: -50}}
        whileInView={{opacity: 1, y: 0}}
        transition={{duration: 0.8}}
        viewport={{ once: true, amount: 0.3 }}
        >
        <h2 className="text-3xl font-bold mb-4">Get Exclusive Offers</h2>
        </motion.div>

        <motion.div
        initial={{opacity: 0, y: 50}}
        whileInView={{opacity: 1, y: 0}}
        transition={{duration: 0.8}}
        viewport={{ once: true, amount: 0.3 }}
        >
        <p className="mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter for special discounts and updates.
        </p>
        </motion.div>

        <form className="flex flex-col md:flex-row gap-4 justify-center max-w-md mx-auto">
         <motion.div
            initial={{opacity: 0, x: -100}}
            whileInView={{opacity: 1, x: 0}}
            transition={{duration: 0.8}}
            viewport={{ once: true, amount: 0.3 }}
            >
          <input 
            type="email" 
            placeholder="Your email" 
            className="px-4 py-3 rounded-lg flex-grow text-white"
          />
         </motion.div>

         <motion.div
            initial={{opacity: 0, x: 100}}
            whileInView={{opacity: 1, x: 0}}
            transition={{duration: 0.8}}
            viewport={{ once: true, amount: 0.3 }}
            >
          <button 
            type="submit"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
          >
            Subscribe
          </button>
          </motion.div>

        </form>
      </div>
    </section>
  );
}