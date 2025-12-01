import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Alert from "../ui/alert/Alert";

interface AlertState {
  isEnable: boolean;
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}

// List of available country codes (could be extended or loaded from a config/service)
const COUNTRY_CODES = [
  { label: "+1 (US)", value: "+1" },
  { label: "+91 (IN)", value: "+91" },
  { label: "+44 (UK)", value: "+44" },
  // Add more country codes as needed
];

export default function SignInForm() {
  const navigate = useNavigate();
  const [countryCode, setCountryCode] = useState<string>(COUNTRY_CODES[0].value);
  const [phoneNo, setPhoneNo] = useState<string>("");
  const [isOTPFieldsVisible, setIsOTPFormVisible] = useState(false);
  const [otp, setOTP] = useState<string>("");

  const [alert, setAlert] = useState<AlertState>({
    isEnable: false,
    variant: "info",
    title: "",
    message: "",
  });

  const clearAlert = () => {
    setAlert({
      isEnable: false,
      variant: "info",
      title: "",
      message: "",
    });
  };

  // Send OTP
  const handleGetOTP = async () => {
    clearAlert();
    if (!phoneNo) {
      console.log("Validation Check Failed: Phone number is empty."); // Added log
      return setAlert({
        isEnable: true,
        variant: "error",
        title: "Validation Error",
        message: "Please enter your phone number.",
      });
    }

    try {
      console.log("Sending OTP request with:", { countryCode, phoneNo, role: "Admin" }); // Added log
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/signin-admin`,
        { countryCode, phoneNo, role: "Admin" }
      );
      console.log("OTP request success:", res); // Added log

      setAlert({
        isEnable: true,
        variant: "success",
        title: "Success",
        message: res.data.message || "OTP sent to your phone!",
      });
      setIsOTPFormVisible(true);
    } catch (err: any) {
      console.log("OTP request error:", err); // Added log
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Error",
        message: err.response?.data?.message || "Failed to send OTP.",
      });
    }
  };

  // Verify OTP
  const handleLogIn = async () => {
    clearAlert();

    if (!phoneNo || !otp) {
      return setAlert({
        isEnable: true,
        variant: "error",
        title: "Validation Error",
        message: "Please enter both phone number and OTP.",
      });
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/verify-admin`,
        { countryCode, phoneNo, otp, role: "Admin" }
      );

      setAlert({
        isEnable: true,
        variant: "success",
        title: "Success",
        message: res.data.message || "OTP verified successfully!",
      });

      // Store token in localStorage
      if (res.data.token) {
        localStorage.setItem("admin-token", res.data.token);
      }

      // Navigate to dashboard
      setTimeout(() => navigate("/"), 1000);
    } catch (err: any) {
      setAlert({
        isEnable: true,
        variant: "error",
        title: "OTP Verification Failed",
        message:
          err.response?.data?.message || "Invalid OTP. Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-4">
            {alert.isEnable && (
              <Alert
                variant={alert.variant as any}
                title={alert.title}
                message={alert.message}
              />
            )}
          </div>

          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Admin Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your phone number to sign in!
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <Label>
                Country Code <span className="text-error-500">*</span>
              </Label>
              <select
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-100 bg-white dark:bg-gray-800 dark:border-gray-600"
                value={countryCode}
                onChange={(e) => {
                  setCountryCode(e.target.value);
                  clearAlert();
                }}
                name="countryCode"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>
                Phone Number <span className="text-error-500">*</span>
              </Label>
              <Input
                placeholder="e.g. 1234567890"
                name="phoneNo"
                value={phoneNo}
                onChange={(e) => {
                  setPhoneNo(e.target.value);
                  clearAlert();
                }}
              />
            </div>

            <div className={`${isOTPFieldsVisible ? "block" : "hidden"}`}>
              <Label>
                OTP <span className="text-error-500">*</span>
              </Label>
              <Input
                type="number"
                placeholder="Enter OTP"
                name="otp"
                value={otp}
                onChange={(e) => {
                  setOTP(e.target.value);
                  clearAlert();
                }}
              />
            </div>

            <div>
              {isOTPFieldsVisible ? (
                <Button onClick={handleLogIn} className="w-full" size="sm">
                  Verify & Sign In
                </Button>
              ) : (
                <Button onClick={handleGetOTP} className="w-full" size="sm">
                  Get OTP
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
