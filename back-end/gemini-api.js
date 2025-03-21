const { GoogleGenerativeAI } =require("@google/generative-ai");
const fs=require('fs');

// Initialize the GoogleGenerativeAI model
const genAI = new GoogleGenerativeAI("AIzaSyBSJ4GtEKVC3gVzaJBP6t10ps80z0mcdy4");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

async function extractResumeData(filePath) {
  const filePart = fileToGenerativePart(filePath, "application/pdf"); 
  
  // Define the prompt
  const prompt = `Extract and structure the following information from the resume into JSON format:

  -Personal Details: name, email, phone, address
  -Education:degree, institution, year (Extract only the year from the date range, Do not include month information
  e.g.,"2021-2025". For a single year, keep that year.)
    , GPA (If GPA is given as a percentage (e.g., 94%, 95.5%),
    convert it to a CGPA on a 10-point scale.  If GPA is given as a fraction out of 10 (e.g., 8/10, 8.5/10),
    display it as a decimal out of 10 (e.g., 8, 8.5). Do NOT include parenthetical conversions or any other explanatory text.
    If GPA is on a different scale or in a different format, preserve it exactly as it appears in the resume. 
    Critically, determine the "degree" field as follows:
      *   If the education entry mentions "Class X", "SSC", or "School", set the "degree" to "Class 10th".
      *   If the education entry mentions "Engineering", "B.Tech", or "B.E", set the "degree" to "B.Tech".
      *   For any other education entry (e.g., "Class 12th", "Intermediate", etc.), set the "degree" to "Class 12th".
  -Social Media:LinkedIn, GitHub
  -Projects:title, description (If a project has only a title and no description,
      include only the title. Do NOT add or generate any descriptions if they are missing in the resume. 
      Preserve the project information exactly as it appears in the source resume.)

  **JSON Format:**
    {
      "personalDetails": {
        "name": "",
        "email": "",
        "phone": "",
        "address": ""
      },
      "education": [
        {
          "degree": "",
          "institution": "",
          "year": "",//  E.g., "2021-2025"
          "GPA": null // Or a number if GPA is available and converted as per instructions.
        }
      ],
      "socialMedia": {
        "LinkedIn": "",
        "github": ""
      },
      "projects": [
          {
              "title": "",
              "description": "" // If no description exists, this field should be present but empty: ""
          },
      ]
    }
  `
  
  try {
    const result = await model.generateContent([prompt, filePart]);

    const data = await result.response.text();
    
    const regex = /\{.*\}/s;
    const jsonValidateData = data.match(regex);

    if (jsonValidateData) {
      const parsedData = JSON.parse(jsonValidateData[0]); // ✅ Convert to JSON object
      return parsedData;
    } else {
      console.log("No valid JSON data found.");
      return null;
    }
} catch (error) {
    console.error("Error during AI model generation or JSON parsing:", error);
    return null;
}
}

module.exports = {extractResumeData};
// extractResumeData('SIDDARTHA REDDY MADGULA - FULL STACK DEVELOPER - Resume (1).pdf').then((data)=>{
//     console.log(data);
// }).catch((err)=>{
//     console.log(err);
// }); 