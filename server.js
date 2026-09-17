import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'school-management-secret-key-change-later';

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// -------------------------------------------------------------
// In-Memory Database Store
// -------------------------------------------------------------
let nextId = {
  user: 1,
  educationLevel: 1,
  class: 1,
  teacher: 1,
  student: 1,
  subject: 1,
  material: 1,
  assignment: 1,
  submission: 1,
};

const db = {
  users: [],
  educationLevels: [],
  classes: [],
  teachers: [],
  students: [],
  subjects: [],
  materials: [],
  assignments: [],
  submissions: [],
};

// -------------------------------------------------------------
// Seed Database with Go Seeder Data
// -------------------------------------------------------------
function seedDatabase() {
  // 1. Education Levels
  const smp = { ID: nextId.educationLevel++, Name: 'SMP' };
  const sma = { ID: nextId.educationLevel++, Name: 'SMA' };
  const smk = { ID: nextId.educationLevel++, Name: 'SMK' };
  db.educationLevels.push(smp, sma, smk);

  // 2. SMK Classes (Seeded exactly as in Go seed/classes.go)
  const classNames = [
    "10 DKV PLUS", "10 DKV 1", "10 DKV 2", "10 TJKT PLUS", "10 TJKT 1", "10 TJKT 2", "10 TJKT 3", "10 TJKT 4", "10 TJKT 5", "10 PPLG 1", "10 PPLG 2", "10 PEMASARAN 1", "10 PEMASARAN 2", "10 MPLB PLUS", "10 MPLB 1", "10 MPLB 2", "10 MPLB 3", "10 MPLB 4", "10 MPLB 5",
    "11 DKV PLUS", "11 DKV 1", "11 DKV 2", "11 TJKT PLUS", "11 TJKT 1", "11 TJKT 2", "11 TJKT 3", "11 TJKT 4", "11 TJKT 5", "11 TJKT 6", "11 TJKT 7", "11 PPLG 1", "11 PPLG 2", "11 PEMASARAN 1", "11 PEMASARAN 2", "11 PEMASARAN 3", "11 MPLB PLUS", "11 MPLB 1", "11 MPLB 2", "11 MPLB 3", "11 MPLB 4", "11 MPLB 5",
    "12 DKV PLUS", "12 DKV 1", "12 DKV 2", "12 TJKT PLUS", "12 TJKT 1", "12 TJKT 2", "12 TJKT 3", "12 TJKT 4", "12 TJKT 5", "12 TJKT 6", "12 TJKT 7", "12 PPLG 1", "12 PPLG 2", "12 PEMASARAN 1", "12 PEMASARAN 2", "12 PEMASARAN 3", "12 MPLB PLUS", "12 MPLB 1", "12 MPLB 2", "12 MPLB 3", "12 MPLB 4", "12 MPLB 5"
  ];

  for (const name of classNames) {
    const grade = parseInt(name.substring(0, 2), 10);
    const parts = name.split(' ');
    const major = parts.length > 1 ? parts[1] : '';
    const isPlus = name.includes('PLUS');

    db.classes.push({
      ID: nextId.class++,
      Name: name,
      EducationLevelID: smk.ID,
      Grade: grade,
      Major: major,
      ClassNumber: null,
      IsPlus: isPlus,
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString()
    });
  }

  // 3. Seed Users (Admin, Teacher, Student)
  const adminHash = bcrypt.hashSync('admin123', 10);
  const teacherHash = bcrypt.hashSync('teacher123', 10);
  const studentHash = bcrypt.hashSync('student123', 10);

  const adminUser = {
    ID: nextId.user++,
    Name: 'Admin User',
    Email: 'admin@school.com',
    Password: adminHash,
    Role: 'ADMIN',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  };

  const teacherUser = {
    ID: nextId.user++,
    Name: 'Budi Santoso, S.Kom',
    Email: 'teacher@school.com',
    Password: teacherHash,
    Role: 'TEACHER',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  };

  const studentUser = {
    ID: nextId.user++,
    Name: 'Fabian Nanday',
    Email: 'student@school.com',
    Password: studentHash,
    Role: 'STUDENT',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  };

  db.users.push(adminUser, teacherUser, studentUser);

  // 4. Seed Teacher
  const teacherProfile = {
    ID: nextId.teacher++,
    UserID: teacherUser.ID,
    NIP: '198503152010011002',
    Phone: '08123456789',
    Address: 'Jl. Merdeka No. 10, Bandung',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  };
  db.teachers.push(teacherProfile);

  // 5. Seed Student (assigned to 12 PPLG 2)
  const pplg12Class = db.classes.find(c => c.Name === '12 PPLG 2') || db.classes[0];
  const studentProfile = {
    ID: nextId.student++,
    UserID: studentUser.ID,
    NIS: '222310123',
    NISN: '0061234567',
    Gender: 'L',
    ClassID: pplg12Class.ID,
    Phone: '08987654321',
    Address: 'Jl. Kebon Jeruk No. 45, Bandung',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  };
  db.students.push(studentProfile);

  // 6. Seed Subjects
  const subjectsData = [
    { Name: 'Pemodelan Perangkat Lunak', Code: 'PPLG-01' },
    { Name: 'Basis Data', Code: 'PPLG-02' },
    { Name: 'Pemrograman Web dan Bergerak', Code: 'PPLG-03' },
    { Name: 'Pengembangan Gim', Code: 'PPLG-04' }
  ];
  for (const s of subjectsData) {
    db.subjects.push({
      ID: nextId.subject++,
      Name: s.Name,
      Code: s.Code,
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString()
    });
  }

  // 7. Seed Material
  db.materials.push({
    ID: nextId.material++,
    ClassSubjectID: 1,
    TeacherID: teacherProfile.ID,
    Title: 'Pengenalan REST API dan Arsitektur Web Service',
    Description: 'Materi modul dasar konsep HTTP, Routing, Controller, dan JSON response untuk kelas 12 PPLG 2.',
    FileURL: 'https://storage.googleapis.com/demo-lms-assets/modul-rest-api.pdf',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  });

  // 8. Seed Assignment
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);
  db.assignments.push({
    ID: nextId.assignment++,
    ClassSubjectID: 1,
    TeacherID: teacherProfile.ID,
    Title: 'Tugas 1: Implementasi REST API Controller & Routes',
    Description: 'Buatlah endpoint lengkap untuk operasi data Siswa dan Kelas menggunakan otentikasi JWT.',
    DueDate: dueDate.toISOString(),
    MaxScore: 100,
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  });

  // 9. Seed Submission
  db.submissions.push({
    ID: nextId.submission++,
    AssignmentID: 1,
    StudentID: studentProfile.ID,
    SubmissionText: 'Repo GitHub: https://github.com/Ghanibi/Fabian_LMS_12_PPLG_2 - Semua route CRUD dan Auth berhasil dites.',
    FileURL: 'https://storage.googleapis.com/demo-lms-assets/tugas-fabian-pplg2.zip',
    SubmittedAt: new Date().toISOString(),
    Status: 'GRADED',
    Score: 98,
    Feedback: 'Kerja sangat bagus! Struktur kode rapi dan otentikasi role berjalan dengan sempurna.',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  });

  console.log('Database seeded successfully with Go seeder data.');
}

