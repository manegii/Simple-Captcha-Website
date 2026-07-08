
const words=[
  "APPLE",
  "ORANGE",
  "TIGER",
  "PLANET",
  "ROCKET",
  "PURPLE",
  "WINDOW",
  "FLOWER",
  "GARDEN",
  "BUTTON"
];

let currentWord="";

document.getElementById("check").addEventListener("change",function(){

  document.getElementById("step1").classList.add("hidden");
  document.getElementById("loading").classList.remove("hidden");

  setTimeout(()=>{

  document.getElementById("loading").classList.add("hidden");
  document.getElementById("captcha").classList.remove("hidden");

  generateCaptcha();

  },2500);

});

function generateCaptcha(){

  const canvas=document.getElementById("canvas");
  const ctx=canvas.getContext("2d");

  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle="#f7f7f7";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  currentWord=words[Math.floor(Math.random()*words.length)];

  ctx.font="bold 36px Arial";

  for(let i=0;i<currentWord.length;i++){

  ctx.save();

  const x=20+i*35;
  const y=50;

  ctx.translate(x,y);

  ctx.rotate((Math.random()-0.5)*0.5);

  ctx.fillStyle=`rgb(${50+Math.random()*100},
  ${50+Math.random()*100},
  ${50+Math.random()*100})`;

  ctx.fillText(currentWord[i],0,0);

  ctx.restore();

  }

  for(let i=0;i<8;i++){

    ctx.beginPath();

    ctx.moveTo(Math.random()*250,Math.random()*80);
    ctx.lineTo(Math.random()*250,Math.random()*80);

    ctx.strokeStyle="#999";

    ctx.stroke();

  }

  for(let i=0;i<300;i++){

    ctx.fillStyle="#999";

    ctx.fillRect(
    Math.random()*250,
    Math.random()*80,
    1,
    1
    );

  }

}

function verify(){

const value=document
.getElementById("answer")
.value
.trim()
.toUpperCase();

if(value===currentWord){

  document.getElementById("captcha").classList.add("hidden");
  document.getElementById("done").classList.remove("hidden");

  }else{

  document.getElementById("msg").textContent="Incorrect word. Try again.";

  generateCaptcha();

  document.getElementById("answer").value="";

  }

}