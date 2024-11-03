import React from 'react';
import { Schedule } from '../lib/firebase';
import { Clock } from 'lucide-react';

type Props = {
  schedules: Schedule[];
};

export function ScheduleList({ schedules }: Props) {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-red-600 text-white">
              <th className="px-6 py-3 text-left text-sm font-semibold">Nome</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Horário</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {schedules.map((schedule) => (
              <tr key={schedule.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{schedule.name}</td>
                <td className="px-6 py-4 text-sm text-gray-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-600" />
                  {schedule.time}
                </td>
              </tr>
            ))}
            {schedules.length === 0 && (
              <tr>
                <td colSpan={2} className="px-6 py-4 text-sm text-gray-500 text-center">
                  Nenhum horário agendado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}