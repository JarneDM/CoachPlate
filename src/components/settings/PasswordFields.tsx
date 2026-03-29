"use client";

import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

export default function PasswordFields() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      <div>
        <label htmlFor="password" className="block text-sm text-gray-600 mb-1">
          Nieuw wachtwoord
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            minLength={8}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 pr-20 text-sm text-gray-900 focus:border-green-500 focus:ring-0"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded"
          >
            {showPassword ? <EyeClosed size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="confirm_password" className="block text-sm text-gray-600 mb-1">
          Bevestig nieuw wachtwoord
        </label>
        <div className="relative">
          <input
            id="confirm_password"
            name="confirm_password"
            type={showConfirmPassword ? "text" : "password"}
            minLength={8}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 pr-20 text-sm text-gray-900 focus:border-green-500 focus:ring-0"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded"
          >
            {showConfirmPassword ? <EyeClosed size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
    </>
  );
}
