export interface ConsejoCategoria {
  id: string
  label: string
  description: string
}

export interface ConsejoArticulo {
  id: string
  slug: string
  title: string
  description: string
  category: string
  readTime: string
  author: {
    name: string
    role: string
  }
  date: string
  featured?: boolean
  badgeText?: string
  takeaways: string[]
  contentSummary: string
  colorTheme?: string
}

export interface ConsejoHerramienta {
  id: string
  title: string
  description: string
  tag: string
  buttonText: string
  popular?: boolean
}

export interface ConsejoFAQItem {
  question: string
  answer: string
  category?: string
}

export interface ConsejoStat {
  value: string
  label: string
}
