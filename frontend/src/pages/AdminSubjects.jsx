import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Plus, Search, Trash2, Edit } from 'lucide-react';

export default function AdminSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/subjects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const responseData = response.data;
      if (Array.isArray(responseData)) {
        setSubjects(responseData);
      } else if (responseData && Array.isArray(responseData.data)) {
        setSubjects(responseData.data);
      } else {
        setSubjects([]);
      }
      setLoading(false);
    } catch (err) {
      console.error('Gagal mengambil data mata pelajaran:', err);
      setSubjects([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const filteredSubjects = Array.isArray(subjects) ? subjects.filter(s => 
    (s.Name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (s.Code?.toLowerCase() || '').includes(search.toLowerCase())
  ) : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Daftar Mata Pelajaran</h3>
          <p className="text-xs text-gray-400 mt-0.5">Kelola kurikulum dan mata pelajaran sekolah.</p>
        </div>
        <button className="bg-[#1C4D8D] hover:bg-[#1C4D8D]/90 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition shadow-sm">
          <Plus size={18} /> Tambah Mapel
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="relative w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Cari nama atau kode mapel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#1C4D8D]"
            />
          </div>
          <span className="text-xs text-gray-400 font-medium">Total: {subjects.length} Mapel</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="py-3 px-6">No</th>
                <th className="py-3 px-6">Nama Mata Pelajaran</th>
                <th className="py-3 px-6">Kode Mapel</th>
                <th className="py-3 px-6">Deskripsi</th>
                <th className="py-3 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-400">Memuat data mata pelajaran...</td>
                </tr>
              ) : filteredSubjects.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-400">Tidak ada data mata pelajaran ditemukan.</td>
                </tr>
              ) : (
                filteredSubjects.map((subject, index) => (
                  <tr key={subject.ID || index} className="hover:bg-gray-50/50 transition">
                    <td className="py-3.5 px-6 font-medium text-gray-400">{index + 1}</td>
                    <td className="py-3.5 px-6 font-bold text-gray-800 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center text-[10px]">
                        {subject.Name ? subject.Name.substring(0, 2).toUpperCase() : 'MP'}
                      </div>
                      {subject.Name}
                    </td>
                    <td className="py-3.5 px-6 text-gray-500 font-mono">{subject.Code || '-'}</td>
                    <td className="py-3.5 px-6 text-gray-500">{subject.Description || '-'}</td>
                    <td className="py-3.5 px-6 text-center space-x-2">
                      <button className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition" title="Edit">
                        <Edit size={14} />
                      </button>
                      <button className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition" title="Hapus">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}