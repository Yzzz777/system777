"use client";

import { FadeIn } from "@/components/ui/Animations";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4">
        <FadeIn>
          <h1 className="text-4xl font-bold text-white">Política de Privacidad</h1>
          <p className="mt-2 text-sm text-gray-500">Última actualización: Junio 2025</p>
          <div className="mt-8 space-y-8 text-gray-400 leading-relaxed">
            <section><h2 className="text-xl font-semibold text-white mb-3">1. Información que Recopilamos</h2><p>Recopilamos información que nos proporcionas directamente: nombre, correo electrónico, nombre de usuario, contraseña (hasheada), información de pago (procesada por transferencia bancaria o PayPal) y datos de perfil. También recopilamos datos de uso como páginas visitadas, progreso en cursos e información del dispositivo.</p></section>
            <section><h2 className="text-xl font-semibold text-white mb-3">2. Cómo Usamos tu Información</h2><p>Usamos tu información para: proveer y mejorar nuestros servicios, procesar pagos, enviar actualizaciones de cursos y notificaciones, personalizar tu experiencia, asegurar la seguridad y cumplir con obligaciones legales.</p></section>
            <section><h2 className="text-xl font-semibold text-white mb-3">3. Compartir Datos</h2><p>No vendemos tus datos personales. Podemos compartir datos con: Banreservas y PayPal (procesamiento de pagos), Vercel (hosting) y Cloudflare (CDN/seguridad). Estos proveedores están vinculados por acuerdos de procesamiento de datos.</p></section>
            <section><h2 className="text-xl font-semibold text-white mb-3">4. Seguridad de Datos</h2><p>Implementamos medidas de seguridad estándar de la industria incluyendo cifrado (TLS/SSL), contraseñas hasheadas (Argon2), protección CSRF, limitación de velocidad y auditorías de seguridad regulares.</p></section>
            <section><h2 className="text-xl font-semibold text-white mb-3">5. Cookies</h2><p>Usamos cookies esenciales para autenticación y gestión de sesiones. No usamos cookies de rastreo. Puedes gestionar las preferencias de cookies en la configuración de tu navegador.</p></section>
            <section><h2 className="text-xl font-semibold text-white mb-3">6. Tus Derechos</h2><p>Tienes derecho a: acceder a tus datos, corregir datos inexactos, eliminar tu cuenta y datos, exportar tus datos y optar por no recibir comunicaciones no esenciales. Contáctanos para ejercer estos derechos.</p></section>
            <section><h2 className="text-xl font-semibold text-white mb-3">7. Retención de Datos</h2><p>Retenemos tus datos mientras tu cuenta esté activa. Al eliminar tu cuenta, eliminamos los datos personales dentro de los 30 días, excepto donde la ley lo requiera.</p></section>
            <section><h2 className="text-xl font-semibold text-white mb-3">8. Privacidad de Menores</h2><p>Nuestro servicio no está destinado a menores de 13 años. No recopilamos conscientemente datos de menores de 13 años.</p></section>
            <section><h2 className="text-xl font-semibold text-white mb-3">9. Contacto</h2><p>Para preguntas sobre privacidad, contáctanos en <a href="mailto:rksagmita@jrsystem7777.com" className="text-[#00FF88] hover:underline">rksagmita@jrsystem7777.com</a>.</p></section>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
