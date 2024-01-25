const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const btnPlay = $('.btn-toggle-play')
const player = $('.player');
const progress = $('#progress');
const btnNext = $('.btn-next');
const btnPrev = $('.btn-prev');
const btnRandom = $('.btn-random');
const btnRepeat = $('.btn-repeat');
const app = {
    currentIndex: 0,
    isRandom:false,
    isRepeat:false,
    isPLaying: false,
    songs: [
        { 
            name: 'Buddha',
            singer: 'Wowy',
            path: 'music/buddha.mp3',
            image:'Image/buddha.jpg'
        },
        { 
            name: '3 năm 6 tháng',
            singer: 'Cu Bể',
            path: 'music/3nam6thang.mp3',
            image:'Image/cuabe.jpg',
        },
        { 
            name: 'Cuộc đời anh ba',
            singer: 'Cu Bể',
            path: 'music/cuocdoianhba.mp3',
            image:'Image/cuabe.jpg'
        },
        { 
            name: 'Khu tao sống',
            singer: 'Wowy',
            path: 'music/khutaosong.mp3',
            image:'Image/khutaosong.jpg'
        },
        { 
            name: 'Làm liều',
            singer: 'Kriss Ngo',
            path: 'music/lamlieu.mp3',
            image:'Image/lamlieu.jpg'
        },
        { 
            name: 'Phú quý bò viên',
            singer: 'Anh Phân',
            path: 'music/phuquybovien.mp3',
            image:'Image/anhphan.jpg'
        },
        { 
            name: 'Tan',
            singer: 'Tuấn Hưng',
            path: 'music/tan.mp3',
            image:'Image/tan.jpg'
        },
        { 
            name: 'Xin lỗi',
            singer: 'Anh Phân',
            path: 'music/xinloi.mp3',
            image:'Image/xinloi.jpg'
        },
        { 
            name: 'Nguyễn Thúc Thùy Tiên',
            singer: 'Anh Phân',
            path: 'music/nguyenthucthuytien.mp3',
            image:'Image/nttt.jpg'
        },
    ],

    render: function (){
        const html = this.songs.map((song,index) =>{
            return `
            <div class="song ${index === this.currentIndex ? 'active':''}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
            <i class="fas fa-ellipsis-h"></i>
            </div>
        </div> `
        })
        $('.playlist').innerHTML = html.join('');
    },

    defineProp: function(){
        Object.defineProperty(this, 'currentSong',
        {
            get: function(){
                return this.songs[this.currentIndex];
            }
        }
        )},

    handleEvents: function(){
        const cd = $('.cd');
        const cdThumb = $('.cd-thumb')
        const cdWidth = cd.offsetWidth;
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],
        {
            duration: 10000,
            iterations: Infinity,
            
        })
        cdThumbAnimate.pause()
        document.onscroll = function(){
            const scrollWidth = document.scrollingElement.scrollTop
            const newcdWidth = cdWidth - scrollWidth;
            cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0
        }
        btnPlay.onclick = function(){
            if(app.isPLaying){
                audio.pause()
            }
            else{
                audio.play()
            }
           audio.onplay = function()
           {
            app.isPLaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play()
           }

           audio.onpause = function()
           {
            app.isPLaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause()
           }
        }

        progress.oninput = function(e){
         const seekTime = audio.duration / 100 * e.target.value
         audio.currentTime = seekTime
        }
        
       audio.ontimeupdate = function(){
        if(audio.duration){
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
            progress.value = progressPercent
        }
       }

       btnNext.onclick = function(){
        if(app.isRandom)
        {
            app.randomSong();
        }
        else{
            app.nextSong()
        }
            audio.play()
            cdThumbAnimate.play()
            app.isPLaying = true;
            player.classList.add('playing');
            app.render()
       }

       btnPrev.onclick = function(){
        if(app.isRandom)
        {
            app.randomSong();
        }
        else{
            app.prevSong()
        }
          audio.play();
          cdThumbAnimate.play()
          app.isPLaying = true;
          player.classList.add('playing');
          app.render()
       }
       
        btnRandom.onclick = function(){
           app.isRandom = !app.isRandom
           btnRandom.classList.toggle('active',app.isRandom)
        }

        btnRepeat.onclick = function(){
            app.isRepeat = !app.isRepeat
            btnRepeat.classList.toggle('active',app.isRepeat)
         }

         
           audio.onended = function(){
            if(app.isRepeat)
            {
                audio.play()
                app.render()
            }
            else{
                btnNext.click()
           }
        }
          
    },

    loadCurrentSong: function(){
        const heading = $('header h2')
        const cdThumb = $('.cd-thumb')
        const audio = $('#audio')
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong()
    },
    randomSong: function(){
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length - 1)
        }while(newIndex == this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong()
    },
    start: function(){
        this.defineProp()
        this.render()
        this.handleEvents()
        this.loadCurrentSong()
    },

};

app.start();