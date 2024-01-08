// THIS CODE IS COMPLETELY CHAT.GPT IT WILL BE EDITED TO BE MORE EFFICIENT AND FLEXIBLE
// SCROLL
let shouldSwitchArticles = true

document.addEventListener("click", function () {
	const articles = document.querySelectorAll("article")

	if (shouldSwitchArticles) {
		// Add the 'hidden' class to fantasyArticle and remove it from realityArticle
		articles[0].classList.add("hidden")
		articles[1].classList.remove("hidden")

		// Scroll to the bottom of the page
		window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })

		console.log("Scrolled")

		// Invert the value of shouldSwitchArticles
		shouldSwitchArticles = !shouldSwitchArticles
	} else {
		// Add the 'hidden' class to fantasyArticle and remove it from realityArticle
		articles[0].classList.remove("hidden")
		articles[1].classList.add("hidden")

		// Scroll to the top of the page
		window.scrollTo({ top: 0, behavior: "smooth" })

		console.log("Not scrolled")

		// Invert the value of shouldSwitchArticles
		shouldSwitchArticles = !shouldSwitchArticles
	}
})

//REALITY LEVEL
// Get the textarea element
var textarea = document.getElementById("myTextarea")

// Define the text you want to print
var premadeText = "Your premade text here."

// Define a variable to keep track of the current index
var currentIndex = 0

// Add an event listener for any key press
document.addEventListener("keydown", function (event) {
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
})

// Clear the textarea content and reset the index when the page is loaded
window.addEventListener("load", function () {
	textarea.value = ""
	currentIndex = 0
})
