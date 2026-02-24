import React from 'react';
import { FileText, Download, AlertCircle } from 'lucide-react';
import { useGrades } from './hooks/useGrades';
import { Header } from '../../components/Header';

export const GradesView = ({ user }) => {
  const { disciplinas, calcularMediaParcial, mediaAprovacao, loading } = useGrades(user);

  if (loading) {
    return <div className="p-10 text-center text-gray-500 font-medium">Carregando seu boletim...</div>;
  }

  return (
    <div className="space-y-6">
      <Header
        title="Meu Boletim"
        subtitle="Consulte suas notas detalhadas por bimestre."
        icon={FileText}
        action={
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-md shadow-indigo-200">
            <Download className="w-4 h-4" /> Gerar PDF
          </button>
        }
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Disciplina</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase text-center">1º Bim</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase text-center">2º Bim</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase text-center">3º Bim</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase text-center">4º Bim</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase text-center bg-indigo-50/50">Média Parcial</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {disciplinas.map((disc, index) => {
                const mediaFinal = calcularMediaParcial(disc.notas);

                return (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-gray-800">{disc.nome}</p>
                    </td>

                    {disc.detalhes.map((detalhe, i) => (
                      <td key={i} className="p-4 text-center font-medium group relative">
                        {detalhe ? (
                          <>
                            {/* Mostra a média do bimestre */}
                            <span className={detalhe.media < mediaAprovacao ? 'text-red-500' : 'text-gray-700'}>
                              {detalhe.media.toFixed(1)}
                            </span>

                            {/* TOOLTIP: Detalhes de N1, N2, N3 ao passar o mouse */}
                            <div className="absolute z-20 hidden group-hover:block bg-gray-800 text-white text-[10px] p-2 rounded shadow-xl -top-14 left-1/2 -translate-x-1/2 min-w-[90px] animate-in fade-in zoom-in duration-200">
                              <div className="flex justify-between gap-3"><span>N1:</span> <span className="font-bold">{detalhe.n1.toFixed(1)}</span></div>
                              <div className="flex justify-between gap-3"><span>N2:</span> <span className="font-bold">{detalhe.n2.toFixed(1)}</span></div>
                              <div className="flex justify-between gap-3"><span>N3:</span> <span className="font-bold">{detalhe.n3.toFixed(1)}</span></div>
                              <div className="border-t border-gray-600 mt-1 pt-1 flex justify-between font-bold text-indigo-300">
                                <span>Média:</span> <span>{detalhe.media.toFixed(1)}</span>
                              </div>
                              {/* Seta do Balão */}
                              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                            </div>
                          </>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                    ))}

                    <td className="p-4 text-center bg-indigo-50/30">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${Number(mediaFinal) < mediaAprovacao ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {mediaFinal}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg flex gap-3 shadow-sm">
        <AlertCircle className="text-amber-600 shrink-0" />
        <div className="text-sm text-amber-800">
          <p><strong>Dica de Uso:</strong> Passe o mouse sobre as notas dos bimestres para ver o detalhamento de N1, N2 e N3.</p>
          <p className="mt-1 opacity-90">A média para aprovação é <strong>{mediaAprovacao.toFixed(1)}</strong>.</p>
        </div>
      </div>
    </div>
  );
};