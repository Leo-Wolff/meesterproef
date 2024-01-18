// /////////////
// DATABASE
// /////////////
import fantasyData from "./fantasy-data.js"
import realityData from "./reality-data.js"

// /////////////
// LIVES
// /////////////

// VARIABLES
const lives = document.querySelectorAll("article:last-of-type > div > section")
let currentLife = 3

const checkLives = () => {
	// Make sure that when the page loads the user doesn't instantly lose a life
	if (textArea.value.length == 0) {
	}
	// If the user does not complete the level by typing all the text, they lose a life
	else if (textArea.value.length != taskText.length) {
		lives[currentLife].classList.remove("hidden")

		currentLife++
	}

	if (currentLife == 5) {
		setTimeout(() => {
			// arm
			document
				.querySelector("article:last-of-type > img:last-of-type")
				.classList.remove("hidden")

			// clutter
			document.querySelector("article:last-of-type > div").classList.add("lost")

			// task
			tasks[currentTask].classList.add("lost")
		}, 1000)
	}

	console.log("currentLife", currentLife)
}

// /////////////
// REALITY - COUNTDOWN
// /////////////

// VARIABLES
const countdownTimer = document.querySelector(
	"article:last-of-type > div > section:first-of-type > div p"
)
const countdownAudio = new Audio("audio/timer.mp3")
countdownAudio.volume = 0.75

let duration = Math.random() * 10000 + 5000
let countdownDuration = 30

// Function to update the countdown timer
const updateCountdownTimer = () => {
	const seconds = countdownDuration % 60
	const formattedTime = `00:${seconds.toString().padStart(2, "0")}`
	countdownTimer.textContent = formattedTime

	countdownAudio.play()
}

