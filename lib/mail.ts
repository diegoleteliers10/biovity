import { Resend } from "resend"

let resendInstance: Resend | null = null
function getResend() {
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY || "re_mock_key")
  }
  return resendInstance
}

const EMAIL_FROM = process.env.EMAIL_FROM || "Biovity <no-reply@biovity.cl>"

// Premium layout base CSS/HTML matching Biovity colors and branding
const emailLayout = (title: string, content: string) => {
  // Always use the public production domain for email assets to prevent broken images in mail clients
  const publicUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://biovity.cl"
  const logoUrl = `${publicUrl}/logoIconBiovity.png`

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f3f3f5;
      color: #111827;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      max-width: 580px;
      margin: 40px auto;
      background: #ffffff;
      border: 1px solid rgba(193, 199, 204, 0.2);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025);
    }
    .header {
      background-color: #ffffff;
      padding: 40px 32px 24px 32px;
      text-align: center;
      border-bottom: 1px solid rgba(193, 199, 204, 0.15);
    }
    .logo-container {
      display: inline-block;
      margin-bottom: 12px;
    }
    .logo-img {
      width: 56px;
      height: 56px;
      object-fit: contain;
    }
    .brand-name {
      font-size: 26px;
      font-weight: 800;
      color: #00374a;
      letter-spacing: -0.025em;
      margin: 0;
    }
    .content {
      padding: 40px 32px;
      line-height: 1.7;
      font-size: 16px;
      color: #2d3748;
    }
    .content h2 {
      color: #00374a;
      font-size: 20px;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 16px;
    }
    .footer {
      padding: 32px;
      background-color: #f9fafb;
      border-top: 1px solid rgba(193, 199, 204, 0.15);
      text-align: center;
      font-size: 13px;
      color: #71787d;
      line-height: 1.6;
    }
    .button-container {
      text-align: center;
      margin: 32px 0;
    }
    .button {
      display: inline-block;
      background-color: #006b5e;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 15px;
      box-shadow: 0 4px 6px -1px rgba(0, 107, 94, 0.2);
    }
    p { margin-top: 0; margin-bottom: 16px; }
    strong { color: #00374a; font-weight: 700; }
    ul { margin: 0 0 20px 0; padding-left: 20px; }
    li { margin-bottom: 8px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo-container">
        <img class="logo-img" src="${logoUrl}" alt="Biovity Logo" />
      </div>
      <div class="brand-name">Biovity</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} Biovity. Todos los derechos reservados.<br/>
      ¿Tienes alguna duda o inconveniente? Escríbenos directamente a<br/>
      <a href="mailto:dleteliersr@udd.cl" style="color: #006b5e; text-decoration: none; font-weight: 600;">dleteliersr@udd.cl</a>
    </div>
  </div>
</body>
</html>
`
}

export async function sendWaitlistEmail(to: string, role: string) {
  const isCompany = role === "organization"
  const welcomeText = isCompany
    ? `Nos entusiasma que quieras impulsar tu organización con nuestro buscador inteligente de talento y automatizaciones por IA. Estamos afinando los últimos detalles de la plataforma para abrir las puertas a las primeras empresas.`
    : `Tu interés en encontrar tu próximo paso profesional en la industria biotecnológica y científica nos motiva. Estamos preparando herramientas inteligentes de CV y emparejamiento con IA que te harán destacar.`

  const html = emailLayout(
    "¡Ya estás en la lista de espera de Biovity!",
    `
    <h2>¡Hola!</h2>
    <p>Queríamos confirmarte que te has registrado exitosamente en nuestra <strong>Lista de Espera</strong>.</p>
    <p>${welcomeText}</p>
    <p>Te mantendremos al tanto de las novedades de desarrollo y te daremos acceso prioritario en cuanto abramos nuestra fase beta.</p>
    <p>¡Gracias por confiar en nosotros!</p>
    <p>Atentamente,<br/><strong>El equipo de Biovity</strong></p>
    `
  )

  return getResend().emails.send({
    from: EMAIL_FROM,
    to,
    subject: "¡Te damos la bienvenida a la lista de espera de Biovity! 🎉",
    html,
  })
}

export async function sendWelcomeEmail(
  to: string,
  name: string,
  type: "professional" | "organization"
) {
  const isCompany = type === "organization"
  const title = isCompany
    ? "Te damos la bienvenida a Biovity para Empresas"
    : "Bienvenido a Biovity — Tu carrera científica te espera"
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://biovity.cl"

  const onboardingSteps = isCompany
    ? `
    <p>Aquí tienes los primeros pasos recomendados para empezar a reclutar:</p>
    <ul>
      <li><strong>Completa el perfil de tu empresa</strong>: Sube tu logo y describe el impacto de tu organización.</li>
      <li><strong>Publica tu primera vacante</strong>: Configura tus requerimientos y deja que la IA asista en la descripción.</li>
      <li><strong>Invita a tu equipo</strong>: Agrega a otros reclutadores en la pestaña de gestión de equipo.</li>
    </ul>
    <div class="button-container">
      <a href="${appUrl}/dashboard" class="button">Publicar primera oferta</a>
    </div>
    `
    : `
    <p>Aquí tienes algunas cosas que puedes hacer hoy mismo en tu perfil profesional:</p>
    <ul>
      <li><strong>Completar mi perfil</strong>: Completa tus estudios, experiencias y habilidades biotecnológicas.</li>
      <li><strong>Descubre ofertas de empleo</strong>: Explora las vacantes publicadas en el sector científico.</li>
      <li><strong>Activa alertas</strong>: Te notificaremos de forma personalizada según tus áreas de interés.</li>
    </ul>
    <div class="button-container">
      <a href="${appUrl}/dashboard" class="button">Completar mi perfil</a>
    </div>
    `

  const html = emailLayout(
    title,
    `
    <h2>¡Hola ${name}!</h2>
    <p>¡Tu cuenta ha sido creada exitosamente! Estamos felices de recibirte en nuestra comunidad dedicada al talento y la ciencia.</p>
    ${onboardingSteps}
    <p>¡Mucho éxito en la plataforma!</p>
    <p>Atentamente,<br/><strong>El equipo de Biovity</strong></p>
    `
  )

  return getResend().emails.send({
    from: EMAIL_FROM,
    to,
    subject: isCompany
      ? "¡Bienvenido a Biovity Empresas! 🏢"
      : "¡Te damos la bienvenida a Biovity! 👋",
    html,
  })
}

export async function sendVerificationEmail(to: string, url: string) {
  const html = emailLayout(
    "Verifica tu correo electrónico",
    `
    <h2>Verifica tu dirección de correo</h2>
    <p>Gracias por registrarte en Biovity. Para completar tu registro y verificar tu dirección de correo electrónico, haz clic en el botón de abajo:</p>
    <div class="button-container">
      <a href="${url}" class="button">Verificar correo electrónico</a>
    </div>
    <p>Si el botón anterior no funciona, puedes copiar y pegar el siguiente enlace directamente en tu navegador:</p>
    <p style="word-break: break-all; font-size: 13px; color: #71787d; background-color: #f3f3f5; padding: 12px; border-radius: 8px;">${url}</p>
    <p>Este enlace de verificación expirará pronto por razones de seguridad.</p>
    <p>Atentamente,<br/><strong>El equipo de Biovity</strong></p>
    `
  )

  return getResend().emails.send({
    from: EMAIL_FROM,
    to,
    subject: "Verifica tu cuenta de Biovity",
    html,
  })
}

export async function sendResetPasswordEmail(to: string, url: string) {
  const html = emailLayout(
    "Restablecer tu contraseña",
    `
    <h2>Restablecer contraseña</h2>
    <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en Biovity. Para proceder, haz clic en el botón de abajo:</p>
    <div class="button-container">
      <a href="${url}" class="button">Restablecer contraseña</a>
    </div>
    <p>Si tú no solicitaste este cambio, puedes ignorar este correo de forma segura. Tu contraseña seguirá siendo la misma.</p>
    <p>Si el botón anterior no funciona, puedes copiar y pegar el siguiente enlace directamente en tu navegador:</p>
    <p style="word-break: break-all; font-size: 13px; color: #71787d; background-color: #f3f3f5; padding: 12px; border-radius: 8px;">${url}</p>
    <p>Atentamente,<br/><strong>El equipo de Biovity</strong></p>
    `
  )

  return getResend().emails.send({
    from: EMAIL_FROM,
    to,
    subject: "Restablecer tu contraseña de Biovity",
    html,
  })
}

export async function sendOrganizationInvitationEmail(
  to: string,
  inviterName: string,
  organizationName: string,
  role: string,
  url: string
) {
  const roleNames: Record<string, string> = {
    admin: "Administrador",
    recruiter: "Reclutador",
    viewer: "Visor",
  }
  const roleName = roleNames[role] || role

  const html = emailLayout(
    `Invitación a unirte a ${organizationName}`,
    `
    <h2>¡Hola!</h2>
    <p><strong>${inviterName}</strong> te ha invitado a unirte al equipo de <strong>${organizationName}</strong> en Biovity con el rol de <strong>${roleName}</strong>.</p>
    <p>Para aceptar esta invitación y comenzar a colaborar con el equipo, haz clic en el botón de abajo:</p>
    <div class="button-container">
      <a href="${url}" class="button">Aceptar invitación</a>
    </div>
    <p>Si el botón anterior no funciona, puedes copiar y pegar el siguiente enlace directamente en tu navegador:</p>
    <p style="word-break: break-all; font-size: 13px; color: #71787d; background-color: #f3f3f5; padding: 12px; border-radius: 8px;">${url}</p>
    <p>Esta invitación expirará pronto por razones de seguridad.</p>
    <p>Atentamente,<br/><strong>El equipo de Biovity</strong></p>
    `
  )

  return getResend().emails.send({
    from: EMAIL_FROM,
    to,
    subject: `${inviterName} te ha invitado a unirte a ${organizationName} en Biovity`,
    html,
  })
}

export async function subscribeToResendAudience(email: string, name?: string) {
  const audienceId = process.env.RESEND_AUDIENCE_ID
  if (!audienceId) {
    console.warn("RESEND_AUDIENCE_ID is not defined, skipping contact subscription.")
    return null
  }

  const nameParts = name?.trim().split(/\s+/) || []
  const firstName = nameParts[0] || ""
  const lastName = nameParts.slice(1).join(" ") || ""

  try {
    const { data, error } = await getResend().contacts.create({
      email,
      firstName,
      lastName,
      unsubscribed: false,
      audienceId,
    })

    if (error) {
      console.error("Resend Audience contact creation error:", error)
      return null
    }

    return data
  } catch (err) {
    console.error("Failed to subscribe user to Resend Audience:", err)
    return null
  }
}
