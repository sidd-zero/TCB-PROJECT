# Career Suite AI: The Future of Job Search

A premium, AI-powered ecosystem designed to bridge the gap between your resume and your dream role. Built with Next.js 16 and Google Gemini 2.5-Flash.

---

## ✦ Overview
**Career Suite AI** isn't just another resume builder. It’s a strategic performance tool that auditors your professional presence through the eyes of both an **ATS Parser** and a **Senior Recruiter**. By blending technical keyword optimization with cultural alignment analysis, we ensure you don't just pass the "bot" filter—you captivate the human decision-maker.

## ✦ Key Features

### 1. Vibe Check™
Our proprietary cultural alignment engine. Most tools focus on keywords; we focus on **Tone**. Whether you're applying to a "move fast" startup or a "stability-first" enterprise, the Vibe Check ensures your resume's language resonates with the company's internal wavelength.

### 2. Brutally Honest Gap Analysis
Standard match scores are polite—we aren't. Our analysis provides a direct, transparent breakdown of exactly why you might be filtered out. 
- **Strategic Alignment**: Real-time probability of being shortlisted.
- **Skill Gaps**: Precise list of missing hard and soft skills.
- **Outcome focused**: Conversion of task-based bullets into result-oriented achievements.

### 3. LinkedIn Ghostwriter
Turn your analysis into action. The Ghostwriter generates high-conversion networking messages tailored to three distinct personas:
- **Startup**: Direct and problem-solver focused.
- **Corporate**: Professional and referral-oriented.
- **Technical**: Engineering-centric and architecture-focused.

## ✦ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) |
| **Core** | [React 19](https://react.dev/) |
| **AI Engine** | [Google Gemini 2.5-Flash](https://ai.google.dev/) |
| **Database** | [MongoDB](https://www.mongodb.com/) / [Mongoose](https://mongoosejs.com/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) / [Framer Motion](https://www.framer.com/motion/) |
| **Parsing** | [PDF-Parse](https://www.npmjs.com/package/pdf-parse) / [Mammoth](https://www.npmjs.com/package/mammoth) |
| **Auth** | [Jose (JWT)](https://www.npmjs.com/package/jose) |

## ✦ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/resume-analyser.git
cd resume-analyser
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_key
JWT_SECRET=your_jwt_secret
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the result.

---
*Built with precision for the modern job market.*
