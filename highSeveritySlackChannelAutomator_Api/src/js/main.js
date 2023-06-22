//% -------------------------------------------------------------------------- //
//%                     Slack Channel Automator- extension                     //
//%                     For Firefox & Chrome - by: jjansena@                   //
//% -------------------------------------------------------------------------- //

//# -------------------------------------------------------------------------- //
//#                           Import/require modules                           //
//# -------------------------------------------------------------------------- //

import axios from 'axios'
import HttpsProxyAgent from 'https-proxy-agent/dist/agent.js'
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import makeAnimated from 'react-select/animated'

//# -------------------------------------------------------------------------- //
//#                              Global Scope                                  //
//# -------------------------------------------------------------------------- //

// Global Variables
let userAliases = [] // Active users who have commented on SIM ticket
let uniqueAliases = [] // Duplicate aliases removed sortet ascending
let selectionAliases = [] // User selected aliases
let currentUser // Alias of engineer logged in
let payloadToSend // JSON payload to send to S3
let parsedTicketId // Ticket ID from URL parsed from t.corp
let ticketTitle // Title of the ticket
let title // Title Placeholder
let popupClicked // Boolean to check if popup was clicked

// Global Functions/Events
const inputEvent = new InputEvent('input')
const agent = new HttpsProxyAgent(URL)
const updateTab =
	typeof chrome !== 'undefined'
		? chrome.tabs.update.bind(chrome.tabs)
		: browser.tabs.update.bind(browser.tabs)
const queryTabs =
	typeof chrome !== 'undefined'
		? chrome.tabs.query.bind(chrome.tabs)
		: browser.tabs.query.bind(browser.tabs)
const getStorage = window.chrome
	? chrome.storage.local.get.bind(chrome.storage.local)
	: browser.storage.local.get.bind(browser.storage.local)
const removeStorage = window.chrome
	? chrome.storage.local.remove.bind(chrome.storage.local)
	: browser.storage.local.remove.bind(browser.storage.local)
const setStorage = window.chrome
	? chrome.storage.local.set.bind(chrome.storage.local)
	: browser.storage.local.set.bind(browser.storage.local)
const createWindow = window.chrome
	? chrome.windows.create.bind(chrome.windows)
	: browser.windows.create.bind(browser.windows)

//# ---------------------------- Button Constants --------------------------- //

// React ticket select dropdown
const rootElement = document.getElementById('foundTicketsPlaceholder')

// Main page buttons
const modalEditButtonToConfirmModal = document.getElementById(
	'modalEditButtonToConfirmModal'
)
const openPopup = document.getElementById('openPopup')

// Modal Edit main buttons
const modalEditButtonClose = document.getElementById('modalEditButtonClose')
const buttonAddTicketNumber = document.getElementById('buttonAddTicketNumber')
const buttonAddTicketDescription = document.getElementById(
	'buttonAddTicketDescription'
)

// Modal confirm buttons
const modalConfirmButtonBack = document.getElementById('modalConfirmButtonBack')
const modalConfirmButtonSubmitChannel = document.getElementById(
	'modalConfirmButtonSubmitChannel'
)
const modalConfirmButtonClose = document.getElementById(
	'modalConfirmButtonClose'
)

//# ----------------------------- Global Function ---------------------------- //