seedDatabase();

// -------------------------------------------------------------
// Helper Functions for Models Preloading
// -------------------------------------------------------------
function populateClass(c) {
  if (!c) return null;
  const level = db.educationLevels.find(l => l.ID === c.EducationLevelID);
  return { ...c, EducationLevel: level || null };
}

function populateTeacher(t) {
  if (!t) return null;
  const user = db.users.find(u => u.ID === t.UserID);
  const userWithoutPass = user ? { ...user, Password: '' } : null;
  return { ...t, User: userWithoutPass };
}

function populateStudent(s) {
  if (!s) return null;
  const user = db.users.find(u => u.ID === s.UserID);
  const userWithoutPass = user ? { ...user, Password: '' } : null;
  const cls = db.classes.find(c => c.ID === s.ClassID);
  return {
    ...s,
    User: userWithoutPass,
    Class: populateClass(cls)
  };
}

function populateMaterial(m) {
  if (!m) return null;
  const teacher = db.teachers.find(t => t.ID === m.TeacherID);
  return { ...m, Teacher: populateTeacher(teacher) };
}

function populateAssignment(a) {
  if (!a) return null;
  const teacher = db.teachers.find(t => t.ID === a.TeacherID);
  return { ...a, Teacher: populateTeacher(teacher) };
}

