console.log("Corejs loaded")
class CrossData {
    constructor(requestor){
        this.incoming        
        this.requestor =  requestor
    }
    async getData(key){
        this.rainbowbridge("get_data")
        var crossData  = document.getElementById("cross-data")
        let message = {
            key :key,
            type: "crossdata-request-data"
        }
        crossData.contentWindow.postMessage(message, '*')
        return await this.incoming

    }

    rainbowbridge(event){
        console.log("Buring Rainbow Bridge ")
        switch(event){
            case "get_data":
            this.incoming = new Promise((resolve, reject) => {
                                    window.addEventListener("message", (e) => {
                                        if(e.origin === this.requestor){
                                            if(e.data.type){
                                                if(e.data.type === "crossdata-requested-data"){
                                                    console.log("This sis ",e.data.value)
                                                    resolve(e.data.value)
                                                }
                                            }
                                        }
                                    
                                })    
                            })
            break;
        }

       
    }
}

export default CrossData


