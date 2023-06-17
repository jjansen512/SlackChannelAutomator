document.addEventListener('DOMContentLoaded', loadTickets)

function submitTicket() {
	const username = document.getElementById('username').value
	const ticket = document.getElementById('ticket').value

	if (username.trim() === '' || ticket.trim() === '') {
		alert('Please fill in both username and ticket')
		return
	}

	let tickets = JSON.parse(localStorage.getItem('tickets') || '[]')

	tickets.push({
		username: username,
		ticket: ticket,
	})

	localStorage.setItem('tickets', JSON.stringify(tickets))

	document.getElementById('username').value = ''
	document.getElementById('ticket').value = ''

	loadTickets()
}

function loadTickets() {
	const tickets = JSON.parse(localStorage.getItem('tickets') || '[]')
	const ticketList =
		document.getElementById('ticket-list') ||
		document.getElementById('ticket-list-communication')

	if (ticketList) {
		ticketList.innerHTML = ''
		tickets.forEach(function (ticket) {
			const listItem = document.createElement('li')
			listItem.innerHTML = `<strong>${ticket.username}:</strong> ${ticket.ticket}`
			ticketList.appendChild(listItem)
		})
	}
}
