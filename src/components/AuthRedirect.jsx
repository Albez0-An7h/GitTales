import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const AuthRedirect = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [initialAuthCheckDone, setInitialAuthCheckDone] = useState(false);

    useEffect(() => {
        // Check session only once on initial load
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            setInitialAuthCheckDone(true);
            // Only redirect if not signed in
            if (!data.session) {
                navigate('/signin');
            }
        };
        
        checkSession();
        
        // Handle auth redirect but only for sign out events
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                navigate('/signin');
            } else if (event === 'SIGNED_IN' && session) {
                // For sign in, only redirect if we're on the sign in or sign up page
                if (location.pathname === '/signin' || location.pathname === '/signup') {
                    navigate('/profile');
                }
            }
        });

        // Process the hash fragment on load (for auth redirects)
        const handleRedirect = async () => {
            const hash = window.location.hash;
            if (hash && hash.includes('access_token')) {
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
    }, [navigate, location.pathname]);

    return null;
};

export default AuthRedirect;
