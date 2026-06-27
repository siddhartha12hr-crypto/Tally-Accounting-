import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  CreditCard,
  Lock,
  CheckCircle,
  Star,
  Clock,
  BookOpen,
  Users,
  Shield,
  ArrowLeft,
} from "lucide-react";

export const Route = createFileRoute("/payment/$contentId")({
  head: () => ({
    meta: [
      { title: "Payment — Tally Accounting Hub Pro" },
      { name: "description", content: "Complete your purchase securely" },
    ],
  }),
  component: PaymentPage,
});

function PaymentPage() {
  const { contentId } = Route.useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, purchaseContent, hasPurchased } = useAuth();
  const { videos, courses } = useData();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("card");
  
  // Form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");

  // Find the content
  const video = videos.find(v => v.id === contentId);
  const course = courses.find(c => c.id === contentId);
  const content = video || course;

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      toast.info("Please login first");
      navigate({ 
        to: "/login",
        search: { redirect: `/payment/${contentId}` }
      });
      return;
    }

    // Redirect if content not found
    if (!content) {
      toast.error("Content not found");
      navigate({ to: "/learn" });
      return;
    }

    // Redirect if content is free
    const isFree = content.price === "Free" || content.price === "₹0";
    if (isFree) {
      toast.info("This content is free!");
      navigate({ to: `/watch/${contentId}` });
      return;
    }

    // Redirect if already purchased
    const isPurchased = video 
      ? hasPurchased(contentId, 'video')
      : hasPurchased(contentId, 'course');
    
    if (isPurchased) {
      toast.success("You already own this content!");
      navigate({ to: `/watch/${contentId}` });
      return;
    }
  }, [isAuthenticated, content, contentId, navigate, hasPurchased, video]);

  if (!content || !isAuthenticated) {
    return null;
  }

  const contentType = video ? 'video' : 'course';

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate based on payment method
    if (paymentMethod === "card") {
      if (!cardNumber.trim() || cardNumber.length < 16) {
        toast.error("Please enter a valid card number");
        return;
      }
      if (!cardName.trim()) {
        toast.error("Please enter cardholder name");
        return;
      }
      if (!expiryDate.trim() || expiryDate.length < 5) {
        toast.error("Please enter valid expiry date (MM/YY)");
        return;
      }
      if (!cvv.trim() || cvv.length < 3) {
        toast.error("Please enter valid CVV");
        return;
      }
    } else {
      if (!upiId.trim() || !upiId.includes("@")) {
        toast.error("Please enter a valid UPI ID");
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In production, this would call your payment gateway API
      // For demo, we'll just mark as purchased
      purchaseContent(contentId, contentType);
      
      toast.success("Payment successful! 🎉");
      
      // Redirect to watch page
      setTimeout(() => {
        navigate({ to: `/watch/${contentId}` });
      }, 500);
      
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDemoPayment = async () => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      purchaseContent(contentId, contentType);
      toast.success("Demo payment successful! 🎉");
      
      setTimeout(() => {
        navigate({ to: `/watch/${contentId}` });
      }, 500);
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Format card number
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate({ to: "/learn" })}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl glass p-8 shadow-elegant"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-full gradient-hero flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-black">Complete Payment</h1>
                  <p className="text-sm text-muted-foreground">
                    Secure checkout powered by industry standards
                  </p>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <Label className="text-sm font-bold mb-3 block">Payment Method</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === "card"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <CreditCard className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm font-bold">Credit/Debit Card</p>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("upi")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === "upi"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <svg className="h-6 w-6 mx-auto mb-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 6h12v12H6z"/>
                    </svg>
                    <p className="text-sm font-bold">UPI</p>
                  </button>
                </div>
              </div>

              {/* Payment Form */}
              <form onSubmit={handlePayment} className="space-y-5">
                {paymentMethod === "card" ? (
                  <>
                    {/* Card Number */}
                    <div>
                      <Label htmlFor="cardNumber" className="text-sm font-bold">
                        Card Number
                      </Label>
                      <Input
                        id="cardNumber"
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="mt-2 rounded-xl font-mono"
                        disabled={isProcessing}
                      />
                    </div>

                    {/* Cardholder Name */}
                    <div>
                      <Label htmlFor="cardName" className="text-sm font-bold">
                        Cardholder Name
                      </Label>
                      <Input
                        id="cardName"
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Doe"
                        className="mt-2 rounded-xl"
                        disabled={isProcessing}
                      />
                    </div>

                    {/* Expiry and CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate" className="text-sm font-bold">
                          Expiry Date
                        </Label>
                        <Input
                          id="expiryDate"
                          type="text"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="mt-2 rounded-xl font-mono"
                          disabled={isProcessing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-sm font-bold">
                          CVV
                        </Label>
                        <Input
                          id="cvv"
                          type="password"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          placeholder="123"
                          maxLength={4}
                          className="mt-2 rounded-xl font-mono"
                          disabled={isProcessing}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* UPI ID */}
                    <div>
                      <Label htmlFor="upiId" className="text-sm font-bold">
                        UPI ID
                      </Label>
                      <Input
                        id="upiId"
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="mt-2 rounded-xl"
                        disabled={isProcessing}
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Enter your UPI ID (e.g., 9876543210@paytm)
                      </p>
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full rounded-xl gradient-hero text-white shadow-glow font-bold py-6 text-base"
                >
                  {isProcessing ? (
                    "Processing Payment..."
                  ) : (
                    <>
                      <Lock className="h-5 w-5 mr-2" />
                      Pay {content.price}
                    </>
                  )}
                </Button>

                {/* Demo Payment */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDemoPayment}
                  disabled={isProcessing}
                  className="w-full rounded-xl font-bold"
                >
                  Demo Payment (Skip Form)
                </Button>
              </form>

              {/* Security Badge */}
              <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  <span>Secure Payment</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Lock className="h-4 w-4" />
                  <span>256-bit SSL Encrypted</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl glass p-6 shadow-elegant sticky top-8"
            >
              <h2 className="text-lg font-black mb-4">Order Summary</h2>

              {/* Content Preview */}
              <div className="rounded-xl overflow-hidden mb-4">
                <img
                  src={content.thumbnail}
                  alt={content.title}
                  className="w-full h-32 object-cover"
                />
              </div>

              {/* Content Details */}
              <div className="space-y-3 mb-6">
                <h3 className="font-bold text-sm">{content.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {content.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {course && (
                    <>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <BookOpen className="h-3 w-3" />
                        <span>{course.lessons} lessons</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{course.students}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span>{course.rating}</span>
                      </div>
                    </>
                  )}
                  {video && (
                    <>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{video.duration}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{video.views.toLocaleString()} views</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 py-4 border-t border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-semibold">{content.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-semibold">Included</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mt-4">
                <span className="font-bold">Total</span>
                <span className="text-2xl font-black text-primary">{content.price}</span>
              </div>

              {/* Benefits */}
              <div className="mt-6 space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  What you'll get:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                    <span>Lifetime access</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                    <span>Watch on any device</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                    <span>Download for offline viewing</span>
                  </div>
                  {course && (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                        <span>Certificate of completion</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                        <span>24/7 support</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
