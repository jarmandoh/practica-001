import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function PoliticaDatos() {
    useEffect(() => {
        document.title = 'Inicio | Mi Portafolio';
      }, []);
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white p-8">
          <div className="flex items-center justify-between mb-4">
            <Link 
              to="/" 
              className="text-white hover:text-blue-200 transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Volver
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <FontAwesomeIcon icon={faShieldAlt} className="text-5xl" />
            <div>
              <h1 className="text-4xl font-bold mb-2">Política de Tratamiento de Datos Personales</h1>
              <p className="text-blue-100">Conforme a la Ley 1581 de 2012 y Decreto 1377 de 2013</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Introducción */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
              1. Introducción
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              En cumplimiento de la Ley 1581 de 2012 y el Decreto Reglamentario 1377 de 2013, 
              por medio de la cual se dictan disposiciones generales para la protección de datos 
              personales en Colombia, la presente Política de Tratamiento de Datos Personales 
              establece los lineamientos para la recolección, almacenamiento, uso, circulación 
              y supresión de datos personales.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Última actualización:</strong> 25 de noviembre de 2025
            </p>
          </section>

          {/* Responsable */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
              2. Responsable del Tratamiento
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-2"><strong>Razón Social:</strong> [Nombre de la Empresa/Organización]</p>
              <p className="text-gray-700 mb-2"><strong>NIT:</strong> [Número de Identificación Tributaria]</p>
              <p className="text-gray-700 mb-2"><strong>Dirección:</strong> [Dirección Completa]</p>
              <p className="text-gray-700 mb-2"><strong>Ciudad:</strong> [Ciudad, Colombia]</p>
              <p className="text-gray-700 mb-2"><strong>Teléfono:</strong> [Número de Teléfono]</p>
              <p className="text-gray-700 mb-2"><strong>Correo Electrónico:</strong> [correo@empresa.com]</p>
              <p className="text-gray-700"><strong>Sitio Web:</strong> [www.empresa.com]</p>
            </div>
          </section>

          {/* Definiciones */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
              3. Definiciones
            </h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Autorización:</h3>
                <p className="text-gray-700">Consentimiento previo, expreso e informado del Titular para llevar a cabo el Tratamiento de datos personales.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Base de Datos:</h3>
                <p className="text-gray-700">Conjunto organizado de datos personales que sea objeto de Tratamiento.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Dato Personal:</h3>
                <p className="text-gray-700">Cualquier información vinculada o que pueda asociarse a una o varias personas naturales determinadas o determinables.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Dato Sensible:</h3>
                <p className="text-gray-700">Aquellos que afectan la intimidad del Titular o cuyo uso indebido puede generar su discriminación, tales como datos sobre el origen racial o étnico, orientación política, convicciones religiosas o filosóficas, pertenencia a sindicatos, datos relativos a la salud, a la vida sexual y los datos biométricos.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Titular:</h3>
                <p className="text-gray-700">Persona natural cuyos datos personales sean objeto de Tratamiento.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Tratamiento:</h3>
                <p className="text-gray-700">Cualquier operación o conjunto de operaciones sobre datos personales, tales como la recolección, almacenamiento, uso, circulación o supresión.</p>
              </div>
            </div>
          </section>

          {/* Principios */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
              4. Principios para el Tratamiento de Datos Personales
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Legalidad:</strong> El Tratamiento se sujeta a las disposiciones vigentes aplicables.</li>
              <li><strong>Finalidad:</strong> El Tratamiento obedece a una finalidad legítima, la cual debe ser informada al Titular.</li>
              <li><strong>Libertad:</strong> El Tratamiento solo puede ejercerse con el consentimiento previo, expreso e informado del Titular.</li>
              <li><strong>Veracidad o Calidad:</strong> La información sujeta a Tratamiento debe ser veraz, completa, exacta, actualizada, comprobable y comprensible.</li>
              <li><strong>Transparencia:</strong> Se debe garantizar el derecho del Titular a obtener información sobre el Tratamiento de sus datos.</li>
              <li><strong>Acceso y Circulación Restringida:</strong> El Tratamiento se sujeta a los límites que se derivan de la naturaleza de los datos personales.</li>
              <li><strong>Seguridad:</strong> La información sujeta a Tratamiento se debe manejar con medidas técnicas, humanas y administrativas necesarias para otorgar seguridad a los registros.</li>
              <li><strong>Confidencialidad:</strong> Todas las personas que intervengan en el Tratamiento están obligadas a garantizar la reserva de la información.</li>
              </ul>
          </section>

          {/* Datos Recolectados */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
              5. Datos Personales Recolectados
            </h2>
            <p className="text-gray-700 mb-3">
              Los datos personales que pueden ser objeto de Tratamiento incluyen, pero no se limitan a:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Datos de Identificación:</h3>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                  <li>Nombre completo</li>
                  <li>Documento de identidad</li>
                  <li>Fecha de nacimiento</li>
                  <li>Fotografía</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Datos de Contacto:</h3>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                  <li>Dirección de residencia</li>
                  <li>Correo electrónico</li>
                  <li>Número telefónico</li>
                  <li>Ciudad y país</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Datos de Uso:</h3>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                  <li>Dirección IP</li>
                  <li>Cookies y datos de navegación</li>
                  <li>Historial de interacciones</li>
                  <li>Preferencias del usuario</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Datos de Juego (Bingo):</h3>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                  <li>Nombre de participante</li>
                  <li>Cartones asignados</li>
                  <li>Historial de juegos</li>
                  <li>Premios obtenidos</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Finalidades */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
              6. Finalidades del Tratamiento
            </h2>
            <p className="text-gray-700 mb-3">
              Los datos personales recolectados serán utilizados para las siguientes finalidades:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Gestionar el registro y participación en juegos de bingo en línea.</li>
              <li>Administrar la asignación de cartones y control de sorteos.</li>
              <li>Verificar la identidad de los participantes y gestores.</li>
              <li>Realizar comunicaciones relacionadas con el servicio.</li>
              <li>Enviar notificaciones sobre sorteos, premios y actualizaciones.</li>
              <li>Analizar y mejorar la calidad del servicio.</li>
              <li>Cumplir con obligaciones legales y reglamentarias.</li>
              <li>Prevenir fraudes y garantizar la seguridad del sistema.</li>
              <li>Realizar análisis estadísticos y de comportamiento.</li>
              <li>Gestionar solicitudes, quejas y reclamos.</li>
            </ul>
          </section>

          {/* Derechos del Titular */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
              7. Derechos de los Titulares
            </h2>
            <p className="text-gray-700 mb-3">
              De acuerdo con la legislación colombiana, los Titulares de datos personales tienen los siguientes derechos:
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-xl">•</span>
                <div>
                  <h3 className="font-semibold text-gray-800">Conocer, actualizar y rectificar</h3>
                  <p className="text-gray-700 text-sm">Sus datos personales frente a los Responsables del Tratamiento.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-xl">•</span>
                <div>
                  <h3 className="font-semibold text-gray-800">Solicitar prueba de la autorización</h3>
                  <p className="text-gray-700 text-sm">Otorgada al Responsable del Tratamiento.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-xl">•</span>
                <div>
                  <h3 className="font-semibold text-gray-800">Ser informado</h3>
                  <p className="text-gray-700 text-sm">Sobre el uso que se ha dado a sus datos personales.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-xl">•</span>
                <div>
                  <h3 className="font-semibold text-gray-800">Presentar quejas</h3>
                  <p className="text-gray-700 text-sm">Ante la Superintendencia de Industria y Comercio por infracciones a la ley.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-xl">•</span>
                <div>
                  <h3 className="font-semibold text-gray-800">Revocar la autorización</h3>
                  <p className="text-gray-700 text-sm">Y solicitar la supresión del dato cuando no se respeten los principios, derechos y garantías constitucionales y legales.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-xl">•</span>
                <div>
                  <h3 className="font-semibold text-gray-800">Acceder gratuitamente</h3>
                  <p className="text-gray-700 text-sm">A sus datos personales que hayan sido objeto de Tratamiento.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Ejercicio de Derechos */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
              8. Procedimiento para el Ejercicio de Derechos
            </h2>
            <p className="text-gray-700 mb-3">
              Para ejercer sus derechos como Titular de datos personales, puede presentar una solicitud a través de los siguientes canales:
            </p>
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-l-4 border-blue-600">
              <p className="text-gray-700 mb-2"><strong>Correo Electrónico:</strong> datospersonales@empresa.com</p>
              <p className="text-gray-700 mb-2"><strong>Dirección Física:</strong> [Dirección Completa]</p>
              <p className="text-gray-700 mb-4"><strong>Horario de Atención:</strong> Lunes a Viernes de 8:00 AM a 5:00 PM</p>
              
              <h3 className="font-semibold text-gray-800 mb-2">La solicitud debe contener:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Nombre completo y documento de identidad</li>
                <li>Descripción clara y precisa de los datos objeto de consulta, corrección o actualización</li>
                <li>Dirección física o electrónica para recibir respuesta</li>
                <li>Documentos que soporten la solicitud (si aplica)</li>
                <li>Firma del Titular o su representante legal</li>
              </ul>
              
              <p className="text-gray-700 mt-4">
                <strong>Tiempo de respuesta:</strong> Máximo quince (15) días hábiles contados a partir de la recepción de la solicitud.
              </p>
            </div>
          </section>

          {/* Seguridad */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
              9. Medidas de Seguridad
            </h2>
            <p className="text-gray-700 mb-3">
              Implementamos medidas de seguridad técnicas, humanas y administrativas para proteger los datos personales:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Medidas Técnicas:</h3>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                  <li>Encriptación de datos sensibles</li>
                  <li>Firewalls y sistemas de detección de intrusos</li>
                  <li>Certificados SSL/TLS</li>
                  <li>Copias de seguridad periódicas</li>
                  <li>Autenticación de múltiples factores</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Medidas Organizativas:</h3>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                  <li>Políticas de control de acceso</li>
                  <li>Capacitación del personal</li>
                  <li>Acuerdos de confidencialidad</li>
                  <li>Auditorías de seguridad</li>
                  <li>Protocolos de respuesta a incidentes</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Transferencia */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
              10. Transferencia y Transmisión de Datos
            </h2>
            <p className="text-gray-700 mb-3">
              Los datos personales podrán ser transferidos o transmitidos a:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Proveedores de servicios tecnológicos que nos ayudan a operar la plataforma.</li>
              <li>Autoridades gubernamentales cuando sea requerido por ley.</li>
              <li>Auditores externos en el marco de auditorías legales.</li>
              <li>Terceros autorizados expresamente por el Titular.</li>
            </ul>
            <p className="text-gray-700 mt-3">
              En caso de transferencia internacional de datos, garantizamos que el país receptor cuente con niveles adecuados de protección de datos o establecemos cláusulas contractuales que aseguren la protección.
            </p>
          </section>

          {/* Retención */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
              11. Tiempo de Retención de Datos
            </h2>
            <p className="text-gray-700 mb-3">
              Los datos personales serán conservados durante el tiempo necesario para cumplir con las finalidades para las cuales fueron recolectados, incluyendo:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Durante la vigencia de la relación contractual o comercial.</li>
              <li>El tiempo adicional requerido por obligaciones legales, contables o fiscales (generalmente 10 años en Colombia).</li>
              <li>El tiempo necesario para la defensa de derechos e intereses legítimos.</li>
            </ul>
            <p className="text-gray-700 mt-3">
              Una vez cumplida la finalidad y transcurridos los plazos legales, los datos serán eliminados de forma segura.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
              12. Uso de Cookies y Tecnologías Similares
            </h2>
            <p className="text-gray-700 mb-3">
              Utilizamos cookies y tecnologías similares para:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Mantener la sesión del usuario activa.</li>
              <li>Recordar preferencias y configuraciones.</li>
              <li>Analizar el uso de la plataforma y mejorar la experiencia.</li>
              <li>Personalizar contenido y publicidad.</li>
            </ul>
            <p className="text-gray-700 mt-3">
              Puede configurar su navegador para rechazar cookies, aunque esto puede limitar algunas funcionalidades de la plataforma.
            </p>
          </section>

          {/* Menores */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
              13. Tratamiento de Datos de Menores de Edad
            </h2>
            <p className="text-gray-700 mb-3">
              El Tratamiento de datos personales de niños, niñas y adolescentes está prohibido, excepto cuando:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Se trate de datos de naturaleza pública.</li>
              <li>Se cumpla con un mandato legal o judicial.</li>
              <li>Se cuente con autorización expresa de los padres o representantes legales.</li>
            </ul>
            <p className="text-gray-700 mt-3">
              En estos casos, siempre se respetará el interés superior del menor y se garantizará el respeto de sus derechos fundamentales.
            </p>
          </section>

          {/* Modificaciones */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
              14. Modificaciones a la Política
            </h2>
            <p className="text-gray-700">
              Nos reservamos el derecho de modificar esta Política de Tratamiento de Datos Personales en cualquier momento. 
              Los cambios serán comunicados a través de nuestro sitio web y/o correo electrónico registrado. 
              Le recomendamos revisar periódicamente esta política para estar informado sobre cómo protegemos sus datos personales.
            </p>
          </section>

          {/* Autoridad */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
              15. Autoridad de Control
            </h2>
            <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-600">
              <p className="text-gray-700 mb-3">
                La autoridad competente para conocer de las reclamaciones relacionadas con el tratamiento de datos personales es:
              </p>
              <p className="font-semibold text-gray-800 mb-2">Superintendencia de Industria y Comercio</p>
              <p className="text-gray-700 mb-1"><strong>Dirección:</strong> Carrera 13 No. 27 - 00, Pisos 3 y 4, Bogotá D.C., Colombia</p>
              <p className="text-gray-700 mb-1"><strong>Línea gratuita nacional:</strong> 01 8000 910 165</p>
              <p className="text-gray-700 mb-1"><strong>PBX:</strong> (571) 587 0000</p>
              <p className="text-gray-700 mb-1"><strong>Sitio Web:</strong> www.sic.gov.co</p>
              <p className="text-gray-700"><strong>Correo:</strong> contactenos@sic.gov.co</p>
            </div>
          </section>

          {/* Aceptación */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
              16. Aceptación de la Política
            </h2>
            <p className="text-gray-700">
              Al utilizar nuestros servicios, usted acepta los términos establecidos en esta Política de Tratamiento de Datos Personales. 
              Si no está de acuerdo con alguno de los términos, le solicitamos abstenerse de proporcionar sus datos personales 
              y de utilizar nuestros servicios.
            </p>
          </section>

          {/* Footer */}
          <section className="bg-linear-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg -mx-8 -mb-8">
            <div className="text-center">
              <p className="mb-2">Para más información o consultas sobre esta política:</p>
              <p className="font-semibold mb-1">📧 datospersonales@empresa.com</p>
              <p className="font-semibold">📞 [Número de Teléfono]</p>
              <p className="text-sm text-blue-200 mt-4">
                Documento vigente desde: 25 de noviembre de 2025
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
