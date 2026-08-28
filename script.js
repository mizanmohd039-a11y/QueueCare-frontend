const doctors = [
  {name:"Dr. A. Sharma", specialty:"General Physician", clinic:"City Care Clinic", time:"10:00 AM – 2:00 PM", token:31, wait:"48 min"},
  {name:"Dr. Priya Khan", specialty:"Dermatologist", clinic:"Skin & Care Hospital", time:"11:00 AM – 3:00 PM", token:18, wait:"25 min"},
  {name:"Dr. R. Mehta", specialty:"Orthopedic", clinic:"Metro Health Center", time:"9:30 AM – 1:30 PM", token:42, wait:"62 min"}
];

const list = document.getElementById("doctorList");
function renderDoctors(items=doctors){
  list.innerHTML = items.map((d,i)=>`
    <article class="doctor-card">
      <div class="doctor-head"><div class="avatar">${d.name.split(" ").slice(1,3).map(x=>x[0]).join("")}</div>
      <div><h3>${d.name}</h3><p>${d.specialty}</p></div></div>
      <div class="meta">📍 ${d.clinic}<br>🕐 OPD: ${d.time}<br>🟢 Current token: <b>#${d.token-7}</b></div>
      <button class="primary-btn book" onclick="bookToken(${i})">Book Token</button>
    </article>`).join("");
}
renderDoctors();

document.getElementById("search").addEventListener("input", e=>{
  const q=e.target.value.toLowerCase();
  renderDoctors(doctors.filter(d=>(d.name+" "+d.specialty+" "+d.clinic).toLowerCase().includes(q)));
});

let current=24, your=31;
function refreshQueue(){
  if(current < your && Math.random() > .25) current++;
  const ahead=Math.max(your-current-1,0);
  const wait=Math.max(ahead*7+6,6);
  document.getElementById("ahead").textContent=ahead;
  document.getElementById("aheadHero").textContent=ahead;
  document.getElementById("wait").textContent=wait+" min";
  document.getElementById("waitHero").textContent=wait+" min";
  document.getElementById("progressText").textContent=`#${current} → #${your}`;
  document.getElementById("progressBar").style.width=Math.min(95,Math.max(10,(current-20)/(your-20)*100))+"%";
  const now=new Date(); now.setMinutes(now.getMinutes()+wait+12);
  const t=now.toLocaleTimeString([], {hour:"numeric",minute:"2-digit"});
  document.getElementById("expected").textContent=t;
  const leave=new Date(now); leave.setMinutes(leave.getMinutes()-12);
  document.getElementById("leave").textContent=leave.toLocaleTimeString([], {hour:"numeric",minute:"2-digit"});
  document.getElementById("arrivalHero").textContent=leave.toLocaleTimeString([], {hour:"numeric",minute:"2-digit"});
  toast(current>=your ? "🎉 Your token is being called!" : `Queue updated — now serving #${current}`);
}
function bookToken(i){
  const d=doctors[i];
  your=d.token;
  current=Math.max(1,d.token-7);
  document.getElementById("yourToken").textContent="#"+your;
  document.getElementById("appointment").scrollIntoView({behavior:"smooth"});
  toast(`Token #${your} booked with ${d.name}`);
  refreshQueue();
}
function toast(msg){
  const el=document.getElementById("toast"); el.textContent=msg; el.classList.add("show");
  setTimeout(()=>el.classList.remove("show"),2600);
}
setInterval(()=>{ if(current<your && Math.random()>.55) refreshQueue(); },12000);
