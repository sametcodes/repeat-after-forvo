(function(){
    console.log("forvo loaded")
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
        }else{
            return new Promise((resolve) => {
                setTimeout(() => resolve((() => {

                    playerContainer.dataset.status = "ready";
                    playerIcon.className = "fa fa-microphone";
                    playerIcon.style.color = "#000000";
                    document.querySelector("#player-audio").remove();
                })()), 4000)
            })
        }
    }

    function record(){
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
            recorder.start(1000);
            setTimeout(() => {
                recorder.stop();
            }, 4000);
        }).catch(console.error);
    }

    async function play(){
        var player = document.querySelector("#player-audio");
        if(player){
            player.play()
            await changeStatus();
        }
    }

    var a = document.createElement('link');
    a.rel = "stylesheet";
    a.type = "text/css";
    a.href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css"
    document.body.appendChild(a);

    let selfplayer = document.createElement("div");
    selfplayer.id = "ext-player";
    selfplayer.dataset.status = "ready";
    selfplayer.style.position = "fixed";
    selfplayer.style.left = "20px";
    selfplayer.style.bottom = "20px";
    selfplayer.style.height = "50px";
    selfplayer.style.width = "50px";
    selfplayer.style.border = "3px solid #111";
    selfplayer.style.borderRadius = "100px";
    selfplayer.insertAdjacentHTML("beforeend", '<i id="player-icon" style="line-height: 50px; width: 50px; text-align: center" class="fa fa-microphone"></i>')
    document.querySelector("body").appendChild(selfplayer);

    document.querySelector("#ext-player").onclick = function(){
        console.log("yo")
        if(this.dataset.status === "ready"){
            record();
        }
        if(this.dataset.status === "play"){
            play();
        }
    }
})()

