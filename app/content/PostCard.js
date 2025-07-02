import { User, Calendar, Tag, ArrowRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function PostCard({ post, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:border-green-500/50 rounded-xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/10"
    >
      {/* Post Title */}
      <h3 className="font-mono text-xl font-semibold text-white group-hover:text-green-400 transition-colors duration-300 mb-3">
        {post.title}
      </h3>

      {/* Description */}
      <p className="text-gray-400 font-mono text-sm leading-relaxed mb-4 line-clamp-3">
        {post.description}
      </p>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center space-x-1 bg-green-600/20 text-green-400 text-xs font-mono px-2 py-1 rounded-md"
            >
              <Tag size={12} />
              <span>{tag}</span>
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="text-gray-500 text-xs font-mono px-2 py-1">
              +{post.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs font-mono text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <User size={12} />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar size={12} />
            <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}