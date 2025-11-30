const input = document.getElementById("input");
const button = document.getElementById("button");
const resultDiv = document.getElementById("result");

function reverseString(str) {
  return str.split("").reverse().join("");
}

function check() {
  const value = input.value.trim();

  if (value === "") {
    resultDiv.textContent = "Please enter a word or phrase";
    resultDiv.className = "value not-palindrome";
    return;
  }

  // Clean the string: remove spaces, punctuation, and convert to lowercase
  const cleanStr = value.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const reverse = reverseString(cleanStr);

  if (cleanStr === reverse) {
    resultDiv.innerHTML = `<span style="font-size: 2rem;">✓</span> PALINDROME!`;
    resultDiv.className = "value palindrome";
  } else {
    resultDiv.innerHTML = `<span style="font-size: 2rem;">✗</span> NOT A PALINDROME`;
    resultDiv.className = "value not-palindrome";
  }

  input.value = "";
}

function fillExample(text) {
  input.value = text;
}

// Allow checking by pressing Enter key
input.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    check();
  }
});

button.addEventListener("click", check);
