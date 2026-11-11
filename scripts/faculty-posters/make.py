# Faculty carousel posters (public/images/faculty/posters-v6), 720x1280, in the
# style of Masters' Union's "Hear from Our Faculty" cards, on the live site's
# card ground (near-black frosted glass): the cut-out portrait at the foot. The company logos (top), name and
# designation (on the portrait) are laid over each card in code (Faculty.tsx).
#   python3 make.py <faculty images dir> <out dir> <chrome binary>
import os, shutil, subprocess, sys

KEYS = [
    "vishwa-mohan", "rishi-saraf", "gaurav-kaushik", "gladden-rumao", "jyoti-nigam",
    "rishabh-bafna", "mithun-s", "piyush-jain", "bhavishya-rao", "akash-tiwari",
    "rahul-yadav", "deepak-mishra", "drishti-aggarwal", "dhanshree", "simran-pathania",
    "jai-prasad-b", "avinash-agrawal", "shivam-shrivastava", "ananya-saini",
    "shivam-pandey", "yash-gautam",
]


src, out, chrome = sys.argv[1:4]
work = os.path.join(out, "_work")
os.makedirs(os.path.join(work, "p"), exist_ok=True)
tpl = open(os.path.join(os.path.dirname(__file__), "poster.html")).read()
for i, key in enumerate(KEYS):
    shutil.copy(os.path.join(src, key + ".png"), os.path.join(work, "p", key + ".png"))
    h = tpl.replace("{{img}}", key)
    page = os.path.join(work, key + ".html")
    open(page, "w").write(h)
    subprocess.run([chrome, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                    "--allow-file-access-from-files", "--window-size=720,1280",
                    "--virtual-time-budget=4000", f"--screenshot={work}/{key}.png",
                    "file://" + page], capture_output=True)
    print(key)
