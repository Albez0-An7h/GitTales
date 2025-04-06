import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const isNamesPage = location.pathname === '/names';
  const isHomePage = location.pathname === '/';

  // Only show navigation when user is logged in (on home page or names page)
  if (!isHomePage && !isNamesPage) return null;

  return (
    <nav className="bg-indigo-600 text-white px-4 py-2 flex justify-between items-center">
      <div className="font-bold text-lg">GitTales</div>
      <div className="space-x-4">
        {isNamesPage ? (
          <Link to="/" className="hover:text-indigo-200 transition-colors">
            Back to Dashboard
          </Link>
        ) : (
          <Link to="/names" className="hover:text-indigo-200 transition-colors">
            View All Profiles
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
