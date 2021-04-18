let comment = document.querySelector('.comment')
let submit = document.querySelector('.submitCom')
let message = document.createElement('p')
console.log(comment.value.length)
submit.addEventListener('click' , e => {
    if(comment.value.length === 0){
        e.preventDefault()
        message.textContent = 'Please enter a comment'
        message.classList.add('err')
        e.target.parentNode.insertBefore(message , e.target)
    }
})