console.log("Bifrost Loaded")
class Bifrost {
    constructor(address){
        this.bifrostResponse        
        this.address =  address

        //==========================={ + Function Binding + }================================
        this.bifrostBridge = bifrostBridge.bind(this)
        this.promiseConstructor = promiseConstructor.bind(this)
        this.postbackLocalstorage = postbackLocalstorage.bind(this)
        this.postbackSetLocalstorage = postbackSetLocalstorage.bind(this)
        this.postbackGetCookie = postbackGetCookie.bind(this)
        this.postbackSetCookie = postbackSetCookie.bind(this)
        this.postbackRunEval = postbackRunEval.bind(this)
        this.postbackDomManipulationId = postbackDomManipulationId.bind(this)
        this.postbackDomManipulationClass = postbackDomManipulationClass.bind(this)

        //============================={ - M I D G A R D - }=================================
        this.midgard = document.getElementById("cross-data")
        window.addEventListener("message", (e) => { // Bifrost Listner of Midgard
            if(e.origin === this.address){
                if(e.data.type.includes("request")){
                    let requestType = e.data.type.replace("request","postback").replace(/-/g,"_")
                    this.heimdall(requestType,e.data.value)
                }                 
            }
        })
    }

    //=========================={ + B I F R O S T - M E T H O D S + }=========================

    async getLocalStorage(key){
        this.heimdall("get_localstorage",key)
        this.heimdall("get_response")
        return await this.bifrostResponse
    }

    async setLocalStorage(payload){
        this.heimdall("set_localstorage",payload)
        this.heimdall("get_response")
        return await this.bifrostResponse
    }

    async getCookie(payload){
        this.heimdall("get_cookie",payload)
        this.heimdall("get_response")
        return await this.bifrostResponse
    }

    async setCookie(name,value,day){
        let payload = [name,value,day]
        this.heimdall("set_cookie",payload)
        this.heimdall("get_response")
        return await this.bifrostResponse
    }

    async runEval(payload){
        this.heimdall("run_eval",payload)
        this.heimdall("get_response")
        return await this.bifrostResponse
    }

    async domManipulationById(Id,styleObj){
        let payload = [Id,styleObj]
        this.heimdall("dom_manipulation_id",payload)
    }

    async domManipulationByClass(Class, index, styleObj){
        let payload = [Class,index,styleObj]
        this.heimdall("dom_manipulation_class",payload)
    }

    //=============================={ + H E I M D A L L + }===================================
    heimdall(event,payload){ 
        switch(event){
            case "get_response":
                this.promiseConstructor("bifrost-response")
            break;

            case "get_localstorage":
                this.bifrostBridge("request-get-localstorage",payload)
            break;

            case "set_localstorage":
                this.bifrostBridge("request-set-localstorage",payload)
            break;

            case "get_cookie":
                this.bifrostBridge("request-get-cookie",payload)
            break;

            case "set_cookie":
                this.bifrostBridge("request-set-cookie",payload)
            break;
            
            case "run_eval":
                this.bifrostBridge("request-run-eval",payload)
            break;

            case "dom_manipulation_id":
                this.bifrostBridge("request-dom-manipulation-id",payload)
            break;

            case "dom_manipulation_class":
                this.bifrostBridge("request-dom-manipulation-class",payload)
            break;

            case "postback_get_localstorage":
                this.postbackLocalstorage(payload)
            break;

            case "postback_set_localstorage":
                this.postbackSetLocalstorage(payload)
            break;

            case "postback_get_cookie":
                this.postbackGetCookie(payload)
            break;

            case "postback_set_cookie":
                this.postbackSetCookie(payload)
            break;

            case "postback_run_eval":
                this.postbackRunEval(payload)
            break;

            case "postback_dom_manipulation_id":
                this.postbackDomManipulationId(payload)
            break;

            case "postback_dom_manipulation_class":
                this.postbackDomManipulationClass(payload)
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
                    resolve(e.data.value)
                }
            }    
        })    
    })
    return this.bifrostResponse
}

function postbackLocalstorage(payload){
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

function postbackSetLocalstorage(payload){
    localStorage.setItem(payload["key"],payload["value"])
    if(localStorage.getItem(payload["key"])){
        this.bifrostBridge("bifrost-response", true,true)
    }else{
        this.bifrostBridge("bifrost-response", true,true)
    }
}

function postbackGetCookie(payload){
    let cookieString = document.cookie.split(";");
    let cookies = {};
    for (var i=0; i<cookieString.length; i++){
        let cookie = cookieString[i].split("=");
        cookies[(cookie[0]+'').trim()] = unescape(cookie[1]);
    }
    if(payload){
        let data = cookies[payload]
        this.bifrostBridge("bifrost-response", data, true)
    } else {
        let data = cookies
        this.bifrostBridge("bifrost-response", data, true)
    }
}

function postbackSetCookie(payload){
    let name = payload[0], value = payload[1], days = payload[2]
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function postbackRunEval(payload){
    let data = eval(payload)
    this.bifrostBridge("bifrost-response",data,true)
}

function postbackDomManipulationId(payload){
    let Id = payload[0]
    let styleObj = payload[1]
    let host = document.getElementById(Id).style
    Object.keys(styleObj).map(item  =>{
        host[item] = styleObj[item]
    })
}

function postbackDomManipulationClass(payload){
    let Class = payload[0]
    let index = payload[1]
    let styleObj = payload[2]
    let host = document.getElementsByClassName(Class)[index].style
    Object.keys(styleObj).map(item  =>{
        host[item] = styleObj[item]
    })
}
export default Bifrost