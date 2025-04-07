import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const AuthRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Handle auth redirect 
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                navigate('/profile');
            } else if (event === 'SIGNED_OUT') {
                navigate('/signin');
            }
        });

        // Process the hash fragment on load (for auth redirects)
        const handleRedirect = async () => {
            const hash = window.location.hash;
            if (hash && hash.includes('access_token')) {
                // Process the redirect
                const { data, error } = await supabase.auth.getSession();
                if (data.session) {
                    navigate('/profile');
                } else if (error) {
                    console.error('Auth error:', error);
                    navigate('/signin');
                }
            }
        };

        handleRedirect();

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [navigate]);

    return null;
};

export default AuthRedirect;
