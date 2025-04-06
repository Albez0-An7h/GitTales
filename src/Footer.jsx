import { FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-indigo-600 text-white py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-center md:text-left">
                            &copy; {new Date().getFullYear()} GitTales. All rights reserved.
                        </p>
                    </div>

                    <div className="flex space-x-6">
                        <a
                            href="https://www.linkedin.com/in/ansh-kumar-723696305/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-indigo-200 transition-colors flex items-center"
                        >
                            <FaLinkedin className="h-6 w-6 mr-2" />
                            <span className="hidden md:inline">LinkedIn</span>
                        </a>
                        <a
                            href="https://github.com/Albez0-An7h"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-indigo-200 transition-colors flex items-center"
                        >
                            <FaGithub className="h-6 w-6 mr-2" />
                            <span className="hidden md:inline">GitHub</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
