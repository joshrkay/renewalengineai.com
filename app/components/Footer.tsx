import { Linkedin, Mail } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-black text-neutral-400 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <Logo className="w-10 h-10" />
              <span className="text-2xl font-black text-white">
                RenewalEngine<span className="text-blue-600">AI</span>
              </span>
            </div>
            <p className="text-neutral-500 mb-6 leading-relaxed">
              RenewalEngineAI provides done-for-you AI automation services for independent insurance agencies, including renewal campaigns, instant lead response systems, quote follow-up automation, and agency operations management.
            </p>
            <div className="flex items-center gap-3 text-white">
              <Mail className="h-5 w-5 text-blue-600" />
              <a href="mailto:hello@renewalengineai.com" className="font-bold hover:text-blue-400 transition-colors">hello@renewalengineai.com</a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-black mb-4">Services</h4>
            <ul className="space-y-3">
              <li><a href="#pricing" className="hover:text-white transition-colors">AI Renewal Audit</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Build & Launch</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Managed AI Operations</a></li>
              <li><a href="#solutions" className="hover:text-white transition-colors">All Solutions</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-black mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="#results" className="hover:text-white transition-colors">Results</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="mailto:hello@renewalengineai.com" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-black mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="/privacy.html" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms.html" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-500 text-sm">
            &copy; 2026 RenewalEngineAI. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a href="https://www.linkedin.com/company/renewalengineai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="mailto:hello@renewalengineai.com" className="hover:text-white transition-colors">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
