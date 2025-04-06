import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <nav className="bg-indigo-600 text-white px-4 py-2 flex justify-between items-center">
      <div className="font-bold text-lg">GitTales</div>
      <div className="space-x-4">
        {!isHomePage && (
          <Link to="/" className="hover:text-indigo-200 transition-colors">
            Back to Dashboard
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
