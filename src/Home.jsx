import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import GitHubHeatmap from './GitHubHeatmap';

const Home = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [githubUser, setGithubUser] = useState(null);
    const [pullRequests, setPullRequests] = useState([]);
    const [totalPRCount, setTotalPRCount] = useState(0);
    const [error, setError] = useState(null);
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

    // Fetch Supabase user and profile data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
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
                        
                        // If GitHub username exists, fetch GitHub data
                        if (profileData.github_username) {
                            fetchGitHubData(profileData.github_username);
                        }
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
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    // Fetch GitHub user data and PRs
    const fetchGitHubData = async (username) => {
        try {
            // Fetch GitHub user profile with authentication
            const userResponse = await fetch(`https://api.github.com/users/${username}`, {
                headers: githubHeaders
            });
            
            if (!userResponse.ok) {
                throw new Error(`Failed to fetch GitHub user data: ${userResponse.status}`);
            }
            
            const userData = await userResponse.json();
            setGithubUser(userData);

            // Fetch user's pull requests with authentication
            const prsResponse = await fetch(
                `https://api.github.com/search/issues?q=author:${username}+type:pr&sort=updated&order=desc&per_page=100`, 
                { headers: githubHeaders }
            );
            
            if (!prsResponse.ok) {
                throw new Error(`Failed to fetch pull requests: ${prsResponse.status}`);
            }
            
            const prsData = await prsResponse.json();
            setTotalPRCount(prsData.total_count);
            
            // For each PR, fetch additional details like merge status
            const detailedPrs = await Promise.all(
                prsData.items.slice(0, 20).map(async (pr) => {
                    try {
                        // Extract repo owner and name from PR URL
                        const urlParts = pr.repository_url.split('/');
                        const owner = urlParts[urlParts.length - 2];
                        const repo = urlParts[urlParts.length - 1];
                        const prNumber = pr.number;
                        
                        // Fetch detailed PR info to get merge status
                        const detailResponse = await fetch(
                            `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`, 
                            { headers: githubHeaders }
                        );
                        
                        if (detailResponse.ok) {
                            const detailData = await detailResponse.json();
                            return {
                                ...pr,
                                merged: detailData.merged || false,
                                merged_at: detailData.merged_at,
                                additions: detailData.additions,
                                deletions: detailData.deletions,
                                changed_files: detailData.changed_files,
                                repository: {
                                    name: repo,
                                    owner: owner,
                                    full_name: `${owner}/${repo}`,
                                    html_url: `https://github.com/${owner}/${repo}`
                                }
                            };
                        } else {
                            console.error(`Failed to fetch PR details: ${detailResponse.status}`);
                            return {
                                ...pr,
                                merged: false,
                                repository: {
                                    name: repo,
                                    owner: owner,
                                    full_name: `${owner}/${repo}`,
                                    html_url: `https://github.com/${owner}/${repo}`
                                }
                            };
                        }
                    } catch (error) {
                        console.error('Error processing PR:', error);
                        return pr;
                    }
                })
            );
            
            setPullRequests(detailedPrs);
        } catch (error) {
            console.error('Error fetching GitHub data:', error);
            setError(`Failed to load GitHub data: ${error.message}. ${!githubToken ? 'GitHub API token not configured.' : ''}`);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/signin');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg text-gray-600">Loading your dashboard...</p>
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
                    <h1 className="text-2xl font-bold text-gray-900">GitTales Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <Link 
                            to="/names" 
                            className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50"
                        >
                            View All Profiles
                        </Link>
                        <button 
                            onClick={() => navigate('/profile')} 
                            className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Edit Profile
                        </button>
                        <button 
                            onClick={handleSignOut} 
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
                        <span>{error}</span>
                    </div>
                )}

                {/* User Profile Dashboard */}
                <div className="bg-white shadow rounded-lg p-6 mb-8">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <h2 className="text-xl font-bold leading-7 text-gray-900 sm:text-2xl mb-2">
                                    Welcome, {profile?.name || user?.email}
                                </h2>
                                {profile?.github_username && (
                                    <a
                                        href={`https://github.com/${profile.github_username}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 sm:mt-0 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 inline-flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Visit GitHub Profile
                                    </a>
                                )}
                            </div>
                            {profile && (
                                <p className="text-sm text-gray-500">
                                    Batch: {profile.batch}
                                </p>
                            )}
                            {githubUser && githubUser.bio && (
                                <p className="mt-2 text-sm text-gray-600">
                                    {githubUser.bio}
                                </p>
                            )}
                        </div>
                        
                        {githubUser && (
                            <div className="mt-4 md:mt-0 md:ml-4 text-center md:text-right">
                                <a 
                                    href={`https://github.com/${profile?.github_username}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center md:items-end"
                                >
                                    <div className="h-20 w-20 rounded-full overflow-hidden mb-2">
                                        <img 
                                            src={githubUser.avatar_url} 
                                            alt={`${profile?.github_username}'s avatar`}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <span className="text-indigo-600 hover:text-indigo-500">
                                        @{profile?.github_username}
                                    </span>
                                </a>
                            </div>
                        )}
                    </div>

                    {githubUser && (
                        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
                            <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Public Repositories</dt>
                                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{githubUser.public_repos}</dd>
                                    </dl>
                                </div>
                            </div>
                            <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Followers</dt>
                                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{githubUser.followers}</dd>
                                    </dl>
                                </div>
                            </div>
                            <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Following</dt>
                                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{githubUser.following}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Add GitHub Contribution Heatmap */}
                    {profile?.github_username && (
                        <div className="mt-6">
                            <GitHubHeatmap username={profile.github_username} />
                        </div>
                    )}
                </div>

                {/* Pull Requests Section */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        Your Recent Pull Requests 
                        <span className="ml-2 text-sm font-medium bg-indigo-100 text-indigo-800 py-1 px-2 rounded-full">
                            {totalPRCount}
                        </span>
                    </h2>

                    {pullRequests.length === 0 ? (
                        <div className="bg-white shadow rounded-lg p-6 text-center">
                            <p className="text-gray-500">No pull requests found for this GitHub username.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {pullRequests.map(pr => (
                                <div key={pr.id} className={`${pr.merged ? 'bg-green-50' : 'bg-white'} shadow rounded-lg overflow-hidden`}>
                                    <div className="px-4 py-5 sm:p-6">
                                        <h3 className="text-lg font-medium text-gray-900 truncate mb-1">
                                            <a 
                                                href={pr.html_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="hover:text-indigo-600"
                                            >
                                                {pr.title}
                                            </a>
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-4">
                                            <a 
                                                href={pr.repository?.html_url || `https://github.com/${pr.repository?.full_name}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="hover:text-indigo-500"
                                            >
                                                {pr.repository?.full_name}
                                            </a>
                                        </p>
                                        
                                        {/* Show code changes stats if available */}
                                        {(pr.additions !== undefined || pr.deletions !== undefined) && (
                                            <div className="flex items-center text-xs text-gray-500 mb-3">
                                                {pr.changed_files && (
                                                    <span className="mr-3">
                                                        {pr.changed_files} file{pr.changed_files !== 1 ? 's' : ''} changed
                                                    </span>
                                                )}
                                                {pr.additions !== undefined && (
                                                    <span className="text-green-600 mr-2">
                                                        +{pr.additions}
                                                    </span>
                                                )}
                                                {pr.deletions !== undefined && (
                                                    <span className="text-red-600">
                                                        -{pr.deletions}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center space-x-2">
                                                {/* PR state badge */}
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    pr.state === 'open' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {pr.state}
                                                </span>
                                                
                                                {/* Merged status badge */}
                                                {pr.state === 'closed' && (
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        pr.merged 
                                                            ? 'bg-purple-100 text-purple-800' 
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {pr.merged ? 'merged' : 'not merged'}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {pr.merged_at 
                                                    ? `Merged: ${new Date(pr.merged_at).toLocaleDateString()}` 
                                                    : `Updated: ${new Date(pr.updated_at).toLocaleDateString()}`
                                                }
                                            </span>
                                        </div>
                                        
                                        {/* Add View Commits button */}
                                        <div className="mt-4 pt-3 border-t border-gray-100 text-right">
                                            <button
                                                onClick={() => navigate(`/commits/${pr.repository.owner}/${pr.repository.name}`)}
                                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                                View All Commits
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Home;
