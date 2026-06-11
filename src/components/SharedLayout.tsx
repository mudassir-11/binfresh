import * as React from "react";
import logo from "../assets/logo.png";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
        <a href="/" className="flex items-center gap-4 hover:opacity-90 transition-opacity">
          <img src={logo} alt="CleanBinSolutions Logo" className="w-16 h-16 object-contain bg-white rounded-xl shadow-sm p-1" />
          <span className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900">CleanBinSolutions</span>
        </a>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 px-4 mt-auto">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        <div className="col-span-2">
          <div className="flex items-center gap-2 text-white mb-6">
            <img src={logo} alt="CleanBinSolutions Logo" className="w-10 h-10 object-contain bg-white rounded-md p-0.5" />
            <span className="text-xl font-bold tracking-tight">CleanBinSolutions</span>
          </div>
          <p className="max-w-sm mb-6 leading-relaxed">
            Making neighborhoods cleaner and fresher, one bin at a time. Our eco-friendly process ensures your home stays healthy and odor-free.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Company</h4>
          <ul className="space-y-4 text-sm">
            <li><a href="/?page=about" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="/?page=contact" className="hover:text-white transition-colors">Contact</a></li>
            <li><a href="/?page=privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Support</h4>
          <ul className="space-y-4 text-sm">
            <li><a href="/?page=faq" className="hover:text-white transition-colors">FAQ</a></li>
            <li><a href="/?page=areas" className="hover:text-white transition-colors">Service Areas</a></li>
            <li><a href="/?page=terms" className="hover:text-white transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-12 border-t border-slate-900 text-center text-xs text-slate-500">
        <p>© 2026 CleanBinSolutions Professional Services. All rights reserved.</p>
      </div>
    </footer>
  );
}
