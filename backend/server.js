const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// ─── 1. MIDDLEWARE (SIEMPRE ARRIBA DE LAS RUTAS) ─────────────────────────────
app.use(cors()); // Puerto de Vite (React)
app.use(express.json()); // Permite leer req.body en todas las peticiones POST

// ─── 2. NODEMAILER TRANSPORTER ───────────────────────────────────────────────
// ─── 2. NODEMAILER TRANSPORTER ───────────────────────────────────────────────
// ─── 2. NODEMAILER TRANSPORTER ───────────────────────────────────────────────
// ─── 2. NODEMAILER TRANSPORTER ───────────────────────────────────────────────
// ─── 2. NODEMAILER TRANSPORTER ───────────────────────────────────────────────
// ─── 2. NODEMAILER TRANSPORTER ───────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 2525, // 🔥 EL PUERTO ANTIBLOQUEOS 🔥
  secure: false, // Sigue en false para este puerto
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  }
});
// Verificar conexión de correo al iniciar
transporter.verify((error) => {
  if (error) {
    console.error("❌ Error al conectar con el servidor de email:", error.message);
  } else {
    console.log("✅ Servidor de email listo para enviar mensajes");
  }
});

// ─── 3. RUTA: CHATBOT GEMINI (API REST DIRECTA COMO EN ESP32) ────────────────
app.post("/api/chat", async (req, res) => {
  const { message, history, patientContext } = req.body;

  if (!message) {
    return res.status(400).json({ error: "El mensaje es requerido" });
  }

  try {
    // Definir reglas y contexto del paciente (System Prompt)
    const systemPrompt = `
      Eres el asistente inteligente de DentalTrack, una startup innovadora de tecnología y salud oral en Colombia.
      Tu tono debe ser profesional, empático y conciso (máximo 2 o 3 oraciones).
      No eres un médico, no puedes diagnosticar. Si el usuario reporta dolor grave, indícale que acuda a urgencias.
      
      Información actual del paciente con el que hablas:
      - Nombre: ${patientContext?.name || 'Usuario Demo'}
      - Tratamiento: ${patientContext?.treatment || 'No especificado'}
      - TrackPoints (Puntos de recompensa): ${patientContext?.points || 0}
      
      Mensaje del usuario: 
    `;

    const contents = [];

    // Mapear historial de chat previo si existe
    if (history && history.length > 0) {
      history.forEach(msg => {
        contents.push({
          role: msg.role === 'bot' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        });
      });
    }

    // Agregar el mensaje actual, concatenado con el systemPrompt (truco para forzar reglas)
    contents.push({
      role: "user",
      parts: [{ text: systemPrompt + message }]
    });

    const apiKey = process.env.GEMINI_API_KEY;
    // Usamos exactamente el mismo modelo y URL que te funcionó en el ESP32
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    // Petición nativa Fetch de Node.js
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ contents: contents })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Error de la API de Google:", data);
      return res.status(response.status).json({ error: "Error conectando con Gemini." });
    }

    // Extraer la respuesta (equivalente a doc["candidates"][0]["content"]["parts"][0]["text"])
    const text = data.candidates[0].content.parts[0].text;
    res.json({ reply: text });

  } catch (error) {
    console.error("❌ Error en el servidor:", error);
    res.status(500).json({ error: "El asistente está descansando, intenta más tarde." });
  }
});

