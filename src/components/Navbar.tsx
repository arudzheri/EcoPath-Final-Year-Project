import { Link } from "react-router-dom";
import NavLink from "./NavLink";

const Navbar = () => {
  return (
    <nav className="w-full bg-white border-b border-gray-300 shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-gray-900">
          EcoPath
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <NavLink to="/" label="Home" />
          <NavLink to="/find" label="Find Itineraries" />
          <NavLink to="/manage" label="Manage Itineraries" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
