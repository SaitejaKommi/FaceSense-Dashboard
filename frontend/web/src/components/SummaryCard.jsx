export default function SummaryCard({ title, value, icon: Icon, color }) {
  const colorStyles = {
    blue: 'border-blue-500 bg-blue-500/10',
    green: 'border-green-500 bg-green-500/10',
    red: 'border-red-500 bg-red-500/10',
    yellow: 'border-yellow-500 bg-yellow-500/10',
  }

  const iconColors = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    red: 'text-red-400',
    yellow: 'text-yellow-400',
  }

  return (
    <div className={`border-l-4 ${colorStyles[color]} rounded-lg p-6 backdrop-blur-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-2">{title}</p>
          <p className="text-4xl font-bold text-white">{value}</p>
        </div>
        {Icon && <Icon className={`${iconColors[color]} w-12 h-12 opacity-50`} />}
      </div>
    </div>
  )
}
