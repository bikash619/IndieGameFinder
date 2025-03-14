import { Link } from "wouter";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationLinks = [
    { name: "Home", path: "/" },
    { name: "Browse", path: "/" },
    { name: "Collections", path: "/" },
    { name: "About", path: "/" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-primary border-b border-surface">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <a className="flex items-center space-x-2">
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
          </a>
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          {navigationLinks.map((link) => (
            <Link key={link.name} href={link.path}>
              <a className="text-text hover:text-secondary transition-colors">
                {link.name}
              </a>
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-text hover:text-secondary">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-background border-surface">
              <div className="flex flex-col space-y-4 mt-8">
                {navigationLinks.map((link) => (
                  <Link key={link.name} href={link.path}>
                    <a className="text-text hover:text-secondary transition-colors py-2">
                      {link.name}
                    </a>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          
          <Button className="hidden md:block bg-secondary hover:bg-opacity-90 transition-colors">
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
