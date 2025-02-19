# 🤖 WhatsApp Chatbot con IA

Este proyecto es un **chatbot de WhatsApp** basado en la API de **WhatsApp Business** y **OpenAI GPT-4**(Próximamente). Permite enviar archivos, responder preguntas frecuentes y recibir consultas de los usuarios, las cuales son respondidas automáticamente con una **IA**.

## 🚀 **Características**
- ✅ Envío de mensajes automáticos con archivos adjuntos.
- ✅ Menú interactivo de preguntas frecuentes.
- ✅ Integración con **OpenAI** para responder dudas en tiempo real.
- ✅ Despliegue en **Render** para funcionamiento 24/7.
- ✅ Uso de **Webhooks** para recibir y procesar mensajes.
- ✅ Filtrado de eventos innecesarios de WhatsApp para mejorar rendimiento.

---

## 🛠️ **Tecnologías Utilizadas**

- **Node.js** - Para el backend del chatbot.
- **Express.js** - Para manejar las rutas del webhook.
- **WhatsApp Business API** - Para recibir y enviar mensajes.
- **OpenAI GPT-4** - Para responder preguntas automáticamente.
- **Axios** - Para realizar peticiones HTTP a la API de WhatsApp.
- **Render** - Para desplegar el bot en un servidor en la nube.

---

## 📥 **Instalación Local**

### 1️⃣ **Clonar el Repositorio**
```sh
 git clone https://github.com/TU_USUARIO/TU_REPO.git
 cd TU_REPO
```

### 2️⃣ **Instalar Dependencias**
```sh
npm install
```

### 3️⃣ **Configurar Variables de Entorno**
Crea un archivo `.env` y agrega las siguientes variables:
```ini
WHATSAPP_TOKEN=TU_ACCESS_TOKEN
PHONE_NUMBER_ID=TU_PHONE_NUMBER_ID
VERIFY_TOKEN=mi_token_secreto_123
OPENAI_API_KEY=TU_OPENAI_KEY
PORT=3000
```

### 4️⃣ **Ejecutar el Servidor Local**
```sh
node server.js
```

---

## 🔗 **Despliegue en Render**

### 1️⃣ **Subir el Proyecto a GitHub**
```sh
git add .
git commit -m "Primera versión del bot"
git push origin main
```

### 2️⃣ **Crear un Servicio en Render**
1. **Ir a** [https://render.com](https://render.com) y crear una cuenta.
2. **Seleccionar "New Web Service"**.
3. **Conectar con GitHub y elegir el repositorio del bot**.
4. **Configurar el servicio:**
   - Runtime: `Node.js`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Variables de entorno: Agregar las mismas que en `.env`

### 3️⃣ **Obtener la URL del Webhook**
Render te dará una URL como esta:
```
https://whatsapp-bot.onrender.com/webhook
```
Cópiala, la necesitarás para configurar el Webhook en Meta.

---

## ⚙️ **Configurar el Webhook en Meta (WhatsApp Business API)**

### 1️⃣ **Ir a la Consola de Meta**
- 📌 [https://developers.facebook.com/apps](https://developers.facebook.com/apps)
- Seleccionar la app de WhatsApp Business.

### 2️⃣ **Configurar Webhook**
1. Ir a **WhatsApp > Webhooks**.
2. Ingresar la URL del webhook de Render:
   ```
   https://whatsapp-bot.onrender.com/webhook
   ```
3. Ingresar el **Verify Token** (`mi_token_secreto_123`).
4. **Guardar y verificar**.

### 3️⃣ **Suscribirse a Eventos**
- Activar **messages**.
- Desactivar **statuses** para evitar spam de WhatsApp.

---

## 📚 **Estructura del Código**
```plaintext
📂 whatsapp-bot
 ├── 📜 server.js  # Servidor principal y webhook
 ├── 📜 .env       # Variables de entorno
 ├── 📜 package.json  # Configuración del proyecto
 ├── 📜 README.md  # Documentación
```

---

## 📩 **Funcionalidad del Webhook**
El webhook recibe y procesa eventos de WhatsApp:

✔️ **Si el usuario envía un mensaje:**
   - Si selecciona "Escribir mi duda", la pregunta se envía a **OpenAI** y recibe una respuesta automática.
   - Si elige una opción del menú, se le muestra la información correspondiente.

✔️ **Si WhatsApp envía eventos de lectura o estado:**
   - Se ignoran para evitar procesamiento innecesario.

---

## 🤖 **Integración con IA (OpenAI GPT-4)**
El bot usa OpenAI para responder preguntas automáticamente.

### 🔹 **Código para enviar preguntas a OpenAI:**
```javascript
async function obtenerRespuestaIA(pregunta) {
    const url = "https://api.openai.com/v1/chat/completions";
    
    try {
        const response = await axios.post(
            url,
            {
                model: "gpt-4",
                messages: [{ role: "user", content: pregunta }],
                max_tokens: 200
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data.choices[0].message.content.trim();
    } catch (error) {
        return "⚠️ No pude procesar tu pregunta. Inténtalo más tarde.";
    }
}
```

---

## 🚀 **Posibles Mejoras Futuras**
- **Base de datos para almacenar historial de conversaciones.**
- **Integración con Dialogflow para flujo conversacional más avanzado.**
- **Automatización de respuestas con Machine Learning.**

---

## 📝 **Créditos**
Este bot fue desarrollado para **automatizar respuestas en WhatsApp** con inteligencia artificial y mejorar la experiencia del usuario. 💡🚀

