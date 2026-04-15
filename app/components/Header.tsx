import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <Logo className="w-10 h-10" />
            <span className="text-2xl font-black text-white">
              RenewalEngine<span className="text-blue-600">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/#solutions" className="text-neutral-300 hover:text-white transition-colors font-semibold">Solutions</a>
            <a href="/#results" className="text-neutral-300 hover:text-white transition-colors font-semibold">Results</a>
            <Link to="/courses" className="text-neutral-300 hover:text-white transition-colors font-semibold">Courses</Link>
            <a href="/#pricing" className="text-neutral-300 hover:text-white transition-colors font-semibold">Pricing</a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button className="bg-blue-600 hover:bg-blue-700 !text-white font-bold rounded-full px-8 py-6 transition-all hover:scale-105">
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white hover:bg-neutral-800"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-black/95 backdrop-blur-xl">
          <div className="px-6 py-6 space-y-4">
            <a href="/#solutions" className="block text-white hover:text-blue-600 py-3 font-semibold text-lg">Solutions</a>
            <a href="/#results" className="block text-white hover:text-blue-600 py-3 font-semibold text-lg">Results</a>
            <Link to="/courses" onClick={() => setMobileMenuOpen(false)} className="block text-white hover:text-blue-600 py-3 font-semibold text-lg">Courses</Link>
            <a href="/#pricing" className="block text-white hover:text-blue-600 py-3 font-semibold text-lg">Pricing</a>
            <div className="pt-4">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 !text-white font-bold rounded-full py-6">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}