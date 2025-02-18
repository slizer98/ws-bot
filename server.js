const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

// Cargar variables de entorno
dotenv.config();

const app = express();
app.use(express.json());

// Token de verificación que debes definir
const VERIFY_TOKEN = "mi_token_secreto_123";

// 🔹 1. Configurar el webhook de WhatsApp (verificación)
app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("✅ Webhook verificado correctamente.");
        res.status(200).send(challenge);
    } else {
        console.log("❌ Verificación fallida.");
        res.sendStatus(403);
    }
});

// 🔹 2. Recibir eventos de WhatsApp
app.post("/webhook", async (req, res) => {
    const body = req.body;

    console.log("📩 Mensaje recibido:", JSON.stringify(body, null, 2));

    if (body.entry) {
        const message = body.entry[0].changes[0].value.messages?.[0];

        if (message) {
            const senderId = message.from; // Número de WhatsApp del usuario

            // 📌 Si el usuario presionó el botón "¿Tienes alguna duda?"
            if (message.button_reply) {
                const buttonId = message.button_reply.id;

                if (buttonId === "menu_dudas") {
                    await enviarMenuInteractivo(senderId);
                }
            }

            // 📌 Si el usuario seleccionó una opción del menú
            if (message.list_reply) {
                const selectedId = message.list_reply.id;

                if (selectedId === "numeros_contacto") {
                    await enviarMensajeTexto(senderId, "📞 Nuestros números de contacto:\n- 2222222\n- 43344433");
                } else if (selectedId === "correos_contacto") {
                    await enviarMensajeTexto(senderId, "📧 Nuestro correo de contacto:\n- correo@ggg.com");
                }
            }
        }
    }

    res.sendStatus(200); // Respuesta OK a WhatsApp
});

// 🔹 3. Enviar un mensaje interactivo con el menú
async function enviarMenuInteractivo(recipient) {
    const url = `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`;

    const data = {
        messaging_product: "whatsapp",
        to: recipient,
        type: "interactive",
        interactive: {
            type: "list",
            body: { text: "Selecciona una opción:" },
            action: {
                button: "Opciones",
                sections: [
                    {
                        title: "Información de contacto",
                        rows: [
                            {
                                id: "numeros_contacto",
                                title: "📞 Números de contacto",
                                description: "Consulta los números disponibles"
                            },
                            {
                                id: "correos_contacto",
                                title: "📧 Correos de contacto",
                                description: "Consulta los correos disponibles"
                            }
                        ]
                    }
                ]
            }
        }
    };

    await enviarMensajeWhatsApp(url, data);
}

// 🔹 4. Enviar un mensaje de texto simple
async function enviarMensajeTexto(recipient, text) {
    const url = `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`;

    const data = {
        messaging_product: "whatsapp",
        to: recipient,
        type: "text",
        text: { body: text }
    };

    await enviarMensajeWhatsApp(url, data);
}

// 🔹 5. Función genérica para enviar mensajes a WhatsApp
async function enviarMensajeWhatsApp(url, data) {
    try {
        await axios.post(url, data, {
            headers: {
                "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`,
                "Content-Type": "application/json"
            }
        });
        console.log("✅ Mensaje enviado con éxito.");
    } catch (error) {
        console.error("❌ Error enviando mensaje:", error.response?.data || error.message);
    }
}

// 🔹 Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
