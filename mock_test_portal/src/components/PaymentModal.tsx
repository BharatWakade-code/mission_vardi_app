import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { X, CheckCircle, Tag, Shield, CreditCard, Lock, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentModalProps {
  product: {
    id: string;
    type: 'test' | 'test_series';
    title: string;
    titleMarathi?: string;
    price: number;
    discountPrice?: number;
    validityDays?: number;
    validityMonths?: number;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ product, isOpen, onClose, onSuccess }) => {
  const { user, openAuthModal } = useAuth();
  const { t } = useLanguage();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccessState, setIsSuccessState] = useState(false);

  if (!isOpen) return null;

  const originalPrice = product.discountPrice || product.price;
  const basePrice = product.price;
  const finalPrice = Math.max(0, basePrice - discountAmount);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponError(null);
    setIsApplyingCoupon(true);

    try {
      const res = await api.applyCoupon(couponCode.trim(), basePrice);
      setAppliedCoupon(res.coupon);
      setDiscountAmount(res.discount);
    } catch (err: any) {
      setCouponError(err.message || 'Invalid or expired coupon');
      setAppliedCoupon(null);
      setDiscountAmount(0);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleQuickCoupon = async (code: string) => {
    setCouponCode(code);
    setCouponError(null);
    setIsApplyingCoupon(true);
    try {
      const res = await api.applyCoupon(code, basePrice);
      setAppliedCoupon(res.coupon);
      setDiscountAmount(res.discount);
    } catch (err: any) {
      setCouponError(err.message);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleProceedPayment = async () => {
    if (!user) {
      onClose();
      openAuthModal('login');
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      // 1. Create order on backend
      const orderRes = await api.createOrder({
        productId: product.id,
        productType: product.type,
        couponCode: appliedCoupon?.code,
      });

      const order = orderRes.order;
      const razorpayKey = orderRes.razorpayKey;

      // 2. Open Razorpay Checkout or Test Simulator
      const options = {
        key: razorpayKey,
        amount: order.amount * 100,
        currency: 'INR',
        name: 'ParikshaSetu EdTech',
        description: `Access to ${product.title}`,
        image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        order_id: order.razorpayOrderId,
        handler: async function (response: any) {
          try {
            // 3. Verify on backend
            await api.verifyPayment({
              orderId: order.id,
              razorpayPaymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
              razorpaySignature: response.razorpay_signature || 'mock_sig_ok',
            });

            // Trigger celebration
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.6 },
            });

            setIsSuccessState(true);
            setTimeout(() => {
              onSuccess();
              onClose();
            }, 1800);
          } catch (verErr: any) {
            setError(verErr.message || 'Payment verification failed');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.mobile,
        },
        theme: {
          color: '#4f46e5',
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      // Check if Razorpay JS SDK loaded
      if (typeof (window as any).Razorpay !== 'undefined') {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Fallback for sandboxed offline preview: automatically complete verified simulated transaction
        setTimeout(async () => {
          try {
            await api.verifyPayment({
              orderId: order.id,
              razorpayPaymentId: `pay_test_${Date.now()}`,
              razorpaySignature: 'mock_sig_ok',
            });
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
            setIsSuccessState(true);
            setTimeout(() => {
              onSuccess();
              onClose();
            }, 1600);
          } catch (err: any) {
            setError(err.message);
          } finally {
            setIsProcessing(false);
          }
        }, 1200);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initiate payment.');
      setIsProcessing(false);
    }
  };

  return (
    <div id="payment-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 p-6 text-white">
          <button
            id="payment-close-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-indigo-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> {t('Razorpay 256-bit Secure Checkout', 'रेझरपे सुरक्षित पेमेंट')}
              </span>
              <h2 className="text-lg font-bold text-white leading-tight">
                {t('Purchase Test Access', 'चाचणी खरेदी करा')}
              </h2>
            </div>
          </div>
        </div>

        {isSuccessState ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {t('Payment Successful!', 'पेमेंट यशस्वी झाले!')}
            </h3>
            <p className="text-sm text-slate-600">
              {t('Test access has been activated for your account. Redirecting you to start your exam...', 'आपल्या खात्यावर चाचणी सुरू झाली आहे. कृपया प्रतीक्षा करा...')}
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Product Summary Box */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                    {product.type === 'test_series' ? t('Test Series Package', 'टेस्ट सिरीज पॅकेज') : t('Mock Exam Test', 'मॉक टेस्ट')}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {product.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {product.validityDays ? `${product.validityDays} Days Validity` : `${product.validityMonths || 6} Months Validity`} • {t('Unlimited Re-attempts & Solutions', 'अमर्यादित सराव व स्पष्टीकरणे')}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xl font-black text-slate-900">₹{basePrice}</span>
                  {originalPrice > basePrice && (
                    <span className="block text-xs text-slate-400 line-through">₹{originalPrice}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Coupon Section */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-indigo-600" />
                  {t('Have a Coupon Code?', 'कूपन कोड आहे का?')}
                </span>
                {appliedCoupon && (
                  <span className="text-emerald-600 font-bold text-xs">
                    ✓ {appliedCoupon.code} Applied (-₹{discountAmount})
                  </span>
                )}
              </label>

              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  id="coupon-code-input"
                  type="text"
                  placeholder="e.g. MOCK50"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-600/30"
                />
                <button
                  id="apply-coupon-btn"
                  type="submit"
                  disabled={isApplyingCoupon || !couponCode.trim()}
                  className="px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition disabled:opacity-50"
                >
                  {isApplyingCoupon ? '...' : t('Apply', 'लागू करा')}
                </button>
              </form>

              {couponError && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {couponError}
                </p>
              )}

              {/* Quick Coupon Chips */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] text-slate-500 font-medium">{t('Popular:', 'लोकप्रिय:')}</span>
                <button
                  type="button"
                  onClick={() => handleQuickCoupon('MOCK50')}
                  className="px-2 py-0.5 text-[11px] font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200 rounded hover:bg-amber-100 transition"
                >
                  MOCK50 (50% OFF)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickCoupon('FIRST20')}
                  className="px-2 py-0.5 text-[11px] font-mono font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 rounded hover:bg-emerald-100 transition"
                >
                  FIRST20 (₹20 OFF)
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>{t('Subtotal Base Price', 'मूळ किंमत')}</span>
                <span>₹{basePrice}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>{t('Coupon Discount', 'कूपन सवलत')}</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{t('Platform & GST Handling', 'जीएसटी व हाताळणी शुल्क')}</span>
                <span className="text-emerald-600 font-medium">{t('FREE / समाविष्ट', 'समाविष्ट')}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>{t('Total Payable', 'एकूण देय रक्कम')}</span>
                <span className="text-indigo-600">₹{finalPrice}</span>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Razorpay Test Mode Badge */}
            <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-2 text-[11px] text-blue-900">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                {t('Razorpay Instant Gateway: Supports UPI, Netbanking, Cards & Wallet.', 'सर्व प्रमुख यूपीआय (GPay, PhonePe), कार्ड व नेटबँकिंग समर्थित.')}
              </span>
            </div>

            {/* Pay Button */}
            <button
              id="pay-now-action-btn"
              onClick={handleProceedPayment}
              disabled={isProcessing}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm rounded-2xl shadow-lg hover:shadow-emerald-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t('Securing Transaction...', 'पेमेंट प्रक्रिया सुरू आहे...')}</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>{t(`Pay ₹${finalPrice} & Unlock Instantly`, `₹${finalPrice} भरा व त्वरित टेस्ट सुरू करा`)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
