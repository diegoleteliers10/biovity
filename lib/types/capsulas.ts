export type QuizQuestion = {
  q: string
  options: string[]
  correct: number
}

export type CapsuleFrontmatter = {
  title: string
  description: string
  category: string
  duration: number
  date: string
  quiz: QuizQuestion[]
}

export type CapsuleMeta = {
  slug: string
  category: string
  content: string
  frontmatter: CapsuleFrontmatter
}

export type CapsuleSource = "capsulas"

export type CapsuleProgress = {
  id: string
  user_id: string
  capsule_slug: string
  completed: boolean
  quiz_passed: boolean
  quiz_score: number | null
  created_at: string
  updated_at: string
}

export type Certificate = {
  id: string
  user_id: string
  capsule_slug: string
  capsule_title: string
  issued_at: string
}
