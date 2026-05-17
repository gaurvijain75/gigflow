interface BadgeProps {
  value: string
  type: 'status' | 'source'
}

const statusColors: Record<string, string> = {
  New: 'bg-blue-100 text-blue-800',
  Contacted: 'bg-yellow-100 text-yellow-800',
  Qualified: 'bg-green-100 text-green-800',
  Lost: 'bg-red-100 text-red-800',
}

const sourceColors: Record<string, string> = {
  Website: 'bg-purple-100 text-purple-800',
  Instagram: 'bg-pink-100 text-pink-800',
  Referral: 'bg-teal-100 text-teal-800',
}

const Badge = ({ value, type }: BadgeProps) => {
  const colors = type === 'status' ? statusColors[value] : sourceColors[value]
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors}`}>
      {value}
    </span>
  )
}

export default Badge