window.onload = () => {
	popupClicked = false

	async function global() {
		console.log('Program loading...')

		resizeWindow()

		let testTitle = await getActiveTabTitle()

		while (testTitle === 'SIM Ticketing') {
			return global()
		}

		if (typeof getStorage !== 'undefined') {
			getStorage('popupClicked', function (result) {
				popupClicked = result.popupClicked
				console.log(`Popup State:`, popupClicked)
			})
		} else {
			console.error('getStorage is not available!')
		}

		currentUser = await getCurrentUser()
		renderTheme()

		async function setValueSerialized(key, value) {
			localStorage.setItem(key, JSON.stringify(value))
		}

		//# -------------------------------------------------------------------------- //
		//#                          Button onClick Functions                          //
		//# -------------------------------------------------------------------------- //

		//? ------------------- Handle Manually Entered Ticket Id ------------------ //

		const userTicketPrompt = document.getElementById(
			'userTicketPromptInput'
		)
		const userTicketPromptButton = document.getElementById(
			'userTicketPromptButton'
		)
		let userTicketPromptValue

		//? ------------------------ Open/Close Ticket Select Modal ----------------------- //

		const closeTicketSelectModal = document.getElementById(
			'closeSelectTicketModal'
		)

		closeTicketSelectModal.onclick = () => {
			$('#selectTicketTitleButtonModal').modal('hide')
		}

		//? ----------------------- Ticket Prompt Button ----------------------- //'

		userTicketPrompt.addEventListener('input', () => {
			userTicketPromptValue = userTicketPrompt.value
		})

		userTicketPromptButton.onclick = async () => {
			console.log(`userTicketPromptButton clicked`)
			console.log(`userTicketPromptValue: ${userTicketPromptValue}`)
			handleUserTicketPrompt()
		}

		async function handleUserTicketPrompt() {
			// In background tab, open the new url
			updateTab({
				url: `https://t.corp.amazon.com/${userTicketPromptValue}/communication`,
			})

			// Open a new tab with the url and switch to it
			window.open(
				`https://t.corp.amazon.com/${userTicketPromptValue}/communication`
			)

			setTimeout(() => {
				$('#ModalMismatchedURL').modal('hide')
			}, 1000)

			window.close()
		}

		//? ----------------------- Modal Confirm BackButton ----------------------- //

		modalConfirmButtonBack.onclick = () => {
			console.log(`Back button clicked`)

			$('#modalConfirm').modal('hide')
			$('#modalEdit').modal('show')
		}

		//? ------------------------ Add Ticket Number Button ------------------------ //

		buttonAddTicketNumber.onclick = () => {
			console.log('On Button Click returned url: ', parsedTicketId)

			document.getElementById('ticketInputPrompt').value = parsedTicketId
			document.getElementById('ticketId').innerText = parsedTicketId

			document.getElementById('ticketInputPrompt').classList.add('active')
			buttonAddTicketNumber.dispatchEvent(inputEvent)
		}

		//? ----------------------- Parse Ticket Title Button ---------------------- //

		buttonAddTicketDescription.onclick = () => {
			console.log(`Ticket ID to remove: ${parsedTicketId}`)

			title = ticketTitle

			// Remove anything matching (parsedTicketId) from the title
			title = title.replace(`(${parsedTicketId})`, '')

			// Initialize the extractedCodes and extractedAirports arrays
			let extractedCodes = []
			let extractedAirports = []

			// Get an array of all the airport codes from the regionMap array
			const airportCodes = regionMap.map((obj) => obj.airport)

			// Check for airport codes enclosed in brackets in the title
			const regex = /\[\b([A-Za-z]{3})\b\]/g
			let matches = title.match(regex)

			// Check for region codes in the title
			const regexRegion = /\b[a-z]{2}(-gov|-iso)?-[a-z]+-[0-9]\b/gi
			const matchesRegion = title.match(regexRegion)

			if (matches) {
				// replace [ or ] in matches
				matches = matches.map((match) =>
					match.replace('[', '').replace(']', '')
				)

				console.log(`Matches found in brackets: ${matches}`)

				handleMatches(matches, extractedCodes, extractedAirports)
			} else {
				console.log('No airports found in brackets, checking title...')

				const regex = /\b[a-zA-Z]{3}\b/g
				const matches = title.match(regex)

				if (matches) {
					handleMatches(matches, extractedCodes, extractedAirports)
				}
			}

			function handleMatches(matches, extractedCodes, extractedAirports) {
				matches.forEach((match) => {
					const matchIndex = airportCodes.indexOf(match)
					if (matchIndex !== -1) {
						const extractedCode = regionMap[matchIndex].code
						const extractedAirport = regionMap[matchIndex].airport

						// Region Codes
						if (!extractedCodes.includes(extractedCode)) {
							extractedCodes.push(extractedCode)
						}

						// Airports
						if (!extractedAirports.includes(extractedAirport)) {
							extractedAirports.push(extractedAirport)
						}

						title = title
							.replace(`[${match}]`, ' ')
							.replace(match, ' ')
					}
				})

				if (matchesRegion) {
					handleRegionMatches(matchesRegion)
				}

				function handleRegionMatches(matches) {
					console.log('Handling region matches...')

					matches.forEach((match) => {
						title = title.replace(match, ' ')

						// Find the corresponding airport code for the matched region
						const regionIndex = regionMap.findIndex(
							(obj) =>
								obj.code.toLowerCase() === match.toLowerCase()
						)

						if (regionIndex !== -1) {
							const correspondingAirport =
								regionMap[regionIndex].airport

							// Add region code to extractedCodes if not present
							if (
								!extractedCodes.includes(
									regionMap[regionIndex].code
								)
							) {
								extractedCodes.push(regionMap[regionIndex].code)
							}

							// Add corresponding airport code to extractedAirports if not present
							if (
								!extractedAirports.includes(
									correspondingAirport
								)
							) {
								extractedAirports.push(correspondingAirport)
							}
						}
					})
				}
			}

			console.log(`Converting Title: ${title}`)

			document.getElementById('channelDetailsPrompt').value =
				convertTitleToChannel(title)
			document
				.getElementById('channelDetailsPrompt')
				.dispatchEvent(new Event('input'))

			if (extractedAirports.length > 0) {
				document.getElementById('airportCodePrompt').value =
					extractedAirports.join(' ')
				document
					.getElementById('airportCodePrompt')
					.dispatchEvent(new Event('input'))
			}

			if (extractedCodes.length > 0) {
				document.getElementById('regionInputPrompt').value =
					extractedCodes.join(' ')
				document
					.getElementById('regionInputPrompt')
					.dispatchEvent(new Event('input'))
			}
		}

		//? ----------------------- Light/Dark Toggle Switch ----------------------- //

		document.querySelector('#css-toggle-btn').onclick = () => {
			darkmode.toggleDarkMode()
		}

		//? ---------------------------- Popup Button ---------------------------- //

		console.log('Button:', document.getElementById('openPopup'))

		openPopup.addEventListener('click', async function () {
			console.log(`pop-up clicked`)

			setStorage({ popupClicked: true })
			createWindow({
				type: 'popup',
				// Change below url for webhook vs API
				url: '../highSeveritySlackChannelAutomator_Api.ChangeThis.html',
				width: 400,
				height: 620,
			})

			setTimeout(() => {
				window.close()
			}, 700)
		})

		//? ---------------------- ModalEditMainWindow Button ---------------------- //

		const channelNamePreview = document.querySelector('#channelNamePreview')
		const count = document.querySelector('#characterCount')
		let modalEditElements, formValues

		// Listener for window resize
		document
			.getElementById('modalEditMainWindowButton')
			.addEventListener('click', () => {
				document.getElementById('canvas').style.height = '546px'
				document.getElementById('canvas').style.width = '595px'
				window.resizeTo(560, 680)

				waitForUsers()
				setTimeout(() => {
					displayChannelPreview()
				}, 1000)
			})

		// Listeners for channel name preview
		modalEditElements = document.querySelectorAll(
			`
			#ticketInputPrompt,
			#airportCodePrompt,
			#regionInputPrompt,
			#channelDetailsPrompt,
			#buttonAddTicketNumber,
			#iconTicketId,#iconRegion,
			#iconSlackDetail,
			#iconAirportCode,
			#buttonAddTicketDescription
			`
		)

		modalEditElements.forEach(function (element) {
			element.addEventListener('input', displayChannelPreview)
		})

		async function displayChannelPreview() {
			formValues = await constructChannelName()
			const characterLength = formValues.length
			channelNamePreview.value = formValues

			checkAllValues(characterLength)

			// Character count monitor
			// Disables save button over slack channel limit of 80 characters
			function countCharacters() {
				count.innerHTML = `${characterLength}/80`

				if (characterLength > 80) {
					console.log('Character limit reached')
					count.style = 'color: #dc143c'
					modalEditButtonToConfirmModal.classList.add('disabled')
				}

				if (characterLength === 0) {
					channelNamePreview.classList.remove('active')
				}

				if (characterLength > 0) {
					channelNamePreview.classList.add('active')
					storeInput()
				}

				if (characterLength < 80) {
					count.style = 'color: #39c0ed'
					modalEditButtonToConfirmModal.classList.remove('disabled')
				}
			}

			function increaseHeightOnInput() {
				let inputElement = document.getElementById('channelNamePreview')
				let lineCharLength = 61

				if (inputElement.value.length >= lineCharLength) {
					let lineLength = Math.ceil(
						inputElement.value.length / lineCharLength
					)
					inputElement.style.height = lineLength * 90 + 'px'
				} else if (inputElement.value.length < lineCharLength) {
					inputElement.style.height = 40 + 'px'
				}
			}

			countCharacters()
			increaseHeightOnInput()
			return characterLength
		}

		//? ------------------- modalConfirm CreateChannel Button ------------------ //

		document
			.getElementById('modalEditButtonToConfirmModal')
			.addEventListener('click', function confirmEntries() {
				if (notesInput()) {
					document.getElementById('canvas').style.height = 'auto'
					document.getElementById('canvas').style.width = '520px'
					window.resizeTo(550, 546)
				}

				document.getElementById('canvas').style.height = 'auto'
				document.getElementById('canvas').style.width = '520px'
				window.resizeTo(550, 468)
			})

		//? ----------------------- Close modalConfirm Button ---------------------- //

		modalConfirmButtonClose.addEventListener('click', () => {
			const modalConfirmAlert =
				document.querySelector('#modalConfirmAlert')
			const checkClass = modalConfirmAlert.getAttribute('class')
			const modalConfirmCloseFinalCloseButton = document.querySelector(
				'#modalConfirmCloseFinalCloseButton'
			)
			const modalConfirmCloseFinalSaveButton = document.querySelector(
				'#modalConfirmCloseFinalSaveButton'
			)

			if (
				checkClass ===
				'alert alert-success d-flex fade show justify-content-between'
			) {
				$('#modalConfirmCloseFinal').modal('show')

				modalConfirmCloseFinalCloseButton.onclick = () => {
					for (const [key] of Object.entries(localStorage)) {
						if (key !== 'popupClicked') {
							localStorage.removeItem(key)
						}
					}
					noValueDots()
					window.close()
				}

				modalConfirmCloseFinalSaveButton.onclick = () => {
					location.reload()
				}
			} else {
				$('#modalConfirm').modal('hide')
				setTimeout(() => {
					resizeWindow()
				}, 200)
			}
		})

		//? --------------------- Functions For Eraser Buttons --------------------- //

		const iconTicketId = document.getElementById('iconTicketId')
		const iconAirportCode = document.getElementById('iconAirportCode')
		const iconRegion = document.getElementById('iconRegion')
		const iconSlackDetail = document.getElementById('iconSlackDetail')
		const iconNotes = document.getElementById('iconNotes')

		function clickAllIcons() {
			iconTicketId.click()
			iconAirportCode.click()
			iconRegion.click()
			iconSlackDetail.click()
			iconNotes.click()
		}

		iconTicketId.onclick = () => {
			let ticketId = document.getElementById('ticketInputPrompt'),
				ticketIdText = document.getElementById('ticketId')

			ticketId.value = ''
			ticketIdText.textContent = '...'
			iconTicketId.dispatchEvent(inputEvent)

			ticketId.dispatchEvent(new Event('blur'))
		}

		iconAirportCode.onclick = () => {
			let airportCode = document.getElementById('airportCodePrompt'),
				airportCodeText = document.getElementById('airportCode')

			airportCode.value = ''
			airportCodeText.textContent = '...'
			iconAirportCode.dispatchEvent(inputEvent)

			airportCode.dispatchEvent(new Event('blur'))
		}

		iconRegion.onclick = () => {
			let regionCode = document.getElementById('regionInputPrompt'),
				regionCodeText = document.getElementById('regionCode')

			regionCode.value = ''
			regionCodeText.textContent = '...'
			iconRegion.dispatchEvent(inputEvent)

			regionCode.dispatchEvent(new Event('blur'))
		}

		iconSlackDetail.onclick = () => {
			let slackChannelDetails = document.getElementById(
				'channelDetailsPrompt'
			)
			let slackChannelDetailsText =
				document.getElementById('channelDetails')

			slackChannelDetails.value = ''
			slackChannelDetailsText.textContent = '...'
			iconSlackDetail.dispatchEvent(inputEvent)

			slackChannelDetails.dispatchEvent(new Event('blur'))
		}

		iconNotes.onclick = () => {
			let notesInput = document.getElementById('channelTopicPrompt')
			let notesInputText = document.getElementById('slackNotes')

			notesInput.value = ''
			notesInputText.textContent = '...'
			iconNotes.dispatchEvent(inputEvent)

			notesInput.dispatchEvent(new Event('blur'))
		}

		//? ----------------------- Modal Edit Close Button ----------------------- //

		modalEditButtonClose.onclick = () => {
			$('#modalEdit').modal('hide')

			setTimeout(() => {
				resizeWindow()
			}, 200)
		}

		//? ------------------------- Clear Form Input Button ------------------------ //

		const clearBtn = document.getElementById('clearBtn')
		const modalEditButtonDiscardClose = document.getElementById(
			'modalEditButtonDiscardClose'
		)
		const modalEditButtonSaveChangesClose = document.getElementById(
			'modalEditButtonSaveChangesClose'
		)

		modalEditButtonSaveChangesClose.onclick = () => {
			$('#modalEditConfirmCloseModal').modal('hide')
		}

		clearBtn.onclick = () => {
			$('#modalEditConfirmCloseModal').modal('show')

			modalEditButtonDiscardClose.onclick = async () => {
				for (const [key] of Object.entries(localStorage)) {
					if (key !== 'popupClicked') {
						localStorage.removeItem(key)
					}
				}

				$('#modalEditConfirmCloseModal').modal('hide')
				await waitForUsers()
				clickAllIcons()
				noValueDots()
			}
		}

		//? ----------------------- modalEdit Save Input Button ---------------------- //

		modalEditButtonToConfirmModal.onclick =
			async function saveChangesModalEdit() {
				saveFormInputs()
				window.resizeTo(560, 680)

				document.getElementById(
					'modalConfirmAlertIcon'
				).innerHTML = /* html */ ` <i class="fa-solid fa-circle-info"></i> `
				document.getElementById('modalConfirmAlert').className =
					'alert d-flex fade show alert-info'
				document.getElementById(
					'ModalConfirm_AlertBody'
				).innerHTML = /* html */ `
					1. On the green alert box, you'll get a link to redirect to
					@Slackbot. Allow pop-up if prompted.
					<p></p>
					2. You'll also receive a DM from @Slackbot. Follow the
					prompts in Slack to continue.
				`

				document
					.getElementById('modalConfirmPendingButton')
					.classList.remove('bg-danger')

				document.getElementById(
					'modalConfirmPendingButton'
				).innerHTML = /* html */ `
					<span style="margin-right: 6px"> Loading... </span>
					<div
						class="spinner-border"
						role="status"
						style="width: 1rem; height: 1rem; border-width: 0.2em"
					>
						<span class="visually-hidden"></span>
					</div>
				`
				modalConfirmButtonClose.classList.remove('disabled')

				modalConfirmButtonSubmitChannel.style.display = 'block'
				document.getElementById(
					'modalConfirmPendingButton'
				).style.display = 'none'

				$('#modalEdit').modal('hide')
				$('#modalConfirm').modal('show')
			}

		//? --------------------- Submit Button Function --------------------- //

		modalConfirmButtonSubmitChannel.onclick = async () => {
			let slackNotes = notesInput()

			console.log('Submitting ...', payloadToSend)

			modalConfirmButtonClose.classList.add('disabled')
			modalConfirmButtonBack.classList.add('disabled')

			// Swap the buttons: submit to pending
			modalConfirmButtonSubmitChannel.style.display = 'none'
			document.getElementById('modalConfirmPendingButton').style.display =
				'block'

			await sendPayload(payloadToSend, slackNotes)
		}

		//# ------------------------------------------------------------------------ //
		//#                             Module Functions                             //
		//# ------------------------------------------------------------------------ //

		//^ ---------------------- Get Region/Airport From Title --------------------- //

		let regionMap = await getValueSerialized('regionMapCache', [])
		console.log('Region Map:', regionMap)

		if (
			(await getValueSerialized('regionMapCacheTime', 0)) <
				Date.now() - 86400000 * 7 ||
			regionMap.length === 0
		) {
			try {
				const response = await axios({
					method: 'post',
					url: 'https://regions.corp.amazon.com/api/ListDimensions',
					headers: {
						'Content-Type': 'application/json',
						'X-GM-From': 'AWS Region Mapper',
					},
					data: JSON.stringify({
						DimensionType: 'REGION',
						MaxResults: 200,
					}),
				})
				const json = response.data
				regionMap = json.Dimensions.map((item) => {
					return {
						airport: item.Key.Name,
						code: item.RegionName,
						name: item.LongName,
					}
				}).sort((a, b) => a.airport.localeCompare(b.airport))
				setValueSerialized('regionMapCache', regionMap)
				setValueSerialized('regionMapCacheTime', Date.now())
			} catch (error) {
				console.error('Error loading region list:', error)
			}
		}

		async function getValueSerialized(key, defaultValue) {
			const value = localStorage.getItem(key)
			try {
				return JSON.parse(value) ?? defaultValue
			} catch {
				return defaultValue
			}
		}

		//^ -------------------------- Convert Channel Title ------------------------- //

		function convertTitleToChannel(title) {
			// Check for keywords or phrases indicating a task or instruction
			const taskKeywords = [
				'action required',
				'fix',
				'investigate',
				'active',
				'troubleshoot',
				'resolve',
				'update',
				'upgrade',
				'install',
				'configure',
				'deploy',
				'rollback',
				'restore',
				'backup',
				'operator needs to manually bring replacement',
			]

			for (const keyword of taskKeywords) {
				if (title.toLowerCase().indexOf(keyword) > -1) {
					title = title.toLowerCase().replace(keyword, '')
				}
			}

			// Remove filler words
			title = title.replace(
				/\b(a|an|be|this|the|that|has|in|on|at|for|to|with|by|of|from|as|is|and|or|but|yet|so|if)\b\s/gi,
				''
			)

			// Remove all numbers
			title = title.replace(/\d+/g, '')

			// remove [ from title
			// title = title.replace(/\[/g, '').replace(/\]/g, '')

			// remove ( from title
			// title = title.replace(/\(/g, '').replace(/\)/g, '')

			// Replace all other special characters with spaces
			title = title.replace(/[^a-zA-Z0-9.\- ]/g, '')

			// Replace periods with space
			title = title.replace(/\./g, ' ')

			// Remove consecutive dashes or underscores
			title = title.replace(/[_-]+/g, ' ')

			// Remove repeating words
			title = title.split('-')
			var newTitle = []

			for (const char of title) {
				if (
					newTitle.length === 0 ||
					char !== newTitle[newTitle.length - 1]
				) {
					newTitle.push(char)
				}
			}

			title = newTitle.join('-')

			// Remove repeating words in the form word-word-word-number
			const repeatedWords = title.split('-')
			if (
				repeatedWords.length > 3 &&
				repeatedWords[repeatedWords.length - 1].match(/^[0-9]+$/)
			) {
				for (let i = 0; i < repeatedWords.length - 2; i++) {
					if (
						repeatedWords[i] ===
							repeatedWords[repeatedWords.length - 2] &&
						repeatedWords[i] ===
							repeatedWords[repeatedWords.length - 3]
					) {
						repeatedWords.splice(i, 2)
						title = repeatedWords.join('-')
						break
					}
				}
			}

			// Check if the length of the title exceeds the character limit
			/* 			if (title.length > 80) {
				// Remove the text to the right of the last task keyword,
				// Until the length of the title is within the limit
				for (const keyword of taskKeywords.reverse()) {
					const keywordIndex = title
						.toLowerCase()
						.lastIndexOf(keyword)
					if (keywordIndex > -1 && title.length > 80) {
						title = title.substring(0, keywordIndex).trim()
					}
				}
			} */

			// If the title is over 68 characters, start abbreviating words
			/* 			if (title.length > 80) {
				var words = title.split(' ')
				var newTitle = ''

				for (const word of words) {
					if (word.length > 4) {
						newTitle += word.substring(0, 1)
						const remainingLength = word.length - 2
						if (remainingLength > 1) {
							if (remainingLength > 3) {
								// Abbreviate to first three characters as a last resort
								newTitle += word.substring(1, 4)
							} else {
								newTitle +=
									'-' + word.substring(1, remainingLength + 1)
							}
						} else {
							newTitle += word.substring(1)
						}
						newTitle += word.charAt(word.length - 1)
					} else {
						newTitle += word
					}

					if (newTitle.length >= 80) {
						newTitle = newTitle.substring(0, 80)
						break
					}

					if (word !== words[words.length - 1]) {
						newTitle += '-'
					}
				}

				title = newTitle.trim()
			}
 			*/

			title = title
				.replace(/\b[a-zA-Z]\b/g, '')
				.replace(/\s+/g, '-')
				.replace(/[-]+/g, '-')
				.replace(/^[-]+|[-_]+$/g, '')

			return title
		}

		//^ -------------------- Swap Placeholder Animation OnLoad ------------------- //

		function swapPlaceholderElms() {
			console.log('Transitioning placeholder Elements...')

			document.getElementById('mainPageAlertPlaceholder').style =
				'display: none !important;'
			document.getElementById('accordionPlaceholder').style =
				'display: none !important;'
			document.getElementById('mainButtonGroupPlaceholder').style =
				'display: none !important;'
			document.getElementById('popupButtonArea').style = ''
			document.getElementById('themeSwitchArea').style = ''
			document.getElementById('mainPageAlert').style = ''
			document.getElementById('accordionSlackEntry').style = ''
			document.getElementById('modalEditMainWindowButton').style = {
				display: 'block !important',
			}
			document.getElementById('openTicketSelectModal').style =
				'position: relative; margin-right: 4px;'
			console.log('Finished loading elements...')
		}

		//^ ----------------- Light Switch Button And Toggle Theme ----------------- //

		document.querySelector('#css-toggle-btn').onclick = () => {
			darkmode.toggleDarkMode()
			renderTheme()
			ReactDOM.createRoot(rootElement).render(
				<TicketSelect onButtonDisable={handleButtonDisable} />
			)
		}

		function renderTheme() {
			const themeState = document.getElementById('extHTML').className

			themeState === 'light'
				? (document
						.querySelector('#css-toggle-btn')
						.classList.remove('btn-dark'),
				  document
						.querySelector('#css-toggle-btn')
						.classList.add('btn-secondary'))
				: (document
						.querySelector('#css-toggle-btn')
						.classList.add('btn-dark'),
				  document
						.querySelector('#css-toggle-btn')
						.classList.remove('btn-secondary'))
		}

		//^ ---------------------- Users React-Select Function ---------------------- //

		async function waitForUsers() {
			const loadData = async () => {
				try {
					chrome.runtime.onMessage.addListener((message) => {
						userAliases.push(message)
					})
					await getUserAliases()
				} catch (error) {
					console.error(error)
				}

				let [aliases] = userAliases
				uniqueAliases = Array.from(new Set(aliases)).sort()

				console.log(
					`Active users on ExampleWebsite:`,
					`${uniqueAliases}`
				)

				if (uniqueAliases) {
					let data = uniqueAliases
					uniqueAliases = data.map((alias) => {
						return { value: alias, label: alias }
					})
				}

				console.log(
					`userAlias array returned when clicking select:`,
					`${JSON.stringify(uniqueAliases)}`
				)

				if (uniqueAliases.length === 0) {
					let data = ['No users found']
					uniqueAliases = data.map((alias) => {
						return { value: alias, label: alias }
					})

					console.log(
						`No userAlias array returned when clicking select.`,
						`Setting value to:`,
						uniqueAliases
					)
				}
			}

			// Load names and aliases...
			const AliasSelector = () => {
				const handleInputChange = (newValue) => {
					if (newValue && newValue.value) {
						selectionAliases = [...selectionAliases, newValue.value]
					}
				}

				const themeState = document.getElementById('extHTML').className

				return (
					<CreatableSelect
						isMulti
						isCreatable={true}
						closeMenuOnSelect={false}
						components={makeAnimated()}
						options={uniqueAliases}
						placeholder={
							uniqueAliases.length > 0
								? 'Select user alias'
								: 'No users found'
						}
						onChange={(selectedOptions) => {
							selectionAliases = selectedOptions.map(
								(option) => option.value
							)
						}}
						onInputChange={handleInputChange}
						theme={(theme) => ({
							...theme,
							borderRadius: 1,
							colors:
								themeState === 'light'
									? {
											...theme.colors,
											neutral0: '#f5fffa',
											primary: '#1266f1',
											neutral5: '#c0c0c0',
											neutral80: '#4f4f4f',
											primary25: '#f5fffa',
											neutral20: '#1266f1',
									  }
									: {
											...theme.colors,
											neutral0: '#222222',
											text: '#f3f3f3',
											neutral80: '#f3f3f3',
											primary25: '#4f4f4f',
											neutral20: '#4f4f4f',
											neutral10: '#1266f1',
											primary: '#1266f1',
									  },
						})}
					/>
				)
			}

			await loadData()

			ReactDOM.render(
				<AliasSelector />,
				document.getElementById('typeaheadUserAliasesPlaceholder')
			)
		}

		//^ ------------------------ Parse TicketID From URL ----------------------- //

		if (popupClicked === true) {
			console.log('Running in a popup window')
		} else {
			popupClicked = false
			console.log('Running in a regular browser window')
		}

		let backgroundUrls = []
		let activeUrls = []
		let selectedUrl = []

		let currentTabId

		async function getActiveTabs() {
			// Check the value of isPopup
			console.log('Checking isPopup:', popupClicked)

			queryTabs(
				{
					currentWindow: popupClicked ? false : true,
					active: true,
					windowType: 'normal',
				},
				async function getUrlData(tabs) {
					return new Promise(async (resolve) => {
						for (const tab of tabs) {
							const splitUrl = tab.url.split('/')
							const urlContainsHostname =
								splitUrl.includes('ExampleWebsite')

							if (urlContainsHostname) {
								console.log(
									`Found active url matching domain: `,
									`${tab.url}`
								)
								const regex = /^[a-zA-Z]\d{0,14}$/

								if (regex.test(splitUrl[3])) {
									activeUrls.push({
										tabId: tab.id,
										tabUrl: tab.url,
										tabTitle: tab.title,
										tabTicketId: splitUrl[3],
									})
									ticketTitle = await getActiveTabTitle()
								}
							} else {
								console.log(
									`No matching url found in active tab`
								)
							}
						}
						resolve()
					})
				}
			)
		}

		async function getBackgroundTabs() {
			return new Promise((resolve) => {
				queryTabs(
					{
						currentWindow: popupClicked ? false : true,
						active: false,
						windowType: 'normal',
					},
					async (tabs) => {
						for (const tab of tabs) {
							const splitUrl = tab.url.split('/')
							const urlContainsHostname =
								splitUrl.includes('ExampleWebsite')

							if (urlContainsHostname) {
								console.log(
									`Found background url matching domain:`,
									`${tab.url}`
								)

								const regex = /^[a-zA-Z]\d{0,14}$/

								if (regex.test(splitUrl[3])) {
									backgroundUrls.push({
										tabId: tab.id,
										tabUrl: tab.url,
										tabTitle: tab.title,
										tabTicketId: splitUrl[3],
									})
								}
							}
						}

						resolve()
					}
				)
			})
		}

		await getActiveTabs()
		await getBackgroundTabs()
		await testTicketIdArrays()

		async function testTicketIdArrays() {
			try {
				if (activeUrls.length > 0) {
					console.log(
						`Matching url found in active tab`,
						`Title: ${activeUrls[0].tabTitle}`,
						`Url: ${activeUrls[0].tabUrl}`,
						`TicketId: ${activeUrls[0].tabTicketId}`
					)
					parsedTicketId = activeUrls[0].tabTicketId
					title = activeUrls[0].tabTitle

					swapPlaceholderElms()

					await insertTicketId()
				} else if (backgroundUrls.length > 0) {
					console.log(
						`Matching urls found in background tab`,
						`Array: ${backgroundUrls}`
					)

					$('#selectTicketTitleButtonModal').modal('show')
				} else {
					console.log('No matching urls found')
					mismatchedUrl()
				}
			} catch (error) {
				console.error(error)
			}
		}

		function mismatchedUrl() {
			parsedTicketId = ''

			document.getElementById('ticketId').textContent = '...'
			document.getElementById('ticketInputPrompt').value = parsedTicketId

			console.log('Disabling extension due to 🚫 url match')

			swapPlaceholderElms()

			window.resizeTo(385, 185)

			// Toggle modal by selector for mismatch alert
			$('#ModalMismatchedURL').modal('show')
			document
				.getElementById('alertLinkRedirect')
				.addEventListener('click', () => {
					console.log('Click Captured')
					setTimeout(() => {
						window.close()
					}, 1000)
				})
		}

		async function insertTicketId() {
			await retrieveStoredValues()

			let currentUrl = []

			if (activeUrls.length > 0) {
				currentUrl.push(activeUrls[0].tabUrl)

				console.log(`Active Url: ${currentUrl[0]}`)
			} else if (selectedUrl.length > 0) {
				currentUrl.push(selectedUrl[0].tabUrl)
				title = selectedUrl[0].tabTitle

				console.log(`Selected Url: ${currentUrl[0]}`)
			}

			const urlOnLoad = localStorage.getItem('urlOnLoad')
			const savedStorageTicketId = localStorage.getItem('savedTicket')
			const popupUrl = chrome.extension.getURL(
				'High Severity Slack Button'
			)

			$('#modalEditButtonToConfirmModal').attr(
				'class',
				'btn btn-primary btn-rounded disabled'
			)

			if (savedStorageTicketId || (savedStorageTicketId && popupUrl)) {
				console.log(
					'Saved Ticket Id found, no URL changes detected. Using saved Ticket Id'
				)

				document.getElementById('ticketInputPrompt').value =
					savedStorageTicketId
				document.getElementById('ticketId').innerText =
					savedStorageTicketId
				localStorage.setItem('urlOnLoad', currentUrl[0])
			}

			if (urlOnLoad !== currentUrl[0]) {
				console.log(
					`URL change detected, program will input new ticketId...`
				)

				console.log(`Set the following ticketId  👉 ${parsedTicketId}`)

				document.getElementById('ticketInputPrompt').value =
					parsedTicketId
				document.getElementById('ticketId').innerText = parsedTicketId
				localStorage.setItem('urlOnLoad', currentUrl[0])
			}

			document.getElementById('ticketId').innerText = '...'
			document.getElementById('ticketInputPrompt').value = parsedTicketId

			let finalUrl = currentUrl[0]

			checkUrlEnding(finalUrl)
		}

		async function checkUrlEnding(finalUrl) {
			if (finalUrl === undefined) {
				return
			}

			if (finalUrl.length > 0) {
				let splitUrl = finalUrl.split('/')

				// Check if the URL ends in /communication
				if (splitUrl[9] === 'communication.html') {
					console.log(
						'The active tab has a URL that ends in /communication'
					)

					$('#ModalMismatchedURL').modal('hide')

					swapPlaceholderElms()
				} else {
					await handleRedirect()
				}
			} else {
				finalUrl = []
				return
			}
		}

		async function handleRedirect() {
			setTimeout(() => {
				clickCommunication()
			}, 400)
		}

		async function getActiveTabTitle() {
			return new Promise((resolve) => {
				queryTabs(
					{
						currentWindow: popupClicked ? false : true,
						active: true,
						currentWindow: popupClicked ? false : true,
					},
					(tabs) => {
						const activeTabTitle = tabs[0].title
						resolve(activeTabTitle)
					}
				)
			})
		}

		function switchToTab(callback) {
			updateTab(
				currentTabId,
				{
					active: true,
					highlighted: true,
				},
				async function () {
					console.log('Completed updating tab')
					const newTitle = await getActiveTabTitle()
					console.log('New title:', newTitle)
					ticketTitle = newTitle
					callback(ticketTitle)

					if (ticketTitle !== 'SIM Ticketing') {
						// $('#selectTicketTitleButtonModal').modal('hide')
						setTimeout(() => {
							location.reload()
						}, 300)
						insertTicketId()
					}

					if (popupClicked) {
						setStorage({ popupClicked: true })
					}
				}
			)
		}

		const handleButtonDisable = (isDisabled) => {
			const button = document.getElementById('closeTicketSelectModal')
			if (button) {
				button.disabled = isDisabled
			}
		}

		const TicketSelect = (props) => {
			const [selectedTabChanged, setSelectedTabChanged] = useState(false)
			const [tabUrls, setTabUrls] = useState([])
			const [options, setOptions] = useState([])
			const [refreshTabs, setRefreshTabs] = useState(false)
			const [isLoading, setIsLoading] = useState(true)
			const [tabTitle, setTabTitle] = useState(ticketTitle)

			const handleOpenTicketSelectModal = () => {
				$('#selectTicketTitleButtonModal').modal('show')
			}

			async function handleMatchingTabUrls() {
				setIsLoading(true)

				const regex = /^[a-zA-Z]\d{0,14}$/

				const queryTabsPromise = (options) =>
					new Promise((resolve) => {
						queryTabs(options, (tabs) => {
							resolve(tabs)
						})
					})

				const checkTabs = async (options) => {
					const tabs = await queryTabsPromise(options)
					let newTabUrls = []

					for (let tab of tabs) {
						if (tab.url.includes('SlackChannelAutomator')) {
							if (regex.test(tab.url.split('/')[3])) {
								newTabUrls.push({
									tabId: tab.id,
									tabUrl: tab.url,
									tabTitle: tab.title,
									ticketId: tab.url.split('/')[3],
								})
							} else {
								newTabUrls = []
							}
						}
					}

					return newTabUrls
				}

				const activeTabs = await checkTabs({
					active: true,
					windowType: 'normal',
				})

				const inactiveTabs = await checkTabs({
					active: false,
					windowType: 'normal',
				})

				const newTabUrls = [
					...(activeTabs !== undefined ? activeTabs : []),
					...(inactiveTabs !== undefined ? inactiveTabs : []),
				]

				if (newTabUrls.length > 0) {
					// Update the tabUrls state
					setTabUrls(newTabUrls)

					console.log('Urls available for selection:', newTabUrls)
				}

				if (newTabUrls.length === 0) {
					console.log(
						'No matching domain or URLs found in current window'
					)
				}
				setTimeout(() => {
					setIsLoading(false)
				}, 1000)
			}

			useEffect(() => {
				const openTicketSelectModal = document.getElementById(
					'openTicketSelectModal'
				)
				openTicketSelectModal.addEventListener(
					'click',
					handleOpenTicketSelectModal
				)

				return () => {
					openTicketSelectModal.removeEventListener(
						'click',
						handleOpenTicketSelectModal
					)
				}
			}, [])

			useEffect(() => {
				if (tabTitle !== 'SIM Ticketing') {
					handleMatchingTabUrls()
				} else {
					location.reload()
				}
			}, [refreshTabs, selectedTabChanged])

			useEffect(() => {
				if (tabTitle === 'SIM Ticketing') {
					const timeout = setTimeout(() => {
						setRefreshTabs((prev) => !prev)
					}, 2000)

					return () => {
						clearTimeout(timeout)
					}
				}
			}, [tabTitle])

			useEffect(() => {
				let newOptions = []

				if (tabUrls.length === 0) {
					let data = ['No tickets found']

					newOptions = data.map((ticket) => {
						return {
							value: ticket,
							label: ticket,
						}
					})
				}

				if (tabUrls.length > 0) {
					let data = tabUrls

					newOptions = data.map((ticketUrl) => {
						return {
							value: ticketUrl.tabId,
							label: ticketUrl.tabTitle,
						}
					})
				}

				setOptions(newOptions)
			}, [tabUrls])

			useEffect(() => {
				if (selectedTabChanged) {
					switchToTab((newTitle) => {
						setTabTitle(newTitle)
					})
					setSelectedTabChanged(false)
				}
			}, [selectedTabChanged])

			useEffect(() => {
				props.onButtonDisable(isLoading)
			}, [isLoading])

			const themeState = document.getElementById('extHTML').className

			return (
				<>
					<Select
						className='basic-single'
						classNamePrefix='select'
						options={options}
						isLoading={isLoading}
						isDisabled={isLoading}
						isMulti={false}
						onChange={(selectedOptions) => {
							if (selectedOptions) {
								currentTabId = selectedOptions.value

								const ticketId = tabUrls.find(
									(tab) => tab.tabId === currentTabId
								).ticketId
								const ticketUrl = tabUrls.find(
									(tab) => tab.tabId === currentTabId
								).tabUrl
								const ticketTitleParsed = tabUrls.find(
									(tab) => tab.tabId === currentTabId
								).tabTitle

								console.log(`TicketId selected: ${ticketId}`)

								ticketTitle = ticketTitleParsed
								parsedTicketId = ticketId

								selectedUrl.push({
									tabId: selectedOptions.value,
									tabUrl: ticketUrl,
									tabTitle: ticketTitle,
									tabTicketId: ticketId,
								})

								console.log(`Selected URL:`, `${selectedUrl}`)

								setSelectedTabChanged(true)
							} else {
								currentTabId = null
								parsedTicketId = null
								selectedUrl = []
								setTabTitle('')
							}
						}}
						isClearable={true}
						isSearchable={true}
						placeholder={isLoading ? 'Loading...' : 'Select Ticket'}
						theme={(theme) => ({
							...theme,
							borderRadius: 1,
							colors:
								themeState === 'light'
									? {
											...theme.colors,
											neutral0: '#f5fffa',
											neutral10: '#1266f1',
											text: '#4f4f4f',
											primary: '#1266f1',
											neutral5: '#c0c0c0',
											neutral80: '#4f4f4f',
											primary25: '#f5fffa',
											neutral20: '#1266f1',
									  }
									: {
											...theme.colors,
											neutral0: '#222222',
											text: '#f3f3f3',
											neutral80: '#f3f3f3',
											primary25: '#4f4f4f',
											neutral20: '#4f4f4f',
											neutral10: '#1266f1',
											neutral5: '#222222',
											primary: '#1266f1',
									  },
						})}
					/>
				</>
			)
		}

		ReactDOM.createRoot(rootElement).render(
			<TicketSelect onButtonDisable={handleButtonDisable} />
		)

		removeStorage('popupClicked', function () {
			console.log('popupClicked removed from storage')
		})

		//^ ---------------------- Inject Script Active Users ----------------------- //

		async function getUserAliases() {
			try {
				const tabs = await new Promise((resolve) => {
					queryTabs(
						{
							currentWindow: popupClicked ? false : true,
							active: true,
							windowType: 'normal',
						},
						(tabs) => {
							resolve(tabs)
						}
					)
				})

				if (!tabs || tabs.length === 0) {
					throw new Error('No active tabs found.')
				}

				const results = await new Promise((resolve, reject) => {
					chrome.tabs.executeScript(
						tabs[0].id,
						{
							code: `
							let userElements = document.querySelectorAll('#ticket-list > li > strong');
							let userInfo = [];
							for (const element of userElements) {
								let childNode = element.childNodes[0].data;
								userInfo.push(childNode);
							}
							chrome.runtime.sendMessage(userInfo);
							`,
						},
						(results) => {
							if (chrome.runtime.lastError) {
								reject(chrome.runtime.lastError.message)
							} else {
								resolve(results[0])
							}
						}
					)
				})

				return results
			} catch (err) {
				console.dir(err)
				throw err
			}
		}

		async function getTicketId() {
			try {
				const tabs = await new Promise((resolve) => {
					queryTabs(
						{
							currentWindow: popupClicked ? false : true,
							active: true,
							windowType: 'normal',
						},
						(tabs) => {
							resolve(tabs)
						}
					)
				})

				if (!tabs || tabs.length === 0) {
					throw new Error('No active tabs found.')
				}

				const results = await new Promise((resolve, reject) => {
					chrome.tabs.executeScript(
						tabs[0].id,
						{
							code: `
							let ticketNumber = document.querySelector('#ticket-number');
							let ticketInfo = [];
							ticketInfo.push(ticketNumber);
							chrome.runtime.sendMessage(ticketInfo);
							`,
						},
						(results) => {
							if (chrome.runtime.lastError) {
								reject(chrome.runtime.lastError.message)
							} else {
								resolve(results[0])
							}
						}
					)
				})

				return results
			} catch (err) {
				console.dir(err)
				throw err // Re-throw the error to be caught by something else
			}
		}

		async function clickCommunication() {
			try {
				const tabs = await new Promise((resolve) => {
					queryTabs(
						{
							currentWindow: popupClicked ? false : true,
							active: true,
							windowType: 'normal',
						},
						(tabs) => {
							resolve(tabs)
						}
					)
				})

				if (!tabs || tabs.length === 0) {
					throw new Error('No active tabs found.')
				}

				const results = await new Promise((resolve, reject) => {
					chrome.tabs.executeScript(
						tabs[0].id,
						{
							code: `
							document.querySelector("body > nav > ul > li:nth-child(2) > a").click();
							`,
						},
						(results) => {
							if (chrome.runtime.lastError) {
								reject(chrome.runtime.lastError.message)
							} else {
								resolve(results[0])
							}
						}
					)
				})

				return results
			} catch (err) {
				console.dir(err)
				throw err // Optionally, re-throw the error if you want it to be caught by something else
			}
		}

		//^ ---------------------------- Get Current User ---------------------------- //

		async function getCurrentUser() {
			try {
				// Make GET request to phoneTool
				const response = await axios.get(
					'https://phonetool.amazon.com/users/'
				)

				const html = response.data,
					parser = new DOMParser(),
					doc = parser.parseFromString(html, 'text/html'),
					div = doc.querySelector('div[data-react-class="NavBar"]'),
					reactProps = div.getAttribute('data-react-props'),
					props = JSON.parse(reactProps),
					currentUserAlias = props.currentUser

				console.log(`The current user is: ${currentUserAlias}`)
				return currentUserAlias
			} catch (error) {
				console.log(`Error when retrieving current user: ${error}`)
			}
		}

		//^ --------------------------- Store Input Values --------------------------- //

		async function getInput() {
			let ticketIdKey = await ticketInput()
			let airportCodeKey = await airportCodeInput()
			let regionCodeKey = await regionInput()
			let slackChannelDetailsKey = await channelDetailsInput()
			let slackNotesKey = notesInput()

			return {
				ticketIdKey,
				airportCodeKey,
				regionCodeKey,
				slackChannelDetailsKey,
				slackNotesKey,
			}
		}

		async function storeInput() {
			let input = await getInput()

			let ticketIdKeyToStore = input.ticketIdKey
			let airportCodeKeyToStore = input.airportCodeKey
			let regionCodeKeyToStore = input.regionCodeKey
			let slackChannelDetailsKeyToStore = input.slackChannelDetailsKey
			let slackNotesKeyToStore = input.slackNotesKey

			document.getElementById('ticketId').innerText = ticketIdKeyToStore
			document.getElementById('airportCode').innerText =
				airportCodeKeyToStore
			document.getElementById('regionCode').innerText =
				regionCodeKeyToStore
			document.getElementById('channelDetails').innerText =
				slackChannelDetailsKeyToStore
			document.getElementById('slackNotes').innerText =
				slackNotesKeyToStore

			if (ticketIdKeyToStore) storeTicketValue(ticketIdKeyToStore)
			if (airportCodeKeyToStore) storeAirportValue(airportCodeKeyToStore)
			if (regionCodeKeyToStore) storeRegionValue(regionCodeKeyToStore)
			if (slackChannelDetailsKeyToStore)
				storeChannelDetailsValue(slackChannelDetailsKeyToStore)
			if (slackNotesKeyToStore) storeNotesValue(slackNotesKeyToStore)
			return {
				ticketIdKeyToStore,
				airportCodeKeyToStore,
				regionCodeKeyToStore,
				slackChannelDetailsKeyToStore,
				slackNotesKeyToStore,
			}
		}

		//^ ---------------------------- Save Forum Inputs ---------------------------- //

		// Get JQ values from entered text,
		// trim any whitespace & special chars
		async function saveFormInputs() {
			let inputs = await storeInput()
			let slackNotes = inputs.slackNotesKeyToStore

			constructChannelName()

			console.log('selectionAliases: ', selectionAliases)

			let uniqueUsersListView

			if (selectionAliases.length > 0) {
				uniqueUsersListView = selectionAliases.join(' ')
			}

			if (Object.keys(selectionAliases).length === 0) {
				uniqueUsersListView = ''
				selectionAliases = ''
				uniqueUsersListView = 'No users selected'
			}

			console.log(`uniqueUsersList: ${uniqueUsersListView}`)

			$('#modalConfirmBody').replaceWith(/* html */ `
				<div
					class="modal-body"
					id="modalConfirmBody"
				>
					<strong
						>A Slack channel will be created with the following
						title:</strong
					>
					<p
						><span><code>${payloadToSend}</code></span></p
					>
					${
						slackNotes
							? /* html */ `
									<strong>Channel topic:</strong>
									<p
										><span><code>${slackNotes}</code></span></p
									>
							  `
							: ''
					}
					Current user:
					<p
						><span><code>${currentUser}</code> </span></p
					>
					Additional users:
					<p
						><span><code>${uniqueUsersListView}</code></span></p
					>
				</div>
			`)
		}

		//^ --------------------------- Format Channel Name -------------------------- //

		async function constructChannelName() {
			let inputs = await getInput()
			let ticketId = inputs.ticketIdKey
			let airportCode = inputs.airportCodeKey
			let regionCode = inputs.regionCodeKey
			let channelDetails = inputs.slackChannelDetailsKey

			payloadToSend = addDash(
				ticketId,
				airportCode,
				regionCode,
				channelDetails
			)

			var returnValues = payloadToSend
			return returnValues
		}

		//^ ----------------------- Add Dashes For Channel Name ---------------------- //

		function addDash(ticketId, airportCode, regionCode, channelDetails) {
			let result = ''

			// Check if ticketId is defined
			if (ticketId) {
				result += ticketId
			}

			// Check if airportCode is defined
			if (airportCode) {
				if (ticketId) {
					result += '-'
				}
				result += airportCode
			}

			// Check if regionCode is defined
			if (regionCode) {
				if (ticketId || airportCode) {
					result += '-'
				}
				result += regionCode
			}

			// Check if channelDetails is defined
			if (channelDetails) {
				if (ticketId || airportCode || regionCode) {
					result += '-'
				}
				result += channelDetails
			}

			return result
		}

		//^ ------------------------- Save Input: TicketId ------------------------- //

		async function storeTicketValue(ticketIdKeyToStore) {
			try {
				localStorage.setItem('savedTicket', ticketIdKeyToStore)
			} catch (error) {
				console.error(error)
			}
		}

		//^ ---------------------------- Get Stored Values --------------------------- //

		async function retrieveStoredValues() {
			getStoredAirportValue()
			getStoredRegionValue()
			getStoredChannelDetailsValue()
			getStoredNotesValue()
		}

		//^ ------------------ Save & Retrieve Input: AirportCode ------------------ //

		async function storeAirportValue(airportCodeKeyToStore) {
			try {
				localStorage.setItem('inputAirport', airportCodeKeyToStore)
			} catch (error) {
				console.error(error)
			}
		}

		async function getStoredAirportValue() {
			try {
				const storageAirport = localStorage.getItem('inputAirport')

				if (storageAirport === null || undefined) {
					document.getElementById('airportCodePrompt').value = ''
					return
				}

				console.log(
					`Airport code retrieved from storage:
                ${storageAirport}
                `
				)

				document.getElementById('airportCodePrompt').value =
					storageAirport
				document.getElementById('airportCode').innerText =
					storageAirport

				return storageAirport
			} catch (error) {
				console.error(error)
			}
		}

		//^ ------------------- Save & Retrieve Input: RegionCode ------------------ //

		async function storeRegionValue(regionCodeKeyToStore) {
			try {
				localStorage.setItem('inputRegion', regionCodeKeyToStore)
			} catch (error) {
				console.error(error)
			}
		}

		async function getStoredRegionValue() {
			try {
				const storageRegion = localStorage.getItem('inputRegion')

				if (storageRegion === null || undefined) {
					document.getElementById('regionCode').innerText = '...'
					document.getElementById('regionInputPrompt').value = ''
					return
				}

				console.log(`Getting regionCode value from storage:
                        ${storageRegion}`)

				document.getElementById('regionInputPrompt').value =
					storageRegion
				document.getElementById('regionCode').innerText = storageRegion

				return storageRegion
			} catch (error) {
				console.error(error)
			}
		}

		//^ ---------------- Save & Retrieve Input: Channel Details ---------------- //

		async function storeChannelDetailsValue(slackChannelDetailsKeyToStore) {
			try {
				localStorage.setItem(
					'inputChannelDetails',
					slackChannelDetailsKeyToStore
				)
			} catch (error) {
				console.error(error)
			}
		}

		async function getStoredChannelDetailsValue() {
			try {
				const storagechannelDetails = localStorage.getItem(
					'inputChannelDetails'
				)

				if (storagechannelDetails === null || undefined) {
					document.getElementById('channelDetails').innerText = '...'
					document.getElementById('channelDetailsPrompt').value = ''
					return
				}

				console.log(
					'channelDetails in localStorage:',
					storagechannelDetails
				)

				document.getElementById('channelDetailsPrompt').value =
					storagechannelDetails
				document.getElementById('channelDetails').innerText =
					storagechannelDetails

				return storagechannelDetails
			} catch (error) {
				console.error(error)
			}
		}

		//^ --------------------- Save & Retrieve Input: Notes --------------------- //

		async function storeNotesValue(slackNotesKeyToStore) {
			try {
				localStorage.setItem('inputNotes', slackNotesKeyToStore)
			} catch (error) {
				console.error(error)
			}
		}

		async function getStoredNotesValue() {
			try {
				const storageNotes = localStorage.getItem('inputNotes')

				if (storageNotes === null || undefined) {
					document.getElementById('slackNotes').innerText = '...'
					document.getElementById('channelTopicPrompt').value = ''

					return
				}

				console.log('Getting notes value from storage:', storageNotes)

				document.getElementById('channelTopicPrompt').value =
					storageNotes
				document.getElementById('slackNotes').innerText = storageNotes

				return storageNotes
			} catch (error) {
				console.error(error)
			}
		}

		//^ ------------------- Resize Window On Accordion Click ------------------- //

		function resizeWindow() {
			// const isExpanded = (id) =>
			// 	document.getElementById(id).getAttribute('aria-expanded') === 'true'

			// const accordionIds = [
			// 	'Button_collapseOne',
			// 	'Button_collapseTwo',
			// 	'Button_collapseThree',
			// 	'Button_collapseFour',
			// 	'Button_collapseFive',
			// ]

			document.getElementById('canvas').style.height = 'auto'
			document.getElementById('canvas').style.width = '406px'
			window.resizeTo(412, 608)

			/* 			if (accordionIds.some(isExpanded)) {
				document.getElementById('canvas').style.height = 'auto'
				document.getElementById('canvas').style.width = '406px'
				window.resizeTo(412, 608)
				console.log('Resizing window...')
			} else {
				document.getElementById('canvas').style.height = 'auto'
				document.getElementById('canvas').style.width = '406px'
				window.resizeTo(412, 608)
			} */
		}

		//^ ---------------------   API requests/responses --------------------- //

		// Global vars
		let responseChannelCreate
		let responseGetSlackIds
		let responseInvite
		let responseSetTopic
		let channelId
		let sseData = {}
		let userIds = []

		//! Enter bot token here
		const token = 'xoxb-....'

		// Send POST Request to api_gatway
		async function sendPayload(payloadToSend, slackNotes) {
			const slackChannelName = payloadToSend
			const currentUserAlias = currentUser
			const activeUsers = selectionAliases
			const notes = slackNotes
			const httpsAgent = agent

			try {
				console.log(`
							
					Channel Name: ${slackChannelName}
					Active User Aliases: ${activeUsers}
					Current User Alias:  ${currentUserAlias}
					Channel Topic:  ${notes}
					
					`)

				const headersList = {
					'Content-Type': 'application/json; charset=utf-8',
					'Authorization': `Bearer ${token}`,
					'Accept': '*/*',
				}

				console.log(`slackChannelName: ${slackChannelName}`)
				console.log(`currentUserAlias: ${currentUserAlias}`)
				console.log(`activeUsers: ${activeUsers}`)
				console.log(`notes: ${notes}`)

				// Create slack channel

				try {
					var bodyContent = JSON.stringify({
						name: slackChannelName,
						is_private: 'false',
						httpsAgent: httpsAgent,
					})

					var reqOptions = {
						url: 'https://slack.com/api/conversations.create',
						method: 'POST',
						headers: headersList,
						data: bodyContent,
						timeout: 10000,
					}

					const response = await axios.request(reqOptions)
					responseChannelCreate = response

					if (!response.data.ok) {
						return {
							statusCode: 400,
							body: response.data.error,
						}
					}
				} catch (error) {
					console.error('conversations.create error:', error)
				}

				if (responseChannelCreate.data.ok) {
					console.log(
						'conversations.create response:',
						responseChannelCreate.data
					)

					channelId = responseChannelCreate.data.channel.id
					sseData.channelId = channelId

					console.log(`Channel named ${slackChannelName} created!`)
					console.log(`Set the channel Id to: ${channelId}`)

					// Convert userAliases to email
					const emails = [currentUserAlias, ...activeUsers].map(
						(user) => {
							return user.concat('@amazon.com')
						}
					)
					sseData.emails = emails

					console.log('User Emails:', emails)

					for (const email of emails) {
						try {
							const response = await axios.get(
								'https://slack.com/api/users.lookupByEmail',
								{
									params: {
										email: email,
									},
									headers: headersList,
								}
							)

							console.log(response.data.user.id)
							responseGetSlackIds = response
						} catch (error) {
							console.error('users.lookupByEmail error: ', error)
						}
					}

					if (responseGetSlackIds.data.user.id) {
						//
						// Store userIds in array for later

						userIds.push(responseGetSlackIds.data.user.id)

						console.log(
							'User Id lookup Response: ',
							responseGetSlackIds.data
						)
						console.log('Slack User Ids: ', userIds)

						try {
							var bodyContent = JSON.stringify({
								channel: channelId,
								users: userIds.join(','),
								httpsAgent: httpsAgent,
							})

							var reqOptions = {
								url: 'https://slack.com/api/conversations.invite',
								method: 'POST',
								headers: headersList,
								data: bodyContent,
								timeout: 10000,
							}

							const response = await axios.request(reqOptions)
							responseInvite = response
						} catch (error) {
							console.error('conversations.invite error: ', error)
						}

						if (responseInvite.data.ok) {
							console.log(
								'conversations.invite response: ',
								responseInvite.data
							)
							console.log('Users invited to channel...')

							try {
								var bodyContent = JSON.stringify({
									channel: channelId,
									topic: notes,
									httpsAgent: httpsAgent,
								})

								var reqOptions = {
									url: 'https://slack.com/api/conversations.setTopic',
									method: 'POST',
									headers: headersList,
									data: bodyContent,
									timeout: 10000,
								}

								const response = await axios.request(reqOptions)
								responseSetTopic = response
							} catch (error) {
								console.error(
									'conversations.setTopic error: ',
									error
								)
							}

							if (responseSetTopic.data.ok) {
								console.log('Channel topic set...')
								console.log(
									'Channel topic: ',
									responseSetTopic.data
								)
							}
						}
					}
				}
			} catch (error) {
				console.error('Error responses during api calls: ', error)
				return {
					statusCode: 400,
					body: JSON.stringify(error),
				}
			}

			console.log('Response Array: ', sseData)

			let responseBody = {
				message: sseData,
				input: event,
			}

			let response = {
				statusCode: 200,
				body: responseBody,
			}

			console.log(`response: ${response}`)

			handleMessage(response)
		}

		//^ ---------------- Completion Confirmation Window Functions ---------------- //

		async function handleMessage(response) {
			// Response array in the format:

			/*

			{
			"statusCode": 200,
			"body": {
			"message": {
			"channelId": "C04JPD8PBFB",
			"emails": [
			"jjansena@amazon.com"
			]
			},
			"input": {
			"slackChannelName": "your-channel-name",
			"currentUserAlias": "youralias",
			"activeUsers": [
			"userwhocommented1",
			"userwhocommented2"
			],
			"notes": "Your channel topic will be here"
			}
			}
			}

			*/

			const entries = Object.entries(response.data)
			const parsedApiResponse = {}
			entries.forEach(([key, value]) => {
				parsedApiResponse[key] = value
			})
			const objectApiResponseString = JSON.stringify(parsedApiResponse)

			console.log('Parsed Object: ', objectApiResponseString)

			if (response.data.statusCode === 200) {
				// Elms
				const modalConfirmAlertIcon = document.getElementById(
					'modalConfirmAlertIcon'
				)
				const checkIconAlertBox = document.createElement('div')
				const bodyComplete = document.createElement('div')
				const ModalConfirm_AlertBody = document.getElementById(
					'ModalConfirm_AlertBody'
				)

				let slackNotes = response.data.body.message.notes
				let aliasResponseCurrentUser =
					response.data.body.input.currentUserAlias
				let slackChannelName = response.data.body.input.slackChannelName

				let aliasResponseActiveUsers =
					response.data.body.input.activeUsers
				let channelIdResponse = response.data.body.message.channelId

				let channelURL

				if (channelIdResponse) {
					channelURL = `https://amzn-aws.slack.com/app_redirect?channel=${channelIdResponse}`

					// Build alert link to @Slackbot in modalConfirm

					document
						.getElementById('modalConfirmAlert')
						.setAttribute(
							'class',
							'alert alert-success d-flex fade show justify-content-between'
						)
					document
						.getElementById('modalConfirmAlert')
						.setAttribute('style', 'width: -moz-available;')

					checkIconAlertBox.innerHTML = /* html */ `
						<i
							class="fa-solid fa-square-check"
							style="margin-right: 10px"
						></i>
					`
					bodyComplete.innerHTML = /* html */ `
						<a
							href="${channelURL}"
							id="OpenSlackWindow"
							class="alert-link"
							target="_blank"
						>
							Click here to redirect to the channel
						</a>
					`
				} else {
					channelIdResponse = ''
					channelURL = ''
				}

				if (aliasResponseActiveUsers.length > 0) {
					aliasResponseActiveUsers = [aliasResponseActiveUsers].map(
						(user) => `${user}`
					)
				} else {
					aliasResponseActiveUsers = 'No users were selected'
				}

				if (aliasResponseCurrentUser.length > 0) {
					aliasResponseCurrentUser = [aliasResponseCurrentUser].map(
						(user) => `@${user}`
					)
				} else {
					aliasResponseCurrentUser = 'No user found'
				}

				console.log(
					'SlackChannelName:',
					slackChannelName,
					'ChannelId:',
					channelIdResponse,
					'Aliases Invited:',
					aliasResponseActiveUsers,
					'ChannelTopic:',
					slackNotes,
					'CurrentUser:',
					aliasResponseCurrentUser
				)

				modalConfirmButtonSubmitChannel.style.display = 'none'
				document.getElementById(
					'modalConfirmPendingButton'
				).style.display = 'none'
				document.getElementById(
					'modalConfirmFinishedButton'
				).style.display = 'block'

				// Update modalConfirm box with user input
				const canvasStyle = 'height: auto; width: 520px;'
				$('#canvas').attr('style', canvasStyle)

				document.getElementById(
					'modalConfirmBody'
				).innerHTML = /* html */ `
					<div
						div
						class="modal-body"
						id="modalConfirmBody"
					>
						<p><strong>A Slack channel was successfully created:</strong></p>
						<br />
						Channel Name:
						<p><code>${slackChannelName}</code></p>
						<br />
						Channel Id:
						<p><code>${channelIdResponse}</code></p>
						<br />
						Current user:
						<p><code>${aliasResponseCurrentUser}</code></p>
						<br />
						Active user aliases invited:
						<p><code>${aliasResponseActiveUsers}</code></p>
						<br />
						${
							slackNotes
								? /* html */ `Channel Topic:
									<p><code>${slackNotes}</code></p>`
								: ''
						}
						<br />
					</div>
				`

				window.resizeTo(500, slackNotes ? 425 : 357)

				modalConfirmAlertIcon.replaceWith(checkIconAlertBox)
				ModalConfirm_AlertBody.replaceWith(bodyComplete)

				// remove the class disabled for modalConfirmButtonClose
				modalConfirmButtonClose.classList.remove('disabled')
			} else if (response.data.statusCode === 400) {
				console.log(
					'The request responded with an error from the Slack Api: ',
					objectApiResponseString
				)

				document.getElementById('modalConfirmBody').innerHTML = ''
				document.getElementById(
					'modalConfirmAlertIcon'
				).innerHTML = /* html */ `
					<i class="fa-solid fa-circle-exclamation"></i>
				`
				document.getElementById('modalConfirmAlert').className =
					'alert d-flex fade show alert-danger'
				document.getElementById(
					'ModalConfirm_AlertBody'
				).innerHTML = /* html */ `
					<p><code>${objectApiResponseString}</code></p>
				`

				document
					.getElementById('modalConfirmPendingButton')
					.classList.add('bg-danger')
				document.getElementById(
					'modalConfirmPendingButton'
				).innerHTML = /* html */ ` <span>Error</span> `

				modalConfirmButtonClose.classList.remove('disabled')
				modalConfirmButtonBack.classList.remove('disabled')
			} else {
				console.log(
					'The request responded with a general error: ',
					response
				)

				document.getElementById('modalConfirmBody').innerHTML = ''

				document.getElementById(
					'modalConfirmAlertIcon'
				).innerHTML = /* html */ `
					<i class="fa-solid fa-circle-exclamation"></i>
				`
				document.getElementById('modalConfirmAlert').className =
					'alert d-flex fade show alert-danger'
				document.getElementById(
					'ModalConfirm_AlertBody'
				).innerHTML = /* html */ `
					<p><code>${objectApiResponseString}</code></p>
				`

				document
					.getElementById('modalConfirmPendingButton')
					.classList.add('bg-danger')

				document.getElementById(
					'modalConfirmPendingButton'
				).innerHTML = /* html */ ` <span>Error</span> `

				modalConfirmButtonClose.className =
					'btn btn-secondary btn-rounded'
				modalConfirmButtonBack.classList.remove('disabled')
			}
		}

		//^ ---------------------- Retrieve And Format Form Data --------------------- //

		const regex = /[^a-zA-Z0-9[\]()\:]+|[,:;|]|\[\]|\(\)/g
		const regexSpaces = /\s+/g
		const regexNewLine = /\n/g

		async function ticketInput() {
			const getVal = document
				.querySelector('#ticketInputPrompt')
				.value.toLowerCase()
			let lowSideTicketUpdateCleaned = ''

			if (!getVal || getVal === null || getVal === undefined) {
				document.querySelector('#ticketId').textContent = '...'
				return
			}

			lowSideTicketUpdateCleaned = getVal
				.replace(regex, '-')
				.replace(regexSpaces, '')
				.replace(regexNewLine, '')
				.replace('[', '')
				.replace(']', '')
				.replace('(', '')
				.replace(')', '')

			// Set the value of ticketInputPrompt
			document.querySelector('#ticketInputPrompt').value =
				lowSideTicketUpdateCleaned

			return lowSideTicketUpdateCleaned
		}

		function airportCodeInput() {
			let getVal
			let airportCodeCleaned

			getVal = document
				.querySelector('#airportCodePrompt')
				.value.toLowerCase()

			if (!getVal) {
				document.querySelector('#airportCode').textContent = '...'
				return
			}

			airportCodeCleaned = getVal
				.replace(regex, '-')
				.replace(regexSpaces, '')
				.replace(regexNewLine, '')
				.replace('[', '')
				.replace(']', '')
				.replace('(', '')
				.replace(')', '')

			return airportCodeCleaned
		}

		function regionInput() {
			let getVal
			let regionInputCleaned

			getVal = document
				.querySelector('#regionInputPrompt')
				.value.toLowerCase()

			if (!getVal) {
				document.querySelector('#regionCode').textContent = '...'
				return
			}

			regionInputCleaned = getVal
				.replace(regex, '-')
				.replace(regexSpaces, '')
				.replace(regexNewLine, '')
				.replace('[', '')
				.replace(']', '')
				.replace('(', '')
				.replace(')', '')

			return regionInputCleaned
		}

		function channelDetailsInput() {
			let getVal
			let slackDetailCleaned

			getVal = document
				.querySelector('#channelDetailsPrompt')
				.value.toLowerCase()

			if (!getVal) {
				document.querySelector('#channelDetails').textContent = '...'
				return
			}

			slackDetailCleaned = getVal
				.replace(regex, '-')
				.replace(regexSpaces, '')
				.replace(regexNewLine, '')
				.replace('[', '')
				.replace(']', '')
				.replace('(', '')
				.replace(')', '')
				.replace(/\s+/g, '-')
				.replace(/[-]+/g, '-')
				.replace(/^[-]+|[-_]+$/g, '')

			return slackDetailCleaned
		}

		function notesInput() {
			const getVal = document.querySelector('#channelTopicPrompt').value

			if (!getVal) {
				document.querySelector('#slackNotes').textContent = '...'
				return
			}

			return getVal
		}

		//^ -------------------------------- Copy Text ------------------------------- //

		const copyButton = document.getElementById('copyTextChannelPreview')
		copyButton.addEventListener('click', copyToClipboard)

		function copyToClipboard() {
			channelNamePreview.select()
			navigator.clipboard.writeText(channelNamePreview.value)
			copyButton.innerHTML = 'Copied'
			copyButton.classList.add('btn-success')

			setTimeout(() => {
				copyButton.innerHTML = 'Copy'
				copyButton.classList.remove('btn-success')
			}, 2500)
		}

		//^ -------------------------- Reset Forms -------------------------- //

		function noValueDots() {
			console.log('Resetting inputs to original values...')
			const ticketId = document.querySelector('#ticketId')
			const airportCode = document.querySelector('#airportCode')
			const regionCode = document.querySelector('#regionCode')
			const channelDetails = document.querySelector('#channelDetails')
			const slackNotes = document.querySelector('#slackNotes')
			const ticketInputPrompt =
				document.querySelector('#ticketInputPrompt')
			const airportCodePrompt =
				document.querySelector('#airportCodePrompt')
			const regionInputPrompt =
				document.querySelector('#regionInputPrompt')
			const channelDetailsPrompt = document.querySelector(
				'#channelDetailsPrompt'
			)
			const channelTopicPrompt = document.querySelector(
				'#channelTopicPrompt'
			)

			ticketId.textContent = ''
			airportCode.textContent = ''
			regionCode.textContent = ''
			channelDetails.textContent = ''
			slackNotes.textContent = ''
			ticketInputPrompt.value = ''
			airportCodePrompt.value = ''
			regionInputPrompt.value = ''
			channelDetailsPrompt.value = ''
			channelTopicPrompt.value = ''
		}

		//^ --------------------------- Check Input Forms -------------------------- //

		async function checkAllValues(characterLength) {
			const {
				ticketIdKey: ticketId,
				airportCodeKey: airportCode,
				regionCodeKey: regionCode,
				slackChannelDetailsKey: channelDetails,
				slackNotesKey: slackNotes,
			} = await getInput()

			if (!ticketId) {
				document
					.querySelector('#ticketInputPrompt')
					.classList.add('form-control')
				document
					.querySelector('#modalEditButtonToConfirmModal')
					.classList.add(
						'btn',
						'btn-primary',
						'btn-rounded',
						'disabled'
					)
			}

			if (ticketId && characterLength < 80) {
				document
					.querySelector('#modalEditButtonToConfirmModal')
					.classList.remove('disabled')
				document
					.querySelector('#modalEditButtonToConfirmModal')
					.classList.add('btn', 'btn-primary', 'btn-rounded')
			}

			if (!airportCode) {
				document
					.querySelector('#airportCodePrompt')
					.classList.add('form-control')
				document.querySelector('#airportCode').textContent = '...'
			}

			if (!regionCode) {
				document
					.querySelector('#regionInputPrompt')
					.classList.add('form-control')
				document.querySelector('#regionCode').textContent = '...'
			}

			if (!channelDetails) {
				document
					.querySelector('#channelDetailsPrompt')
					.classList.add('form-control')
				document.querySelector('#channelDetails').textContent = '...'
			}

			if (!slackNotes) {
				document
					.querySelector('#channelTopicPrompt')
					.classList.add('form-control')
				document.querySelector('#slackNotes').textContent = '...'
			}
		}
	}

	global()
}

//% -------------------------------------------------------------------------- //
//%                               End of program                               //
//% -------------------------------------------------------------------------- //
