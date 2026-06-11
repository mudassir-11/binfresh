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
import { supabase } from "../lib/supabase";
import { Navbar, Footer } from "./SharedLayout";

export function LandingPage({ onStartBooking, onChoosePlan }: { onStartBooking: () => void; onChoosePlan: (plan: string) => void }) {
  const [reviews, setReviews] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!supabase) return;
    
    supabase
      .from('reviews')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setReviews(data);
        } else {
          // Fallback to mock data if no reviews exist yet
          setReviews([
            {
              id: 'mock1',
              customer_name: "Sarah Jenkins",
              rating: 5,
              comment: "I can finally open my garage without holding my breath! The lemon scent is amazing. Best $20 I've spent this month.",
              photo_url: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&q=80&w=400"
            },
            {
              id: 'mock2',
              customer_name: "Mike T.",
              rating: 5,
              comment: "We had a serious fly problem around our bins. CleanBinSolutions came out, pressure washed them, and the flies are completely gone. Highly recommend!",
              photo_url: null
            }
          ]);
        }
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-slate-50">
      {/* Ambient Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-blue-400/20 blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[40%] rounded-full bg-green-400/20 blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Badge variant="secondary" className="mb-6 py-1.5 px-5 rounded-full text-primary font-bold shadow-sm bg-white/80 backdrop-blur-sm border border-white/40">
              <Sparkles className="w-3 h-3 mr-2 inline text-amber-500" /> #1 Rated Local Bin Cleaning Service
            </Badge>
            <h1 className="text-5xl lg:text-[5.5rem] font-extrabold tracking-tight leading-[1.05] mb-6 text-slate-900 drop-shadow-sm">
              Stop Holding <br/> Your <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-emerald-400">Breath.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-lg leading-relaxed font-medium">
              We professionally clean, sanitize, and deodorize your garbage bins so you don't have to deal with the smell, bacteria, or pests.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Button onClick={onStartBooking} size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/30 hover:scale-105 transition-transform duration-300">
                Start My Service <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-14 px-8 text-lg rounded-full bg-white/50 backdrop-blur-sm border-2 hover:bg-white/80 transition-colors"
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Pricing
              </Button>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Already a customer? <a href="https://billing.stripe.com/p/login/fZu28sgEg4OL5W06C73Ru00" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">Manage your subscription</a>
            </p>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/50 bg-white/20 backdrop-blur-md p-2">
              <img
                src="https://picsum.photos/seed/cleaning/800/800"
                alt="Clean Garbage Bin"
                className="w-full h-full object-cover rounded-[2rem]"
                referrerPolicy="no-referrer"
              />
            </div>
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white max-w-[240px]"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-md">
                  <Droplets size={20} />
                </div>
                <p className="font-extrabold text-slate-800">Eco-Friendly</p>
              </div>
              <p className="text-sm text-slate-500 font-medium leading-tight">We use 100% biodegradable cleaning agents.</p>
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white max-w-[240px]"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-full flex items-center justify-center text-white shadow-md">
                  <Wind size={20} />
                </div>
                <p className="font-extrabold text-slate-800">Zero Odor</p>
              </div>
              <p className="text-sm text-slate-500 font-medium leading-tight">Eliminates 99.9% of bacteria and foul smells.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 text-slate-900">Why Choose CleanBinSolutions?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">
              We've perfected the art of bin cleaning with our specialized high-pressure equipment and eco-friendly solutions.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Sparkles className="text-white w-6 h-6" />,
                title: "Deep Sanitization",
                description: "Our 200°F high-pressure water kills germs, bacteria, and viruses instantly.",
                color: "from-emerald-400 to-green-600"
              },
              {
                icon: <ShieldCheck className="text-white w-6 h-6" />,
                title: "Pest Prevention",
                description: "Clean bins mean no food sources for flies, maggots, rodents, or raccoons.",
                color: "from-blue-400 to-indigo-600"
              },
              {
                icon: <Clock className="text-white w-6 h-6" />,
                title: "Reliable Schedule",
                description: "We arrive on your trash collection day, so your bins are empty and ready.",
                color: "from-amber-400 to-orange-500"
              },
              {
                icon: <MapPin className="text-white w-6 h-6" />,
                title: "Local Trusted Service",
                description: "Proudly serving Moorpark as a trusted local community business.",
                color: "from-pink-400 to-rose-600"
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="border border-white/60 bg-white/40 backdrop-blur-lg shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all duration-300 h-full">
                  <CardContent className="pt-8">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br shadow-lg ${feature.color}`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-extrabold mb-3 text-slate-800">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 relative z-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-6 py-1.5 px-5 rounded-full text-primary font-bold shadow-sm bg-white/80 backdrop-blur-sm border border-white/40">
              Real Customer Reviews
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 text-slate-900">What Our Customers Say</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">
              Don't just take our word for it. See the gleaming results and hear from our happy neighbors.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="border border-white/60 bg-white/40 backdrop-blur-lg shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all duration-300 h-full flex flex-col overflow-hidden rounded-3xl">
                  {review.photo_url && (
                    <div className="h-56 w-full bg-slate-900 flex items-center justify-center relative">
                      <img src={review.photo_url} alt="Bin before and after" className="w-full h-full object-cover opacity-90" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                    </div>
                  )}
                  <CardContent className="pt-8 px-8 pb-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className={`w-5 h-5 ${j < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <p className="text-slate-700 italic mb-8 flex-1 leading-relaxed text-lg font-medium">"{review.comment}"</p>
                    <div className="flex items-center gap-4 mt-auto">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-primary/20">
                        {review.customer_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900">{review.customer_name}</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">Verified Customer</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button 
              onClick={() => window.location.assign("/?review=true")}
              variant="outline" 
              size="lg" 
              className="rounded-full border-2 border-primary text-primary bg-white/50 backdrop-blur-sm hover:bg-primary/5 px-10 h-14 text-lg font-bold shadow-lg shadow-primary/5 hover:scale-105 transition-transform"
            >
              Leave a Review
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 text-slate-900">Simple Plans. Fresh Bins.</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">
              Eco-friendly cleaning with organic essential oils. No contracts, no hidden fees — ever.
            </p>
            <div className="mt-6 inline-flex flex-col sm:flex-row items-center gap-3 bg-slate-900 text-white text-sm font-bold px-6 py-3 rounded-full shadow-lg shadow-slate-900/20">
              <div className="flex items-center gap-2"><Sparkles size={16} className="text-amber-400" /> <span className="text-green-300">First cleaning is on us!</span></div>
              <div className="hidden sm:block text-slate-600">•</div>
              <div>
                Text your address to <a href="sms:+18052980888" className="underline decoration-green-400 hover:text-green-300 transition-colors select-all">+1 (805) 298-0888</a>
              </div>
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
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
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className={cn(
                  "relative p-8 rounded-[2rem] transition-all h-full flex flex-col",
                  plan.popular
                    ? "border-4 border-primary bg-slate-900 text-white shadow-2xl shadow-primary/30 lg:scale-110 z-10"
                    : "border border-white bg-white/60 backdrop-blur-lg shadow-xl shadow-slate-200/50"
                )}
              >
                {plan.popular && (
                  <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white border-none shadow-lg font-bold text-sm">
                    ⭐ Most Popular
                  </Badge>
                )}
                <p className={cn("text-xs font-black uppercase tracking-widest mb-2", plan.popular ? "text-green-400" : "text-primary")}>
                  {plan.tag}
                </p>
                <h3 className={cn("text-3xl font-extrabold mb-2", plan.popular ? "text-white" : "text-slate-900")}>{plan.name}</h3>
                <p className={cn("text-sm font-medium mb-8 flex-1", plan.popular ? "text-slate-300" : "text-slate-500")}>
                  {plan.freq}
                </p>
                <div className="space-y-4 mb-8">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-3 text-sm font-medium">
                      <div className={cn("w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0", plan.popular ? "bg-white/10" : "bg-primary/10")}>
                        <Check size={14} className={plan.popular ? "text-green-400" : "text-primary"} />
                      </div>
                      <span className={plan.popular ? "text-slate-200" : "text-slate-700"}>{f}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-auto pt-8 border-t border-dashed border-white/20">
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={cn("text-5xl font-black tracking-tight", plan.popular ? "text-white" : "text-slate-900")}>
                      ${plan.price}
                    </span>
                    <span className={cn("text-sm font-bold", plan.popular ? "text-white/50" : "text-slate-400")}>
                      /{plan.period}
                    </span>
                  </div>
                  <p className={cn("text-xs font-bold mb-6 inline-block px-3 py-1 rounded-full", plan.popular ? "bg-white/10 text-white/60" : "bg-slate-100 text-slate-500")}>
                    +$10 per extra bin
                  </p>
                  <Button
                    onClick={() => onChoosePlan(plan.name)}
                    variant={plan.popular ? "default" : "outline"}
                    className={cn(
                      "w-full h-14 rounded-full text-lg font-bold transition-transform hover:scale-105",
                      plan.popular ? "bg-gradient-to-r from-primary to-emerald-400 hover:from-primary hover:to-emerald-500 border-none shadow-lg shadow-primary/20" : "bg-white"
                    )}
                  >
                    Choose {plan.name}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 p-8 bg-white/60 backdrop-blur-md rounded-3xl border border-white shadow-xl shadow-slate-200/50 max-w-5xl mx-auto"
          >
            {[
              { icon: <ShieldCheck size={20} />, label: "No contracts" },
              { icon: <Check size={20} />, label: "No hidden fees" },
              { icon: <Star size={20} />, label: "Cancel anytime" },
              { icon: <Sparkles size={20} />, label: "100% Eco-friendly" },
            ].map((t, i) => (
              <div key={i} className="flex flex-col items-center gap-3 text-sm font-bold text-slate-600 justify-center text-center">
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-primary">{t.icon}</div>
                {t.label}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
