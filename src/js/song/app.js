{
    let view = {
        el: '#app',
        init(){
            this.$el = $(this.el)
        },
        render(data){
            this.$el.css('background',`url(${data.song.cover}) center center`)
            this.$el.find('img.cover').attr('src',data.song.cover)
            if(this.$el.find('audio').attr('src') !== data.song.url){
                let audio = this.$el.find('audio').attr('src',data.song.url).get(0)
                //这里面是会进行从新加载音乐的链接的。
                audio.onended = ()=>{window.eventHub.emit('songEnd')}
                audio.ontimeupdate = ()=>{
                    this.showLyrics(audio.currentTime)
                }
            }//这个判断是为了保证暂停再次播放的时候不会从新加载以便。
            if(data.statues === 'playing'){
                this.$el.find('.disc-container').addClass('playing')
            }else{
                this.$el.find('.disc-container').removeClass('playing')
            }
            this.$el.find('.song-description>h1').html(data.song.name)
            let arrey = data.song.lyrics
            lyric = arrey.split('\n')
            lyric.map((string)=>{
                let p = document.createElement('p')
                let regex = /\[([\d:.]+)\](.+)/
                let matchs = string.match(regex)
                if(matchs){
                    let minus = matchs[1].split(':')[0]
                    let seconds = matchs[1].split(':')[1]
                    let newTime = parseInt(minus,10) * 60 + parseFloat(seconds,10)
                    p.setAttribute('song-time',newTime)
                    p.textContent = matchs[2]
                }else{
                    p.textContent = string
                }
                this.$el.find('.lyric>.lines').append(p)  
            })
        },
        showLyrics(time){
            let allP = this.$el.find('.lyric>.lines>p')
            let p
            for(let i = 0;i<allP.length;i++){
                let currentTime = allP.eq(i).attr('song-time')
                let nextTime = allP.eq(i+1).attr('song-time')
                if(i===allP.length-1){
                    p = allP[i]
                    break
                }else if(currentTime <= time && time < nextTime){
                    // console.log(allP[i]) //到目前为止，已经能成功的根据歌曲的进度依次得到歌词
                    p = allP[i]
                    break
                }
            }
            let lineHieght = this.$el.find('.lyric>.lines')[0].getBoundingClientRect().top
            let pHieght = p.getBoundingClientRect().top
            let height = lineHieght - pHieght
            this.$el.find('.lyric>.lines').css({
                transform:`translateY(${height+25}px)`
            })
            $(p).addClass('active').siblings('.active').removeClass('active')
        },
        play(){
            this.$el.find('audio')[0].play()
        },
        pause(){
            this.$el.find('audio')[0].pause()
        }
    }
    let model = {
        data:{
            song:{
                id: '',
                url: '',
                name: '',
                cover: '',
                singer: '',  
            },
            statues : 'paused',
        },
        get(id){
            var query = new AV.Query('Song')
            return query.get(id).then( (song) => {
                Object.assign(this.data.song,{id:song.id,...song.attributes})
                return song
            })
        },
    }
    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            let id = this.gitId()
            this.model.get(id).then(()=>{
                this.view.render(this.model.data)
            })
            this.bindEvents()
        },
        bindEvents(){
            $(this.view.el).on('click','.icon-play',()=>{
                this.model.data.statues = "playing"
                this.view.render(this.model.data)
                this.view.play()
            })
            $(this.view.el).on('click','.icon-pause',()=>{
                this.model.data.statues = "paused"
                this.view.render(this.model.data)
                this.view.pause()
            })
            window.eventHub.on('songEnd',()=>{
                this.model.data.statues = 'paused'
                this.view.render(this.model.data)
            })
        },
        gitId(){
            let search = window.location.search
            if(search.indexOf('?') === 0){
                search = search.substring(1)
            }
            let searchs = search.split('=').filter(v=>v)
            let id=''
            for(let i=0;i<searchs.length;i++){
                let key = searchs[0]
                let value = searchs[1]
                if(key === 'id'){
                    id = value
                }
                break
            }
            return id
        }
    }
    controller.init(view,model)
}