import React from "react";
import { Info } from "lucide-react"; 

type FormSectionProps = {
  formData: {
    firstName: string;
    lastName: string;
    licenseNo: string;
    expiryDate: string;
    address: string;
    dob: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      firstName: string;
      lastName: string;
      licenseNo: string;
      expiryDate: string;
      address: string;
      dob: string;
    }>
  >;
};

export const FormSection: React.FC<FormSectionProps> = ({
  formData,
  setFormData,
}) => {
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

      <form className="space-y-6">
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
