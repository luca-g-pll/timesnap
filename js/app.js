let mode='timer';
let timerState={isRunning:!1,isPaused:!1,interval:null,timeInSeconds:1200,targetTime:1200,startTimestamp:null,pausedTimeRemaining:0,initialTime:1200};
let chronoState={isRunning:!1,isPaused:!1,interval:null,timeInSeconds:0,startTimestamp:null,pausedTimeRemaining:0,initialTime:0};
const display=document.getElementById('timerDisplay'),startBtn=document.getElementById('startBtn'),pauseBtn=document.getElementById('pauseBtn'),resetBtn=document.getElementById('resetBtn'),fullscreenBtn=document.getElementById('fullscreenBtn'),mainContainer=document.getElementById('mainContainer'),timerSettings=document.getElementById('timerSettings'),clockSettings=document.getElementById('clockSettings'),clockFormatSelect=document.getElementById('clockFormatSelect'),timerControls=document.querySelector('.controls'),settingsTitle=document.querySelector('.settings-panel h3'),hoursInput=document.getElementById('hoursInput'),minutesInput=document.getElementById('minutesInput'),secondsInput=document.getElementById('secondsInput'),backgroundImage=document.getElementById('backgroundImage'),fileUpload=document.getElementById('fileUpload'),fontSelect=document.getElementById('fontSelect'),bgOpacitySlider=document.getElementById('bgOpacity'),opacityValue=document.getElementById('opacityValue'),customColorPicker=document.getElementById('customColorPicker'),glowToggle=document.getElementById('glowToggle'),glowIntensity=document.getElementById('glowIntensity'),glowIntensityValue=document.getElementById('glowIntensityValue'),customGlowPicker=document.getElementById('customGlowPicker'),glowSettings=document.getElementById('glowSettings'),blackOverlay=document.getElementById('blackOverlay'),customBgColorPicker=document.getElementById('customBgColorPicker'),settingsToggleBtn=document.getElementById('settingsToggleBtn'),settingsPanel=document.getElementById('settingsPanel'),clockToggle=document.getElementById('clockToggle'),clockDisplay=document.getElementById('clockDisplay'),millisecondsToggle=document.getElementById('millisecondsToggle');
let currentTimerColor='#000',currentTimerFont="'JetBrains Mono',monospace",currentGlowColor='#000',glowEnabled=!1,glowIntensityLevel=50,settingsVisible=!1,clockVisible=!1,clockInterval=null,clockUpdateInterval=null,showMilliseconds=!1;
const weekDays=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
document.querySelectorAll('.mode-btn').forEach(btn=>{
const handleModeChange=()=>{
document.querySelectorAll('.mode-btn').forEach(b=>b.classList.remove('active'));
btn.classList.add('active');
mode=btn.dataset.mode;
const logo=document.querySelector('.logo');
if(mode==='timer'){
logo.textContent='TimeSnap';
timerSettings.style.display='block';
clockSettings.style.display='none';
timerControls.style.display='flex';
settingsToggleBtn.innerHTML='⚙️ Timer Settings';
settingsTitle.textContent='Timer Settings';
if(clockUpdateInterval){clearInterval(clockUpdateInterval);clockUpdateInterval=null;}
display.classList.remove('clock-with-date','clock-with-date-day');
syncUIWithState();
}else if(mode==='stopwatch'){
logo.textContent='ChronoSnap';
timerSettings.style.display='none';
clockSettings.style.display='none';
timerControls.style.display='flex';
settingsToggleBtn.innerHTML='⚙️ Chrono Settings';
settingsTitle.textContent='Chrono Settings';
if(clockUpdateInterval){clearInterval(clockUpdateInterval);clockUpdateInterval=null;}
display.classList.remove('clock-with-date','clock-with-date-day');
syncUIWithState();
}else if(mode==='clock'){
logo.textContent='ClockSnap';
timerSettings.style.display='none';
clockSettings.style.display='block';
timerControls.style.display='none';
settingsToggleBtn.innerHTML='⚙️ Clock Settings';
settingsTitle.textContent='Clock Settings';
const format=clockFormatSelect.value;
display.classList.remove('clock-with-date','clock-with-date-day');
if(format==='time-date'){
display.classList.add('clock-with-date');
}else if(format==='time-date-day'){
display.classList.add('clock-with-date-day');
}
updateClockDisplay();
if(clockUpdateInterval)clearInterval(clockUpdateInterval);
clockUpdateInterval=setInterval(updateClockDisplay,showMilliseconds?10:1000);
}
if(mode!=='clock'){
updateDisplay();
}
};
btn.addEventListener('click',handleModeChange);
btn.addEventListener('touchstart',e=>{e.preventDefault();handleModeChange();});
});
const toggleSettings=()=>{
settingsVisible=!settingsVisible;
settingsPanel.style.display=settingsVisible?'block':'none';
const closeText='✖️ Close Settings';
const openText=mode==='timer'?'⚙️ Timer Settings':(mode==='stopwatch'?'⚙️ Chrono Settings':'⚙️ Clock Settings');
settingsToggleBtn.innerHTML=settingsVisible?closeText:openText;
};
settingsToggleBtn.addEventListener('click',toggleSettings);
settingsToggleBtn.addEventListener('touchstart',e=>{e.preventDefault();toggleSettings();});
function getState(){return mode==='timer'?timerState:chronoState;}
function syncUIWithState(){
const state=getState();
if(state.isRunning){
display.classList.add('running');
startBtn.style.display='none';
pauseBtn.style.display='inline-block';
}else if(state.isPaused){
display.classList.remove('running');
startBtn.style.display='inline-block';
pauseBtn.style.display='none';
startBtn.textContent='Resume';
}else{
display.classList.remove('running');
startBtn.style.display='inline-block';
pauseBtn.style.display='none';
startBtn.textContent='Start';
}
}
function formatTime(seconds,ms=0){
const h=Math.floor(seconds/3600),m=Math.floor((seconds%3600)/60),s=seconds%60;
if(showMilliseconds){
return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(ms).padStart(3,'0')}`;
}
return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
function updateDisplay(ms=0){
const state=getState();
display.textContent=formatTime(state.timeInSeconds,ms);
}
function updateClockDisplay(){
if(mode!=='clock')return;
const now=new Date();
const h=String(now.getHours()).padStart(2,'0');
const m=String(now.getMinutes()).padStart(2,'0');
const s=String(now.getSeconds()).padStart(2,'0');
const ms=String(now.getMilliseconds()).padStart(3,'0');
const day=String(now.getDate()).padStart(2,'0');
const month=String(now.getMonth()+1).padStart(2,'0');
const year=now.getFullYear();
const weekDay=weekDays[now.getDay()];
const format=clockFormatSelect.value;
const timeStr=showMilliseconds?`${h}:${m}:${s}.${ms}`:`${h}:${m}:${s}`;
if(format==='time'){
display.textContent=timeStr;
}else if(format==='time-date'){
display.textContent=`${timeStr}  ${day}/${month}/${year}`;
}else{
display.textContent=`${timeStr}  ${weekDay}, ${day}/${month}/${year}`;
}
}
function start(){
const state=getState();
if(state.isRunning)return;
if(!state.isPaused&&mode==='timer'){
const hours=parseInt(hoursInput.value)||0,minutes=parseInt(minutesInput.value)||0,seconds=parseInt(secondsInput.value)||0;
state.targetTime=hours*3600+minutes*60+seconds;
state.timeInSeconds=state.targetTime;
state.initialTime=state.targetTime;
if(state.timeInSeconds===0){alert('Please set a time greater than zero!');return;}
}
if(!state.isPaused&&mode==='stopwatch'){state.timeInSeconds=0;state.initialTime=0;}
const wasPaused=state.isPaused;
const pausedTime=state.pausedTimeRemaining;
state.isRunning=!0;state.isPaused=!1;
display.classList.add('running');
startBtn.style.display='none';
pauseBtn.style.display='inline-block';
state.startTimestamp=Date.now();
if(wasPaused&&pausedTime>0){
if(mode==='timer'){
state.startTimestamp=Date.now()-(state.initialTime-pausedTime)*1000;
}else{
state.startTimestamp=Date.now()-pausedTime*1000;
}
}
state.interval=setInterval(()=>{
const elapsedMs=Date.now()-state.startTimestamp;
const elapsed=Math.floor(elapsedMs/1000);
const ms=Math.floor(elapsedMs%1000);
if(state===timerState){
state.timeInSeconds=state.initialTime-elapsed;
if(state.timeInSeconds<=0){
state.timeInSeconds=0;
if(mode==='timer')updateDisplay(0);
stop(timerState);
return;
}
if(mode==='timer')updateDisplay(ms);
}else if(state===chronoState){
state.timeInSeconds=state.initialTime+elapsed;
if(mode==='stopwatch')updateDisplay(ms);
}
},showMilliseconds?10:100);
}
function pause(){
const state=getState();
if(!state.isRunning)return;
state.isRunning=!1;state.isPaused=!0;
display.classList.remove('running');
clearInterval(state.interval);
const elapsedMs=Date.now()-state.startTimestamp;
const elapsed=Math.floor(elapsedMs/1000);
if(state===timerState){
state.timeInSeconds=state.initialTime-elapsed;
state.pausedTimeRemaining=state.timeInSeconds;
}else{
state.timeInSeconds=state.initialTime+elapsed;
state.pausedTimeRemaining=state.timeInSeconds;
}
startBtn.style.display='inline-block';
pauseBtn.style.display='none';
startBtn.textContent='Resume';
updateDisplay();
}
function stop(targetState=null){
const state=targetState||getState();
state.isRunning=!1;state.isPaused=!1;
clearInterval(state.interval);
state.startTimestamp=null;state.pausedTimeRemaining=0;
if(!targetState||state===getState()){
display.classList.remove('running');
startBtn.style.display='inline-block';
pauseBtn.style.display='none';
startBtn.textContent='Start';
}
}
function reset(){
const state=getState();
stop();
if(mode==='timer'){
const hours=parseInt(hoursInput.value)||0,minutes=parseInt(minutesInput.value)||0,seconds=parseInt(secondsInput.value)||0;
state.timeInSeconds=hours*3600+minutes*60+seconds;
state.initialTime=state.timeInSeconds;
}else if(mode==='stopwatch'){
state.timeInSeconds=0;state.initialTime=0;
}
if(mode!=='clock'){
updateDisplay();
}
}
startBtn.addEventListener('click',start);
startBtn.addEventListener('touchstart',e=>{e.preventDefault();start();});
pauseBtn.addEventListener('click',pause);
pauseBtn.addEventListener('touchstart',e=>{e.preventDefault();pause();});
resetBtn.addEventListener('click',reset);
resetBtn.addEventListener('touchstart',e=>{e.preventDefault();reset();});
fontSelect.addEventListener('change',e=>{
currentTimerFont=e.target.value;
display.style.fontFamily=currentTimerFont;
updateClockStyle();
});
clockFormatSelect.addEventListener('change',()=>{
const format=clockFormatSelect.value;
display.classList.remove('clock-with-date','clock-with-date-day');
if(format==='time-date'){
display.classList.add('clock-with-date');
}else if(format==='time-date-day'){
display.classList.add('clock-with-date-day');
}
updateClockDisplay();
});
document.querySelectorAll('.color-option').forEach(option=>{
option.addEventListener('click',()=>{
document.querySelectorAll('.color-option').forEach(o=>o.classList.remove('active'));
option.classList.add('active');
currentTimerColor=option.dataset.color;
updateTimerColor();
});
});
customColorPicker.addEventListener('input',e=>{
currentTimerColor=e.target.value;
document.querySelectorAll('.color-option').forEach(o=>o.classList.remove('active'));
updateTimerColor();
});
function updateTimerColor(){
display.style.background='none';
display.style.webkitBackgroundClip='';
display.style.webkitTextFillColor='';
display.style.backgroundClip='';
display.style.color=currentTimerColor;
updateClockStyle();
}
bgOpacitySlider.addEventListener('input',e=>{
blackOverlay.style.opacity=e.target.value/100;
opacityValue.textContent=e.target.value;
});
glowToggle.addEventListener('change',e=>{
glowEnabled=e.target.checked;
glowSettings.style.display=glowEnabled?'block':'none';
updateTimerGlow();
});
glowIntensity.addEventListener('input',e=>{
glowIntensityLevel=e.target.value;
glowIntensityValue.textContent=e.target.value;
updateTimerGlow();
});
document.querySelectorAll('.glow-color-option').forEach(option=>{
option.addEventListener('click',()=>{
document.querySelectorAll('.glow-color-option').forEach(o=>o.classList.remove('active'));
option.classList.add('active');
currentGlowColor=option.dataset.glow;
updateTimerGlow();
});
});
customGlowPicker.addEventListener('input',e=>{
currentGlowColor=e.target.value;
document.querySelectorAll('.glow-color-option').forEach(o=>o.classList.remove('active'));
updateTimerGlow();
});
function updateTimerGlow(){
if(!glowEnabled){
display.style.textShadow='none';
display.style.filter='none';
updateClockStyle();
return;
}
const intensity=glowIntensityLevel/100,baseGlow=80*intensity,mediumGlow=100*intensity,strongGlow=120*intensity;
const hexToRgba=(hex,alpha)=>{
const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
return `rgba(${r},${g},${b},${alpha})`;
};
const glowColor1=hexToRgba(currentGlowColor,.5*intensity),glowColor2=hexToRgba(currentGlowColor,.3*intensity);
display.style.textShadow=`0 0 ${baseGlow}px ${glowColor1},0 0 ${mediumGlow}px ${glowColor2},0 0 ${strongGlow}px ${glowColor2}`;
updateClockStyle();
}
document.querySelectorAll('.bg-color-option').forEach(option=>{
option.addEventListener('click',()=>{
document.querySelectorAll('.bg-color-option').forEach(o=>o.classList.remove('active'));
option.classList.add('active');
const bgColor=option.dataset.bgcolor;
backgroundImage.src='';
backgroundImage.style.opacity='0';
document.documentElement.style.setProperty('--dynamic-bg-color',bgColor);
document.querySelector('.background-layer').style.background=bgColor;
});
});
customBgColorPicker.addEventListener('input',e=>{
document.querySelectorAll('.bg-color-option').forEach(o=>o.classList.remove('active'));
backgroundImage.src='';
backgroundImage.style.opacity='0';
document.documentElement.style.setProperty('--dynamic-bg-color',e.target.value);
document.querySelector('.background-layer').style.background=e.target.value;
});
fileUpload.addEventListener('change',e=>{
const file=e.target.files[0];
if(file){
console.log('File selected:',file.name,'Type:',file.type,'Size:',file.size);
const validTypes=['image/png','image/jpeg','image/jpg','image/gif','image/webp','image/bmp','image/heic','image/heif'];
const isValidType=validTypes.some(type=>file.type.includes(type.split('/')[1]))||file.type.startsWith('image/');
if(!isValidType&&!file.name.match(/\.(jpg|jpeg|png|gif|webp|bmp|heic|heif)$/i)){
alert('Formato file non supportato. Usa JPG, PNG, HEIC o altri formati immagine.');
return;
}
if(file.name.toLowerCase().endsWith('.heic')||file.name.toLowerCase().endsWith('.heif')){
alert('Nota: Le foto HEIC da iPhone potrebbero non funzionare su tutti i browser. Prova a convertirle in JPG dalle impostazioni iPhone o usa Safari.');
}
if(file.size>5*1024*1024){
console.log('File too large, compressing...');
compressImage(file);
}else{loadImage(file);}
}
});
function loadImage(file){
const reader=new FileReader();
reader.onload=event=>{
console.log('Image loaded successfully');
document.querySelectorAll('.bg-color-option').forEach(o=>o.classList.remove('active'));
backgroundImage.src=event.target.result;
backgroundImage.style.opacity='1';
backgroundImage.onerror=()=>{
console.error('Image loading error');
alert('Error loading image. Try a smaller file or JPG/PNG format.');
backgroundImage.src='';
backgroundImage.style.opacity='0';
};
};
reader.onerror=error=>{
console.error('File reading error:',error);
alert('File reading error. Please try again.');
};
reader.readAsDataURL(file);
}
function compressImage(file){
const reader=new FileReader();
reader.onload=e=>{
const img=new Image();
img.onload=()=>{
const canvas=document.createElement('canvas');
const ctx=canvas.getContext('2d');
let width=img.width,height=img.height;
const maxSize=1920;
if(width>maxSize||height>maxSize){
if(width>height){
height=(height/width)*maxSize;
width=maxSize;
}else{
width=(width/height)*maxSize;
height=maxSize;
}
}
canvas.width=width;
canvas.height=height;
ctx.drawImage(img,0,0,width,height);
canvas.toBlob(blob=>{
console.log('Image compressed from',file.size,'to',blob.size,'bytes');
const compressedFile=new File([blob],file.name,{type:'image/jpeg'});
loadImage(compressedFile);
},'image/jpeg',.8);
};
img.onerror=()=>{
console.error('Error loading image for compression');
alert('Unable to process the image. Try another file.');
};
img.src=e.target.result;
};
reader.readAsDataURL(file);
}
function updateClock(){
const now=new Date();
const hours=String(now.getHours()).padStart(2,'0');
const minutes=String(now.getMinutes()).padStart(2,'0');
const seconds=String(now.getSeconds()).padStart(2,'0');
clockDisplay.textContent=`${hours}:${minutes}:${seconds}`;
}
function updateClockStyle(){
if(!clockVisible)return;
clockDisplay.style.fontFamily=currentTimerFont;
clockDisplay.style.color=currentTimerColor;
if(glowEnabled){
const intensity=glowIntensityLevel/100,baseGlow=80*intensity,mediumGlow=100*intensity,strongGlow=120*intensity;
const hexToRgba=(hex,alpha)=>{
const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
return `rgba(${r},${g},${b},${alpha})`;
};
const glowColor1=hexToRgba(currentGlowColor,.5*intensity),glowColor2=hexToRgba(currentGlowColor,.3*intensity);
clockDisplay.style.textShadow=`0 0 ${baseGlow}px ${glowColor1},0 0 ${mediumGlow}px ${glowColor2},0 0 ${strongGlow}px ${glowColor2}`;
}else{clockDisplay.style.textShadow='none';}
}
clockToggle.addEventListener('change',e=>{
clockVisible=e.target.checked;
if(clockVisible){
clockDisplay.classList.add('visible');
updateClock();
updateClockStyle();
clockInterval=setInterval(updateClock,1000);
}else{
clockDisplay.classList.remove('visible');
if(clockInterval){
clearInterval(clockInterval);
clockInterval=null;
}
}
});
millisecondsToggle.addEventListener('change',e=>{
showMilliseconds=e.target.checked;
if(showMilliseconds){
display.classList.add('with-milliseconds');
}else{
display.classList.remove('with-milliseconds');
}
if(mode==='clock'){
if(clockUpdateInterval)clearInterval(clockUpdateInterval);
clockUpdateInterval=setInterval(updateClockDisplay,showMilliseconds?10:1000);
updateClockDisplay();
}
const state=getState();
if(state.isRunning){
clearInterval(state.interval);
const elapsedMs=Date.now()-state.startTimestamp;
const elapsed=Math.floor(elapsedMs/1000);
const ms=Math.floor(elapsedMs%1000);
if(mode==='timer'){
state.timeInSeconds=state.initialTime-elapsed;
}else{
state.timeInSeconds=state.initialTime+elapsed;
}
state.interval=setInterval(()=>{
const elapsedMs=Date.now()-state.startTimestamp;
const elapsed=Math.floor(elapsedMs/1000);
const ms=Math.floor(elapsedMs%1000);
if(state===timerState){
state.timeInSeconds=state.initialTime-elapsed;
if(state.timeInSeconds<=0){
state.timeInSeconds=0;
if(mode==='timer')updateDisplay(0);
stop(timerState);
return;
}
if(mode==='timer')updateDisplay(ms);
}else if(state===chronoState){
state.timeInSeconds=state.initialTime+elapsed;
if(mode==='stopwatch')updateDisplay(ms);
}
},showMilliseconds?10:100);
}
updateDisplay(0);
});
const handleFullscreen=()=>{
if(mainContainer.classList.contains('fullscreen-mode')){
mainContainer.classList.remove('fullscreen-mode');
document.body.classList.remove('fullscreen-active');
if(screen.orientation&&screen.orientation.unlock)screen.orientation.unlock();
}else{
mainContainer.classList.add('fullscreen-mode');
document.body.classList.add('fullscreen-active');
settingsVisible=!1;
settingsPanel.style.display='none';
settingsToggleBtn.innerHTML=mode==='timer'?'⚙️ Timer Settings':'⚙️ Chrono Settings';
if(document.documentElement.requestFullscreen&&!iOS()){
document.documentElement.requestFullscreen().catch(err=>console.log('Fullscreen not supported:',err));
}
if(screen.orientation&&screen.orientation.lock){
screen.orientation.lock('landscape').catch(err=>console.log('Orientation lock not supported:',err));
}
}
};
function iOS(){
return['iPad Simulator','iPhone Simulator','iPod Simulator','iPad','iPhone','iPod'].includes(navigator.platform)||(navigator.userAgent.includes("Mac")&&"ontouchend" in document);
}
fullscreenBtn.addEventListener('click',handleFullscreen);
fullscreenBtn.addEventListener('touchstart',e=>{e.preventDefault();handleFullscreen();});
document.addEventListener('fullscreenchange',()=>{
if(!document.fullscreenElement){
mainContainer.classList.remove('fullscreen-mode');
document.body.classList.remove('fullscreen-active');
}
});
updateDisplay();
updateTimerColor();
updateTimerGlow();
document.querySelector('.background-layer').style.background='#C45CA8';
backgroundImage.src='';
backgroundImage.style.opacity='0';
blackOverlay.style.opacity=0;
