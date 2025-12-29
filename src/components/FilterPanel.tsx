import { useData } from '../context/DataContext';
import { Filter } from 'lucide-react';

interface Props {
  filterVariable: string;
  filterType: 'none' | 'modality' | 'cutoff';
  filterValue: string;
  onFilterVariableChange: (value: string) => void;
  onFilterTypeChange: (value: 'none' | 'modality' | 'cutoff') => void;
  onFilterValueChange: (value: string) => void;
}

export default function FilterPanel({
  filterVariable,
  filterType,
  filterValue,
  onFilterVariableChange,
  onFilterTypeChange,
  onFilterValueChange,
}: Props) {
  const { variables, data } = useData();

  const selectedVarInfo = variables.find((v) => v.name === filterVariable);

  const getUniqueValues = (varName: string) => {
    const values = data.map((row) => row[varName as keyof typeof row]);
    return [...new Set(values)].sort();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-slate-900">Filtres</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Type de filtre
          </label>
          <select
            value={filterType}
            onChange={(e) => {
              onFilterTypeChange(e.target.value as 'none' | 'modality' | 'cutoff');
              onFilterValue('');
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="none">Aucun filtre</option>
            <option value="modality">Selon modalité</option>
            <option value="cutoff">Selon coupure</option>
          </select>
        </div>

        {filterType !== 'none' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Variable à filtrer
            </label>
            <select
              value={filterVariable}
              onChange={(e) => {
                onFilterVariableChange(e.target.value);
                onFilterValueChange('');
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">Choisir une variable...</option>
              {variables
                .filter((v) =>
                  filterType === 'modality' ? v.type === 'qualitative' : v.type === 'quantitative'
                )
                .map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.label}
                  </option>
                ))}
            </select>
          </div>
        )}

        {filterType === 'modality' && filterVariable && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Modalité
            </label>
            <select
              value={filterValue}
              onChange={(e) => onFilterValueChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">Choisir une modalité...</option>
              {getUniqueValues(filterVariable).map((val) => (
                <option key={String(val)} value={String(val)}>
                  {String(val)}
                </option>
              ))}
            </select>
          </div>
        )}

        {filterType === 'cutoff' && filterVariable && selectedVarInfo?.type === 'quantitative' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Coupure
            </label>
            <div className="flex gap-2">
              <select
                value={filterValue.split(':')[0] || ''}
                onChange={(e) => {
                  const operator = e.target.value;
                  const threshold = filterValue.split(':')[1] || '';
                  onFilterValueChange(`${operator}:${threshold}`);
                }}
                className="w-24 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="">Op.</option>
                <option value=">">&gt;</option>
                <option value=">=">&gt;=</option>
                <option value="<">&lt;</option>
                <option value="<=">&lt;=</option>
                <option value="=">=</option>
              </select>
              <input
                type="number"
                placeholder="Valeur seuil"
                value={filterValue.split(':')[1] || ''}
                onChange={(e) => {
                  const operator = filterValue.split(':')[0] || '>';
                  onFilterValueChange(`${operator}:${e.target.value}`);
                }}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
