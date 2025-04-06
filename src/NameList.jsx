import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Link } from 'react-router-dom';

const NameList = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .order('name');

                if (error) throw error;
                
                setProfiles(data || []);
            } catch (error) {
                console.error('Error fetching profiles:', error);
                setError('Failed to load profiles. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfiles();
    }, []);

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
                                            <div className="ml-3">
                                                <p className="text-lg font-medium text-indigo-600">{profile.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    @{profile.github_username} · {profile.batch}
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
