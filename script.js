const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");


const keywordMapping = {
    "gula": ["sop gula", "analisis gula", "kadar gula"],
    "pekerjaan B": ["pekerjaan B", "analisis B", "cara kerja B"]
};

// Daftar kata kunci dan link PDF terkait
const pdfLinks = {
    "gula": "https://drive.google.com/file/d/1_b6LmcBvvagLvxDRQ02-UoVLylKX9MeX/view?usp=drive_link",
    "pekerjaan B": "https://drive.google.com/uc?id=7G8H9I0J1K2L"
};

async function sendMessage() {
    let message = userInput.value.trim();
    if (message === "") return;

    appendMessage(message, "user");
    userInput.value = "";

    // Cek apakah pertanyaan terkait pekerjaan tertentu
    let detectedTopic = detectTopic(message);
    if (detectedTopic) {
        let response = `Berikut adalah informasi mengenai ${detectedTopic}. Anda juga dapat melihat dokumen lengkap di sini: <a href="${pdfLinks[detectedTopic]}" target="_blank">Download PDF</a>`;
        appendMessage(response, "bot");
        return;
    }

    // Jika tidak ada topik khusus, gunakan AI
    const botResponse = await fetchAIResponse(message);
    appendMessage(botResponse, "bot");
}

function appendMessage(message, sender) {
    let msgDiv = document.createElement("div");
    msgDiv.classList.add("message", sender);
    msgDiv.innerHTML = message; // Gunakan innerHTML agar link bisa diklik
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Deteksi apakah pertanyaan mengandung kata kunci pekerjaan
function detectTopic(message) {
    for (let topic in keywordMapping) {
        for (let keyword of keywordMapping[topic]) {
            if (message.toLowerCase().includes(keyword.toLowerCase())) {
                return topic;
            }
        }
    }
    return null;
}

// Fungsi untuk memanggil AI Hugging Face jika tidak ada topik khusus
async function fetchAIResponse(userMessage) {
    const API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium";
    const API_KEY = "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";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: userMessage })
        });

        const data = await response.json();
        return data.generated_text || "Maaf, saya tidak mengerti.";
    } catch (error) {
        console.error("Error fetching AI response:", error);
        return "Terjadi kesalahan, coba lagi nanti.";
    }
}