function populateSubmission(sub) {
  if (!sub) return null;
  const assignment = db.assignments.find(a => a.ID === sub.AssignmentID);
  const student = db.students.find(s => s.ID === sub.StudentID);
  return {
    ...sub,
    Assignment: populateAssignment(assignment),
    Student: populateStudent(student)
  };
}

// -------------------------------------------------------------
// Authentication & Role Middlewares
// -------------------------------------------------------------
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Request tidak menyertakan token' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Header otorisasi tidak valid' });
  }

  const tokenString = parts[1];
  try {
    const decoded = jwt.verify(tokenString, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token tidak valid: ' + err.message });
  }
}

function roleMiddleware(...requiredRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: 'Role pengguna tidak ditemukan di dalam token' });
    }

    const userRole = req.user.role;
    if (requiredRoles.includes(userRole)) {
      return next();
    }

    return res.status(403).json({ error: 'Anda tidak memiliki hak akses untuk sumber daya ini' });
  };
}

// -------------------------------------------------------------
// 1. Auth Routes (/api/auth)
// -------------------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Key: \'LoginInput.Email\' or \'LoginInput.Password\' Error:Field validation failed' });
  }

  const user = db.users.find(u => u.Email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: 'Email atau password salah' });
  }

  const match = bcrypt.compareSync(password, user.Password);
  if (!match) {
    return res.status(401).json({ error: 'Email atau password salah' });
  }

  const token = jwt.sign(
    {
      user_id: user.ID,
      name: user.Name,
      email: user.Email,
      role: user.Role
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return res.status(200).json({
    message: 'Login berhasil',
    token,
    user: {
      ID: user.ID,
      Name: user.Name,
      Email: user.Email,
      Role: user.Role
    }
  });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  return res.status(200).json({
    user_id: req.user.user_id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role
  });
});

// -------------------------------------------------------------
// 2. User Routes (/api/users) - ADMIN only
// -------------------------------------------------------------
const userRoutes = express.Router();
userRoutes.use(authMiddleware, roleMiddleware('ADMIN'));

userRoutes.post('/', (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Name, email, password, and role are required' });
  }

  if (db.users.some(u => u.Email.toLowerCase() === email.toLowerCase())) {
    return res.status(500).json({ error: 'Gagal membuat user: Email sudah terdaftar' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    ID: nextId.user++,
    Name: name,
    Email: email,
    Password: hashedPassword,
    Role: role,
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  };

  db.users.push(newUser);
  return res.status(201).json({ data: { ...newUser, Password: '' } });
});

userRoutes.get('/', (req, res) => {
  const safeUsers = db.users.map(u => ({ ...u, Password: '' }));
  return res.status(200).json({ data: safeUsers });
});

userRoutes.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const user = db.users.find(u => u.ID === id);
  if (!user) {
    return res.status(404).json({ error: 'User tidak ditemukan' });
  }
  return res.status(200).json({ data: { ...user, Password: '' } });
});

userRoutes.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const user = db.users.find(u => u.ID === id);
  if (!user) {
    return res.status(404).json({ error: 'User tidak ditemukan' });
  }

  const { name, email, role } = req.body;
  if (name) user.Name = name;
  if (email) user.Email = email;
  if (role) user.Role = role;
  user.UpdatedAt = new Date().toISOString();

  return res.status(200).json({ data: { ...user, Password: '' } });
});

