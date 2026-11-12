# Campus card posters (public/images/campuses/cards-v2). Fills poster.html once per
# campus, then render each at 1600x900 with headless Chrome and save as WebP:
#   cp public/images/campuses/{ssahe,adypu}.webp public/images/logo-sot-white.png <dir>
#   python3 make.py poster.html <dir>
#   chrome --headless=new --hide-scrollbars --window-size=1600,900 \
#     --virtual-time-budget=8000 --screenshot=<dir>/ssahe.png file://<dir>/ssahe.html
import sys
tpl = open(sys.argv[1]).read()
for key, d in {
 "ssahe": dict(photo="ssahe.webp", pos="72% 40%", city="TUMKURU", sub="Outer Bangalore · Karnataka", uni="Sri Siddhartha Academy of Higher Education", naac="NAAC A+", sx="1010", extra="70+ Acre Green Campus"),
 "adypu": dict(photo="adypu.webp", pos="85% 40%", city="PUNE", sub="Maharashtra", uni="Ajeenkya DY Patil University", naac="NAAC A", sx="610", extra="Campus in Pune"),
}.items():
    h = tpl
    for k, v in d.items(): h = h.replace("{{"+k+"}}", v)
    open(f"{sys.argv[2]}/{key}.html","w").write(h)
