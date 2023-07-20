function test() {
	var url_href = window.location.href
	var issueID = ''
	if (url_href.indexOf('selectedDocument') > -1) {
		var match = url_href.match(/selectedDocument=([a-z0-9-]+)/) || []
		issueID = match[1]
	} else {
		var path = window.location.pathname.split('/')
		console.log(`path = ${path}`)
		issueID = path[1]
	}
	console.log('issueID = ' + issueID)

	var domain = window.location.hostname
	var maxisDomain = ''

	if (domain.indexOf('dca') > -1) {
		maxisDomain = 'maxis-service-prod.dca.c2s-border.ic.gov'
	} else if (domain.indexOf('apa') > -1) {
		maxisDomain = 'maxis-service-prod.dca.c2s-border.ic.gov'
	} else if (domain.indexOf('lck') > -1) {
		maxisDomain = 'maxis-service-prod-lck.lck.amazon.com'
	} else {
		maxisDomain = 'maxis-service-prod-iad.amazon.com'
	}

	var maxisURL = `https://${maxisDomain}/issues/${issueID}`
	console.log('maxisURL = ' + maxisURL)

	// Create a request to maxis-service
	var xhr = new XMLHttpRequest()
	xhr.open('GET', maxisURL, true)
	xhr.withCredentials = true
	xhr.responseType = 'json'
	xhr.onload = function () {
		if (xhr.status == 200) {
			var response_json = xhr.response

			console.log(`Response: ${JSON.stringify(response_json)}`)

			var aliases_json = xhr.response.aliases
			aliases_json.sort(GetreverseSortOrder('precedence'))

			var aliases = []

			for (var i = 0; i < aliases_json.length; i++) {
				var obj = aliases_json[i]
				if (aliases.includes(obj.id)) {
				} else {
					aliases.push(obj.id)
				}
			}

			aliases.reverse()

			add_ticket_id(aliases)

			// Fall back to adding the first alias.
			if (match_found == false) {
				console.log(
					'Add Ticket ID [0] to document.title: ' + aliases[0]
				)
				document.title = aliases[0] + ': ' + document.title
			}
			//}
		} else {
			console.log('Unable to retrieve issue details from Maxis endpoint')
		}
	}
	xhr.send()
}
test()
