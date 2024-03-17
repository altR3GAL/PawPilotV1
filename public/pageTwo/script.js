
document.getElementById('message-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const input = document.getElementById('message-input');
    const message = input.value.trim();
    if (message) {
        sendMessage(message);
        input.value = ''; // Clear input after sending
    }
});

function sendMessage(message) {
    // Display the user's message in the chat interface
    const userMessageContainer = document.getElementById('messages-container');
    const userMsgHtml = `<div class="message user-message"><p>${message}</p></div>`;
    userMessageContainer.innerHTML += userMsgHtml;
    userMessageContainer.scrollTop = userMessageContainer.scrollHeight; // Scroll to the bottom

    // Send the user's message to the server to get a response
    fetch('/askResource', { // Notice the endpoint change here to match the server's endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userMessage: message }), // Ensure the key matches what the server expects
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success && data.response) {
            // Display the server's response
            receiveMessage(data.response);
        } else {
            console.error('Failed to get a proper response', data.message);
            receiveMessage('Sorry, I cannot respond at the moment.');
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        receiveMessage('Sorry, I cannot respond at the moment.');
    });
}

function receiveMessage(message) {
    message = message.replace(/\./g, '.<br><br>'); // Keep your formatting if needed
    const container = document.getElementById('messages-container');
    const msgHtml = `<div class="message ai-message"><p>${message}</p></div>`;
    container.innerHTML += msgHtml;
    container.scrollTop = container.scrollHeight; // Scroll to the bottom
}
