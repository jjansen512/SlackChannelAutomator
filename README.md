# Slack Channel Automator

Webhook Version: `1.6.6` API Beta Version: `1.5.0`

**Important:**

> This extension serves as a portfolio demo and can be customized for a specific ticketing system. Currently, it is not configured to scrape usernames and ticket IDs or perform the final step of creating the Slack Channel. It is available to provide a general demonstration of the user interface.

> The extension works with URLs in the following format: `https://t.corp.{your_company}.com/<Ticket_ID>`. However, it can be easily tailored for any URL.

## Introduction

- The Slack Channel Automator aims to automate the repetitive task of creating a Slack channel to discuss critical production impacting tickets.
  - Engineers often manually open Slack and navigate between different rooms and DMs to complete this task, which takes time away from addressing the issue.

- There are two versions of the extension:
  - The version in the API directory interacts with the Slack API to fully automate the process of creating a channel and inviting users.
    - To use the API version, the user needs to enter their BOT token in the code and configure a SlackBot with the permissions to create channels.
    - Future functionality will be added to automate this step and eliminate the need for manual code editing.
  - The version in the webhook directory can be used with a Slack Workspace. It sends the user a message via webhook, allowing them to copy and paste the Slack commands into the message box.
- The extension is designed to create channels for tickets that use the SIM portal. However, it can also be used to create any Slack channel directly and add users in the select menu by manually typing usernames.

## Installation

### Download the extension for Firefox `Webhook Version` 👉 [here](https://github.com/jjansen512/SlackChannelAutomator/blob/master/highSeveritySlackChannelAutomator_webhook/Final_Extension/web-ext-artifacts/slackchannelautomator_webhook-1.6.7.xpi)

### Download the beta extension for Firefox `API Version` 👉 [here](https://d18inaxsxeymg3.cloudfront.net/8c9608cd34374b04adf0-1.4.7.xpi)

### Chrome Instructions

- In Chrome, the extension needs to be installed manually as an unpacked extension:
  - Clone the repository in code.youruserportal.yourcompany.com: `git clone ssh://git.youruserportal.yourcompany.com/pkg/HighSeveritySlackAutomator`
  - In Chrome, go to: `chrome://extensions` and enable developer mode.
  - Click "Load Unpacked" in the upper left.
  - Go to the cloned repository and open the extension from this directory: `highSeveritySlackChannelAutomator_webhook/dist/`.

### Video Demo

[![Slack Channel Automator Demo](https://img.youtube.com/vi/XlwKRvAZ5xQ/0.jpg)](https://youtu.be/XlwKRvAZ5xQ)

Click the image above to watch a video demonstration of how to install and use some of the features in the Slack Channel Automator.

## Configuration

- Here's an example of how to customize the extension with a specific Slack webhook URL or Bot token:

  - First, navigate to the main.js file here:

```shell
$ cd ./HighSeveritySlackAutomator/highSeveritySlackChannelAutomator_webhook/src/js
```

Or:

```shell
$ cd ./HighSeveritySlackAutomator/highSeveritySlackChannelAutomator_API/src/js
```

- Then find the following function and enter your specific information:
  - Additionally, the AWS API Gateway code can be uncommented if you wish to use the extension with a backend REST API.
    - It is worth noting that the function can easily be tweaked to work with another service besides AWS API Gateway.

```js
async function sendPayload(payloadToSend, slackNotes) {
	//...

	//! Code for interfacing with AWS API Gateway

	/*
				
	let pre

ppedFormData = JSON.stringify({
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

- In the API version, you would edit this function and enter your BOT token.

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

At a high level, this extension automates the repetitive process of creating Slack channels. Its scope is limited to creating private channels, inviting users to the channels, and setting channel topics. All of this can be done within the extension, eliminating the need to navigate around Slack and increasing productivity. Users collaborate on the channels to troubleshoot tickets in SIM `t.corp.{your_company}.com`.

_In summary, the extension addresses the following identified problems and provides solutions:_

- Creating a Slack channel for tickets is time-consuming and distracting for engineers.
- This manual process takes valuable time away from addressing high-severity tickets.
- Engineers must manually switch between rooms and DMs on Slack, as well as post comments on various SIM tickets to bring in desired help.

_The extension automatically solves these problems by:_

- Creating a Slack channel with an identifiable title related to the ticket.
- Adding the engineer logged into Slack, as well as users who interacted with the ticket, to the new channel.
- Optionally setting a topic entered by the engineer.

## Operational Overview

- The extension is built using JavaScript and is compatible with modern browsers. There is a version for Firefox and a version compatible with Chromium that needs to be installed as an unpacked extension.
- When the engineer loads the extension, it parses HTML from the current tab in SIM and performs the following actions:
  - Extracts the ticket ID.
  - Stores all user aliases who have commented on the ticket in a JSON payload.
- The user enters information in the input form, including region code, and channel details if desired.
- Once submitted, the extension:
  - Sends a POST request containing the payload via a secure HTTPS connection and an API key.
    - There's an option to send the POST request to AWS Lambda for added security or directly to the Slack webhook or API.