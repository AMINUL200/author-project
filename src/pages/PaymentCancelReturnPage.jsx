import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, Home, RefreshCw, HelpCircle } from 'lucide-react';

const PaymentCancelReturnPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-100 to-red-100 rounded-full blur-3xl opacity-50 -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-100 to-orange-100 rounded-full blur-3xl opacity-50 -ml-16 -mb-16" />

          <div className="relative z-10">
            {/* Icon Section */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-full animate-ping opacity-20" />
              </div>
            </div>

            {/* Status Text */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Payment Cancelled
              </h1>
              <p className="text-gray-600 mb-4">
                Your payment has been cancelled. No charges were made to your account.
              </p>
              <p className="text-sm text-gray-500">
                Don't worry, you can try again whenever you're ready.
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4 mb-6">
              <div className="flex gap-3">
                <HelpCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">
                    Why was my payment cancelled?
                  </h3>
                  <p className="text-sm text-gray-600">
                    You or your bank may have cancelled the transaction, or there was an issue with the payment process.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate(-1)}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>

              <button
                onClick={() => navigate(-2)}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl transition-all duration-200 border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-full bg-transparent hover:bg-gray-50 text-gray-600 font-medium py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Return to Home
              </button>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Need help with your payment?
          </p>
          <button className="text-sm text-orange-600 hover:text-orange-700 font-semibold hover:underline transition-colors">
            Contact Support
          </button>
        </div>

        {/* Security Badge */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Your information is always secure
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelReturnPage;