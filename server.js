const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

// Cargar variables de entorno
dotenv.config();

const app = express();
app.use(express.json());

// Token de verificación que debes definir
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

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
        const value = body.entry[0].changes[0].value;
        const message = value.messages?.[0];
        let senderId = value.contacts?.[0]?.wa_id; // Número del usuario

        // Corregir número si es de México (eliminando "1" extra)
        if (senderId.startsWith("521")) {
            senderId = "52" + senderId.slice(3);
        }

        // 📌 Si el usuario presionó "¿Tienes alguna duda?" enviamos el menú de opciones
        if (message.type === "button" && message.button) {
            const buttonId = message.button.payload;

            if (buttonId === "¿Tienes alguna duda?") {
                console.log("✅ Enviando menú de preguntas frecuentes...");
                await enviarMenuFAQ(senderId);
            }
        }

        // 📌 Si el usuario seleccionó una opción del menú
        if (message.type === "interactive" && message.interactive.list_reply) {
            const selectedId = message.interactive.list_reply.id;

            if (selectedId === "faq_numeros_contacto") {
                await enviarMensajeTexto(senderId, "📞 Nuestros números de contacto:\n- 2222222\n- 43344433");
            } else if (selectedId === "faq_correos_contacto") {
                await enviarMensajeTexto(senderId, "📧 Nuestros correos de contacto:\n- contacto@empresa.com\n- soporte@empresa.com");
            } else if (selectedId === "faq_horarios") {
                await enviarMensajeTexto(senderId, "🕒 Nuestro horario de atención es de lunes a viernes de 9:00 AM a 6:00 PM.");
            } else if (selectedId === "faq_direccion") {
                await enviarMensajeTexto(senderId, "📍 Nuestra dirección es: Calle Ejemplo 123, Ciudad, País.");
            } else if (selectedId === "faq_escribir_duda") {
                await enviarMensajeTexto(senderId, "✍️ Por favor, escribe tu duda y pronto te responderemos.");
                // Aquí podrías almacenar la duda en una base de datos o integrarla con una IA en el futuro
            }
        }
    }

    res.sendSta




// 🔹 3. Enviar un mensaje interactivo con el menú
async function enviarMenuFAQ(recipient) {
    const url = `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`;

    const data = {
        messaging_product: "whatsapp",
        to: recipient,
        type: "interactive",
        interactive: {
            type: "list",
            body: { text: "📖 Preguntas Frecuentes:\nSelecciona una opción:" },
            action: {
                button: "Ver opciones",
                sections: [
                    {
                        title: "Información General",
                        rows: [
                            {
                                id: "faq_numeros_contacto",
                                title: "📞 Números de contacto",
                                description: "Consulta nuestros números de atención"
                            },
                            {
                                id: "faq_correos_contacto",
                                title: "📧 Correos de contacto",
                                description: "Consulta nuestros correos electrónicos"
                            },
                            {
                                id: "faq_horarios",
                                title: "🕒 Horario",
                                description: "Consulta nuestro horario de atención"
                            },
                            {
                                id: "faq_direccion",
                                title: "📍 Dirección",
                                description: "Consulta nuestra ubicación"
                            },
                            {
                                id: "faq_escribir_duda",
                                title: "✍️ Escribir mi duda",
                                description: "Déjanos tu duda y la responderemos pronto"
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
