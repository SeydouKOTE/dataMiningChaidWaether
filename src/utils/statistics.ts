import { DataRow } from '../context/DataContext';

export function transformQuantitativeVariable(value: number, cutoff: number): string {
  return value >= cutoff ? `≥ ${cutoff}` : `< ${cutoff}`;
}

export interface ContingencyTableResult {
  table: Record<string, Record<string, number>>;
  var1Values: (string | number)[];
  var2Values: (string | number)[];
  rowTotals: Record<string, number>;
  colTotals: Record<string, number>;
  total: number;
}

export function buildContingencyTable(
  data: DataRow[],
  var1Name: string,
  var2Name: string
): ContingencyTableResult {
  const table: Record<string, Record<string, number>> = {};
  const rowTotals: Record<string, number> = {};
  const colTotals: Record<string, number> = {};

  data.forEach((row) => {
    const v1 = String(row[var1Name as keyof DataRow]);
    const v2 = String(row[var2Name as keyof DataRow]);

    if (!table[v1]) table[v1] = {};
    table[v1][v2] = (table[v1][v2] || 0) + 1;

    rowTotals[v1] = (rowTotals[v1] || 0) + 1;
    colTotals[v2] = (colTotals[v2] || 0) + 1;
  });

  const var1Values = Object.keys(table).sort();
  const var2Values = [...new Set(data.map((row) => String(row[var2Name as keyof DataRow])))].sort();

  const total = data.length;

  return { table, var1Values, var2Values, rowTotals, colTotals, total };
}

export interface ChiSquareResult {
  chiSquare: number;
  df: number;
}

export function calculateChiSquare(data: DataRow[], var1Name: string, var2Name: string): ChiSquareResult {
  const { table, var1Values, var2Values, rowTotals, colTotals, total } = buildContingencyTable(
    data,
    var1Name,
    var2Name
  );

  let chiSquare = 0;

  var1Values.forEach((v1) => {
    var2Values.forEach((v2) => {
      const observed = table[String(v1)]?.[String(v2)] || 0;
      const expected = (rowTotals[String(v1)] * colTotals[String(v2)]) / total;

      if (expected > 0) {
        chiSquare += Math.pow(observed - expected, 2) / expected;
      }
    });
  });

  const df = (var1Values.length - 1) * (var2Values.length - 1);

  return { chiSquare, df };
}

export function calculateTschuprow(data: DataRow[], var1Name: string, var2Name: string): number {
  const { chiSquare } = calculateChiSquare(data, var1Name, var2Name);
  const { var1Values, var2Values } = buildContingencyTable(data, var1Name, var2Name);

  const n = data.length;
  const r = var1Values.length;
  const c = var2Values.length;

  const denominator = Math.sqrt((r - 1) * (c - 1)) * n;

  if (denominator === 0) return 0;

  const tschuprow = Math.sqrt(chiSquare) / Math.sqrt(denominator);

  return tschuprow;
}
