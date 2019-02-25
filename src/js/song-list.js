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
            let {songs} = data
            let liList = songs.map((song)=>$('<li></li>').text(song.name))
            //以上内容是创建一个li，并设置这个li的text的内容
            $el.find('ul').empty()//首先就是清空里面的ul
            liList.map((domLi)=>{ //遍历liList中的数组，找到其中的domLi，然后将其放到ul中
                $el.find('ul').append(domLi)
            })
        },
        clearActive(){
            $(this.el).find('.active').removeClass('active')
        }
    }
    let model = {
        data: {
            songs: [ ]
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            window.eventHub.on('upload',()=>{
                this.view.clearActive()
            })
            window.eventHub.on('create',(songData)=>{
                this.model.data.songs.push(songData)
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view,model)
}