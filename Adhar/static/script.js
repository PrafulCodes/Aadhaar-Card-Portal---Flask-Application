// Sign-Up Modal open/close
const modal = document.getElementById('signUpModal');
document.getElementById('signUpBtn').addEventListener('click', () => {
    modal.style.display = 'flex';
});
document.querySelector('.closeBtn').addEventListener('click', () => {
    modal.style.display = 'none';
});
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Sign in button to user profile logo
document.getElementById('signUpBtn').addEventListener('click', () => {
    console.log("Signed in successfully");
    setTimeout(() => {
        document.getElementById('signUpBtn').style.display = "none";
        document.getElementById('defaultAvatar').style.display = "inline-block";
    }, 6000);
});

// Sign-Up form submit
document.getElementById('signupSubmit').addEventListener('click', () => {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;

    if (!name || !email) {
        alert('Please fill all fields');
        return;
    }

    fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        modal.style.display = 'none';
    })
    .catch(err => {
        console.error(err);
        alert('Error occurred');
    });
});

// AI Chatbot open/close
const chatBot = document.getElementById('chatBot');
document.getElementById('aiBubble').addEventListener('click', () => {
    chatBot.style.display = chatBot.style.display === 'flex' ? 'none' : 'flex';
});
document.getElementById('closeChat').addEventListener('click', () => {
    chatBot.style.display = 'none';
});

// Autofill AI textarea on update type change
document.getElementById('update-type').addEventListener('change', () => {
    const updateType = document.getElementById('update-type').value;
    const chatInput = document.getElementById('chatInput');
    if (updateType) {
        chatInput.value = `List the required documents to update ${updateType.replace(/-/g, ' ')}.`;
    }
});

// Submit button logic
document.getElementById('submit-form').addEventListener('click', () => {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const center = document.getElementById('center').value;
    const updateType = document.getElementById('update-type').value;
    const files = document.getElementById('documents').files;

    if (!name || !email || !center || !updateType || files.length === 0) {
        alert('Please fill all fields and upload documents.');
        return;
    }

    for (let file of files) {
        if (file.size > 50 * 1024) {
            alert(`File "${file.name}" exceeds 50KB limit.`);
            return;
        }
    }

    document.getElementById('submitMessage').innerText = "Now you can generate your token.";
});

// Token generation and receipt download
document.getElementById('generate-token').addEventListener('click', () => {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const updateType = document.getElementById('update-type').value;
    const files = document.getElementById('documents').files;

    if (!name || !email || !updateType) {
        alert("Please fill all details before generating token.");
        return;
    }

    if (files.length === 0) {
        alert("Please upload your documents first.");
        return;
    }

    for (let file of files) {
        if (file.size > 50 * 1024) {
            alert(`File "${file.name}" exceeds 50KB limit.`);
            return;
        }
    }

    const token = Math.floor(Math.random() * 900) + 100;
    document.getElementById('tokenDisplay').innerText = `Your Token Number: ${token}`;

    const aadhaarLogo = `
===============================
    UIDAI - Aadhaar Desk     
===============================
`;

    const receiptText = `${aadhaarLogo}
Name: ${name}
Email: ${email}
Type of Update: ${updateType}
-------------------------------
Your Token Number: ${token}
-------------------------------

Please carry this receipt to your selected center.
`;

    const blob = new Blob([receiptText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Aadhaar_Receipt_${name}.txt`;
    link.click();
});

// AI Chatbot send message & get response
document.getElementById('sendChatMessage').addEventListener('click', async () => {
const input = document.getElementById('chatInput');
const message = input.value.trim();
if (!message) return;

   appendMessage('user', message);
input.value = '';

try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": "Bearer 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",
            "HTTP-Referer": window.location.href,
            "X-Title": "Aadhaar Assistant",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "google/gemma-3-27b-it:free",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: message }
                    ]
                }
            ]
        })
    });

    const data = await response.json();
    let reply = data?.choices?.[0]?.message?.content || "Sorry, I didn’t get that.";
    reply = reply.split('.').slice(0, 2).join('.') + '.';
    appendMessage('ai', reply);
} catch (err) {
    console.error(err);
    appendMessage('ai', 'An error occurred while contacting the AI.');
}

});

function appendMessage(role, text) {
    const chatBox = document.getElementById('chatMessages');
    const msg = document.createElement('div');
    msg.className = role === 'user' ? 'userMsg' : 'aiMsg';
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}