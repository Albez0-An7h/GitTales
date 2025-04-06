import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        github_username: '',
        batch: ''
    });
    const [saveLoading, setSaveLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Get current user
                const { data: { user }, error: userError } = await supabase.auth.getUser();

                if (userError) throw userError;

                if (user) {
                    setUser(user);

                    // Check if profile exists
                    const { data: profileData, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('user_id', user.id)
                        .single();

                    if (profileError && profileError.code !== 'PGRST116') {
                        // PGRST116 is the error code for "no rows returned"
                        throw profileError;
                    }

                    if (profileData) {
                        setProfile(profileData);
                        setFormData({
                            name: profileData.name || '',
                            github_username: profileData.github_username || '',
                            batch: profileData.batch || ''
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setSaveLoading(true);

        try {
            // Save profile data to Supabase
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    user_id: user.id,
                    name: formData.name,
                    github_username: formData.github_username,
                    batch: formData.batch,
                    created_at: new Date()
                });

            if (error) throw error;

            // Fetch the updated profile
            const { data: updatedProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();

            setProfile(updatedProfile);
            setSuccessMessage('Profile updated successfully! Redirecting to dashboard...');
            
            // Redirect to home page after 2 seconds
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            console.error('Error saving profile:', error);
            setError(error.message);
        } finally {
            setSaveLoading(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/signin');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6">Profile</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                        <span>{error}</span>
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
                        <span>{successMessage}</span>
                    </div>
                )}

                {user ? (
                    <div>
                        <p className="mb-4"><strong>Email:</strong> {user.email}</p>

                        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="github_username" className="block text-sm font-medium text-gray-700">
                                    GitHub Username
                                </label>
                                <input
                                    id="github_username"
                                    name="github_username"
                                    type="text"
                                    required
                                    value={formData.github_username}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="batch" className="block text-sm font-medium text-gray-700">
                                    Batch
                                </label>
                                <input
                                    id="batch"
                                    name="batch"
                                    type="text"
                                    required
                                    value={formData.batch}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={saveLoading}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    {saveLoading ? 'Saving...' : 'Save Profile'}
                                </button>
                            </div>
                        </form>

                        <button
                            onClick={handleSignOut}
                            className="w-full mt-6 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <p>You are not logged in. Please sign in to view this page.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
