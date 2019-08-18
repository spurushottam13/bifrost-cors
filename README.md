# Bifrost-CROS
###### A cross-domain communication solution to share data and many more  functionalities with simple as just calling a method.
#### Functionalities can be performed on CROS Domain
 -------------
 
- ###### Get, Set Cookie
- ###### Get, Set & Delete  Local Stroage 
- ###### Bi-directional message thread
- ###### Run JS expression from one domain to other
- ###### DOM Manipulation from one domain to other domain ( Iframe )

All above methods are wrapped in a promise. 



----
##### Initialize Bifrost-CROS
```javascript
var bifrostCross = new Bifrost(address, iframeBoolean)	
```
| Parameter        | Required           | Value  |
| :------------- |:---------------------|:-----|
| address      | YES | Exact Address of the other domain|
| iframeBoolean| YES      |   <b>true</b> :- If you already rendering the other domain in iframe </br> <b>false</b> If you are not rendering the other domain in iframe |

---
##### Implementation of methods and how to handle promise
```javascript
var bifrostCross = new Bifrost("http://example.com/",false)

//Calling Methods without promise
var result = bifrostCross.getLocalStorage(key)

//Hanlde Promise

//1. Using .then()
var result = bifrostCross.getLocalStorage(key)
result.then((data) => {
	console.log(data)
 })

//2. Using async function
async function grabLocalStorage(){
	let result = await  bifrostCross.getLocalStorage(key)
}
```
---
#### Functionalities
* #### Cookies
	* __Get Cookies__
	```javascript
    // return type Object, return all cookies
    bifrost.getCookie() 
    
   // return type string
   	bifrost.getCookie("key")
    ```
    
    * __Set Cookies__
	```javascript
   	bifrost.setCookie(name,value,days)   
     ```
     * Parameter 
     	* name __String__,  name for cookie
        * value __String__, value for cookie
        * days __int__, expiration days for cookie
        
     * return type __Boolean__
     
* #### LocalStorage	
	* __Get local Storage__
	```javascript
    // return type stirng
    bifrost.getgetLocalStorage("key") 
    
    // return type array
   	bifrost.getLocalStorage(["key1","key2"])
    ```
    
    * __Set local Storage__
	```javascript
    // return type Boolean
    bifrost.setLocalStorage("key") 
    
    // return type Boolean
   	bifrost.setLocalStorage(["key1","key2"])
    ```
    
    * __Delete local Storage__
	```javascript
    // return type Boolean
    bifrost.deleteLocalStorage("key") 
    
    // return type Boolean
   	bifrost.deleteLocalStorage(["key1","key2"])
    ```

* #### Bi-directional message thread
	* __Request Message Thread__
	```javascript
    // return type Boolean, parameter type funtion
    bifrost.requestMessageThread(Listner)
    ```
   Listner is your custom function which will be invoked every time new message recivied, and it should expect a new message as a parameter
    
   Here's exapmle
   
   ```javascript
   function myCustomListner(newMessage){
   	cosnole.log("Hurray I got new message ",newMessage)
    }
    
    bifrost.requestMessageThread(myCustomListner)
   ```
   
    * __Send Message__
	```javascript
    // return type Boolean, parameter type string|int|array|object
    bifrost.send(message)
     ```
     
* #### Run JS expression from one domain to other
	```javascript
    // return type Boolean, parameter type string
    bifrost.runExpression(expression)
     ```
* #### DOM Manipulation
	* __DOM Manipulation by ID__
	```javascript
    // return type Boolean, parameter type string
    bifrost.domManipulationById("yourElementID")
     ```
    * __DOM Manipulation by class name__
	```javascript
    // return type Boolean, parameter type string,int,Objet
    bifrost.domManipulationById(class,index,style)
     ```
  	* Parameter 
     	* class __String__  your element class name
        * index __int__ index no of that element in class array
        * style __Object__ Style object
        
    * Example:a
    if you can access element by 
    document.getElementsByClassName("myElementClass)[4]<br/>
    so parameter will be <br/>
    	* class "myElementClass"
    	* index 4
    	* style {background:"red"}
