window.eventHub = {
    events: {

    },//hash
    emit(eventName,data){ //发布
        for(let key in this.events){
            if(key === eventName){
                let fnList = this.events[key]
                fnList.map((fn)=>{
                    fn.call(undefined,data)
                })
            }
        }
    },
    on(eventName,fn){ //订阅
        if(this.events[eventName] === undefined){
            this.events[eventName] = []
        }
        this.events[eventName].push(fn)
    }//如果最开始没有订阅的目标，那么就令订阅的内容为空，如果有了，就直接将需要传递的函数放到订阅的内容中。
}