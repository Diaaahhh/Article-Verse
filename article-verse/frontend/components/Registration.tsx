"use client";

import { useState, useEffect } from "react";import toast, { Toaster } from "react-hot-toast";
import { API_BASE_URL } from "@/constants/api";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Registration() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [userId, setUserId] = useState("");
const [userIdError, setUserIdError] = useState("");
const [userIdStatus, setUserIdStatus] = useState("");const [checkingUserId, setCheckingUserId] = useState(false);  const [gender, setGender] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [randomSuffix] = useState(Math.floor(Math.random() * 9999));
  
  const [passwordValid, setPasswordValid] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const suggestions = [
    `${firstName.toLowerCase()}123`,
    `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}${randomSuffix}`,
  ];
const validateUserId = (value: string) => {
  if (!value) {
    setUserIdError("");
    setUserIdStatus("");
    return;
  }

  if (value.length < 6) {
    setUserIdError("User ID must be at least 6 characters");
    setUserIdStatus("");
    return;
  }

  setUserIdError("");
};
  // Check password validity in real-time
  const checkPasswordStrength = (pwd: string) => {
    setPasswordValid({
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /\d/.test(pwd),
      special: /[@$!%*?&.#_-]/.test(pwd)
    });
  };
  
  const handleRegister = async () => {
    if (
      !firstName ||
      !lastName ||
      !userId ||
      !gender ||
      !selectedDate ||
      !email ||
      !password
    ) {
      toast.error("All fields are required");
      return;
    }
    if (userIdError) {
  return;
}
if (userIdError === "❌ User ID already exists") {
  return;
}
    const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_@$!%*?&.#])[A-Za-z\d_@$!%*?&.#-]{8,}$/;

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must contain uppercase, lowercase, number, special character and minimum 8 characters"
      );
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          user_id: userId,
          email,
          password,
          gender,
          dob: selectedDate?.toISOString().split("T")[0],
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        toast.error(data.message);
      } else if (res.status === 201) {
        toast.success("Account created successfully");

        setEmail("");
        setPassword("");
        setFirstName("");
        setLastName("");
        setUserId("");
        setGender("");
        setSelectedDate(null);

        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("Server error");
    }
  };
