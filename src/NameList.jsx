import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Link } from 'react-router-dom';

const NameList = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [avatars, setAvatars] = useState({});
    
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
        const fetchProfiles = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .order('name');

                if (error) throw error;
                
                setProfiles(data || []);
                
                // Fetch GitHub avatars for all profiles with GitHub usernames
                if (data && data.length > 0) {
                    fetchGitHubAvatars(data);
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching profiles:', error);
                setError('Failed to load profiles. Please try again later.');
                setLoading(false);
            }
        };

        fetchProfiles();
    }, []);
    
    const fetchGitHubAvatars = async (profiles) => {
        try {
            const avatarPromises = profiles
                .filter(profile => profile.github_username)
                .map(async (profile) => {
                    try {
                        const response = await fetch(`https://api.github.com/users/${profile.github_username}`, {
                            headers: githubHeaders
                        });
                        
                        if (response.ok) {
                            const userData = await response.json();
                            return { 
                                username: profile.github_username, 
                                avatar_url: userData.avatar_url
                            };
                        }
                        return { username: profile.github_username, avatar_url: null };
                    } catch (error) {
                        console.error(`Error fetching avatar for ${profile.github_username}:`, error);
                        return { username: profile.github_username, avatar_url: null };
                    }
                });

            const avatarResults = await Promise.all(avatarPromises);
            
            // Convert array to object with username as key
            const avatarMap = avatarResults.reduce((acc, item) => {
                acc[item.username] = item.avatar_url;
                return acc;
            }, {});
            
            setAvatars(avatarMap);
        } catch (error) {
            console.error('Error fetching GitHub avatars:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg text-gray-600">Loading profiles...</p>
                    <div className="mt-4 w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Developer Profiles</h1>
                    <Link
                        to="/"
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
                        <span>{error}</span>
                    </div>
                )}

                <div className="bg-white shadow rounded-lg p-6">
                    {profiles.length === 0 ? (
                        <p className="text-gray-500 text-center">No profiles found.</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {profiles.map((profile) => (
                                <li key={profile.id} className="py-4 hover:bg-gray-50">
                                    <Link 
                                        to={`/view-profile/${profile.user_id}`}
                                        className="flex items-center justify-between px-4"
                                    >
                                        <div className="flex items-center">
                                            {/* GitHub Avatar */}
                                            <div className="flex-shrink-0 h-12 w-12">
                                                {avatars[profile.github_username] ? (
                                                    <img 
                                                        className="h-12 w-12 rounded-full" 
                                                        src={avatars[profile.github_username]}
                                                        alt={`${profile.name}'s avatar`} 
                                                    />
                                                ) : (
                                                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                                                        <span className="text-indigo-600 font-semibold">
                                                            {profile.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="ml-4">
                                                <p className="text-lg font-medium text-indigo-600">{profile.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    @{profile.github_username} · <span className="font-medium">Batch: </span>{profile.batch}
                                                </p>
                                            </div>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
        </div>
    );
};

export default NameList;
