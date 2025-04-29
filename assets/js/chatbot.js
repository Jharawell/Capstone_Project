// Chatbot functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatToggle = document.getElementById('chat-toggle');
    const closeChat = document.getElementById('close-chat');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const typingIndicator = document.getElementById('typing-indicator');
    const faqQuestions = document.querySelectorAll('.faq-question');

    // Chatbot responses
    const responses = {
        1: {
            title: "Letter Submission Requirements",
            content: "To submit a letter to Baguio City Hall, please ensure you have the following:\n\n" +
                    "1. Original letter with complete details\n" +
                    "2. Valid ID of the sender\n" +
                    "3. Supporting documents (if applicable)\n" +
                    "4. Contact information\n\n" +
                    "Letters can be submitted at the Receiving Section during office hours (8:00 AM - 5:00 PM, Monday to Friday)."
        },
        2: {
            title: "Office Location & Hours",
            content: "Baguio City Hall, Baguio City Benguet\n\n" +
                    "City Hall Drive, Baguio City\n" +
                    "Benguet, Philippines\n\n" +
                    "Office Hours:\n" +
                    "Monday to Friday: 8:00 AM - 5:00 PM\n" +
                    "Closed on weekends and holidays"
        },
        3: {
            title: "Contact Information",
            content: "You can reach us through:\n\n" +
                    "Phone: (074) 442-3939\n" +
                    "Email: cmobaguio2600@gmail.com\n" +
                    "Address: City Hall Drive, Baguio City\n\n" +
                    "For urgent concerns, please call our hotline."
        },
        4: {
            title: "Processing Timeline",
            content: "The processing time for letters varies depending on the type:\n\n" +
                    "1. Regular Letters: 3-5 working days\n" +
                    "2. Urgent Letters: 1-2 working days\n" +
                    "3. Special Requests: Subject to approval\n\n" +
                    "You can track your letter's status using the control number provided upon submission."
        },
        5: {
            title: "Status Updates & Support",
            content: "To check your letter's status:\n\n" +
                    "1. Use the tracking system on our website\n" +
                    "2. Call our hotline\n" +
                    "3. Visit the Receiving Section\n\n" +
                    "For additional support, our staff is available during office hours to assist you."
        }
    };

    // Toggle chatbot visibility
    chatToggle.addEventListener('click', function() {
        chatbotContainer.style.display = 'flex';
        setTimeout(() => {
            chatbotContainer.classList.add('active');
        }, 100);
    });

    closeChat.addEventListener('click', function() {
        chatbotContainer.classList.remove('active');
        setTimeout(() => {
            chatbotContainer.style.display = 'none';
        }, 300);
    });

    // Handle FAQ questions
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const questionId = this.dataset.question;
            const response = responses[questionId];
            
            if (response) {
                // Show typing indicator
                typingIndicator.style.display = 'flex';
                
                // Simulate typing delay
                setTimeout(() => {
                    typingIndicator.style.display = 'none';
                    
                    // Add bot response
                    const botMessage = document.createElement('div');
                    botMessage.className = 'bot-message';
                    botMessage.innerHTML = `<strong>${response.title}</strong><br><br>${response.content}`;
                    chatbotMessages.appendChild(botMessage);
                    
                    // Scroll to bottom
                    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                }, 1500);
            }
        });
    });
}); 