// Typewriter: edit these lines to match your own voice.
const phrases = [
  "A language learner with a curious mind.",
  "Exploring business, culture & creativity.",
  "小さな一歩から、未来をつくる。"
];
const typed = document.getElementById("typed");
let phraseIndex = 0, charIndex = 0, deleting = false;
function typeLoop(){
  const phrase = phrases[phraseIndex];
  typed.textContent = phrase.slice(0, charIndex);
  if(!deleting && charIndex < phrase.length){ charIndex++; setTimeout(typeLoop, 75); }
  else if(!deleting){ deleting = true; setTimeout(typeLoop, 1500); }
  else if(charIndex > 0){ charIndex--; setTimeout(typeLoop, 35); }
  else { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; setTimeout(typeLoop, 350); }
}
typeLoop();

// Gentle mouse parallax. Touch devices and reduced-motion users are left alone.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if(!reduceMotion && window.matchMedia("(pointer:fine)").matches){
  window.addEventListener("pointermove", (event) => {
    const x = (event.clientX / window.innerWidth - .5) * 22;
    const y = (event.clientY / window.innerHeight - .5) * 22;
    document.documentElement.style.setProperty("--mx", `${x}px`);
    document.documentElement.style.setProperty("--my", `${y}px`);
  }, {passive:true});
}

// Reveal cards as they enter the viewport.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){ entry.target.classList.add("visible"); revealObserver.unobserve(entry.target); }
  });
}, {threshold:.12});
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// Sakura / star particles.
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let width, height, particles = [];
function resize(){
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth; height = window.innerHeight;
  canvas.width = width * dpr; canvas.height = height * dpr;
  canvas.style.width = width + "px"; canvas.style.height = height + "px";
  ctx.setTransform(dpr,0,0,dpr,0,0);
  particles = Array.from({length: Math.min(48, Math.floor(width/24))}, () => makeParticle(true));
}
function makeParticle(randomY=false){
  return {x:Math.random()*width,y:randomY?Math.random()*height:-15,size:2+Math.random()*3,
    speed:.25+Math.random()*.65,drift:-.35+Math.random()*.7,spin:Math.random()*6.28,
    spinSpeed:-.02+Math.random()*.04,kind:Math.random()>.45?"petal":"star",alpha:.25+Math.random()*.55};
}
function draw(){
  ctx.clearRect(0,0,width,height);
  for(const p of particles){
    p.y += p.speed; p.x += p.drift + Math.sin(p.y*.012)*.25; p.spin += p.spinSpeed;
    ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.spin); ctx.globalAlpha=p.alpha;
    ctx.fillStyle=p.kind==="petal"?"#f5b4ef":"#c9c0ff";
    if(p.kind==="petal"){ctx.beginPath();ctx.ellipse(0,0,p.size*.65,p.size*1.35,0,0,Math.PI*2);ctx.fill();}
    else {ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size);}
    ctx.restore();
    if(p.y>height+20){Object.assign(p,makeParticle());}
  }
  if(!reduceMotion) requestAnimationFrame(draw);
}
window.addEventListener("resize",resize);
resize(); draw();
