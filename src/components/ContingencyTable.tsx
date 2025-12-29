import { useData } from '../context/DataContext';
import { Table } from 'lucide-react';
import { buildContingencyTable, transformQuantitativeVariable } from '../utils/statistics';

interface Props {
  var1: string;
  var2: string;
  cutoff1: string;
  cutoff2: string;
  filterVariable: string;
  filterType: string;
  filterValue: string;
}

export default function ContingencyTable({
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

  const { table, var1Values, var2Values, rowTotals, colTotals, total } = buildContingencyTable(
    transformedData,
    var1,
    var2
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Table className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-slate-900">Table de contingence</h2>
        <span className="text-sm text-slate-500 ml-auto">
          {filteredData.length} observations
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                {var1Info?.label} \ {var2Info?.label}
              </th>
              {var2Values.map((val) => (
                <th
                  key={String(val)}
                  className="border border-slate-300 bg-blue-50 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  {String(val)}
                </th>
              ))}
              <th className="border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {var1Values.map((v1) => (
              <tr key={String(v1)}>
                <th className="border border-slate-300 bg-blue-50 px-4 py-2 text-sm font-semibold text-slate-700">
                  {String(v1)}
                </th>
                {var2Values.map((v2) => {
                  const count = table[String(v1)]?.[String(v2)] || 0;
                  return (
                    <td
                      key={String(v2)}
                      className="border border-slate-300 px-4 py-2 text-center text-slate-900"
                    >
                      {count}
                    </td>
                  );
                })}
                <td className="border border-slate-300 bg-slate-50 px-4 py-2 text-center font-medium text-slate-900">
                  {rowTotals[String(v1)] || 0}
                </td>
              </tr>
            ))}
            <tr>
              <th className="border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                Total
              </th>
              {var2Values.map((v2) => (
                <td
                  key={String(v2)}
                  className="border border-slate-300 bg-slate-50 px-4 py-2 text-center font-medium text-slate-900"
                >
                  {colTotals[String(v2)] || 0}
                </td>
              ))}
              <td className="border border-slate-300 bg-slate-100 px-4 py-2 text-center font-bold text-slate-900">
                {total}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
