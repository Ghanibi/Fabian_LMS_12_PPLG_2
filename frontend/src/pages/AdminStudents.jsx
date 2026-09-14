import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Plus, Search, Trash2, Edit, X } from 'lucide-react';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [classesList, setClassesList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // State untuk Modal & Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ Name: '', NISN: '', Gender: 'Laki-laki', ClassID: '' });

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const responseData = response.data;
      if (Array.isArray(responseData)) {
        setStudents(responseData);
      } else if (responseData && Array.isArray(responseData.data)) {
        setStudents(responseData.data);
      } else {
        setStudents([]);
      }
      setLoading(false);
    } catch (err) {
      console.error('Gagal mengambil data siswa:', err);
      setStudents([]);
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/classes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const resData = response.data;
      if (Array.isArray(resData)) {
        setClassesList(resData);
      } else if (resData && Array.isArray(resData.data)) {
        setClassesList(resData.data);
      } else {
        setClassesList([]);
      }
    } catch (err) {
      console.error('Gagal mengambil data kelas:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  // Handle Buka Modal Tambah
  const handleOpenAdd = () => {
    setIsEditMode(false);
    setFormData({ Name: '', NISN: '', Gender: 'Laki-laki', ClassID: classesList[0]?.ID || classesList[0]?.id || '' });
    setIsModalOpen(true);
  };

  // Handle Buka Modal Edit
  const handleOpenEdit = (student) => {
    setIsEditMode(true);
    setCurrentId(student.ID || student.id);
    setFormData({ 
      Name: student.Name || student.name || student.FullName || student.nama || student.User?.Name || student.user?.name || '', 
      NISN: student.NISN || student.nisn || student.NIS || student.nis || '', 
      Gender: student.Gender || student.gender || student.JenisKelamin || student.jenis_kelamin || 'Laki-laki',
      ClassID: student.ClassID || student.class_id || student.Class?.ID || student.class?.id || ''
    });
    setIsModalOpen(true);
  };

  // Handle Submit Form (Tambah / Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const payload = {
        Name: formData.Name,
        name: formData.Name,
        NISN: formData.NISN,
        nisn: formData.NISN,
        nis: formData.NISN,
        Gender: formData.Gender,
        gender: formData.Gender,
        jenis_kelamin: formData.Gender,
        ClassID: formData.ClassID ? Number(formData.ClassID) : null,
        class_id: formData.ClassID ? Number(formData.ClassID) : null
      };

      if (isEditMode) {
        await axios.put(`http://localhost:8080/api/students/${currentId}`, payload, { headers });
      } else {
        await axios.post('http://localhost:8080/api/students', payload, { headers });
      }

      setIsModalOpen(false);
      fetchStudents();
    } catch (err) {
      console.error('Gagal menyimpan data siswa:', err);
      alert('Terjadi kesalahan saat menyimpan data.');
    }
  };

  // Handle Hapus Data
  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStudents();
    } catch (err) {
      console.error('Gagal menghapus data siswa:', err);
      alert('Gagal menghapus data.');
    }
  };

  const filteredStudents = Array.isArray(students) ? students.filter(s => {
    const name = s.Name || s.name || s.FullName || s.nama || s.User?.Name || s.user?.name || '';
    const nisn = s.NISN || s.nisn || s.NIS || s.nis || '';
    return name.toLowerCase().includes(search.toLowerCase()) || nisn.toLowerCase().includes(search.toLowerCase());
  }) : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Manajemen Siswa</h3>
          <p className="text-xs text-gray-400 mt-0.5">Kelola data seluruh siswa terdaftar di sekolah.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-[#1C4D8D] hover:bg-[#1C4D8D]/90 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition shadow-sm"
        >
          <Plus size={18} /> Tambah Siswa
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
              placeholder="Cari nama atau NISN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#1C4D8D]"
            />
          </div>
          <span className="text-xs text-gray-400 font-medium">Total: {students.length} Siswa</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="py-3 px-6">No</th>
                <th className="py-3 px-6">Nama Lengkap</th>
                <th className="py-3 px-6">NISN</th>
                <th className="py-3 px-6">Kelas</th>
                <th className="py-3 px-6">Jenis Kelamin</th>
                <th className="py-3 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">Memuat data siswa...</td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">Tidak ada data siswa ditemukan.</td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => {
                  const studentName = student.Name || student.name || student.FullName || student.nama || student.User?.Name || student.user?.name || 'Tanpa Nama';
                  const studentNisn = student.NISN || student.nisn || student.NIS || student.nis || '-';
                  const studentClass = student.Class?.Name || student.class?.name || student.ClassName || student.class_name || 'Belum ada kelas';
                  const studentGender = student.Gender || student.gender || student.JenisKelamin || student.jenis_kelamin || '-';

                  return (
                    <tr key={student.ID || student.id || index} className="hover:bg-gray-50/50 transition">
                      <td className="py-3.5 px-6 font-medium text-gray-400">{index + 1}</td>
                      <td className="py-3.5 px-6 font-bold text-gray-800">
                        {studentName}
                      </td>
                      <td className="py-3.5 px-6 text-gray-500">{studentNisn}</td>
                      <td className="py-3.5 px-6 font-medium text-[#1C4D8D]">
                        {studentClass}
                      </td>
                      <td className="py-3.5 px-6 text-gray-500">{studentGender}</td>
                      <td className="py-3.5 px-6 text-center space-x-2">
                        <button 
                          onClick={() => handleOpenEdit(student)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition" 
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(student.ID || student.id)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition" 
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Tambah / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h4 className="font-bold text-gray-800 text-base">
                {isEditMode ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
              </h4>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={formData.Name}
                  onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                  placeholder="Masukkan nama lengkap"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#1C4D8D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">NISN</label>
                <input
                  type="text"
                  required
                  value={formData.NISN}
                  onChange={(e) => setFormData({ ...formData, NISN: e.target.value })}
                  placeholder="Masukkan NISN"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#1C4D8D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Kelas</label>
                <select
                  value={formData.ClassID}
                  onChange={(e) => setFormData({ ...formData, ClassID: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#1C4D8D] bg-white"
                >
                  <option value="">-- Pilih Kelas --</option>
                  {classesList.map((cls) => (
                    <option key={cls.ID || cls.id} value={cls.ID || cls.id}>
                      {cls.Name || cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Jenis Kelamin</label>
                <select
                  value={formData.Gender}
                  onChange={(e) => setFormData({ ...formData, Gender: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#1C4D8D] bg-white"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#1C4D8D] text-white hover:bg-[#1C4D8D]/90 transition shadow-sm"
                >
                  {isEditMode ? 'Simpan Perubahan' : 'Tambah Siswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}