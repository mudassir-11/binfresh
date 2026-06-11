import * as React from "react";
import { Star, Camera, Upload, Trash2, CheckCircle2 } from "lucide-react";
import { supabase } from "../lib/supabase";

export function ReviewForm() {
  const [rating, setRating] = React.useState<number>(0);
  const [hoverRating, setHoverRating] = React.useState<number>(0);
  const [name, setName] = React.useState("");
  const [comment, setComment] = React.useState("");
  const [photo, setPhoto] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }
    
    if (!supabase) {
      alert("Database connection not configured.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      let photo_url = null;

      // 1. Upload photo if exists
      if (photo) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("review-photos")
          .upload(filePath, photo);

        if (uploadError) {
          throw new Error("Failed to upload photo: " + uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
          .from("review-photos")
          .getPublicUrl(filePath);
          
        photo_url = publicUrlData.publicUrl;
      }

      // 2. Insert into database
      const { error: insertError } = await supabase
        .from("reviews")
        .insert({
          customer_name: name,
          rating,
          comment: comment || null,
          photo_url,
          status: "pending"
        });

      if (insertError) {
        throw new Error("Failed to submit review: " + insertError.message);
      }

      setIsSuccess(true);
    } catch (err: any) {
      alert(err.message || "An error occurred while submitting your review.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-2xl shadow-xl p-8 text-center border border-border">
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
          <p className="text-muted-foreground mb-6">
            Your review has been submitted successfully. We truly appreciate your feedback!
          </p>
          <button
            onClick={() => window.location.assign("/")}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors w-full"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-card rounded-3xl shadow-xl border border-border overflow-hidden">
        
        {/* Header */}
        <div className="bg-primary p-8 text-primary-foreground text-center">
          <h1 className="text-3xl font-bold mb-2">Rate Your Experience</h1>
          <p className="text-primary-foreground/80">
            How did we do? Your feedback helps us keep the bins gleaming!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Star Rating */}
          <div className="flex flex-col items-center space-y-3">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Tap to Rate
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted stroke-[1.5px]"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="John Doe"
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium mb-1">Comments (Optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                placeholder="Tell us what you liked..."
              />
            </div>

            {/* Photo Upload (Optional) */}
            <div>
              <label className="block text-sm font-medium mb-1">Before & After Photo (Optional)</label>
              {!previewUrl ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-input rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground group-hover:text-primary transition-colors">
                    <Camera className="w-8 h-8 mb-2" />
                    <p className="text-sm font-medium">Click to upload photo</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </label>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-border bg-slate-900 h-64 flex items-center justify-center">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute top-2 right-2 p-2 bg-black/60 text-white rounded-full hover:bg-black/90 transition-colors backdrop-blur-sm z-10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="w-full flex items-center justify-center py-4 px-8 border border-transparent rounded-full shadow-sm text-lg font-semibold text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              "Submit Review"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
