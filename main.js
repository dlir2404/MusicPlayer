const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const heading = $('.dashboard__header-name')
const cdThumb = $('.dashboard__cd .cd-thumb')
const audio = $('#audio')
const playBtn = $('.dashboard__control-item-btn--play-pause')
const progress = $('#progress')
const playlist = $('.playlist')
const nextBtn = $('.next-btn')
const preBtn = $('.pre-btn')
const randomBtn = $('.random-btn')
const repeatBtn = $('.repeat-btn')

const app = {
    currentIndex:0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
    {
        name:'Bước qua mùa cô đơn',
        singer: 'Vũ',
        path:'./assets/music/music3.mp3',
        image: './assets/img/img3.jpg'
    },
    {
        name:'Bước qua nhau',
        singer:'Vũ',
        path:'./assets/music/music1.mp3',
        image: './assets/img/img1.jpg'
    },
    {
        name:'Lạ lùng',
        singer:'Vũ',
        path:'./assets/music/music2.mp3',
        image: './assets/img/img2.jpg'
    },
    {
        name:'Đông kiếm em',
        singer:'Vũ',
        path:'./assets/music/music4.mp3',
        image:'./assets/img/img4.jpg'
    },
    {
        name:'Đợi',
        singer:'Vũ',
        path:'./assets/music/music5.mp3',
        image:'./assets/img/img5.jpg'
    },
    {
        name:'Lời yêu em',
        singer:'Vũ',
        path:'./assets/music/music6.mp3',
        image:'./assets/img/img6.jpg'
    },
    {
        name:'Vì anh đâu có biết',
        singer:'Vũ',
        path:'./assets/music/music7.mp3',
        image:'./assets/img/img7.jpg'
    },
    {
        name:'Anh nhớ ra',
        singer:'Vũ',
        path:'./assets/music/music8.mp3',
        image:'./assets/img/img8.jpg'
    },
    {
        name:'Mùa mưa ngâu nằm cạnh',
        singer:'Vũ',
        path:'./assets/music/music9.mp3',
        image:'./assets/img/img9.jpg'
    },
    {
        name:'Happy for you',
        singer:'Lukas Graham ft. Vũ',
        path:'./assets/music/music10.mp3',
        image:'./assets/img/img10.jpg'
    }],

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <li class="playlist__item ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="playlist__item-cd">
                    <div class="cd-thumb" style="background-image: url('${song.image}');"></div>
                    </div>
                    <div class="playlist__item-info">
                    <div class="playlist__item-name">${song.name}</div>
                    <div class="playlist__item-singers">${song.singer}</div>
                    </div>
                    <div class="playlist__item-option">
                    <a href="" class="playlist__item-option-link">
                        <i class="fa-solid fa-ellipsis"></i>
                    </a>
                    </div>
            </li>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function() {
        const cd = $('.dashboard__cd')
        const cdWidth = cd.offsetWidth
        const dashboard = $('.dashboard')
        const dashboardHeight = dashboard.offsetHeight
        const _this = this
        
        //handle zoom dashboard
        playlist.onscroll   = function() {
            const scrollTop = playlist.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth

            const newDashBoardHeight = dashboardHeight - scrollTop
            dashboard.style.height = newDashBoardHeight > 190 ? newDashBoardHeight + 'px' : 190 + 'px'
            playlist.style.height = window.innerHeight - dashboard.offsetHeight - 64 + 'px'
        }

        //handle cd rotate
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'},
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        //handle play btn
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
                
            } else {
                audio.play()
                
            }
        }

        audio.onplay = function() {
            _this.isPlaying = true
            playBtn.classList.remove('play-btn')
            playBtn.classList.add('pause-btn')
            cdThumbAnimate.play()
        }

        audio.onpause = function() {
            _this.isPlaying = false
            playBtn.classList.remove('pause-btn')
            playBtn.classList.add('play-btn')
            cdThumbAnimate.pause()
        }

        //timeupdate
        audio.ontimeupdate = function() {
            let progressPercent = Math.floor((audio.currentTime / audio.duration)*100) 
            if (progressPercent == 0) {
                progress.value = 0
            }
            if (progressPercent) {
                progress.value = progressPercent
            }
        }

        //seek
        progress.onchange = function(e) {
            const seekTime = (e.target.value/100)*audio.duration
            audio.currentTime = seekTime
        }

        //handle next/pre
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandom()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        preBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandom()
            } else {
                _this.preSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //random
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        //handle audio ended
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            }else {
                nextBtn.click()
            }
        }

        //handle repeat
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        //handle click song
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.playlist__item:not(.active)')

            if (songNode || e.target.closest('.playlist__item-option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.getAttribute('data-index'))
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                if (e.target.closest('.playlist__item-option')) {
                    alert('Tinh nang nay chua hoan thien')
                }
            }
        }
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
        
    },
    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    preSong: function() {
        this.currentIndex--
        console.log(this.currentIndex)
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandom: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(newIndex == this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    scrollToActiveSong: function() {
        setTimeout(function() {
            $('.playlist__item.active').scrollIntoView( {
                behavior: 'smooth',
                block: 'nearest'
            })
        }, 300)
    },
    start: function() {
        // define properties
        this.defineProperties()

        //listen & handle DOM events
        this.handleEvents()

        //load current 
        this.loadCurrentSong()

        //render playlist
        this.render()
    }
}

app.start();