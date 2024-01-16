// /////////////
// DATABASE
// /////////////
import fantasyData from "./fantasy-data.js"
import realityData from "./reality-data.js"

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
let chapterIntroduction = document.querySelector("article:first-of-type > div")
let stars = chapters[currentChapter].querySelectorAll(
	"section:first-of-type div"
)
let chapterBook = chapters[currentChapter].querySelector("section:last-of-type")
let pages = chapterBook.querySelectorAll("img:not(section > button > img)")
let navButtons = chapterBook.querySelectorAll("button")
let pagesIndex = 0

const starSelect = (event) => {
	// Add the "active" class to the clicked star
	event.target.classList.add("active")

	// Check if all stars have the "active" class
	if (Array.from(stars).every((b) => b.classList.contains("active"))) {
		// Iterate over each star and add the "hidden" class
		stars.forEach((star) => {
			star.classList.add("hidden")
		})

		chapterBook.classList.remove("hidden")
	}
}

const nextChapter = () => {
	if (
		!chapters[4]
			.querySelector("section:last-of-type")
			.classList.contains("hidden")
	) {
		alert("ya did it!")
	} else {
		currentChapter++

		pagesIndex = 0
		chapterIntroduction = document.querySelector("article:first-of-type > div")
		stars = chapters[currentChapter].querySelectorAll(
			"section:first-of-type div"
		)
		chapterBook = chapters[currentChapter].querySelector("section:last-of-type")
		pages = chapterBook.querySelectorAll("img:not(section > button > img)")
		navButtons = chapterBook.querySelectorAll("button")

		navButtons[0].removeEventListener("click", previousNav)
		navButtons[1].removeEventListener("click", nextNav)

		navButtons[0].addEventListener("click", previousNav)
		navButtons[1].addEventListener("click", nextNav)

		showChapter()

		stars.forEach((a) => {
			a.removeEventListener("click", starSelect)
		})

		pageNavigation()

		console.log(currentChapter)
	}
}

const updateIntro = () => {
	chapterIntroduction.querySelector(
		"p:first-of-type"
	).innerHTML = `Chapter ${fantasyData[currentChapter].chapterNumber}`
	chapterIntroduction.querySelector("h2").innerHTML =
		fantasyData[currentChapter].chapterTitle
	chapterIntroduction.querySelector("p:last-of-type").innerHTML =
		fantasyData[currentChapter].chapterDescription
}

const introEvent = () => {
	chapterIntroduction.classList.add("hidden")

	stars.forEach((a) => {
		a.addEventListener("click", starSelect)
	})

	duration = Math.random() * 10000 + 5000
	console.log("Chapter timer:", duration)
	setTimeout(navToReality, duration)
}

const pageNavigation = () => {
	pages.forEach((a, index) => {
		if (index !== pagesIndex) {
			a.classList.add("hidden")
		} else {
			a.classList.remove("hidden")
		}
	})

	if (pagesIndex > 0) {
		navButtons[0].classList.remove("hidden")
		navButtons[2].classList.add("hidden")
	} else {
		navButtons[0].classList.add("hidden")
		navButtons[2].classList.add("hidden")
	}

	if (pagesIndex < pages.length - 1) {
		navButtons[1].classList.remove("hidden")
		navButtons[2].classList.add("hidden")
	} else {
		navButtons[1].classList.add("hidden")
		navButtons[2].classList.remove("hidden")
	}
}

const previousNav = () => {
	if (pagesIndex > 0) {
		pagesIndex--

		pageNavigation()
	} else {
		navButtons[0].classList.add("hidden")
		navButtons[1].classList.remove("hidden")
	}
}

navButtons[0].addEventListener("click", previousNav)

const nextNav = () => {
	if (pagesIndex < pages.length - 1) {
		pagesIndex++

		pageNavigation()
	} else {
		navButtons[1].classList.add("hidden")
		navButtons[0].classList.remove("hidden")
	}
}

navButtons[1].addEventListener("click", nextNav)

pageNavigation()

const showChapter = () => {
	// Show current chapter
	chapters.forEach((section, index) => {
		if (index !== currentChapter) {
			section.classList.add("hidden")
		} else {
			section.classList.remove("hidden")
		}
	})

	chapterIntroduction.classList.remove("hidden")

	const chapterButton = chapterIntroduction.querySelector("button")
	chapterButton.removeEventListener("click", introEvent)
	chapterButton.addEventListener("click", introEvent)

	navButtons[2].addEventListener("click", nextChapter)

	updateIntro()
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

	startDynamicAnimation(fantasyArticle, "shake", 250, 4, 0)
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

ToReality()

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

// const startDynamicAnimation = (
// 	element,
// 	animationName,
// 	animationDuration,
// 	iterations,
// 	animationDelay
// ) => {
// 	let totalDelay = 0 + animationDelay
// 	let totalDuration = animationDuration * iterations
// 	element.style.animationDuration = `${animationDuration}ms`

// 	if (chapterIntroduction.classList.contains("hidden")) {
// 		const animate = () => {
// 			setTimeout(() => {
// 				element.classList.add(animationName)

// 				setTimeout(() => {
// 					element.classList.remove(animationName)
// 					animate()
// 				}, totalDuration)
// 			}, totalDelay)

// 			if (totalDelay == 0 + animationDelay) {
// 				totalDelay = 16000
// 			}
// 			totalDelay = Math.max(totalDelay / 2, 0.1)
// 		}

// 		// Start the animation initially
// 		animate()
// 	} else if (!chapterIntroduction.classList.contains("hidden")) {
// 		return
// 	}
// }
