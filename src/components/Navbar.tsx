import { Link, useLocation } from "react-router-dom";
import { Leaf } from "lucide-react";

const NAV_ITEMS = [
  { label: "HOME", path: "/" },
  { label: "FIND ITINERARIES", path: "/find" },
  { label: "MANAGE ITINERARIES", path: "/manage" },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-background/90 backdrop-blur-md border-b border-border">
      <Link to="/" className="flex items-center gap-2">
        <Leaf className="h-7 w-7 text-primary" />
        <span className="font-heading text-2xl font-extrabold tracking-tight">
          <span className="text-primary">ECO</span>
          <span className="text-foreground">PATH</span>
        </span>
      </Link>
      <div className="flex items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`px-5 py-2 font-heading text-sm font-bold tracking-wider transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
