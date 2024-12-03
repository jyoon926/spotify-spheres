import React, { useState, useRef, useEffect } from "react";
import { FaEllipsis } from "react-icons/fa6";

interface ThreeDotMenuProps {
  children: React.ReactNode;
}

const ThreeDotMenu: React.FC<ThreeDotMenuProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={toggleMenu}>
        <FaEllipsis className="text-xl" />
      </button>
      <div
        className={`absolute right-0 w-48 rounded bg-lightGlass backdrop-blur shadow-md z-10 p-3 duration-300 ${
          !isOpen && "pointer-events-none opacity-0"
        }`}
      >
        <div>{children}</div>
      </div>
    </div>
  );
};

export default ThreeDotMenu;
