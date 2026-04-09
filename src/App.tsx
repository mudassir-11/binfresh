/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { LandingPage } from "./components/LandingPage";
import { BookingForm } from "./components/BookingForm";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [view, setView] = React.useState<"landing" | "booking">("landing");

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <AnimatePresence mode="wait">
        {view === "landing" ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage onStartBooking={() => setView("booking")} />
          </motion.div>
        ) : (
          <motion.div
            key="booking"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <BookingForm onBack={() => setView("landing")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

