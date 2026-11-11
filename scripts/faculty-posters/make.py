# Faculty carousel posters (public/images/faculty/posters), 720x1280, in the
# style of Masters' Union's "Hear from Our Faculty" cards: a warm gradient,
# the logo, the topic in big uppercase type, the cut-out portrait at the foot.
#   python3 make.py <faculty images dir> <logo png> <out dir> <chrome binary>
import json, os, shutil, subprocess, sys

TOPICS = {
    "vishwa-mohan": "Leading Tech|in the AI Era",
    "rishi-saraf": "Build & Scale|a Startup",
    "gaurav-kaushik": "The Art of|Problem Solving",
    "gladden-rumao": "Engineering|with GenAI",
    "jyoti-nigam": "Data Science|for Decisions",
    "rishabh-bafna": "Applied AI &|Machine Learning",
    "mithun-s": "Systems|at Scale",
    "piyush-jain": "Mathematics|for Computing",
    "bhavishya-rao": "Discrete|Mathematics",
    "akash-tiwari": "Data Structures|& Algorithms",
    "rahul-yadav": "Full Stack|Development",
    "deepak-mishra": "Backend|Engineering",
    "drishti-aggarwal": "Frontend|with React",
    "dhanshree": "Linear|Algebra",
    "simran-pathania": "Databases|& SQL",
    "jai-prasad-b": "Object-Oriented|Programming",
    "avinash-agrawal": "System|Design",
    "shivam-shrivastava": "Cloud &|DevOps",
    "ananya-saini": "Probability|& Statistics",
    "shivam-pandey": "Calculus for|Engineers",
    "yash-gautam": "Cybersecurity|Essentials",
}
# warm, Masters' Union-like grounds, cycled
TONES = [("#5b3424", "#a98676"), ("#7c3f2c", "#b47a63"), ("#3e3935", "#8f837a"),
         ("#6a4636", "#c29c86"), ("#4b2c27", "#9b6153")]

src, logo, out, chrome = sys.argv[1:5]
work = os.path.join(out, "_work")
os.makedirs(os.path.join(work, "p"), exist_ok=True)
shutil.copy(logo, os.path.join(work, "logo.png"))
tpl = open(os.path.join(os.path.dirname(__file__), "poster.html")).read()
for i, (key, topic) in enumerate(TOPICS.items()):
    shutil.copy(os.path.join(src, key + ".png"), os.path.join(work, "p", key + ".png"))
    lines = topic.split("|")
    size = min(124, int(672 / (max(map(len, lines)) * 0.6)))
    c1, c2 = TONES[i % len(TONES)]
    h = (tpl.replace("{{c1}}", c1).replace("{{c2}}", c2).replace("{{size}}", str(size))
            .replace("{{pw}}", "800").replace("{{img}}", key)
            .replace("{{lines}}", "".join(f"<span>{l}</span>" for l in lines)))
    page = os.path.join(work, key + ".html")
    open(page, "w").write(h)
    subprocess.run([chrome, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                    "--allow-file-access-from-files", "--window-size=720,1280",
                    "--virtual-time-budget=6000", f"--screenshot={work}/{key}.png",
                    "file://" + page], capture_output=True)
    print(key)
