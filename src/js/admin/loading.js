{
    let view = {
        el: '#setLoading',
        shown(){
            $(this.el).addClass('active')
        },
        hidden(){
            $(this.el).removeClass('active')
        }
    }
    let controller = {
        init(view){
            this.view = view
            this.bindEventHub()
        },
        bindEventHub(){
            window.eventHub.on('beforeUploading',()=>{
                this.view.shown()
            })
            window.eventHub.on('afterUploading',()=>{
                this.view.hidden()
            })
        }
    }
    controller.init(view)
}