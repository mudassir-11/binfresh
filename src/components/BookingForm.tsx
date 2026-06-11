import * as React from "react";
import { CalendarIcon, Sparkles, MapPin, CheckCheck, AlertCircle, Lock, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "motion/react";

// ─── Service Area Configuration ──────────────────────────────────────────────
const SUPPORTED_ZIPS: Record<string, string> = {
  "93021": "Moorpark, CA",
};

type ZipStatus = "idle" | "valid" | "invalid";

function getZipStatus(zip: string): ZipStatus {
  if (zip.length < 5) return "idle";
  return zip in SUPPORTED_ZIPS ? "valid" : "invalid";
}

// ─── Referral Options ─────────────────────────────────────────────────────────
const REFERRAL_OPTIONS = [
  { label: "🏘️ Neighbor", value: "Neighbor" },
  { label: "📄 Flyer", value: "Flyer" },
  { label: "👍 Facebook", value: "Facebook" },
  { label: "🔍 Google Search", value: "Google Search" },
  { label: "📸 Instagram", value: "Instagram" },
  { label: "👨‍👩‍👧 Friend / Family", value: "Friend / Family" },
  { label: "💬 Other", value: "Other" },
];

// ─── Plans ────────────────────────────────────────────────────────────────────
type ServiceType = "monthly" | "bi-monthly" | "one-time";

const PLANS: Record<string, { serviceType: ServiceType; price: number; label: string }> = {
  "Essential": { serviceType: "monthly", price: 19.99, label: "Essential – Every 4 Weeks" },
  "Fresh": { serviceType: "bi-monthly", price: 34.99, label: "Fresh – Every 2 Weeks" },
  "One-Time Clean": { serviceType: "one-time", price: 44.99, label: "One-Time Clean" },
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface BookingData {
  serviceType: ServiceType;
  binCount: number;
  date: Date | undefined;
  name: string;
  email: string;
  address: string;
  phone: string;
  city: string;
  zipCode: string;
  scent: string;
  referralSource: string;
  subscriptionAgreed: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function BookingForm({ onBack, selectedPlan }: { onBack: () => void; selectedPlan?: string }) {
  const planInfo = selectedPlan ? PLANS[selectedPlan] : undefined;
  const [step, setStep] = React.useState(planInfo ? 2 : 1);
  const [bookingData, setBookingData] = React.useState<BookingData>({
    serviceType: planInfo?.serviceType ?? "monthly",
    binCount: 1,
    date: undefined,
    name: "",
    email: "",
    address: "",
    phone: "",
    city: "",
    zipCode: "",
    scent: "Lemon",
    referralSource: "",
    subscriptionAgreed: false,
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  // ── Derived values ──────────────────────────────────────────────────────────
  const zipStatus = getZipStatus(bookingData.zipCode);
  const isSubscriptionPlan = bookingData.serviceType === "monthly" || bookingData.serviceType === "bi-monthly";
  const effectiveServiceType = planInfo?.serviceType ?? bookingData.serviceType;

  const getPrice = () => {
    const base = planInfo?.price ?? (bookingData.serviceType === "one-time" ? 44.99 : bookingData.serviceType === "bi-monthly" ? 34.99 : 19.99);
    const extras = Math.max(0, bookingData.binCount - 3) * 10;
    return (base + extras).toFixed(2);
  };

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleZipChange = (zip: string) => {
    const clean = zip.replace(/\D/g, "").slice(0, 5);
    const city = SUPPORTED_ZIPS[clean] ?? "";
    setBookingData({ ...bookingData, zipCode: clean, city });
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => Math.max(planInfo ? 2 : 1, s - 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Save booking data to localStorage so success page can display it
      const serviceDate = bookingData.date ? format(bookingData.date, "PPP") : "";
      localStorage.setItem(
        "binfresh_booking",
        JSON.stringify({
          planName: planInfo?.label ?? bookingData.serviceType,
          serviceType: effectiveServiceType,
          binCount: bookingData.binCount,
          date: serviceDate,
          scent: bookingData.scent,
          totalPrice: getPrice(),
          name: bookingData.name,
          email: bookingData.email,
          city: bookingData.city,
          confirmationNumber: `BF-${Date.now().toString(36).toUpperCase()}`,
        })
      );

      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planName: selectedPlan ?? bookingData.serviceType,
          serviceType: effectiveServiceType,
          binCount: bookingData.binCount,
          totalPrice: getPrice(),
          name: bookingData.name,
          email: bookingData.email,
          phone: bookingData.phone,
          address: bookingData.address,
          city: bookingData.city,
          zipCode: bookingData.zipCode,
          date: bookingData.date ? format(bookingData.date, "yyyy-MM-dd") : "",
          scent: bookingData.scent,
          referralSource: bookingData.referralSource,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err: any) {
      console.error("Checkout error:", err);
      setSubmitError(err?.message ?? "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const totalSteps = planInfo ? 2 : 3;

  // ── Step 2 can proceed ──────────────────────────────────────────────────────
  const step2CanProceed =
    !!bookingData.date &&
    !!bookingData.name &&
    !!bookingData.email &&
    !!bookingData.address &&
    !!bookingData.phone &&
    zipStatus === "valid";

  // ── Step 3 can confirm ──────────────────────────────────────────────────────
  const isEffectiveSubscription = effectiveServiceType === "monthly" || effectiveServiceType === "bi-monthly";
  const step3CanConfirm = !isEffectiveSubscription || bookingData.subscriptionAgreed;



  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Progress bar */}
      <div className="mb-8 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
          &larr; Back to Home
        </Button>
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 w-12 rounded-full transition-colors",
                step >= (planInfo ? i + 2 : i + 1) ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ═══════════════════════════════════════════════════════════════════
            STEP 1 – Choose Service
        ═══════════════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Service</CardTitle>
                <CardDescription>
                  Select the frequency and number of bins you'd like us to clean.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Service Frequency</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "monthly", label: "Monthly", sub: "$19.99/mo" },
                      { value: "bi-monthly", label: "Bi-Weekly", sub: "$34.99/mo" },
                      { value: "one-time", label: "One-Time", sub: "$44.99" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setBookingData({ ...bookingData, serviceType: opt.value as ServiceType })}
                        className={cn(
                          "flex flex-col items-center justify-center h-20 rounded-xl border-2 text-sm font-semibold transition-all",
                          bookingData.serviceType === opt.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-white text-slate-700 hover:border-primary/40"
                        )}
                      >
                        <span className="font-bold">{opt.label}</span>
                        <span className="text-xs font-normal mt-0.5 opacity-70">{opt.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Number of Bins <span className="text-muted-foreground font-normal text-xs">(up to 3 included, +$10 each after)</span></Label>
                  <div className="grid grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((num) => (
                      <Button
                        key={num}
                        variant={bookingData.binCount === num ? "default" : "outline"}
                        className="h-16 text-lg font-bold"
                        onClick={() => setBookingData({ ...bookingData, binCount: num })}
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-medium">Estimated Price</p>
                    <p className="text-sm text-muted-foreground">
                      {bookingData.serviceType === "monthly" ? "Essential – $19.99/mo" :
                       bookingData.serviceType === "bi-monthly" ? "Fresh – $34.99/mo" : "One-Time – $44.99"}
                      {bookingData.binCount > 3 && <span className="text-amber-600 ml-1">+${(bookingData.binCount - 3) * 10} extra bin</span>}
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    ${(
                      (bookingData.serviceType === "monthly" ? 19.99 :
                       bookingData.serviceType === "bi-monthly" ? 34.99 : 44.99) +
                      Math.max(0, bookingData.binCount - 3) * 10
                    ).toFixed(2)}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full h-12 text-lg" onClick={nextStep}>
                  Next: Schedule &amp; Details
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            STEP 2 – Details & Schedule
        ═══════════════════════════════════════════════════════════════════ */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Your Details &amp; Schedule</CardTitle>
                <CardDescription>
                  When should we start? And where are we going?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* Selected plan banner */}
                {planInfo && (
                  <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-xl">
                    <div>
                      <p className="text-xs text-primary font-bold uppercase tracking-widest mb-0.5">Selected Plan</p>
                      <p className="font-semibold">{planInfo.label}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-extrabold text-primary">${planInfo.price}</p>
                      <p className="text-xs text-muted-foreground">{planInfo.serviceType === "one-time" ? "one time" : "per month"}</p>
                    </div>
                  </div>
                )}

                {/* Bin count */}
                <div className="space-y-3">
                  <Label>Number of Bins <span className="text-muted-foreground font-normal text-xs">(up to 3 included, +$10 each after)</span></Label>
                  <div className="grid grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((num) => (
                      <Button
                        key={num}
                        variant={bookingData.binCount === num ? "default" : "outline"}
                        className="h-16 text-lg font-bold"
                        onClick={() => setBookingData({ ...bookingData, binCount: num })}
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Date picker */}
                <div className="space-y-2">
                  <Label>First Cleaning Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-12",
                          !bookingData.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {bookingData.date ? format(bookingData.date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={bookingData.date}
                        onSelect={(d) => setBookingData({ ...bookingData, date: d })}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Scent selection */}
                <div className="space-y-3">
                  <Label>Preferred Scent <span className="text-muted-foreground font-normal text-xs">(organic essential oil)</span></Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "🍋 Lemon", value: "Lemon" },
                      { label: "🌿 Mint", value: "Mint" },
                      { label: "💜 Lavender", value: "Lavender" },
                    ].map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => setBookingData({ ...bookingData, scent: s.value })}
                        className={cn(
                          "h-12 rounded-xl border-2 text-sm font-semibold transition-all",
                          bookingData.scent === s.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-white text-slate-700 hover:border-primary/40"
                        )}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      className="h-12"
                      value={bookingData.name}
                      onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(805) 555-0100"
                      className="h-12"
                      value={bookingData.phone}
                      onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="h-12"
                    value={bookingData.email}
                    onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Fresh St"
                    className="h-12"
                    value={bookingData.address}
                    onChange={(e) => setBookingData({ ...bookingData, address: e.target.value })}
                  />
                </div>

                {/* ZIP + City with validation */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <div className="relative">
                      <Input
                        id="zip"
                        placeholder="e.g. 93021"
                        className={cn(
                          "h-12 pr-10 transition-colors",
                          zipStatus === "valid" && "border-green-500 focus-visible:ring-green-400",
                          zipStatus === "invalid" && "border-red-400 focus-visible:ring-red-400"
                        )}
                        value={bookingData.zipCode}
                        maxLength={5}
                        onChange={(e) => handleZipChange(e.target.value)}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <AnimatePresence mode="wait">
                          {zipStatus === "valid" && (
                            <motion.div
                              key="valid"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              <CheckCheck size={18} className="text-green-500" />
                            </motion.div>
                          )}
                          {zipStatus === "invalid" && (
                            <motion.div
                              key="invalid"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              <AlertCircle size={18} className="text-red-400" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    {/* ZIP validation feedback */}
                    <AnimatePresence>
                      {zipStatus === "valid" && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="text-xs font-semibold text-green-600 flex items-center gap-1"
                        >
                          ✅ Service Available
                        </motion.p>
                      )}
                      {zipStatus === "invalid" && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="text-xs font-semibold text-red-500 flex items-center gap-1"
                        >
                          ❌ Outside Service Area
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <div className="relative">
                      <Input
                        id="city"
                        placeholder="Auto-filled from ZIP"
                        className="h-12 pr-10 bg-muted/50 cursor-not-allowed text-muted-foreground"
                        value={bookingData.city}
                        readOnly
                        tabIndex={-1}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Lock size={14} className="text-muted-foreground/60" />
                      </div>
                    </div>
                    {zipStatus === "idle" && (
                      <p className="text-xs text-muted-foreground">Enter your ZIP code first</p>
                    )}
                  </div>
                </div>

                {/* Outside service area error */}
                <AnimatePresence>
                  {zipStatus === "invalid" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <MapPin size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-red-700 text-sm">Outside Service Area</p>
                          <p className="text-red-600 text-sm">
                            Sorry, we currently only service Moorpark, CA. We're expanding — check back soon!
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Service area info chip */}
                {zipStatus === "idle" && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/60 rounded-lg px-3 py-2">
                    <MapPin size={12} className="text-primary" />
                    <span>We currently serve <strong>Moorpark, CA</strong> (ZIP: 93021)</span>
                  </div>
                )}

                {/* ── Phase 3: Referral Source ─────────────────────────────── */}
                <div className="space-y-3">
                  <Label>How did you hear about us? <span className="text-muted-foreground font-normal text-xs">(optional)</span></Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {REFERRAL_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setBookingData({
                            ...bookingData,
                            referralSource: bookingData.referralSource === opt.value ? "" : opt.value,
                          })
                        }
                        className={cn(
                          "h-11 px-3 rounded-xl border-2 text-xs font-semibold transition-all text-left truncate",
                          bookingData.referralSource === opt.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-white text-slate-700 hover:border-primary/40"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price summary */}
                <div className="p-4 bg-muted rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-medium">Estimated Total</p>
                    <p className="text-sm text-muted-foreground">
                      {bookingData.binCount <= 3 ? "Up to 3 bins included" : `3 bins + ${bookingData.binCount - 3} extra`}
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-primary">${getPrice()}</div>
                </div>

              </CardContent>
              <CardFooter className="flex gap-4">
                {!planInfo && (
                  <Button variant="outline" className="flex-1 h-12" onClick={prevStep}>
                    Back
                  </Button>
                )}
                <Button
                  className="flex-[2] h-12 text-lg"
                  onClick={nextStep}
                  disabled={!step2CanProceed}
                  title={!step2CanProceed ? "Please fill in all required fields and enter a valid ZIP code" : ""}
                >
                  Review &amp; Confirm
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            STEP 3 – Review & Confirm
        ═══════════════════════════════════════════════════════════════════ */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Review Your Booking</CardTitle>
                <CardDescription>
                  Please confirm your details before we finalize.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Plan</p>
                    <p className="font-medium capitalize">{planInfo?.label ?? `${bookingData.serviceType} Cleaning`}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Bins</p>
                    <p className="font-medium">{bookingData.binCount} Garbage Bin{bookingData.binCount > 1 ? "s" : ""}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Start Date</p>
                    <p className="font-medium">{bookingData.date ? format(bookingData.date, "PP") : "Not set"}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Scent</p>
                    <p className="font-medium">
                      {bookingData.scent === "Lemon" ? "🍋" : bookingData.scent === "Mint" ? "🌿" : "💜"} {bookingData.scent}
                    </p>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between px-4 py-3 bg-primary/10 border border-primary/20 rounded-xl">
                  <p className="font-semibold text-primary">Total</p>
                  <p className="text-2xl font-extrabold text-primary">${getPrice()}</p>
                </div>

                {/* Contact & address summary */}
                <div className="space-y-1 border-t pt-4">
                  <p className="text-sm font-bold">Contact &amp; Address</p>
                  <p className="text-sm">{bookingData.name} · {bookingData.phone}</p>
                  <p className="text-sm text-muted-foreground">{bookingData.email}</p>
                  <p className="text-sm text-muted-foreground">
                    {bookingData.address}{bookingData.city ? `, ${bookingData.city}` : ""}{bookingData.zipCode ? ` ${bookingData.zipCode}` : ""}
                  </p>
                </div>

                {/* Referral source */}
                {bookingData.referralSource && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground border-t pt-4">
                    <Sparkles size={14} className="text-primary" />
                    <span>Heard about us via: <strong className="text-foreground">{bookingData.referralSource}</strong></span>
                  </div>
                )}

                {/* ── Phase 2: Subscription Agreement Checkbox ────────────── */}
                {isEffectiveSubscription && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-xl border-2 transition-colors cursor-pointer",
                      bookingData.subscriptionAgreed
                        ? "border-primary bg-primary/5"
                        : "border-amber-300 bg-amber-50"
                    )}
                    onClick={() =>
                      setBookingData({ ...bookingData, subscriptionAgreed: !bookingData.subscriptionAgreed })
                    }
                  >
                    <div className={cn(
                      "mt-0.5 w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors",
                      bookingData.subscriptionAgreed ? "bg-primary border-primary" : "border-amber-400 bg-white"
                    )}>
                      {bookingData.subscriptionAgreed && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          <CheckCheck size={12} className="text-white" />
                        </motion.div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold leading-snug">
                        I understand that this is a recurring subscription and that I may cancel at any time.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Your card will be charged{" "}
                        <strong>${getPrice()}</strong> per month. No contracts — cancel anytime.
                      </p>
                    </div>
                  </motion.div>
                )}

              </CardContent>
              {submitError && (
                <div className="px-6 pb-2">
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    {submitError}
                  </div>
                </div>
              )}
              <CardFooter className="flex gap-4">
                <Button variant="outline" className="flex-1 h-12" onClick={prevStep} disabled={isSubmitting}>
                  Back
                </Button>
                <Button
                  className="flex-[2] h-12 text-lg"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !step3CanConfirm}
                  title={!step3CanConfirm ? "Please agree to the subscription terms to continue" : ""}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      Redirecting to payment…
                    </span>
                  ) : (
                    "Confirm & Pay →"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