useEffect(() => {
  if (!userId) {
    setUserIdError("");
    return;
  }

  if (userId.length < 6) {
    setUserIdError("User ID must be at least 6 characters");
    setUserIdStatus("");
    return;
  }

  const timeout = setTimeout(async () => {
    try {
      setCheckingUserId(true);

      const res = await fetch(
        `${API_BASE_URL}/api/check-userid/${userId}`
      );

      const data = await res.json();

      if (data.available) {
  setUserIdStatus("✓ User ID available");
} else {
  setUserIdStatus("❌ User ID already exists");
}
    } catch (error) {
      console.log(error);
    } finally {
      setCheckingUserId(false);
    }
  }, 700);

  return () => clearTimeout(timeout);
}, [userId]);
  return (
    <section className="relative flex min-h-[calc(100vh-80px)] items-center justify-center">
      <Toaster position="top-right" />

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://chronicle.brightspotcdn.com/dims4/default/19e9e16/2147483647/strip/true/crop/2291x1527+55+0/resize/840x560!/quality/90/?url=http%3A%2F%2Fchronicle-brightspot.s3.us-east-1.amazonaws.com%2F62%2F5f%2Fe23b34094d34b36676df0d4a7b9c%2Fkiewra-august-sam-kalda-6428-stover-reuse-edited-modified.jpg')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Main Container - 1400px max-width with 3 columns */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 3-Column Flex Layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center justify-center min-h-[calc(100vh-80px)]">
          {/* LEFT COLUMN - Advertisement Space (250px) */}
          <div className="hidden lg:block w-[250px] flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="bg-[var(--black-card)] rounded-2xl overflow-hidden border border-[var(--border-light)]">
                <div className="bg-gradient-to-r from-[var(--black-soft)] to-[var(--black-deep)] p-3">
                  <p className="text-xs text-[var(--text-tertiary)] text-center uppercase tracking-wider">
                    Advertisement
                  </p>
                </div>
                <div className="p-4">
                  <div className="w-full h-[250px] bg-gradient-to-br from-[var(--black-soft)] to-[var(--black-deep)] rounded-xl flex flex-col items-center justify-center">
                    <svg
                      className="w-12 h-12 text-[var(--text-tertiary)] mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Ad Space
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-1">
                      300x250
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--black-card)] rounded-2xl overflow-hidden border border-[var(--border-light)]">
                <div className="bg-gradient-to-r from-[var(--black-soft)] to-[var(--black-deep)] p-3">
                  <p className="text-xs text-[var(--text-tertiary)] text-center uppercase tracking-wider">
                    Sponsored
                  </p>
                </div>
                <div className="p-4">
                  <div className="w-full h-[250px] bg-gradient-to-br from-[var(--black-warm)] to-[var(--black-deep)] rounded-xl flex flex-col items-center justify-center">
                    <svg
                      className="w-12 h-12 text-[var(--accent-primary)]/40 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Sponsor Ad
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-1">
                      Your Brand Here
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER COLUMN - Registration Box */}
          <div className="flex-1 max-w-[500px] w-full">
            <div
              className="h-auto min-h-[480px] w-full rounded-2xl shadow-2xl flex flex-col"
              style={{
                background: "var(--black-card)",
                border: "1px solid var(--border-light)",
                padding: "40px",
              }}
            >
              <h2
                className="mb-6 text-center text-xl md:text-2xl font-bold"
                style={{
                  color: "var(--text-heading)",
                  marginBottom: "40px",
                }}
              >
                Create Account
              </h2>
              {/* Full Name */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-lg border px-4 h-[55px]"
                  style={{
                    borderColor: "var(--border-light)",
                    color: "var(--text-primary)",
                    backgroundColor: "var(--black-soft)",
                    marginBottom: "10px"
                  }}
                />

                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-lg border px-4 h-[55px]"
                  style={{
                    borderColor: "var(--border-light)",
                    color: "var(--text-primary)",
                    backgroundColor: "var(--black-soft)",
                    marginBottom: "10px"
                  }}
                />
              </div>
              {/* User ID */}
              <input
  type="text"
  placeholder="User ID"
  value={userId}
  onChange={(e) => {
    const value = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "");

    setUserId(value);
    validateUserId(value);
  }}
  className="mb-1 w-full rounded-lg border px-4 h-[55px]"
  style={{
    borderColor: userIdError
      ? "#ef4444"
      : "var(--border-light)",
    color: "var(--text-primary)",
    backgroundColor: "var(--black-soft)",
  }}
/>
{checkingUserId && (
  <p className="text-xs mt-2 text-gray-400">
    Checking availability...
  </p>
)}

{userIdError && !checkingUserId && (
  <p
    className={`text-xs mt-2 ${
      userIdError.startsWith("✓")
        ? "text-green-500"
        : "text-red-500"
    }`}
  >
    {userIdError}
  </p>
)}

