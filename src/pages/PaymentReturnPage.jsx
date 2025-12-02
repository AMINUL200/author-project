import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { CheckCircle, XCircle, Loader2, CreditCard } from "lucide-react";

const PaymentReturnPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const payerId = searchParams.get("PayerID");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [status, setStatus] = useState("processing"); // processing, success, error

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}paypal/return?token=${token}&PayerID=${payerId}`,
          {
            params: {
              t: Date.now(), // prevent caching
            },
          }
        );

        if (res.data.success) {
          const orderInfo = {
            paypal_order_id: res.data.paypal_order_id,
            order_id: res.data.order.id,
            article_id: res.data.order.article_id,
            user_id: res.data.order.user_id,
          };

          // console.log("orderInfo:: ",orderInfo);

          // now capture order
          const captureRes = await axios.post(
            `${import.meta.env.VITE_API_URL}paypal/capture-order`,
            {
              paypal_order_id: res.data.paypal_order_id,
              order_id: res.data.order.id,
              article_id: res.data.order.article_id,
              user_id: res.data.order.user_id,
            }
          );
          if (captureRes.data.success) {
            setStatus("success");
            toast.success("Payment successful! 🎉");
            // redirect user to article with full PDF access
            setTimeout(() => {
              // navigate(`/articles/${res.data.order.article_id}`);
              navigate(`/`);
            }, 2000);
          } else {
            setStatus("error");
            toast.error("Payment capture failed. Try again.");
          }
        } else {
          setStatus("error");
          toast.error("Payment failed. Try again.");
          console.log(res.data);
        }
      } catch (err) {
        console.error("Return error:", err);
        setStatus("error");
        toast.error("Error processing payment");
      }
    };

    if (token && payerId) {
      verifyPayment();
    } else {
      setStatus("error");
    }
  }, [token, payerId, apiUrl, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-50 -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full blur-3xl opacity-50 -ml-16 -mb-16" />

          <div className="relative z-10">
            {/* Icon Section */}
            <div className="flex justify-center mb-6">
              {status === "processing" && (
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center animate-pulse">
                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full animate-ping opacity-20" />
                </div>
              )}
              {status === "success" && (
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              )}
              {status === "error" && (
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-white" />
                </div>
              )}
            </div>

            {/* Status Text */}
            <div className="text-center mb-8">
              {status === "processing" && (
                <>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Processing Payment
                  </h1>
                  <p className="text-gray-600">
                    Please wait while we verify your transaction...
                  </p>
                </>
              )}
              {status === "success" && (
                <>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Payment Successful!
                  </h1>
                  <p className="text-gray-600">
                    Your transaction has been completed successfully.
                    Redirecting you now...
                  </p>
                </>
              )}
              {status === "error" && (
                <>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Payment Failed
                  </h1>
                  <p className="text-gray-600">
                    We couldn't process your payment. Please try again.
                  </p>
                </>
              )}
            </div>

            {/* Progress Indicator for Processing */}
            {status === "processing" && (
              <div className="mb-6">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-[progress_2s_ease-in-out_infinite]" />
                </div>
              </div>
            )}

            {/* Transaction Details */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Transaction ID:</span>
                <span className="text-gray-800 font-mono text-xs ml-auto">
                  {token?.slice(0, 16)}...
                </span>
              </div>
            </div>

            {/* Action Button for Error State */}
            {status === "error" && (
              <button
                onClick={() => navigate(-1)}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/30"
              >
                Go Back
              </button>
            )}
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Secure Payment Processing
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentReturnPage;
