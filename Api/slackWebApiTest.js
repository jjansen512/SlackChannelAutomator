import { WebClient, LogLevel } from '@slack/web-api'

try {
	// Parse the request body as JSON
	const jsonPayload = {
		slackChannelName: 'hello-there-general-kenobi',
		currentUserAlias: 'jjansena',
		activeUsers: ['gshondal', 'kevswans'],
		notes: 'ddb alarm fails',
	}

	console.log('Payload pending...')
	console.log('Event JSON received:', jsonPayload)

	const slackChannelName = jsonPayload.slackChannelName
	const currentUserAlias = jsonPayload.currentUserAlias
	const activeUsers = jsonPayload.activeUsers
	const notes = jsonPayload.notes

	slackApi(slackChannelName, currentUserAlias, activeUsers, notes)
} catch (error) {
	// If the request body is not valid JSON, return an error
	console.error(error)
}

async function slackApi(
	slackChannelName,
	currentUserAlias,
	activeUsers,
	notes
) {
	let sseData = []
	let userIds = []
	let response
	let channelId

	// Enter bot token here
	const token = 'xoxb-4336805381572-4340538201219-V3LPnnVMaIvs2RuzCb2nuzns'

	try {
		console.log(`
					
					Channel Name: ${slackChannelName}
					Active User Aliases: ${activeUsers}
					Current User Alias:  ${currentUserAlias}
					Channel Topic:  ${notes}
					
					`)

		console.log(`slackChannelName: ${slackChannelName}`)
		console.log(`currentUserAlias: ${currentUserAlias}`)
		console.log(`activeUsers: ${activeUsers}`)
		console.log(`notes: ${notes}`)

		// Create slack channel

		const web = new WebClient(token, {
			// Import LogLevel for DEBUG
			logLevel: LogLevel.DEBUG,
		})

		response = await web.conversations.create({
			name: slackChannelName,
			is_private: 'false',
		})

		console.log('Channel Id Response:', response)

		try {
			if (response.ok) {
				channelId = response.channel.id

				sseData.channelId = channelId

				console.log(`Channel named ${slackChannelName} created!`)
				console.log(`Set the channel Id to: ${channelId}`)

				// Convert userAliases to email

				const emails = [currentUserAlias, ...activeUsers].map(
					(user) => `${user}@amazon.com`
				)

				console.log('User Emails:', emails)

				for (const email of emails) {
					sseData.emails = email

					response = await web.users.lookupByEmail({
						email: email,
					})

					console.log('User Id lookup Response: ', response)
					if (response.ok === true) {
						userIds.push(response.user.id)
						console.log('User Ids: ', userIds)

						response = await web.conversations.invite({
							channel: channelId,
							users: userIds.join(','),
						})
						if (response.ok) {
							console.log('Users invited to channel')

							console.log(
								`////////////////////////////////////////////////////////////////////////////////////////////`
							)
							console.log(
								`////////////////////////////////////////////////////////////////////////////////////////////`
							)
							console.log(
								`////////////////////////////////////////////////////////////////////////////////////////////`
							)

							response = await web.conversations.setTopic({
								channel: channelId,
								topic: notes,
							})
							if (response.ok) {
								console.log('Channel topic set')
							} else {
								throw new Error(response.error)
							}

							console.log('Sending response to the front-end...')
							console.log('SSE Payload', sseData)
						} else {
							throw new Error('Error when inviting users:', response.error)
						}
					} else {
						throw new Error('Error when looking up User Ids: ', response.error)
					}
				}
			} else {
				console.log('A different response was received: ', response)
			}
		} catch {
			console.log('Errors detected from Slack Api request: ', response.error)
		}
	} catch (error) {
		console.error('Errors in overall function: ', error)
	}
}
