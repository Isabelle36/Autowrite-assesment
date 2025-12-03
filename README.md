## Features
- Upload driver’s license or document (JPG, PNG, TXT, PDF)
- Extracts text using AWS Textract
- Smart parsing logic detects:
  - First name
  - Last name
  - License number
  - Date of birth
  - Expiry date
  - Address
- Auto-fills form fields (editable)
- Submit form to store data in Supabase
- Top-of-page status toast shows progress (Analyzing → Success/Error)

## 📹 Demo
- Watch it in action: *(Add your video link here)*
- Try the live version: *(Add your deployed URL here)*

## 🛠️ Tech Stack
- Next.js 
- TypeScript
- TailwindCSS
- AWS Textract
- Supabase

## ⚙️ Setup Instructions
1. **Clone the repo**
   ```sh
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
   ```
2. **Install dependencies**
   ```sh
npm install
   ```
3. **Configure environment variables**
   Create a `.env` file in your project root:
   ```env
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY
AWS_REGION=us-east-1
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
   ```
   *Note: AWS Textract works best in `us-east-1`.*

4. **Set up AWS Textract**
   - Follow this guide which i used [CloudThat: Extract Data from an Image using AWS Textract](https://cloudthat.com/resources/blog/extract-data-from-an-image-using-aws-textract/)

5. **Create a Supabase table**
   ```sql
create table driving_licenses (
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

6. **Run the app locally**
   ```sh
npm run dev
   ```
   Then open [http://localhost:3000](http://localhost:3000)

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
│   └── page.tsx               # Main page with upload + form
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
├── next.config.ts              # Next.js config
├── package.json
└── tsconfig.json

```

## 🧠 How it works
- **Upload:**
  - File sent to `/api/textextract`
  - AWS Textract extracts text
  - Smart cleaning function (`extractCleanData`) detects key fields
  - Cleaned data auto-fills form fields
- **Submit:**
  - Form data sent to `/api/submitform`
  - Backend stores it in Supabase

---
Feel free to open issues or contribute!