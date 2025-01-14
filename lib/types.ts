import { type Message } from 'ai'

// TODO refactor and remove unneccessary duplicate data.
export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: Message[]
  sharePath?: string // Refactor to use RLS
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>

export interface HistoricalFigure {
  id: string
  name: string
  role: string
  bio: string
  context: string
  avatar_url: string
  event_id: string
  possible_questions_to_ask?: string[]
  created_at: string
}

export interface HistoricalEvent {
  id: string
  title: string
  date: string
  summary: string
  image: string
  figures: HistoricalFigure[]
}
