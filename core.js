console.log("Bifrost Loaded")
class Bifrost {
    constructor(address){
        this.bifrostResponse        
        this.address =  address

        //==========================={ + Function Binding + }================================
        this.bifrostBridge = bifrostBridge.bind(this)
        this.promiseConstructor = promiseConstructor.bind(this)
        this.postbackData = postbackData.bind(this)
        this.postbackSetData = postbackSetData.bind(this)
        
        //============================={ - M I D G A R D - }=================================
        this.midgard = document.getElementById("cross-data")
        window.addEventListener("message", (e) => { // Response Listner of Midgard
            if(e.origin === this.address){
                if(e.data.type === "bifrost-request-data"){
                    this.heimdall("postback_data",e.data.value)
                }
                if(e.data.type === "bifrost-set-data"){
                    this.heimdall("postback_set_data",e.data.value)
                }
            }
        })
    }

    //=========================={ + B I F R O S T - M E T H O D S + }=========================

    async getData(key){
        this.heimdall("request_data",key)
        this.heimdall("get_response")
        return await this.bifrostResponse
    }

    async setData(payload){
        this.heimdall("set_data",payload)
        this.heimdall("get_response")
        return await this.bifrostResponse
    }

    //=============================={ + H E I M D A L L + }===================================
    heimdall(event,payload){ 
        switch(event){
            case "get_response":
                this.promiseConstructor("bifrost-response")
            break;

            case "request_data":
                this.bifrostBridge("bifrost-request-data",payload)
            break;

            case "set_data":
                this.bifrostBridge("bifrost-set-data",payload)
            break;
                
            case "postback_data":
                this.postbackData(payload)
            break;

            case "postback_set_data":
                this.postbackSetData(payload)
            break;

        }       
    }
}

// ====================================={+ F U N C T I O N S +} =========================================

function bifrostBridge(event,payload,postback = false){
    let message = {
        type: event,
        value :payload
    }
    if(postback){
        window.parent.postMessage(message,"*")
    } else {
        this.midgard.contentWindow.postMessage(message, '*')
    }
     
}

function promiseConstructor(promiseType){
    this.bifrostResponse = new Promise((resolve, reject) => {
        window.addEventListener("message", (e) => {
            if(e.origin === this.address){
                if(e.data.type && e.data.type === promiseType){
                    console.log("Bifrost Response ",e.data.value)
                    resolve(e.data.value)
                }
            }    
        })    
    })
    return this.bifrostResponse
}

function postbackData(payload){
    if(typeof(payload) === "object"){
        let data = []
        payload.map(key => {
            data.push(localStorage.getItem(key))
        })
        this.bifrostBridge("bifrost-response",data,true)
    }else{
        let data = localStorage.getItem(payload)
        this.bifrostBridge("bifrost-response",data,true)
    }
}

function postbackSetData(payload){
    localStorage.setItem(payload["key"],payload["value"])
    if(localStorage.getItem(payload["key"])){
        this.bifrostBridge("bifrost-response", true,true)
    }else{
        this.bifrostBridge("bifrost-response", true,true)
    }
}
export default Bifrost


