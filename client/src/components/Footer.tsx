import { Link } from "wouter";
import { GitBranch, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-secondary rounded-full p-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M3 6h18" />
                  <path d="M12 12a6 6 0 0 0 6-6H6a6 6 0 0 0 6 6Z" />
                  <path d="M9 12v8" />
                  <path d="M15 12v8" />
                  <path d="M9 16h6" />
                </svg>
              </div>
              <span className="font-heading font-bold text-xl">Indie Game Randomizer</span>
            </div>
            <p className="text-gray-400">
              Discover hidden indie game gems and expand your gaming horizons.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Navigation</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/" className="hover:text-secondary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-secondary transition-colors">
                  Browse Games
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-secondary transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-secondary transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="https://rawg.io/apidocs" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  For Developers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Partnerships
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Submit a Game
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Connect</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Reddit
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-surface mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Indie Game Randomizer. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-gray-400 hover:text-secondary transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-secondary transition-colors"
              aria-label="Discord"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M9 12h6" />
                <path d="M9 16h6" />
                <path d="M14.5 8H14a1 1 0 1 0 0 2" />
                <path d="M9.5 8H10a1 1 0 1 1 0 2" />
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-secondary transition-colors"
              aria-label="GitHub"
            >
              <GitBranch size={20} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-secondary transition-colors"
              aria-label="Reddit"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8" />
                <path d="M8 12h8" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
