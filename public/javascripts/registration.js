import {validateMobile , validateEmail , validatePassword , verifyPassword} from "./validate.js" 
import {sendData , getData , selector , selectAll , createElement } from "./api.js"  

const RegistrationModel = {
    nigerianState : [
        {name : "Abia" , capital : "Umuahia"} , {name : "Adamawa" , capital : "Yola"} , 
        {name : "Akwa-Ibom" , capital : "Uyo"} , {name : "Anambra" , capital : "Awka"} , 
        {name : "Bauchi" , capital : "Bauchi"} , {name : "Bayelsa" , capital : "Yenegoa"} , 
        {name : "Benue" , capital : "Makurdi"} , {name : "Borno" , capital : "Maiduguri"} , 
        {name : "Cross River" , capital : "Calabar"} , {name : "Delta" , capital : "Asaba"} , 
        {name : "Ebonyi" , capital : "Abakalik"} , {name : "Edo" , capital : "Beniny"} , 
        {name : "Ekiti" , capital : "Ado Ekiti"} , {name : "Enugu" , capital : "Enugu"} , 
        {name : "Gombe" , capital : "Gombe"} , {name : "Imo" , capital : "Owerri"} , 
        {name : "Jigawa" , capital : "Dutse"} , {name : "Kaduna" , capital : "Kaduna"} , 
        {name : "Kano" , capital : "Kano"} , {name : "Katsina" , capital : "Katsina"} , 
        {name : "Kebbi" , capital : "Birnin Kebbi"} , {name : "Kogi" , capital : "Lokoja"} , 
        {name : "Kwara" , capital : "Ilorin"} , {name : "Lagos" , capital : "Ikeja"} , 
        {name : "Nasarawa" , capital : "Lafia"} , {name : "Niger" , capital : "Minna"} , 
        {name : "Ogun" , capital : "Abeokuta"} , {name : "Ondo" , capital : "Akure"} , 
        {name : "Osun" , capital : "Oshogbo"} , {name : "Oyo" , capital : "Ibadan"} , 
        {name : "Plateau" , capital : "Jos"} , {name : "Rivers" , capital : "Port Harcourt"} , 
        {name : "Sokoto" , capital : "Sokoto"} , {name : "Taraba" , capital : "Jalingo"} , 
        {name : "Yobe" , capital : "Damaturu"} , {name : "Zamfara" , capital : "Gusau"} , 
        {name : "FCT" , capital : "Abuja"
    }] ,
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

    handleFocus(e){
        
		if ( e.target.id === "state") { 
            RegistrationModel.nigerianState.map(state => {
                let option = createElement("option") 
                option.value = state.name 
                option.textContent = state.name 
                e.target.append(option) 
            })
        }
    }

    handleSelect(event) {
        if (event.target.id === "state" || event.target.id === "gender") {
            event.target.value = event.target.value 
            RegistrationModel.validFormValue[`${event.target.id}`] = event.target.value 
        }
    }

    handleBlur(event) {
        if (event.target.id === "firstName" || event.target.id === "lastName" || event.target.id === "username" || event.target.id === "dob") { 
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
        } 
        
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

        if (event.target.id === "mobile") {      
            let p = createElement("p")   
            if (validateMobile(event.target.value.trim()).value) {
                event.target.classList.contains("is-invalid") ? event.target.classList.remove("is-invalid") : null 
                event.target.classList.add("is-valid")
                RegistrationModel.validFormValue[`${event.target.id}`] = event.target.value 
            }else { 
                if(event.target.nextElementSibling){
                    event.target.nextElementSibling.remove()
                }
                p.textContent = "Provide a valid mobile number" 
                p.classList.add("invalid-feedback") 
                event.target.classList.add("is-invalid")
                event.target.parentNode.appendChild(p)
            }
            event.target.value = event.target.value 
			event.target.removeEventListener("focus" , this.handleBlur)
        } 

        if (event.target.id === "password") { 
            if ( event.target.parentNode.lastChild.tagName === "P") {
                event.target.parentNode.lastChild.remove()    
            }     
            let p = createElement("p")   
            if (validatePassword(event.target.value).value) {
                p.textContent = "" 
                p.classList.add("valid-feedback") 
                event.target.classList.contains("is-invalid") ? event.target.classList.remove("is-invalid") : null 
                event.target.classList.add("is-valid")
                RegistrationModel.validFormValue[`${event.target.id}`] = event.target.value 
            }else { 
                if(event.target.nextElementSibling){
                    event.target.nextElementSibling.remove()
                }
                p.textContent = "Password too weak" 
                p.classList.add("invalid-feedback") 
                event.target.classList.add("is-invalid")
                event.target.parentNode.appendChild(p)
            }
            event.target.value = event.target.value 
			event.target.removeEventListener("focus" , this.handleBlur)
        }

        if (event.target.id === "cPassword") {      
            let p = createElement("p")   
            if (verifyPassword(selector("#password") , event.target).value) {
                event.target.classList.contains("is-invalid") ? event.target.classList.remove("is-invalid") : null 
                event.target.classList.add("is-valid")
                RegistrationModel.validFormValue[`${event.target.id}`] = event.target.value 
            }else { 
                if(event.target.nextElementSibling){
                    event.target.nextElementSibling.remove()
                }
                p.textContent = "Password does not match" 
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
            if(RegistrationModel.validFormValue.firstName && RegistrationModel.validFormValue.lastName && 
                RegistrationModel.validFormValue.mobile &&
                RegistrationModel.validFormValue.password && RegistrationModel.validFormValue.gender &&
                RegistrationModel.validFormValue.state && RegistrationModel.validFormValue.dob &&
                RegistrationModel.validFormValue.username && RegistrationModel.validFormValue.cPassword ){

                if (selector("#agreement").checked) {
                
                    console.log("Redirecting...")

                }else {
                    event.preventDefault()
                    if ( event.target.previousSibling) {
                        event.target.previousSibling.remove()    
                    } 
                    serverMessage.textContent = "Accept our terms and conditions." 
                    serverMessage.classList.add("err")
                    event.target.parentNode.insertBefore(serverMessage , event.target)
                }
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
