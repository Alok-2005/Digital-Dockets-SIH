import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import { LogIn, LogOut, UserPlus } from 'lucide-react';
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuthStore();

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-bold">Digital Dockets</div>
                <div className="block lg:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-white focus:outline-none"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            ></path>
                        </svg>
                    </button>
                </div>
                <div className={`w-full lg:flex lg:items-center lg:w-auto ${isOpen ? 'block' : 'hidden'}`}>
                    <ul className="lg:flex lg:justify-between text-white">
                        <li className="lg:mx-4 my-2 lg:my-0">
                            <a href="/" className="block lg:inline-block">Home</a>
                        </li>
                        <li className="lg:mx-4 my-2 lg:my-0">
                            <a href="#" className="block lg:inline-block">About</a>
                        </li>
                        
                        
                        <li className="lg:mx-4 my-2 lg:my-0 flex gap-4">
                            {user ? (
                                <>
                                <li className="lg:mx-4 my-2 lg:my-0">
                            <a href="/dashboard" className="block lg:inline-block">DashBoard</a>
                        </li>
                                <button
                                    className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                                    onClick={logout}
                                >
                                    <LogOut size={18} />
                                    <span className="hidden sm:inline ml-2 ">Logout </span>
                                </button>
                                
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/signup"
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                                    >
                                        <UserPlus className="mr-2" size={18} />
                                        Sign Up
                                    </Link>

                                    <Link
                                        to="/login"
                                        className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                                    >
                                        <LogIn className="mr-2" size={18} />
                                        Login
                                    </Link>
                                </>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};


export default Navbar;