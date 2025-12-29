import { BarChart3 } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Analyse de Contingence
            </h1>
            <p className="text-sm text-slate-600">
              Test du Chi² et coefficient de Tschuprow
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
