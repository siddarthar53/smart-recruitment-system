
const data =`json
{
  "personalDetails": {
    "name": "Siddartha reddy Madgula",
    "email": "madgulasiddarthareddy@gmail.com",
    "phone": "+917013825408",
    "address": "Hyderabad"
  },
  "education": [
    {
      "degree": "Under Graduation",
      "institution": "Vignana Bharathi Institute Of Technology",
      "dates": "12/2021 - Present",
      "grades": "8.02 CGPA"
    },
    {
      "degree": "12th Standard",
      "institution": "Sri Chaitanya Junior Kalasala, Nallakunta",
      "dates": "07/2019-05/2021",
      "grades": "9.5 GPA"
    },
    {
      "degree": "10th Standard",
      "institution": "Naagarjuna high school",
      "dates": "04/2018-03/2019",
      "grades": "9.8 GPA"
    }
  ],
  "skills": {
    "technicalSkills": [
      "Back-end Development",
      "competitive programming",
      "MySQL",
      "SQLAlchemy",
      "Angular",
      "Node.js",
      "Bootstrap",
      "Angular Material",
      "Express.js",
      "Front-end Development",
      "Git",
      "Github",
      "HTML/CSS",
      "JavaScript",
      "Java",
      "Python",
      "TypeScript",
      "SQL"
    ],
    "softSkills": []
  },
  "workExperience": [],
  "certifications": [
    {
      "name": "Udemy-The Complete Web Development Bootcamp",
      "year": 2024,
      "issuer": "Dr.Angela Yu"
    }
  ],
  "projects": [
    {
      "name": "Flask Microservices Authentication System",
      "description": "Developed a Flask-based microservice application implementing a user authentication system with features like registration, login, and logout. The application uses SQLAlchemy for database operations and is connected to a MySQL database. Designed and set up proper routing for efficient navigation and ensured the project adheres to clean architecture principles."
    },
    {
      "name": "Library Management System (Java) (Real time project)",
      "description": "Designed and implemented a comprehensive library management system to automate cataloging, borrowing, and returning of books. Utilized Java Swing for GUI and JDBC for database connectivity, resulting in an efficient and user-friendly application."
    },
    {
      "name": "Smart Home Energy Management System using Machine Learning (Minor Project)",
      "description": "To develop a Smart Home Energy Management System using traditional machine learning algorithms that predicts energy consumption and optimizes usage based on historical datasets, without relying on real-time sensors. The project focuses on creating a Smart Home Energy Management System (SHEMS) that leverages traditional machine learning algorithms to analyze historical datasets for energy consumption."
    }
  ]
}
`;

// Regex to match the entire JSON object from the outermost braces
const regex = /\{.*\}/s;  // 's' flag allows '.' to match newline characters

const result = data.match(regex);

if (result) {
  console.log(result[0]);  // Output the JSON data with curly brackets
} else {
  console.log("No JSON data found.");
}
