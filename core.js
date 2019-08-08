console.log("Corejs loaded")
class Bifrost {
    constructor(address){
        this.incoming        
        this.address =  address
        this.midgard = document.getElementById("cross-data")
        window.addEventListener("message", (e) => {
            if(e.origin === this.address){
                if(e.data.type === "bifrost-request-data"){
                    this.rainbowbridge("postback_data")
                }
            }
        })
    }
    async getData(key){
        this.rainbowbridge("get_data")
        this.rainbowbridge("request_data",key)
        return await this.incoming
    }

    rainbowbridge(event,payload){ // Burning Rainbow Bridge of Bifrost
        console.log("Burning Rainbow Bridge ")
        switch(event){
            case "get_data":
                this.incoming = new Promise((resolve, reject) => {
                                    window.addEventListener("message", (e) => {
                                        if(e.origin === this.address){
                                            if(e.data.type && e.data.type === "bifrost-requested-data"){
                                                console.log("This sis ",e.data.value)
                                                resolve(e.data.value)
                                            }
                                        }    
                                    })    
                                })
                break;

            case "request_data":
                let message = {
                    key :payload,
                    type: "bifrost-request-data"
                }
                this.midgard.contentWindow.postMessage(message, '*')
                break;

            
            case "postback_data":
                if(typeof(payload) === "object"){
                    let value = []
                    payload.map(key => value.push(localStorage.getItem(key)))
                    let message = {
                        type: "crossdata-requested-data",
                        value : value 
                    }
                    window.parent.postMessage(message,"*")      
                }else{
                    let message = {
                        type : "crossdata-requested-data",
                        value : localStorage.getItem(key)
                    }
                    window.parent.postMessage(message,"*")
                }
        }

       
    }
}

export default Bifrost


