console.log("we are writing javascript")
    let currentSong  = new Audio()
    let songs;
    let currFolder;


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder){
    currFolder = folder
    let a = await fetch(`./${folder}/`)
    let response = await a.text();
    
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")

    let songs = []

    // for (let index = 0; index < as.length; index++) {
    //     const element = as[index];
    //     if(element.href.endsWith(".mp3")){
            
    //         songs.push(element.href.split(`/${folder}/`)[1])
    //     }
    // }

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            // Decode the URL and extract just the filename (not the full path)
            let decodedHref = decodeURI(element.href);
            // Split by both / and \ to handle different path formats
            let parts = decodedHref.split(/[\/\\]/);
            let songName = parts[parts.length - 1];
            songs.push(songName)
            console.log("Found song:", songName); // Debug log
        }
    }
    
    console.log("All songs:", songs); // Debug log


    return songs
}

const playMusic =(track , pause=false)=>{

    if (!track) {
        console.error("No track provided to playMusic");
        return;
    }
    // let audio = new Audio("/songs/"+ track)
    currentSong.src = `/${currFolder}/`+ track
    if(!pause){
        currentSong.play()
        play.src = "pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {

    songs = await getSongs("songs/ncs")
    console.log("Songs loaded:", songs); // Debug log
    

    // playMusic(songs[0], true)

    if (songs.length > 0) {
        playMusic(songs[0], true)
    } else {
        console.error("No songs found!");
    }
    

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> <img class="invert" src="music.svg" alt="">
                        <div class="info">
                        
                            <div>${song}</div>
                            <div>by Arist</div>
                        </div>

                        <div class="playnow">
                            <span>Play now</span>
                            <img class="invert" src="./play.svg" alt="">
                        </div>
        </li>`;
    }
    // play the fist song  
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "play.svg"
        }
    })

        document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        e.preventDefault(); // stops page from scrolling
        play.click();
    }
});
;




        currentSong.addEventListener("timeupdate",()=>{
            // console.log(currentSong.currentTime, currentSong.duration);
            document.querySelector(".songtime").innerHTML = 
            `${secondsToMinutesSeconds(currentSong.currentTime)}/
            ${secondsToMinutesSeconds(currentSong.duration)}`
            document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration)*100 + "%"
        })

        //Eventlistner to seekbaar

        document.querySelector(".seekbar").addEventListener("click", e=>{
            let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100
            document.querySelector(".circle").style.left = percent + "%";
            currentSong.currentTime = ((currentSong.duration)*percent)/100
        })

        document.querySelector(".hamburger").addEventListener("click", ()=>{
            document.querySelector(".left").style.left = 0;
        })

        document.querySelector(".close").addEventListener("click", ()=>{
            document.querySelector(".left").style.left = "-130%";
        })


        previous.addEventListener("click",()=>{
            console.log("previous was clicked");

            let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
            if((index-1)>=0){
                playMusic(songs[index-1])
            }
            
        })

        next.addEventListener("click",()=>{
            console.log("next was clicked");

            let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
            if((index+1)< songs.length){
                playMusic(songs[index+1])
            }
            
            console.log(songs, index)
        })

        document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
            console.log("Setting the volume to ",e.target.value ,"/ 100");
            currentSong.volume = parseInt(e.target.value)/100
        });


}

main()
