import React from 'react'
import Footer from './Footer'
import { Link } from 'react-router-dom'

const NameList = () => {

    const NameData = [
        {
            Name: "Ansh Kumar",
            userName: "Albez0-An7h",
            Batch: "C",
        },
        {
            Name: "Vedansha Srivastava",
            userName: "Vedansha07",
            Batch: "A",
        },
        {
            Name: "Arpit Sarang",
            userName: "CodeMaverick-143",
            Batch: "C",
        },
        {
            Name: "Aashish Jha",
            userName: "Aashish-Jha-11",
            Batch: "C",
        },
        {
            Name: "Vivek Wadagare",
            userName: "AryanVBW",
            Batch: "C",
        },
        {
            Name: "Arohi-Jadhav",
            userName: "Arohi-jd",
            Batch: "B",
        },
        {
            Name: "Ananya Gupta",
            userName: "anya-xcode",
            Batch: "C",
        },
        {
            Name: "Ayush Kumar",
            userName: "AyushCodes160",
            Batch: "A",
        },
        {
            Name: "Daksh Saini",
            userName: "mrgear111",
            Batch: "A",
        },
    ]

    return (

        <div className="flex flex-col min-h-screen">

            <h1 className="text-3xl font-bold text-center text-amber-400 my-6">Gitales - The Story of your Github Journey</h1>

            <div className="flex-grow w-full px-10 py-5">
                <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    {NameData.map((nameD, i) => (
                        <li key={i} className="bg-white hover:bg-gray-50 transition-colors duration-150">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        <span className="bg-blue-400 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                                            {i+1}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-lg font-medium text-gray-800 truncate">{nameD.Name}</p>
                                        <p className="text-sm text-gray-600 truncate">
                                            <span className="font-medium">Github: </span>
                                            {nameD.userName}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            <span className="font-medium">Batch: </span>
                                            <span className="px-2 py-1 text-xs font-bold rounded bg-amber-100 text-amber-800">
                                                {nameD.Batch}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-3 sm:mt-0 sm:ml-4">
                                    <Link to={`PullRequestData/${nameD.userName}`} target="_blank" rel="noopener noreferrer">
                                        <button className="h-10 w-full sm:w-32 bg-blue-400 rounded-xl cursor-pointer hover:bg-blue-500 transition-colors">
                                            <span className="text-white">See Pr Details</span>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <Footer />
        </div>
    )
}

export default NameList