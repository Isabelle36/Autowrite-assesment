##  Features
- Upload documents: **JPG, PNG, TXT, PDF**
- Text extraction powered by **AWS Textract**
- Fully **serverless** using Next.js API Routes
- Smart parsing that identifies:
  - First name  
  - Last name  
  - License number  
  - Date of birth  
  - Expiry date  
  - Address  
- Auto-filled form fields (editable by user)
- Submit and store extracted data in **Supabase**
- Top-page toast notifications for:
  - *Analyzing → Success/Error*

---

## 📹 Demo
- **Video walkthrough:** https://youtu.be/zf9fh33qksc?si=6gVqObwRJOkkcjzb)  
- **Live demo:** https://autowrite-assesment.vercel.app/

---

## 🛠️ Tech Stack
- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **AWS Textract**
- **Supabase**

---

## ⚙️ Setup Instructions

### 1. Clone the repository
```sh
git clone https://github.com/Isabelle36/Autowrite-assesment.git
cd Autowrite-assesment
```

### 2. Install dependencies
```sh
npm install
```

### 3. Add environment variables  
Create a `.env` file in the project root:

```env
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY
AWS_REGION=us-east-1
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

> **Note:** AWS Textract performs best in `us-east-1`.

### 4. Configure AWS Textract  
Follow this guide (which i also did) to setup your AWS:  
[CloudThat – Extract Data from an Image using AWS Textract](https://cloudthat.com/resources/blog/extract-data-from-an-image-using-aws-textract/)

### 5. Create a database in Supabase then create a table by running this in sql
```sql
create table document_licenses (
  id uuid default uuid_generate_v4() primary key,
  first_name text,
  last_name text,
  license_no text unique,
  expiry_date text,
  dob text,
  address text,
  created_at timestamp default now()
);
```

### 6. Run the development server
```sh
npm run dev
```

Open your browser at:  
http://localhost:3000

---

## 🗂️ Project Structure
```
assesment/
├── app/
│   ├── api/
│   │   ├── submitform/        # Handles saving form data to Supabase
│   │   │   └── route.ts
│   │   ├── textextract/       # Handles AWS Textract extraction logic
│   │   │   └── route.ts
│   ├── layout.tsx             # App layout
│   └── page.tsx               
│
├── components/
│   ├── DocumentCard.tsx       # Card UI for uploaded documents
│   ├── DocumentSection.tsx    # Main component handling upload & form logic
│   ├── FileUpload.tsx         # File upload handler (drag & drop)
│   ├── FormSection.tsx        # Form UI for user details
│   ├── Navbar.tsx             # Top navigation bar
│   ├── UploadStatusToast.tsx  # Upload & analysis status indicator
│   └── ui/                    # Reusable UI components (buttons, alerts, etc.)
│
├── lib/
│   ├── extractCleanData.ts    # Cleans & maps Textract data to usable fields
│   ├── supabase.ts            # Supabase client setup
│   ├── types.ts               # Shared TypeScript types
│   └── utils.ts               # Helper utilities
│
├── public/                    # Static assets (icons, images, logos)
│
├── .env                       # Environment variables
├── next.config.ts             # Next.js config
├── package.json
└── tsconfig.json
```
## How It Works
```

1. Upload Flow

- File is sent to `/api/textextract`
- AWS Textract extracts raw text
- `extractCleanData` parses and maps fields:
  - Name  
  - DOB  
  - Address  
  - License number  
  - Expiry date  
- Cleaned data auto-populates the UI form

2. Form Submission
- Form data sent to `/api/submitform`
- Saved securely in **Supabase**
