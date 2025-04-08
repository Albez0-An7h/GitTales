import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './SignUp';
import Signin from './Signin';
import Profile from './Profile';
import Home from './Home';
import ViewCommits from './ViewCommits';
import Error404 from './Error404';
import NameList from './NameList';
import ViewProfile from './ViewProfile';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Navigation from './components/Navigation';
import Footer from './Footer';
import AuthRedirect from './components/AuthRedirect';

function App() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Get the initial session
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setIsLoading(false);
    };
    
    getSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    
    // Cleanup function
    return () => subscription?.unsubscribe();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <AuthRedirect />
        <div className="flex-grow">
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Home />} />
            <Route path="/names" element={<NameList />} />
            <Route path="/view-profile/:userId" element={<ViewProfile />} />
            <Route path="/commits/:owner/:repo" element={<ViewCommits />} />
            <Route path="/commits/:owner/:repo/:username" element={<ViewCommits />} />
            {/* Add this catch-all route at the end to handle 404s */}
            <Route path="*" element={<Error404 />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
