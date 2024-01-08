// SCROLL TRANSITION
const articles = document.querySelectorAll("article")
let scrollArticles = false

function scrollTransition() {
	if (scrollArticles == false) {
		window.scrollTo({ top: 0, behavior: "smooth" })

		scrollArticles = true

		// // Don't scroll down until a random time between 10-20 seconds
		// const duration = Math.random() * 10000 + 10000
		// console.log(duration)
		// setTimeout(scrollTransition, duration)
	} else {
		// refactor this
		window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })

		scrollArticles = false

		// Don't scroll up until 15 seconds have passed to complete your task
		// setTimeout(scrollTransition, 15000)
	}
}

scrollTransition()

// THIS CODE IS COMPLETELY CHAT.GPT IT WILL BE EDITED TO BE MORE EFFICIENT AND FLEXIBLE
// Get the textarea element
var textarea = document.getElementById("myTextarea")

// Define the text you want to print
var premadeText = "Your premade text here."

// Define a variable to keep track of the current index
var currentIndex = 0

// Add an event listener for any key press
document.addEventListener("keydown", function (event) {
	// Check if the textarea is focused
	if (document.activeElement === textarea) {
		// Check if the pressed key is an alphabetical letter
		if (/^[a-zA-Z]$/.test(event.key)) {
			// Check if there are more letters to print
			if (currentIndex < premadeText.length) {
				// Append the next letter to the textarea content
				textarea.value += premadeText.charAt(currentIndex)
				// Increment the current index for the next key press
				currentIndex++
			}
		} else if (event.key === "Backspace") {
			// Check if there is text to delete
			if (textarea.value.length > 0) {
				// Delete the last character from the textarea content
				textarea.value = textarea.value.slice(0, -1)
				// Decrement the current index to stay in sync with the textarea content
				currentIndex--
			}
			// Prevent the default behavior for Backspace and Delete
			event.preventDefault()
		} else {
			// Prevent other keys from triggering default behavior
			event.preventDefault()
		}
	}
})

// Clear the textarea content and reset the index when the page is loaded
window.addEventListener("load", function () {
	textarea.value = ""
	currentIndex = 0
})
