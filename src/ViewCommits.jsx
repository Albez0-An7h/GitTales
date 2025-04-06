import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';

const ViewCommits = () => {
    const { owner, repo } = useParams();
    const [commits, setCommits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    // GitHub API token from environment variables
    const githubToken = import.meta.env.VITE_GITHUB_API_TOKEN;
    
    // Headers for GitHub API requests with authorization
    const githubHeaders = githubToken ? {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
    } : {
        'Accept': 'application/vnd.github.v3+json'
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Get current user
                const { data: { user }, error: userError } = await supabase.auth.getUser();

                if (userError) throw userError;

                if (user) {
                    setUser(user);

                    // Get profile data including GitHub username
                    const { data: profileData, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('user_id', user.id)
                        .single();

                    if (profileError) throw profileError;

                    if (profileData) {
                        setProfile(profileData);
                        fetchCommits(profileData.github_username);
                    } else {
                        // No profile found, redirect to profile page
                        navigate('/profile');
                    }
                } else {
                    // No user found, redirect to sign in
                    navigate('/signin');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to load user data. Please try again later.');
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate, owner, repo]);

    const fetchCommits = async (githubUsername) => {
        if (!owner || !repo || !githubUsername) return;
        
        try {
            const response = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/commits?author=${githubUsername}&per_page=100`,
                { headers: githubHeaders }
            );
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            
            const data = await response.json();
            setCommits(data);
        } catch (error) {
            console.error('Error fetching commits:', error);
            setError(`Failed to load commits: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg text-gray-600">Loading commits...</p>
                    <div className="mt-4 w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header/Nav */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Repository Commits</h1>
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/"
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
                        <span>{error}</span>
                    </div>
                )}

                <div className="bg-white shadow rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4">
                        Commits in <a href={`https://github.com/${owner}/${repo}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{owner}/{repo}</a>
                    </h2>
                    
                    {commits.length === 0 ? (
                        <p className="text-gray-500">No commits found for {profile?.github_username} in this repository.</p>
                    ) : (
                        <div className="space-y-4">
                            {commits.map((commit) => (
                                <div key={commit.sha} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900">
                                                <a href={commit.html_url} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600">
                                                    {commit.commit.message.split('\n')[0]}
                                                </a>
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {new Date(commit.commit.author.date).toLocaleDateString()} at {new Date(commit.commit.author.date).toLocaleTimeString()}
                                            </p>
                                        </div>
                                        <a
                                            href={commit.html_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-indigo-600 hover:text-indigo-700"
                                        >
                                            View on GitHub
                                        </a>
                                    </div>
                                    {commit.commit.message.includes('\n') && (
                                        <div className="mt-2 text-sm text-gray-600 border-t border-gray-100 pt-2">
                                            {commit.commit.message.split('\n').slice(1).join('\n')}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ViewCommits;
