export function FilterBar({ filters, onFilterChange, dictionaries }) {
    return (
        <div className="filter-bar">
            <label>Filter:</label>

            <label>Name:</label>
            <input
                value={filters.name}
                onInput={(e) => onFilterChange("name", e.target.value)}
                placeholder=""
            />

            <label>PI:</label>
            <select
                value={filters.pi}
                onInput={(e) => onFilterChange("pi", e.target.value)}
            >
                <option value=""></option>
                {Object.entries(dictionaries.pi).map(([key, value]) => (
                    <option key={key} value={value}>
                        {value}
                    </option>
                ))}
            </select>

            <label>Team:</label>
            <select
                value={filters.team}
                onInput={(e) => onFilterChange("team", e.target.value)}
            >
                <option value=""></option>
                {Object.entries(dictionaries.team).map(([key, value]) => (
                    <option key={key} value={value}>
                        {value}
                    </option>
                ))}
            </select>

            <label>Owner:</label>
            <select
                value={filters.owner}
                onInput={(e) => onFilterChange("owner", e.target.value)}
            >
                <option value=""></option>
                {Object.entries(dictionaries.user).map(([key, value]) => (
                    <option key={key} value={value}>
                        {value}
                    </option>
                ))}
            </select>
        </div>
    );
}
