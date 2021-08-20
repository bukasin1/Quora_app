import {validateMobile , validateEmail , validatePassword , verifyPassword} from "./validate.js" 
import {sendData , getData , selector , selectAll , createElement } from "./api.js"  

const RegistrationModel = {
    nigerianState : [
        {name : "Technology" , capital : "Umuahia"} , {name : "Science" , capital : "Yola"} , 
        {name : "Health" , capital : "Uyo"} , {name : "Education" , capital : "Entertainment"} , 
        {name : "Investing" , capital : "Bauchi"} , {name : "Entertainment" , capital : "Yenegoa"} ,
        {name : "Others" , capital : "Yenegoa"}
    ] ,
    validFormValue : {}
}
class RegistrationView  { 
    constructor() {
        this.select = selector("#state") 
        this.inputs = Array.from(this.getElements(".map-form"))
        this.submitButton = selector("#submit") 
    } 
/*     displayState(states) {
        states.map(
        state => {
            let option = createElement("option") 
            option.value = state.name 
            option.textContent = state.name 
            this.select.append(state)
        })
    } */
    createElement(tag){
		return document.createElement(tag)  
	}
	getElement(target) {
		return document.querySelector(target) 
    } 
	getElements(target) {
		return document.querySelectorAll(target) 
	} 
} 

class RegistrationController {
    constructor(view , model) {
        this.view = new view()
        this.model = model
        this.addEvent() 
    }

    /* handleFocus(e){
        
		if ( e.target.id === "category") { 
            RegistrationModel.nigerianState.map(state => {
                let option = createElement("option") 
                option.value = state.name 
                option.textContent = state.name 
                e.target.append(option) 
            })
        }
    } */

    handleSelect(event) {
        if (event.target.id === "category") {
            if(event.target.value === "Others"){
                let input = document.querySelector(".one")
                input.classList.remove('d-none')
                 
            }else{
                let input = document.querySelector(".one")
                input.classList.contains('d-none') ? null : input.classList.add('d-none')
                event.target.value = event.target.value
                RegistrationModel.validFormValue[`${event.target.id}`] = event.target.value 
            }
            
        }
    }

    handleBlur(event) {
        if (event.target.id === "title" || event.target.id === "details") { 
            if ( event.target.parentNode.lastChild.tagName === "p") {
                event.target.parentNode.lastChild.remove()    
            }   
                
            let p = createElement("p")   
            if (event.target.value !== " " && event.target.value.trim().length > 0) {
                event.target.classList.contains("is-invalid") ? event.target.classList.remove("is-invalid") : null 
                event.target.classList.add("is-valid")
                RegistrationModel.validFormValue[`${event.target.id}`] = event.target.value 
            }else { 
                if(event.target.nextElementSibling){
                    event.target.nextElementSibling.remove()
                }
                p.textContent = "Please, provide a valid detail" 
                p.classList.add("invalid-feedback")
                event.target.classList.remove("is-valid") 
                event.target.classList.add("is-invalid")
                event.target.parentNode.appendChild(p)
            }
            event.target.value = event.target.value 
            event.target.removeEventListener("focus" , this.handleBlur)
            console.log(event.target.previousElementSibling)
        } 
        if(event.target.classList.contains("one")){
            console.log(event.target.value)
            console.log(event.target.parentNode.previousElementSibling)
            RegistrationModel.validFormValue[`${event.target.parentNode.previousElementSibling.id}`] = event.target.value 
        }
        
    }
    
    handleSubmit(event) { 
		if (event.target.id === "submit") {     
            console.log(RegistrationModel.validFormValue)
            let serverMessage = createElement("p")
            if(RegistrationModel.validFormValue.title && RegistrationModel.validFormValue.category && RegistrationModel.validFormValue.details){
                
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
            field.addEventListener ("focus" ,  this.handleFocus)
            field.addEventListener("blur" , this.handleBlur) 
            field.addEventListener("click" , this.handleSubmit) 
            field.addEventListener("change" , this.handleSelect)
        })
    }
} 

const app = new RegistrationController(RegistrationView , RegistrationModel)
