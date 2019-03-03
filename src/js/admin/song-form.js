{
    let view = {
        el: '.page > main',  //容器
        init(){
            this.$el = $(this.el)//这里主要的作用就是对el进行初始化，以免在controller中要写很长一串
        },
        template: `
        <form class="form">
            <div class="row">
                <label>
                歌名
                </label>
                <input name="name" type="text" value="__name__">
            </div>
            <div class="row">
                <label>
                歌手
                </label>
                <input name="singer" type="text" value="__singer__">
            </div>
            <div class="row">
                <label>
                外链
                </label>
                <input name="url" type="text" value="__url__">
            </div>
            <div class="row">
                <label>
                背景
                </label>
                <input name="cover" type="text" value="__cover__">
            </div>
            <div class="row actions">
                <button type="submit">保存</button>
            </div>
        </form>
        `, //容器中的内容
        render(data = {}){
            //如果用户没有传data或者穿的data是没有定义的，那么就令data为空，这是ES6的语法
            let placeholders = ['name','singer','url','cover','id']
            let html = this.template
            placeholders.map((string)=>{
                //这里的map函数是为了能进行palceholders的遍历
                html = html.replace(`__${string}__`,data[string] || '')
            })
            $(this.el).html(html)
            if(data.id){
                $(this.el).prepend('<h1>编辑歌曲</h1>')
            }else{
                $(this.el).prepend('<h1>新建歌曲</h1>')
            }
        },//将容器中的内容放到容器中的函数
        reset(){
            this.render({})
        }
    }
    let model = {
        data:{
            name: '',singer: '',url: '',id: '',cover: ''
        },
        create(data){
            var Song = AV.Object.extend('Song');
            var song = new Song();
            song.set('name',data.name);
            song.set('singer',data.singer);
            song.set('url',data.url);
            song.set('cover',data.cover);
            return song.save().then((newSong)=>{
                //如果成功了就得到newSong，然后将这个newSong打印出来
              console.log(newSong);
              let {id,attributes} = newSong
              Object.assign(this.data,{id,...attributes})//将newSong的所有属性都放到this.data中
            }, (error)=>{
                //如果失败就打印出这个错误来
              console.error(error);
            });
        },
        updata(data){
            var song = AV.Object.createWithoutData('Song', this.data.id)
            song.set('name', data.name)
            song.set('singer', data.singer)
            song.set('url', data.url)
            song.set('cover', data.cover)
            return song.save().then((response)=>{
                Object.assign(this.data , data)
                return response
            })
        }
    }
    let controller ={
        init(view,model){
            this.view = view
            this.view.init()
            this.model =model
            this.view.render(this.model.data)
            window.eventHub.on('select',(data)=>{
                this.model.data = data
                this.view.render(this.model.data)
            })
            window.eventHub.on('new',(data)=>{          
                if(this.model.data.id){
                    this.model.data = {
                        name: '',singer: '',url: '',id: '',cover: ''
                    }
                }else{
                    Object.assign(this.model.data,data)
                }
                this.view.render(this.model.data)
            })
            this.bindEvents()
        },
        create(){
            let needs = 'name singer url cover'.split(' ')
            let data = {}
            needs.map((string)=>{
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })//找到对应的元素对应的值，这个元素是在view中传入的template中进行寻找的
            this.model.create(data)
            .then(()=>{//model成功的创建数据之后就进行render的渲染，这个渲染使用最新得到的数据进行渲染
                //本来传入的数据就是最新的数据，所以在渲染的时候就页面的内容是保持不变的。
                this.view.reset()//现在就是成功之后将输入框中的内容清空了
                let string = JSON.stringify(this.model.data)
                let object = JSON.parse(string)
                //这里进行的就是深拷贝
                window.eventHub.emit('create',object)
            })
        },
        updata(){
            let needs = 'name singer url cover'.split(' ')
            let data = {}
            needs.map((string)=>{
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.updata(data)
            .then(()=>{
                window.eventHub.emit('updata',JSON.parse(JSON.stringify(this.model.data)))
            })
        },
        bindEvents(){
            this.view.$el.on('submit','form',(e)=>{
                //当提交form的时候，进行的是事件委托
                e.preventDefault()
                if(this.model.data.id){
                    this.updata()
                }else{
                    this.create()
                }
            })
        }
    }
    controller.init(view,model)
}