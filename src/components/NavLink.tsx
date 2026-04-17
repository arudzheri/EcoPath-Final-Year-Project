import { NavLink as RouterNavLink } from "react-router-dom";

interface Props {
  to: string;
  label: string;
  icon?: React.ReactNode;
}

const NavLink = ({ to, label, icon }: Props) => {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
        ${isActive ? "bg-gray-200 text-gray-900" : "text-gray-500 hover:bg-gray-200 hover:text-gray-900"}`
      }
    >
      {icon}
      {label}
    </RouterNavLink>
  );
};

export default NavLink;