// ─── 4. RUTA: FORMULARIO DE CONTACTO ─────────────────────────────────────────
app.post("/api/contact", async (req, res) => {
  const { name, email, clinic, message } = req.body;

  // Validación básica
  if (!name || !email || !clinic || !message) {
    return res.status(400).json({ error: "Todos los campos son requeridos." });
  }

  try {
    // Email al equipo DentalTrack
    await transporter.sendMail({
      from: `"DentalTrack Web" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECEIVER || process.env.EMAIL_USER,
      subject: `🦷 Nuevo contacto de ${clinic} — DentalTrack`,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 0; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #03080f 0%, #0c1830 100%); padding: 32px 40px; text-align: center;">
            <div style="display: inline-flex; align-items: center; gap: 10px; margin-bottom: 8px;">
              <span style="font-size: 28px;">🦷</span>
              <span style="font-family: Georgia, serif; font-size: 24px; font-weight: 700; color: #fff; letter-spacing: -1px;">Dental<span style="color: #00e5a0;">Track</span></span>
            </div>
            <p style="color: #4d7a9a; font-size: 14px; margin: 4px 0 0;">Nuevo mensaje desde el formulario de contacto</p>
          </div>
          <div style="padding: 32px 40px; background: #ffffff;">
            <h2 style="font-size: 20px; color: #111827; margin: 0 0 24px; font-weight: 700;">📩 Nuevo prospecto interesado</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 12px 16px; background: #f3f4f6; border-radius: 8px 8px 0 0; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">NOMBRE</td></tr>
              <tr><td style="padding: 12px 16px; font-size: 16px; color: #111827; font-weight: 500; border-bottom: 1px solid #e5e7eb;">${name}</td></tr>
              <tr><td style="padding: 12px 16px; background: #f3f4f6; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">EMAIL</td></tr>
              <tr><td style="padding: 12px 16px; font-size: 16px; font-weight: 500; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${email}" style="color: #00897b; text-decoration: none;">${email}</a></td></tr>
              <tr><td style="padding: 12px 16px; background: #f3f4f6; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">CLÍNICA / CONSULTORIO</td></tr>
              <tr><td style="padding: 12px 16px; font-size: 16px; color: #111827; font-weight: 600; border-bottom: 1px solid #e5e7eb;">🏥 ${clinic}</td></tr>
              <tr><td style="padding: 12px 16px; background: #f3f4f6; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">MENSAJE</td></tr>
              <tr><td style="padding: 16px; font-size: 15px; color: #374151; line-height: 1.6; border-bottom: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; background: #fffbeb;">${message.replace(/\n/g, "<br>")}</td></tr>
            </table>
            <div style="margin-top: 24px; padding: 16px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 10px;">
              <p style="margin: 0; font-size: 14px; color: #065f46;">📅 <strong>Recibido el:</strong> ${new Date().toLocaleString("es-CO", { timeZone: "America/Bogota", dateStyle: "full", timeStyle: "short" })}</p>
            </div>
            <div style="margin-top: 24px; text-align: center;">
              <a href="mailto:${email}" style="display: inline-block; background: #00e5a0; color: #000; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 8px; text-decoration: none;">↩ Responder a ${name}</a>
            </div>
          </div>
          <div style="padding: 20px 40px; background: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">Este mensaje fue enviado desde el formulario de contacto de <strong>dentaltrack.co</strong></p>
          </div>
        </div>
      `,
    });

    // Email de confirmación al prospecto
    await transporter.sendMail({
      from: `"DentalTrack" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `✅ Recibimos tu mensaje, ${name.split(" ")[0]}! — DentalTrack`,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #03080f, #0c1830); padding: 32px 40px; text-align: center; border-radius: 12px 12px 0 0;">
            <span style="font-size: 28px;">🦷</span>
            <h1 style="font-family: Georgia, serif; font-size: 26px; color: #fff; font-weight: 700; margin: 8px 0 0; letter-spacing: -1px;">Dental<span style="color: #00e5a0;">Track</span></h1>
          </div>
          <div style="padding: 32px 40px; background: #fff; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
            <h2 style="font-size: 22px; color: #111827; margin: 0 0 12px;">¡Gracias por contactarnos, ${name.split(" ")[0]}! 🎉</h2>
            <p style="color: #6b7280; font-size: 15px; line-height: 1.6;">Recibimos tu mensaje de parte de <strong>${clinic}</strong>. Un asesor de DentalTrack te contactará en las próximas <strong>24 horas</strong>.</p>
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 20px; margin: 24px 0;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #166534; font-weight: 700;">Mientras tanto, puedes:</p>
              <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 2;">
                <li>🎮 Explorar la demo gratuita del paciente</li>
                <li>📊 Ver cómo funciona el sistema de recompensas</li>
                <li>💬 Escribirnos por WhatsApp para atención inmediata</li>
              </ul>
            </div>
            <p style="color: #9ca3af; font-size: 13px; margin: 24px 0 0; text-align: center;">DentalTrack · Seguimiento inteligente post-tratamiento · Colombia 🇨🇴</p>
          </div>
        </div>
      `,
    });

    console.log(`📧 Emails enviados para contacto de: ${email} (${clinic})`);
    return res.status(200).json({ success: true, message: "Correos enviados correctamente." });
  } catch (error) {
    console.error("❌ Error enviando email:", error);
    return res.status(500).json({ error: "No se pudo enviar el correo. Intenta de nuevo." });
  }
});

// ─── HEALTH CHECK ────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "DentalTrack API funcionando ✅" });
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🦷 DentalTrack Backend corriendo en http://localhost:${PORT}`);
  console.log(`📧 Email configurado: ${process.env.EMAIL_USER || "⚠️  No configurado (revisa .env)"}\n`);
});