  let img = document.querySelector('.profile-image')
  function previewFile(file) {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function() {
        
        
            img.src = reader.result
        
    }
}

function handleFiles(files) {
    files = [...files]
    /* files.forEach(uploadFile) */
    files.forEach(previewFile)
/*     if(files.length > 5){
        let gallery = document.getElementById("gallery")
        console.log(gallery) 
        let submit = document.getElementById('submit')
        submit.addEventListener('click' , e => {
            e.preventDefault()
            let para = document.createElement('p')
            para.textContent = "You can not upload more than 5 files at once"
            gallery.appendChild(para)
        })   
    } */
}

/* function uploadFile(file, i) { 
    var url = '/'
    var xhr = new XMLHttpRequest()
    var formData = new FormData()
		
    xhr.open('POST', url, true)

    // Add following event listener
    xhr.upload.addEventListener("progress", e => {
        let percent = (e.loaded / e.total) * 100
        updateProgress(i, percent)
        document.getElementById('completed').textContent = Math.round(percent) + "%"
    })

    xhr.addEventListener("load", e => {
        progressBar.value = 0
        document.getElementById('completed').textContent = ""
    })

    formData.append('file', file)
    xhr.send(formData)
} */

  
  
  
  

  
  