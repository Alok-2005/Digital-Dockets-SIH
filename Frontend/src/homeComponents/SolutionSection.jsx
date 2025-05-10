import React from "react";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const SolutionSection = () => {
  const features = [
    {
      title: "Document Verification",
      description: "Seamless document verification by Authority 1 ensuring accuracy and validity of submitted information.",
      icon: (
        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Payment Processing",
      description: "Secure payment gateway managed by Authority 2 with real-time transaction tracking and receipt generation.",
      icon: (
        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
    {
      title: "Customizable Forms",
      description: "Fully customizable application forms for different certificate types, tailored to specific departmental requirements.",
      icon: (
        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      title: "Digital Signatures & QR",
      description: "Secure digital signatures and QR codes on certificates for easy verification and preventing forgery.",
      icon: (
        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      ),
    },
    {
      title: "Admin Dashboard",
      description: "Comprehensive admin panel with service management, application tracking, and authorization controls.",
      icon: (
        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
    },
    {
      title: "Data Visualization",
      description: "Advanced charts and graphs for monitoring application flow, resource utilization, and identifying bottlenecks.",
      icon: (
        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="solution" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Comprehensive Solution</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A powerful platform that streamlines certificate issuance with real-time monitoring and intelligent resource allocation.
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={item}
              className="bg-white border border-gray-100 rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="bg-blue-50 p-3 rounded-full inline-block mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-20 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Powerful Admin Controls</h3>
            <p className="text-lg text-gray-600 mb-6">
              Our comprehensive admin panel gives you complete control and visibility over the certificate issuance process.
            </p>
            <ul className="space-y-3">
              {[
                "Service list management",
                "Application acceptance/rejection",
                "Service configuration",
                "Form enabling/disabling",
                "Authorization sequence control",
                "Master subzone management",
                "Real-time data visualization"
              ].map((item, index) => (
                <li key={index} className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:w-1/2 md:pl-12">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gray-800 px-6 py-4 flex items-center">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="mx-auto text-white text-sm font-medium">Admin Dashboard</div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-lg p-4 h-20 flex items-center justify-center">
                    <span className="text-blue-800 font-semibold">Services</span>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 h-20 flex items-center justify-center">
                    <span className="text-purple-800 font-semibold">Applications</span>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 h-20 flex items-center justify-center">
                    <span className="text-green-800 font-semibold">Analytics</span>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4 h-20 flex items-center justify-center">
                    <span className="text-amber-800 font-semibold">Forms</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 h-32 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-gray-500 text-sm">Certificate Issuance Monitoring</div>
                    <div className="font-bold text-xl text-gray-800 mt-2">Real-time Dashboard</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionSection;
