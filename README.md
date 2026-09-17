# Fabian LMS - School Management (12 PPLG 2)

A School Management and Learning Management System (LMS) API and Interactive Portal migrated to Node.js & Express.

## Features

- **Authentication & Roles**: JWT Bearer token authentication with Role-Based Access Control (`ADMIN`, `TEACHER`, `STUDENT`).
- **Kelas (Classes)**: Full database of 54 SMK classes across grades 10, 11, and 12 (Majors: PPLG, DKV, TJKT, PEMASARAN, MPLB).
- **Guru (Teachers)**: Complete teacher directory with NIP, contact, address, and account management.
- **Siswa (Students)**: Student records linked to classes, NIS, NISN, contact info, and account management.
- **Mata Pelajaran (Subjects)**: Curriculum subject management with unique subject codes.
- **Materi (Materials)**: Learning materials and module distribution with teacher attribution.
- **Tugas (Assignments)**: Homework and practical assignment publishing with deadlines and maximum scores.
- **Pengumpulan & Penilaian (Submissions & Grading)**: Student submission pipeline and teacher grading interface with scores and feedback.
- **Interactive REST API Explorer**: Built-in API tester for immediate endpoint verification.

## Default Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@school.com` | `admin123` |
| Teacher | `teacher@school.com` | `teacher123` |
| Student | `student@school.com` | `student123` |

## Environment Variables

Defined in `.env.example`:
- `PORT`: Default 3000
- `JWT_SECRET`: Secret key for signing JWT tokens
- `DATABASE_URL`: Optional external database URL
