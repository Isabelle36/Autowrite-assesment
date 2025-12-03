import React, { useState } from "react";
import { Info, CheckCircle2, XCircle, Loader } from "lucide-react";
import { Alert } from "./ui/alert";
import type { FormSectionProps } from "@/lib/types";


export const FormSection: React.FC<FormSectionProps> = ({
  formData,
  setFormData,
}) => {
  const [alert, setAlert] = useState<
    | { type: 'success' | 'error' | 'loading'; message: string }
    | null
  >(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
      <h2 className="text-lg font-semibold text-gray-900">Additional Information</h2>
      <p className="text-gray-500 text-sm mt-1 mb-8">
        We need some additional information that may be missing from your documents.
      </p>

      {alert && (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-full flex justify-center pointer-events-none">
          <div className="pointer-events-auto">
            <Alert
              variant={
                alert.type === 'success'
                  ? 'success'
                  : alert.type === 'error'
                  ? 'error'
                  : 'info'
              }
              icon={
                alert.type === 'loading' ? (
                  <Loader className="animate-spin text-blue-600" />
                ) : alert.type === 'success' ? (
                  <CheckCircle2 className="text-green-600" />
                ) : (
                  <XCircle className="text-red-600" />
                )
              }
              isNotification
              className="mb-4 min-w-[260px]"
            >
              {alert.message}
            </Alert>
          </div>
        </div>
      )}
      <form className="space-y-6"
        onSubmit={async (e) => {
          e.preventDefault();
          setAlert({ type: 'loading', message: 'Submitting the form...' });
          try {
            const res = await fetch("/api/submitform", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
              setAlert({ type: 'error', message: data.error || 'Something went wrong.' });
              return;
            }
            setAlert({ type: 'success', message: 'Form submitted successfully!' });
            setFormData({ firstName: '', lastName: '', licenseNo: '', expiryDate: '', address: '', dob: '' });
            setTimeout(() => setAlert(null), 3000);
          } catch (err) {
            setAlert({ type: 'error', message: 'Something went wrong while saving form data.' });
          }
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 font-medium mb-2 flex items-center gap-1">
              First Name <Info className="w-4 h-4 text-gray-400" />
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              className="bg-[#F9F9FF] border border-gray-200 rounded-lg p-3 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-700 font-medium mb-2 flex items-center gap-1">
              Last Name <Info className="w-4 h-4 text-gray-400" />
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              className="bg-[#F9F9FF] border border-gray-200 rounded-lg p-3 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-700 font-medium mb-2 flex items-center gap-1">
              License No. <Info className="w-4 h-4 text-gray-400" />
            </label>
            <input
              type="text"
              name="licenseNo"
              value={formData.licenseNo}
              onChange={handleChange}
              placeholder="S31356.."
              className="bg-[#F9F9FF] border border-gray-200 rounded-lg p-3 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-700 font-medium mb-2 flex items-center gap-1">
              Expiry Date <Info className="w-4 h-4 text-gray-400" />
            </label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              placeholder=""
              className="bg-[#F9F9FF] border border-gray-200 rounded-lg p-3 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-700 font-medium mb-2 flex items-center gap-1">
              Address <Info className="w-4 h-4 text-gray-400" />
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="29 STREET CA..."
              className="bg-[#F9F9FF] border border-gray-200 rounded-lg p-3 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>

          {/* DOB */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 font-medium mb-2 flex items-center gap-1">
              DOB <Info className="w-4 h-4 text-gray-400" />
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              placeholder=""
              className="bg-[#F9F9FF] border border-gray-200 rounded-lg p-3 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 cursor-pointer bg-linear-to-r from-blue-500 to-blue-700 text-white font-medium px-6 py-3 rounded-full hover:opacity-90 transition"
        >
          Submit information
        </button>
      </form>
    </section>
  );
};
