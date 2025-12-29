import { createContext, useContext, ReactNode } from 'react';

export interface DataRow {
  numero: number;
  ensoleillement: string;
  temperature: number;
  humidite: number;
  vent: string;
  jouer: string;
}

export interface Variable {
  name: string;
  label: string;
  type: 'qualitative' | 'quantitative';
}

const rawData: DataRow[] = [
  { numero: 1, ensoleillement: 'soleil', temperature: 75, humidite: 70, vent: 'oui', jouer: 'oui' },
  { numero: 2, ensoleillement: 'soleil', temperature: 80, humidite: 90, vent: 'oui', jouer: 'non' },
  { numero: 3, ensoleillement: 'soleil', temperature: 85, humidite: 85, vent: 'non', jouer: 'non' },
  { numero: 4, ensoleillement: 'soleil', temperature: 72, humidite: 95, vent: 'non', jouer: 'non' },
  { numero: 5, ensoleillement: 'soleil', temperature: 69, humidite: 70, vent: 'non', jouer: 'oui' },
  { numero: 6, ensoleillement: 'couvert', temperature: 72, humidite: 90, vent: 'oui', jouer: 'oui' },
  { numero: 7, ensoleillement: 'couvert', temperature: 83, humidite: 78, vent: 'non', jouer: 'oui' },
  { numero: 8, ensoleillement: 'couvert', temperature: 64, humidite: 65, vent: 'oui', jouer: 'oui' },
  { numero: 9, ensoleillement: 'couvert', temperature: 81, humidite: 75, vent: 'non', jouer: 'oui' },
  { numero: 10, ensoleillement: 'pluie', temperature: 71, humidite: 80, vent: 'oui', jouer: 'non' },
  { numero: 11, ensoleillement: 'pluie', temperature: 65, humidite: 70, vent: 'oui', jouer: 'non' },
  { numero: 12, ensoleillement: 'pluie', temperature: 75, humidite: 80, vent: 'non', jouer: 'oui' },
  { numero: 13, ensoleillement: 'pluie', temperature: 68, humidite: 80, vent: 'non', jouer: 'oui' },
  { numero: 14, ensoleillement: 'pluie', temperature: 70, humidite: 96, vent: 'non', jouer: 'oui' },
];

export const variables: Variable[] = [
  { name: 'ensoleillement', label: 'Ensoleillement', type: 'qualitative' },
  { name: 'temperature', label: 'Température (°F)', type: 'quantitative' },
  { name: 'humidite', label: 'Humidité (%)', type: 'quantitative' },
  { name: 'vent', label: 'Vent', type: 'qualitative' },
  { name: 'jouer', label: 'Jouer', type: 'qualitative' },
];

interface DataContextType {
  data: DataRow[];
  variables: Variable[];
  getFilteredData: (filterVar: string, filterType: string, filterValue: string) => DataRow[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const getFilteredData = (filterVar: string, filterType: string, filterValue: string): DataRow[] => {
    if (filterType === 'none' || !filterVar || !filterValue) {
      return rawData;
    }

    const variable = variables.find((v) => v.name === filterVar);
    if (!variable) return rawData;

    if (filterType === 'modality') {
      return rawData.filter((row) => {
        const value = row[filterVar as keyof DataRow];
        return String(value) === filterValue;
      });
    }

    if (filterType === 'cutoff' && variable.type === 'quantitative') {
      const [operator, threshold] = filterValue.split(':');
      const thresholdNum = parseFloat(threshold);

      return rawData.filter((row) => {
        const value = row[filterVar as keyof DataRow] as number;
        if (operator === '>') return value > thresholdNum;
        if (operator === '>=') return value >= thresholdNum;
        if (operator === '<') return value < thresholdNum;
        if (operator === '<=') return value <= thresholdNum;
        if (operator === '=') return value === thresholdNum;
        return true;
      });
    }

    return rawData;
  };

  return (
    <DataContext.Provider value={{ data: rawData, variables, getFilteredData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
