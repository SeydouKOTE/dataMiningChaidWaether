import { useState } from 'react';
import { DataProvider } from './context/DataContext';
import Header from './components/Header';
import VariableSelector from './components/VariableSelector';
import FilterPanel from './components/FilterPanel';
import ContingencyTable from './components/ContingencyTable';
import StatisticsPanel from './components/StatisticsPanel';

function App() {
  const [selectedVar1, setSelectedVar1] = useState<string>('');
  const [selectedVar2, setSelectedVar2] = useState<string>('');
  const [cutoff1, setCutoff1] = useState<string>('');
  const [cutoff2, setCutoff2] = useState<string>('');
  const [filterVariable, setFilterVariable] = useState<string>('');
  const [filterType, setFilterType] = useState<'none' | 'modality' | 'cutoff'>('none');
  const [filterValue, setFilterValue] = useState<string>('');

  return (
    <DataProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />

        <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VariableSelector
              selectedVar1={selectedVar1}
              selectedVar2={selectedVar2}
              cutoff1={cutoff1}
              cutoff2={cutoff2}
              onVar1Change={setSelectedVar1}
              onVar2Change={setSelectedVar2}
              onCutoff1Change={setCutoff1}
              onCutoff2Change={setCutoff2}
            />

            <FilterPanel
              filterVariable={filterVariable}
              filterType={filterType}
              filterValue={filterValue}
              onFilterVariableChange={setFilterVariable}
              onFilterTypeChange={setFilterType}
              onFilterValueChange={setFilterValue}
            />
          </div>

          {selectedVar1 && selectedVar2 && (
            <>
              <ContingencyTable
                var1={selectedVar1}
                var2={selectedVar2}
                cutoff1={cutoff1}
                cutoff2={cutoff2}
                filterVariable={filterVariable}
                filterType={filterType}
                filterValue={filterValue}
              />

              <StatisticsPanel
                var1={selectedVar1}
                var2={selectedVar2}
                cutoff1={cutoff1}
                cutoff2={cutoff2}
                filterVariable={filterVariable}
                filterType={filterType}
                filterValue={filterValue}
              />
            </>
          )}
        </main>
      </div>
    </DataProvider>
  );
}

export default App;
