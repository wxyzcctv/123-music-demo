
{
    let view = {
        el: '#songList-container',
        template: `
        <ul class="songList">
        </ul>
        `,
        render(data){
            let $el = $(this.el)
            $el.html(this.template)
            let {songs,selectSongId} = data
            let liList = songs.map((song)=>{
                let $li = $('<li></li>').text(song.name).attr('song-data-id',song.id)
                if(song.id === selectSongId){
                    $li.addClass('active')
                }
                return $li
            })
            //以上内容是创建一个li，并设置这个li的text的内容
            $el.find('ul').empty()//首先就是清空里面的ul
            liList.map((domLi)=>{ //遍历liList中的数组，找到其中的domLi，然后将其放到ul中
                $el.find('ul').append(domLi)
            })
        },
        clearActive(){
            $(this.el).find('.active').removeClass('active')
        },
    }
    let model = {
        data: {
            songs: [ ],
            selectSongId: undefined,
        },
        find(){
            var query = new AV.Query('Song')
            return query.find().then((songs)=>{
                this.data.songs = songs.map((song)=>{
                    return {id: song.id, ...song.attributes}
                })
                return songs
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEventHub()
            this.getAllSongs()
            this.bindEvents()
        },
        bindEventHub(){
            window.eventHub.on('create',(songData)=>{
                this.model.data.songs.push(songData)
                this.view.render(this.model.data)
            })
            window.eventHub.on('new',()=>{
                this.view.clearActive()
            })
            window.eventHub.on('updata',(song)=>{
                let songs = this.model.data.songs
                for(let i = 0;i<songs.length;i++){
                    if(songs[i].id === song.id){
                        Object.assign(songs[i], song)
                    }
                }
                this.view.render(this.model.data)
            })
            
        },
        getAllSongs(){
            this.model.find().then(()=>{
                this.view.render(this.model.data)
            })
        },
        bindEvents(){
            $(this.view.el).on('click','li',(e)=>{
                let songID = e.currentTarget.getAttribute('song-data-id')

                this.model.data.selectSongId = songID
                this.view.render(this.model.data)

                let songs = this.model.data.songs
                let data 
                for (let i = 0; i < songs.length; i++) {
                    if(songs[i].id === songID){
                        data = songs[i]
                        break
                    }
                }
                let object = JSON.parse(JSON.stringify(data))
                window.eventHub.emit('select',object)
            })
        }
    }
    controller.init(view,model)
}