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
const tasks = document.querySelectorAll("article:last-of-type > section")
let footer = document.querySelector("footer")
let footerText = footer.querySelector("p")
let currentTask = 0
let currentCharacter = 0
let textArea = tasks[currentTask].querySelector("textarea")
let taskText = realityData[currentTask].taskText

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
			console.log("Task complete")
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
	let randomLevel = Math.floor(Math.random() * tasks.length)

	if (randomLevel == currentTask) {
		return generateRandomLevel() // Try again
	} else {
		currentTask = randomLevel

		// Update
		textArea = tasks[currentTask].querySelector("textarea")
		taskText = realityData[currentTask].taskText
		textArea.removeEventListener("keydown", typeText)
		textArea.addEventListener("keydown", typeText)

		console.log("Current task:", currentTask)
	}
}

generateRandomLevel()

const showLevel = () => {
	tasks.forEach((section, index) => {
		if (index !== currentTask) {
			section.classList.add("hidden")
		} else {
			section.classList.remove("hidden")
		}
	})

	footerText.innerHTML = realityData[currentTask].taskDescription
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
const chapters = document.querySelectorAll("article:first-of-type > section")
let currentChapter = 0
let chapterIntroduction = chapters[currentChapter].querySelector(
	"section:first-of-type"
)
let stars = chapters[currentChapter].querySelectorAll(
	"section:nth-of-type(2) div"
)
let chapterText = chapters[currentChapter].querySelectorAll(
	"section:last-of-type p"
)

const starSelect = (event) => {
	// Add the "active" class to the clicked star
	event.target.classList.add("active")

	// Check if all stars have the "active" class
	if (Array.from(stars).every((b) => b.classList.contains("active"))) {
		// Iterate over each star and add the "hidden" class
		stars.forEach((star) => {
			star.classList.add("hidden")
		})

		chapters[currentChapter]
			.querySelector("section:last-of-type")
			.classList.remove("hidden")
		// // Iterate over each paragraph in chapterText and remove the "hidden" class
		// chapterText.forEach((paragraph) => {
		// 	paragraph.classList.remove("hidden")
		// })
	}
}

stars.forEach((a) => {
	a.addEventListener("click", starSelect)
})

const nextChapter = () => {
	if (
		!chapters[4]
			.querySelector("section:last-of-type")
			.classList.contains("hidden")
	) {
		alert("ya did it!")
	} else {
		currentChapter++

		chapterIntroduction = chapters[currentChapter].querySelector(
			"section:first-of-type"
		)
		stars = chapters[currentChapter].querySelectorAll(
			"section:nth-of-type(2) div"
		)
		chapterText = chapters[currentChapter].querySelectorAll(
			"section:last-of-type p"
		)

		showChapter()

		stars.forEach((a) => {
			a.removeEventListener("click", starSelect)
		})
		stars.forEach((a) => {
			a.addEventListener("click", starSelect)
		})

		console.log(currentChapter)
	}
}

const showChapter = () => {
	chapters.forEach((section, index) => {
		if (index !== currentChapter) {
			section.classList.add("hidden")
		} else {
			section.classList.remove("hidden")
		}

		chapterIntroduction.classList.remove("hidden")

		chapterIntroduction
			.querySelector("button")
			.addEventListener("click", () => {
				chapterIntroduction.classList.add("hidden")

				duration = Math.random() * 10000 + 5000
				console.log("Chapter timer:", duration)
				setTimeout(navToReality, duration)
			})
		chapterText.forEach((a) => {
			a.addEventListener("click", nextChapter)
		})
	})
}

showChapter()

// /////////////
// TRANSITIONS
// /////////////

// VARIABLES
let fantasyArticle = document.querySelector("article:first-of-type")
let realityArticle = document.querySelector("article:last-of-type")
let duration = Math.random() * 10000 + 5000

const navToReality = () => {
	resetLevel()

	console.log("Navigation revealed")

	footer.classList.remove("hidden")

	startDynamicAnimation(fantasyArticle, "shake", 500, 4, 0)
	startDynamicAnimation(footer, "blink", 10000, 1, 2000)
}

const ToReality = () => {
	console.log("To Reality")

	livesSection.classList.remove("hidden")
	realityArticle.classList.remove("hidden")
	footer.classList.add("hidden")
	fantasyArticle.classList.add("hidden")

	setTimeout(toFantasy, 3000)
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
}

// /////////////
// ANIMATION
// /////////////

const startDynamicAnimation = (
	element,
	animationName,
	animationDuration,
	iterations,
	animationDelay
) => {
	let totalDelay = 0 + animationDelay
	let totalDuration = animationDuration * iterations
	element.style.animationDuration = `${animationDuration}ms`

	const animate = () => {
		setTimeout(() => {
			element.classList.add(animationName)

			setTimeout(() => {
				element.classList.remove(animationName)
				animate()
			}, totalDuration)
		}, totalDelay)

		if (totalDelay == 0 + animationDelay) {
			totalDelay = 16000
		}
		totalDelay = Math.max(totalDelay / 2, 0.1)
	}

	// Start the animation initially
	animate()
}
