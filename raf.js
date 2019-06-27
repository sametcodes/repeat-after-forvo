function createAudioElement(blobUrl) {
    const audioEl = document.createElement('audio');
    audioEl.id = "player-audio";
    audioEl.controls = false;
    const sourceEl = document.createElement('source');
    sourceEl.src = blobUrl;
    sourceElsrc = blobUrl;
    sourceEl.type = 'audio/webm';
    audioEl.appendChild(sourceEl);
    document.querySelector("#ext-player").appendChild(audioEl);
}

function changeStatus(status){
    var playerContainer = document.querySelector("#ext-player");
    var playerIcon = document.querySelector("#player-icon");

    if(status === "recording"){
        playerContainer.dataset.status = "play";
        playerIcon.style.color = "red";
    }else if(status === "play"){
        playerContainer.dataset.status = "play";
        playerIcon.className = "fa fa-play";
        playerIcon.style.color = "#000";
    }
}

function record(){
  return new Promise((resolve, reject) => {
    changeStatus("recording");
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        const chunks = [];
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = e => {
            chunks.push(e.data);
            if (recorder.state == 'inactive') {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                createAudioElement(URL.createObjectURL(blob));
                changeStatus("play")
            }
        };
        recorder.onstart = e => {
            playerLoader();
        }
        recorder.start(0)
        setTimeout(() => {
          recorder.stop();
          resolve()
        }, 3000);
    }).catch(console.error);
  })
}

function playerLoader(α){
    var seconds = 2;
    var loader = document.getElementById('loader'), α = 0, π = Math.PI, t = (seconds/360 * 1000);
    var draw_timeout;

    if(α === 0){
        clearTimeout(draw_timeout);
    }

    (function draw() {
        α++;
        α %= 360;
        var r = ( α * π / 180 ), x = Math.sin( r ) * 125, y = Math.cos( r ) * - 125, mid = ( α > 180 ) ? 1 : 0, anim = 'M 0 0 v -125 A 125 125 1 ' + mid + ' 1 ' +  x  + ' ' +  y  + ' z';
        loader.setAttribute( 'd', anim );
        if(α < 359){
            draw_timeout = setTimeout(draw, t);
        }else{
            draw();
            clearTimeout(draw_timeout);
        }
    })();
}
async function play(){
    var player = document.querySelector("#player-audio");
    if(player){
        player.play()
        playerLoader();
    }
}
function reset(){
  new Promise((resolve) => {
    var playerContainer = document.querySelector("#ext-player");
    var playerIcon = document.querySelector("#player-icon");

    playerContainer.dataset.status = "ready";
    playerIcon.className = "fa fa-microphone";
    playerIcon.style.color = "#000000";
    document.querySelector("#player-audio").remove();
    resolve()
  })
}

var fa = document.createElement("link");
fa.rel = "stylesheet";
fa.type = "text/css";
fa.href = "https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css";
document.querySelector("body").appendChild(fa);

let selfplayer = document.createElement("div");
selfplayer.id = "ext-player";
selfplayer.dataset.status = "ready";
selfplayer.style.position = "fixed";
selfplayer.style.left = "30px";
selfplayer.style.cursor = "pointer";
selfplayer.style.bottom = "60px";
selfplayer.style.height = "50px";
selfplayer.style.width = "50px";
selfplayer.style.border = "3px solid #111";
selfplayer.style.borderRadius = "100px";
selfplayer.insertAdjacentHTML("beforeend", `<div>
    <div class="timer" style="position: absolute; left: 0px; top: 0px; z-index: -999;"><svg  fill="#0085ca" class="rotate" viewbox="0 0 250 250"> <path id="loader" transform="translate(125, 125)"/> </svg> </div>
        <i id="player-icon" style="line-height: 50px; width: 50px; text-align: center" class="fa fa-microphone"></i>
        <div id="reset" style="position: absolute;right: -30px;bottom: -20px;border: 1px solid red;padding: 5px 9px;border-radius: 100%;color: #fff;background-color: red; cursor: pointer;">
            <i id="reset-icon" class="fa fa-trash" style="font-size: 15px"></i>
        </div>
    </div>`);
document.querySelector("body").appendChild(selfplayer);

document.querySelector("#ext-player").onclick = function(e){
    if(["reset", "reset-icon"].includes(e.target.id)){
        reset();
        return;
    }
    if(this.dataset.status === "ready"){
        record();
    }
    if(this.dataset.status === "play"){
        play();
    }
}

document.addEventListener("keypress", async function(e){
  if(/[0-9]/g.exec(e.key)){
    let key = Number(e.key);
    if(key === 0) key = 10
    let lang = window.location.hash.replace("#", "");
    let container;
    if(lang){
      container = document.querySelectorAll(`#language-container-${lang} .show-all-pronunciations`)  
    }else{
      container = document.querySelector('.language-container .show-all-pronunciations')
    }
    let sounds = container.querySelectorAll(".play")
    if(key <= sounds.length){
      sounds[key-1].click();
    }
  }
  if(e.key === "r"){
    await reset();
    await record();
  }else if(e.key === "p"){
    play();
  }else if(e.key === "d"){
    reset();
  }
});l
