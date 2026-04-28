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
  Wind
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function LandingPage({ onStartBooking }: { onStartBooking: () => void }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
              <Sparkles size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">CleanBinSolutions</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
          </div>
          <Button onClick={onStartBooking} size="sm" className="rounded-full px-6">
            Book Now
          </Button>
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
              #1 Rated Bin Cleaning Service
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
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full">
                View Pricing
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://picsum.photos/seed/user${i}/100/100`}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-white"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
              <div className="text-sm">
                <div className="flex text-yellow-500 mb-0.5">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-muted-foreground font-medium">Trusted by 2,000+ local families</p>
              </div>
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
          <div className="grid md:grid-cols-3 gap-8">
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
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Choose the plan that fits your household needs. No contracts, cancel anytime.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Monthly",
                price: "25",
                period: "per month",
                description: "Our most popular plan for busy families.",
                features: ["1 Clean per month", "Up to 2 bins", "Eco-friendly sanitization", "Deodorizing spray"],
                popular: true
              },
              {
                name: "Weekly",
                price: "15",
                period: "per week",
                description: "Maximum freshness for large households.",
                features: ["Weekly cleaning", "Up to 3 bins", "Premium deodorizing", "Priority scheduling"],
                popular: false
              },
              {
                name: "One-Time",
                price: "45",
                period: "per visit",
                description: "Perfect for a seasonal deep clean.",
                features: ["Single deep clean", "Up to 2 bins", "Full sanitization", "No commitment"],
                popular: false
              }
            ].map((plan, i) => (
              <div 
                key={i} 
                className={cn(
                  "relative p-8 rounded-3xl border transition-all",
                  plan.popular ? "border-primary shadow-xl shadow-primary/5 scale-105 z-10 bg-white" : "bg-white"
                )}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1">
                    Most Popular
                  </Badge>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-extrabold">${plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-muted-foreground mb-8 text-sm">
                  {plan.description}
                </p>
                <div className="space-y-4 mb-8">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <Check size={12} />
                      </div>
                      {f}
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={onStartBooking}
                  variant={plan.popular ? "default" : "outline"} 
                  className="w-full h-12 rounded-full"
                >
                  Choose {plan.name}
                </Button>
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
              <Sparkles size={24} className="text-primary" />
              <span className="text-xl font-bold tracking-tight">CleanBinSolutions</span>
            </div>
            <p className="max-w-sm mb-6">
              Making neighborhoods cleaner and fresher, one bin at a time. Our eco-friendly process ensures your home stays healthy and odor-free.
            </p>
            <div className="flex gap-4">
              {/* Social Icons Placeholder */}
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">
                <Trash2 size={18} />
              </div>
            </div>
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
