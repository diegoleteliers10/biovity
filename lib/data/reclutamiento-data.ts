import {
  Atom01Icon,
  Award01Icon,
  BrainIcon,
  Building02Icon,
  Building03Icon,
  Chemistry01Icon,
  Clock01Icon,
  FileSearchIcon,
  FilterIcon,
  MicroscopeIcon,
  Search01Icon,
  Shield01Icon,
  SparklesIcon,
  Target01Icon,
  TradeUpIcon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons"
import type {
  DiferenciadorBiovity,
  FriccionWorkflow,
  HerramientaActual,
  HeroStatReclutamiento,
  MatrizComparativaItem,
  FlujoEtapa,
  ReclutamientoFAQItem,
} from "@/lib/types/reclutamiento"

export const HERO_STATS_RECLUTAMIENTO: HeroStatReclutamiento[] = [
  {
    value: "60%",
    label: "Reducción en tiempo de contratación",
    sublabel: "De 45+ días a menos de 15 días en roles técnicos",
  },
  {
    value: "100%",
    label: "Foco exclusivo en biociencias y biotech",
    sublabel: "Sin ruido ni perfiles no calificados del mercado general",
  },
  {
    value: "4.8x",
    label: "Mayor precisión en matching técnico",
    sublabel: "Reconocimiento semántico de técnicas, equipos y normativas",
  },
]

export const HERRAMIENTAS_ACTUALES: HerramientaActual[] = [
  {
    title: "Portales de Empleo Masivos",
    category: "Difusión General",
    examples: "LinkedIn Jobs, Trabajando.com, Laborum, Indeed",
    icon: Building02Icon,
    tag: "Alto volumen, bajo calce",
    comoSeUsa:
      "Se publican ofertas abiertas con descripciones genéricas para captar la mayor cantidad de postulantes posibles a través de formularios estándar.",
    limitaciones: [
      "Más del 80% de los postulantes no tienen formación científica ni experiencia técnica en laboratorio.",
      "Filtros genéricos por título universitario que ignoran técnicas concretas (ej. HPLC, CRISPR, cultivo celular).",
      "Los reclutadores pierden decenas de horas revisando cientos de CVs descartables.",
      "Falta de comprensión de jerarquías de posgrado (magísteres en ciencias vs doctorados de investigación).",
    ],
  },
  {
    title: "ATS Corporativos Tradicionales",
    category: "Gestión y Tracking",
    examples: "Workday, BambooHR, Greenhouse, Lever, Taleo",
    icon: Building03Icon,
    tag: "Costosos y no adaptados",
    comoSeUsa:
      "Utilizados por grandes corporaciones como repositorios centrales de candidatos y gestión de aprobaciones de contratación interna.",
    limitaciones: [
      "Filtrado estricto por palabras clave exactas que descarta candidatos por diferencias de formato (ej. qPCR vs RT-PCR).",
      "Costo de implementación e integración sumamente elevado, inaccesible para startups bio y laboratorios medianos.",
      "No cuentan con taxonomía para técnicas analíticas, bioseguridad (BSL) ni normativas GMP / GLP / ISO 17025.",
      "Experiencia de postulación larga y frustrante para los científicos e investigadores.",
    ],
  },
  {
    title: "Headhunting & Agencias Tradicionales",
    category: "Búsqueda Externa",
    examples: "Agencias de RRHH generalistas y firmas de selección comercial",
    icon: UserMultiple02Icon,
    tag: "Lento y muy costoso",
    comoSeUsa:
      "Se terceriza la búsqueda de especialistas científicos a reclutadores externos cuando los canales directos fallan.",
    limitaciones: [
      "Tarifas sumamente altas: entre un 15% y 25% del salario anual bruto por cada contratación exitosa.",
      "Consultores de RRHH que desconocen la diferencia real entre química analítica, síntesis o biología molecular.",
      "Procesos que tardan de 2 a 3 meses en entregar las primeras ternas de candidatos.",
      "Escaso acceso a redes profundas de talento joven e investigadores en centros científicos chilenos.",
    ],
  },
  {
    title: "Planillas de Cálculo y Correo Manual",
    category: "Método Tradicional Informal",
    examples: "Excel, Google Sheets, correos de Gmail / Outlook, WhatsApp",
    icon: FileSearchIcon,
    tag: "Desorganizado y riesgoso",
    comoSeUsa:
      "Recepción de CVs en un buzón de correo compartido y seguimiento del estado de candidatos en filas de Excel.",
    limitaciones: [
      "Pérdida frecuente de postulaciones valiosas atrapadas en cadenas de correos no leídos.",
      "Nula trazabilidad del feedback técnico entre el área de RRHH y el Investigador Principal (PI).",
      "Falta de métricas de conversión, tiempos de respuesta y análisis de salarios de mercado.",
      "Riesgos graves de privacidad y desactualización permanente de los datos de contacto.",
    ],
  },
  {
    title: "Bolsas Universitarias & Redes de Contactos",
    category: "Búsqueda Académica",
    examples: "Bolsas de egresados de facultades, cadenas de contactos personales, grupos de WhatsApp",
    icon: MicroscopeIcon,
    tag: "Alcance fragmentado",
    comoSeUsa:
      "Envío de afiches o correos a profesores de departamentos de bioquímica, química o biotecnología para pedir recomendaciones.",
    limitaciones: [
      "Alcance limitado únicamente a graduados de una facultad específica sin cobertura nacional.",
      "Proceso pasivo: depende de que el académico recuerde o reenvíe el mensaje a sus exalumnos.",
      "Sin estandarización de habilidades técnicas ni evaluación preliminar de competencias de laboratorio.",
      "Incapacidad de escalar cuando se requiere contratar múltiples perfiles técnicos rápidamente.",
    ],
  },
]

export const FRICCIONES_WORKFLOW: FriccionWorkflow[] = [
  {
    title: "Filtrado Ciego por Palabras Clave",
    description:
      "Los ATS tradicionales buscan coincidencias de texto rígidas. Si una vacante pide 'qPCR' y el candidato redactó 'Reacción en Cadena de la Polimerasa Cuantitativa', el sistema lo descarta sin que ningún humano lo evalúe.",
    impacto: "Pérdida del 40% de candidatos de alto calibre por discrepancias de redacción técnica.",
    sintomaComun: "Ternas vacías a pesar de contar con científicos altamente calificados en la base de datos.",
    icon: Search01Icon,
  },
  {
    title: "Saturación de Perfiles Sin Formación Científica",
    description:
      "Al publicar en portales masivos, el algoritmo expone la oferta a audiencias transversales. El equipo de selección recibe cientos de postulaciones de perfiles administrativos o sin experiencia en bioseguridad ni laboratorio.",
    impacto: "Más de 35 horas de trabajo manual desperdiciadas en filtrar perfiles irrelevantes.",
    sintomaComun: "Fatiga del reclutador y demoras de semanas antes de agendar las primeras entrevistas técnicas.",
    icon: FilterIcon,
  },
  {
    title: "Desconexión entre RRHH y el Líder Técnico / PI",
    description:
      "El equipo de Recursos Humanos no siempre maneja el vocabulario de equipamiento técnico (HPLC, GC-MS, Citometría de Flujo, Biorreactores). La retroalimentación con el Investigador Principal se vuelve lenta y confusa.",
    impacto: "Candidatos mal preseleccionados que son descartados en la etapa de entrevista técnica final.",
    sintomaComun: "Múltiples rondas de entrevistas fallidas y fricción entre el área de personas y el laboratorio.",
    icon: BrainIcon,
  },
  {
    title: "Falta de Validación de Normativas y Bioseguridad",
    description:
      "Las herramientas generales no permiten estructurar preguntas de descarte basadas en normativas críticas para la industria (GMP, GLP, ISO 17025, ISO 9001 o niveles de bioseguridad BSL-1/2/3).",
    impacto: "Contratación de perfiles que requieren meses de reentrenamiento regulatorio antes de operar.",
    sintomaComun: "Costos ocultos de onboarding y retrasos en la validación de lotes o ensayos de laboratorio.",
    icon: Shield01Icon,
  },
]

export const DIFERENCIADORES_BIOVITY: DiferenciadorBiovity[] = [
  {
    title: "Taxonomía Científica Nativa & AI Matching",
    description:
      "Biovity comprende las relaciones semánticas de más de 450 técnicas, reactivos, equipos e instrumentos de laboratorio. Entiende que HPLC, UPLC y cromatografía líquida forman parte de la misma familia analítica.",
    tag: "Inteligencia de Dominio",
    ventajaTecnica: "Scoring automático de compatibilidad técnica basado en experiencia real demostrada.",
    metricaClave: "98% de precisión en calce de competencias",
    icon: BrainIcon,
  },
  {
    title: "Filtros Técnicos y Regulatorios Especializados",
    description:
      "Segmenta al instante candidatos según certificaciones de calidad (GMP, GLP, ISO), nivel de formación (Licenciatura, Magíster, Doctorado, Postdoc) y técnicas de laboratorio comprobadas.",
    tag: "Filtros de Alta Precisión",
    ventajaTecnica: "Búsqueda multidimensional por instrumentos, líneas de I+D y áreas de aplicación biotecnológica.",
    metricaClave: "Filtros en 1 clic vs 30h de lectura de CVs",
    icon: FilterIcon,
  },
  {
    title: "Comunidad 100% Científica y Verificada en Chile",
    description:
      "Acceso directo a la red más activa de bioquímicos, biotecnólogos, químicos farmacéuticos, ingenieros químicos y científicos de materiales del país, listos para integrarse a empresas e instituciones.",
    tag: "Red Curada",
    ventajaTecnica: "Perfiles estandarizados con detalle de proyectos, publicaciones, patentes y técnicas de banco.",
    metricaClave: "+500 profesionales activos en Chile",
    icon: Atom01Icon,
  },
  {
    title: "Pipeline ATS Diseñado para Laboratorios",
    description:
      "Gestiona postulantes a través de un tablero Kanban visual con etapas adaptadas al flujo de evaluación científica: Revisión Técnica, Prueba de Protocolo / Laboratorio, Entrevista con PI y Oferta.",
    tag: "Flujo Especializado",
    ventajaTecnica: "Notas colaborativas entre RRHH y jefaturas de laboratorio con rúbricas de evaluación técnica.",
    metricaClave: "Reducción de 60% en ciclo de selección",
    icon: SparklesIcon,
  },
  {
    title: "Transparencia Salarial y Datos de Mercado",
    description:
      "Acceso a estudios continuos de compensaciones del sector biotecnológico y científico en Chile, permitiendo definir bandas salariales competitivas y realistas para cada nivel de experiencia.",
    tag: "Inteligencia Salarial",
    ventajaTecnica: "Benchmark salarial por cargo, región, posgrado y subsector industrial.",
    metricaClave: "Datos actualizados del mercado chileno",
    icon: TradeUpIcon,
  },
  {
    title: "Implementación Inmediata Sin Fricción",
    description:
      "Sin contratos de permanencia forzada ni meses de parametrización. Comienza a publicar y evaluar candidatos en menos de 5 minutos desde cualquier navegador.",
    tag: "Time-to-Value Inmediato",
    ventajaTecnica: "Planes transparentes desde $0 con soporte directo y local en Chile.",
    metricaClave: "Activo en < 5 minutos",
    icon: Clock01Icon,
  },
]

export const MATRIZ_COMPARATIVA: MatrizComparativaItem[] = [
  {
    criterio: "Especialización 100% en Biociencias & Biotech",
    descripcion: "¿La plataforma está construida exclusivamente para el sector científico?",
    biovity: {
      status: true,
      detalle: "100% especializada en biotecnología, química, bioquímica, farmacia y salud.",
    },
    atsTradicional: {
      status: false,
      detalle: "Generalista. Pensado para finanzas, ventas, servicios y tech genérico.",
    },
    portalesMasivos: {
      status: false,
      detalle: "Masivo y transversal a todas las industrias sin foco técnico.",
    },
    headhunters: {
      status: "parcial",
      detalle: "Consultores sin formación en ciencias que atienden múltiples rubros a la vez.",
    },
  },
  {
    criterio: "Comprensión Semántica de Técnicas de Laboratorio",
    descripcion: "Reconocimiento inteligente de técnicas (HPLC, qPCR, CRISPR, ELISA, etc.)",
    biovity: {
      status: true,
      detalle: "Motor IA con taxonomía de 450+ técnicas, reactivos y metodologías científicas.",
    },
    atsTradicional: {
      status: false,
      detalle: "Solo busca texto exacto sin entender equivalencias ni técnicas relacionadas.",
    },
    portalesMasivos: {
      status: false,
      detalle: "Filtros por cargo básico; no analiza capacidades analíticas ni protocolos.",
    },
    headhunters: {
      status: "parcial",
      detalle: "Depende del criterio individual del consultor asignado.",
    },
  },
  {
    criterio: "Filtros por Normativas Regulatorias (GMP, GLP, ISO)",
    descripcion: "Filtrado estructurado por experiencia en Buenas Prácticas y Bioseguridad",
    biovity: {
      status: true,
      detalle: "Filtros nativos por GMP, GLP, ISO 17025, ISO 9001 y niveles BSL-1/2/3.",
    },
    atsTradicional: {
      status: false,
      detalle: "Requiere crear formularios personalizados manuales y costosos.",
    },
    portalesMasivos: {
      status: false,
      detalle: "Inexistente en filtros estándar de búsqueda.",
    },
    headhunters: {
      status: "parcial",
      detalle: "Indagan manualmente en entrevistas telefónicas iniciales.",
    },
  },
  {
    criterio: "AI Matching Específico para Perfiles Científicos",
    descripcion: "Algoritmo de recomendación y ranking técnico de postulantes",
    biovity: {
      status: true,
      detalle: "Scoring de compatibilidad según formación, publicaciones, técnicas e I+D.",
    },
    atsTradicional: {
      status: false,
      detalle: "Algoritmos genéricos no adaptados a perfiles de investigación.",
    },
    portalesMasivos: {
      status: "parcial",
      detalle: "Matching básico por ubicación y coincidencias de título genérico.",
    },
    headhunters: {
      status: false,
      detalle: "Evaluación 100% manual con alta variabilidad y demoras.",
    },
  },
  {
    criterio: "Base de Talento Científico Pre-Calificada en Chile",
    descripcion: "Acceso a una comunidad activa de científicos y técnicos en el país",
    biovity: {
      status: true,
      detalle: "Red activa de más de 500 profesionales de biociencias verificados en Chile.",
    },
    atsTradicional: {
      status: false,
      detalle: "No incluye candidatos; solo es un software vacío que debes llenar tú.",
    },
    portalesMasivos: {
      status: "parcial",
      detalle: "Muchos perfiles registrados pero sin calificación ni segmentación científica.",
    },
    headhunters: {
      status: "parcial",
      detalle: "Bases de contactos privadas y limitadas al historial de la agencia.",
    },
  },
  {
    criterio: "Pipeline ATS Visual con Etapas de Laboratorio",
    descripcion: "Tablero de seguimiento colaborativo entre RRHH y jefes de laboratorio",
    biovity: {
      status: true,
      detalle: "Kanban con etapas científicas, notas compartidas y rúbricas técnicas.",
    },
    atsTradicional: {
      status: true,
      detalle: "Incluye tableros Kanban, pero con flujos genéricos no científicos.",
    },
    portalesMasivos: {
      status: false,
      detalle: "Listado plano de postulantes sin etapas de laboratorio ni colaboración técnica.",
    },
    headhunters: {
      status: false,
      detalle: "Envío de informes en PDF o planillas externas por correo.",
    },
  },
  {
    criterio: "Tiempo Promedio de Contratación (Time-to-Hire)",
    descripcion: "Días requeridos desde la publicación hasta la oferta aceptada",
    biovity: {
      status: true,
      detalle: "12 a 18 días promedio gracias al matching y filtros técnicos.",
    },
    atsTradicional: {
      status: false,
      detalle: "40 a 60 días debido al volumen de ruido y revisiones manuales.",
    },
    portalesMasivos: {
      status: false,
      detalle: "45 a 70 días por exceso de CVs no calificados.",
    },
    headhunters: {
      status: false,
      detalle: "60 a 90 días en promedio para roles especializados.",
    },
  },
  {
    criterio: "Modelo de Precios y Accesibilidad",
    descripcion: "Inversión requerida para utilizar la plataforma o servicio",
    biovity: {
      status: true,
      detalle: "Planes transparentes desde $0 CLP, sin comisiones sobre el salario.",
    },
    atsTradicional: {
      status: false,
      detalle: "Licencias anuales de $3.000 a $15.000+ USD con costos de setup.",
    },
    portalesMasivos: {
      status: "parcial",
      detalle: "Cobro por publicación individual o slots mensuales sin garantía técnica.",
    },
    headhunters: {
      status: false,
      detalle: "15% a 25% del salario anual bruto por cada contratación (muy costoso).",
    },
  },
]

export const FLUJO_COMPARATIVO: FlujoEtapa[] = [
  {
    numero: "01",
    fase: "Publicación & Atracción",
    tradicional: {
      titulo: "Difusión Masiva y Ruidosa",
      descripcion:
        "Publicación en portales genéricos o reenvío informal por correo a profesores. Llegada de 150+ CVs donde el 85% carece de bases científicas.",
      tiempo: "Días 1 a 10",
    },
    biovity: {
      titulo: "Atracción Focalizada en Biociencias",
      descripcion:
        "Publicación estructurada con requisitos de técnicas de laboratorio, normativas y nivel de posgrado. Exposición directa ante talento calificado.",
      tiempo: "Día 1",
      destacado: "100% de postulantes del rubro",
    },
  },
  {
    numero: "02",
    fase: "Filtrado & Evaluación Técnica",
    tradicional: {
      titulo: "Revisión Manual y Filtros Rígidos",
      descripcion:
        "El reclutador lee decenas de CVs uno a uno buscando palabras exactas. Se descartan buenos perfiles por diferencias de redacción técnica.",
      tiempo: "Días 11 a 25",
    },
    biovity: {
      titulo: "AI Scoring Semántico Automático",
      descripcion:
        "El algoritmo analiza técnicas, instrumentos y antecedentes científicos, ordenando a los candidatos por afinidad real con el cargo.",
      tiempo: "Inmediato (Automático)",
      destacado: "Ahorro de 30+ horas de revisión",
    },
  },
  {
    numero: "03",
    fase: "Colaboración con el Líder de I+D / PI",
    tradicional: {
      titulo: "Idas y Vueltas por Correo",
      descripcion:
        "Envío de PDFs por email al Investigador Principal. Pérdida de feedback, demoras en coordinar disponibilidad y falta de criterios unificados.",
      tiempo: "Días 26 a 40",
    },
    biovity: {
      titulo: "Tablero ATS Compartido en Tiempo Real",
      descripcion:
        "El Investigador Principal y RRHH acceden al mismo Kanban con rúbricas de evaluación técnica, notas internas y estado en vivo.",
      tiempo: "Días 3 a 8",
      destacado: "Colaboración técnica fluida",
    },
  },
  {
    numero: "04",
    fase: "Decisión Final & Contratación",
    tradicional: {
      titulo: "Procesos Extensos y Fuga de Candidatos",
      descripcion:
        "Procesos que superan los 50 días generan que los mejores científicos acepten otras ofertas o permanezcan en la academia.",
      tiempo: "Días 45 a 65+",
    },
    biovity: {
      titulo: "Cierre Ágil y Calce Perfecto",
      descripcion:
        "Entrevistas enfocadas con candidatos de alto ajuste técnico. Ofertas respaldadas por datos salariales reales de mercado.",
      tiempo: "Días 10 a 15",
      destacado: "60% menos tiempo de contratación",
    },
  },
]

export const FAQS_RECLUTAMIENTO: ReclutamientoFAQItem[] = [
  {
    question: "¿Qué diferencia a Biovity de un portal de empleo masivo como LinkedIn o Laborum?",
    answer:
      "A diferencia de portales genéricos que reciben postulaciones de cualquier rubro, Biovity está 100% enfocado en el ecosistema científico chileno (biotecnología, bioquímica, química, farmacia, ingeniería química y salud). Contamos con filtros nativos por técnicas analíticas (HPLC, PCR, CRISPR), normativas de calidad (GMP, GLP, ISO 17025) y una comunidad pre-segmentada de profesionales y científicos.",
    category: "Comparativa",
  },
  {
    question: "¿Biovity reemplaza o complementa mi ATS corporativo actual (Workday, Greenhouse, etc.)?",
    answer:
      "Biovity puede funcionar de ambas formas: como tu ATS principal completo (con tablero Kanban, gestión de postulantes y notas de equipo) si buscas una solución ágil y sin costos de setup; o como tu canal especializado de atracción y pre-calificación técnica científica que alimenta tu ATS central corporativo.",
    category: "Integración",
  },
  {
    question: "¿Cómo funciona el sistema de AI Matching para habilidades de laboratorio?",
    answer:
      "Nuestro motor de inteligencia artificial utiliza una taxonomía especializada de más de 450 técnicas científicas, reactivos y metodologías experimentales. Analiza semánticamente la experiencia descrita en los perfiles, reconociendo equivalencias técnicas (por ejemplo, relacionando HPLC con cromatografía líquida de alta resolución o qPCR con PCR en tiempo real) y asignando un scoring de afinidad técnica objetivo.",
    category: "Tecnología",
  },
  {
    question: "¿Qué tipos de perfiles y empresas se benefician de Biovity?",
    answer:
      "Biovity es utilizado por startups biotecnológicas, laboratorios de análisis clínico, empresas farmacéuticas, industrias químicas, centros de I+D agroalimentarios, consultoras ambientales y laboratorios universitarios que buscan contratar desde técnicos de laboratorio e ingenieros de procesos hasta investigadores principales, directores científicos y químicos farmacéuticos.",
    category: "Perfiles",
  },
  {
    question: "¿Cuánto cuesta utilizar las herramientas de reclutamiento de Biovity?",
    answer:
      "Contamos con un Plan Free sin costo para publicar ofertas y explorar candidatos, así como planes Pro y Business desde $40.000 CLP/mes con acceso completo a búsqueda activa de talentos, AI Matching avanzado y postulaciones ilimitadas. Sin comisiones sorpresa por contratación ni tarifas exorbitantes de headhunting.",
    category: "Precios",
  },
  {
    question: "¿Cómo puedo empezar a reclutar con Biovity hoy mismo?",
    answer:
      "Solo necesitas registrarte como Empresa u Organización en menos de 2 minutos. Podrás publicar tu primera oferta de inmediato, definir los requisitos técnicos y recibir candidatos calificados con scoring de compatibilidad de forma automática.",
    category: "Inicio",
  },
]
