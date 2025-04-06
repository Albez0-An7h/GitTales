import React from 'react'
import { TbError404Off } from "react-icons/tb";
import { Link } from 'react-router-dom';

const Error404 = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 py-12">
            <div className="text-center">
                <TbError404Off className="mx-auto text-9xl text-red-500 mb-6" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
                    I guess You Made A Typo...
                </h1>
                <Link to={'/'}>
                    <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg">
                        Go to Home Page
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default Error404