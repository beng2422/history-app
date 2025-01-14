import { AddPersonalStoryForm } from '@/components/add-personal-story-form'

export default function NewStoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Share Your Historical Story</h1>
        <AddPersonalStoryForm />
      </div>
    </div>
  )
} 