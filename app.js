/* ══════════════════════════════════════════════════════════
   EduManage — College Student Management System
   app.js  |  Handles Login Page + Both Dashboards
══════════════════════════════════════════════════════════ */

/* ─── SHARED DATA STORE ─────────────────────────────────── */
const DB = {
  users: {
    'STU2024001': { password: 'pass123', role: 'student', name: 'Alex Johnson',      dept: 'Computer Science', roll: '2024001', email: 'alex.johnson@college.edu' },
    'STU2024002': { password: 'pass123', role: 'student', name: 'Maria Garcia',      dept: 'Computer Science', roll: '2024002', email: 'maria.garcia@college.edu' },
    'STU2024003': { password: 'pass123', role: 'student', name: 'David Lee',         dept: 'Computer Science', roll: '2024003', email: 'david.lee@college.edu' },
    'STU2024004': { password: 'pass123', role: 'student', name: 'Sophie Brown',      dept: 'Mathematics',      roll: '2024004', email: 'sophie.brown@college.edu' },
    'STU2024005': { password: 'pass123', role: 'student', name: 'James Wilson',      dept: 'Computer Science', roll: '2024005', email: 'james.wilson@college.edu' },
    'TCH001':     { password: 'teach123', role: 'teacher', name: 'Dr. Emily Carter', dept: 'Computer Science', roll: 'TCH001',  email: 'emily.carter@college.edu' },
    'ADM001':     { password: 'admin123', role: 'admin',   name: 'Admin User',       dept: 'Administration',   roll: 'ADM001',  email: 'admin@college.edu' },
  },

  assignments: [
    { id: 1,  title: 'Data Structures Lab 3',       course: 'CS101', courseCode: 'CS101', dueDate: '2024-12-20', maxMarks: 100, desc: 'Implement a balanced BST with insert, delete, and traversal operations. Submit source code with documentation.', priority: 'high',   status: 'active',  createdBy: 'TCH001', submissions: [] },
    { id: 2,  title: 'Algorithm Analysis Report',   course: 'CS201', courseCode: 'CS201', dueDate: '2024-12-18', maxMarks: 50,  desc: 'Analyze time and space complexity of sorting algorithms. Write a 3-page report with graphs.',                   priority: 'urgent', status: 'active',  createdBy: 'TCH001', submissions: [] },
    { id: 3,  title: 'Database ER Diagram',         course: 'CS301', courseCode: 'CS301', dueDate: '2024-12-25', maxMarks: 75,  desc: 'Design an ER diagram for a library management system and convert it to relational schema.',                      priority: 'normal', status: 'active',  createdBy: 'TCH001', submissions: [] },
    { id: 4,  title: 'Sorting Algorithm Quiz',      course: 'CS201', courseCode: 'CS201', dueDate: '2024-12-10', maxMarks: 30,  desc: 'Online quiz covering merge sort, quick sort, and heap sort.',                                                    priority: 'normal', status: 'closed',  createdBy: 'TCH001', submissions: [] },
    { id: 5,  title: 'Linked List Implementation',  course: 'CS101', courseCode: 'CS101', dueDate: '2024-12-05', maxMarks: 100, desc: 'Implement singly and doubly linked lists with all standard operations.',                                         priority: 'normal', status: 'closed',  createdBy: 'TCH001', submissions: [] },
  ],

  studentAssignments: {
    'STU2024001': [
      { assignId: 1, status: 'pending',   submittedText: '',   grade: null, feedback: '' },
      { assignId: 2, status: 'pending',   submittedText: '',   grade: null, feedback: '' },
      { assignId: 3, status: 'submitted', submittedText: 'ER diagram attached as PDF. Used Chen notation for entities.', grade: null, feedback: '' },
      { assignId: 4, status: 'graded',    submittedText: 'Completed online quiz.',  grade: 27, feedback: 'Excellent work!' },
      { assignId: 5, status: 'graded',    submittedText: 'Implementation submitted via GitHub link.', grade: 88, feedback: 'Good job, minor edge cases missed.' },
    ]
  },

  grades: {
    'STU2024001': [
      { course: 'Data Structures',    code: 'CS101', credits: 4, marks: 88, grade: 'A', status: 'Pass' },
      { course: 'Algorithms',         code: 'CS201', credits: 4, marks: 82, grade: 'A', status: 'Pass' },
      { course: 'Database Systems',   code: 'CS301', credits: 3, marks: 76, grade: 'B', status: 'Pass' },
      { course: 'Operating Systems',  code: 'CS302', credits: 3, marks: 91, grade: 'A', status: 'Pass' },
      { course: 'Computer Networks',  code: 'CS401', credits: 3, marks: 78, grade: 'B', status: 'Pass' },
      { course: 'Software Eng.',      code: 'CS402', credits: 3, marks: 85, grade: 'A', status: 'Pass' },
    ]
  },

  attendance: {
    'STU2024001': [
      { subject: 'Data Structures',   total: 30, attended: 28, code: 'CS101' },
      { subject: 'Algorithms',        total: 28, attended: 26, code: 'CS201' },
      { subject: 'Database Systems',  total: 25, attended: 22, code: 'CS301' },
      { subject: 'Operating Systems', total: 28, attended: 27, code: 'CS302' },
      { subject: 'Computer Networks', total: 22, attended: 20, code: 'CS401' },
      { subject: 'Software Eng.',     total: 24, attended: 21, code: 'CS402' },
    ]
  },

  announcements: [
    { id: 1, title: 'End Semester Exam Schedule Released', body: 'The end semester examination schedule for Fall 2024 has been published. Please check the academic calendar for your specific exam dates and hall assignments.', author: 'Admin', date: '2024-12-15', tag: 'Important', isNew: true },
    { id: 2, title: 'CS101 Extra Class on Saturday',       body: 'There will be an extra class for CS101 Data Structures this Saturday at 10:00 AM in Room 204. Attendance is mandatory for all students.', author: 'Dr. Emily Carter', date: '2024-12-14', tag: 'Class', isNew: true },
    { id: 3, title: 'Library Hours Extended',              body: 'The college library will remain open until 10 PM on weekdays until the end of semester exams. Make use of the extended hours for your studies.', author: 'Admin', date: '2024-12-12', tag: 'General', isNew: false },
    { id: 4, title: 'Winter Break Notice',                 body: 'The college will be closed from December 24 to January 2. Classes will resume on January 3, 2025. Happy Holidays!', author: 'Admin', date: '2024-12-10', tag: 'Holiday', isNew: false },
  ],

  timetable: [
    { time: '8:00 - 9:00',  mon: { subj: 'CS101', room: 'Room 101' }, tue: null,                                wed: { subj: 'CS101', room: 'Room 101' }, thu: null,                                fri: { subj: 'CS101', room: 'Room 101' } },
    { time: '9:00 - 10:00', mon: null,                                 tue: { subj: 'CS201', room: 'Room 205' }, wed: null,                                 thu: { subj: 'CS201', room: 'Room 205' }, fri: null },
    { time: '10:00 - 11:00',mon: { subj: 'CS301', room: 'Lab 3' },    tue: null,                                wed: null,                                  thu: { subj: 'CS301', room: 'Lab 3' },    fri: null },
    { time: '11:00 - 12:00',mon: null,                                 tue: { subj: 'CS302', room: 'Room 310' }, wed: { subj: 'CS302', room: 'Room 310' },  thu: null,                                fri: null },
    { time: '12:00 - 1:00', mon: 'break', tue: 'break', wed: 'break', thu: 'break', fri: 'break' },
    { time: '1:00 - 2:00',  mon: { subj: 'CS401', room: 'Room 402' }, tue: null,                                wed: { subj: 'CS401', room: 'Room 402' },  thu: null,                                fri: { subj: 'CS402', room: 'Room 501' } },
    { time: '2:00 - 3:00',  mon: null,                                 tue: { subj: 'CS402', room: 'Room 501' }, wed: null,                                 thu: { subj: 'CS402', room: 'Room 501' }, fri: null },
  ],

  students: [
    { id: 'STU2024001', name: 'Alex Johnson',  course: 'CS101', attendance: 92, gpa: 3.8, status: 'Active' },
    { id: 'STU2024002', name: 'Maria Garcia',  course: 'CS201', attendance: 87, gpa: 3.5, status: 'Active' },
    { id: 'STU2024003', name: 'David Lee',     course: 'CS301', attendance: 78, gpa: 3.2, status: 'Active' },
    { id: 'STU2024004', name: 'Sophie Brown',  course: 'CS101', attendance: 95, gpa: 3.9, status: 'Active' },
    { id: 'STU2024005', name: 'James Wilson',  course: 'CS201', attendance: 65, gpa: 2.8, status: 'Warning' },
    { id: 'STU2024006', name: 'Emma Davis',    course: 'CS301', attendance: 88, gpa: 3.6, status: 'Active' },
    { id: 'STU2024007', name: 'Liam Martinez', course: 'CS101', attendance: 91, gpa: 3.7, status: 'Active' },
    { id: 'STU2024008', name: 'Olivia Taylor', course: 'CS201', attendance: 72, gpa: 3.0, status: 'Active' },
  ],

  teacherGrades: {
    'CS101': [
      { id: 'STU2024001', name: 'Alex Johnson',  a1: 85, a2: 90, mid: 78, final: 88 },
      { id: 'STU2024004', name: 'Sophie Brown',  a1: 92, a2: 95, mid: 90, final: 94 },
      { id: 'STU2024007', name: 'Liam Martinez', a1: 78, a2: 82, mid: 75, final: 80 },
    ],
    'CS201': [
      { id: 'STU2024002', name: 'Maria Garcia',  a1: 80, a2: 85, mid: 82, final: 83 },
      { id: 'STU2024005', name: 'James Wilson',  a1: 65, a2: 70, mid: 62, final: 68 },
      { id: 'STU2024008', name: 'Olivia Taylor', a1: 74, a2: 78, mid: 72, final: 76 },
    ],
    'CS301': [
      { id: 'STU2024003', name: 'David Lee',     a1: 72, a2: 76, mid: 70, final: 75 },
      { id: 'STU2024006', name: 'Emma Davis',    a1: 88, a2: 90, mid: 85, final: 87 },
    ],
  },
};


