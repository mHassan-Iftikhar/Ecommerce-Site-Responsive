// Chatbot JS logic
(function() {
    // Load chatbot HTML into #chatbot-root
    fetch('chatbot/chatbot.html')
        .then(res => res.text())
        .then(html => {
            var root = document.getElementById('chatbot-root');
            if (root) root.innerHTML = html;
            initChatbot();
        });

    function initChatbot() {
        const chatContainer = document.getElementById('chatContainer');
        const chatMessages = document.getElementById('chatMessages');
        const userInput = document.getElementById('userInput');
        const sendButton = document.getElementById('sendButton');
        const chatbotIcon = document.getElementById('chatbotIcon');
        const closeChat = document.getElementById('closeChat');

        function toggleChat() {
            chatContainer.classList.toggle('hidden');
        }
        chatbotIcon.addEventListener('click', function() {
            toggleChat();
            if (!chatContainer.classList.contains('hidden')) {
                setTimeout(() => {
                    userInput.focus();
                }, 300);
            }
        });
        closeChat.addEventListener('click', toggleChat);
        function addMessage(text, isUser) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
            messageDiv.textContent = text;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        function showTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.classList.add('typing-indicator');
            typingDiv.id = 'typingIndicator';
            typingDiv.innerHTML = `
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            `;
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        function removeTypingIndicator() {
            const typingIndicator = document.getElementById('typingIndicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }
        function getBotResponse(userMessage) {
            showTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                let botResponse = "";
                userMessage = userMessage.toLowerCase();
                if (userMessage.includes('product') || userMessage.includes('item')) {
                    botResponse = "We have a wide range of products in our store. Our inventory includes electronics, clothing, home goods, and more. Is there a specific product category you're interested in?";
                } else if (userMessage.includes('order') || userMessage.includes('status')) {
                    botResponse = "To check your order status, I'll need your order number. You can also visit the 'Order History' section in your account dashboard for detailed information.";
                } else if (userMessage.includes('return') || userMessage.includes('refund')) {
                    botResponse = "We have a 30-day return policy for most items. Items must be in original condition with tags attached. Would you like to initiate a return process?";
                } else if (userMessage.includes('shipping') || userMessage.includes('delivery')) {
                    botResponse = "We offer standard shipping (3-5 business days), express shipping (2-3 business days), and overnight shipping. Shipping costs vary based on the method and destination.";
                } else if (userMessage.includes('payment') || userMessage.includes('pay')) {
                    botResponse = "We accept all major credit cards, PayPal, Apple Pay, and Google Pay. All payments are processed securely through encrypted channels.";
                } else if (userMessage.includes('discount') || userMessage.includes('promo') || userMessage.includes('coupon')) {
                    botResponse = "We currently have a summer sale with up to 30% off selected items. Use code SUMMER25 at checkout for an extra 10% off your entire order.";
                } else if (userMessage.includes('account') || userMessage.includes('login')) {
                    botResponse = "You can create an account during checkout or by visiting the 'Sign Up' page. Having an account allows you to track orders, save favorites, and get personalized recommendations.";
                } else {
                    botResponse = "I specialize in helping with e-commerce related questions. I can assist with product information, order status, returns, shipping, payment methods, and general website navigation. What would you like to know?";
                }
                addMessage(botResponse, false);
            }, 1500);
        }
        sendButton.addEventListener('click', function() {
            const message = userInput.value.trim();
            if (message) {
                addMessage(message, true);
                userInput.value = '';
                getBotResponse(message);
            }
        });
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendButton.click();
            }
        });
    }
})();