userRoutes.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = db.users.findIndex(u => u.ID === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'User tidak ditemukan' });
  }
  db.users.splice(idx, 1);
  return res.status(200).json({ message: 'User berhasil dihapus' });
});

app.use('/api/users', userRoutes);

// -------------------------------------------------------------
// 3. Class Routes (/api/classes) - ADMIN only
// -------------------------------------------------------------
const classRoutes = express.Router();
classRoutes.use(authMiddleware, roleMiddleware('ADMIN'));

classRoutes.get('/', (req, res) => {
  const populated = db.classes.map(populateClass);
  return res.status(200).json({ message: 'Berhasil mengambil data kelas', data: populated });
});

classRoutes.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const cls = db.classes.find(c => c.ID === id);
  if (!cls) {
    return res.status(404).json({ error: 'Kelas tidak ditemukan' });
  }
  return res.status(200).json({ message: 'Berhasil mengambil detail kelas', data: populateClass(cls) });
});

classRoutes.post('/', (req, res) => {
  const { name, education_level_id, grade, major, class_number, is_plus } = req.body;
  if (!name || !education_level_id || grade === undefined) {
    return res.status(400).json({ error: 'Nama, education_level_id, dan grade wajib diisi' });
  }

  const newClass = {
    ID: nextId.class++,
    Name: name,
    EducationLevelID: Number(education_level_id),
    Grade: Number(grade),
    Major: major || '',
    ClassNumber: class_number || null,
    IsPlus: Boolean(is_plus),
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  };

  db.classes.push(newClass);
  return res.status(201).json({ message: 'Kelas berhasil ditambahkan', data: populateClass(newClass) });
});

classRoutes.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const cls = db.classes.find(c => c.ID === id);
  if (!cls) {
    return res.status(404).json({ error: 'Kelas tidak ditemukan' });
  }

  const { name, education_level_id, grade, major, class_number, is_plus } = req.body;
  if (name !== undefined) cls.Name = name;
  if (education_level_id !== undefined) cls.EducationLevelID = Number(education_level_id);
  if (grade !== undefined) cls.Grade = Number(grade);
  if (major !== undefined) cls.Major = major;
  if (class_number !== undefined) cls.ClassNumber = class_number;
  if (is_plus !== undefined) cls.IsPlus = Boolean(is_plus);
  cls.UpdatedAt = new Date().toISOString();

  return res.status(200).json({ message: 'Kelas berhasil diperbarui', data: populateClass(cls) });
});

classRoutes.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = db.classes.findIndex(c => c.ID === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Kelas tidak ditemukan' });
  }
  db.classes.splice(idx, 1);
  return res.status(200).json({ message: 'Kelas berhasil dihapus' });
});

app.use('/api/classes', classRoutes);

// -------------------------------------------------------------
// 4. Teacher Routes (/api/teachers) - ADMIN only
// -------------------------------------------------------------
const teacherRoutes = express.Router();
teacherRoutes.use(authMiddleware, roleMiddleware('ADMIN'));

teacherRoutes.get('/', (req, res) => {
  const populated = db.teachers.map(populateTeacher);
  return res.status(200).json({ message: 'Berhasil mengambil data guru', data: populated });
});

teacherRoutes.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const teacher = db.teachers.find(t => t.ID === id);
  if (!teacher) {
    return res.status(404).json({ error: 'Guru tidak ditemukan' });
  }
  return res.status(200).json({ message: 'Berhasil mengambil detail guru', data: populateTeacher(teacher) });
});