/* ─── LOGIN PAGE LOGIC ──────────────────────────────────── */
let currentRole = 'student';

function switchRole(role) {
  currentRole = role;
  document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`[data-role="${role}"]`).classList.add('active');
  const labels = { student: 'Student ID', teacher: 'Teacher ID', admin: 'Admin ID' };
  const el = document.getElementById('userIdLabel');
  if (el) el.textContent = labels[role];
  const hints = { student: 'e.g. STU2024001', teacher: 'e.g. TCH001', admin: 'e.g. ADM001' };
  const input = document.getElementById('userId');
  if (input) input.placeholder = hints[role];
  const err = document.getElementById('loginError');
  if (err) err.classList.add('hidden');
}

function togglePassword() {
  const pw = document.getElementById('password');
  if (!pw) return;
  pw.type = pw.type === 'password' ? 'text' : 'password';
}

function fillDemo(role) {
  switchRole(role);
  const creds = { student: ['STU2024001', 'pass123'], teacher: ['TCH001', 'teach123'], admin: ['ADM001', 'admin123'] };
  const [id, pw] = creds[role];
  const idEl = document.getElementById('userId');
  const pwEl = document.getElementById('password');
  if (idEl) idEl.value = id;
  if (pwEl) pwEl.value = pw;
}

function handleLogin(e) {
  e.preventDefault();
  const id = document.getElementById('userId')?.value.trim();
  const pw = document.getElementById('password')?.value;
  const errEl = document.getElementById('loginError');
  const btnText = document.getElementById('loginBtnText');
  const spinner = document.getElementById('loginSpinner');

  if (btnText) btnText.textContent = 'Signing in...';
  if (spinner) spinner.classList.remove('hidden');

  setTimeout(() => {
    const user = DB.users[id];
    if (user && user.password === pw && user.role === currentRole) {
      sessionStorage.setItem('eduUser', JSON.stringify({ id, ...user }));
      if (user.role === 'student') window.location.href = 'student-dashboard.html';
      else if (user.role === 'teacher') window.location.href = 'teacher-dashboard.html';
      else if (user.role === 'admin') window.location.href = 'admin-dashboard.html';
    } else {
      if (btnText) btnText.textContent = 'Sign In';
      if (spinner) spinner.classList.add('hidden');
      if (errEl) errEl.classList.remove('hidden');
    }
  }, 800);
}

/* ─── SHARED DASHBOARD UTILITIES ───────────────────────── */
function getUser() {
  const u = sessionStorage.getItem('eduUser');
  if (!u) { window.location.href = 'index.html'; return null; }
  return JSON.parse(u);
}

function logout() {
  sessionStorage.removeItem('eduUser');
  window.location.href = 'index.html';
}

function showSection(name, linkEl) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const sec = document.getElementById(`sec-${name}`);
  if (sec) sec.classList.add('active');

  if (linkEl) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    linkEl.classList.add('active');
  } else {
    const matching = [...document.querySelectorAll('.nav-item')].find(n =>
      n.getAttribute('onclick')?.includes(`'${name}'`)
    );
    if (matching) {
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      matching.classList.add('active');
    }
  }

  const titles = { overview: 'Overview', assignments: 'Assignments', grades: 'Grades', attendance: 'Attendance', timetable: 'Timetable', announcements: 'Announcements', profile: 'My Profile', students: 'My Students' };
  const el = document.getElementById('pageTitle');
  if (el) el.textContent = titles[name] || name;
  return false;
}

