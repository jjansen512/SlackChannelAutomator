import axios from 'axios'
import fs from 'fs'

async function handleWebhook() {
	// load JSON from file named payload.json

	const jsonPayloadReceived = fs.readFileSync('./payload.json')
	console.log(`Payload Loaded: ${jsonPayloadReceived}`)

	const jsonPayload = JSON.parse(jsonPayloadReceived)
	const slackChannelName = jsonPayload.slackChannelName
	const currentUserAlias = jsonPayload.currentUserAlias
	const activeUsers = jsonPayload.activeUsers

	const webhookUrl =
		'https://hooks.slack.com/workflows/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'

	let notes = jsonPayload.notes
	let aliases

	if (activeUsers.length > 0) {
		aliases = await activeUsers.map((user) => `@${user}`).join(', ')
	} else {
		aliases = 'No active users selected'
	}

	if (!notes) {
		notes = 'No topic entered'
	}

	console.log(`
					
			Channel Name: ${slackChannelName}
			Active User Aliases: ${activeUsers}
			Current User Alias:  ${currentUserAlias}
			Slack Aliases (@user): ${aliases}
			Channel Topic:  ${notes}
			
			`)

	try {
		// Make webhook payload
		var bodyContent = {
			slackChannelName: slackChannelName,
			currentUserAlias: currentUserAlias,
			activeUsers: aliases,
			notes: notes,
		}

		var headersList = {
			'Content-Type': 'application/json; charset=utf-8',
		}

		var reqOptions = {
			url: webhookUrl,
			method: 'POST',
			headers: headersList,
			data: bodyContent,
			timeout: 20000,
		}

		var response = await axios.request(reqOptions)

		// Log response
		console.log(`Response: ${response}`)

		var responseFrontEnd = {
			statusCode: 200,
			body: bodyContent,
		}

		console.log(`Response Front End:`, `${JSON.stringify(responseFrontEnd)}`)

		return responseFrontEnd
	} catch (error) {
		console.error(`Exception in Lambda functon: ${error.message}`)
		console.error(`Exception Stack: ${error.stack}`)
		console.error(`Exception Code: ${error.code}`)
		console.error(`Exception Config: ${JSON.stringify(error.config)}`)
		console.error(`Exception Headers: ${JSON.stringify(error.headers)}`)
		console.error(`Exception Request: ${JSON.stringify(error.request)}`)

		return {
			statusCode: 400,
			body: error,
		}
	}
}
handleWebhook()
