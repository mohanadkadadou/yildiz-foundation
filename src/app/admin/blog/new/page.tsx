import { BlogPostForm } from '@/components/admin/BlogPostForm'

export default function NewBlogPostPage() {
  return (
    <div className="p-8 max-w-7xl">
      <BlogPostForm mode="create" />
    </div>
  )
}
