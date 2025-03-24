import {
    Clock,
    Calendar,
    User,
    Mail,
    Phone,
    Briefcase,
    MapPin,
    Star,
    IdCard,
    List,
    Building,
} from 'lucide-react'

const Card = ({ title, value, icon, color = '#004b9a' }) => {
    const iconSize = 20

    const getIcon = () => {
        switch (icon) {
            case 'calendar':
                return <Calendar size={iconSize} className="stroke-current" />
            case 'clock':
                return <Clock size={iconSize} className="stroke-current" />
            case 'user':
                return <User size={iconSize} className="stroke-current" />
            case 'mail':
                return <Mail size={iconSize} className="stroke-current" />
            case 'phone':
                return <Phone size={iconSize} className="stroke-current" />
            case 'job':
                return <Briefcase size={iconSize} className="stroke-current" />
            case 'location':
                return <MapPin size={iconSize} className="stroke-current" />
            case 'rating':
                return <Star size={iconSize} className="stroke-current" />
            case 'id-card':
                return <IdCard size={iconSize} className="stroke-current" />
            case 'list':
                return <List size={iconSize} className="stroke-current" />
            case 'building':
                return <Building size={iconSize} className="stroke-current" />
            default:
                return null
        }
    }

    return (
        <div
            className={`
            relative group overflow-hidden
            bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow
            border border-gray-100 hover:border-[#004b9a]/20
            min-h-[120px] flex flex-col
            transition-all duration-300 hover:-translate-y-1
        `}>
            {/* Header con color corporativo */}
            <div
                className="px-4 py-2 bg-[#004b9a]/5 border-b border-[#004b9a]/10"
                style={{
                    backgroundColor: `${color}0D`,
                    borderColor: `${color}20`,
                }}>
                <div className="flex items-center gap-2">
                    <div
                        className="p-1.5 rounded-lg bg-white shadow-sm border border-gray-100"
                        style={{ color: color }}>
                        {getIcon()}
                    </div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-[#004b9a]">
                        {title}
                    </h3>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="flex items-center flex-1 p-4">
                <p className="text-[14px] font-semibold text-gray-800">
                    {value}
                </p>
            </div>

            {/* Efecto hover sutil */}
            <div className="absolute inset-0 transition-opacity opacity-0 pointer-events-none group-hover:opacity-100">
                <div
                    className="absolute inset-0 border-2 border-[#004b9a]/10 rounded-xl"
                    style={{ borderColor: `${color}20` }}
                />
            </div>
        </div>
    )
}

export default Card