function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('sidebarOverlay');
  sb?.classList.toggle('open');
  ov?.classList.toggle('open');
}

function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = `toast ${type}`;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 3000);
}

function closeModal(id) {
  document.getElementById(id)?.classList.add('hidden');
}

function openModal(id) {
  document.getElementById(id)?.classList.remove('hidden');
}

function formatDate(str) {
  return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getLetterGrade(pct) {
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 60) return 'C';
  if (pct >= 50) return 'D';
  return 'F';
}

function setTopbarDate() {
  const el = document.getElementById('topbarDate');
  if (!el) return;
  el.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}


/* ─── STUDENT DASHBOARD ─────────────────────────────────── */
function initStudentDashboard() {
  const user = getUser();
  if (!user || user.role !== 'student') { window.location.href = 'index.html'; return; }

  setTopbarDate();
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userAvatar').textContent = user.name[0];
  document.getElementById('welcomeMsg').textContent = `Welcome back, ${user.name.split(' ')[0]}! 👋`;

  const myAssigns = DB.studentAssignments[user.id] || [];
  const pending = myAssigns.filter(a => a.status === 'pending').length;
  document.getElementById('pendingCount').textContent = pending;
  document.getElementById('assignBadge').textContent = pending;
  if (pending === 0) document.getElementById('assignBadge')?.remove();

  renderOverviewAssignments(user.id);
  renderOverviewGrades(user.id);
  renderAnnouncementPreview();
  renderAllAssignments(user.id);
  renderGradesTable(user.id);
  renderAttendance(user.id);
  renderTimetable();
  renderAnnouncements();
  renderProfile(user);
}

function renderOverviewAssignments(uid) {
  const myAssigns = DB.studentAssignments[uid] || [];
  const pending = myAssigns.filter(a => a.status === 'pending').slice(0, 4);
  const container = document.getElementById('upcomingAssignments');
  if (!container) return;
  if (!pending.length) { container.innerHTML = '<p style="color:var(--text-muted);font-size:14px;padding:8px 0">No pending assignments 🎉</p>'; return; }
  container.innerHTML = pending.map(sa => {
    const a = DB.assignments.find(x => x.id === sa.assignId);
    if (!a) return '';
    const days = daysUntil(a.dueDate);
    const urgency = days <= 2 ? 'urgent' : days <= 5 ? 'soon' : '';
    return `<div class="assignment-item">
      <div class="assign-dot ${urgency}"></div>
      <div class="assign-info">
        <div class="assign-title">${a.title}</div>
        <div class="assign-meta">${a.courseCode}</div>
      </div>
      <div class="assign-due ${days <= 2 ? 'urgent' : ''}">${days < 0 ? 'Overdue' : days === 0 ? 'Today' : `${days}d left`}</div>
    </div>`;
  }).join('');
}

function renderOverviewGrades(uid) {
  const grades = (DB.grades[uid] || []).slice(0, 4);
  const container = document.getElementById('recentGrades');
  if (!container) return;
  container.innerHTML = grades.map(g => `
    <div class="grade-item">
      <div><div class="grade-course">${g.course}</div><div class="grade-code">${g.code}</div></div>
      <div class="grade-letter grade-${g.grade[0]}">${g.grade}</div>
    </div>`).join('');
}

function renderAnnouncementPreview() {
  const container = document.getElementById('announcementPreview');
  if (!container) return;
  container.innerHTML = DB.announcements.slice(0, 2).map(a => `
    <div class="ann-card" style="margin-bottom:12px">
      <div class="ann-header">
        <span class="ann-title">${a.title}</span>
        <span class="ann-tag ${a.isNew ? 'ann-tag-new' : ''}">${a.isNew ? 'New' : a.tag}</span>
      </div>
      <div class="ann-meta"><span>👤 ${a.author}</span><span>📅 ${formatDate(a.date)}</span></div>
      <div class="ann-body">${a.body.substring(0, 120)}...</div>
    </div>`).join('');
}

