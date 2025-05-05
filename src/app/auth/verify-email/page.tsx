"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/Button";

// Component that uses searchParams
function VerificationContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      
      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing");
        return;
      }
      
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`, {
          method: "GET",
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully");
        } else {
          setStatus("error");
          setMessage(data.error || "Failed to verify email");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An error occurred during verification");
        console.error(error);
      }
    };
    
    verifyEmail();
  }, [searchParams]);
  
  return (
    <div className="w-full max-w-md space-y-8 text-center">
      <h1 className="text-2xl font-bold">Email Verification</h1>
      
      {status === "loading" && (
        <div>
          <p>Verifying your email...</p>
          <div className="mt-4 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      )}
      
      {status === "success" && (
        <div>
          <p className="text-green-600 mb-4">{message}</p>
          <Button href="/auth/login">Go to Login</Button>
        </div>
      )}
      
      {status === "error" && (
        <div>
          <p className="text-red-600 mb-4">{message}</p>
          <Button href="/auth/login">Go to Login</Button>
        </div>
      )}
    </div>
  );
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="w-full max-w-md space-y-8 text-center">
      <h1 className="text-2xl font-bold">Email Verification</h1>
      <div>
        <p>Loading verification page...</p>
        <div className="mt-4 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<LoadingFallback />}>
        <VerificationContent />
      </Suspense>
    </div>
  );
} 