teacherRoutes.post('/', (req, res) => {
  const { name, email, password, nip, phone, address } = req.body;
  if (!name || !email || !password || !nip) {
    return res.status(400).json({ error: 'Name, email, password, and NIP are required' });
  }

  if (db.users.some(u => u.Email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: 'Email sudah terdaftar' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    ID: nextId.user++,
    Name: name,
    Email: email,
    Password: hashedPassword,
    Role: 'TEACHER',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  };
  db.users.push(newUser);

  const newTeacher = {
    ID: nextId.teacher++,
    UserID: newUser.ID,
    NIP: nip,
    Phone: phone || '',
    Address: address || '',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  };
  db.teachers.push(newTeacher);

  return res.status(201).json({ message: 'Guru berhasil ditambahkan', data: populateTeacher(newTeacher) });
});

teacherRoutes.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const teacher = db.teachers.find(t => t.ID === id);
  if (!teacher) {
    return res.status(404).json({ error: 'Guru tidak ditemukan' });
  }

  const user = db.users.find(u => u.ID === teacher.UserID);
  const { name, email, nip, phone, address } = req.body;

  if (user) {
    if (name) user.Name = name;
    if (email) user.Email = email;
    user.UpdatedAt = new Date().toISOString();
  }

  if (nip) teacher.NIP = nip;
  if (phone) teacher.Phone = phone;
  if (address) teacher.Address = address;
  teacher.UpdatedAt = new Date().toISOString();

  return res.status(200).json({ message: 'Data guru berhasil diperbarui', data: populateTeacher(teacher) });
});

teacherRoutes.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = db.teachers.findIndex(t => t.ID === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Guru tidak ditemukan' });
  }
  const teacher = db.teachers[idx];
  db.teachers.splice(idx, 1);

  // Delete user account as well
  const userIdx = db.users.findIndex(u => u.ID === teacher.UserID);
  if (userIdx !== -1) {
    db.users.splice(userIdx, 1);
  }

  return res.status(200).json({ message: 'Guru dan akun terkait berhasil dihapus' });
});

app.use('/api/teachers', teacherRoutes);

// -------------------------------------------------------------
// 5. Student Routes (/api/students) - ADMIN only
// -------------------------------------------------------------
const studentRoutes = express.Router();
studentRoutes.use(authMiddleware, roleMiddleware('ADMIN'));

studentRoutes.get('/', (req, res) => {
  const populated = db.students.map(populateStudent);
  return res.status(200).json({ message: 'Berhasil mengambil data siswa', data: populated });
});

studentRoutes.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const student = db.students.find(s => s.ID === id);
  if (!student) {
    return res.status(404).json({ error: 'Siswa tidak ditemukan' });
  }
  return res.status(200).json({ message: 'Berhasil mengambil detail siswa', data: populateStudent(student) });
});

studentRoutes.post('/', (req, res) => {
  const { name, email, password, nis, nisn, gender, class_id, phone, address } = req.body;
  if (!name || !email || !password || !nis || !class_id) {
    return res.status(400).json({ error: 'Name, email, password, NIS, and class_id are required' });
  }

  if (db.users.some(u => u.Email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: 'Email sudah terdaftar' });
  }

  const cls = db.classes.find(c => c.ID === Number(class_id));
  if (!cls) {
    return res.status(400).json({ error: 'Kelas tidak ditemukan' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    ID: nextId.user++,
    Name: name,
    Email: email,
    Password: hashedPassword,
    Role: 'STUDENT',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  };
  db.users.push(newUser);

  const newStudent = {
    ID: nextId.student++,
    UserID: newUser.ID,
    NIS: nis,
    NISN: nisn || '',
    Gender: gender || '',
    ClassID: Number(class_id),
    Phone: phone || '',
    Address: address || '',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  };
  db.students.push(newStudent);

  return res.status(201).json({ message: 'Siswa berhasil ditambahkan', data: populateStudent(newStudent) });
});

studentRoutes.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const student = db.students.find(s => s.ID === id);
  if (!student) {
    return res.status(404).json({ error: 'Siswa tidak ditemukan' });
  }

  const { name, email, nis, nisn, gender, class_id, phone, address } = req.body;

  if (class_id) {
    const cls = db.classes.find(c => c.ID === Number(class_id));
    if (!cls) {
      return res.status(400).json({ error: 'Kelas tidak ditemukan' });
    }
    student.ClassID = Number(class_id);
  }

  const user = db.users.find(u => u.ID === student.UserID);
  if (user) {
    if (name) user.Name = name;
    if (email) user.Email = email;
    user.UpdatedAt = new Date().toISOString();
  }

  if (nis) student.NIS = nis;
  if (nisn) student.NISN = nisn;
  if (gender) student.Gender = gender;
  if (phone) student.Phone = phone;
  if (address) student.Address = address;
  student.UpdatedAt = new Date().toISOString();

  return res.status(200).json({ message: 'Data siswa berhasil diperbarui', data: populateStudent(student) });
});

