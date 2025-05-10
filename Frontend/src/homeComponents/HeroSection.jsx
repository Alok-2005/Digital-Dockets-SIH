import React from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 md:px-8 py-20 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating certificates in background */}
        {[...Array(15)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute rounded-lg border-2 border-blue-400/30 bg-white/5 backdrop-blur-sm"
            style={{
              width: Math.random() * 140 + 60,
              height: Math.random() * 180 + 80,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              rotate: `${Math.random() * 20 - 10}deg`,
            }}
            initial={{ opacity: 0, scale: 0.5, y: 100 }}
            animate={{
              opacity: 0.2 + Math.random() * 0.2,
              scale: 0.8 + Math.random() * 0.4,
              y: [0, Math.random() * -150 - 50],
              rotate: [`${Math.random() * 10 - 5}deg`, `${Math.random() * 10 - 5}deg`],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: Math.random() * 25 + 15,
              ease: "easeInOut",
            }}
          >
            <div className="w-full h-full flex flex-col justify-between p-3">
              <div className="w-full h-2 bg-blue-500/30 rounded mb-2"></div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-4/5 h-1 bg-white/30 rounded my-1 mx-auto"></div>
              ))}
              <div className="flex justify-between mt-auto">
                <div className="w-8 h-8 rounded-full bg-blue-600/40"></div>
                <div className="w-12 h-6 bg-white/20 rounded"></div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Glowing orbs */}
        {[...Array(8)].map((_, index) => (
          <motion.div
            key={`orb-${index}`}
            className="absolute rounded-full blur-2xl"
            style={{
              background: `radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, rgba(37, 99, 235, 0.2) 70%, rgba(29, 78, 216, 0) 100%)`,
              width: Math.random() * 300 + 200,
              height: Math.random() * 300 + 200,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: Math.random() * 20 + 10,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-700/70 text-blue-100 backdrop-blur-sm border border-blue-500/30">
            Next-Generation Government Platform
          </span>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
            Real-Time Monitoring for Certificate Issuance
          </span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Revolutionizing how Revenue Departments issue Caste, Domicile, and other certificates with intelligent resource allocation, powerful monitoring, and seamless digital workflows.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <a
            href="#features"
            className="inline-block bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/50"
          >
            Explore Features
          </a>
          <a
            href="#contact"
            className="inline-block bg-transparent hover:bg-white/10 text-white border-2 border-white/30 hover:border-white/60 font-semibold py-4 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105"
          >
            Request Demo
          </a>
        </motion.div>

        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ),
              title: "Verified Digital Signatures",
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ),
              title: "Real-time Analytics",
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              ),
              title: "Customizable Workflows",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/10 backdrop-blur-sm border border-blue-200/20 rounded-xl p-5 flex flex-col items-center"
              whileHover={{
                y: -5,
                boxShadow: "0 10px 30px -5px rgba(29, 78, 216, 0.3)",
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-blue-600/30 p-3 rounded-full mb-4">
                <div className="text-blue-200">{feature.icon}</div>
              </div>
              <h3 className="text-lg font-medium text-white">{feature.title}</h3>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <a href="#problem" className="text-blue-200 flex flex-col items-center group">
            <span className="text-sm mb-2 group-hover:text-white transition-colors">Discover More</span>
            <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
