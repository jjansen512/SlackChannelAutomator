import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import makeAnimated from 'react-select/animated'

let userAliases = [] // Active users who have commented on SIM ticket
let uniqueAliases = [] // Duplicate aliases removed sortet ascending
let selectionAliases = [] // User selected aliases
let popupClicked // Boolean to check if popup was clicked
let ticketTitle // Title of the ticket

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
			await waitForUsers() // Update uniqueAliases array with new data
		}
	)
}

const TicketSelect = (props) => {
	const [selectedTabChanged, setSelectedTabChanged] = useState(false)
	const [tabUrls, setTabUrls] = useState([])
	const [options, setOptions] = useState([])
	const [refreshTabs, setRefreshTabs] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [tabTitle, setTabTitle] = useState(ticketTitle)
	const themeState = document.getElementById('extHTML').className

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

	const handleOpenTicketSelectModal = () => {
		setSelectedTabChanged((prev) => !prev)

		$('#selectTicketTitleButtonModal').modal('show')
	}

	useEffect(() => {
		if (tabTitle !== 'SIM Ticketing') {
			handleMatchingTabUrls()
		}
	}, [refreshTabs, selectedTabChanged])

	async function handleMatchingTabUrls() {
		setIsLoading(true)

		// Get URLs of all tabs in normal windows
		const regex = /^[a-zA-Z]\d{0,14}$/

		// Wrap queryTabs in a promise
		const queryTabsPromise = (options) =>
			new Promise((resolve) => {
				queryTabs(options, (tabs) => {
					resolve(tabs)
				})
			})

		const checkTabs = async (options) => {
			const tabs = await queryTabsPromise(options)
			let newTabUrls = []

			// Use for of loop to check if the tab urls contain t.corp.youruserportal.yourcompany.com
			for (let tab of tabs) {
				if (tab.url.includes('t.corp.youruserportal.yourcompany.com')) {
					// If tabUrl in tabUrls array matches the regex,
					// then push the tabId, tabUrl, and tabTitle to the tabUrls array
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
			currentWindow: popupClicked ? false : true,
			active: true,
		})

		const inactiveTabs = await checkTabs({
			currentWindow: popupClicked ? false : true,
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

			// log each object in tabUrls
			console.log('Urls available for selection:', newTabUrls)
		}

		// The array is empty
		if (newTabUrls.length === 0) {
			console.log('No matching domain or URLs found in current window')
		}
		setTimeout(() => {
			setIsLoading(false)
		}, 1000)
	}

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
		props.onButtonDisable(isLoading)
	}, [isLoading])

	return (
		<>
			<Select
				className="basic-single"
				classNamePrefix="select"
				options={options}
				isLoading={isLoading}
				isDisabled={isLoading}
				isMulti={false}
				onChange={(selectedOptions) => {
					if (selectedOptions) {
						switchToTab((ticketTitle) => {
							// If an option is selected
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

							setSelectedTabChanged((prev) => !prev)
							setTabTitle(ticketTitle)
						})
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

localStorage.removeItem('popupClicked') // Reset popupClicked boolean

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

		console.log(`Active users on t.corp.youruserportal.yourcompany.com:`, `${uniqueAliases}`)

		if (uniqueAliases) {
			let data = uniqueAliases
			uniqueAliases = data.map((alias) => {
				return { value: alias, label: alias }
			})
		}

		console.log(
			`userAlias array returned when clicking select:`,
			`${uniqueAliases}`
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

	//^ ----------------------------- Alias Selector ----------------------------- //

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

//^ ---------------------- Inject Script Active Users ----------------------- //

async function getUserAliases() {
	return new Promise((resolve, reject) => {
		queryTabs(
			{
				currentWindow: popupClicked ? false : true,
				active: true,
				windowType: 'normal',
			},
			(tabs) => {
				// Inject script into the active tab

				chrome.tabs.executeScript(
					tabs[0].id,
					{
						code: `
									var userElements = document.querySelectorAll('span.sim-userPopover--name');

									// Extract the className and child node for each span element
									var userInfo = [];
									for (let i = 0; i < userElements.length; i++) {
										let childNode = userElements[i].childNodes[0].data;

										userInfo.push(childNode);
									}
									chrome.runtime.sendMessage(userInfo);
							`,
					},
					(results) => {
						chrome.runtime.lastError
							? reject(chrome.runtime.lastError.message)
							: resolve(results[0])
					}
				)
			}
		)
	}).catch((err) => {
		// Handle rejection here
		return console.dir(err)
	})
}
