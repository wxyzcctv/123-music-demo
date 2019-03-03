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
                this.$el.find('audio').attr('src',data.song.url)
                //这里面是会进行从新加载音乐的链接的。
            }//这个判断是为了保证暂停再次播放的时候不会从新加载以便。
            if(data.statues === 'playing'){
                this.$el.find('.disc-container').addClass('playing')
            }else{
                this.$el.find('.disc-container').removeClass('playing')
            }
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