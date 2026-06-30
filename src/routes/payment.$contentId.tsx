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
  Key,
  MessageCircle,
  Smartphone,
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
  const [paymentMethod, setPaymentMethod] = useState<"whatsapp" | "purchase">("whatsapp");
  
  // Purchase code state
  const [purchaseCode, setPurchaseCode] = useState("");
  
  // WhatsApp phone number (admin)
  const WHATSAPP_NUMBER = "+9779823415625"; // Nepal number

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

  // Purchase codes database (in production, these would be in backend)
  const PURCHASE_CODES: Record<string, string[]> = {
    // Format: courseId: [code1, code2, code3, ...]
    // Add purchase codes for each course here
  };

  const handlePurchaseCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!purchaseCode.trim()) {
      toast.error("Please enter a purchase code");
      return;
    }

    setIsProcessing(true);

    try {
      // Check if purchase code is valid
      const validCodes = PURCHASE_CODES[contentId] || [];
      const isValid = validCodes.includes(purchaseCode.trim().toUpperCase());

      if (!isValid) {
        // For demo, accept any 8+ character code
        if (purchaseCode.length >= 8) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          purchaseContent(contentId, contentType);
          toast.success("Course unlocked successfully! 🎉");
          
          setTimeout(() => {
            navigate({ to: `/watch/${contentId}` });
          }, 500);
        } else {
          toast.error("Invalid purchase code. Please check and try again.");
        }
      } else {
        // Valid code from database
        await new Promise(resolve => setTimeout(resolve, 1000));
        purchaseContent(contentId, contentType);
        toast.success("Course unlocked successfully! 🎉");
        
        setTimeout(() => {
          navigate({ to: `/watch/${contentId}` });
        }, 500);
      }
    } catch (error) {
      console.error("Purchase code error:", error);
      toast.error("Purchase code validation failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWhatsAppPurchase = () => {
    const message = `Hi! I want to purchase:\n\n*${content.title}*\nPrice: ${content.price}\n\nPlease send me the purchase code.\n\nUser: ${user?.username || user?.email || 'Guest'}`;
    const encodedMessage = encodeURIComponent(message);
    
    // Clean phone number (remove all non-digits)
    const cleanNumber = WHATSAPP_NUMBER.replace(/[^0-9]/g, '');
    
    // Use WhatsApp API format - this works on both mobile and desktop
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodedMessage}`;
    
    // Open in new window/tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    toast.success("Opening WhatsApp...");
  };

  const handleDemoPurchase = async () => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      purchaseContent(contentId, contentType);
      toast.success("Demo purchase successful! 🎉");
      
      setTimeout(() => {
        navigate({ to: `/watch/${contentId}` });
      }, 500);
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Purchase failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
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
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-black">Purchase Course</h1>
                  <p className="text-sm text-muted-foreground">
                    Buy via WhatsApp or enter purchase code
                  </p>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <Label className="text-sm font-bold mb-3 block">Purchase Method</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod("whatsapp")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === "whatsapp"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <MessageCircle className="h-6 w-6 mx-auto mb-2 text-green-500" />
                    <p className="text-sm font-bold">Buy on WhatsApp</p>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("purchase")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === "purchase"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Key className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm font-bold">Purchase Code</p>
                  </button>
                </div>
              </div>

              {/* Payment Form */}
              {paymentMethod === "whatsapp" ? (
                <div className="space-y-5">
                  {/* WhatsApp Info */}
                  <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-6 text-center">
                    <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <MessageCircle className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="text-lg font-black mb-2">Purchase via WhatsApp</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Contact us on WhatsApp to complete your purchase. You'll receive a purchase code after payment.
                    </p>
                    
                    {/* WhatsApp Number */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border">
                      <Smartphone className="h-4 w-4" />
                      <span className="font-mono font-bold">{WHATSAPP_NUMBER}</span>
                    </div>
                  </div>

                  {/* Order Details Preview */}
                  <div className="rounded-xl glass p-4 border border-border">
                    <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wide">
                      Message Preview
                    </p>
                    <div className="bg-green-500/5 rounded-lg p-3 text-sm">
                      <p className="mb-2">Hi! I want to purchase:</p>
                      <p className="font-bold mb-2">{content.title}</p>
                      <p>Price: <span className="font-bold text-primary">{content.price}</span></p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        User: {user?.username || user?.email || 'Guest'}
                      </p>
                    </div>
                  </div>

                  {/* Open WhatsApp Button */}
                  <Button
                    type="button"
                    onClick={handleWhatsAppPurchase}
                    className="w-full rounded-xl bg-green-500 hover:bg-green-600 text-white shadow-glow font-bold py-6 text-base"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Open WhatsApp
                  </Button>

                  {/* Instructions */}
                  <div className="rounded-xl bg-muted/50 p-4">
                    <p className="text-xs font-bold mb-2">Steps to purchase:</p>
                    <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>Click "Open WhatsApp" button above</li>
                      <li>Send the pre-filled message to us</li>
                      <li>Complete payment via your preferred method</li>
                      <li>Receive purchase code instantly</li>
                      <li>Enter code to unlock content</li>
                    </ol>
                  </div>

                  {/* Back to Purchase Code */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPaymentMethod("purchase")}
                    className="w-full rounded-xl font-bold"
                  >
                    <Key className="h-5 w-5 mr-2" />
                    Already have a purchase code? Enter it
                  </Button>
                </div>
              ) : (
                <form onSubmit={handlePurchaseCode} className="space-y-5">
                  {/* Info Box */}
                  <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
                    <div className="flex gap-3">
                      <div className="shrink-0">
                        <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <Key className="h-4 w-4 text-blue-500" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-blue-600 mb-1">
                          Have a purchase code?
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Enter the purchase code you received after payment to unlock this {contentType} instantly.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Purchase Code Input */}
                  <div>
                    <Label htmlFor="purchaseCode" className="text-sm font-bold">
                      Purchase Code
                    </Label>
                    <Input
                      id="purchaseCode"
                      type="text"
                      value={purchaseCode}
                      onChange={(e) => setPurchaseCode(e.target.value.toUpperCase())}
                      placeholder="Enter your 8-digit code"
                      className="mt-2 rounded-xl font-mono text-center text-lg tracking-widest"
                      disabled={isProcessing}
                      maxLength={16}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Code format: XXXXXXXX (8+ characters)
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full rounded-xl gradient-hero text-white shadow-glow font-bold py-6 text-base"
                  >
                    {isProcessing ? (
                      "Validating Code..."
                    ) : (
                      <>
                        <Lock className="h-5 w-5 mr-2" />
                        Unlock {contentType === 'course' ? 'Course' : 'Video'}
                      </>
                    )}
                  </Button>

                  {/* Demo Button */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDemoPurchase}
                    disabled={isProcessing}
                    className="w-full rounded-xl font-bold"
                  >
                    🎭 Demo Purchase (Skip Code)
                  </Button>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-background px-2 text-muted-foreground">
                        Don't have a code?
                      </span>
                    </div>
                  </div>

                  {/* Switch to WhatsApp */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPaymentMethod("whatsapp")}
                    className="w-full rounded-xl font-bold border-green-500/50 hover:bg-green-500/10"
                  >
                    <MessageCircle className="h-5 w-5 mr-2 text-green-500" />
                    Buy on WhatsApp
                  </Button>
                </form>
              )}

              {/* Security Badge */}
              <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  <span>Secure Purchase</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Lock className="h-4 w-4" />
                  <span>Instant Delivery</span>
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
