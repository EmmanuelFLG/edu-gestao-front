import React from 'react';
import { MOCK_STUDENTS } from '../../constants';
import { FileText, Download, Printer, UserCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Removida a interface ReportsViewProps e a tipagem : React.FC
export const ReportsView = ({ user }) => {
  
  const generateGeneralPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("Relatório de Desempenho Escolar", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Gerado por: ${user.name}`, 14, 28);
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 14, 33);

    const avgScore = (MOCK_STUDENTS.reduce((acc, s) => acc + s.performanceScore, 0) / MOCK_STUDENTS.length).toFixed(1);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 38, 196, 38);
    doc.text(`Média Geral da Escola: ${avgScore}`, 14, 46);

    const tableData = MOCK_STUDENTS.map(s => [
      s.id,
      s.name,
      s.grade,
      s.city,
      `${s.attendance}%`,
      s.performanceScore
    ]);

    autoTable(doc, {
      head: [['ID', 'Nome', 'Turma', 'Cidade', 'Freq.', 'Nota']],
      body: tableData,
      startY: 50,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [79, 70, 229] },
      alternateRowStyles: { fillColor: [245, 247, 255] },
    });

    doc.save("relatorio_geral.pdf");
  };

  const generateMyReport = () => {
    // Tenta encontrar os dados específicos do aluno no Mock pelo e-mail do usuário logado
    const myStudentData = MOCK_STUDENTS.find(s => s.email === user.email) || MOCK_STUDENTS[0];

    const doc = new jsPDF();
    
    // Header do PDF
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("Boletim Escolar", 105, 25, { align: 'center' });

    // Informações do Aluno
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(12);
    doc.text(`Aluno: ${user.name}`, 20, 60);
    doc.text(`Matrícula: ${myStudentData.id}`, 20, 70);
    doc.text(`Turma: ${myStudentData.grade}`, 120, 60);
    doc.text(`Ano Letivo: ${new Date().getFullYear()}`, 120, 70);

    doc.setLineWidth(0.5);
    doc.line(20, 78, 190, 78);

    // Tabela de Notas (Boletim)
    autoTable(doc, {
      startY: 85,
      head: [['Disciplina', 'Frequência', 'Média Final', 'Situação']],
      body: [
        ['Matemática', `${myStudentData.attendance}%`, myStudentData.performanceScore, myStudentData.performanceScore >= 60 ? 'Aprovado' : 'Recuperação'],
        ['Português', '95%', '85', 'Aprovado'],
        ['História', '90%', '78', 'Aprovado'],
        ['Geografia', '88%', '82', 'Aprovado'],
        ['Ciências', '92%', '90', 'Aprovado'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [60, 60, 60] },
      styles: { fontSize: 11, cellPadding: 6 }
    });

    // Assinatura
    doc.setFontSize(10);
    doc.text("_________________________________", 105, 250, { align: 'center' });
    doc.text("Assinatura da Direção", 105, 255, { align: 'center' });

    doc.save(`boletim_${user.name.toLowerCase().replace(/\s/g, '_')}.pdf`);
  };

  const isAluno = user.role === 'ALUNO';

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        {isAluno ? 'Documentos Acadêmicos' : 'Central de Relatórios'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Visão para Diretores e Professores */}
        {!isAluno && (
          <>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:border-indigo-200 transition-colors">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Relatório Geral</h3>
              <p className="text-gray-500 mb-6">
                Lista completa de alunos com desempenho e frequência global.
              </p>
              <button 
                onClick={generateGeneralPDF}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
              >
                <Download className="w-5 h-5" />
                Baixar PDF
              </button>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center opacity-75">
              <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4">
                <Printer className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Imprimir Boletins (Lote)</h3>
              <p className="text-gray-500 mb-6">
                Geração em massa para entrega em reuniões de pais.
              </p>
              <button 
                disabled
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-400 rounded-lg font-medium cursor-not-allowed"
              >
                <Download className="w-5 h-5" />
                Em Breve
              </button>
            </div>
          </>
        )}

        {/* Visão Exclusiva para Alunos */}
        {isAluno && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:border-indigo-200 transition-colors">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
              <UserCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Meu Boletim</h3>
            <p className="text-gray-500 mb-6">
              Acesse suas notas detalhadas, faltas e situação final do ano letivo corrente.
            </p>
            <button 
              onClick={generateMyReport}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
            >
              <Printer className="w-5 h-5" />
              Imprimir Boletim
            </button>
          </div>
        )}
      </div>
    </div>
  );
};