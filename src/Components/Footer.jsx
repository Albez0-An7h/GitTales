import React from 'react'
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-4 mt-8 w-full">
            <div className="container mx-auto px-4 flex justify-center items-center">
                <h3 className="text-lg font-medium">
                    Made By Albez0-An7h
                    <a href="https://www.linkedin.com/in/ansh-kumar-723696305/"
                        className="inline-block mx-2 hover:text-blue-400 transition-colors duration-300"
                        target="_blank"
                        rel="noopener noreferrer">
                        <FaLinkedin size={25} />
                    </a>
                    <a href="https://github.com/Albez0-An7h"
                        className="inline-block hover:text-gray-400 transition-colors duration-300"
                        target="_blank"
                        rel="noopener noreferrer">
                        <FaGithub size={25} />
                    </a>
                </h3>
            </div>
        </footer>
    )
}

export default Footer