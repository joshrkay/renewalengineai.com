import { Linkedin, Mail } from "lucide-react";
import { Logo } from "@/components/marketing/Logo";

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
              <li><a href="/how-it-works#phase-1" className="hover:text-white transition-colors">AI Renewal Audit ($1,500)</a></li>
              <li><a href="/how-it-works#phase-2" className="hover:text-white transition-colors">Build &amp; Launch ($6,000)</a></li>
              <li><a href="/how-it-works#phase-3" className="hover:text-white transition-colors">Managed AI Operations ($2,500/mo)</a></li>
              <li><a href="/for-independent-agencies" className="hover:text-white transition-colors">For Independent Agencies</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-black mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><a href="/how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="/resources" className="hover:text-white transition-colors">Guides &amp; Playbooks</a></li>
              <li><a href="/guides/5-ai-automations" className="hover:text-white transition-colors">Free: 5 AI Automations Guide</a></li>
              <li><a href="/courses" className="hover:text-white transition-colors">Courses</a></li>
              <li><a href="/mastermind" className="hover:text-white transition-colors">Mastermind</a></li>
              <li><a href="/team/josh-kay" className="hover:text-white transition-colors">Team</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-black mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
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
