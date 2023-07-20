const axios = require('axios')

// Global variables
exports.handler = async (event) => {
	//
	// Set JSON payload received from front-end to global variable
	const jsonPayload = event

	console.log('Event JSON:', jsonPayload)

	// Global constants
	let responseChannelCreate
	let responseGetSlackIds
	let responseInvite
	let responseSetTopic
	let channelId
	let sseData = {}
	let userIds = []

	const slackChannelName = jsonPayload.slackChannelName
	const currentUserAlias = jsonPayload.currentUserAlias
	const activeUsers = jsonPayload.activeUsers
	const notes = jsonPayload.notes
	const token = 'xoxb-4336805381572-4340538201219-V3LPnnVMaIvs2RuzCb2nuzns'

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
			console.log('conversations.create response:', responseChannelCreate.data)

			channelId = responseChannelCreate.data.channel.id
			sseData.channelId = channelId

			console.log(`Channel named ${slackChannelName} created!`)
			console.log(`Set the channel Id to: ${channelId}`)

			console.log(
				`////////////////////////////////////////////////////////////////////////////////////////////`
			)
			console.log(
				`////////////////////////////////////////////////////////////////////////////////////////////`
			)
			console.log(
				`////////////////////////////////////////////////////////////////////////////////////////////`
			)

			// Convert userAliases to email

			const emails = [currentUserAlias, ...activeUsers].map((user) => {
				return user.concat('@amazon.com')
			})
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

				console.log('User Id lookup Response: ', responseGetSlackIds.data)
				console.log('Slack User Ids: ', userIds)

				try {
					var bodyContent = JSON.stringify({
						channel: channelId,
						users: userIds.join(','),
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
					console.log('conversations.invite response: ', responseInvite.data)
					console.log('Users invited to channel...')

					console.log(
						`////////////////////////////////////////////////////////////////////////////////////////////`
					)
					console.log(
						`////////////////////////////////////////////////////////////////////////////////////////////`
					)
					console.log(
						`////////////////////////////////////////////////////////////////////////////////////////////`
					)

					try {
						var bodyContent = JSON.stringify({
							channel: channelId,
							topic: notes,
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
						console.error('conversations.setTopic error: ', error)
					}

					if (responseSetTopic.data.ok) {
						console.log('Channel topic set...')
						console.log('Channel topic: ', responseSetTopic.data)
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
	console.log('response: ' + response)
	return response
}