let assignFilter = 'all';
function filterAssignments(f, el) {
  assignFilter = f;
  document.querySelectorAll('#sec-assignments .filter-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const user = getUser();
  if (user) renderAllAssignments(user.id);
}

function renderAllAssignments(uid) {
  const myAssigns = DB.studentAssignments[uid] || [];
  const container = document.getElementById('assignmentsGrid');
  if (!container) return;
  let list = myAssigns;
  if (assignFilter !== 'all') list = myAssigns.filter(a => a.status === assignFilter);
  if (!list.length) { container.innerHTML = `<p style="color:var(--text-muted);font-size:14px;padding:20px 0">No assignments found.</p>`; return; }
  container.innerHTML = list.map(sa => {
    const a = DB.assignments.find(x => x.id === sa.assignId);
    if (!a) return '';
    const days = daysUntil(a.dueDate);
    const statusClass = { pending: 'status-pending', submitted: 'status-submitted', graded: 'status-graded' }[sa.status];
    const statusLabel = { pending: '⏳ Pending', submitted: '✅ Submitted', graded: `🏆 Graded: ${sa.grade}/${a.maxMarks}` }[sa.status];
    return `<div class="assign-card">
      <div class="assign-card-header">
        <div class="assign-card-title">${a.title}</div>
        <span class="status-badge ${statusClass}">${statusLabel}</span>
      </div>
      <div class="assign-card-course">📚 ${a.course} (${a.courseCode})</div>
      <div class="assign-card-desc">${a.desc}</div>
      ${sa.feedback ? `<div style="font-size:13px;color:#86efac;background:rgba(34,197,94,0.1);padding:8px 12px;border-radius:8px">💬 ${sa.feedback}</div>` : ''}
      <div class="assign-card-footer">
        <span class="assign-card-due">📅 Due: ${formatDate(a.dueDate)} ${days < 0 ? '(Overdue)' : days === 0 ? '(Today!)' : `(${days}d)`}</span>
        <span class="assign-card-marks">Max: ${a.maxMarks}</span>
      </div>
      ${sa.status === 'pending' ? `<button class="btn-primary" style="width:100%;margin-top:4px" onclick="openSubmitModal(${a.id})">📤 Submit</button>` : ''}
    </div>`;
  }).join('');
}

let currentSubmitId = null;
function openSubmitModal(assignId) {
  const a = DB.assignments.find(x => x.id === assignId);
  if (!a) return;
  currentSubmitId = assignId;
  document.getElementById('modalAssignTitle').textContent = `${a.title} — ${a.courseCode} (Max: ${a.maxMarks} marks)`;
  document.getElementById('submissionText').value = '';
  openModal('submitModal');
}

function submitAssignment() {
  const user = getUser();
  if (!user || !currentSubmitId) return;
  const text = document.getElementById('submissionText')?.value.trim();
  if (!text) { showToast('Please enter your submission.', 'error'); return; }
  const myAssigns = DB.studentAssignments[user.id] || [];
  const sa = myAssigns.find(a => a.assignId === currentSubmitId);
  if (sa) { sa.status = 'submitted'; sa.submittedText = text; }
  closeModal('submitModal');
  showToast('Assignment submitted successfully! ✅');
  renderAllAssignments(user.id);
  renderOverviewAssignments(user.id);
  const pending = myAssigns.filter(a => a.status === 'pending').length;
  document.getElementById('pendingCount').textContent = pending;
}


function renderGradesTable(uid) {
  const tbody = document.getElementById('gradesBody');
  if (!tbody) return;
  const grades = DB.grades[uid] || [];
  const totalCredits = grades.reduce((s, g) => s + g.credits, 0);
  const weightedSum = grades.reduce((s, g) => {
    const pts = { 'A+': 4.0, 'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0 };
    return s + (pts[g.grade] || 0) * g.credits;
  }, 0);
  const gpa = totalCredits ? (weightedSum / totalCredits).toFixed(2) : '0.00';
  document.getElementById('gpaDisplay') && (document.getElementById('gpaDisplay').textContent = gpa);
  document.getElementById('gpaCircle') && (document.getElementById('gpaCircle').textContent = gpa);
  tbody.innerHTML = grades.map(g => `<tr>
    <td>${g.course}</td>
    <td><span class="course-chip" style="padding:4px 10px;font-size:12px">${g.code}</span></td>
    <td>${g.credits}</td>
    <td>${g.marks}/100</td>
    <td class="grade-letter grade-${g.grade[0]}">${g.grade}</td>
    <td><span class="status-badge ${g.status === 'Pass' ? 'status-submitted' : 'status-urgent'}">${g.status}</span></td>
  </tr>`).join('');
}

function renderAttendance(uid) {
  const tbody = document.getElementById('attendanceBody');
  if (!tbody) return;
  const records = DB.attendance[uid] || [];
  let totalPresent = 0, totalClasses = 0;
  tbody.innerHTML = records.map(r => {
    const pct = Math.round((r.attended / r.total) * 100);
    totalPresent += r.attended; totalClasses += r.total;
    const color = pct >= 85 ? 'status-submitted' : pct >= 75 ? 'status-pending' : 'status-urgent';
    const label = pct >= 85 ? '✅ Good' : pct >= 75 ? '⚠️ Low' : '❌ Critical';
    return `<tr>
      <td>${r.subject} <span style="font-size:11px;color:var(--text-muted)">(${r.code})</span></td>
      <td>${r.total}</td>
      <td>${r.attended}</td>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <div class="grade-bar-wrapper" style="width:80px;margin:0"><div class="grade-bar" style="width:${pct}%"></div></div>
          <span style="font-size:13px;font-weight:600">${pct}%</span>
        </div>
      </td>
      <td><span class="status-badge ${color}">${label}</span></td>
    </tr>`;
  }).join('');
  const overallPct = totalClasses ? Math.round((totalPresent / totalClasses) * 100) : 0;
  const presEl = document.getElementById('presentCount');
  const absEl = document.getElementById('absentCount');
  if (presEl) presEl.textContent = overallPct + '%';
  if (absEl) absEl.textContent = (100 - overallPct) + '%';
  if (document.getElementById('attendanceDisplay')) document.getElementById('attendanceDisplay').textContent = overallPct + '%';
}

function renderTimetable() {
  const tbody = document.getElementById('timetableBody');
  if (!tbody) return;
  const days = ['mon', 'tue', 'wed', 'thu', 'fri'];
  tbody.innerHTML = DB.timetable.map(row => {
    const cells = days.map(d => {
      const cell = row[d];
      if (!cell) return '<td></td>';
      if (cell === 'break') return '<td class="tt-break">🍽 Lunch Break</td>';
      return `<td><div class="tt-cell"><span class="tt-subject">${cell.subj}</span><span class="tt-room">${cell.room}</span></div></td>`;
    }).join('');
    return `<tr><td style="font-weight:600;font-size:13px;white-space:nowrap;color:var(--text-muted)">${row.time}</td>${cells}</tr>`;
  }).join('');
}

function renderAnnouncements() {
  const container = document.getElementById('announcementsList');
  if (!container) return;
  const newCount = DB.announcements.filter(a => a.isNew).length;
  const annBadge = document.getElementById('annBadge');
  if (annBadge) { annBadge.textContent = newCount; if (!newCount) annBadge.remove(); }
  container.innerHTML = DB.announcements.map(a => `
    <div class="ann-card">
      <div class="ann-header">
        <span class="ann-title">${a.title}</span>
        <span class="ann-tag ${a.isNew ? 'ann-tag-new' : ''}">${a.isNew ? '🆕 New' : a.tag}</span>
      </div>
      <div class="ann-meta"><span>👤 ${a.author}</span><span>📅 ${formatDate(a.date)}</span></div>
      <div class="ann-body">${a.body}</div>
    </div>`).join('');
}

function renderProfile(user) {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('profileName', user.name);
  set('profileId', user.id);
  set('profileEmail', user.email);
  set('profileDept', user.dept);
  set('profileRoll', user.roll);
  const avEl = document.getElementById('profileAvatarLarge');
  if (avEl) avEl.textContent = user.name[0];
  const chips = document.getElementById('courseChips');
  if (chips) {
    const courses = ['CS101 – Data Structures', 'CS201 – Algorithms', 'CS301 – Database Systems', 'CS302 – Operating Systems', 'CS401 – Computer Networks', 'CS402 – Software Engineering'];
    chips.innerHTML = courses.map(c => `<div class="course-chip">${c}</div>`).join('');
  }
}


/* ─── TEACHER DASHBOARD ─────────────────────────────────── */
function initTeacherDashboard() {
  const user = getUser();
  if (!user || user.role !== 'teacher') { window.location.href = 'index.html'; return; }

  setTopbarDate();
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userAvatar').textContent = user.name[0];
  document.getElementById('welcomeMsg').textContent = `Good day, ${user.name.split(' ')[1] || user.name.split(' ')[0]}! 👋`;

  renderTeacherOverview();
  renderTeacherAssignments();
  renderStudentsTable();
  renderAttendanceMark();
  renderTeacherGrades();
  renderAnnouncements();
  renderTeacherProfile(user);

  const dateInput = document.getElementById('attendanceDate');
  if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
}

function renderTeacherOverview() {
  // Recent Submissions
  const subContainer = document.getElementById('recentSubmissions');
  if (subContainer) {
    const subs = [];
    Object.entries(DB.studentAssignments).forEach(([uid, assigns]) => {
      assigns.filter(a => a.status === 'submitted' || a.status === 'graded').forEach(sa => {
        const u = DB.users[uid];
        const a = DB.assignments.find(x => x.id === sa.assignId);
        if (u && a) subs.push({ name: u.name, assignTitle: a.title, status: sa.status, id: uid });
      });
    });
    subContainer.innerHTML = subs.slice(0, 5).map(s => `
      <div class="sub-item">
        <div class="sub-avatar">${s.name[0]}</div>
        <div class="sub-info">
          <div class="sub-name">${s.name}</div>
          <div class="sub-assign">${s.assignTitle}</div>
        </div>
        <span class="status-badge ${s.status === 'graded' ? 'status-graded' : 'status-submitted'}">${s.status === 'graded' ? '✅ Graded' : '📬 Submitted'}</span>
      </div>`).join('') || '<p style="color:var(--text-muted);font-size:14px">No submissions yet.</p>';
  }

  // Today's Classes
  const classContainer = document.getElementById('todaysClasses');
  if (classContainer) {
    const today = ['mon', 'tue', 'wed', 'thu', 'fri'][new Date().getDay() - 1] || 'mon';
    const classes = DB.timetable.filter(r => r[today] && r[today] !== 'break').map(r => ({ time: r.time, ...r[today] }));
    classContainer.innerHTML = classes.length ? classes.map(c => `
      <div class="class-item">
        <span class="class-time">⏰ ${c.time.split(' - ')[0]}</span>
        <div class="class-info">
          <div class="class-name">${c.subj}</div>
          <div class="class-room">📍 ${c.room}</div>
        </div>
      </div>`).join('') : '<p style="color:var(--text-muted);font-size:14px">No classes today.</p>';
  }

  // Class Performance
  const perfContainer = document.getElementById('classPerformance');
  if (perfContainer) {
    const courses = [
      { name: 'CS101 – Data Structures', avg: 84 },
      { name: 'CS201 – Algorithms',      avg: 76 },
      { name: 'CS301 – Database Systems',avg: 81 },
    ];
    perfContainer.innerHTML = `<div class="perf-grid">${courses.map(c => `
      <div class="perf-card">
        <div class="perf-course">${c.name}</div>
        <div class="perf-bar-wrap"><div class="perf-bar" style="width:${c.avg}%"></div></div>
        <div class="perf-pct">Class Avg: ${c.avg}%</div>
      </div>`).join('')}</div>`;
  }
}

let teacherAssignFilter = 'all';
function filterTeacherAssignments(f, el) {
  teacherAssignFilter = f;
  document.querySelectorAll('#sec-assignments .filter-tab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');
  renderTeacherAssignments();
}

function renderTeacherAssignments() {
  const container = document.getElementById('teacherAssignmentsGrid');
  if (!container) return;
  let list = DB.assignments;
  if (teacherAssignFilter !== 'all') list = DB.assignments.filter(a => a.status === teacherAssignFilter);
  container.innerHTML = list.map(a => {
    const totalSubs = Object.values(DB.studentAssignments).reduce((cnt, arr) => cnt + arr.filter(sa => sa.assignId === a.id && sa.status !== 'pending').length, 0);
    const graded = Object.values(DB.studentAssignments).reduce((cnt, arr) => cnt + arr.filter(sa => sa.assignId === a.id && sa.status === 'graded').length, 0);
    const priorityClass = { high: 'status-pending', urgent: 'status-urgent', normal: 'status-submitted' }[a.priority];
    return `<div class="assign-card">
      <div class="assign-card-header">
        <div class="assign-card-title">${a.title}</div>
        <span class="status-badge ${a.status === 'active' ? 'status-active' : 'status-closed'}">${a.status === 'active' ? '🟢 Active' : '🔒 Closed'}</span>
      </div>
      <div class="assign-card-course">📚 ${a.course} (${a.courseCode})</div>
      <div class="assign-card-desc">${a.desc.substring(0, 100)}...</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <span class="status-badge status-submitted">📬 ${totalSubs} Submitted</span>
        <span class="status-badge status-graded">✅ ${graded} Graded</span>
        <span class="status-badge ${priorityClass}">🔖 ${a.priority}</span>
      </div>
      <div class="assign-card-footer">
        <span class="assign-card-due">📅 Due: ${formatDate(a.dueDate)}</span>
        <span class="assign-card-marks">Max: ${a.maxMarks}</span>
      </div>
      <div style="display:flex;gap:8px;margin-top:8px">
        <button class="btn-outline" style="flex:1" onclick="viewSubmissions(${a.id})">📥 View Submissions</button>
      </div>
    </div>`;
  }).join('');
}

function viewSubmissions(assignId) {
  const a = DB.assignments.find(x => x.id === assignId);
  if (!a) return;
  const subs = [];
  Object.entries(DB.studentAssignments).forEach(([uid, arr]) => {
    const sa = arr.find(x => x.assignId === assignId);
    if (sa && sa.status !== 'pending') {
      const u = DB.users[uid];
      subs.push({ uid, name: u?.name || uid, sa, a });
    }
  });
  if (!subs.length) { showToast('No submissions yet.', 'error'); return; }
  openGradeModal(subs[0].uid, assignId);
}

let gradeContext = null;
function openGradeModal(uid, assignId) {
  const a = DB.assignments.find(x => x.id === assignId);
  const u = DB.users[uid];
  const myAssigns = DB.studentAssignments[uid] || [];
  const sa = myAssigns.find(x => x.assignId === assignId);
  if (!a || !u || !sa) return;
  gradeContext = { uid, assignId };
  document.getElementById('gradeModalInfo').textContent = `${u.name} — ${a.title}`;
  document.getElementById('maxMarksLabel').textContent = a.maxMarks;
  document.getElementById('submissionPreview').textContent = sa.submittedText || 'No text submission.';
  document.getElementById('gradeScore').value = sa.grade || '';
  document.getElementById('gradeFeedback').value = sa.feedback || '';
  openModal('gradeModal');
}

function saveGrade() {
  if (!gradeContext) return;
  const { uid, assignId } = gradeContext;
  const score = parseInt(document.getElementById('gradeScore')?.value);
  const feedback = document.getElementById('gradeFeedback')?.value || '';
  const a = DB.assignments.find(x => x.id === assignId);
  if (isNaN(score) || score < 0 || score > a.maxMarks) { showToast(`Score must be 0–${a.maxMarks}`, 'error'); return; }
  const myAssigns = DB.studentAssignments[uid] || [];
  const sa = myAssigns.find(x => x.assignId === assignId);
  if (sa) { sa.grade = score; sa.feedback = feedback; sa.status = 'graded'; }
  closeModal('gradeModal');
  showToast('Grade saved successfully! ✅');
  renderTeacherAssignments();
}

function openCreateAssignment() { openModal('createAssignmentModal'); }

function createAssignment() {
  const title = document.getElementById('newAssignTitle')?.value.trim();
  const course = document.getElementById('newAssignCourse')?.value;
  const due = document.getElementById('newAssignDue')?.value;
  const marks = parseInt(document.getElementById('newAssignMarks')?.value) || 100;
  const desc = document.getElementById('newAssignDesc')?.value.trim();
  const priority = document.getElementById('newAssignPriority')?.value || 'normal';
  if (!title || !due || !desc) { showToast('Please fill all required fields.', 'error'); return; }
  const newId = DB.assignments.length + 1;
  DB.assignments.push({ id: newId, title, course: course.split(' – ')[1] || course, courseCode: course, dueDate: due, maxMarks: marks, desc, priority, status: 'active', createdBy: 'TCH001', submissions: [] });
  closeModal('createAssignmentModal');
  showToast('Assignment posted successfully! 📋');
  renderTeacherAssignments();
  document.getElementById('activeAssignCount') && (document.getElementById('activeAssignCount').textContent = DB.assignments.filter(a => a.status === 'active').length);
}

function openCreateAnnouncement() { openModal('createAnnouncementModal'); }

function postAnnouncement() {
  const title = document.getElementById('newAnnTitle')?.value.trim();
  const body = document.getElementById('newAnnMessage')?.value.trim();
  if (!title || !body) { showToast('Please fill title and message.', 'error'); return; }
  DB.announcements.unshift({ id: DB.announcements.length + 1, title, body, author: getUser()?.name || 'Teacher', date: new Date().toISOString().split('T')[0], tag: 'Notice', isNew: true });
  closeModal('createAnnouncementModal');
  showToast('Announcement posted! 📣');
  renderAnnouncements();
}

function renderStudentsTable(query = '') {
  const tbody = document.getElementById('studentsBody');
  if (!tbody) return;
  const list = DB.students.filter(s => !query || s.name.toLowerCase().includes(query.toLowerCase()) || s.id.includes(query));
  tbody.innerHTML = list.map(s => `<tr>
    <td><div style="display:flex;align-items:center;gap:10px"><div class="sub-avatar">${s.name[0]}</div>${s.name}</div></td>
    <td style="color:var(--text-muted);font-size:13px">${s.id}</td>
    <td><span class="course-chip" style="padding:4px 10px;font-size:12px">${s.course}</span></td>
    <td>
      <div style="display:flex;align-items:center;gap:8px">
        <div class="grade-bar-wrapper" style="width:60px;margin:0"><div class="grade-bar" style="width:${s.attendance}%"></div></div>
        <span style="font-size:13px">${s.attendance}%</span>
      </div>
    </td>
    <td style="font-weight:600">${s.gpa}</td>
    <td><span class="status-badge ${s.status === 'Active' ? 'status-submitted' : 'status-urgent'}">${s.status}</span></td>
  </tr>`).join('');
}

function filterStudents() {
  const q = document.getElementById('studentSearch')?.value || '';
  renderStudentsTable(q);
}

function renderAttendanceMark() {
  const tbody = document.getElementById('attendanceMarkBody');
  if (!tbody) return;
  tbody.innerHTML = DB.students.map((s, i) => `<tr>
    <td>${i + 1}</td>
    <td>${s.name}</td>
    <td style="color:var(--text-muted);font-size:13px">${s.id}</td>
    <td>
      <div class="attend-radio">
        <button class="attend-btn present selected" id="att-p-${s.id}" onclick="setAttend('${s.id}', 'present')">✅ Present</button>
        <button class="attend-btn absent" id="att-a-${s.id}" onclick="setAttend('${s.id}', 'absent')">❌ Absent</button>
      </div>
    </td>
  </tr>`).join('');
}

function setAttend(sid, status) {
  const pBtn = document.getElementById(`att-p-${sid}`);
  const aBtn = document.getElementById(`att-a-${sid}`);
  if (status === 'present') { pBtn?.classList.add('selected'); aBtn?.classList.remove('selected'); }
  else { aBtn?.classList.add('selected'); pBtn?.classList.remove('selected'); }
}

function markAllPresent() { DB.students.forEach(s => setAttend(s.id, 'present')); }
function markAllAbsent()  { DB.students.forEach(s => setAttend(s.id, 'absent')); }
function saveAttendance() { showToast('Attendance saved successfully! 📅'); }

function loadAttendance() { renderAttendanceMark(); }

function renderTeacherGrades() {
  const tbody = document.getElementById('gradesManageBody');
  if (!tbody) return;
  const course = document.getElementById('gradesCourse')?.value || 'CS101';
  const students = DB.teacherGrades[course] || [];
  tbody.innerHTML = students.map(s => {
    const total = Math.round((s.a1 + s.a2 + s.mid + s.final) / 4);
    return `<tr>
      <td><div style="display:flex;align-items:center;gap:10px"><div class="sub-avatar">${s.name[0]}</div>${s.name}</div></td>
      <td style="color:var(--text-muted);font-size:13px">${s.id}</td>
      <td><input type="number" value="${s.a1}" min="0" max="100" style="width:60px;padding:6px;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-size:13px" onchange="updateGrade('${course}','${s.id}','a1',this.value)" /></td>
      <td><input type="number" value="${s.a2}" min="0" max="100" style="width:60px;padding:6px;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-size:13px" onchange="updateGrade('${course}','${s.id}','a2',this.value)" /></td>
      <td><input type="number" value="${s.mid}" min="0" max="100" style="width:60px;padding:6px;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-size:13px" onchange="updateGrade('${course}','${s.id}','mid',this.value)" /></td>
      <td><input type="number" value="${s.final}" min="0" max="100" style="width:60px;padding:6px;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-size:13px" onchange="updateGrade('${course}','${s.id}','final',this.value)" /></td>
      <td style="font-weight:600">${total}</td>
      <td class="grade-letter grade-${getLetterGrade(total)[0]}">${getLetterGrade(total)}</td>
    </tr>`;
  }).join('');
}

function updateGrade(course, sid, field, val) {
  const students = DB.teacherGrades[course] || [];
  const s = students.find(x => x.id === sid);
  if (s) s[field] = parseInt(val) || 0;
  showToast('Grade updated! 💾');
}

function loadGrades() { renderTeacherGrades(); }

function renderTeacherProfile(user) {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('profileName', user.name);
  set('profileId', user.id);
  set('profileEmail', user.email);
  set('profileRoll', user.id);
  const av = document.getElementById('profileAvatarLarge');
  if (av) av.textContent = user.name[0];
  const chips = document.getElementById('courseChips');
  if (chips) {
    const courses = ['CS101 – Data Structures', 'CS201 – Algorithms', 'CS301 – Database Systems'];
    chips.innerHTML = courses.map(c => `<div class="course-chip">${c}</div>`).join('');
  }
}

/* ─── PAGE INIT (see bottom of file for updated version) ── */



/* ─── ADMIN DASHBOARD ───────────────────────────────────── */
const adminData = {
  students: [
    { id: 'STU2024001', name: 'Alex Johnson',  dept: 'Computer Science', attendance: 92, gpa: 3.8, status: 'Active' },
    { id: 'STU2024002', name: 'Maria Garcia',  dept: 'Computer Science', attendance: 87, gpa: 3.5, status: 'Active' },
    { id: 'STU2024003', name: 'David Lee',     dept: 'Computer Science', attendance: 78, gpa: 3.2, status: 'Active' },
    { id: 'STU2024004', name: 'Sophie Brown',  dept: 'Mathematics',      attendance: 95, gpa: 3.9, status: 'Active' },
    { id: 'STU2024005', name: 'James Wilson',  dept: 'Computer Science', attendance: 65, gpa: 2.8, status: 'Warning' },
    { id: 'STU2024006', name: 'Emma Davis',    dept: 'Computer Science', attendance: 88, gpa: 3.6, status: 'Active' },
    { id: 'STU2024007', name: 'Liam Martinez', dept: 'Physics',          attendance: 91, gpa: 3.7, status: 'Active' },
    { id: 'STU2024008', name: 'Olivia Taylor', dept: 'Mathematics',      attendance: 72, gpa: 3.0, status: 'Active' },
  ],
  teachers: [
    { id: 'TCH001', name: 'Dr. Emily Carter', dept: 'Computer Science', desig: 'Assistant Professor', courses: 3, status: 'Active' },
    { id: 'TCH002', name: 'Prof. Alan Grant',  dept: 'Mathematics',      desig: 'Professor',           courses: 2, status: 'Active' },
    { id: 'TCH003', name: 'Dr. Sarah Connor',  dept: 'Physics',          desig: 'Associate Professor', courses: 4, status: 'Active' },
    { id: 'TCH004', name: 'Mr. Bruce Wayne',   dept: 'Computer Science', desig: 'Lecturer',            courses: 2, status: 'Active' },
  ],
  courses: [
    { code: 'CS101', name: 'Data Structures',   dept: 'Computer Science', credits: 4, teacher: 'Dr. Emily Carter', students: 48, status: 'Active' },
    { code: 'CS201', name: 'Algorithms',         dept: 'Computer Science', credits: 4, teacher: 'Dr. Emily Carter', students: 45, status: 'Active' },
    { code: 'CS301', name: 'Database Systems',   dept: 'Computer Science', credits: 3, teacher: 'Dr. Emily Carter', students: 40, status: 'Active' },
    { code: 'CS302', name: 'Operating Systems',  dept: 'Computer Science', credits: 3, teacher: 'Mr. Bruce Wayne',  students: 42, status: 'Active' },
    { code: 'MA101', name: 'Calculus I',         dept: 'Mathematics',      credits: 4, teacher: 'Prof. Alan Grant',  students: 55, status: 'Active' },
    { code: 'PH101', name: 'Physics I',          dept: 'Physics',          credits: 4, teacher: 'Dr. Sarah Connor',  students: 50, status: 'Active' },
  ],
};

function initAdminDashboard() {
  const user = getUser();
  if (!user || user.role !== 'admin') { window.location.href = 'index.html'; return; }

  setTopbarDate();
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userAvatar').textContent = user.name[0];
  document.getElementById('welcomeMsg').textContent = `Welcome, ${user.name.split(' ')[0]}! 🛡️`;

  renderRecentActivity();
  renderAdminStudents();
  renderAdminTeachers();
  renderAdminCourses();
  renderAnnouncements();
  renderReports();
}

function renderRecentActivity() {
  const container = document.getElementById('recentActivity');
  if (!container) return;
  const activities = [
    { icon: '📋', text: 'New assignment posted by Dr. Emily Carter', time: '2 mins ago' },
    { icon: '🎒', text: 'Student STU2024009 enrolled in CS101',       time: '15 mins ago' },
    { icon: '📣', text: 'Announcement: Exam schedule published',      time: '1 hour ago' },
    { icon: '✅', text: 'Attendance marked for CS201 — Tue class',    time: '2 hours ago' },
    { icon: '🏆', text: 'Grades updated for CS301 by Dr. Carter',     time: '3 hours ago' },
  ];
  container.innerHTML = activities.map(a => `
    <div class="sub-item">
      <div class="sub-avatar" style="background:var(--surface2);font-size:18px">${a.icon}</div>
      <div class="sub-info">
        <div class="sub-name" style="font-size:13px">${a.text}</div>
        <div class="sub-assign">${a.time}</div>
      </div>
    </div>`).join('');
}

function renderAdminStudents(query = '') {
  const tbody = document.getElementById('adminStudentsBody');
  if (!tbody) return;
  const list = adminData.students.filter(s =>
    !query || s.name.toLowerCase().includes(query.toLowerCase()) || s.id.includes(query)
  );
  tbody.innerHTML = list.map(s => `<tr>
    <td><div style="display:flex;align-items:center;gap:10px">
      <div class="sub-avatar">${s.name[0]}</div>${s.name}
    </div></td>
    <td style="color:var(--text-muted);font-size:13px">${s.id}</td>
    <td>${s.dept}</td>
    <td>
      <div style="display:flex;align-items:center;gap:8px">
        <div class="grade-bar-wrapper" style="width:60px;margin:0"><div class="grade-bar" style="width:${s.attendance}%"></div></div>
        <span style="font-size:13px">${s.attendance}%</span>
      </div>
    </td>
    <td style="font-weight:600">${s.gpa}</td>
    <td><span class="status-badge ${s.status === 'Active' ? 'status-submitted' : 'status-urgent'}">${s.status}</span></td>
    <td>
      <button class="btn-outline" onclick="removeStudent('${s.id}')">🗑 Remove</button>
    </td>
  </tr>`).join('');
}

function adminFilterStudents() {
  const q = document.getElementById('adminStudentSearch')?.value || '';
  renderAdminStudents(q);
}

function renderAdminTeachers() {
  const tbody = document.getElementById('adminTeachersBody');
  if (!tbody) return;
  tbody.innerHTML = adminData.teachers.map(t => `<tr>
    <td><div style="display:flex;align-items:center;gap:10px">
      <div class="sub-avatar" style="background:linear-gradient(135deg,#059669,#0d9488)">${t.name[0]}</div>${t.name}
    </div></td>
    <td style="color:var(--text-muted);font-size:13px">${t.id}</td>
    <td>${t.dept}</td>
    <td>${t.desig}</td>
    <td>${t.courses}</td>
    <td><span class="status-badge status-submitted">✅ ${t.status}</span></td>
    <td><button class="btn-outline" onclick="removeTeacher('${t.id}')">🗑 Remove</button></td>
  </tr>`).join('');
}

function renderAdminCourses() {
  const container = document.getElementById('coursesGrid');
  if (!container) return;
  container.innerHTML = adminData.courses.map(c => `
    <div class="assign-card">
      <div class="assign-card-header">
        <div class="assign-card-title">${c.name}</div>
        <span class="status-badge status-active">🟢 ${c.status}</span>
      </div>
      <div class="assign-card-course">🏷️ ${c.code} &nbsp;|&nbsp; ${c.dept}</div>
      <div style="font-size:13px;color:var(--text-muted)">👨‍🏫 ${c.teacher}</div>
      <div class="assign-card-footer">
        <span class="assign-card-due">🎒 ${c.students} students</span>
        <span class="assign-card-marks">${c.credits} credits</span>
      </div>
      <button class="btn-outline" style="width:100%;margin-top:8px" onclick="removeCourse('${c.code}')">🗑 Remove Course</button>
    </div>`).join('');
}

function renderReports() {
  const gradeEl = document.getElementById('gradeDistribution');
  if (gradeEl) {
    const grades = [{ g: 'A', pct: 42, color: '#22c55e' }, { g: 'B', pct: 31, color: '#38bdf8' }, { g: 'C', pct: 17, color: '#eab308' }, { g: 'D', pct: 7, color: '#f97316' }, { g: 'F', pct: 3, color: '#ef4444' }];
    gradeEl.innerHTML = grades.map(g => `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
        <span style="font-weight:700;width:20px;color:${g.color}">${g.g}</span>
        <div class="grade-bar-wrapper" style="flex:1;margin:0"><div class="grade-bar" style="width:${g.pct}%;background:${g.color}"></div></div>
        <span style="font-size:13px;font-weight:600;width:36px">${g.pct}%</span>
      </div>`).join('');
  }

  const attEl = document.getElementById('attendanceReport');
  if (attEl) {
    const depts = [{ name: 'Computer Science', pct: 89 }, { name: 'Mathematics', pct: 85 }, { name: 'Physics', pct: 82 }];
    attEl.innerHTML = depts.map(d => `
      <div style="margin-bottom:16px">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px">
          <span>${d.name}</span><span style="font-weight:600">${d.pct}%</span>
        </div>
        <div class="grade-bar-wrapper" style="margin:0"><div class="grade-bar" style="width:${d.pct}%"></div></div>
      </div>`).join('');
  }
}

function openAddStudentModal() { openModal('addStudentModal'); }
function openAddTeacherModal() { openModal('addTeacherModal'); }
function openAddCourseModal()  { openModal('addCourseModal'); }
function openCreateAnnouncement() { openModal('createAnnouncementModal'); }

function addStudent() {
  const name  = document.getElementById('newStudentName')?.value.trim();
  const id    = document.getElementById('newStudentId')?.value.trim();
  const dept  = document.getElementById('newStudentDept')?.value;
  const email = document.getElementById('newStudentEmail')?.value.trim();
  if (!name || !id || !email) { showToast('Please fill all required fields.', 'error'); return; }
  adminData.students.push({ id, name, dept, attendance: 0, gpa: 0.0, status: 'Active' });
  closeModal('addStudentModal');
  showToast(`Student ${name} added! 🎒`);
  renderAdminStudents();
}

function addTeacher() {
  const name  = document.getElementById('newTeacherName')?.value.trim();
  const id    = document.getElementById('newTeacherId')?.value.trim();
  const dept  = document.getElementById('newTeacherDept')?.value;
  const desig = document.getElementById('newTeacherDesig')?.value;
  const email = document.getElementById('newTeacherEmail')?.value.trim();
  if (!name || !id || !email) { showToast('Please fill all required fields.', 'error'); return; }
  adminData.teachers.push({ id, name, dept, desig, courses: 0, status: 'Active' });
  closeModal('addTeacherModal');
  showToast(`Teacher ${name} added! 👨‍🏫`);
  renderAdminTeachers();
}

function addCourse() {
  const name    = document.getElementById('newCourseName')?.value.trim();
  const code    = document.getElementById('newCourseCode')?.value.trim();
  const dept    = document.getElementById('newCourseDept')?.value;
  const credits = document.getElementById('newCourseCredits')?.value || 3;
  const teacher = document.getElementById('newCourseTeacher')?.value;
  if (!name || !code) { showToast('Please fill all required fields.', 'error'); return; }
  adminData.courses.push({ code, name, dept, credits: parseInt(credits), teacher: 'Dr. Emily Carter', students: 0, status: 'Active' });
  closeModal('addCourseModal');
  showToast(`Course ${name} added! 📚`);
  renderAdminCourses();
}

function postAnnouncement() {
  const title = document.getElementById('newAnnTitle')?.value.trim();
  const body  = document.getElementById('newAnnMessage')?.value.trim();
  if (!title || !body) { showToast('Please fill title and message.', 'error'); return; }
  DB.announcements.unshift({ id: DB.announcements.length + 1, title, body, author: 'Admin', date: new Date().toISOString().split('T')[0], tag: 'Notice', isNew: true });
  closeModal('createAnnouncementModal');
  showToast('Announcement posted! 📣');
  renderAnnouncements();
}

function removeStudent(id) {
  const idx = adminData.students.findIndex(s => s.id === id);
  if (idx !== -1) adminData.students.splice(idx, 1);
  showToast('Student removed.');
  renderAdminStudents();
}

function removeTeacher(id) {
  const idx = adminData.teachers.findIndex(t => t.id === id);
  if (idx !== -1) adminData.teachers.splice(idx, 1);
  showToast('Teacher removed.');
  renderAdminTeachers();
}

function removeCourse(code) {
  const idx = adminData.courses.findIndex(c => c.code === code);
  if (idx !== -1) adminData.courses.splice(idx, 1);
  showToast('Course removed.');
  renderAdminCourses();
}

/* ─── PAGE INIT (updated) ───────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  if (path.includes('student-dashboard')) initStudentDashboard();
  else if (path.includes('teacher-dashboard')) initTeacherDashboard();
  else if (path.includes('admin-dashboard')) initAdminDashboard();
});
