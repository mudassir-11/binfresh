import * as React from "react";
import { CheckCircle2, Calendar, MapPin, Sparkles, CreditCard, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface SuccessData {
  planName: string;
  serviceType: string;
  binCount: number;
  date: string;
  scent: string;
  totalPrice: string;
  name: string;
  email: string;
  city: string;
  confirmationNumber: string;
}

export function SuccessPage({ onReturn }: { onReturn: () => void }) {
  const [data, setData] = React.useState<SuccessData | null>(null);

  React.useEffect(() => {
    const raw = localStorage.getItem("binfresh_booking");
    if (raw) {
      try {
        setData(JSON.parse(raw));
      } catch {
        // ignore parse errors
      }
    }
    // Clear the URL params cleanly without reload
    window.history.replaceState({}, "", "/");
  }, []);

  const isSubscription = data?.serviceType !== "one-time";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        {/* ── Check animation ─────────────────────────────────────────────── */}
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center ring-8 ring-green-50"
          >
            <CheckCircle2 size={52} className="text-green-500" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-extrabold mb-2 text-slate-900">
            {isSubscription ? "Subscription Confirmed! 🎉" : "Booking Confirmed! 🎉"}
          </h1>
          <p className="text-muted-foreground">
            {data
              ? `Thank you, ${data.name}! A confirmation email is on its way to ${data.email}.`
              : "Your booking has been confirmed. Check your email for details."}
          </p>
        </motion.div>

        {/* ── Details card ────────────────────────────────────────────────── */}
        {data && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white border rounded-2xl shadow-sm overflow-hidden mb-6"
          >
            {/* Header */}
            <div className="bg-primary px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-primary-foreground/70 font-bold uppercase tracking-widest mb-0.5">
                  {isSubscription ? "Subscription" : "One-Time Service"}
                </p>
                <p className="text-white font-bold text-lg">{data.planName}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-extrabold text-white">${data.totalPrice}</p>
                <p className="text-xs text-primary-foreground/70">
                  {isSubscription ? "per month" : "one time"}
                </p>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 divide-x divide-y divide-border">
              <div className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar size={14} />
                  <span className="text-xs uppercase font-bold tracking-wide">First Clean</span>
                </div>
                <p className="font-semibold text-sm">{data.date || "To be confirmed"}</p>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Sparkles size={14} />
                  <span className="text-xs uppercase font-bold tracking-wide">Scent</span>
                </div>
                <p className="font-semibold text-sm">
                  {data.scent === "Lemon" ? "🍋" : data.scent === "Mint" ? "🌿" : "💜"}{" "}
                  {data.scent}
                </p>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <MapPin size={14} />
                  <span className="text-xs uppercase font-bold tracking-wide">Location</span>
                </div>
                <p className="font-semibold text-sm">{data.city || "Confirmed"}</p>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <CreditCard size={14} />
                  <span className="text-xs uppercase font-bold tracking-wide">Status</span>
                </div>
                <p className="font-semibold text-sm">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    {isSubscription ? "Active" : "Scheduled"}
                  </span>
                </p>
              </div>
            </div>

            {/* Confirmation number */}
            {data.confirmationNumber && (
              <div className="px-6 py-3 bg-muted/50 border-t flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Confirmation #</span>
                <span className="text-xs font-mono font-semibold text-slate-700">
                  {data.confirmationNumber}
                </span>
              </div>
            )}
          </motion.div>
        )}

        {/* ── Subscription note ────────────────────────────────────────────── */}
        {isSubscription && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl mb-6 text-sm text-blue-700"
          >
            <RotateCcw size={16} className="mt-0.5 flex-shrink-0 text-blue-500" />
            <div className="flex flex-col gap-2">
              <p>
                Your subscription renews monthly. You can cancel anytime — just email us or manage your account online.
              </p>
              <a 
                href={import.meta.env.VITE_STRIPE_PORTAL_URL || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800 hover:text-blue-900 mt-1"
              >
                Manage Subscription &rarr;
              </a>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={() => {
              localStorage.removeItem("binfresh_booking");
              onReturn();
            }}
            className="w-full h-12 rounded-full text-lg"
          >
            Back to Home
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
