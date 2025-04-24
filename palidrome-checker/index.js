const input = document.getElementById("input");
const button = document.getElementById("button");
const divValue = document.querySelector("value")

function reverseString(str) {
   return str.split("").reverse().join("")
}

function check() {
    const value = input.value
    const reverse = reverseString(value)

    if (value == reverse) {
        divValue.innerHTML = "P A L I D R O M E"
    } else {
        divValue.innerHTML = "NOT A PALIDROME, TRY AGAIN"
    }

    input.value = ""
}

button.addEventListener("click", check)