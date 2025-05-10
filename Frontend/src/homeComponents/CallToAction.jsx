import React from "react";
import { motion } from "framer-motion";

const CallToAction = () => {
  return (
    <section id="contact" className="py-20 px-4 bg-gradient-to-br from-blue-800 to-indigo-900 text-white">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-10 md:p-16 shadow-2xl border border-white/20"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="text-center mb-10">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Start Modernizing Certificate Issuance Today
            </motion.h2>
            <motion.p 
              className="text-xl text-blue-200 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Join the growing number of government departments using our platform to streamline certificate issuance and improve citizen satisfaction.
            </motion.p>
          </div>
          
          <motion.div 
            className="grid md:grid-cols-2 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div>
              <h3 className="text-2xl font-semibold mb-4">Request a Demo</h3>
              <p className="text-blue-200 mb-6">
                See our platform in action with a personalized demonstration for your department.
              </p>
              <button 
                className="bg-white hover:bg-blue-50 text-blue-800 font-semibold py-3 px-6 rounded-lg transition duration-300"
                onClick={() => console.log("Demo requested")}
              >
                Schedule Demo
              </button>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold mb-4">Get in Touch</h3>
              <p className="text-blue-200 mb-6">
                Have questions about implementing our solution for your department?
              </p>
              <button 
                className="bg-transparent hover:bg-white/10 text-white border border-white font-semibold py-3 px-6 rounded-lg transition duration-300"
                onClick={() => console.log("Contact requested")}
              >
                Contact Us
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            className="mt-12 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-6 md:mb-0">
              <div className="bg-blue-700 p-3 rounded-full mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium">Trusted by</p>
                <p className="text-white font-bold">25+ Government Departments</p>
              </div>
            </div>
            <div className="flex space-x-6">
              <div className="text-center">
                <p className="text-3xl font-bold">99%</p>
                <p className="text-sm text-blue-200">Reduction in Backlogs</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">85%</p>
                <p className="text-sm text-blue-200">Faster Processing</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">100%</p>
                <p className="text-sm text-blue-200">Secure & Compliant</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
