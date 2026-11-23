/**
 * The choices behind the application's select fields and chip rows. The
 * boards, result statuses and slot times are from the uGNET form's Figma
 * (SOT Website Redesign file); the other lists are ours, as the design
 * leaves them open, and are easy to change here.
 */

export const GENDERS = ["Female", "Male", "Non-binary", "Prefer not to say"];

export const NATIONALITIES = ["Indian", "NRI", "OCI / PIO", "Other"];

export const RELATIONSHIPS = [
  "Father",
  "Mother",
  "Guardian",
  "Brother",
  "Sister",
  "Other",
];

export const BOARDS_X = ["CBSE", "ICSE", "IGCSE", "IB", "State", "Others"];

export const BOARDS_XII = [
  "CBSE",
  "ISC",
  "Diploma",
  "IGCSE",
  "IB",
  "State",
  "Others",
];

export const RESULT_STATUS = ["Waiting for results", "I have results"];

/** passing years, newest first, from next year back */
export const years = (from = new Date().getFullYear() + 1, count = 8) =>
  Array.from({ length: count }, (_, i) => String(from - i));

export const EXAMS = [
  "JEE Main",
  "JEE Advanced",
  "BITSAT",
  "VITEEE",
  "SRMJEEE",
  "MHT CET",
  "WBJEE",
  "KCET",
  "COMEDK UGET",
  "AP EAPCET",
  "TS EAPCET",
  "KEAM",
  "CUET UG",
  "Other",
];

export const EXTRACURRICULAR_TYPES = [
  "Sports",
  "Music",
  "Dance",
  "Art & Design",
  "Theatre",
  "Debate / MUN",
  "Volunteering & Social Work",
  "NCC / NSS / Scouts",
  "Other",
];

export const COCURRICULAR_TYPES = [
  "Olympiad",
  "Coding Contest",
  "Hackathon",
  "Robotics",
  "Science Fair / Exhibition",
  "Quiz",
  "Research / Project",
  "Online Course / Certification",
  "Other",
];

export const LEVELS = [
  "School",
  "Inter-school / District",
  "State",
  "National",
  "International",
];

export const LANGUAGES = [
  "Assamese",
  "Bengali",
  "English",
  "Gujarati",
  "Hindi",
  "Kannada",
  "Konkani",
  "Malayalam",
  "Marathi",
  "Odia",
  "Punjabi",
  "Tamil",
  "Telugu",
  "Urdu",
  "Other",
];

export const OCCUPATIONS = [
  "Salaried: Private sector",
  "Salaried: Government / PSU",
  "Business owner / Self-employed",
  "Professional (Doctor, Lawyer, CA, etc.)",
  "Teacher / Academic",
  "Armed forces",
  "Farmer / Agriculture",
  "Homemaker",
  "Retired",
  "Not working",
  "Other",
];

export const INCOME_RANGES = [
  "Below ₹2.5 lakh",
  "₹2.5 lakh to ₹5 lakh",
  "₹5 lakh to ₹10 lakh",
  "₹10 lakh to ₹20 lakh",
  "₹20 lakh to ₹50 lakh",
  "Above ₹50 lakh",
  "Prefer not to say",
];
