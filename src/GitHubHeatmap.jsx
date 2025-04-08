import React, { useState } from "react";
import GitHubCalendar from "react-github-calendar";

const GitHubHeatmap = (props) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    
    
    const themes = {
        light: [
            '#ebedf0', 
            '#9be9a8', 
            '#40c463', 
            '#30a14e', 
            '#216e39'  
        ],
        dark: [
            '#161b22', 
            '#0e4429', 
            '#006d32', 
            '#26a641', 
            '#39d353'  
        ]
    };

    const selectedTheme = isDarkMode ? themes.dark : themes.light;
    const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
    const textColor = isDarkMode ? 'text-white' : 'text-gray-800';

    return (
        <div className={`w-250 mx-auto p-4 px-6 ${bgColor} shadow-lg rounded-lg mt-10`}>
            <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-bold ${textColor}`}>
                    GitHub Contribution Heatmap
                </h2>
                <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`px-3 py-1 rounded ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
            </div>
            <div className="w-full overflow-x-auto">
                <GitHubCalendar 
                    username={props.username}
                    theme={{ 
                        light: selectedTheme,
                        dark: selectedTheme,
                        level0: selectedTheme[0],
                        level1: selectedTheme[1],
                        level2: selectedTheme[2],
                        level3: selectedTheme[3],
                        level4: selectedTheme[4]
                    }}
                    blockSize={12}
                    blockMargin={4}
                    fontSize={14}
                    colorScheme={isDarkMode ? 'dark' : 'light'}
                    style={{ width: '100%' }}
                />
            </div>
        </div>
    );
};

export default GitHubHeatmap;