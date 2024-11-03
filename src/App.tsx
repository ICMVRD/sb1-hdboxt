import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { db, type Schedule } from './lib/firebase';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ScheduleList } from './components/ScheduleList';
import { ScheduleForm } from './components/ScheduleForm';
import { DeveloperSettings } from './components/DeveloperSettings';
import { ClipboardList, Download } from 'lucide-react';
import { Logo } from './components/Logo';
import { getConfig } from './lib/config';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function App() {
  const [page, setPage] = useState<'home' | 'schedule' | 'admin' | 'developer'>('home');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const config = getConfig();

  const fetchSchedules = async () => {
    try {
      const schedulesQuery = query(collection(db, 'schedules'), orderBy('time'));
      const querySnapshot = await getDocs(schedulesQuery);
      const schedulesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Schedule[];
      setSchedules(schedulesData);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleAdminAccess = () => {
    const password = prompt('Digite a senha para acessar os relatórios:');
    if (password === '@@4438Mur') {
      setPage('admin');
    } else {
      alert('Senha incorreta.');
    }
  };

  const handleDeveloperAccess = () => {
    const password = prompt('Digite a senha do desenvolvedor:');
    if (password === 'MaranataoSenhorJesusVem') {
      setPage('developer');
    } else {
      alert('Senha incorreta.');
    }
  };

  const clearSchedules = async () => {
    const password = prompt('Digite a senha para zerar os horários:');
    if (password === '@@4438Mur') {
      try {
        const schedulesQuery = query(collection(db, 'schedules'));
        const querySnapshot = await getDocs(schedulesQuery);
        
        const deletePromises = querySnapshot.docs.map(doc => 
          deleteDoc(doc.ref)
        );
        
        await Promise.all(deletePromises);
        await fetchSchedules();
        alert('Horários zerados com sucesso!');
      } catch (error) {
        console.error('Error clearing schedules:', error);
        alert('Erro ao zerar horários.');
      }
    } else {
      alert('Senha incorreta!');
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const { churchName, churchBranch } = getConfig();
    
    doc.setFontSize(20);
    doc.setTextColor(180, 0, 0);
    doc.text(`${churchName} - ${churchBranch}`, 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Relatório de Oração Ininterrupta', 105, 30, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 40);
    
    autoTable(doc, {
      head: [['Horário', 'Nome']],
      body: schedules.map(schedule => [schedule.time, schedule.name]),
      startY: 50,
      headStyles: {
        fillColor: [180, 0, 0],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      styles: {
        fontSize: 12,
        cellPadding: 5
      }
    });
    
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(10);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Página ${i} de ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
    
    doc.save('relatorio-oracao.pdf');
  };

  const { churchName, churchBranch } = config;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Logo className="w-10 h-10 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              {churchName} - {churchBranch}
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700">
            Oração Ininterrupta
          </h2>
        </div>

        {page === 'home' && (
          <>
            <div className="mb-8">
              <button
                onClick={() => setPage('schedule')}
                className="w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                ESCOLHA SEU HORÁRIO
              </button>
            </div>

            {loading ? (
              <div className="text-center text-gray-500">Carregando horários...</div>
            ) : (
              <ScheduleList schedules={schedules} />
            )}

            <div className="mt-8 text-center">
              <button
                onClick={handleAdminAccess}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <ClipboardList className="w-4 h-4 mr-2" />
                Relatórios
              </button>
            </div>
          </>
        )}

        {page === 'schedule' && (
          <ScheduleForm
            onScheduleAdded={() => {
              fetchSchedules();
              setPage('home');
            }}
            onCancel={() => setPage('home')}
          />
        )}

        {page === 'admin' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Painel Administrativo</h3>
              
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={generatePDF}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Gerar Relatório PDF
                </button>
                
                <button
                  onClick={clearSchedules}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Zerar Horários
                </button>
                
                <button
                  onClick={() => setPage('home')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Voltar
                </button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Horários Agendados</h4>
              <ScheduleList schedules={schedules} />
              <div className="mt-4 text-sm text-gray-500 text-right">
                <button
                  onClick={handleDeveloperAccess}
                  className="text-gray-400 hover:text-gray-600"
                >
                  desenvolvedor
                </button>
              </div>
            </div>
          </div>
        )}

        {page === 'developer' && (
          <DeveloperSettings onClose={() => setPage('admin')} />
        )}
      </div>
    </div>
  );
}

export default App;