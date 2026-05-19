import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';

const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Get in touch</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Have a question about our platform or want to discuss an enterprise plan? 
          We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="flex items-start gap-4">
            <div className="bg-primary-100 dark:bg-primary-900/50 p-3 rounded-lg text-primary-600">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-1">Email</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-2">Our friendly team is here to help.</p>
              <a href="mailto:hello@eventmaster.com" className="text-primary-600 font-medium hover:underline">hello@eventmaster.com</a>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-primary-100 dark:bg-primary-900/50 p-3 rounded-lg text-primary-600">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-1">Office</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-2">Come say hello at our HQ.</p>
              <address className="text-slate-600 dark:text-slate-400 not-italic">
                100 Innovation Way<br />
                San Francisco, CA 94103<br />
                United States
              </address>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-primary-100 dark:bg-primary-900/50 p-3 rounded-lg text-primary-600">
              <Phone size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-1">Phone</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-2">Mon-Fri from 8am to 5pm.</p>
              <a href="tel:+15550000000" className="text-primary-600 font-medium hover:underline">+1 (555) 000-0000</a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <GlassCard className="p-8">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">First name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Last name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                ></textarea>
              </div>
              
              <Button variant="primary" className="w-full py-3">
                Send Message <Send size={18} className="ml-2" />
              </Button>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Contact;
