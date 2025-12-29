import { useData } from '../context/DataContext';
import { FileCheck } from 'lucide-react';

interface Props {
  selectedVar1: string;
  selectedVar2: string;
  cutoff1: string;
  cutoff2: string;
  onVar1Change: (value: string) => void;
  onVar2Change: (value: string) => void;
  onCutoff1Change: (value: string) => void;
  onCutoff2Change: (value: string) => void;
}

export default function VariableSelector({
  selectedVar1,
  selectedVar2,
  cutoff1,
  cutoff2,
  onVar1Change,
  onVar2Change,
  onCutoff1Change,
  onCutoff2Change,
}: Props) {
  const { variables, data } = useData();

  const var1Info = variables.find((v) => v.name === selectedVar1);
  const var2Info = variables.find((v) => v.name === selectedVar2);

  const getRange = (varName: string) => {
    const values = data
      .map((row) => {
        const val = row[varName as keyof typeof row];
        return typeof val === 'number' ? val : null;
      })
      .filter((v) => v !== null) as number[];

    if (values.length === 0) return { min: 0, max: 100 };

    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileCheck className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-slate-900">Sélection des variables</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Variable 1</label>
          <select
            value={selectedVar1}
            onChange={(e) => onVar1Change(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="">Choisir une variable...</option>
            {variables.map((v) => (
              <option key={v.name} value={v.name}>
                {v.label} ({v.type})
              </option>
            ))}
          </select>

          {selectedVar1 && var1Info?.type === 'quantitative' && (
            <div className="mt-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">Coupure</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Valeur de coupure"
                  value={cutoff1}
                  onChange={(e) => onCutoff1Change(e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                <span className="text-xs text-slate-500 py-1">
                  ({getRange(selectedVar1).min} - {getRange(selectedVar1).max})
                </span>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Variable 2</label>
          <select
            value={selectedVar2}
            onChange={(e) => onVar2Change(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="">Choisir une variable...</option>
            {variables.map((v) => (
              <option key={v.name} value={v.name} disabled={v.name === selectedVar1}>
                {v.label} ({v.type})
              </option>
            ))}
          </select>

          {selectedVar2 && var2Info?.type === 'quantitative' && (
            <div className="mt-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">Coupure</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Valeur de coupure"
                  value={cutoff2}
                  onChange={(e) => onCutoff2Change(e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                <span className="text-xs text-slate-500 py-1">
                  ({getRange(selectedVar2).min} - {getRange(selectedVar2).max})
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
