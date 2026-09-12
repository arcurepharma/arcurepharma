import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  WASocket,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import pino from "pino";
import path from "path";

const logger = pino();
let sock: WASocket | null = null;
let isConnecting = false;

export async function connectWhatsApp() {
  if (sock && sock.user) {
    console.log("✅ WhatsApp already connected");
    return sock;
  }

  if (isConnecting) {
    console.log("⏳ WhatsApp connection in progress...");
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (sock && sock.user) {
          clearInterval(interval);
          resolve(sock);
        }
      }, 500);
    });
  }

  isConnecting = true;

  try {
    const authPath = path.join(process.cwd(), "whatsapp_auth");
    const { state, saveCreds } = await useMultiFileAuthState(authPath);

    sock = makeWASocket({
      auth: state,
      printQRInTerminal: true,
      logger: pino({ level: "silent" }),
      browser: ["Arcure Pharma", "Safari", "1.0.0"],
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect, isNewLogin } = update;

      if (isNewLogin) {
        console.log("✅ New WhatsApp login detected");
      }

      if (connection === "close") {
        const shouldReconnect =
          (lastDisconnect?.error as Boom)?.output?.statusCode !==
          DisconnectReason.loggedOut;

        console.log(
          "❌ WhatsApp connection closed:",
          lastDisconnect?.error,
          "Reconnecting:",
          shouldReconnect
        );

        if (shouldReconnect) {
          setTimeout(() => {
            sock = null;
            isConnecting = false;
            connectWhatsApp();
          }, 3000);
        }
      } else if (connection === "open") {
        console.log("✅ WhatsApp connected successfully");
        isConnecting = false;
      }
    });

    // Listen for incoming messages
    sock.ev.on("messages.upsert", async (m) => {
      try {
        const message = m.messages[0];
        if (!message.key.fromMe && message.message) {
          console.log("📨 New message from:", message.key.remoteJid);
          // Handle incoming messages here
        }
      } catch (error) {
        console.error("Error handling incoming message:", error);
      }
    });

    return sock;
  } catch (error) {
    console.error("❌ Failed to connect WhatsApp:", error);
    isConnecting = false;
    throw error;
  }
}

export async function sendWhatsAppMessage(
  phoneNumber: string,
  message: string
): Promise<boolean> {
  try {
    if (!sock || !sock.user) {
      throw new Error("WhatsApp not connected");
    }

    // Format phone number
    const jid = phoneNumber.includes("@")
      ? phoneNumber
      : `${phoneNumber}@s.whatsapp.net`;

    await sock.sendMessage(jid, { text: message });
    console.log(`✅ Message sent to ${phoneNumber}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send message to ${phoneNumber}:`, error);
    return false;
  }
}

export function getWhatsAppSocket(): WASocket | null {
  return sock;
}

export function isWhatsAppConnected(): boolean {
  return sock !== null && sock.user !== null;
}