studentRoutes.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = db.students.findIndex(s => s.ID === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Siswa tidak ditemukan' });
  }
  const student = db.students[idx];
  db.students.splice(idx, 1);

  // Delete user account as well
  const userIdx = db.users.findIndex(u => u.ID === student.UserID);
  if (userIdx !== -1) {
    db.users.splice(userIdx, 1);
  }

  return res.status(200).json({ message: 'Siswa dan akun terkait berhasil dihapus' });
});

app.use('/api/students', studentRoutes);

// -------------------------------------------------------------
// 6. Subject Routes (/api/subjects) - ADMIN only
// -------------------------------------------------------------
const subjectRoutes = express.Router();
subjectRoutes.use(authMiddleware, roleMiddleware('ADMIN'));

subjectRoutes.get('/', (req, res) => {
  return res.status(200).json({ message: 'Berhasil mengambil data mata pelajaran', data: db.subjects });
});

subjectRoutes.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const subject = db.subjects.find(s => s.ID === id);
  if (!subject) {
    return res.status(404).json({ error: 'Mata pelajaran tidak ditemukan' });
  }
  return res.status(200).json({ message: 'Berhasil mengambil detail mata pelajaran', data: subject });
});

subjectRoutes.post('/', (req, res) => {
  const { name, code } = req.body;
  if (!name || !code) {
    return res.status(400).json({ error: 'Name and code are required' });
  }

  if (db.subjects.some(s => s.Code.toLowerCase() === code.toLowerCase())) {
    return res.status(500).json({ error: 'Gagal membuat mata pelajaran, pastikan kode unik' });
  }

  const newSubject = {
    ID: nextId.subject++,
    Name: name,
    Code: code,
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  };
  db.subjects.push(newSubject);

  return res.status(201).json({ message: 'Mata pelajaran berhasil ditambahkan', data: newSubject });
});

subjectRoutes.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const subject = db.subjects.find(s => s.ID === id);
  if (!subject) {
    return res.status(404).json({ error: 'Mata pelajaran tidak ditemukan' });
  }

  const { name, code } = req.body;
  if (name) subject.Name = name;
  if (code) subject.Code = code;
  subject.UpdatedAt = new Date().toISOString();

  return res.status(200).json({ message: 'Mata pelajaran berhasil diperbarui', data: subject });
});

subjectRoutes.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = db.subjects.findIndex(s => s.ID === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Mata pelajaran tidak ditemukan' });
  }
  db.subjects.splice(idx, 1);
  return res.status(200).json({ message: 'Mata pelajaran berhasil dihapus' });
});

app.use('/api/subjects', subjectRoutes);

// -------------------------------------------------------------
// 7. Material Routes (/api/materials) - ADMIN only
// -------------------------------------------------------------
const materialRoutes = express.Router();
materialRoutes.use(authMiddleware, roleMiddleware('ADMIN'));

materialRoutes.get('/', (req, res) => {
  const populated = db.materials.map(populateMaterial);
  return res.status(200).json({ message: 'Berhasil mengambil data materi', data: populated });
});

