import {
  Building02Icon,
  Certificate02Icon,
  Globe02Icon,
  GraduationScrollIcon,
  LanguageSkillIcon,
  Location05Icon,
  Settings01Icon,
  SourceCodeIcon,
} from "@hugeicons/core-free-icons"
import type {
  CareerTrajectoryItem,
  CarreraChartItem,
  ExperienceLevelChile,
  IndustriaChartItem,
  OptionItem,
  RegionChartItem,
  RegionChile,
  SalariosHeroStatItem,
  SalaryBandItem,
  SkillImpactItem,
} from "@/lib/types/salarios"

export const REGION_CHART_DATA: RegionChartItem[] = [
  { region: "Antofagasta\n(Norte Minero)", promedio: 2650 },
  { region: "Metropolitana\n(Servicios, Pharma, Tech)", promedio: 1895 },
  { region: "O'Higgins/Maule\n(Agroindustrial)", promedio: 1450 },
]

export const INDUSTRIA_CHART_DATA: IndustriaChartItem[] = [
  { industria: "Minería", minimo: 1800, maximo: 3500, promedio: 2650 },
  { industria: "Tech/Pharma", minimo: 1500, maximo: 3200, promedio: 2350 },
  { industria: "Retail/Pharma", minimo: 1700, maximo: 2400, promedio: 2050 },
  { industria: "Química/Procesos", minimo: 1400, maximo: 2600, promedio: 2000 },
  { industria: "Farmacéutica", minimo: 1200, maximo: 2200, promedio: 1700 },
  { industria: "Agroindustrial", minimo: 1000, maximo: 1900, promedio: 1450 },
  { industria: "Academia/I+D", minimo: 950, maximo: 1800, promedio: 1375 },
]

export const CARRERA_CHART_DATA: CarreraChartItem[] = [
  { carrera: "Bioinformática", junior: 1500, senior: 3200 },
  { carrera: "Ing. Civil Química", junior: 1600, senior: 3050 },
  { carrera: "Química y Farmacia", junior: 1700, senior: 2400 },
  { carrera: "Ing. Biotecnología", junior: 1075, senior: 2000 },
  { carrera: "Ing. Alimentos", junior: 1000, senior: 1900 },
]

export const SALARIOS_HERO_STATS: SalariosHeroStatItem[] = [
  { icon: GraduationScrollIcon, value: "12", label: "carreras STEM analizadas", color: "#6366f1" },
  { icon: Building02Icon, value: "8", label: "industrias evaluadas", color: "#3b82f6" },
  { icon: Location05Icon, value: "16", label: "regiones de Chile", color: "#10b981" },
]

// ============================================================================
// Mercado chileno: opciones para filtros y formulario Give-to-Get
// ============================================================================

export const REGIONES_CHILE: OptionItem<RegionChile>[] = [
  { value: "ARICA_Y_PARINACOTA", label: "Arica y Parinacota" },
  { value: "TARAPACA", label: "Tarapacá" },
  { value: "ANTOFAGASTA", label: "Antofagasta" },
  { value: "ATACAMA", label: "Atacama" },
  { value: "COQUIMBO", label: "Coquimbo" },
  { value: "VALPARAISO", label: "Valparaíso" },
  { value: "METROPOLITANA", label: "Metropolitana de Santiago" },
  { value: "OHIGGINS", label: "Libertador Gral. B. O'Higgins" },
  { value: "MAULE", label: "Maule" },
  { value: "NUBLE", label: "Ñuble" },
  { value: "BIOBIO", label: "Biobío" },
  { value: "ARAUCANIA", label: "La Araucanía" },
  { value: "LOS_RIOS", label: "Los Ríos" },
  { value: "LOS_LAGOS", label: "Los Lagos" },
  { value: "AYSEN", label: "Aysén del Gral. C. Ibáñez del Campo" },
  { value: "MAGALLANES", label: "Magallanes y de la Antártica Chilena" },
]

export const CARRERAS_STEM_CHILE: OptionItem[] = [
  { value: "bioinformatica", label: "Bioinformática" },
  { value: "ing_biotecnologia", label: "Ingeniería en Biotecnología" },
  { value: "quimica_farmacia", label: "Química y Farmacia" },
  { value: "ing_civil_quimica", label: "Ingeniería Civil Química" },
  { value: "ing_alimentos", label: "Ingeniería en Alimentos" },
  { value: "tec_medica", label: "Tecnología Médica" },
  { value: "bioquimica", label: "Bioquímica" },
  { value: "ing_ambiental", label: "Ingeniería Ambiental" },
  { value: "agronomia", label: "Agronomía" },
  { value: "medicina", label: "Medicina" },
  { value: "veterinaria", label: "Medicina Veterinaria" },
  { value: "acuicultura", label: "Acuicultura e Ingeniería Acuícola" },
]