// Function to start the countdown
const startCountdown = () => {
	const countdownInterval = setInterval(() => {
		countdownDuration--

		if (countdownDuration <= 0 && currentLife != 4) {
			clearInterval(countdownInterval)

			console.log("not 4")

			toFantasy() // When the countdown reaches zero, transition to the fantasy
		} else if (
			countdownDuration <= 0 &&
			currentLife == 4 &&
			textArea.value.length == taskText.length
		) {
			console.log("life still there")
			clearInterval(countdownInterval)

			toFantasy() // When the countdown reaches zero, transition to the fantasy
		} else if (
			countdownDuration <= 0 &&
			currentLife == 4 &&
			textArea.value.length != taskText.length
		) {
			console.log("game lost")
			stopRealityAnimation = true

			checkLives()

			clearInterval(countdownInterval)
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
let currentTask = 0
let currentCharacter = 0

const tasks = document.querySelectorAll("article:last-of-type > section")
let footer = document.querySelector("footer")
let footerText = footer.querySelector("p")

let textArea = tasks[currentTask].querySelector("textarea")
let taskText = realityData[currentTask].taskText

const writeAudio = new Audio("audio/write.mp3")
let audioRepeat = []

// TASK BEHAVIOUR
const writeSoundEffect = () => {
	writeAudio.play()
	audioRepeat.push(writeAudio)

	writeAudio.addEventListener("ended", () => {
		const audioIndex = audioRepeat.indexOf(writeAudio)

		if (audioIndex !== 1) {
			audioRepeat.splice(index, 1)
		}
	})
}

const typeText = (event) => {
	if (/^[a-zA-Z]$/.test(event.key)) {
		// If currentCharacter is smaller than taskText.length than there will be more text to type
		if (currentCharacter < taskText.length) {
			// Adds the next character to the existing text
			textArea.value += taskText.charAt(currentCharacter)

			// Increase currentCharacter so that the next iteration of the function can type the next character
			currentCharacter++

			writeSoundEffect()
		} else if (
			currentCharacter == taskText.length &&
			!realityArticle.classList.contains("hidden")
		) {
			console.log("Task complete")
			countdownDuration = 0
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
let fantasyTimer = false
let currentChapter = 0
let pagesIndex = 0

const chapters = document.querySelectorAll("article:first-of-type > section")
let chapterCard = document.querySelector("article:first-of-type > div")
let stars = chapters[currentChapter].querySelectorAll(
	"section:first-of-type div"
)

let chapterBook = chapters[currentChapter].querySelector("section:last-of-type")
let pages = chapterBook.querySelectorAll("img:not(section > button > img)")
let navButtons = chapterBook.querySelectorAll("button")

const fantasyAudioBG = new Audio("audio/fantasy-bg.mp3")

const updateIntro = () => {
	chapterCard.querySelector(
		"p:first-of-type"
	).innerHTML = `Chapter ${fantasyData[currentChapter].chapterNumber}`
	chapterCard.querySelector("h2").innerHTML =
		fantasyData[currentChapter].chapterTitle
	chapterCard.querySelector("p:last-of-type").innerHTML =
		fantasyData[currentChapter].chapterDescription
}

const introEvent = () => {
	chapterCard.classList.add("hidden")

	stars.forEach((a) => {
		a.addEventListener("click", starSelect)
	})

	if (fantasyTimer == false) {
		duration = Math.random() * 10000 + 5000
		console.log("Chapter timer:", duration)
		setTimeout(navToReality, duration)

		fantasyTimer = true

		// background music
		fantasyAudioBG.volume = 0.1
		fantasyAudioBG.loop = true

		fantasyAudioBG.play()
	}

	const chapterStarted = new Audio("audio/star-selected.mp3")
	chapterStarted.volume = 0.75

	chapterStarted.play()
}

// /////////////
// FANTASY - CHAPTERS
// /////////////

const starSelect = (event) => {
	const audioSelected = new Audio("audio/star-selected.mp3")
	audioSelected.volume = 0.5

	audioSelected.play()

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
		chapterCard = document.querySelector("article:first-of-type > div")
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

	chapterCard.classList.remove("hidden")

	const chapterButton = chapterCard.querySelector("button")
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

const realityBG = new Audio("audio/reality-bg.mp3")
realityBG.loop = true
realityBG.volume = 0.1

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

	realityArticle.classList.remove("hidden")
	footer.classList.add("hidden")
	fantasyArticle.classList.add("hidden")

	textArea.focus()

	startCountdown()

	realityBG.currentTime
	realityBG.play()

	fantasyAudioBG.pause()
}

footer.addEventListener("click", () => {
	ToReality()
})

const toFantasy = () => {
	console.log("To Fantasy")

	checkLives()

	stopRealityAnimation = true
	resetCountdown()

	realityArticle.classList.add("hidden")
	fantasyArticle.classList.remove("hidden")

	duration = Math.random() * 10000 + 10000
	console.log("Chapter timer:", duration)
	setTimeout(navToReality, duration)

	fantasyAudioBG.currentTime
	fantasyAudioBG.play()

	realityBG.pause()
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

	if (chapterCard.classList.contains("hidden")) {
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
	} else if (!chapterCard.classList.contains("hidden")) {
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
}

const lamp = lives[0].querySelector("img:last-of-type")
const moon = document.querySelector("article:first-of-type > img:first-of-type")
const fantasyBG = document.querySelector(
	"article:first-of-type > img:last-of-type"
)

const loadAnimation = (
	element,
	folderName,
	fileName,
	numberCode,
	currentFrame
) => {
	const frameSRC = `animations/${folderName}/${fileName}${currentFrame
		.toString()
		.padStart(numberCode, "0")}.png`

	element.src = frameSRC
}

const playAnimation = (
	element,
	folderName,
	fileName,
	allFrames,
	numberAmount
) => {
	let currentFrame = 0
	const numberCode = numberAmount
	const totalFrames = allFrames

	setInterval(() => {
		loadAnimation(element, folderName, fileName, numberCode, currentFrame)

		// Increment the current frame number
		currentFrame++

		// Stop the animation when all frames are loaded
		if (currentFrame > totalFrames) {
			currentFrame = 0
		}
	}, 1) // Change the interval (in milliseconds) based on your animation speed
}

playAnimation(lamp, "lamp", "lamp-glow", 380, 3)
playAnimation(moon, "moon", "moon-swivel", 599, 3)
playAnimation(fantasyBG, "fantasy-bg", "sky-animated", 1199, 4)

// Uncomment to show reality upon load
// realityArticle.classList.remove("hidden")
// footer.classList.add("hidden")
// fantasyArticle.classList.add("hidden")
