import { FC } from 'react'

export const Footer: FC = () => {
  return (
    <footer className="bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center">
          <div>© {new Date().getFullYear()} AlakhMart</div>
          <div className="text-sm">Built with Next.js & Tailwind</div>
        </div>
      </div>
    </footer>
  )
}
