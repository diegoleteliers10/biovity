import {
  Award01Icon,
  BookOpenIcon,
  Briefcase01Icon,
  Building02Icon,
  CheckmarkCircle02Icon,
  Download01Icon,
  File02Icon,
  GraduationScrollIcon,
  Search01Icon,
  Target01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import type {
  ConsejoArticulo,
  ConsejoCategoria,
  ConsejoFAQItem,
  ConsejoHerramienta,
  ConsejoStat,
} from "@/lib/types/consejos-carrera"

export const CONSEJOS_STATS: ConsejoStat[] = [
  { value: "+45", label: "Guías y tutoriales especializados" },
  { value: "92%", label: "Tasa de éxito en paso a la Industria" },
  { value: "10k+", label: "Científicos capacitados en LATAM" },
  { value: "100%", label: "Contenido redactado por mentores del sector" },
]

export const CONSEJOS_CATEGORIAS: ConsejoCategoria[] = [
  {
    id: "todos",
    label: "Todos los consejos",
    description: "Explora todas las guías y estrategias de carrera.",
  },
  {
    id: "cv-ats",
    label: "CV & Filtros ATS",
    description: "Cómo redactar y formatear tu currículum científico para ser seleccionado.",
  },
  {
    id: "academia-industria",
    label: "De Academia a Industria",
    description: "Transición de laboratorio universitario (MSc/PhD) al sector privado.",
  },
  {
    id: "entrevistas",
    label: "Entrevistas Técnicas",
    description: "Cómo dominar entrevistas de R&D, Calidad, Bioinformática y Regulación.",
  },
  {
    id: "salarios-negociacion",
    label: "Salarios & Negociación",
    description: "Rangos de remuneración, beneficios y cómo negociar tu primera oferta.",
  },
  {
    id: "networking",
    label: "Networking & LinkedIn",
    description: "Construcción de marca personal científica y red de contactos clave.",
  },
]

export const CONSEJOS_ARTICULOS: ConsejoArticulo[] = [
  {
    id: "cv-biotech-ats-2025",
    slug: "cv-biotech-optimizado-ats",
    title: "Cómo estructurar un CV científico que supere los filtros ATS en empresas Biotech",
    description:
      "Aprende a transformar una extensa lista de publicaciones académicas en un currículum ejecutivo centrado en resultados, competencias técnicas y tecnologías clave.",
    category: "cv-ats",
    readTime: "7 min de lectura",
    author: {
      name: "Dra. Camila Morales",
      role: "Head of Talent & Ex-Recruiter Biotech",
    },
    date: "15 Ene 2025",
    featured: true,
    badgeText: "Más leído",
    takeaways: [
      "Traducción de técnicas de lab (PCR, HPLC, CRISPR) a palabras clave ATS",
      "Formato estándar de 2 páginas máximo sin tablas complejas",
      "Inclusión de métricas cuantificables de impacto",
    ],
    contentSummary:
      "El 80% de los currículums académicos son descartados por sistemas ATS debido al uso excesivo de formatos no compatibles o descripciones puramente teóricas. En esta guía te mostramos el paso a paso para adecuar tu CV al mercado privado.",
  },
  {
    id: "transicion-phd-industria",
    slug: "guia-transicion-phd-postdoc-industria-biomedica",
    title:
      "Guía de transición: Del laboratorio académico (PhD / Postdoc) a la industria biotecnológica",
    description:
      "Supera el síndrome del impostor y traduce tu experiencia en proyectos de investigación en valor directo para empresas de I+D, farmacéuticas y bioprocesos.",
    category: "academia-industria",
    readTime: "10 min de lectura",
    author: {
      name: "Dr. Ignacio Silva",
      role: "Principal Scientist & Mentor Biovity",
    },
    date: "10 Ene 2025",
    featured: true,
    badgeText: "Esencial",
    takeaways: [
      "Cómo identificar tus habilidades transferibles (Gestión de proyectos, Análisis de datos)",
      "Principales diferencias entre cultura de laboratorio universitario e industria",
      "Puestos de entrada recomendados: MSL, R&D Associate, QA Specialist",
    ],
    contentSummary:
      "Dar el salto de la universidad a la empresa privada puede generar dudas sobre cómo adaptar tus años de investigación. Esta guía te orienta en el cambio de mentalidad y posicionamiento profesional.",
  },
  {
    id: "preparar-entrevista-tecnica-bio-rd",
    slug: "como-preparar-entrevista-tecnica-biomedicina-rd",
    title: "Cómo preparar una entrevista técnica para roles de I+D y Bioinformática",
    description:
      "Preguntas frecuentes, resolución de casos de estudio biológicos en vivo y cómo explicar tus metodologías experimentales con claridad comunicativa.",
    category: "entrevistas",
    readTime: "8 min de lectura",
    author: {
      name: "Ing. Valentina Rojas",
      role: "Lead Bioinformatician",
    },
    date: "04 Ene 2025",
    featured: false,
    takeaways: [
      "Método STAR aplicado a resolución de fallos en ensayos y experimentos",
      "Defensa de portafolios de código y pipelines genómicos en GitHub",
      "Cómo demostrar rigor científico alineado a objetivos comerciales",
    ],
    contentSummary:
      "Las entrevistas técnicas en biotecnología evaluarán no solo tu dominio teórico, sino tu capacidad de adaptación cuando un ensayo no da el resultado esperado.",
  },
  {
    id: "estrategias-negociacion-salarial-ciencias",
    slug: "estrategias-negociacion-salarial-primer-empleo-ciencias",
    title: "Estrategias para negociar tu salario de entrada en el sector científico y farmacéutico",
    description:
      "Conoce los rangos salariales promedio en Chile, qué beneficios adicionales solicitar (capacitaciones, bonos por patente, flexibilidad) y cómo argumentar tu pretensión.",
    category: "salarios-negociacion",
    readTime: "6 min de lectura",
    author: {
      name: "Felipe Arancibia",
      role: "Consultor de RRHH en Ciencias de la Vida",
    },
    date: "28 Dic 2024",
    featured: false,
    takeaways: [
      "Cómo responder a la pregunta '¿cuáles son tus pretensiones de sueldo?'",
      "Evaluación del paquete total de compensación (Bono desempeño, Seguro de salud)",
      "Diferencias salariales según región y tamaño de la empresa (Startup vs Transnacional)",
    ],
    contentSummary:
      "Negociar el sueldo de forma fundamentada demuestra profesionalismo y conocimiento del mercado. Aprende a usar datos reales de sueldos para fijar tus expectativas.",
  },
  {
    id: "linkedin-para-cientificos-networking",
    slug: "linkedin-y-networking-para-profesionales-de-biociencias",
    title: "LinkedIn para Científicos: Cómo conectar con Recruiters y Founders Biotech",
    description:
      "Optimiza tu titular, extracto y sección de proyectos para atraer oportunidades laborales sin depender únicamente de enviar postulaciones frías.",
    category: "networking",
    readTime: "5 min de lectura",
    author: {
      name: "María José Soto",
      role: "Especialista en Marca Personal Científica",
    },
    date: "20 Dic 2024",
    featured: false,
    takeaways: [
      "Configuración del perfil con terminología científica y de negocios",
      "Cómo abordar de manera profesional a líderes de investigación en LinkedIn",
      "Participación en eventos del ecosistema de innovación (HUBs, Spin-offs)",
    ],
    contentSummary:
      "Más del 60% de las vacantes senior en biociencias se cubren por recomendaciones directas o búsqueda directa de ejecutivos en LinkedIn.",
  },
  {
    id: "habilidades-blandas-demandadas-biotech-2025",
    slug: "habilidades-blandas-y-tecnicas-mas-demandadas-biotech",
    title: "Habilidades blandas y técnicas más cotizadas en la industria Biotech 2025",
    description:
      "Revisión integral del perfil híbrido: comunicación efectiva, regulación GMP/GLP, análisis estadístico avanzado y trabajo interdisciplinario.",
    category: "academia-industria",
    readTime: "7 min de lectura",
    author: {
      name: "Dr. Esteban Bravo",
      role: "Director de Operaciones Biotech",
    },
    date: "12 Dic 2024",
    featured: false,
    takeaways: [
      "Conocimiento normativo (ISP, FDA, Normas ISO 17025)",
      "Capacidad de divulgación técnica hacia equipos comerciales",
      "Manejo de herramientas de bioestadística (Python, R, Prism)",
    ],
    contentSummary:
      "Las empresas buscan científicos versátiles capaces de conectar el laboratorio con la estrategia de negocio y los requisitos regulatorios exigidos.",
  },
]

export const CONSEJOS_HERRAMIENTAS: ConsejoHerramienta[] = [
  {
    id: "plantilla-cv-ats",
    title: "Plantilla CV Científico ATS-Friendly (Word / PDF)",
    description:
      "Estructura probada en más de 200 selecciones exitosas en empresas de biotecnología, pharma y química analítica.",
    tag: "Plantilla Descargable",
    buttonText: "Ver Plantilla CV",
    popular: true,
  },
  {
    id: "checklist-entrevista-lab",
    title: "Checklist de Preparación para Entrevistas de Lab & R&D",
    description:
      "Lista de chequeo con 25 puntos clave sobre protocolos, seguridad, resolución de anomalías y proyectos previos.",
    tag: "Checklist Interactivo",
    buttonText: "Obtener Checklist",
    popular: false,
  },
  {
    id: "matriz-competencias-biotech",
    title: "Matriz de Autoevaluación de Habilidades Transferibles",
    description:
      "Identifica tus puntos fuertes en gestión de proyectos, análisis de datos y competencias de laboratorio para tu CV.",
    tag: "Guía Práctica",
    buttonText: "Explorar Matriz",
    popular: true,
  },
]

export const CONSEJOS_FAQS: ConsejoFAQItem[] = [
  {
    question: "¿Es indispensable tener un Doctorado (PhD) para trabajar en la industria Biotech?",
    answer:
      "No. Si bien el Doctorado es altamente valorado para roles directivos de I+D o Investigador Principal, posiciones como Analista de Calidad, Ingeniero de Procesos, Bioinformático Junior, MSL o Especialista en Regulación aceptan graduados de Licenciatura o Magíster con habilidades aplicadas.",
  },
  {
    question: "¿Cómo destaco en mi CV si toda mi experiencia es de Tesis Universitaria?",
    answer:
      "En lugar de listar tu tesis como un simple requisito académico, preséntala como un proyecto de investigación aplicado: cuantifica el número de muestras procesadas, especifica el software y reactivos utilizados, menciona presupuestos gestionados y destaca si hubo publicaciones o patentes asociadas.",
  },
  {
    question: "¿Qué son las normas GMP y GLP y por qué son tan mencionadas en ofertas?",
    answer:
      "GMP (Buenas Prácticas de Manufactura) y GLP (Buenas Prácticas de Laboratorio) son normativas internacionales de calidad que garantizan la consistencia y seguridad en productos farmacéuticos y análisis de laboratorio. Contar con capacitación en estas normas es un gran diferenciador para postular a la industria.",
  },
  {
    question: "¿Cómo puedo preparar pretensiones de sueldo si no conozco el mercado privado?",
    answer:
      "Puedes utilizar nuestro Estudio de Salarios en Biovity (/salarios), donde desglosamos las remuneraciones promedio en Chile segmentadas por carrera, años de experiencia, nivel de postgrado y ubicación geográfica.",
  },
  {
    question: "¿Qué diferencia existe entre un CV académico y un CV enfocado a empresas?",
    answer:
      "Un CV académico (Curriculum Vitae) suele ser extenso (3-10 páginas), enfocado en becas, publicaciones, congresos y docencia. Un CV para empresas (Resume) debe concentrarse en 1 ó 2 páginas con enfoque en resultados concretos, resolución de problemas y competencias requeridas por la oferta de trabajo.",
  },
]
