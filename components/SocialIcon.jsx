export default function SocialIcon({ href, icon, label }) {
  return (
    <a
      href={href}
      className="text-gray-400 hover:text-green-400 transition-all duration-300 transform hover:scale-110 p-2"
      aria-label={label}
    >
      {icon}
    </a>
  )
}