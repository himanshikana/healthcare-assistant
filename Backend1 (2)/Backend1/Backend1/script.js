document.addEventListener("DOMContentLoaded", () => {
    const chatWindow = document.getElementById("chat-window");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");

    function appendMessage(sender, message) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add(sender);
        messageDiv.textContent = message;
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    sendButton.addEventListener("click", async () => {
        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        appendMessage("user", `You: ${userMessage}`);
        userInput.value = "";

        try {
            const response = await fetch("http://127.0.0.1:5000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await response.json();
            appendMessage("bot", `Bot: ${data.response}`);
        } catch (error) {
            console.error("Error:", error);
            appendMessage("bot", "Error: Unable to connect to chatbot.");
        }
    });
});
