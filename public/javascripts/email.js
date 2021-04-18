import {validateMobile , validateEmail , validatePassword , verifyPassword} from "./validate.js" 
import {sendData , getData , selector , selectAll , createElement } from "./api.js"  


const RegistrationModel = {
    validFormValue : {}
}
class RegistrationView  { 
    constructor() {
        this.inputs = Array.from(selectAll(".map-form"))
    } 
} 

class RegistrationController {
    constructor(view , model) {
        this.view = new view()
        this.model = model
        this.addEvent() 
    }

    handleBlur(event) {
        if (event.target.id === "email") { 
            if ( event.target.parentNode.lastChild.tagName === "p") {
                event.target.parentNode.lastChild.remove()    
            } 
            let p = createElement("p")   
            if (validateEmail(event.target.value).value) {
                event.target.classList.contains("is-invalid") ? event.target.classList.remove("is-invalid") : null 
                event.target.classList.add("is-valid")
                RegistrationModel.validFormValue[`${event.target.id}`] = event.target.value 
            }else { 
                if(event.target.nextElementSibling){
                    event.target.nextElementSibling.remove()
                }
                p.textContent = "The email is invalid" 
                p.classList.add("invalid-feedback") 
                event.target.classList.add("is-invalid")
                event.target.parentNode.appendChild(p)
            }
            event.target.value = event.target.value 
			event.target.removeEventListener("focus" , this.handleBlur)
        }
        
    }
    
    handleSubmit(event) { 
		if (event.target.id === "submit") {     
            console.log(RegistrationModel.validFormValue)
            let serverMessage = createElement("p")
            if(RegistrationModel.validFormValue.email ){
                    console.log("Redirecting...")

            }else{
                event.preventDefault()
                if ( event.target.previousSibling) {
                    event.target.previousSibling.remove()    
                } 
                serverMessage.textContent = "Please fill all neccessary fields." 
                serverMessage.classList.add("err")
                event.target.parentNode.insertBefore(serverMessage , event.target)
            }
		}
    }
    
    addEvent() {
        this.view.inputs.map(field => {
            field.addEventListener("blur" , this.handleBlur) 
            field.addEventListener("click" , this.handleSubmit) 
        })
    }
} 

const app = new RegistrationController(RegistrationView , RegistrationModel)
