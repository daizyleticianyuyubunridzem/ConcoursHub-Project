# ConcoursHub

ConcoursHub is a web-based platform designed to help students across Cameroon discover competitive entrance examinations (concours) early, access reliable admission information, understand eligibility requirements, and prepare for their next academic steps. It particularly focuses on students in the Northwest Region, especially those in communities outside Bamenda, who may have limited access to timely and trustworthy information about available opportunities.

By bringing concours information, admission requirements, important dates, and official sources together in one place, ConcoursHub enables students to explore opportunities ahead of time, assess their eligibility based on their academic profiles, identify areas where they need to improve, and plan their preparation before application periods begin. Through early access to relevant information, the platform aims to reduce information gaps, support informed academic decisions, and help students approach concours with greater confidence and preparedness.


**Note:** ConcoursHub does not process applications. Students must apply through the relevant institution and verify information using its official sources.

## Features

### Students

* Browse published concours and application details.
* Create an account and manage an academic profile.
* Save opportunities for future reference.
* Compare academic results with published requirements.
* Reset forgotten passwords through email.

### Administrators

* Manage institutions, schools, departments, programmes, and concours.
* Manage application sessions and admission requirements.
* Publish verified concours information.
* Manage student accounts and create administrator accounts.

## Technology Stack

* **Backend:** Node.js, TypeScript, Express.js
* **Frontend:** EJS, Bootstrap 5, custom CSS
* **Database:** MongoDB and Mongoose
* **Authentication:** express-session with MongoDB-backed sessions
* **Validation:** Zod
* **Email:** Nodemailer

## Requirements

* Node.js 20 or newer
* npm
* MongoDB database
* SMTP account for password reset emails

## Local Setup

1. Clone the repository and navigate into the project directory.
2. Install dependencies using npm install
  

3. Create a `.env` file in the project root using `.env.example` as a reference. Configure the required database, session, application URL, and email settings.

4. Start the development server:

   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000` in your browser.

## Available Commands

```bash
npm run dev    # Start the development server
npm run build  # Compile TypeScript
npm start      # Start the compiled application
```

## Project Routes

* **Public browsing:** `/explore`
* **Student dashboard:** `/student`
* **Admin dashboard:** `/admin`

ConcoursHub uses server-rendered EJS pages and is not currently configured as a separate frontend application with a cross-origin API.

## Deployed Application on render
**Live URL:**
https://concourshub-project.onrender.com


