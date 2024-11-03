import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { Clock, User } from 'lucide-react';

type Props = {
  onScheduleAdded: () => void;
  onCancel: () => void;
};

export function ScheduleForm({ onScheduleAdded, onCancel }: Props) {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min += 15) {
        const formattedHour = String(hour).padStart(2, '0');
        const formattedMin = String(min).padStart(2, '0');
        const nextMin = String((min + 15) % 60).padStart(2, '0');
        const nextHour = min + 15 >= 60 ? String(hour + 1).padStart(2, '0') : formattedHour;
        slots.push(`${formattedHour}:${formattedMin} - ${nextHour}:${nextMin}`);
      }
    }
    return slots;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !time) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      // Check if time slot is already taken
      const timeQuery = query(
        collection(db, 'schedules'),
        where('time', '==', time)
      );
      const timeSnapshot = await getDocs(timeQuery);

      if (!timeSnapshot.empty) {
        toast.error('Este horário já está reservado');
        setLoading(false);
        return;
      }

      // Add new schedule
      await addDoc(collection(db, 'schedules'), {
        name,
        time,
        created_at: new Date().toISOString()
      });

      toast.success('Horário agendado com sucesso!');
      onScheduleAdded();
    } catch (error) {
      toast.error('Erro ao agendar horário');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Escolha seu Horário
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <User className="w-4 h-4" />
            Nome
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Horário
          </label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
            required
          >
            <option value="">Selecione um horário</option>
            {generateTimeSlots().map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Voltar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {loading ? 'Agendando...' : 'Agendar'}
          </button>
        </div>
      </form>
    </div>
  );
}