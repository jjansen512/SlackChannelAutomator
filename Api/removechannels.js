import axios from 'axios'

const token = 'xoxb-4336805381572-4340538201219-V3LPnnVMaIvs2RuzCb2nuzns'
const tokenUser =
	'xoxp-4336805381572-4346990501553-4343516568434-df5e36e2844c528d9ebea7a734346a42'

const axiosConfig = {
	headers: {
		'Content-Type': 'application/json; charset=utf-8',
	},
}

async function deleteAllMessages() {
	try {
		const response = await axios.get(
			'https://slack.com/api/conversations.list',
			{
				headers: { ...axiosConfig.headers, Authorization: `Bearer ${token}` },
			},
		)

		const dmThreadId = response.data.channels.find(
			(channel) => channel.is_im && channel.user === 'USLACKBOT',
		)?.id

		if (!dmThreadId) {
			console.log('No direct message thread found with Slackbot.')
			return
		}

		const messagesResponse = await axios.get(
			`https://slack.com/api/conversations.history?channel=${dmThreadId}`,
			{
				headers: { ...axiosConfig.headers, Authorization: `Bearer ${token}` },
			},
		)

		const messages = messagesResponse.data.messages

		if (messages) {
			for (const message of messages) {
				await axios.post(
					'https://slack.com/api/chat.delete',
					{
						channel: dmThreadId,
						ts: message.ts,
					},
					{
						headers: {
							...axiosConfig.headers,
							Authorization: `Bearer ${token}`,
						},
					},
				)
			}
		} else {
			console.log('No messages found in direct message thread with Slackbot.')
		}
	} catch (error) {
		console.error(error)
	}
}

async function deleteSlackChannels() {
	try {
		const reqOptions = {
			url: 'https://slack.com/api/conversations.list',
			method: 'GET',
			headers: { ...axiosConfig.headers, Authorization: `Bearer ${token}` },
			params: {
				types: 'public_channel,private_channel',
				exclude_archived: 'true',
				limit: '1000',
			},
		}

		const response = await axios.request(reqOptions)

		if (!response.data.ok) {
			console.log(
				'Error when calling conversations.list: ',
				response.data.error,
			)
			return
		}

		const channelsToFilter = response.data.channels

		if (!channelsToFilter || !channelsToFilter.length) {
			console.log('Error: response.data.channels array is missing or empty')
			return
		}

		const filteredChannels = channelsToFilter.filter(
			(channel) => !channel.is_general && !channel.is_archived,
		)

		const channelArray = filteredChannels.map((channel) => channel.id)
		const channelArrayName = filteredChannels.map((channel) => channel.name)

		console.log(
			'Filtered out archived channels...',
			'Active Channels to archive: ',
			channelArray,
			'Channel Names ',
			channelArrayName,
		)

		for (const channelId of channelArray) {
			try {
				const archiveResponse = await axios.post(
					'https://slack.com/api/conversations.archive',
					{ channel: channelId },
					{
						headers: {
							...axiosConfig.headers,
							Authorization: `Bearer ${token}`,
						},
					},
				)

				if (!archiveResponse.data.ok) {
					console.log('Error: ', archiveResponse.data.error)
					continue
				}

				console.log(
					'Archived channel successful response: ',
					archiveResponse.data,
				)

				await axios.post(
					'https://slack.com/api/conversations.leave',
					{ channel: channelId },
					{
						headers: {
							...axiosConfig.headers,
							Authorization: `Bearer ${tokenUser}`,
						},
					},
				)
			} catch (err) {
				if (err.response && err.response.headers['retry-after']) {
					const secondsToWait = err.response.headers['retry-after']

					console.log(`Waiting ${secondsToWait} seconds before retrying`)

					await new Promise((resolve) =>
						setTimeout(resolve, secondsToWait * 1000),
					)

					deleteSlackChannels()
				} else {
					console.error(err)
				}
			}
		}
	} catch (err) {
		if (err.response && err.response.headers['retry-after']) {
			const secondsToWait = err.response.headers['retry-after']

			console.log(`Waiting ${secondsToWait} seconds before retrying`)

			await new Promise((resolve) => setTimeout(resolve, secondsToWait * 1000))

			deleteSlackChannels()
		} else {
			console.error(err)
		}
	}
}

;(async () => {
	await deleteAllMessages()
	await deleteSlackChannels()
})()
