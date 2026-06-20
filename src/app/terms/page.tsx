"use client";

import { FadeIn } from "@/components/ui/Animations";

export default function TermsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4">
        <FadeIn>
          <h1 className="text-4xl font-bold text-white">Términos de Servicio</h1>
          <p className="mt-2 text-sm text-gray-500">Última actualización: Junio 2025</p>
          <div className="mt-8 space-y-8 text-gray-400 leading-relaxed">
            <section><h2 className="text-xl font-semibold text-white mb-3">1. Aceptación de Términos</h2><p>Al acceder y usar SYSTEM 777 (jrsystem7777.com), aceptas estar sujeto a estos Términos de Servicio. Si no estás de acuerdo con alguna parte de estos términos, no podrás acceder al servicio.</p></section>
            <section><h2 className="text-xl font-semibold text-white mb-3">2. Uso del Servicio</h2><p>SYSTEM 777 proporciona una plataforma en línea para educación tecnológica que incluye cursos, tutoriales, foros de comunidad y productos digitales. Puedes usar el servicio solo para fines legales y de acuerdo con estos Términos.</p></section>
            <section><h2 className="text-xl font-semibold text-white mb-3">3. Registro de Cuenta</h2><p>Para acceder a ciertas funciones, debes crear una cuenta. Eres responsable de mantener la confidencialidad de tus credenciales y de todas las actividades que ocurran bajo tu cuenta.</p></section>
            <section><h2 className="text-xl font-semibold text-white mb-3">4. Propiedad Intelectual</h2><p>Todo el contenido en SYSTEM 777, incluyendo cursos, tutoriales, ejemplos de código y productos digitales, es propiedad de SYSTEM 777 o sus proveedores de contenido y está protegido por las leyes de propiedad intelectual.</p></section>
            <section><h2 className="text-xl font-semibold text-white mb-3">5. Actividades Prohibidas</h2><p>No puedes: redistribuir o revender contenido de cursos, intentar evitar medidas de seguridad, usar el servicio para fines ilegales, acosar a otros usuarios, o subir contenido malicioso.</p></section>
            <section><h2 className="text-xl font-semibold text-white mb-3">6. Pagos y Suscripciones</h2><p>Los cursos premium y suscripciones se procesan a través de Stripe. Los precios están en USD. Puedes cancelar tu suscripción en cualquier momento. Las solicitudes de reembolso se manejan caso por caso dentro de los 30 días.</p></section>
            <section><h2 className="text-xl font-semibold text-white mb-3">7. Limitación de Responsabilidad</h2><p>SYSTEM 777 no será responsable por daños indirectos, incidentales, especiales, consecuentes o punitivos resultantes de tu uso del servicio.</p></section>
            <section><h2 className="text-xl font-semibold text-white mb-3">8. Cambios en los Términos</h2><p>Nos reservamos el derecho de modificar estos Términos en cualquier momento. El uso continuado del servicio después de los cambios constituye aceptación de los Términos modificados.</p></section>
            <section><h2 className="text-xl font-semibold text-white mb-3">9. Contacto</h2><p>Para preguntas sobre estos Términos, contáctanos en <a href="mailto:rksagmita@jrsystem7777.com" className="text-[#00FF88] hover:underline">rksagmita@jrsystem7777.com</a>.</p></section>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