export const INDUSTRIAS_CHILE: OptionItem[] = [
  { value: "farmaceutica", label: "Farmacéutica" },
  { value: "mineria_quimica", label: "Minería / Química de Procesos" },
  { value: "agroindustrial_acuicola", label: "Agroindustrial / Acuícola" },
  { value: "diagnostico_salud", label: "Diagnóstico y Salud Clínico" },
  { value: "tech_pharma", label: "Tech / Pharma" },
  { value: "academia_investigacion", label: "Academia / I+D" },
  { value: "alimentos_bebidas", label: "Alimentos y Bebidas" },
  { value: "cosmetica_aseo", label: "Cosmética y Aseo" },
]

export const NIVELES_EXPERIENCIA_CHILE: OptionItem<ExperienceLevelChile>[] = [
  { value: "JUNIOR", label: "Junior (0-2 años)" },
  { value: "MID", label: "Mid (3-5 años)" },
  { value: "SENIOR", label: "Senior (6-8 años)" },
  { value: "LEAD", label: "Specialist / Jefatura (10+ años)" },
]

export const NIVELES_EDUCACION_CHILE: OptionItem[] = [
  { value: "LICENCIATURA", label: "Licenciatura / Título Profesional" },
  { value: "MAGISTER", label: "Magíster (incluye Becas ANID)" },
  { value: "DOCTORADO", label: "Doctorado (incluye Becas Chile)" },
  { value: "POSTDOC", label: "Postdoctorado" },
]

export const MODALIDADES_TRABAJO_CHILE: OptionItem[] = [
  { value: "PRESENCIAL", label: "Presencial" },
  { value: "HIBRIDO", label: "Híbrido" },
  { value: "REMOTO", label: "Remoto (local)" },
]

export const BENEFICIOS_CHILE: OptionItem[] = [
  {
    value: "SEGURO_MEDICO_COMPLEMENTARIO",
    label: "Seguro de salud complementario (Bice/Consorcio/MetLife)",
  },
  { value: "BONO_FAENA", label: "Bono de desempeño / faena" },
  { value: "CAPACITACION_PAGADA", label: "Capacitaciones pagadas" },
  { value: "ASIGNACION_COLACION_MOVILIZACION", label: "Asignación de colación y movilización" },
  { value: "DIAS_LIBRES_EXTRA", label: "Días libres extra" },
]

export const SKILLS_IMPACTO_CHILE: SkillImpactItem[] = [
  {
    skill: "Normativas ISP / GMP / GLP",
    description: "Cumplimiento regulatorio para laboratorios y farmacéuticas en Chile.",
    impactMin: 25,
    impactMax: 35,
    sector: "Farma y Laboratorios",
    icon: Certificate02Icon,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    skill: "Bioinformática / Data Science (Python, R)",
    description: "Análisis de datos biológicos y modelamiento para minería, agro y farma.",
    impactMin: 35,
    impactMax: 50,
    sector: "Minería · Agro · Farma",
    icon: SourceCodeIcon,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    skill: "Inglés Fluido (C1/C2)",
    description: "Acceso a multinacionales instaladas en Chile (Bayer, Pfizer, SQM, BHP, Merck).",
    impactMin: 30,
    impactMax: 45,
    sector: "Multinacionales",
    icon: LanguageSkillIcon,
    color: "text-violet-600",
    bgColor: "bg-violet-50",
  },
  {
    skill: "Postgrados (Magíster / Doctorado ANID)",
    description:
      "Especialmente valioso en roles de I+D+, laboratorios de referencia y jefaturas técnicas.",
    impactMin: 40,
    impactMax: 70,
    sector: "I+D+i · Jefaturas",
    icon: GraduationScrollIcon,
    color: "text-fuchsia-600",
    bgColor: "bg-fuchsia-50",
  },
  {
    skill: "SERNAGEOMIN / Normativa Minera / ISO 9001-14001",
    description: "Habilita trabajo en zona norte y proveedores industriales de procesos.",
    impactMin: 20,
    impactMax: 30,
    sector: "Zona Norte · Industria",
    icon: Settings01Icon,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    skill: "Inglés Técnico / Bilingüe",
    description: "Comunicación con casas matrices y publicación científica internacional.",
    impactMin: 15,
    impactMax: 25,
    sector: "Investigación · Corporativo",
    icon: Globe02Icon,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
  },
]