materialRoutes.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const material = db.materials.find(m => m.ID === id);
  if (!material) {
    return res.status(404).json({ error: 'Materi tidak ditemukan' });
  }
  return res.status(200).json({ message: 'Berhasil mengambil detail materi', data: populateMaterial(material) });
});

materialRoutes.post('/', (req, res) => {
  const { class_subject_id, teacher_id, title, description, file_url } = req.body;
  if (!class_subject_id || !teacher_id || !title) {
    return res.status(400).json({ error: 'class_subject_id, teacher_id, and title are required' });
  }

  const newMaterial = {
    ID: nextId.material++,
    ClassSubjectID: Number(class_subject_id),
    TeacherID: Number(teacher_id),
    Title: title,
    Description: description || '',
    FileURL: file_url || '',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  };

  db.materials.push(newMaterial);
  return res.status(201).json({ message: 'Materi berhasil ditambahkan', data: populateMaterial(newMaterial) });
});

materialRoutes.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const material = db.materials.find(m => m.ID === id);
  if (!material) {
    return res.status(404).json({ error: 'Materi tidak ditemukan' });
  }

  const { class_subject_id, teacher_id, title, description, file_url } = req.body;
  if (class_subject_id) material.ClassSubjectID = Number(class_subject_id);
  if (teacher_id) material.TeacherID = Number(teacher_id);
  if (title) material.Title = title;
  if (description !== undefined) material.Description = description;
  if (file_url !== undefined) material.FileURL = file_url;
  material.UpdatedAt = new Date().toISOString();

  return res.status(200).json({ message: 'Materi berhasil diperbarui', data: populateMaterial(material) });
});

materialRoutes.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = db.materials.findIndex(m => m.ID === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Materi tidak ditemukan' });
  }
  db.materials.splice(idx, 1);
  return res.status(200).json({ message: 'Materi berhasil dihapus' });
});

app.use('/api/materials', materialRoutes);

// -------------------------------------------------------------
// 8. Assignment Routes (/api/assignments) - ADMIN only
// -------------------------------------------------------------
const assignmentRoutes = express.Router();
assignmentRoutes.use(authMiddleware, roleMiddleware('ADMIN'));

assignmentRoutes.get('/', (req, res) => {
  const populated = db.assignments.map(populateAssignment);
  return res.status(200).json({ message: 'Berhasil mengambil data tugas', data: populated });
});

assignmentRoutes.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const assignment = db.assignments.find(a => a.ID === id);
  if (!assignment) {
    return res.status(404).json({ error: 'Tugas tidak ditemukan' });
  }
  return res.status(200).json({ message: 'Berhasil mengambil detail tugas', data: populateAssignment(assignment) });
});

assignmentRoutes.post('/', (req, res) => {
  const { class_subject_id, teacher_id, title, description, due_date, max_score } = req.body;
  if (!class_subject_id || !teacher_id || !title || !due_date) {
    return res.status(400).json({ error: 'class_subject_id, teacher_id, title, and due_date are required' });
  }

  const newAssignment = {
    ID: nextId.assignment++,
    ClassSubjectID: Number(class_subject_id),
    TeacherID: Number(teacher_id),
    Title: title,
    Description: description || '',
    DueDate: new Date(due_date).toISOString(),
    MaxScore: max_score ? Number(max_score) : 100,
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  };

  db.assignments.push(newAssignment);
  return res.status(201).json({ message: 'Tugas berhasil ditambahkan', data: populateAssignment(newAssignment) });
});

assignmentRoutes.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const assignment = db.assignments.find(a => a.ID === id);
  if (!assignment) {
    return res.status(404).json({ error: 'Tugas tidak ditemukan' });
  }

  const { class_subject_id, teacher_id, title, description, due_date, max_score } = req.body;
  if (class_subject_id) assignment.ClassSubjectID = Number(class_subject_id);
  if (teacher_id) assignment.TeacherID = Number(teacher_id);
  if (title) assignment.Title = title;
  if (description !== undefined) assignment.Description = description;
  if (due_date) assignment.DueDate = new Date(due_date).toISOString();
  if (max_score !== undefined) assignment.MaxScore = Number(max_score);
  assignment.UpdatedAt = new Date().toISOString();

  return res.status(200).json({ message: 'Tugas berhasil diperbarui', data: populateAssignment(assignment) });
});

