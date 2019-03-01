{
    let view = {}
    let model = {
        data:{
            song:{
                id: '',
                url: '',
                name: '',
                singer: '',  
            }
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
            this.model = model
            let id = this.gitId()
            this.model.get(id).then(()=>{
                console.log(this.model.data.song)
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