export type FormSectionProps = {
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