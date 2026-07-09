// CAPTCHA VARIABLES

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const answerInput = document.getElementById("answer");

let currentWord = "";

let expiresAt = 0;

let attempts = 0;

let locked = false;

const MAX_ATTEMPTS = 5;

const CAPTCHA_TIME = 60000; // 60 seconds

// RANDOM CAPTCHA

function randomCaptcha(length = 6){

    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    const random = new Uint32Array(length);

    crypto.getRandomValues(random);

    let text = "";

    for(let i=0;i<length;i++){

        text += chars[random[i] % chars.length];

    }

    return text;

}

// DRAW CAPTCHA

function generateCaptcha(){

    currentWord = randomCaptcha();

    expiresAt = Date.now() + CAPTCHA_TIME;

    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle="#f7f7f7";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // Random lines

    for(let i=0;i<12;i++){

        ctx.beginPath();

        ctx.moveTo(
            Math.random()*canvas.width,
            Math.random()*canvas.height
        );

        ctx.lineTo(
            Math.random()*canvas.width,
            Math.random()*canvas.height
        );

        ctx.strokeStyle=`rgba(
            ${Math.random()*255},
            ${Math.random()*255},
            ${Math.random()*255},
            .5
        )`;

        ctx.lineWidth=1+Math.random()*2;

        ctx.stroke();

    }

    // Characters

    for(let i=0;i<currentWord.length;i++){

        ctx.save();

        const x = 18 + i*35;

        const y = 45 + (Math.random()*15-7);

        ctx.translate(x,y);

        ctx.rotate((Math.random()-.5)*0.7);

        ctx.font=`bold ${28+Math.random()*10}px Arial`;

        ctx.fillStyle=`rgb(
            ${40+Math.random()*120},
            ${40+Math.random()*120},
            ${40+Math.random()*120}
        )`;

        ctx.fillText(currentWord[i],0,0);

        ctx.restore();

    }

    // Noise dots

    for(let i=0;i<700;i++){

        ctx.fillStyle=`rgba(
            ${Math.random()*255},
            ${Math.random()*255},
            ${Math.random()*255},
            .8
        )`;

        ctx.fillRect(

            Math.random()*canvas.width,

            Math.random()*canvas.height,

            1,

            1

        );

    }

    answerInput.value="";

    document.getElementById("msg").textContent="";

}

// START

document.getElementById("check").addEventListener("change",function(){

    document.getElementById("step1").classList.add("hidden");

    document.getElementById("loading").classList.remove("hidden");

    setTimeout(()=>{

        document.getElementById("loading").classList.add("hidden");

        document.getElementById("captcha").classList.remove("hidden");

        generateCaptcha();

    },2500);

});

// INPUT SECURITY
// Only allow CAPTCHA characters
answerInput.addEventListener("input", function(){

    this.value = this.value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g,"")
        .slice(0,6);

});


// Prevent paste attacks
answerInput.addEventListener("paste", function(e){

    e.preventDefault();

});


// Prevent drag and drop
answerInput.addEventListener("drop", function(e){

    e.preventDefault();

});


// VERIFY CAPTCHA

function verify(){

    if(locked){
        return;
    }


    locked = true;


    // Slow repeated attempts

    setTimeout(()=>{

        locked=false;

    },1000);



    const value = answerInput.value.trim().toUpperCase();



    // Check expiration

    if(Date.now() > expiresAt){

        document.getElementById("msg").textContent =
        "CAPTCHA expired. New CAPTCHA generated.";

        generateCaptcha();

        return;

    }



    // Empty input

    if(value.length === 0){

        document.getElementById("msg").textContent =
        "Please enter the CAPTCHA.";

        locked=false;

        return;

    }



    attempts++;



    // Attempt limit

    if(attempts > MAX_ATTEMPTS){

        document.getElementById("msg").textContent =
        "Too many attempts. Restart verification.";

        answerInput.disabled=true;

        document.querySelector("button").disabled=true;

        return;

    }



    // Correct

    if(value === currentWord){


        // Destroy CAPTCHA after success

        currentWord="";


        document.getElementById("captcha")
        .classList.add("hidden");


        document.getElementById("done")
        .classList.remove("hidden");


    }


    // Incorrect

    else{


        document.getElementById("msg").textContent =
        "Incorrect CAPTCHA. Try again.";


        generateCaptcha();


    }


}