console.log("Corejs loaded")
class Bifrost {
    constructor(address){
        this.bifrostResponse        
        this.address =  address
        this.midgard = document.getElementById("cross-data")
        window.addEventListener("message", (e) => {
            if(e.origin === this.address){
                if(e.data.type === "bifrost-request-data"){
                    this.rainbowbridge("postback_data",e.data.value)
                }
                if(e.data.type === "bifrost-set-data"){
                    this.rainbowbridge("postback_set_data",e.data.value)
                }
            }
        })
    }
    async getData(key){
        this.rainbowbridge("get_response")
        this.rainbowbridge("request_data",key)
        return await this.bifrostResponse
    }

    async setData(payload){
        this.rainbowbridge("set_data",payload)
        this.rainbowbridge("get_response")
    }

    rainbowbridge(event,payload){ // Burning Rainbow Bridge of Bifrost
        console.log("Burning Rainbow Bridge ",event,payload)
        switch(event){
            case "get_response":
                this.bifrostResponse = new Promise((resolve, reject) => {
                                    window.addEventListener("message", (e) => {
                                        if(e.origin === this.address){
                                            if(e.data.type && e.data.type === "bifrost-response"){
                                                console.log("This Response ",e.data.value)
                                                resolve(e.data.value)
                                            }
                                        }    
                                    })    
                                })
            break;

            case "request_data":
                let request_data = {
                    type: "bifrost-request-data",
                    value :payload
                }
                this.midgard.contentWindow.postMessage(request_data, '*')
            break;


            case "set_data":
                let set_data = {
                    type: "bifrost-set-data",
                    value: payload
                }
                this.midgard.contentWindow.postMessage(set_data, '*')
            break;

                
            case "postback_data":
                if(typeof(payload) === "object"){
                    let value = []
                    payload.map(key => value.push(localStorage.getItem(key)))
                    let message = {
                        type: "bifrost-response",
                        value : value 
                    }
                    window.parent.postMessage(message,"*")      
                }else{
                    let message = {
                        type : "bifrost-response",
                        value : localStorage.getItem(payload)
                    }
                    window.parent.postMessage(message,"*")
                }
            break;

            case "postback_set_data":
                    localStorage.setItem(payload["key"],payload["value"])
                    if(localStorage.getItem(payload["key"])){
                        let message = {
                            type: "bifrost-response",
                            value : true 
                        }
                        window.parent.postMessage(message,"*") 
                    }else{
                        let message = {
                            type: "bifrost-response",
                            value : false 
                        }
                        window.parent.postMessage(message,"*") 
                    }
            break;

        }       
    }
}

export default Bifrost


