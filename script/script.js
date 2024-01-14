// /////////////
// DATABASE
// /////////////
import realityData from "./database.js"

// /////////////
// LIVES
// /////////////

// VARIABLES
const livesSection = document.querySelector("main > section:first-of-type")
const lives = livesSection.querySelectorAll("img")
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
const levels = document.querySelectorAll("article:last-of-type > section")
let currentRealityLevel = 0
let textArea = levels[currentRealityLevel].querySelector("textarea")
let taskText = realityData[currentRealityLevel].taskText
let currentCharacter = 0

// TASK BEHAVIOUR
const typeText = (event) => {
	if (/^[a-zA-Z]$/.test(event.key)) {
		// If currentCharacter is smaller than taskText.length than there will be more text to type
		if (currentCharacter < taskText.length) {
			// Adds the next character to the existing text
			textArea.value += taskText.charAt(currentCharacter)

			// Increase currentCharacter so that the next iteration of the function can type the next character
			currentCharacter++
		} else if (
			currentCharacter == taskText.length &&
			!realityArticle.classList.contains("hidden")
		) {
			console.log("level complete")
			toFantasy()
		} else {
			// Prevent other keys from triggering default behavior
			event.preventDefault()
		}
	}
}

textArea.addEventListener("keydown", typeText)

// LEVEL VISIBILITY
const generateRandomLevel = () => {
	let randomLevel = Math.floor(Math.random() * levels.length)

	if (randomLevel == currentRealityLevel) {
		return generateRandomLevel() // Try again
	} else {
		currentRealityLevel = randomLevel

		// Update
		textArea = levels[currentRealityLevel].querySelector("textarea")
		taskText = realityData[currentRealityLevel].taskText

		textArea.removeEventListener("keydown", typeText)
		textArea.addEventListener("keydown", typeText)

		console.log(currentRealityLevel)
	}
}

generateRandomLevel()

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

// Reset function for the taskText
const resetText = () => {
	textArea.value = ""
	currentCharacter = 0
}

const resetLevel = () => {
	resetText()
	generateRandomLevel()
	showLevel()
}

// Reset the level when the page is loaded
window.addEventListener("load", () => {
	resetText()
	generateRandomLevel()
	showLevel()
})

// /////////////
// FANTASY - LEVELS
// /////////////

// VARIABLES
const fantasyLevels = document.querySelectorAll(
	"article:first-of-type > section"
)
let currentFantasyLevel = 0
let stars = fantasyLevels[currentFantasyLevel].querySelectorAll("section div")
let text = fantasyLevels[currentFantasyLevel].querySelectorAll("p")

const starSelect = (event) => {
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
	}
}

stars.forEach((a) => {
	a.addEventListener("click", starSelect)
})

const nextLevel = () => {
	if (
		!fantasyLevels[4]
			.querySelector("section:last-of-type")
			.classList.contains("hidden")
	) {
		alert("ya did it!")
	} else {
		currentFantasyLevel++

		stars = fantasyLevels[currentFantasyLevel].querySelectorAll("section div")
		text = fantasyLevels[currentFantasyLevel].querySelectorAll("p")

		showFantasyLevel()

		stars.forEach((a) => {
			a.removeEventListener("click", starSelect)
		})
		stars.forEach((a) => {
			a.addEventListener("click", starSelect)
		})

		console.log(currentFantasyLevel)
	}
}

const showFantasyLevel = () => {
	fantasyLevels.forEach((section, index) => {
		if (index !== currentFantasyLevel) {
			section.classList.add("hidden")
		} else {
			section.classList.remove("hidden")
		}
		text.forEach((a) => {
			a.addEventListener("click", nextLevel)
		})
	})
}

showFantasyLevel()

// /////////////
// TRANSITIONS
// /////////////

// VARIABLES
let fantasyArticle = document.querySelector("article:first-of-type")
let realityArticle = document.querySelector("article:last-of-type")
let footer = document.querySelector("footer")

let duration = Math.random() * 10000 + 5000

const navToReality = () => {
	footer.classList.remove("hidden")
}

const ToReality = () => {
	resetLevel()

	console.log("To Reality")

	livesSection.classList.remove("hidden")
	realityArticle.classList.remove("hidden")
	footer.classList.add("hidden")
	fantasyArticle.classList.add("hidden")

	setTimeout(toFantasy, 30000)
}

footer.addEventListener("click", () => {
	ToReality()
})

const toFantasy = () => {
	checkLives()

	console.log("To Fantasy")

	livesSection.classList.add("hidden")
	realityArticle.classList.add("hidden")
	fantasyArticle.classList.remove("hidden")

	duration = Math.random() * 10000 + 5000
	console.log(duration)
	setTimeout(navToReality, duration)
}
