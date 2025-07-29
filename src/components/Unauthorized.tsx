import { useRouter } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft } from "lucide-react";

interface UnauthorizedProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
  customAction?: React.ReactNode;
}

export const Unauthorized = ({
  title = "Access Denied",
  message = "You don't have permission to view this page.",
  showBackButton = true,
  customAction,
}: UnauthorizedProps) => {
  const router = useRouter();

  const handleGoBack = () => {
    // Uses TanStack Router's history to go back
    router.history.back();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-12 h-12 text-yellow-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex justify-center gap-4">
          {showBackButton && (
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <ArrowLeft size={16} />
              Go Back
            </button>
          )}
          
          {customAction && customAction}
        </div>
      </div>
    </div>
  );
};