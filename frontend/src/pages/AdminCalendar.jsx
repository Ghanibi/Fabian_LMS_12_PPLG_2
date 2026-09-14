import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Clock, MapPin } from 'lucide-react';

export default function AdminCalendar() {
  const [events] = useState([
    { id: 1, date: '15 Mei 2026', title: 'Ulangan Harian Matematika', time: '08:00 - 10:00 WIB', location: 'Ruang Kelas' },
    { id: 2, date: '20 Mei 2026', title: 'UTS Semester Genap', time: '08:00 - 12:00 WIB', location: 'Aula Utama' },
    { id: 3, date: '25 Mei 2026', title: 'Pembagian Rapor', time: '09:00 WIB - Selesai', location: 'Masing-masing Kelas' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Kalender Akademik</h3>
          <p className="text-xs text-gray-400 mt-0.5">Kelola agenda dan jadwal penting kegiatan sekolah.</p>
        </div>
        <button className="bg-[#1C4D8D] hover:bg-[#1C4D8D]/90 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition shadow-sm">
          <Plus size={18} /> Tambah Agenda
        </button>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {events.map((event) => (
          <div key={event.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <span className="bg-blue-50 text-[#1C4D8D] font-bold text-xs px-3 py-1 rounded-lg">
                {event.date}
              </span>
              <span className="text-xs text-gray-400 font-medium">Agenda Resmi</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-base">{event.title}</h4>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><Clock size={14} className="text-gray-400" /> {event.time}</span>
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-gray-400" /> {event.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}