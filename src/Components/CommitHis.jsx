import React, { useEffect, useState } from "react";

const GitHubCommits = ({ author, repository = "sih-24", owner = "CodeMaverick-143" }) => {
    const [commits, setCommits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Use environment variable for token
    const token = import.meta.env.VITE_GITHUB_API_TOKEN;

    useEffect(() => {
        setLoading(true);
        setError(null);
        
        fetch(`https://api.github.com/repos/${owner}/${repository}/commits?author=${author}`, {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Accept": "application/vnd.github.v3+json"
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`GitHub API error: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Commits data:", data); // For debugging
                setCommits(data.slice(0, 5)); // Show last 5 commits
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching commits:", error);
                setError(error.message);
                setLoading(false);
            });
    }, [author, repository, owner, token]);

    if (loading) {
        return (
            <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg text-center">
                <p className="text-gray-600">Loading commits...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg text-center">
                <p className="text-red-500">Error: {error}</p>
                <p className="text-gray-600">Unable to fetch commits. Please check the repository and author names.</p>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
                Commits by {author}
            </h2>
            {commits.length === 0 ? (
                <p className="text-center text-gray-600">No commits found for this author in the repository.</p>
            ) : (
                <ul className="space-y-4">
                    {commits.map((commit, index) => (
                        <li key={index} className="p-4 border rounded-md bg-gray-100">
                            <p className="text-gray-900 font-semibold">{commit.commit.message}</p>
                            <p className="text-sm text-gray-600">
                                By {commit.commit.author.name} on {new Date(commit.commit.author.date).toDateString()}
                            </p>
                            <a
                                href={commit.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                View Commit
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default GitHubCommits;