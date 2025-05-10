import React from "react";
import { Twitter, Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { href: "https://twitter.com", Icon: Twitter },
    { href: "https://facebook.com", Icon: Facebook },
    { href: "https://instagram.com", Icon: Instagram },
    { href: "https://linkedin.com", Icon: Linkedin },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Certificate Monitoring System</h2>
            <p className="text-gray-400 mb-6 max-w-md">
              Revolutionizing how government departments issue and track certificates with powerful real-time monitoring and resource allocation.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(({ href, Icon }, idx) => (
                <a
                  key={idx}
                  href={href}
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="w-5 h-5 text-white" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Home</a></li>
              <li><a href="#problem" className="text-gray-400 hover:text-white transition duration-300">The Problem</a></li>
              <li><a href="#solution" className="text-gray-400 hover:text-white transition duration-300">Our Solution</a></li>
              <li><a href="#features" className="text-gray-400 hover:text-white transition duration-300">Features</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition duration-300">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <svg className="w-5 h-5 mt-0.5 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-400">
                  Revenue Department Complex,<br />
                  Sector 17, Chandigarh 160017
                </span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-400">+91 1234 567890</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-400">support@certmonitoring.gov.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Certificate Monitoring System. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-6">
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300">Terms of Service</a>
            <a href="#" className="hover:text-gray-300">Data Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;