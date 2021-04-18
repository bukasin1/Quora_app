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
        {name : "FCT" , capital : "Abuja"}
    ]
}
class RegistrationView  { 
    constructor() {
        this.select = selector("#state") 
        this.inputs = Array.from(selectAll(".map-form"))
        this.submitButton = selector("#submit") 
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
    
    
    addEvent() {
        this.view.inputs.map(field => {
            field.addEventListener ("focus" ,  this.handleFocus)

        })
    }
} 

const app = new RegistrationController(RegistrationView , RegistrationModel)
