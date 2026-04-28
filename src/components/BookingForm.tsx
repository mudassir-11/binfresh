import * as React from "react";
import { CalendarIcon, CheckCircle2, Trash2, Sparkles } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "motion/react";

type ServiceType = "weekly" | "monthly" | "one-time";

interface BookingData {
  serviceType: ServiceType;
  binCount: number;
  date: Date | undefined;
  name: string;
  email: string;
  address: string;
}

export function BookingForm({ onBack }: { onBack: () => void }) {
  const [step, setStep] = React.useState(1);
  const [bookingData, setBookingData] = React.useState<BookingData>({
    serviceType: "monthly",
    binCount: 1,
    date: undefined,
    name: "",
    email: "",
    address: "",
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto text-center py-12"
      >
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <CheckCircle2 size={48} />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4">Booking Confirmed!</h2>
        <p className="text-muted-foreground mb-8">
          Thank you, {bookingData.name}. We've sent a confirmation email to {bookingData.email}.
          Our team will see you on {bookingData.date ? format(bookingData.date, "PPP") : "your scheduled date"}.
        </p>
        <Button onClick={onBack} className="w-full">
          Return Home
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
          &larr; Back to Home
        </Button>
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "h-2 w-12 rounded-full transition-colors",
                step >= s ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
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
                <div className="space-y-4">
                  <Label>Service Frequency</Label>
                  <Tabs
                    defaultValue={bookingData.serviceType}
                    onValueChange={(v) =>
                      setBookingData({ ...bookingData, serviceType: v as ServiceType })
                    }
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="weekly">Weekly</TabsTrigger>
                      <TabsTrigger value="monthly">Monthly</TabsTrigger>
                      <TabsTrigger value="one-time">One-time</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="space-y-4">
                  <Label>Number of Bins</Label>
                  <div className="grid grid-cols-4 gap-4">
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

                <div className="p-4 bg-muted rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium">Estimated Price</p>
                    <p className="text-sm text-muted-foreground">
                      {bookingData.serviceType === "weekly" ? "$15/week" : 
                       bookingData.serviceType === "monthly" ? "$25/month" : "$45/visit"}
                    </p>
                  </div>
                  <div className="text-2xl font-bold">
                    ${bookingData.binCount * (
                      bookingData.serviceType === "weekly" ? 15 : 
                      bookingData.serviceType === "monthly" ? 25 : 45
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full h-12 text-lg" onClick={nextStep}>
                  Next: Schedule & Details
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Schedule & Contact</CardTitle>
                <CardDescription>
                  When should we start? And where are we going?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>First Cleaning Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
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
                  <Label htmlFor="address">Service Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Fresh St, Clean City"
                    className="h-12"
                    value={bookingData.address}
                    onChange={(e) => setBookingData({ ...bookingData, address: e.target.value })}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex gap-4">
                <Button variant="outline" className="flex-1 h-12" onClick={prevStep}>
                  Back
                </Button>
                <Button 
                  className="flex-[2] h-12 text-lg" 
                  onClick={nextStep}
                  disabled={!bookingData.date || !bookingData.name || !bookingData.email || !bookingData.address}
                >
                  Review Booking
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

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
                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Service</p>
                    <p className="font-medium capitalize">{bookingData.serviceType} Cleaning</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Bins</p>
                    <p className="font-medium">{bookingData.binCount} Garbage Bins</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Start Date</p>
                    <p className="font-medium">{bookingData.date ? format(bookingData.date, "PP") : "Not set"}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Total</p>
                    <p className="font-medium text-primary">
                      ${bookingData.binCount * (
                        bookingData.serviceType === "weekly" ? 15 : 
                        bookingData.serviceType === "monthly" ? 25 : 45
                      )}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 border-t pt-4">
                  <p className="text-sm font-bold">Contact Information</p>
                  <p className="text-sm">{bookingData.name}</p>
                  <p className="text-sm text-muted-foreground">{bookingData.email}</p>
                  <p className="text-sm text-muted-foreground">{bookingData.address}</p>
                </div>
              </CardContent>
              <CardFooter className="flex gap-4">
                <Button variant="outline" className="flex-1 h-12" onClick={prevStep}>
                  Back
                </Button>
                <Button 
                  className="flex-[2] h-12 text-lg" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Confirm & Book"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
