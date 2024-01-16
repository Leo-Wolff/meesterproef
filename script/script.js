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
// REALITY - COUNTDOWN
// /////////////

// VARIABLES
const countdownTimer = document.querySelector(
	"article:last-of-type > div > div > p"
)

let duration = Math.random() * 10000 + 5000
let countdownDuration = 30

// Function to update the countdown timer
const updateCountdownTimer = () => {
	const seconds = countdownDuration % 60
	const formattedTime = `00:${seconds.toString().padStart(2, "0")}`
	countdownTimer.textContent = formattedTime
}

// Function to start the countdown
const startCountdown = () => {
	const countdownInterval = setInterval(() => {
		countdownDuration--

		if (countdownDuration <= 0) {
			setTimeout(() => {
				clearInterval(countdownInterval)
				toFantasy() // When the countdown reaches zero, transition to the fantasy
			}, 1000)
		}

		updateCountdownTimer()
	}, 1000)
}

const resetCountdown = () => {
	countdownDuration = 30
}

// /////////////
// REALITY - TASKS
// /////////////

// VARIABLES
const tasks = document.querySelectorAll("article:last-of-type > section")
let footer = document.querySelector("footer")
let footerText = footer.querySelector("p")

let textArea = tasks[currentTask].querySelector("textarea")
let taskText = realityData[currentTask].taskText

let currentTask = 0
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
const generateRandomTask = () => {
	let randomTask = Math.floor(Math.random() * tasks.length)

	if (randomTask == currentTask) {
		return generateRandomTask() // Try again
	} else {
		currentTask = randomTask

		// Update variables
		textArea = tasks[currentTask].querySelector("textarea")
		taskText = realityData[currentTask].taskText
		textArea.removeEventListener("keydown", typeText)
		textArea.addEventListener("keydown", typeText)

		console.log("Current task:", currentTask)
	}
}

generateRandomTask()

const showTask = () => {
	tasks.forEach((section, index) => {
		if (index !== currentTask) {
			section.classList.add("hidden")
		} else {
			section.classList.remove("hidden")
		}
	})

	footerText.innerHTML = realityData[currentTask].taskDescription
}

showTask()

// /////////////
// REALITY - RESETS
// /////////////

const resetText = () => {
	textArea.value = ""
	currentCharacter = 0
}

const resetTask = () => {
	resetText()
	generateRandomTask()
	showTask()
}

window.addEventListener("load", () => {
	resetText()
	generateRandomTask()
	showTask()
})

// /////////////
// FANTASY - CHAPTER CARD
// /////////////

// VARIABLES
const chapters = document.querySelectorAll("article:first-of-type > section")
let chapterIntroduction = document.querySelector("article:first-of-type > div")
let stars = chapters[currentChapter].querySelectorAll(
	"section:first-of-type div"
)

let chapterBook = chapters[currentChapter].querySelector("section:last-of-type")
let pages = chapterBook.querySelectorAll("img:not(section > button > img)")
let navButtons = chapterBook.querySelectorAll("button")

let fantasyTimer = false
let currentChapter = 0
let pagesIndex = 0

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

	if (fantasyTimer == false) {
		duration = Math.random() * 10000 + 5000
		console.log("Chapter timer:", duration)
		setTimeout(navToReality, duration)

		fantasyTimer = true
	}
}

// /////////////
// FANTASY - CHAPTERS
// /////////////

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
// FANTASY - BOOKS
// /////////////

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

// /////////////
// TRANSITIONS
// /////////////

// VARIABLES
let fantasyArticle = document.querySelector("article:first-of-type")
let realityArticle = document.querySelector("article:last-of-type")

const navToReality = () => {
	resetTask()

	console.log("Navigation revealed")

	stopAnimation = false
	footer.classList.remove("hidden")

	startDynamicAnimation(fantasyArticle, "shake", 250, 4, 0)
	startDynamicAnimation(footer, "blink", 10000, 1, 2000)
}

const ToReality = () => {
	console.log("To Reality")

	stopAnimation = true
	stopRealityAnimation = false
	stopDynamicAnimation(fantasyArticle, "shake")
	stopDynamicAnimation(footer, "blink")

	startAnimation()

	livesSection.classList.remove("hidden")
	realityArticle.classList.remove("hidden")
	footer.classList.add("hidden")
	fantasyArticle.classList.add("hidden")

	startCountdown()
}

footer.addEventListener("click", () => {
	ToReality()
})

const toFantasy = () => {
	checkLives()

	console.log("To Fantasy")

	stopRealityAnimation = true
	resetCountdown()

	livesSection.classList.add("hidden")
	realityArticle.classList.add("hidden")
	fantasyArticle.classList.remove("hidden")

	duration = Math.random() * 10000 + 10000
	console.log("Chapter timer:", duration)
	setTimeout(navToReality, duration)
}

// /////////////
// ANIMATIONS
// /////////////

// VARIABLES
let stopAnimation = false
let stopRealityAnimation = false
const fantasyMirage = document.querySelector(
	"article:last-of-type > img:first-of-type"
)

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

	if (chapterIntroduction.classList.contains("hidden")) {
		const animate = () => {
			setTimeout(() => {
				element.classList.add(animationName)

				setTimeout(() => {
					element.classList.remove(animationName)
					if (stopAnimation == false) {
						animate()
					}
				}, totalDuration)
			}, totalDelay)

			if (totalDelay == 0 + animationDelay) {
				totalDelay = 16000
			}
			totalDelay = Math.max(totalDelay / 2, 0.1)
		}

		// Start the animation initially
		animate()
	} else if (!chapterIntroduction.classList.contains("hidden")) {
		return
	}
}

const startAnimation = () => {
	let delay = 12000
	const mirage = () => {
		setTimeout(() => {
			fantasyMirage.classList.remove("hidden")

			setTimeout(() => {
				fantasyMirage.classList.add("hidden")

				if (stopRealityAnimation == false) {
					mirage()
				} else {
					fantasyMirage.classList.add("hidden")
				}
			}, 2000)
		}, delay)

		delay = Math.max(delay / 2, 0.1)
	}
	mirage()
}

const stopDynamicAnimation = (element, animationName) => {
	element.classList.remove(animationName)
	console.log(stopAnimation)
}

// Comment to show reality upon load
// livesSection.classList.remove("hidden")
// realityArticle.classList.remove("hidden")
// footer.classList.add("hidden")
// fantasyArticle.classList.add("hidden")
