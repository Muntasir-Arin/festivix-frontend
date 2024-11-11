"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const VerifyPage = ({ params }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [unwrappedParams, setUnwrappedParams] = useState(null);

  useEffect(() => {
    const fetchParams = async () => {
      // Await and unwrap the Promise to access the params
      const unwrapped = await params;
      setUnwrappedParams(unwrapped);
    };

    fetchParams();
  }, [params]);

  useEffect(() => {
    const verifyEmail = async () => {
        if (!unwrappedParams) return; // Make sure the params are unwrapped
      try {
        // Extract token from the URL params
        const { id, token } = unwrappedParams;

        // Make GET request to verify email using the token
        await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify/${token}`);

        router.push('/verify/success');
      } catch (error) {
        // Handle error, for example, redirect to an error page
        router.push('/verify/error');
      } finally {
        setLoading(false);
      }
    };

    if (unwrappedParams) {
      verifyEmail();
    }
  }, [unwrappedParams, router]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div>
      {/* Your content goes here */}
    </div>
  );
};

export default VerifyPage;