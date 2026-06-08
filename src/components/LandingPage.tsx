import * as React from "react";
import { 
  Trash2, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Check,
  Star,
  Droplets,
  Wind,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import logo from "../assets/logo.png";

export function LandingPage({ onStartBooking, onChoosePlan }: { onStartBooking: () => void; onChoosePlan: (plan: string) => void }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-center">
          <div className="flex items-center gap-4">
            <img src={logo} alt="CleanBinSolutions Logo" className="w-16 h-16 object-contain bg-white rounded-xl shadow-sm p-1" />
            <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">CleanBinSolutions</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4 py-1 px-4 rounded-full text-primary font-semibold">
              #1 Rated Local Bin Cleaning Service
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Stop Holding Your <span className="text-primary">Breath.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
              We professionally clean, sanitize, and deodorize your garbage bins so you don't have to deal with the smell, bacteria, or pests.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={onStartBooking} size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/20">
                Start My Service <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-14 px-8 text-lg rounded-full"
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Pricing
              </Button>
            </div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://picsum.photos/seed/cleaning/800/800"
                alt="Clean Garbage Bin"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border max-w-[240px]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <Droplets size={20} />
                </div>
                <p className="font-bold">Eco-Friendly</p>
              </div>
              <p className="text-sm text-muted-foreground">We use 100% biodegradable cleaning agents.</p>
            </div>
            <div className="absolute -top-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border max-w-[240px]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <Wind size={20} />
                </div>
                <p className="font-bold">Zero Odor</p>
              </div>
              <p className="text-sm text-muted-foreground">Eliminates 99.9% of bacteria and foul smells.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-muted/30 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Why Choose CleanBinSolutions?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              We've perfected the art of bin cleaning with our specialized high-pressure equipment and eco-friendly solutions.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Sparkles className="text-primary" />,
                title: "Deep Sanitization",
                description: "Our 200°F high-pressure water kills germs, bacteria, and viruses instantly."
              },
              {
                icon: <ShieldCheck className="text-primary" />,
                title: "Pest Prevention",
                description: "Clean bins mean no food sources for flies, maggots, rodents, or raccoons."
              },
              {
                icon: <Clock className="text-primary" />,
                title: "Reliable Schedule",
                description: "We arrive on your trash collection day, so your bins are empty and ready."
              },
              {
                icon: <MapPin className="text-primary" />,
                title: "Local Trusted Service",
                description: "Proudly serving Moorpark as a trusted local community business."
              }
            ].map((feature, i) => (
              <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-8">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Simple Plans. Fresh Bins.</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Eco-friendly cleaning with organic essential oils. No contracts, no hidden fees — ever.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2 rounded-full">
              🌿 <span className="text-green-200">First cleaning is on us</span> — free for new subscribers
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {[
              {
                tag: "Every 4 Weeks",
                name: "Essential",
                freq: "Cleaned once a month, after Wednesday pickup",
                price: "19.99",
                period: "per month",
                features: [
                  "Up to 3 bins included",
                  "100% organic eco clean",
                  "Premium deodorizing treatment",
                  "Choose from 3 organic essential oil scents",
                  "Optional bin sticker"
                ],
                popular: false
              },
              {
                tag: "Every 2 Weeks",
                name: "Fresh",
                freq: "Cleaned twice a month, after every other pickup",
                price: "34.99",
                period: "per month",
                features: [
                  "Up to 3 bins included",
                  "100% organic eco clean",
                  "Premium deodorizing treatment",
                  "Choose from 3 organic essential oil scents",
                  "Optional bin sticker"
                ],
                popular: true
              },
              {
                tag: "No Commitment",
                name: "One-Time Clean",
                freq: "Single visit — try us before you subscribe",
                price: "44.99",
                period: "one time",
                features: [
                  "Up to 3 bins included",
                  "100% organic eco clean",
                  "Premium deodorizing treatment",
                  "Choose from 3 organic essential oil scents",
                  "Optional bin sticker"
                ],
                popular: false
              }
            ].map((plan, i) => (
              <div
                key={i}
                className={cn(
                  "relative p-8 rounded-3xl border-2 transition-all",
                  plan.popular
                    ? "border-primary bg-slate-900 text-white shadow-2xl shadow-primary/20 scale-105 z-10"
                    : "border-border bg-white"
                )}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-400 text-slate-900 hover:bg-amber-400">
                    ⭐ Most Popular
                  </Badge>
                )}
                <p className={cn("text-xs font-bold uppercase tracking-widest mb-1", plan.popular ? "text-green-300" : "text-primary")}>
                  {plan.tag}
                </p>
                <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                <p className={cn("text-sm mb-6", plan.popular ? "text-green-200" : "text-muted-foreground")}>
                  {plan.freq}
                </p>
                <div className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-3 text-sm">
                      <div className={cn("w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0", plan.popular ? "bg-white/10" : "bg-green-100")}>
                        <Check size={12} className={plan.popular ? "text-green-300" : "text-green-600"} />
                      </div>
                      <span className={plan.popular ? "text-white/80" : ""}>{f}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={cn("text-5xl font-extrabold", plan.popular ? "text-white" : "text-slate-900")}>
                    ${plan.price}
                  </span>
                  <span className={cn("text-sm", plan.popular ? "text-white/50" : "text-muted-foreground")}>
                    {plan.period}
                  </span>
                </div>
                <p className={cn("text-xs mb-6 inline-block px-3 py-1 rounded-full", plan.popular ? "bg-white/10 text-white/60" : "bg-muted text-muted-foreground")}>
                  +$10 per extra bin
                </p>
                <Button
                  onClick={() => onChoosePlan(plan.name)}
                  variant={plan.popular ? "default" : "outline"}
                  className="w-full h-12 rounded-full"
                >
                  Choose {plan.name}
                </Button>
              </div>
            ))}
          </div>

          {/* Scent options */}
          <div className="text-center mt-12">
            <p className="font-semibold text-slate-800 mb-3">Choose from 3 organic essential oil scents</p>
            <div className="flex justify-center gap-3 flex-wrap">
              {["🍋 Lemon", "🌿 Mint", "💜 Lavender"].map(s => (
                <span key={s} className="bg-white border border-border rounded-full px-4 py-1.5 text-sm font-medium">{s}</span>
              ))}
            </div>
          </div>

          {/* Trust row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 p-8 bg-white rounded-2xl border">
            {[
              { icon: <ShieldCheck size={16} />, label: "No contracts" },
              { icon: <Check size={16} />, label: "No hidden fees" },
              { icon: <Star size={16} />, label: "Cancel anytime" },
              { icon: <Sparkles size={16} />, label: "Eco-friendly & organic" },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-sm font-medium text-muted-foreground justify-center">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">{t.icon}</div>
                {t.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 text-white mb-6">
              <img src={logo} alt="CleanBinSolutions Logo" className="w-10 h-10 object-contain bg-white rounded-md p-0.5" />
              <span className="text-xl font-bold tracking-tight">CleanBinSolutions</span>
            </div>
            <p className="max-w-sm mb-6">
              Making neighborhoods cleaner and fresher, one bin at a time. Our eco-friendly process ensures your home stays healthy and odor-free.
            </p>

          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Support</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Service Areas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-12 border-t border-slate-900 text-center text-xs">
          <p>© 2026 CleanBinSolutions Professional Services. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
