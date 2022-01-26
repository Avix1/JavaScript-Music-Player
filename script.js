// DOM Objects
const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
ulTag = wrapper.querySelector("ul"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
volumeButton = wrapper.querySelector("#volume-control"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");


let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
isMusicPaused = true;

// functions
window.addEventListener("load", () => {
    loadMusic(musicIndex); // calling load music function once window loaded
    playingNow();
})

// load music function
function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

// play music function
function playMusic(){ 
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

// pause music function
function pauseMusic(){ 
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}
// next music function
function nextMusic(){
    //here we'll just increment of index by 1
    musicIndex++;
    // if musicIndex is greater than array length then musicIndex will be 1 so the first song will play
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

// previous music function
function prevMusic(){
    //here we'll just increment of index by 1
    musicIndex--;
    // if musicIndex is less then 1 then musicIndex will be array length so the last song will play
    musicIndex < 1 ? musicIndex = allMusic.length: musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

// play or pause music button event
playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    // if isMusicPaused is true then call pauseMusic else call playMusic
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
})

// next button event
nextBtn.addEventListener("click", () => {
    nextMusic(); // calling next music function
});

// previous button event
prevBtn.addEventListener("click", () => {
    prevMusic(); // calling previous music function 
});

// update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime; // getting current time of song
    const duration = e.target.duration; // getting total duration of song 
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

        let musicCurrentTime = wrapper.querySelector(".current-time"),
        musicDuration = wrapper.querySelector(".max-duration");
        mainAudio.addEventListener("loadeddata", ()=>{
        //update song total duration
        let mainAdDuration = mainAudio.duration;
        let totalMin = Math.floor(mainAdDuration / 60);
        let totalSec = Math.floor(mainAdDuration % 60);
        if(totalSec < 10) { // adding 0 if sec is less than 10
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });

    //update playing song current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if(currentSec < 10) { // adding 0 if sec is less than 10
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// update playing song current time according to the progress bar width
progressArea.addEventListener("click", (e) => {
    let progressWidth = progressArea.clientWidth; // getting width of progress bar
    let clickedOffsetX = e.offsetX; // getting offset x value
    let songDuration = mainAudio.duration; // getting song total duration

    mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
    playMusic();
    playingNow();
});

// repeat or shuffle song according to the icon
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    // first we get the innerText of the icon then we'll change accordingly
    let getText = repeatBtn.innerText; // getting innerText of icon
    // making diferent changes on diferent icons using switch
    switch(getText){
        case "repeat": // if this icon is repeat then change it to repeat_one
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped")
            break;
        case "repeat_one": // if icon is repeat_one then change it to shuffle
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffle")
            break;
        case "shuffle": // if icon is repeat_one then change it to shuffle
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped")
            break;
    }
});

// what happens when the song end
mainAudio.addEventListener("ended", ()=>{
    // we'll do according to the icon means if user has set icon to loop song then we'll repeat
    // the current song and will do further accordingly

    let getText = repeatBtn.innerText; //getting innerText of icon
    // making diferent changes on diferent icons using switch
    switch(getText){
        case "repeat": // if this icon is repeat then we call the nextMusic function so the next song will play
            nextMusic();
            break;
        case "repeat_one": // if icon is repeat_one then we'll change the current playing song current time to 0 so song will play from beggining
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle": // if icon is repeat_one then change it to shuffle
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do{
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            }while(musicIndex === randIndex); // THIS LOOP RUN UNTIL THE NEXT RANDOM NUMBER WON'T BE THE SAME of current music index
            musicIndex = randIndex; // passing randonIndex to musicIndex so the random song will play
            loadMusic(musicIndex); // calling loadMusic function
            playMusic(); // calling playMusic funtion
            playingNow();
            break;
    }
});

showMoreBtn.addEventListener("click", () => {
    ulTag.classList.toggle("show");
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", () => {
    showMoreBtn.click();
});

// let's create li according to the array length
for (let i = 0; i < allMusic.length; i++){
    // let's pass the song name, artist from the array to li
    let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <span id="${allMusic[i].src}" class="audio-duration"></span>
                    <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>                   
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`#${allMusic[i].src}`);
    liAudioTag.addEventListener("loadeddata", () => {
        let duration = liAudioTag.duration;
        let totalMin = Math.floor(duration / 60);
        let totalSec = Math.floor(duration % 60);
        if(totalSec < 10) { // adding 0 if sec is less than 10
            totalSec = `0${totalSec}`;
        };
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        //adding t duration attribute which we'll use below
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
}

// let's work on play particular song on click
function playingNow() {
    const allLiTag = ulTag.querySelectorAll("li");

    for (let j = 0; j < allLiTag.length; j++) {
        let audioTag = allLiTag[j].querySelector(".audio-duration");

        if(allLiTag[j].classList.contains("playing")){
            allLiTag[j].classList.remove("playing");
            //let's get that audio duration value and pass to .audio-duration innerText
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration; //passing t-duration value to audio duration innerText
        }

        //if there is an li tag which li-index is equal to musicIndex
        //then this music is playing now and we'll style it
        if(allLiTag[j].getAttribute("li-index") === musicIndex){
            allLiTag[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }
        
    
        //adding onclick attribute in all li tags
        allLiTag[j].setAttribute("onclick", "clicked(this)");
    }
}

// let's play song on li click
function clicked(element){
    // getting li index of particular clicked li tag
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; //passing that liindex to musicIndex
    loadMusic(musicIndex); //calling load music function once window load the song
    playMusic();
    playingNow();
}

volumeButton.addEventListener("change", (e) => {
    mainAudio.volume = e.target.value / 100;
});

volumeButton.addEventListener("mousemove", (e) => {
    let x = e.target.value;
    let color = 'linear-gradient(90deg, var(--blacklight) ' + x +  '%, var(--lightbshadow) ' + x + '%)';
    console.log("volumeButton", {x, color})
    volumeButton.style.background = color; 

})

const body = document.querySelector("body");
const toggle = document.getElementById("toggle");
toggle.onclick = function() {
    toggle.classList.toggle("active");
    body.classList.toggle("active");
    wrapper.classList.toggle("active");
}
