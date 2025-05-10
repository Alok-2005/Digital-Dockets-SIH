import React from "react";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const ProblemSection = () => {
  return (
    <section id="problem" className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">The Challenge</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Current certificate issuance processes face significant challenges that impact both citizens and government efficiency.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid md:grid-cols-2 gap-8 lg:gap-12"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={item} className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-red-500">
            <div className="flex items-start">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Growing Backlogs</h3>
                <p className="text-gray-600">
                  Without real-time monitoring and analysis, certificate applications pile up in high-demand areas, leading to significant delays and citizen frustration.
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={item} className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-orange-500">
            <div className="flex items-start">
              <div className="bg-orange-100 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Poor Resource Allocation</h3>
                <p className="text-gray-600">
                  Resources are allocated without proper data analysis, resulting in inefficient distribution that doesn't match actual demand patterns.
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={item} className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-yellow-500">
            <div className="flex items-start">
              <div className="bg-yellow-100 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Limited Visibility</h3>
                <p className="text-gray-600">
                  District and central authorities lack insights into bottlenecks and processing times, making proactive management impossible.
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={item} className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-green-500">
            <div className="flex items-start">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Security and Authentication</h3>
                <p className="text-gray-600">
                  Traditional systems lack robust verification processes and digital signature capabilities needed for secure certificate issuance.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-16 text-center bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl shadow-xl p-8 md:p-12"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">The Solution</h3>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            A comprehensive digital platform with real-time monitoring capabilities to streamline certificate issuance and optimize resource allocation.
          </p>
          <a href="#solution" className="inline-block bg-white hover:bg-blue-50 text-blue-800 font-semibold py-3 px-8 rounded-full text-lg transition duration-300 shadow-lg">
            See Our Solution
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;
