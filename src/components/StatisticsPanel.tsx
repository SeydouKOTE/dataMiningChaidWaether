import { useData } from '../context/DataContext';
import { Calculator } from 'lucide-react';
import { calculateChiSquare, calculateTschuprow, transformQuantitativeVariable } from '../utils/statistics';

interface Props {
  var1: string;
  var2: string;
  cutoff1: string;
  cutoff2: string;
  filterVariable: string;
  filterType: string;
  filterValue: string;
}

export default function StatisticsPanel({
  var1,
  var2,
  cutoff1,
  cutoff2,
  filterVariable,
  filterType,
  filterValue,
}: Props) {
  const { getFilteredData, variables } = useData();

  const filteredData = getFilteredData(filterVariable, filterType, filterValue);
  const var1Info = variables.find((v) => v.name === var1);
  const var2Info = variables.find((v) => v.name === var2);

  const transformedData = filteredData.map((row) => {
    const newRow = { ...row };
    if (var1Info?.type === 'quantitative' && cutoff1) {
      (newRow[var1 as keyof typeof newRow] as any) = transformQuantitativeVariable(
        row[var1 as keyof typeof row] as number,
        parseFloat(cutoff1)
      );
    }
    if (var2Info?.type === 'quantitative' && cutoff2) {
      (newRow[var2 as keyof typeof newRow] as any) = transformQuantitativeVariable(
        row[var2 as keyof typeof row] as number,
        parseFloat(cutoff2)
      );
    }
    return newRow;
  });

  const chiSquareResult = calculateChiSquare(transformedData, var1, var2);
  const tschuprow = calculateTschuprow(transformedData, var1, var2);

  const getSignificance = (chiSquare: number, df: number) => {
    const criticalValues = [
      { df: 1, p05: 3.841, p01: 6.635 },
      { df: 2, p05: 5.991, p01: 9.210 },
      { df: 3, p05: 7.815, p01: 11.345 },
      { df: 4, p05: 9.488, p01: 13.277 },
      { df: 5, p05: 11.070, p01: 15.086 },
      { df: 6, p05: 12.592, p01: 16.812 },
      { df: 8, p05: 15.507, p01: 20.090 },
      { df: 9, p05: 16.919, p01: 21.666 },
      { df: 10, p05: 18.307, p01: 23.209 },
    ];

    const critical = criticalValues.find((c) => c.df === df);
    if (!critical) return 'N/A';

    if (chiSquare >= critical.p01) return 'Très significatif (p < 0.01)';
    if (chiSquare >= critical.p05) return 'Significatif (p < 0.05)';
    return 'Non significatif (p > 0.05)';
  };

  const getTschuprowInterpretation = (t: number) => {
    if (t < 0.2) return 'Très faible';
    if (t < 0.4) return 'Faible';
    if (t < 0.6) return 'Modérée';
    if (t < 0.8) return 'Forte';
    return 'Très forte';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-slate-900">Statistiques</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Test du Chi²</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-700">Chi² (χ²):</span>
                <span className="text-2xl font-bold text-blue-900">
                  {chiSquareResult.chiSquare.toFixed(3)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-700">Degrés de liberté:</span>
                <span className="text-lg font-semibold text-blue-900">{chiSquareResult.df}</span>
              </div>
              <div className="pt-2 border-t border-blue-200">
                <span className="text-xs text-blue-700 block mb-1">Signification:</span>
                <span className="text-sm font-medium text-blue-900">
                  {getSignificance(chiSquareResult.chiSquare, chiSquareResult.df)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 space-y-1">
            <p className="font-medium text-slate-700">Interprétation du Chi²:</p>
            <p>Le test mesure l'indépendance entre les deux variables.</p>
            <p>Plus la valeur est élevée, plus les variables sont dépendantes.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <h3 className="text-sm font-medium text-green-900 mb-2">Coefficient de Tschuprow (T)</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700">Valeur T:</span>
                <span className="text-2xl font-bold text-green-900">{tschuprow.toFixed(4)}</span>
              </div>
              <div className="pt-2 border-t border-green-200">
                <span className="text-xs text-green-700 block mb-1">Intensité de liaison:</span>
                <span className="text-sm font-medium text-green-900">
                  {getTschuprowInterpretation(tschuprow)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 space-y-1">
            <p className="font-medium text-slate-700">Interprétation de T:</p>
            <p>Mesure normalisée de l'association (0 à 1).</p>
            <p>0 = indépendance, 1 = dépendance totale.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
