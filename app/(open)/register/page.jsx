"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod"; // Import Zod
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "../../../components/custom-select";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Country list
const countryList = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
  "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
  "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
  "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada",
  "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros",
  "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini (fmr. Swaziland)",
  "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia",
  "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
  "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia",
  "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan",
  "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein",
  "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives",
  "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico",
  "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco",
  "Mozambique", "Myanmar (formerly Burma)", "Namibia", "Nauru", "Nepal",
  "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea",
  "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine State",
  "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland",
  "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
  "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
  "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands",
  "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka",
  "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan",
  "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago",
  "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine",
  "United Arab Emirates", "United Kingdom", "United States", "Uruguay",
  "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

// Zod validation schema
const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password should be at least 6 characters"),
  country: z.string().min(1, "Please select your country"),
});

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState({ firstName: "", lastName: "", email: "", password: "", country: "" });

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form using Zod
    const result = schema.safeParse({ firstName, lastName, email, password, country: selectedCountry });
    if (!result.success) {
      const errors = result.error.format();
      setFormErrors({
        firstName: errors.firstName?._errors[0] || "",
        lastName: errors.lastName?._errors[0] || "",
        email: errors.email?._errors[0] || "",
        password: errors.password?._errors[0] || "",
        country: errors.country?._errors[0] || "",
      });
      return;
    }
    setFormErrors({ firstName: "", lastName: "", email: "", password: "", country: "" });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: `${firstName} ${lastName}`,  // Combine firstName and lastName
          email,
          password,
          country: selectedCountry,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.message || "Registration failed");
        return;
      }

      router.push("/login");
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
      console.log(error);
    }
  };

  return (
    <div className="sm:min-h-screen my-14 w-full dark:bg-black bg-white dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] relative flex items-center justify-center">
      <div className="mx-5 md:mx-16 max-w-md w-full rounded-2xl px-4 pb-8 pt-12 md:p-8 shadow-input bg-white dark:bg-black border border-stone-400 dark:border-stone-300">
        <h2 className="font-bold text-2xl text-neutral-800 dark:text-neutral-100 mb-1">
          Welcome to Festivix
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">Connect to exciting events and manage your bookings all in one place.</p>

        <form className="my-8" onSubmit={handleSubmit} noValidate>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Tyler"
            />
            {formErrors.firstName && <p className="text-red-500 text-sm">{formErrors.firstName}</p>}
          </LabelInputContainer>

          <LabelInputContainer className="mb-4">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Durden"
            />
            {formErrors.lastName && <p className="text-red-500 text-sm">{formErrors.lastName}</p>}
          </LabelInputContainer>

          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
            />
            {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
          </LabelInputContainer>

          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
          </LabelInputContainer>

          <LabelInputContainer className="mb-4">
            <Label htmlFor="country">Select your country</Label>
            <Select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
              <option value="" disabled>Select a country</option>
              {countryList.map((country, index) => (
                <option key={index} value={country}>{country}</option>
              ))}
            </Select>
            {formErrors.country && <p className="text-red-500 text-sm">{formErrors.country}</p>}
          </LabelInputContainer>

          <button
            type="submit"
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          >
            Register &rarr;
            <BottomGradient />
          </button>

          {errorMessage && (
            <>
            <p className="text-red-500 text-sm mt-2 text-center mx-auto">{errorMessage}</p>
            <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent mt-2 mb-8 h-[1px] w-full" />
            </>
          )}

        {!errorMessage && (
            <>
            <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent mt-8 mb-8 h-[1px] w-full" />
            </>
          )}

          <div className="flex items-center justify-between mx-2">
            <div className="text-sm">
              <Link href="/login" className="font-medium text-neutral-800 dark:text-neutral-200">
                Already have an account? Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}



const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};