export const TRAYECTORIA_CARRERA_CHILE: CareerTrajectoryItem[] = [
  {
    level: "JUNIOR",
    label: "Junior",
    yearsRange: "0-2 años",
    monthlyClp: 1100000,
    description: "Entrada al mercado. Prácticas profesionales finalizadas, primer empleo formal.",
  },
  {
    level: "MID",
    label: "Mid",
    yearsRange: "3-5 años",
    monthlyClp: 1650000,
    description: "Autonomía operativa. Manejo de protocolos y proyectos bajo supervisión acotada.",
  },
  {
    level: "SENIOR",
    label: "Senior",
    yearsRange: "6-8 años",
    monthlyClp: 2300000,
    description: "Liderazgo técnico y mentoring. Responsabilidad sobre resultados y calidad.",
  },
  {
    level: "LEAD",
    label: "Specialist / Jefatura",
    yearsRange: "10+ años",
    monthlyClp: 3200000,
    description: "Jefatura de área o especialista estratégico. Define estándares y procesos.",
  },
]

export const BANDAS_SALARIALES_B2B: SalaryBandItem[] = [
  {
    career: "Químico Farmacéutico",
    juniorMin: 1200000,
    juniorMax: 1500000,
    seniorMin: 2200000,
    seniorMax: 2800000,
    note: "Ajusta +15% si exige norma ISP/GMP.",
  },
  {
    career: "Ingeniero en Alimentos",
    juniorMin: 1000000,
    juniorMax: 1300000,
    seniorMin: 1800000,
    seniorMax: 2400000,
    note: "Mayor valor en plantas exportadoras (HACCP).",
  },
  {
    career: "Bioinformático",
    juniorMin: 1500000,
    juniorMax: 1900000,
    seniorMin: 2800000,
    seniorMax: 3500000,
    note: "Escasez de talento: ofertas competitivas.",
  },
  {
    career: "Ing. Civil Química (Minería)",
    juniorMin: 1600000,
    juniorMax: 2000000,
    seniorMin: 2800000,
    seniorMax: 3600000,
    note: "Bono faena y turno 4x4 en zona norte.",
  },
  {
    career: "Tecnólogo Médico",
    juniorMin: 900000,
    juniorMax: 1200000,
    seniorMin: 1500000,
    seniorMax: 2100000,
    note: "Especialidades (Imagenología, Lab.) priman.",
  },
  {
    career: "Ing. Biotecnología",
    juniorMin: 1100000,
    juniorMax: 1400000,
    seniorMin: 1900000,
    seniorMax: 2500000,
    note: "I+D+i y acuicultura ofrecen los topes.",
  },
]

export const FAQS_SALARIOS = [
  {
    question: "¿Cuál es el sueldo promedio de un bioinformático en Chile?",
    answer:
      "El sueldo promedio de un bioinformático en Chile varía entre $1.500.000 CLP para nivel junior y $3.200.000 CLP para nivel senior. Los profesionales con doctorado y experiencia en análisis de datos biológicos commanding los salarios más altos del sector.",
  },
  {
    question: "¿Qué factores influyen en el sueldo en el sector biotecnológico?",
    answer:
      "Los principales factores son: (1) la carrera y especialización, donde bioinformática e ingeniería civil química lideran los salarios; (2) la industria, con minería y tech/pharma ofreciendo los mejores paquetes; (3) la ubicación geográfica, donde Antofagasta y la Región Metropolitana pagan más; (4) el nivel de postgrado, donde magíster y doctorado aumentan significativamente el salario.",
  },
  {
    question: "¿Dónde se gana más en el sector científico en Chile?",
    answer:
      "Antofagasta (Norte Minero) ofrece los salarios más altos del país para profesionales en ciencias, seguida por la Región Metropolitana. Esto se debe al sector minero en el norte y la concentración de empresas pharma y tech en Santiago.",
  },
  {
    question: "¿Conviene hacer un magíster o doctorado para aumentar el sueldo?",
    answer:
      "Sí, los datos muestran que un postgrado puede aumentar significativamente el sueldo, especialmente en roles de I+D y bioinformática. El magíster ofrece un aumento promedio del 70% sobre el salario sin postgrado, mientras que el doctorado puede duplicar el salario base.",
  },
  {
    question: "¿Qué industrias pagan mejor en biotecnología y química?",
    answer:
      "Minería lidera con un rango de $1.800.000 a $3.500.000 CLP, seguida por Tech/Pharma ($1.500.000-$3.200.000), Retail/Pharma ($1.700.000-$2.400.000), Química/Procesos ($1.400.000-$2.600.000), Farmacéutica ($1.200.000-$2.200.000), Agroindustrial ($1.000.000-$1.900.000) y Academia/I+D ($950.000-$1.800.000).",
  },
  {
    question: "¿La encuesta salarial de Biovity es anónima?",
    answer:
      "Sí, la encuesta Give-to-Get es 100% anónima y no requiere registro. No guardamos correo ni nombre; solo los datos del rol, compensación en CLP, región de Chile y nivel educativo. Al enviarla, desbloqueas los insights nacionales con tu percentil en el mercado chileno.",
  },
]