assignmentRoutes.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = db.assignments.findIndex(a => a.ID === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Tugas tidak ditemukan' });
  }
  db.assignments.splice(idx, 1);
  return res.status(200).json({ message: 'Tugas berhasil dihapus' });
});

app.use('/api/assignments', assignmentRoutes);

// -------------------------------------------------------------
// 9. Submission Routes (/api/submissions)
// -------------------------------------------------------------
const submissionRoutes = express.Router();
submissionRoutes.use(authMiddleware);

// GET /api/submissions (ADMIN or TEACHER)
submissionRoutes.get('/', roleMiddleware('ADMIN', 'TEACHER'), (req, res) => {
  const populated = db.submissions.map(populateSubmission);
  return res.status(200).json({ message: 'Berhasil mengambil data pengumpulan tugas', data: populated });
});

// POST /api/submissions (STUDENT only)
submissionRoutes.post('/', roleMiddleware('STUDENT'), (req, res) => {
  const { assignment_id, student_id, submission_text, file_url } = req.body;
  if (!assignment_id || !student_id) {
    return res.status(400).json({ error: 'assignment_id and student_id are required' });
  }

  const assignment = db.assignments.find(a => a.ID === Number(assignment_id));
  if (!assignment) {
    return res.status(400).json({ error: 'Tugas tidak ditemukan' });
  }

  const student = db.students.find(s => s.ID === Number(student_id));
  if (!student) {
    return res.status(400).json({ error: 'Siswa tidak ditemukan' });
  }

  const newSubmission = {
    ID: nextId.submission++,
    AssignmentID: Number(assignment_id),
    StudentID: Number(student_id),
    SubmissionText: submission_text || '',
    FileURL: file_url || '',
    SubmittedAt: new Date().toISOString(),
    Status: 'SUBMITTED',
    Score: null,
    Feedback: '',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  };

  db.submissions.push(newSubmission);
  return res.status(201).json({ message: 'Tugas berhasil dikumpulkan', data: populateSubmission(newSubmission) });
});

// PUT /api/submissions/:id/grade (ADMIN or TEACHER)
submissionRoutes.put('/:id/grade', roleMiddleware('ADMIN', 'TEACHER'), (req, res) => {
  const id = parseInt(req.params.id, 10);
  const submission = db.submissions.find(s => s.ID === id);
  if (!submission) {
    return res.status(404).json({ error: 'Pengumpulan tugas tidak ditemukan' });
  }

  const { score, feedback } = req.body;
  if (score === undefined) {
    return res.status(400).json({ error: 'score is required' });
  }

  submission.Score = Number(score);
  submission.Feedback = feedback || '';
  submission.Status = 'GRADED';
  submission.UpdatedAt = new Date().toISOString();

  return res.status(200).json({ message: 'Tugas berhasil dinilai', data: populateSubmission(submission) });
});

app.use('/api/submissions', submissionRoutes);

// -------------------------------------------------------------
// Education Levels endpoint (/api/education-levels)
// -------------------------------------------------------------
app.get('/api/education-levels', (req, res) => {
  return res.status(200).json({ data: db.educationLevels });
});

// -------------------------------------------------------------
// Health Check Endpoint
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Fabian LMS - School Management 12 PPLG 2',
    records: {
      classes: db.classes.length,
      users: db.users.length,
      teachers: db.teachers.length,
      students: db.students.length,
      subjects: db.subjects.length,
      materials: db.materials.length,
      assignments: db.assignments.length,
      submissions: db.submissions.length
    }
  });
});

// Fallback to static HTML for SPA / direct navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Fabian LMS server running on http://0.0.0.0:${PORT}`);
});
