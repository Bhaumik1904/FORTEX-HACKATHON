🚨 Early Warning System – AI-Powered Student Complaint & Risk Monitoring

An AI-driven early warning and complaint management platform designed to detect risk patterns, prevent institutional crises, and ensure timely resolution of student issues.

This system enables students to submit complaints, while administrators monitor, analyze, and respond proactively using predictive indicators and escalation alerts.

🔗 Live Deployment

Frontend:
👉[ https://fortex-hackathon-m9g6.vercel.app](https://fortex-frontend.vercel.app/)

Backend API:
👉 [https://fortex-hackathon-m9g6.vercel.app](https://fortex-hackathon.vercel.app/)

GitHub Repository:
👉 https://github.com/Bhaumik1904/FORTEX-HACKATHON

SAMPLE DATA FOR LOGIN:
Student Portal : 
EMAIL - bhaumik_hinunia@srmap.edu.in
Password - 123456

Admin Portal :
Email - admin@srmap.edu.in
Password - admin123

🧠 Problem Statement

In many universities:

Student complaints go unnoticed or are delayed.

Escalation happens only after unrest starts.

There is no system to predict institutional risk.

Admins rely on manual tracking and emails.

This leads to:

Student dissatisfaction

Protests and unrest

Loss of trust in administration

💡 Our Solution

Early Warning System is a real-time, AI-powered platform that:

Collects student complaints

Analyzes severity & sentiment

Assigns deadlines

Detects unresolved patterns

Predicts institutional risk

Alerts admins before escalation occurs

👥 User Roles
👨‍🎓 Student

Register / Login

Submit complaints by category

Get AI severity analysis

Track complaint status

View assigned department & deadline

Receive escalation awareness

🛡️ Admin

View all complaints

Assign department

Set deadlines

Update status (Submitted → Assigned → In Progress → Resolved)

Get deadline missed alerts

View institutional risk score

Monitor real-time complaint feed

See predictive escalation signals

🔁 System Flow

Student submits complaint

AI analyzes severity & risk

Admin receives complaint

Admin assigns department + deadline

System tracks progress

If deadline is missed → escalation alert

Dashboard risk score increases

Admin receives preventive action suggestions

📊 Key Features

AI Severity Scoring

Deadline Escalation Detection

Institutional Risk Score

Real-Time Complaint Feed

Signal Analysis & Predictive Risk

Student & Admin Dashboards

JWT Authentication

Role-Based Access Control

🏗️ Technology Stack
Frontend

React (TypeScript)

Tailwind CSS

React Router

Lucide Icons

Backend

Node.js

Express.js

JWT Authentication

bcryptjs

File-based JSON storage

Deployment

Vercel (Frontend + Backend)

📁 Project Structure
FORTEX-HACKATHON
│
├── backend
│   ├── routes
│   ├── data
│   ├── index.js
│
├── src
│   ├── components
│   ├── routes.ts
│   ├── api.ts
│
├── public
├── App.tsx
├── main.tsx
└── README.md

🔐 Security Measures
Vulnerability	Counter Measure
Plain passwords	Hashed using bcrypt
Unauthorized access	JWT token authentication
Cross-user access	User ID based filtering
Role misuse	Role-based routing
Fake complaints	Admin validation
Deadline abuse	Escalation detection
🚀 Future Scope

Database (MongoDB / PostgreSQL)

ML-based sentiment analysis

SMS/Email alerts

Mobile App

Anonymous complaints

Heatmap dashboards

🏁 Conclusion

This system shifts complaint management from reactive to predictive.
It enables institutions to act before unrest occurs, improving trust, safety, and transparency.

👤 Author

Bhaumik Hinunia
GitHub: https://github.com/Bhaumik1904

Team Name : Error Terror
<br>
Bhaumik Hinunia<br>
Shaik Zeeshaan Suhail<br>
Namburi Sai Pavan Vybhav<br>
Marisa Amith Ratna
