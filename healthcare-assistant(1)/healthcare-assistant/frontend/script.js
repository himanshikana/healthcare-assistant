function sendMessage() {
    let userInput = document.getElementById("user-input").value;
    if (userInput.trim() === "") return;

    let chatBox = document.getElementById("chat-box");

    // Display user message
    chatBox.innerHTML += `<div style="text-align: right; margin-bottom: 8px;"><b>You:</b> ${userInput}</div>`;
    document.getElementById("user-input").value = "";

    // Show "Typing..." message
    let typingMessage = document.createElement("div");
    typingMessage.id = "typing";
    typingMessage.style.textAlign = "left";
    typingMessage.style.color = "gray";
    typingMessage.innerHTML = "Bot is typing...";
    chatBox.appendChild(typingMessage);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Send request to Flask API
    fetch("http://127.0.0.1:5000/api/chatbot", {  // Check if this URL matches your backend
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput })  
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("typing").remove();
        chatBox.innerHTML += `<div style="text-align: left; margin-bottom: 8px;"><b>Bot:</b> ${data.response}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("typing").remove();
        chatBox.innerHTML += `<div style="text-align: left; color: red;"><b>Error:</b> Could not reach the server.</div>`;
    });
}
