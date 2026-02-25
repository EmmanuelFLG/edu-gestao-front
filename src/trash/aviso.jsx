{/* AVISOS DINÂMICOS */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg">
          <Megaphone className="w-5 h-5 text-indigo-600" /> Avisos
        </h3>
        <div className="space-y-4">
          {stats?.avisos?.length > 0 ? (
            stats.avisos.map((aviso, i) => (
              <div key={i} className={`p-3 rounded-lg border-l-4 ${aviso.tipo === 'urgente' ? 'bg-red-50 border-red-500' : 'bg-blue-50 border-blue-500'}`}>
                <p className={`text-xs font-bold uppercase ${aviso.tipo === 'urgente' ? 'text-red-700' : 'text-blue-700'}`}>{aviso.titulo}</p>
                <p className={`text-sm font-medium ${aviso.tipo === 'urgente' ? 'text-red-800' : 'text-blue-800'}`}>{aviso.mensagem}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">Sem novos avisos.</p>
          )}
        </div>
      </div>


{/* Seção de Avisos */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-indigo-600" /> Avisos aos Docentes
        </h3>
        <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
          <div className="mt-0.5">
             <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
          </div>
          <p className="text-sm text-indigo-900 font-medium">
            O período para lançamento das notas do 1º bimestre encerra em <span className="font-bold text-indigo-700">20/03</span>.
          </p>
        </div>
      </div>