export const TimeRangeFilter = ({ selected, onChange }) => (
    <select
        value={selected}
        onChange={e => onChange('time_range', e.target.value)}
        className="px-3 py-2 border rounded">
        {filters.time_ranges.map(range => (
            <option key={range.value} value={range.value}>
                {range.label}
            </option>
        ))}
    </select>
)

export const PaginationControls = ({ current, total, onChange }) => (
    <div className="flex gap-2">
        {Array.from({ length: total }, (_, i) => (
            <button
                key={i + 1}
                onClick={() => onChange(i + 1)}
                className={`px-3 py-1 rounded ${
                    current === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}>
                {i + 1}
            </button>
        ))}
    </div>
)
