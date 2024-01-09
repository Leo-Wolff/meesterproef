// /////////////
// DATABASE
// /////////////
import realityData from "./database.js"
// console.log(realityData)

// /////////////
// LIVES
// /////////////

// VARIABLES
const lives = document.querySelectorAll("main > section:first-of-type img")
let currentLife = 0

const checkLives = () => {
	// Make sure that when the page loads the user doesn't instantly lose a life
	if (textArea.value.length == 0) {
	}
	// If the user does not complete the level by typing all the text, they lose a life
	else if (textArea.value.length != taskText.length) {
		lives[currentLife].src = "img/life-lost.svg"

		currentLife++
	}
}

// /////////////
// REALITY - LEVELS
// /////////////

// VARIABLES
let currentRealityLevel = 0
const levels = document.querySelectorAll("article:last-of-type > section")
const textArea = levels[currentRealityLevel].querySelector("textarea")
const taskText = realityData[currentRealityLevel].taskText
let currentCharacter = 0

// console.log(textArea)
// console.log(taskText)
// console.log(currentRealityLevel)

// LEVEL VISIBILITY
const showLevel = () => {
	levels.forEach((section, index) => {
		if (index !== currentRealityLevel) {
			section.classList.add("hidden")
		} else {
			section.classList.remove("hidden")
		}
	})
}

showLevel()

const generateRandomLevel = () => {
	let randomLevel = Math.floor(Math.random() * levels.length)

	if (randomLevel == currentRealityLevel) {
		return generateRandomLevel() // Try again
	} else {
		currentRealityLevel = randomLevel
	}

	console.log(currentRealityLevel)
}

// TASK BEHAVIOUR
textArea.addEventListener("keydown", (event) => {
	if (/^[a-zA-Z]$/.test(event.key)) {
		// If currentCharacter is smaller than taskText.length than there will be more text to type
		if (currentCharacter < taskText.length) {
			// Adds the next character to the existing text
			textArea.value += taskText.charAt(currentCharacter)

			// Increase currentCharacter so that the next iteration of the function can type the next character
			currentCharacter++
		} else if (currentCharacter == taskText.length) {
			scrollArticles = false

			generateRandomLevel()
			showLevel()

			// Reset text area and go back to fantasy
			resetText()
			scrollTransition()
		}
	} else {
		// Prevent other keys from triggering default behavior
		event.preventDefault()
	}
})

// Reset function for the whole level
const resetText = () => {
	textArea.value = ""
	currentCharacter = 0
}

// Reset the level when the page is loaded
window.addEventListener("load", () => {
	resetText()
	currentRealityLevel = 0
})

// /////////////
// FANTASY - LEVELS
// /////////////

// VARIABLES
const fantasyLevels = document.querySelectorAll("article:first-of-type section")
let currentFantasyLevel = 0
const stars = fantasyLevels[currentFantasyLevel].querySelectorAll("section div")

stars.forEach((a) => {
	a.addEventListener("click", (event) => {
		// Add the "active" class to the clicked star
		event.target.classList.add("active")

		// Check if all stars have the "active" class
		if (Array.from(stars).every((b) => b.classList.contains("active"))) {
			fantasyLevels[currentFantasyLevel]
				.querySelector("section:first-of-type")
				.classList.add("hidden")
			fantasyLevels[currentFantasyLevel]
				.querySelector("section:last-of-type")
				.classList.remove("hidden")

			currentFantasyLevel++
		}
	})
})

// /////////////
// SCROLL TRANSITION
// /////////////

// VARIABLES
let scrollArticles = false

const scrollTransition = () => {
	if (scrollArticles == false) {
		window.scrollTo({ top: 0, behavior: "smooth" })

		scrollArticles = true

		checkLives()

		// Don't scroll down until a random time between 10-20 seconds
		const duration = Math.random() * 1000 + 1000
		console.log(duration)
		setTimeout(scrollTransition, duration)
	} else {
		window.scrollTo({
			top: document.body.scrollHeight,
			behavior: "smooth",
		})

		scrollArticles = false

		resetText()

		// Don't scroll up until 15 seconds have passed to complete your task
		setTimeout(scrollTransition, 15000)
	}
}

scrollTransition()
