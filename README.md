# Slack Channel Automator

Webhook Version: `1.6.6` Api Beta Version: `1.5.0`

**Important:**

> This extension is a portfolio demo and it can be customized for a particular ticketing system. In it's current state, it has not been configured to scrape usernames and ticket IDs or to run the final step of creating the Slack Channel. It is available to give a general demonstration of the UI.

> The extension works with URLs in the following format: `https://t.corp.{your_company}.com/<Ticket_ID>` 
>   > It can easily be tailored for any url however.

## Introduction

- The  Slack Channel Automator aims to automate the repetitive task of creating a Slack channel to discuss
critical production impacting tickets.
  - Engineers often need to manually open Slack, and navigate between different rooms and DMs to complete this task taking time away from addressing the issue.

- There are two versions of the extension:
  - The version in the Api directory interacts with the Slack API to fully automate creating a channel and invite users.
    - In order to use the Api version, a user must enter their BOT token in the code, as well as configure a SlackBot with the _create.channel_ permissions.
    - Functionallity will be added in the future to automate this step so the user doesn't have to manually edit the code.
  - The version in the webhook directory is able to be used with a Slack Workspace. It sends the user a message via
    webhook, so they can copy and paste the Slack commands into the message box.
- The extension is designed to create channels for tickets that use the SIM portal; however, it can also be used to create any Slack channel directly, and add users in the select menu by manually typing usernames.

## Installation

### Download the extension for Firefox `Webhook Version` 👉 [here](https://github.com/jjansen512/SlackChannelAutomator/blob/master/highSeveritySlackChannelAutomator_webhook/Final_Extension/web-ext-artifacts/slackchannelautomator_webhook-1.6.7.xpi)

### Download the beta extension for Firefox `API Version` 👉 [here](https://d18inaxsxeymg3.cloudfront.net/8c9608cd34374b04adf0-1.4.7.xpi)

### Chrome Instructions

- In Chrome it will need to be installed manually as an unpacked estension:
  - Clone the repository in code.youruserportal.yourcompany.com: `git clone ssh://git.youruserportal.yourcompany.com/pkg/HighSeveritySlackAutomator`
  - In Chrome, go to: `chrome://extensions`, and enable developer mode.
  - Load Unpacked in the upper left.
  - Go to the cloned repository and open the extension from this directory:
    `highSeveritySlackChannelAutomator_webhook/dist/`.

## Configuration

- Here's an example of where to customize the extension with a specific Slack webhook url, or Bot token... 

  - First, cd to the main.js file here:

```shell
$ cd ./HighSeveritySlackAutomator/highSeveritySlackChannelAutomator_webhook/src/js
```

Or:

```shell
$ cd ./HighSeveritySlackAutomator/highSeveritySlackChannelAutomator_API/src/js
```

- Then find this function below and enter your specific information
  - Additionally, the AWS API Gateway code can be un-commented if you wish to use the extension with a backend rest API.
    - It is worth noting that function can easily be tweaked to work with another service besides AWS API Gateway.

```js
async function sendPayload(payloadToSend, slackNotes) {
	//...

	//! Code for interfacing with AWS API Gateway

	/*
				
	let preppedFormData = JSON.stringify({
		slackChannelName: payloadToSend,
		currentUserAlias: currentUser,
		activeUsers: selectionAliases,
		notes: slackNotes,
		httpsAgent: agent,
	})

		//! Enter API Gateway Info Here if using Lambda
	let url = 'your-api-gateway-url'

	console.log('Sending payload:', preppedFormData)

	//! Enter your youruserportal.yourcompany.com API gateway key here if using Lambda
	let headersList = {
		'Content-Type': 'application/json',
		'x-api-key': 'aws-api-gateway-key',
	}
	let reqOptions = {
		url: url,
		method: 'POST',
		headers: headersList,
		data: preppedFormData,
	}

	let response = await axios.request(reqOptions)

*/

	//! Directly send request to Slack Webhook

	const webhookUrl = 'https://hooks.slack.com/workflows/{your_specific_code_here}'

	let webhookNotes = slackNotes
	let webhookAliases

	if (selectionAliases.length > 0) {
		webhookAliases = selectionAliases.map((user) => `@${user}`).join(', ')
	} else {
		webhookAliases = 'No active users selected'
	}

	if (!notes) {
		notes = 'No topic entered'
	}

	// Make webhook payload
	let bodyContent = {
		slackChannelName: payloadToSend,
		currentUserAlias: currentUser,
		activeUsers: webhookAliases,
		notes: webhookNotes,
		httpsAgent: agent,
	}

	let headersList = {
		'Content-Type': 'application/json; charset=utf-8',
	}

	let reqOptions = {
		url: webhookUrl,
		method: 'POST',
		headers: headersList,
		data: bodyContent,
		timeout: 20000,
	}

	let response = await axios.request(reqOptions)
	//...
}
```

- In the API version, you would edit this function, entering your BOT token.

```js

// ...

//! Enter bot token here
const token = 'xoxb-....'

// Send POST Request to api_gatway
async function sendPayload(payloadToSend, slackNotes) {
	const slackChannelName = payloadToSend
	const currentUserAlias = currentUser
	const activeUsers = selectionAliases
	const notes = slackNotes
	const httpsAgent = agent

	// ...
	
	}
```

## How it Works

High level, this extension automates repetitive Slack channel creation processes. Its scope is limited to creating
private channels, inviting users to the channels, and setting channel topics. All this can be done in an extension
rather than navigating around Slack, increasing productivity. On the channels, users collaborate to troubleshoot tickets
in SIM `t.corp.{your_company}.com`.

_In summary, the below problems were identified, and the extension addresses them:_

- Creating a Slack channel for tickets is time-consuming and distracting for engineers.
- This manual process can take valuable time away from addressing high-severity tickets.
- Engineers must manually switch between rooms and DMs on Slack, as well as post comments on various SIM tickets to
  bring in desired help.

_The extension solves these problems automatically by:_

- Creating a Slack channel with an identifiable title relating to the ticket.
- Adding the engineer logged into Slack, as well as users who interacted with the ticket to the new channel.
- If desired, setting a topic entered by the engineer.

## Operational Overview

- The extension is built using JavaScript and is compatible with modern browsers. There is a Firefox version and a pending Chromium-compatible version that needs to be installed as an unpacked
  extension.
- When the engineer loads the extension, it parses HTML from the current tab from SIM and:
  - Extracts the ticket ID
  - Stores all user aliases who have commented on the ticket in a JSON payload.
- The user enters information in the input form, including airport code, region, and channel details.
- Once submitted, the extension:
  - Sends a POST request containing the payload via a secure HTTPS connection and an API key.
    - There's an option to send the POST request to AWS lambda for added security or directly to the Slack webhook.
