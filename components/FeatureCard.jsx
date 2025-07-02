export default function FeatureCard({ icon, title, description, delay }) {
  return (
    <div
      className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 transition-all duration-500 animate-slide-up-stagger"
      style={{ animationDelay: delay }}
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 p-3 bg-gray-700/50 rounded-lg">{icon}</div>
        <h3 className="font-mono text-xl font-semibold mb-3 text-white">{title}</h3>
        <p className="text-gray-400 font-mono text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  )
}