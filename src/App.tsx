import * as React from "react";
import { LandingPage } from "./components/LandingPage";
import { BookingForm } from "./components/BookingForm";
import { SuccessPage } from "./components/SuccessPage";
import { AdminPortal } from "./components/AdminPortal";
import { ReviewForm } from "./components/ReviewForm";
import { AboutPage, ContactPage, FAQPage, ServiceAreaPage, LegalPages } from "./components/InfoPages";
import { motion, AnimatePresence } from "motion/react";

type View = "landing" | "booking" | "success" | "canceled" | "admin" | "review" | "about" | "contact" | "faq" | "areas" | "terms" | "privacy";

function getInitialView(): View {
  const params = new URLSearchParams(window.location.search);
  if (params.get("admin") === "true") return "admin";
  if (params.get("review") === "true") return "review";
  if (params.get("success") === "true") return "success";
  if (params.get("canceled") === "true") return "canceled";
  
  const page = params.get("page");
  if (page && ["about", "contact", "faq", "areas", "terms", "privacy"].includes(page)) {
    return page as View;
  }
  
  return "landing";
}

export default function App() {
  const [view, setView] = React.useState<View>(getInitialView);
  const [selectedPlan, setSelectedPlan] = React.useState<string | undefined>(undefined);

  const handleChoosePlan = (planName: string) => {
    setSelectedPlan(planName);
    setView("booking");
  };

  const handleReturnHome = () => {
    setSelectedPlan(undefined);
    setView("landing");
  };

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <AnimatePresence mode="wait">

        {view === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage
              onStartBooking={() => setView("booking")}
              onChoosePlan={handleChoosePlan}
            />
          </motion.div>
        )}

        {view === "booking" && (
          <motion.div
            key="booking"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <BookingForm onBack={handleReturnHome} selectedPlan={selectedPlan} />
          </motion.div>
        )}

        {view === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SuccessPage onReturn={handleReturnHome} />
          </motion.div>
        )}

        {view === "canceled" && (
          <motion.div
            key="canceled"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen flex items-center justify-center px-4"
          >
            <div className="text-center max-w-sm">
              <div className="text-5xl mb-4">😕</div>
              <h2 className="text-2xl font-bold mb-2">Payment Canceled</h2>
              <p className="text-muted-foreground mb-6">
                No worries — your booking wasn't completed. You can try again whenever you're ready.
              </p>
              <button
                onClick={() => {
                  setView("booking");
                  window.history.replaceState({}, "", "/");
                }}
                className="px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}

        {view === "admin" && (
          <motion.div
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AdminPortal />
          </motion.div>
        )}

        {view === "review" && (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ReviewForm />
          </motion.div>
        )}

        {["about", "contact", "faq", "areas", "terms", "privacy"].includes(view) && (
          <motion.div
            key={view}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {view === "about" && <AboutPage />}
            {view === "contact" && <ContactPage />}
            {view === "faq" && <FAQPage />}
            {view === "areas" && <ServiceAreaPage />}
            {view === "terms" && <LegalPages type="terms" />}
            {view === "privacy" && <LegalPages type="privacy" />}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
