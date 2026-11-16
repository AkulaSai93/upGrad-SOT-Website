/**
 * Every FAQ on sot.upgrad.com/allFAQs (read 16 Nov 2026), in its own tab
 * order and wording; the one-line topic descriptions are ours.
 */
export type Faq = { q: string; a: string };
export type Topic = { id: string; title: string; sub: string; faqs: Faq[] };

export const TOPICS: Topic[] = [
  {
    id: "ugsot",
    title: "upGrad School of Technology",
    sub: "The school, the program and how to reach us.",
    faqs: [
      {
        q: "What programs does upGrad School of Technology offer in collaboration with partner universities?",
        a: "upGrad School of Technology (uGSOT) collaborates with accredited partner universities to offer B.E/B.Tech programs with a focus on technology and applied learning. The degree is conferred by the respective partner university. The curriculum is designed to prepare students for careers in software engineering, AI, and related fields through a rigorous, industry-aligned academic environment.",
      },
      {
        q: "What is the admission process for the partner-university B.E/B.Tech program?",
        a: "The admission process typically involves application submission, entrance assessment (uGNET), and a personal interview for shortlisted candidates. Eligibility, required documents, and important dates are published on our website. You can track your application progress through the student dashboard.",
      },
      {
        q: "What are the eligibility criteria for B.E/B.Tech at partner universities?",
        a: "Eligibility criteria include completion of 12th grade with Mathematics, Physics, and Chemistry from a recognized board. Specific year-of-passing and board requirements are updated each admission cycle. Check the current application guidelines on our website for the latest criteria.",
      },
      {
        q: "Are scholarships available for the partner-university program?",
        a: "Yes. Merit-based scholarships and financial aid options are available for the B.E/B.Tech program offered through partner universities. Eligibility is determined by performance in the entrance process and overall profile. Details on scholarship types, amounts, and application process are available during the admission cycle.",
      },
      {
        q: "What placement and career support is available?",
        a: "Students receive dedicated placement support, industry partnerships, and career guidance through the program. This includes placement preparation, company recruitment drives, and internship opportunities. Placement outcomes and support services are detailed on our website and in program brochures.",
      },
      {
        q: "How can I contact the team for admission queries?",
        a: "You can reach us through the contact details on our website, the AI Chatbot for instant answers, or by email/phone for admission and general queries. Our counselling team is available to assist with program information, eligibility, and the application process for partner university campuses.",
      },
      {
        q: "What is Comprehensive Profiling and is it mandatory?",
        a: "Comprehensive Profiling is an optional section that allows you to provide additional information about your achievements, extracurricular activities, language fluency, and other accomplishments. While not mandatory, completing it can strengthen your application and give the admission committee a more holistic view of your profile.",
      },
      {
        q: "What are the benefits of applying early?",
        a: "Applying early gives you more flexibility in choosing test and interview slots, early access to preparation resources, more time to prepare, and priority consideration in the admission process. We encourage you to complete your application as soon as possible.",
      },
      {
        q: "What are the ways to get in touch with your team?",
        a: "Select your preferred contact option below. Phone: +91 8296506853 WhatsApp: +91 8296506853 Email: info@upgradsot.com",
      },
    ],
  },
  {
    id: "program",
    title: "Program",
    sub: "The B.Tech, its specialisations and the degree.",
    faqs: [
      {
        q: "What programs are offered in collaboration with partner universities?",
        a: "Partner universities offer a 4-year, full-time B.E/B.Tech in Computer Science Engineering, delivered on campus. The degree is conferred by the respective UGC-recognized and AICTE-approved partner university. From the first semester, students are immersed in structured coding, applied problem-solving, and real-world technical exposure. The curriculum balances strong academic foundations with practical implementation, enriched through collaboration with upGrad School of Technology.",
      },
      {
        q: "What specialization pathways are available?",
        a: "Students may choose from three focused specializations: Full Stack AI & Cloud Innovation, Gen AI & ML, and Quantum Computing & AI. The first year builds strong foundations in mathematics, programming, and computer science principles. Specialization depth increases in later semesters, allowing students to develop domain expertise in emerging technology areas.",
      },
      {
        q: "What Makes the Program Distinct?",
        a: "The program is built around applied learning and continuous industry alignment. Students begin coding from the first semester itself and complete over 4,000 hours of structured coding practice. Across eight semesters, they work on 300+ real-world projects and build 15+ deployable applications, graduating with a strong, demonstrable portfolio. Beyond hands-on depth, the curriculum is refreshed every six months with inputs from industry professionals, including leaders from global technology companies. The program also includes: 8-week focused deep dives into niche areas such as LLMs, advanced web systems, and quantum technologies; a 1:10 mentor-to-student ratio, enabling personalized feedback and skill tracking; structured recruiter preparation tracks aligned with 1,400+ hiring partners; and access to global exposure opportunities, including semester abroad and international competitions. Students can also pursue dedicated pathways in startups or research, supported by incubation access, funding opportunities, or structured MS/PhD preparation.",
      },
      {
        q: 'What does "AI-first" mean in this program?',
        a: "AI is not treated as an elective or add-on. The curriculum integrates artificial intelligence, machine learning, and emerging technologies into the learning journey in a structured manner. Students are exposed to modern tools, frameworks, and problem-solving approaches aligned with evolving industry demands.",
      },
      {
        q: "What career pathways are available after graduating?",
        a: "The program is designed with multiple pathways: High-paying technology roles, Startup and entrepreneurship, and Research and higher studies. Students receive structured support aligned to their chosen pathway as they progress through the program.",
      },
      {
        q: "Who awards the degree?",
        a: "The B.Tech/B.E degree is formally conferred by the respective UGC-recognized and AICTE-approved partner university where the student is enrolled. Students study on campus at accredited universities and graduate with a recognized engineering degree that is valid for employment, competitive examinations, and higher education in India and internationally. Collaboration with upGrad School of Technology enriches the academic framework with industry-integrated curriculum, applied learning models, structured mentorship, and career-aligned pathways. The program is backed by upGrad's established education ecosystem, which includes: 1,400+ hiring partners, 30,000+ successful placements across programs, and a global alumni network of 10 million+ learners. This broader ecosystem strengthens industry connections, recruiter access, and long-term career support available to students.",
      },
      {
        q: "Which partner universities deliver this B.E/B.Tech program?",
        a: "The B.E/B.Tech program is delivered on campus by leading, accredited partner universities, and the degree is conferred by the respective university. Current partner universities include: Sri Siddhartha Academy of Higher Education (SSAHE) - NAAC A+ Accredited, established academic legacy with decades of excellence, strong infrastructure and research-oriented environment; Presidency University (Presidency College), Bengaluru - NAAC A+ Accredited, UGC 2(f) & 12(b) Recognised, 25+ years of academic excellence with a strong alumni network. Each campus provides the academic foundation, infrastructure, and residential experience, while collaboration with upGrad School of Technology integrates industry-aligned curriculum enhancements, applied learning components, and structured career pathways.",
      },
      {
        q: "Why choose this partner-university program over a conventional engineering college?",
        a: "This program is designed as a performance-driven ecosystem delivered through partner universities. Students learn in a selective cohort environment that values accountability, consistent output, and professional standards. This prepares students to think, build, present, and compete at a global level. Students gain access to founder-led masterclasses and direct interaction with leaders from global technology companies, offering real-world insights into how products are built and scaled. Through structured global exposure opportunities, including semester-abroad options and international competitions, students experience technology beyond local boundaries. The innovation culture is deeply embedded. Students are encouraged and supported to contribute to open-source communities and participate in globally recognized platforms such as GSoC, ICPC, and NASA Space Apps. For those inclined toward entrepreneurship, the program provides access to incubation support and idea-driven funding opportunities, enabling students to build and test ventures while still pursuing their degree.",
      },
      {
        q: "Who is this program best suited for?",
        a: "This program is best suited for students who are interested in software development and emerging tech. It is ideal for those who are curious about how technology works, enjoy problem-solving, and want to build real systems. Students who are serious about building long-term careers in software, AI, data, cloud, or advanced technology domains and are prepared for a rigorous academic journey that demands consistency, discipline, and effort will find this program well aligned with their goals.",
      },
    ],
  },
  {
    id: "admission",
    title: "Admission",
    sub: "From application to your final admission status.",
    faqs: [
      {
        q: "What is the admission process for the partner-university B.E/B.Tech program?",
        a: "The admission process is designed to evaluate both academic capability and long-term potential for the B.E/B.Tech program offered by partner universities. It includes five stages: Application submission, uGNET (Entrance Examination), Personal Interview, Counselling Session, and Seat Confirmation.",
      },
      {
        q: "Is admission to this program selective?",
        a: "Yes. Admission is selective by design. We aim to build a focused, high-performance cohort each year at the partner university campuses. Selection depends on uGNET performance, interview interaction, and overall academic consistency.",
      },
      {
        q: "What does the Personal Interview evaluate?",
        a: "The Personal Interview is not a memory-based test. It evaluates problem-solving approach, clarity of thinking, communication, and the motivation to pursue technology seriously. We are interested in understanding the student beyond test scores.",
      },
      {
        q: "Who conducts the Personal Interview?",
        a: "Interviews will be conducted by Industry Subject Matter Experts associated with the program. The format is structured but conversational.",
      },
      {
        q: "Is the interview conducted online or offline?",
        a: "The interview is conducted online for accessibility and convenience. Details, including meeting links and assigned slots, are shared in advance to the registered email address.",
      },
      {
        q: "Can interview slots be rescheduled?",
        a: "Interview slots are limited and carefully allocated. Candidates are expected to attend the assigned slot. Rescheduling is generally not permitted unless approved under exceptional circumstances.",
      },
      {
        q: "How long does the interview last?",
        a: "The interaction typically lasts around 30 minutes. Students are encouraged to join on time and treat the discussion with seriousness.",
      },
      {
        q: "When will I know my final admission status?",
        a: "Admission decisions are communicated after completion of all required stages i.e, the entrance exam and the personal interview. The final decision will be communicated during the counselling session. Updates are also shared via the registered email ID and on the student dashboard.",
      },
      {
        q: "What happens during the Counselling Session?",
        a: "The counselling session helps students understand program pathways, clarify partner university campus options, review fee structure, scholarship eligibility, and complete admission formalities. This stage ensures informed decision-making.",
      },
      {
        q: "Is admission confirmed immediately after the interview?",
        a: "Admission is confirmed only after successful evaluation, counselling completion, and the payment of the seat blocking fee. Seats are limited and allocated based on merit at the respective partner university campus.",
      },
      {
        q: "What if I do not qualify in my first attempt?",
        a: "Students who do not qualify may re-attempt the uGNET after making a payment of Rs. 500 in the same cycle. We encourage focused preparation before attempting it again.",
      },
      {
        q: "Is there a deadline to confirm my seat?",
        a: "Yes. Once selected, students must confirm their seat within the communicated deadline. Failure to do so may result in the seat being offered to the next eligible candidate.",
      },
      {
        q: "Can I apply to multiple campus partners?",
        a: "Campus selection is discussed during counselling. Admission is granted to a specific partner university campus based on availability and eligibility.",
      },
      {
        q: "Are lateral entries or transfers allowed?",
        a: "Currently, admissions are processed through the structured entry cycle only. Transfer policies, if applicable, are governed by partner university regulations.",
      },
    ],
  },
  {
    id: "interview",
    title: "Interview",
    sub: "The Personal Interview round, explained.",
    faqs: [
      {
        q: "Why is there a Personal Interview round?",
        a: "The Personal Interview is an important stage in upGrad School of Technology's admission process. While uGNET evaluates aptitude and analytical ability, the interview allows us to understand the student beyond test scores. We assess clarity of thought, communication, motivation, and seriousness toward building a future in technology. It also gives students the opportunity to understand the expectations of the program before committing.",
      },
      {
        q: "Who conducts the interview?",
        a: "Interviews are conducted by Industry Subject Matter Experts associated with upGrad School of Technology.",
      },
      {
        q: "What does the interview evaluate?",
        a: "The interview is structured but conversational. We typically assess how you approach problem-solving, clarity in explaining your thoughts, conceptual understanding of fundamentals, motivation to pursue engineering seriously, and long-term goals.",
      },
      {
        q: "Is the interview technical?",
        a: "The discussion may include basic technical or logical questions to understand your foundational clarity. However, the focus is on approach and communication, rather than complex theory.",
      },
      {
        q: "How long does the interview last?",
        a: "The interaction typically lasts around 30 minutes. Students are expected to join on time and treat the discussion with professionalism.",
      },
      {
        q: "Is the interview conducted online or offline?",
        a: "The interview is conducted online for accessibility. Students receive their allotted slot and meeting details in advance on their registered email address.",
      },
      {
        q: "Can the interview slot be rescheduled?",
        a: "Interview slots are limited and allocated carefully. Rescheduling is generally not permitted unless approved under exceptional circumstances. Students are advised to plan accordingly.",
      },
      {
        q: "How should I prepare for the interview?",
        a: "Students should revise logical reasoning concepts, be prepared to discuss their interest in technology, reflect on why they want to pursue engineering and explain their approach to solving problems.",
      },
      {
        q: "What happens after the interview?",
        a: "After evaluation, candidates will be informed of their admission status on their registered email address. Selected students move forward to the counselling and seat confirmation stage.",
      },
      {
        q: "Does clearing the interview guarantee admission?",
        a: "Admission decisions are based on overall performance across stages. Clearing the interview is a strong step forward, but final confirmation is subject to seat availability and completion of formalities.",
      },
    ],
  },
  {
    id: "ugnet",
    title: "uGNET",
    sub: "The entrance test: format, scoring and preparation.",
    faqs: [
      {
        q: "What is uGNET?",
        a: "uGNET (upGrad School of Technology National Entrance Test) is the official entrance examination for admission into the B.E/B.Tech program at upGrad School of Technology. It is designed to assess a student's foundational readiness for a rigorous, technology-focused academic environment. The test evaluates aptitude, analytical thinking, mathematical clarity, and problem-solving ability.",
      },
      {
        q: "Why is uGNET required?",
        a: "upGrad School of Technology maintains a structured and selective admission process. uGNET helps us assess whether a student is prepared for strong academic rigor and applied learning. It ensures that every admitted cohort maintains a consistent standard.",
      },
      {
        q: "What does uGNET evaluate?",
        a: "uGNET evaluates three core areas: Mathematical Ability, Logical Reasoning, and Verbal & Analytical Clarity.",
      },
      {
        q: "How is uGNET structured?",
        a: "uGNET is a 120-minute online examination with 90 questions across mathematical ability, logical reasoning, and verbal aptitude. Questions vary in difficulty and are designed to test depth of understanding rather than surface-level familiarity. The overall score determines progression to the Personal Interview stage.",
      },
      {
        q: "Is there a qualifying cut-off?",
        a: "Yes. Candidates qualify based on their overall performance across the entrance test, the interview and their 10th, 11th, and 12th scores. Candidates who score well in the uGNET and meet the required cut-off move forward to the interview stage. Meeting eligibility criteria alone does not guarantee progression.",
      },
      {
        q: "Is there negative marking?",
        a: "Yes. uGNET follows a performance-based scoring model, which includes negative marking for incorrect answers. Students are encouraged to attempt questions thoughtfully rather than guessing.",
      },
      {
        q: "How competitive is uGNET?",
        a: "uGNET is competitive by design. It is intended to filter students who are prepared for the academic intensity of the program. However, students who prepare seriously often see strong improvement across attempts.",
      },
      {
        q: "Can I reattempt uGNET?",
        a: "Yes. If you do not qualify in one cycle, you may register for the next uGNET attempt. You can attempt the uGNET twice in an academic cycle.",
      },
      {
        q: "How should I prepare for uGNET?",
        a: "Registered candidates receive access to the uGNET Preparation Kit, which outlines: Section-wise syllabus guidance, Sample question patterns, and Preparation strategy. Students may also use the Engineering Entrance Practice available on the website.",
      },
      {
        q: "Does uGNET determine scholarships?",
        a: "Yes. Strong performance in uGNET will make students eligible for merit-based scholarships, subject to overall evaluation.",
      },
      {
        q: "What happens after I clear uGNET?",
        a: "Candidates who meet the qualifying benchmark move forward to the Personal Interview round, where we evaluate thinking approach, communication clarity, and seriousness of intent.",
      },
    ],
  },
  {
    id: "fees",
    title: "Fee and Funding",
    sub: "Fees, payments and scholarships.",
    faqs: [
      {
        q: "What is the total program fee?",
        a: "The total program fee depends on the partner university where the student is enrolled. A detailed fee structure is shared during the counselling stage before seat confirmation, ensuring full clarity before any commitment is made.",
      },
      {
        q: "Are hostel and accommodation charges included?",
        a: "Hostel and accommodation charges are separate, depending on the partner university and campus facilities.",
      },
      {
        q: "Are there any hidden costs?",
        a: "No. All mandatory charges are communicated clearly before admission confirmation. We believe in complete transparency so parents can make informed decisions.",
      },
      {
        q: "What are the payment timelines?",
        a: "Selected students must confirm their seat within the communicated deadline. Payment timelines and installment details, if applicable, are clearly shared during the admission process. Seats are limited and cannot be held indefinitely.",
      },
      {
        q: "Are scholarships available?",
        a: "Yes. upGrad School of Technology offers up to 100% scholarships to recognise merit and potential. Eligibility is determined based on uGNET performance, interview evaluation, academic consistency, extra and co-curricular activities.",
      },
      {
        q: "Can scholarships cover the full tuition fee?",
        a: "In select cases, outstanding candidates may qualify for scholarships covering up to 100% of tuition fees, subject to eligibility criteria.",
      },
    ],
  },
  {
    id: "outcomes",
    title: "Outcomes and Placements",
    sub: "Careers, internships, startups and higher studies.",
    faqs: [
      {
        q: "What career opportunities can students pursue after graduation?",
        a: "Graduates from upGrad School of Technology can pursue multiple pathways depending on their interests and performance. These include: Software Engineering and Development roles, AI and Machine Learning roles, Cloud and Full Stack Engineering, Product and Technology roles, Startup ventures, and Research and higher studies.",
      },
      {
        q: "Does upGrad School of Technology provide placement support?",
        a: "Yes. Students receive structured placement support, including: Career guidance and mentorship, Resume and portfolio review, Mock interviews and technical preparation, and Industry interactions and networking opportunities.",
      },
      {
        q: "How is upGrad School of Technology different in preparing students for placements?",
        a: "Preparation begins early. Students will start coding from the first semester, complete 4,000+ hours of structured practice, build 30+ guided projects, and develop 15+ deployable applications. This ensures students graduate with demonstrable skills and a strong technical portfolio.",
      },
      {
        q: "Are internships part of the program?",
        a: "Yes. Internships and industry exposure are integrated into the curriculum. Students gain real-world experience before graduation, helping them build confidence and professional readiness.",
      },
      {
        q: "Is placement guaranteed?",
        a: "While placement support is provided, outcomes depend on the student's performance. We focus on building capability and readiness, which significantly strengthens placement prospects.",
      },
      {
        q: "How does the program support high-paying roles?",
        a: "Students are trained in in-demand technology domains such as AI, machine learning, cloud computing, and full stack development. The structured coding hours, portfolio development, and interview preparation collectively position students for competitive roles.",
      },
      {
        q: "What if I want to pursue higher studies instead of placements?",
        a: "The degree is UGC-recognized and qualifies graduates for higher education opportunities in India and internationally. Students interested in research or global master's programs receive guidance aligned with that pathway.",
      },
      {
        q: "Can students build startups instead of taking placements?",
        a: "Yes. The program includes structured support for students interested in entrepreneurship. Select students pursuing startup pathways receive mentorship, unlimited seed funding, and exposure to incubation ecosystems.",
      },
    ],
  },
  {
    id: "resumecraft",
    title: "ResumeCraft Agent",
    sub: "Our AI resume reviewer.",
    faqs: [
      {
        q: "How does the ResumeCraft Agent help improve my resume?",
        a: "The ResumeCraft Agent uses AI to analyze your resume content, format, and structure. It provides instant feedback on ATS optimization, keyword matching, formatting suggestions, and overall presentation to maximize your chances of landing interviews.",
      },
      {
        q: "Can I customize my resume template?",
        a: "Yes! The ResumeCraft Agent offers 20+ professional templates across different industries. You can choose from various styles, customize colors, fonts, and layouts to match your personal brand and industry standards.",
      },
      {
        q: "Does the agent check for ATS compatibility?",
        a: "Absolutely! The ResumeCraft Agent automatically scans your resume for ATS compatibility, ensuring proper formatting, keyword optimization, and structure that passes through Applicant Tracking Systems used by most companies.",
      },
      {
        q: "How accurate is the resume scoring system?",
        a: "Our AI-powered scoring system evaluates multiple factors including content quality, keyword relevance, formatting, ATS compatibility, and industry best practices. The scores are based on real-world hiring data and provide actionable insights for improvement.",
      },
      {
        q: "Can the agent rewrite my resume for different job roles?",
        a: "Yes. Upload your base resume and job description, and the agent will auto-generate tailored versions highlighting relevant experience, quantifiable impact, and keywords for each role.",
      },
      {
        q: "Does it integrate with LinkedIn or job portals?",
        a: "You can export resumes in PDF/Doc formats, copy sections directly into LinkedIn, and sync achievements with your job applications. ATS-ready versions are supported for most portals.",
      },
      {
        q: "How secure is my resume data?",
        a: "All data is encrypted at rest and in transit. You can delete resume drafts anytime, and no personal information is sold or shared with external recruiters.",
      },
    ],
  },
  {
    id: "entrance-practice",
    title: "Engg Entrance Practice Agent",
    sub: "Practice tests and the assessment engine.",
    faqs: [
      {
        q: "What types of tests are available in the Assessment Engine?",
        a: "The Assessment Engine offers JEE Main previous year questions (PYQs), chapter-wise tests, subject-wise tests (Physics, Chemistry, Mathematics), year-wise complete papers, and comprehensive practice sets to help you prepare effectively.",
      },
      {
        q: "Can I track my progress over time?",
        a: "Yes! The Assessment Engine provides detailed analytics including performance trends, subject-wise strengths and weaknesses, time management insights, and progress tracking to help you identify areas for improvement.",
      },
      {
        q: "Are the questions from actual JEE Main exams?",
        a: "Yes, we provide authentic previous year questions (PYQs) from actual JEE Main exams with detailed solutions and explanations to help you understand the exam pattern and difficulty level.",
      },
      {
        q: "How does the leaderboard work?",
        a: "The leaderboard ranks students based on their test performance, accuracy, and consistency. You can compete with peers, track your ranking, and see how you compare with other students preparing for JEE Main.",
      },
      {
        q: "Can I create custom tests from specific topics?",
        a: "Absolutely. Use the custom test builder to mix topics, difficulty levels, and question counts to mimic your target exam pattern.",
      },
      {
        q: "Do I get video solutions or hints?",
        a: "Most PYQs include walkthrough solutions. We’re rolling out hint cards, concept recaps, and targeted micro-lessons for tricky problems.",
      },
      {
        q: "Is there a daily practice streak or reminder system?",
        a: "Yes. You can enable streak tracking, set daily/weekly targets, and receive reminders so that you maintain consistent preparation.",
      },
    ],
  },
  {
    id: "college-predict",
    title: "CollegePredict Agent",
    sub: "AI-powered college predictions.",
    faqs: [
      {
        q: "How accurate are the college predictions?",
        a: "The 95%+ accuracy representation is based on internal back-testing of our prediction pipeline against official counselling and cutoff datasets, including JoSAA/CSAB and exam-specific historical cutoff data. The model compares a user's rank/score, category, gender, quota, domicile, seat pool, branch preference, and previous-year opening/closing ranks against actual cutoff outcomes to estimate whether the predicted branch/college bucket matches the historically eligible bucket.",
      },
      {
        q: "Can I predict colleges based on percentile instead of rank?",
        a: "Yes! The CollegePredict Agent accepts both rank and percentile as input. Simply select your preferred input mode and enter your JEE Main score to get personalized college and branch predictions.",
      },
      {
        q: "Does the predictor consider category and state quotas?",
        a: "Absolutely! The predictor takes into account your category (General, EWS, OBC-NCL, SC, ST), gender, and domicile state to provide accurate predictions based on the specific seat pools and reservation policies.",
      },
      {
        q: "What information do I need to get predictions?",
        a: "You need your JEE Main rank or percentile, category, gender preference, and optionally your domicile state. The more information you provide, the more accurate your predictions will be.",
      },
      {
        q: "Can I save or share my predicted lists?",
        a: "Yes. You can bookmark college lists, download them as PDF/Excel, or share a secure link with mentors and parents.",
      },
      {
        q: "Does it work for other exams like WBJEE, VITEEE, or BITSAT?",
        a: "Currently, it prioritizes JEE Main data. Support for other entrance exams is on the roadmap with region-specific analysis.",
      },
      {
        q: "How often are the datasets refreshed?",
        a: "We refresh ranks, seat matrix, quotas, and cut-off datasets every admission cycle and whenever JoSAA/CSAB publishes an update.",
      },
    ],
  },
  {
    id: "interview-prep",
    title: "InterviewPrep Agent",
    sub: "Mock interviews with AI.",
    faqs: [
      {
        q: "What types of interviews can I practice?",
        a: "You can practice Skill-Based Interviews (technical questions), JD-Based Interviews (job description focused), Resume-Based Interviews, Practice Questions, and Online Assessment simulations to prepare for various interview formats.",
      },
      {
        q: "How does the AI provide feedback on my performance?",
        a: "The AI analyzes your responses in real-time, evaluating technical accuracy, communication skills, speech patterns, body language, and overall interview performance. You receive detailed feedback with actionable improvement suggestions.",
      },
      {
        q: "Can I practice without a webcam?",
        a: "While webcam is recommended for behavioral analysis and proctoring features, you can practice text-based interviews and skill assessments without it. However, full interview simulation works best with webcam enabled.",
      },
      {
        q: "How does the proctoring feature work?",
        a: "The proctoring feature monitors eye contact, confidence levels, engagement, and detects any suspicious behavior during practice sessions. This helps you prepare for real interviews that may include similar monitoring.",
      },
      {
        q: "Does it simulate behavioral rounds as well?",
        a: "Yes. The AI can ask STAR-based behavioral questions, analyze tone and structure, and suggest improved narratives.",
      },
      {
        q: "Can I invite mentors or peers to review my sessions?",
        a: "You can share your recorded responses and AI feedback reports via secure links so mentors can leave comments.",
      },
      {
        q: "Is there support for coding-based interviews?",
        a: "The platform supports coding tasks with an in-browser IDE, real-time execution, and follow-up questions based on your solutions.",
      },
    ],
  },
];
