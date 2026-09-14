import React, { useState } from 'react';
import { Bell, Plus, Calendar } from 'lucide-react';

export default function AdminAnnouncements() {
  const [announcements] = useState([
    { id: 1, title: 'Libur Hari Raya Waisak', date: '12 Mei 2026', desc: 'Sekolah diliburkan pada tanggal 12 Mei 2026 sehubungan dengan Hari Raya Waisak.' },
    { id: 2, title: 'Pendaftaran Lomba Sains', date: '15 Mei 2026', desc: 'Segera daftarkan diri Anda di OSIS tingkat kabupaten sebelum penutupan.' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Pengumuman Sekolah</h3>
          <p className="text-xs text-gray-400 mt-0.5">Sampaikan informasi penting kepada seluruh warga sekolah.</p>
        </div>
        <button className="bg-[#1C4D8D] hover:bg-[#1C4D8D]/90 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition shadow-sm">
          <Plus size={18} /> Buat Pengumuman
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((item) => (
          <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                <Bell size={16} className="text-[#1C4D8D]" /> {item.title}
              </h4>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar size={12} /> {item.date}
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed pl-6">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}