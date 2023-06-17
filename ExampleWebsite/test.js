let userElements = document.querySelectorAll('#ticket-list > li > strong')

// Extract the className and child node for each span element
let userInfo = []
for (const element of userElements) {
	let childNode = element.childNodes[0].data
	userInfo.push(childNode)
}

chrome.runtime.sendMessage(userInfo)

console.log(userInfo)
document.querySelector('body > nav > ul > li:nth-child(2) > a').click()