{userIdStatus && (
  <p
    className={`text-xs mt-2 ${
      userIdStatus.startsWith("✓")
        ? "text-green-500"
        : "text-red-500"
    }`}
  >
    {userIdStatus}
  </p>
)}
              {firstName && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setUserId(item)}
                        className="px-3 py-1 rounded-full text-xs"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* Date of Birth */}
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Date of Birth"
                maxDate={new Date()}
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                wrapperClassName="w-full mb-4"
                className="w-full rounded-lg border px-4 h-[55px]"
              />
              {/* gender */}
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="mb-4 w-full rounded-lg border px-4 h-[55px]"
                style={{
                    marginBottom: "10px",                    
                    marginTop: "10px"
                  }}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
              {/* Email Input */}
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4 w-full rounded-lg border px-4 h-[55px] md:h-[65px] text-sm md:text-base outline-none"
                style={{
                  borderColor: "var(--border-light)",
                  marginBottom: "10px",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  color: "var(--text-primary)",
                  backgroundColor: "var(--black-soft)",
                }}
              />

              {/* Password Input with Show/Hide Button Inside */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    checkPasswordStrength(e.target.value);
                  }}
                  className="w-full rounded-lg border px-4 h-[55px] md:h-[65px] text-sm md:text-base outline-none"
                  style={{
                    borderColor: "var(--border-light)",
                    marginBottom: "5px",
                    paddingLeft: "10px",
                    paddingRight: "80px",
                    color: "var(--text-primary)",
                    backgroundColor: "var(--black-soft)",
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm md:text-base font-medium px-3 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap"
                  style={{
                    color: "var(--accent-primary)",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(217, 92, 43, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* Dynamic Password Requirements */}
              {(isPasswordFocused || password) && !Object.values(passwordValid).every(v => v === true) && (
                <div className="mt-2 p-3 rounded-lg mb-4" style={{ background: 'rgba(217, 92, 43, 0.1)', borderLeft: '3px solid var(--accent-primary)' }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--accent-primary)' }}>
                    Password requirements:
                  </p>
                  <ul className="text-xs space-y-1" style={{ color: 'var(--text-secondary)' }}>
                    <li className={passwordValid.length ? 'line-through opacity-60' : ''}>
                      {passwordValid.length ? '✓' : '•'} Minimum 8 characters
                    </li>
                    <li className={passwordValid.uppercase ? 'line-through opacity-60' : ''}>
                      {passwordValid.uppercase ? '✓' : '•'} 1 Uppercase letter
                    </li>
                    <li className={passwordValid.lowercase ? 'line-through opacity-60' : ''}>
                      {passwordValid.lowercase ? '✓' : '•'} 1 Lowercase letter
                    </li>
                    <li className={passwordValid.number ? 'line-through opacity-60' : ''}>
                      {passwordValid.number ? '✓' : '•'} 1 Number
                    </li>
                    <li className={passwordValid.special ? 'line-through opacity-60' : ''}>
                      {passwordValid.special ? '✓' : '•'} 1 Special character
                    </li>
                  </ul>
                </div>
              )}

              {/* Create Button */}
              <button
                onClick={handleRegister}
                className="w-full rounded-lg py-3 text-sm md:text-base font-semibold text-white transition-all duration-300 hover:opacity-90 h-[50px] mt-2"
                style={{
                  background: "var(--gradient-primary)",
                  marginBottom: "20px",
                }}
              >
                Create Account
              </button>

              {/* Login Redirect */}
              <p
                className="mt-4 text-center text-xs md:text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Already have an account?{" "}
                <span
                  onClick={() => router.push("/login")}
                  className="cursor-pointer font-semibold transition-all duration-200 hover:underline"
                  style={{ color: "var(--accent-primary)" }}
                >
                  Login now
                </span>
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN - Advertisement Space (250px) */}
          <div className="hidden lg:block w-[250px] flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="bg-[var(--black-card)] rounded-2xl overflow-hidden border border-[var(--border-light)]">
                <div className="bg-gradient-to-r from-[var(--black-soft)] to-[var(--black-deep)] p-3">
                  <p className="text-xs text-[var(--text-tertiary)] text-center uppercase tracking-wider">
                    Advertisement
                  </p>
                </div>
                <div className="p-4">
                  <div className="w-full h-[250px] bg-gradient-to-br from-[var(--black-soft)] to-[var(--black-deep)] rounded-xl flex flex-col items-center justify-center">
                    <svg
                      className="w-12 h-12 text-[var(--text-tertiary)] mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Ad Space
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-1">
                      300x250
                    </p>
                  </div>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-r from-[var(--accent-primary)]/5 to-[var(--black-soft)] rounded-2xl p-5 text-center border border-[var(--border-light)]">
                <div className="w-12 h-12 rounded-full bg-[var(--gradient-primary)] flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-heading)" }}
                >
                  Newsletter
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Get latest updates
                </p>
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full mt-3 px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                  style={{
                    background: "var(--black-soft)",
                    borderColor: "var(--border-light)",
                    color: "var(--text-primary)",
                  }}
                />
                <button
                  className="mt-2 w-full text-xs px-3 py-1.5 rounded-lg transition-all duration-300 hover:shadow-md"
                  style={{
                    background: "var(--gradient-primary)",
                    color: "white",
                  }}
                >
                  Subscribe
                </button>
              </div>

              <div className="bg-[var(--black-card)] rounded-2xl overflow-hidden border border-[var(--border-light)]">
                <div className="bg-gradient-to-r from-[var(--black-soft)] to-[var(--black-deep)] p-3">
                  <p className="text-xs text-[var(--text-tertiary)] text-center uppercase tracking-wider">
                    Sponsored
                  </p>
                </div>
                <div className="p-4">
                  <div className="w-full h-[250px] bg-gradient-to-br from-[var(--black-warm)] to-[var(--black-deep)] rounded-xl flex flex-col items-center justify-center">
                    <svg
                      className="w-12 h-12 text-[var(--accent-primary)]/40 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Your Ad Here
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-1">
                      Contact for rates
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}