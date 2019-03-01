{
    let view = {
        el: 'section.playlists',
        // 这个单元主要是歌单的js部分
        init(){
            this.$el = $(this.el)
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            this.bindEvents()
        },
        bindEvents(){

        }
    }
    controller.init(view,model)
}