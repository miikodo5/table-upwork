import { useState, useMemo, useEffect } from "preact/hooks";
import { FilterBar } from "./components/FilterBar";
import { FeatureTable } from "./components/FeatureTable";
import rawData from "./data/response.json";

export function App() {
    const [filters, setFilters] = useState(() => {
        try {
            return (
                JSON.parse(localStorage.getItem("filters")) || {
                    name: "",
                    pi: "",
                    team: "",
                    owner: "",
                }
            );
        } catch {
            return { name: "", pi: "", team: "", owner: "" };
        }
    });

    const [columnSizing, setColumnSizing] = useState(() => {
        return JSON.parse(localStorage.getItem("columnSizing")) || {};
    });
    const [columnSizingInfo, setColumnSizingInfo] = useState(() => {
        return JSON.parse(localStorage.getItem("columnSizingInfo")) || {};
    });

    const dictionaries = rawData.dictionary;

    useEffect(() => {
        localStorage.setItem("filters", JSON.stringify(filters));
    }, [filters]);

    useEffect(() => {
        localStorage.setItem("columnSizing", JSON.stringify(columnSizing));
    }, [columnSizing]);

    useEffect(() => {
        localStorage.setItem(
            "columnSizingInfo",
            JSON.stringify(columnSizingInfo)
        );
    }, [columnSizingInfo]);

    const data = useMemo(() => {
        return rawData.features.map((feature) => ({
            ...feature,
            subRows: feature.tasks || [],
        }));
    }, []);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const filteredData = useMemo(() => {
        const sortedData = data.filter((f) => {
            const featureName = f.name
                .toLowerCase()
                .includes(filters.name.toLowerCase());
            const taskName = (f.tasks || []).some((task) =>
                task.name.toLowerCase().includes(filters.name.toLowerCase())
            );
            const matchName = featureName || taskName;

            const matchPi =
                !filters.pi || dictionaries.pi[f.planned_pi] === filters.pi;

            const featureOwner =
                !filters.owner || dictionaries.user[f.owner] === filters.owner;
            const taskOwner = (f.tasks || []).some(
                (task) =>
                    !filters.owner ||
                    dictionaries.user[task.owner] === filters.owner
            );
            const matchOwner = featureOwner || taskOwner;

            const taskTeams = (f.tasks || []).some(
                (task) => dictionaries.team[task.team] === filters.team
            );
            const matchTeam = !filters.team || taskTeams;

            return matchName && matchPi && matchOwner && matchTeam;
        });
        const result = sortedData.map((el) => ({
            ...el,
            tasks: el.tasks.filter((t) => {
                const taskTeams = dictionaries.team[t.team] === filters.team;
                const matchTeam = !filters.team || taskTeams;

                const matchName = t.name
                    .toLowerCase()
                    .includes(filters.name.toLowerCase());

                const matchOwner =
                    !filters.owner ||
                    dictionaries.user[t.owner] === filters.owner;

                return matchTeam && matchName && matchOwner;
            }),
        }));
        return result;
    }, [filters, data]);

    return (
        <div className="page-container">
            <FilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                dictionaries={dictionaries}
            />
            <FeatureTable
                data={filteredData}
                dictionaries={dictionaries}
                columnSizing={columnSizing}
                setColumnSizing={setColumnSizing}
                columnSizingInfo={columnSizingInfo}
                setColumnSizingInfo={setColumnSizingInfo}
            />
        </div>
    );
}
