export let selector = e => document.querySelector(e)  
export let selectAll = e => document.querySelectorAll(e)
export let createElement = e => document.createElement(e) 

/**  
 * Sends a get request to the server
*/ 
export const getData = async (url) => {
	try {
		const data = await fetch(url , {
			method : "GET" , 
			mode : "cors" , 
			cache : "no-cache" , 
			redirect : "follow" , 
			headers : {
				"Accept" : "application/json" , 
				"Content-Type" : "application/json" 
		    } 
		})
	    let parseRes = await data.json() 
	    return parseRes 
	}catch(error) {
		return error 
	} 
}
/**
 * Sends a get request to the server with token 
 */ 
export const getWithToken = async (url , host , userToken) => {
	try {
		const data = await fetch(url , {
			method : "GET" , 
			mode : "cors" , 
			cache : "no-cache" , 
			redirect : "follow" , 
			headers : {
				"Accept" : "application/json" , 
				"Content-Type" : "application/json" , 
				"authorization" : "Bearer" + " " +  userToken , 
				"host" : host
		    } 
		})
	    let parseRes = await data.json() 
	    return parseRes 
	}catch(error) {
		return error 
	}
}
/**Sends a delete request to the server */
let deleteUser = async (url) => {
    try {
        let data = await fetch(url , {
			method : "DELETE" , 
			mode : "same-origin" , 
			cache : "force-cache" , 
			redirect : "follow" , 
			header : {
				"Accept" : "application/json" , 
				"Content-Type" : "application/json" 
			} 
		}) 
		let parseRes = await data.json() 
	    return parseRes 
	}catch(error) {
		return error 
	}
} 
/** Send Data */ 
export const sendData = async (url , data) => {
	try {
		let useData = await fetch(url , {
		method : 'POST' , 
		redirect : "follow" , 
		headers : {
			'Content-Type' : 'application/json'
		} , 
		body : JSON.stringify(data)
	}) 
	let parseRes = await useData.json() 
	return parseRes 
	}catch(error) {
		return error 
	}
}