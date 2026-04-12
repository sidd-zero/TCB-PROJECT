npm run dev

# AI Resume Analyzer
This project is a web application that analyzes resumes using AI and provides feedback on skills, keywords, and improvements.

## Features
- Upload resume (PDF)
- Extract text using pdf-parse
- Analyze content using OpenAI API
- Display suggestions and insights
- Store results using MongoDB

## Tech Stack
- Next.js (App Router)
- TypeScript
- MongoDB + Mongoose
- OpenAI API
- Tailwind CSS

## How it works
1. User uploads a resume
2. Backend extracts text from the PDF
3. The text is sent to OpenAI for analysis
4. Results are displayed on the frontend

## Future Improvements
- Add resume scoring system
- Match resume with job descriptions
- Improve UI design
