import * as React from "react";
import { ArrowLeft, Mail, Phone, Clock, MapPin } from "lucide-react";
import { Navbar, Footer } from "./SharedLayout";
import { Button } from "@/components/ui/button";

export function StaticPageLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navbar />
      
      {/* Hero Section for Info Pages */}
      <div className="pt-32 pb-16 bg-slate-900 text-white px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{title}</h1>
        <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-12 flex-1 w-full">
        <Button 
          variant="ghost" 
          className="mb-8 text-slate-500 hover:text-slate-900 -ml-4"
          onClick={() => window.location.assign("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Button>
        <div className="prose prose-slate prose-lg max-w-none text-slate-700">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export function AboutPage() {
  return (
    <StaticPageLayout title="About Us">
      <p className="text-lg leading-relaxed mb-6">
        Founded in 2026 by brothers Murtuza and Mujtaba Syed, CleanBinSolutions was born out of a simple necessity: eliminating the unbearable odors and hygiene hazards associated with dirty driveway trash bins.
      </p>
      <p className="text-lg leading-relaxed mb-6">
        As local residents, we understood the frustration of holding your breath every time you walked past the garage or took out the trash. We realized that simply hosing down bins wasn't enough to kill the harmful bacteria, maggots, and pests that thrive in those environments. 
      </p>
      <p className="text-lg leading-relaxed mb-6">
        Our mission is to provide a professional, eco-friendly, and highly effective sanitization service that restores the cleanliness of your home's exterior. We use high-pressure cleaning systems and natural deodorizers to ensure your bins don't just look clean—they truly are clean.
      </p>
    </StaticPageLayout>
  );
}

export function ContactPage() {
  return (
    <StaticPageLayout title="Contact & Support">
      <div className="bg-white p-8 rounded-2xl shadow-sm border mb-8">
        <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <Phone size={20} />
            </div>
            <div>
              <p className="font-bold text-lg">Phone</p>
              <p className="text-slate-600 mb-1">Call or text us directly:</p>
              <a href="tel:+18052980888" className="text-primary font-semibold hover:underline text-lg">+1 (805) 298-0888</a>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <p className="font-bold text-lg">Operating Hours</p>
              <p className="text-slate-600">Monday - Friday: 9:00 AM - 5:00 PM</p>
              <p className="text-slate-600">Saturday & Sunday: Closed</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <p className="font-bold text-lg">Service Area</p>
              <p className="text-slate-600">Proudly serving Moorpark, CA exclusively.</p>
            </div>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  );
}

export function FAQPage() {
  const faqs = [
    {
      q: "Do I need to be home for the service?",
      a: "Yes. Because our eco-friendly cleaning system requires a direct water connection to operate effectively, we ask that you be available to provide access to your home's water supply."
    },
    {
      q: "How long does the cleaning take?",
      a: "It takes our professional team approximately 15 minutes to thoroughly clean, sanitize, and deodorize each bin."
    },
    {
      q: "Do my bins need to be empty?",
      a: "Absolutely. For the health and safety of our technicians, and to ensure a deep clean, your bins must be completely free of all trash, yard waste, and debris prior to our arrival."
    },
    {
      q: "What areas do you serve?",
      a: "We currently provide exclusive, dedicated service to the Moorpark community."
    }
  ];

  return (
    <StaticPageLayout title="Frequently Asked Questions">
      <div className="space-y-8">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-xl font-bold mb-3 text-slate-900">{faq.q}</h3>
            <p className="text-slate-700 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </StaticPageLayout>
  );
}

export function ServiceAreaPage() {
  return (
    <StaticPageLayout title="Service Areas">
      <div className="bg-white p-8 rounded-2xl shadow-sm border text-center">
        <MapPin size={48} className="mx-auto text-primary mb-6" />
        <h2 className="text-3xl font-bold mb-4">Moorpark, CA</h2>
        <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
          CleanBinSolutions is proud to be a locally owned and operated business exclusively serving the Moorpark community. 
        </p>
        <p className="text-sm text-slate-500 italic">
          By focusing our routes solely within Moorpark, we are able to provide unparalleled reliability, faster response times, and highly personalized service to our neighbors.
        </p>
      </div>
    </StaticPageLayout>
  );
}

export function LegalPages({ type }: { type: 'terms' | 'privacy' }) {
  if (type === 'terms') {
    return (
      <StaticPageLayout title="Terms of Service">
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">Last Updated: June 2026</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>By booking a service with CleanBinSolutions ("Company", "we", "us"), registered in the State of California, you agree to comply with and be bound by these Terms of Service.</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">2. Service Requirements</h2>
          <p>To perform our sanitization services effectively, the following conditions must be met by the customer:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Empty Bins:</strong> All trash bins must be completely empty of waste, trash, and debris prior to our arrival. If bins contain trash, service cannot be rendered and you may still be charged.</li>
            <li><strong>Water Access:</strong> Our specialized cleaning equipment requires access to your property's water supply. A resident must be available to provide access to a water source during the scheduled service time.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Subscriptions & Cancellations</h2>
          <p>Subscription plans are billed automatically. You may manage, pause, or cancel your subscription at any time through our customer portal. Cancellations must be made at least 24 hours prior to your next scheduled service to avoid being charged for that visit.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Liability</h2>
          <p>While we use professional-grade, eco-friendly equipment, CleanBinSolutions is not responsible for pre-existing damage to your trash receptacles (such as cracks, broken wheels, or missing lids) that may become apparent after dirt and grime are removed.</p>
        </div>
      </StaticPageLayout>
    );
  }

  return (
    <StaticPageLayout title="Privacy Policy">
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground">Last Updated: June 2026</p>
        
        <p>CleanBinSolutions ("Company", "we", "us") respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website or book our services.</p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Data We Collect</h2>
        <p>We collect essential information required to provide our cleaning services, including your name, service address, phone number, and email address. Payment information is processed securely through Stripe; we do not store your full credit card details.</p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Your Data</h2>
        <p>We use your data solely to:</p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Schedule and perform bin cleaning services at your address.</li>
          <li>Process payments and subscriptions.</li>
          <li>Send service reminders, receipts, and request customer reviews.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">3. Data Sharing</h2>
        <p>We do not sell, trade, or rent your personal information to third parties. Data is only shared with trusted essential service providers (such as Stripe for payments and Resend for emails) strictly for the purpose of operating our business.</p>

        <h2 className="text-2xl font-bold mt-8 mb-4">4. Contact Us</h2>
        <p>If you have any questions about this privacy policy, please contact us at +1 (805) 298-0888.</p>
      </div>
    </StaticPageLayout>
  );
}
