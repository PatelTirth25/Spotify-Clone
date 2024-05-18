let cursong = new Audio();
let curfolder
let play = document.querySelectorAll(".buttons img")[1]

function secondsToMinutesSeconds(seconds) {

    // Calculate minutes and remaining seconds
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);

    // Add leading zero if necessary
    var formattedMinutes = (minutes < 10) ? '0' + minutes : minutes;
    var formattedSeconds = (remainingSeconds < 10) ? '0' + remainingSeconds : remainingSeconds;

    // Construct the formatted string
    var formattedTime = formattedMinutes + ':' + formattedSeconds;

    return formattedTime;
}


async function getSong(folder) {
    let a = await fetch(`http://127.0.0.1:3000/songs/${curfolder}/`)
    let songurl = await a.text()
    let div = document.createElement("div")
    div.innerHTML = songurl

    let table = div.getElementsByTagName("a")
    let song = []
    for (let i = 1; i < table.length; i++) {
        let ele = table[i]
        if (ele.href.endsWith(".mp3")) {
            song.push(ele.href)
        }
    }
    return song
}

function playSong(song) {
    cursong.src = `/songs/${curfolder}/` + song + ".mp3"
    document.querySelector(".songname").innerHTML = song
    play.src = 'svg/pause.svg'
    cursong.play()
}

async function getFolder() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let folderurl = await a.text()
    let div = document.createElement("div")
    div.innerHTML = folderurl
    let foldername = []
    Array.from(div.getElementsByTagName("a")).forEach(e => {
        if (e.href.includes("/songs/")) {
            foldername.push(e.href.split("/songs/")[1].slice(0, -1))
        }
    })

    for (const index of foldername) {
        document.querySelector(".folderlist").innerHTML += `<div class="folders">${index}</div>`
    }

    return foldername;
}

function songlisting(songname) {
    for (const index of songname) {
        document.querySelector(".cards").innerHTML += `<div class="flex border">
                ${index}
                <img src="svg/start.svg" alt="">
            </div>`
    }
}

async function main() {

    //Get Folder
    let folder = await getFolder()
    curfolder = folder[0]

    //Fetching songs from song folder
    let song = await getSong()

    // Placing songname in Your Songs
    let songname = []
    for (let i = 0; i < song.length; i++) {
        let x = song[i].split(`/songs/${curfolder}/`)[1]
        songname[i] = x.split(".mp")[0].replaceAll("%20", " ")
    }
    songlisting(songname)

    //Changing playlist on click
    document.querySelectorAll(".folders").forEach(e => {
        e.addEventListener("click", async () => {
            curfolder = e.innerHTML
            song = await getSong()
            songname = []
            for (let i = 0; i < song.length; i++) {
                let xyz = song[i].split(`/songs/${curfolder}/`)[1]
                songname[i] = xyz.split(".mp")[0].replaceAll("%20", " ")
            }
            document.querySelector(".cards").innerHTML = ""
            songlisting(songname)

            playSong(songname[0])

            Array.from(document.querySelector(".cards").getElementsByTagName("div")).forEach(e => {
                e.addEventListener("click", () => {
                    console.log(e.innerHTML.split("<img")[0].trim())
                    playSong(e.innerHTML.split("<img")[0].trim())
                })
            })

        })
    })

    //Default song 
    cursong.src = `/songs/${curfolder}/` + songname[0] + ".mp3"
    document.querySelector(".songname").innerHTML = songname[0]


    //Playing song on click
    Array.from(document.querySelector(".cards").getElementsByTagName("div")).forEach(e => {
        e.addEventListener("click", () => {
            playSong(e.innerHTML.split("<img")[0].trim())
        })
    })


    //Play button change on click 
    play.addEventListener("click", () => {
        if (cursong.paused) {
            cursong.play()
            play.src = 'svg/pause.svg'
        }
        else {
            cursong.pause()
            play.src = 'svg/play.svg'
        }
    })

    //Time Update of song
    cursong.addEventListener("timeupdate", () => {
        document.querySelector(".time").innerHTML = `${secondsToMinutesSeconds(cursong.currentTime)} / ${secondsToMinutesSeconds(cursong.duration)}`
        document.querySelector(".circle").style.left = cursong.currentTime / cursong.duration * 100 + '%'

        if (parseInt(cursong.currentTime) == (parseInt(cursong.duration)-4)) {
            let index = song.indexOf(cursong.src)
            if (index + 1 < song.length) {
                cursong.pause()
                index += 1;
                playSong(songname[index])
            }
        }
    })

    //Seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + '%'
        cursong.currentTime = (e.offsetX / e.target.getBoundingClientRect().width) * cursong.duration
    })

    //Next button in playbar
    document.querySelector(".buttons img:nth-child(3)").addEventListener("click", () => {
        let index = song.indexOf(cursong.src)
        if (index + 1 < song.length) {
            cursong.pause()
            index += 1;
            playSong(songname[index])
        }
    })

    //Previous button in playbar
    document.querySelector(".buttons img:nth-child(1)").addEventListener("click", () => {
        let index = song.indexOf(cursong.src)
        if (index - 1 >= 0) {
            cursong.pause()
            index -= 1;
            playSong(songname[index])
        }
    })

    document.querySelector(".toandfro img:first-child").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0%";
    })

    document.querySelector(".logo li:first-child img:nth-child(2)").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-130%";
    })
}

main()