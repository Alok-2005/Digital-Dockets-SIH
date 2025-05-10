import React from "react";
import { motion } from "framer-motion";

const BenefitsSection = () => {
  const benefits = [
    {
      title: "Eliminate Backlogs",
      description: "Intelligent workflow management and resource allocation dramatically reduces certificate processing backlogs.",
      icon: (
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      bgColor: "bg-gradient-to-r from-green-600 to-green-700",
    },
    {
      title: "Data-Driven Decisions",
      description: "Comprehensive analytics and visualization tools enable informed resource allocation and process improvements.",
      icon: (
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      bgColor: "bg-gradient-to-r from-blue-600 to-blue-700",
    },
    {
      title: "Enhanced Transparency",
      description: "Real-time tracking of applications provides complete visibility to both citizens and administrators.",
      icon: (
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      bgColor: "bg-gradient-to-r from-purple-600 to-purple-700",
    },
    {
      title: "Secure Authentication",
      description: "Digital signatures and QR codes ensure certificate authenticity and prevent fraud.",
      icon: (
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      bgColor: "bg-gradient-to-r from-red-600 to-red-700",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Benefits</h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our platform transforms certificate issuance from a bottleneck into a streamlined, data-driven process.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div 
              key={index}
              className={`rounded-xl shadow-lg p-8 ${benefit.bgColor}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="bg-white/20 p-3 rounded-full inline-block mb-6">
                {benefit.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{benefit.title}</h3>
              <p className="text-lg text-gray-100">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-8">Ready to transform certificate issuance?</h3>
          <a 
            href="#contact" 
            className="inline-block bg-white text-blue-900 hover:bg-blue-50 font-bold py-4 px-10 rounded-full text-lg transition duration-300 transform hover:scale-105 shadow-lg"
          >
            Get Started Today
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
