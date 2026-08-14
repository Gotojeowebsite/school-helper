/**
 * AcademiaPro — Sophisticated Academic Organizer & Workspace
 * Unbreakable Client-Side Local Storage Architecture with Instant Persistence,
 * Clean Zero-State for New Users, Full Offline Capability & Google Sites Embed Compatibility.
 */

(function() {
  'use strict';

  // Primary Storage Keys
  const PRIMARY_STORAGE_KEY = 'academia_pro_data_v2';
  const BACKUP_STORAGE_KEY = 'academia_pro_backup_v2';
  const FIREBASE_CONFIG_KEY = 'academia_firebase_config_v1';

  // Available Subject Color Palettes
  const SUBJECT_COLORS = [
    '#4f46e5', // Indigo
    '#3b82f6', // Blue
    '#0ea5e9', // Cyan
    '#10b981', // Emerald
    '#14b8a6', // Teal
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#f59e0b', // Amber
    '#f97316', // Orange
    '#ef4444', // Rose/Red
  ];

  const AVATAR_PALETTES = [
    'linear-gradient(135deg, #4f46e5, #3b82f6)',
    'linear-gradient(135deg, #10b981, #06b6d4)',
    'linear-gradient(135deg, #8b5cf6, #ec4899)',
    'linear-gradient(135deg, #f59e0b, #ef4444)',
    'linear-gradient(135deg, #0ea5e9, #6366f1)',
    'linear-gradient(135deg, #14b8a6, #3b82f6)',
    'linear-gradient(135deg, #f97316, #eab308)',
    'linear-gradient(135deg, #ec4899, #8b5cf6)'
  ];

  // --- SAFE RESILIENT STORAGE ENGINE ---
  const StorageSafe = {
    _memory: {},
    getItem(key) {
      try {
        if (typeof localStorage !== 'undefined') {
          const item = localStorage.getItem(key);
          if (item !== null) return item;
        }
      } catch (e) {
        console.warn('Storage read warning:', e);
      }
      return this._memory[key] || null;
    },
    setItem(key, value) {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(key, value);
        }
      } catch (e) {
        console.warn('Storage write warning:', e);
      }
      this._memory[key] = value;
    },
    removeItem(key) {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(key);
        }
      } catch (e) {}
      delete this._memory[key];
    }
  };

  // Helper: Relative ISO date generator
  function getRelativeDate(daysOffset, timeString = '23:59') {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    if (!timeString) return `${year}-${month}-${day}`;
    return `${year}-${month}-${day}T${timeString}:00`;
  }

  // Initial Empty Dataset for New Users (Starts from ZERO)
  function getEmptyInitialData(studentName = 'Student', schoolName = '') {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const termName = currentMonth >= 7 && currentMonth <= 11 ? `Fall ${currentYear}` : `Spring ${currentYear}`;

    return {
      settings: {
        activeSemesterId: 'sem-current',
        theme: 'light',
        scheduleMode: 'standard',
        currentCycleDay: 'A',
        studentName: studentName || 'Student',
        schoolName: schoolName || '',
        avatarColor: AVATAR_PALETTES[0],
        notificationsEnabled: false,
        isProfileConfigured: false,
      },
      semesters: [
        {
          id: 'sem-current',
          name: termName,
          startDate: `${currentYear}-01-01`,
          endDate: `${currentYear}-12-31`,
          isActive: true,
        }
      ],
      classes: [],       // COMPLETELY EMPTY FOR NEW USERS
      schedule: [],      // COMPLETELY EMPTY FOR NEW USERS
      assignments: [],   // COMPLETELY EMPTY FOR NEW USERS
      exams: []          // COMPLETELY EMPTY FOR NEW USERS
    };
  }

  // Optional Sample Dataset for Testing / Demo (Only loaded when explicitly requested)
  function getSampleDemoData(studentName = 'Alex Morgan', schoolName = 'Westwood Academy') {
    return {
      settings: {
        activeSemesterId: 'sem-demo',
        theme: 'light',
        scheduleMode: 'standard',
        currentCycleDay: 'A',
        studentName: studentName,
        schoolName: schoolName,
        avatarColor: AVATAR_PALETTES[0],
        notificationsEnabled: false,
        isProfileConfigured: true,
      },
      semesters: [
        {
          id: 'sem-demo',
          name: 'Fall Term',
          startDate: getRelativeDate(-30, '').split('T')[0],
          endDate: getRelativeDate(90, '').split('T')[0],
          isActive: true,
        }
      ],
      classes: [
        {
          id: 'cls-calc',
          semesterId: 'sem-demo',
          name: 'AP Calculus BC',
          code: 'MATH 302',
          teacher: 'Dr. Thorne',
          teacherEmail: 'thorne@school.edu',
          room: 'Hall 304',
          color: '#4f46e5',
          credits: 4,
          gradeCategories: [
            { id: 'gc-calc-hw', name: 'Homework', weight: 25 },
            { id: 'gc-calc-quiz', name: 'Quizzes', weight: 25 },
            { id: 'gc-calc-exam', name: 'Unit Exams', weight: 30 },
            { id: 'gc-calc-final', name: 'Final Exam', weight: 20 }
          ],
          notes: 'Office hours Tuesdays 3:30 PM'
        },
        {
          id: 'cls-bio',
          semesterId: 'sem-demo',
          name: 'Advanced Biology',
          code: 'BIO 201',
          teacher: 'Prof. Vance',
          teacherEmail: 'vance@school.edu',
          room: 'Bio Lab 2',
          color: '#10b981',
          credits: 4,
          gradeCategories: [
            { id: 'gc-bio-lab', name: 'Lab Reports', weight: 35 },
            { id: 'gc-bio-hw', name: 'Problem Sets', weight: 20 },
            { id: 'gc-bio-tests', name: 'Exams', weight: 45 }
          ],
          notes: 'Lab safety goggles required'
        },
        {
          id: 'cls-lit',
          semesterId: 'sem-demo',
          name: 'World Literature',
          code: 'ENG 115',
          teacher: 'Ms. Higgins',
          teacherEmail: 'higgins@school.edu',
          room: 'Humanities 112',
          color: '#8b5cf6',
          credits: 3,
          gradeCategories: [
            { id: 'gc-lit-essays', name: 'Essays', weight: 50 },
            { id: 'gc-lit-read', name: 'Reading Journals', weight: 25 },
            { id: 'gc-lit-pres', name: 'Seminars', weight: 25 }
          ],
          notes: 'MLA 9th Edition format'
        },
        {
          id: 'cls-cs',
          semesterId: 'sem-demo',
          name: 'Computer Science',
          code: 'CS 210',
          teacher: 'Mr. Zhang',
          teacherEmail: 'zhang@school.edu',
          room: 'Turing Lab A',
          color: '#0ea5e9',
          credits: 3,
          gradeCategories: [
            { id: 'gc-cs-proj', name: 'Projects', weight: 50 },
            { id: 'gc-cs-labs', name: 'Weekly Labs', weight: 25 },
            { id: 'gc-cs-exam', name: 'Exams', weight: 25 }
          ],
          notes: 'GitHub autograder'
        }
      ],
      schedule: [
        { id: 'sch-1', classId: 'cls-calc', dayOfWeek: 1, startTime: '09:00', endTime: '10:15', room: '304', scheduleType: 'all' },
        { id: 'sch-2', classId: 'cls-calc', dayOfWeek: 3, startTime: '09:00', endTime: '10:15', room: '304', scheduleType: 'all' },
        { id: 'sch-3', classId: 'cls-calc', dayOfWeek: 5, startTime: '09:00', endTime: '10:15', room: '304', scheduleType: 'all' },
        { id: 'sch-4', classId: 'cls-bio', dayOfWeek: 2, startTime: '09:30', endTime: '11:00', room: 'Lab 2', scheduleType: 'all' },
        { id: 'sch-5', classId: 'cls-bio', dayOfWeek: 4, startTime: '09:30', endTime: '11:00', room: 'Lab 2', scheduleType: 'all' },
        { id: 'sch-6', classId: 'cls-lit', dayOfWeek: 1, startTime: '10:45', endTime: '12:00', room: '112', scheduleType: 'all' },
        { id: 'sch-7', classId: 'cls-lit', dayOfWeek: 3, startTime: '10:45', endTime: '12:00', room: '112', scheduleType: 'all' },
        { id: 'sch-8', classId: 'cls-cs', dayOfWeek: 2, startTime: '13:00', endTime: '14:30', room: 'Lab A', scheduleType: 'all' },
        { id: 'sch-9', classId: 'cls-cs', dayOfWeek: 4, startTime: '13:00', endTime: '14:30', room: 'Lab A', scheduleType: 'all' }
      ],
      assignments: [
        {
          id: 'asg-1',
          semesterId: 'sem-demo',
          classId: 'cls-calc',
          title: 'Taylor Series Convergence Problem Set',
          description: 'Questions #1-20 from Chapter 9. Ratio tests and radius of convergence.',
          type: 'homework',
          dueDate: getRelativeDate(1, '23:59'),
          priority: 'high',
          status: 'in-progress',
          completionPercentage: 50,
          gradeCategoryId: 'gc-calc-hw',
          scoreEarned: null,
          maxScore: 100,
          subtasks: [
            { id: 'st-1', title: 'Problems 1-10: Ratio Test', isCompleted: true },
            { id: 'st-2', title: 'Problems 11-20: Radius calculations', isCompleted: false }
          ],
          notes: ''
        },
        {
          id: 'asg-2',
          semesterId: 'sem-demo',
          classId: 'cls-bio',
          title: 'Cellular Respiration Formal Lab Report',
          description: '4-page lab writeup on fermentation rates with graph plots.',
          type: 'lab',
          dueDate: getRelativeDate(3, '17:00'),
          priority: 'high',
          status: 'not-started',
          completionPercentage: 0,
          gradeCategoryId: 'gc-bio-lab',
          scoreEarned: null,
          maxScore: 100,
          subtasks: [
            { id: 'st-3', title: 'Plot data curves', isCompleted: false },
            { id: 'st-4', title: 'Draft discussion & conclusions', isCompleted: false }
          ],
          notes: ''
        },
        {
          id: 'asg-3',
          semesterId: 'sem-demo',
          classId: 'cls-lit',
          title: 'Comparative Analysis Essay: Hamlet',
          description: '1,500-word analytical paper comparing dramatic irony and existential themes.',
          type: 'essay',
          dueDate: getRelativeDate(5, '23:59'),
          priority: 'medium',
          status: 'not-started',
          completionPercentage: 0,
          gradeCategoryId: 'gc-lit-essays',
          scoreEarned: null,
          maxScore: 100,
          subtasks: [],
          notes: ''
        },
        {
          id: 'asg-4',
          semesterId: 'sem-demo',
          classId: 'cls-cs',
          title: 'Project 2: Self-Balancing AVL Tree',
          description: 'Implement generic AVL Binary Search Tree with rebalancing rotations.',
          type: 'project',
          dueDate: getRelativeDate(7, '23:59'),
          priority: 'high',
          status: 'in-progress',
          completionPercentage: 60,
          gradeCategoryId: 'gc-cs-proj',
          scoreEarned: null,
          maxScore: 100,
          subtasks: [],
          notes: ''
        },
        {
          id: 'asg-5',
          semesterId: 'sem-demo',
          classId: 'cls-calc',
          title: 'Derivatives & Integration Review Drill',
          description: 'Warmup problem sheet.',
          type: 'homework',
          dueDate: getRelativeDate(-2, '23:59'),
          priority: 'low',
          status: 'completed',
          completionPercentage: 100,
          gradeCategoryId: 'gc-calc-hw',
          scoreEarned: 96,
          maxScore: 100,
          subtasks: [],
          notes: 'Scored 96/100'
        }
      ],
      exams: [
        {
          id: 'ex-1',
          semesterId: 'sem-demo',
          classId: 'cls-calc',
          title: 'Calculus BC Midterm Examination',
          date: getRelativeDate(4, '').split('T')[0],
          startTime: '09:00',
          duration: 90,
          room: 'Hall 304',
          seatNumber: 'Seat 14',
          description: 'Units 1-6: Derivatives, Integrals, and Series Tests.',
          gradeCategoryId: 'gc-calc-exam',
          scoreEarned: null,
          maxScore: 100,
          status: 'upcoming',
          topics: ['Limits and Continuity', 'Implicit Differentiation', 'Integration by Parts', 'Geometric Series', 'Ratio Test']
        },
        {
          id: 'ex-2',
          semesterId: 'sem-demo',
          classId: 'cls-bio',
          title: 'Unit 3 Cellular Energetics & Genetics Exam',
          date: getRelativeDate(9, '').split('T')[0],
          startTime: '09:30',
          duration: 75,
          room: 'Bio Lecture Hall B',
          seatNumber: 'Seat 42',
          description: 'Multiple Choice + Free Response Questions.',
          gradeCategoryId: 'gc-bio-tests',
          scoreEarned: null,
          maxScore: 100,
          status: 'upcoming',
          topics: ['Krebs Cycle', 'Electron Transport Chain', 'Light Reactions', 'Punnett Squares']
        }
      ]
    };
  }

  // --- ACADEMIC DATA STORE ---
  class AcademicStore {
    constructor() {
      this.listeners = new Set();
      this.data = this.loadFromStorage();
    }

    loadFromStorage() {
      // 1. Try to read primary storage key
      const raw = StorageSafe.getItem(PRIMARY_STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            return this.validateAndMigrate(parsed);
          }
        } catch (e) {
          console.warn('Primary storage parse error, checking backup...', e);
        }
      }

      // 2. Try backup storage key
      const backupRaw = StorageSafe.getItem(BACKUP_STORAGE_KEY);
      if (backupRaw) {
        try {
          const parsedBackup = JSON.parse(backupRaw);
          if (parsedBackup && typeof parsedBackup === 'object') {
            return this.validateAndMigrate(parsedBackup);
          }
        } catch (e) {}
      }

      // 3. Try to discover any legacy data to migrate
      const legacyKeys = ['academia_pro_data_v1', 'academia_pro_data_default'];
      for (const lk of legacyKeys) {
        const lRaw = StorageSafe.getItem(lk);
        if (lRaw) {
          try {
            const lParsed = JSON.parse(lRaw);
            if (lParsed && typeof lParsed === 'object') {
              const migrated = this.validateAndMigrate(lParsed);
              this.saveToStorage(migrated);
              return migrated;
            }
          } catch (e) {}
        }
      }

      // 4. Default: Brand new clean initial state (Zero sample data)
      const cleanData = getEmptyInitialData('Student', '');
      this.saveToStorage(cleanData);
      return cleanData;
    }

    saveToStorage(dataToSave) {
      const payload = dataToSave || this.data;
      if (!payload) return;
      try {
        const jsonStr = JSON.stringify(payload);
        StorageSafe.setItem(PRIMARY_STORAGE_KEY, jsonStr);
        StorageSafe.setItem(BACKUP_STORAGE_KEY, jsonStr);
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
    }

    validateAndMigrate(data) {
      if (!data || typeof data !== 'object') {
        return getEmptyInitialData('Student', '');
      }
      if (!data.settings) {
        data.settings = {
          activeSemesterId: 'sem-current',
          theme: 'light',
          scheduleMode: 'standard',
          currentCycleDay: 'A',
          studentName: 'Student',
          schoolName: '',
          avatarColor: AVATAR_PALETTES[0],
          notificationsEnabled: false,
          isProfileConfigured: false,
        };
      }
      if (!data.settings.studentName) data.settings.studentName = 'Student';
      if (!data.settings.avatarColor) data.settings.avatarColor = AVATAR_PALETTES[0];
      if (!data.settings.theme) data.settings.theme = 'light';

      if (!Array.isArray(data.semesters) || data.semesters.length === 0) {
        const year = new Date().getFullYear();
        data.semesters = [
          {
            id: 'sem-current',
            name: `Academic Year ${year}`,
            startDate: `${year}-01-01`,
            endDate: `${year}-12-31`,
            isActive: true
          }
        ];
        data.settings.activeSemesterId = 'sem-current';
      }
      if (!data.settings.activeSemesterId) {
        data.settings.activeSemesterId = data.semesters[0].id;
      }
      if (!Array.isArray(data.classes)) data.classes = [];
      if (!Array.isArray(data.schedule)) data.schedule = [];
      if (!Array.isArray(data.assignments)) data.assignments = [];
      if (!Array.isArray(data.exams)) data.exams = [];
      return data;
    }

    subscribe(listener) {
      this.listeners.add(listener);
      return () => this.listeners.delete(listener);
    }

    notify(changeType, payload) {
      this.saveToStorage(this.data);
      this.listeners.forEach(fn => fn(changeType, payload, this.data));
    }

    getState() {
      return this.data;
    }

    getActiveSemester() {
      const active = this.data.semesters.find(s => s.id === this.data.settings.activeSemesterId);
      return active || this.data.semesters[0] || { id: 'sem-current', name: 'Current Term' };
    }

    getClasses() {
      const semId = this.getActiveSemester().id;
      return this.data.classes.filter(c => c.semesterId === semId);
    }

    getClassById(classId) {
      return this.data.classes.find(c => c.id === classId);
    }

    getAssignments() {
      const semId = this.getActiveSemester().id;
      return this.data.assignments.filter(a => a.semesterId === semId);
    }

    getExams() {
      const semId = this.getActiveSemester().id;
      return this.data.exams.filter(e => e.semesterId === semId);
    }

    getSchedule() {
      const classes = this.getClasses();
      const classIds = new Set(classes.map(c => c.id));
      return this.data.schedule.filter(s => classIds.has(s.classId));
    }

    // --- CRUD ACTIONS ---

    addAssignment(assignment) {
      const newAsg = {
        id: 'asg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
        semesterId: this.getActiveSemester().id,
        title: assignment.title || 'Untitled Assignment',
        description: assignment.description || '',
        classId: assignment.classId || '',
        type: assignment.type || 'homework',
        dueDate: assignment.dueDate || getRelativeDate(1),
        priority: assignment.priority || 'medium',
        status: assignment.status || 'not-started',
        completionPercentage: Number(assignment.completionPercentage) || 0,
        gradeCategoryId: assignment.gradeCategoryId || null,
        scoreEarned: assignment.scoreEarned !== undefined && assignment.scoreEarned !== '' && assignment.scoreEarned !== null ? Number(assignment.scoreEarned) : null,
        maxScore: Number(assignment.maxScore) || 100,
        subtasks: Array.isArray(assignment.subtasks) ? assignment.subtasks : [],
        notes: assignment.notes || ''
      };
      this.data.assignments.unshift(newAsg);
      this.notify('assignment_added', newAsg);
      return newAsg;
    }

    updateAssignment(id, updates) {
      const idx = this.data.assignments.findIndex(a => a.id === id);
      if (idx !== -1) {
        this.data.assignments[idx] = { ...this.data.assignments[idx], ...updates };
        this.notify('assignment_updated', this.data.assignments[idx]);
        return this.data.assignments[idx];
      }
      return null;
    }

    toggleAssignmentComplete(id) {
      const asg = this.data.assignments.find(a => a.id === id);
      if (asg) {
        const isComplete = asg.status === 'completed';
        asg.status = isComplete ? 'not-started' : 'completed';
        asg.completionPercentage = isComplete ? 0 : 100;
        if (asg.subtasks && asg.subtasks.length > 0) {
          asg.subtasks.forEach(st => st.isCompleted = !isComplete);
        }
        this.notify('assignment_toggled', asg);
      }
    }

    deleteAssignment(id) {
      const idx = this.data.assignments.findIndex(a => a.id === id);
      if (idx !== -1) {
        const deleted = this.data.assignments.splice(idx, 1)[0];
        this.notify('assignment_deleted', deleted);
        return deleted;
      }
      return null;
    }

    addExam(exam) {
      const newExam = {
        id: 'ex-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
        semesterId: this.getActiveSemester().id,
        title: exam.title || 'Untitled Exam',
        classId: exam.classId || '',
        date: exam.date || getRelativeDate(7, '').split('T')[0],
        startTime: exam.startTime || '09:00',
        duration: Number(exam.duration) || 60,
        room: exam.room || '',
        seatNumber: exam.seatNumber || '',
        description: exam.description || '',
        gradeCategoryId: exam.gradeCategoryId || null,
        scoreEarned: exam.scoreEarned !== undefined && exam.scoreEarned !== '' && exam.scoreEarned !== null ? Number(exam.scoreEarned) : null,
        maxScore: Number(exam.maxScore) || 100,
        status: exam.status || 'upcoming',
        topics: Array.isArray(exam.topics) ? exam.topics : []
      };
      this.data.exams.push(newExam);
      this.notify('exam_added', newExam);
      return newExam;
    }

    updateExam(id, updates) {
      const idx = this.data.exams.findIndex(e => e.id === id);
      if (idx !== -1) {
        this.data.exams[idx] = { ...this.data.exams[idx], ...updates };
        this.notify('exam_updated', this.data.exams[idx]);
        return this.data.exams[idx];
      }
      return null;
    }

    deleteExam(id) {
      const idx = this.data.exams.findIndex(e => e.id === id);
      if (idx !== -1) {
        const deleted = this.data.exams.splice(idx, 1)[0];
        this.notify('exam_deleted', deleted);
        return deleted;
      }
      return null;
    }

    addClass(classItem) {
      const newClass = {
        id: 'cls-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
        semesterId: this.getActiveSemester().id,
        name: classItem.name || 'New Course',
        code: classItem.code || '',
        teacher: classItem.teacher || '',
        teacherEmail: classItem.teacherEmail || '',
        room: classItem.room || '',
        color: classItem.color || SUBJECT_COLORS[this.data.classes.length % SUBJECT_COLORS.length],
        credits: Number(classItem.credits) || 3,
        gradeCategories: classItem.gradeCategories && classItem.gradeCategories.length > 0 
          ? classItem.gradeCategories 
          : [
              { id: 'gc-hw-' + Date.now(), name: 'Homework & Assignments', weight: 40 },
              { id: 'gc-exam-' + Date.now(), name: 'Tests & Exams', weight: 60 }
            ],
        notes: classItem.notes || ''
      };
      this.data.classes.push(newClass);
      this.notify('class_added', newClass);
      return newClass;
    }

    updateClass(id, updates) {
      const idx = this.data.classes.findIndex(c => c.id === id);
      if (idx !== -1) {
        this.data.classes[idx] = { ...this.data.classes[idx], ...updates };
        this.notify('class_updated', this.data.classes[idx]);
        return this.data.classes[idx];
      }
      return null;
    }

    deleteClass(id) {
      const idx = this.data.classes.findIndex(c => c.id === id);
      if (idx !== -1) {
        const deleted = this.data.classes.splice(idx, 1)[0];
        this.data.assignments = this.data.assignments.filter(a => a.classId !== id);
        this.data.exams = this.data.exams.filter(e => e.classId !== id);
        this.data.schedule = this.data.schedule.filter(s => s.classId !== id);
        this.notify('class_deleted', deleted);
        return deleted;
      }
      return null;
    }

    addScheduleSlot(slot) {
      const newSlot = {
        id: 'sch-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
        classId: slot.classId,
        dayOfWeek: Number(slot.dayOfWeek),
        startTime: slot.startTime || '09:00',
        endTime: slot.endTime || '10:15',
        room: slot.room || '',
        scheduleType: slot.scheduleType || 'all'
      };
      this.data.schedule.push(newSlot);
      this.notify('schedule_updated', newSlot);
      return newSlot;
    }

    deleteScheduleSlot(id) {
      this.data.schedule = this.data.schedule.filter(s => s.id !== id);
      this.notify('schedule_updated');
    }

    updateSettings(updates) {
      this.data.settings = { ...this.data.settings, ...updates };
      this.notify('settings_updated', this.data.settings);
    }

    resetToEmptyData() {
      const sName = this.data.settings.studentName || 'Student';
      const sSchool = this.data.settings.schoolName || '';
      this.data = getEmptyInitialData(sName, sSchool);
      this.saveToStorage(this.data);
      this.notify('data_reset', this.data);
    }

    loadDemoDataPreset() {
      const sName = this.data.settings.studentName || 'Alex Morgan';
      const sSchool = this.data.settings.schoolName || 'Westwood Academy';
      this.data = getSampleDemoData(sName, sSchool);
      this.saveToStorage(this.data);
      this.notify('demo_data_loaded', this.data);
    }

    // --- ACADEMIC CALCULATIONS & GRADE ENGINE ---

    calculateClassGrade(classId) {
      const cls = this.getClassById(classId);
      if (!cls) return { score: null, letter: 'N/A', gpaPoints: 0, categories: [], totalWeightUsed: 0 };

      const classAsgs = this.getAssignments().filter(a => a.classId === classId && a.scoreEarned !== null);
      const classExams = this.getExams().filter(e => e.classId === classId && e.scoreEarned !== null);

      const categories = (cls.gradeCategories || []).map(cat => {
        const asgItems = classAsgs.filter(a => a.gradeCategoryId === cat.id);
        const examItems = classExams.filter(e => e.gradeCategoryId === cat.id);
        const allItems = [...asgItems, ...examItems];
        let earned = 0;
        let possible = 0;

        allItems.forEach(item => {
          earned += Number(item.scoreEarned);
          possible += Number(item.maxScore || 100);
        });

        const percentage = possible > 0 ? (earned / possible) * 100 : null;
        return {
          id: cat.id,
          name: cat.name,
          weight: cat.weight,
          earned,
          possible,
          percentage,
          itemCount: allItems.length
        };
      });

      let totalWeightUsed = 0;
      let weightedSum = 0;

      categories.forEach(cat => {
        if (cat.percentage !== null) {
          totalWeightUsed += cat.weight;
          weightedSum += (cat.percentage * (cat.weight / 100));
        }
      });

      const finalScore = totalWeightUsed > 0 ? (weightedSum / (totalWeightUsed / 100)) : null;
      const letter = this.percentageToLetter(finalScore);
      const gpaPoints = this.letterToGpaPoints(letter);

      return {
        score: finalScore !== null ? Math.round(finalScore * 10) / 10 : null,
        letter,
        gpaPoints,
        categories,
        totalWeightUsed
      };
    }

    calculateOverallGPA() {
      const classes = this.getClasses();
      if (classes.length === 0) return { gpa: null, totalCredits: 0, gradedCount: 0 };

      let totalPoints = 0;
      let totalCredits = 0;
      let gradedCount = 0;

      classes.forEach(c => {
        const grade = this.calculateClassGrade(c.id);
        if (grade.score !== null) {
          const credits = c.credits || 3;
          totalPoints += (grade.gpaPoints * credits);
          totalCredits += credits;
          gradedCount++;
        }
      });

      const gpa = totalCredits > 0 ? (totalPoints / totalCredits) : null;
      return {
        gpa: gpa !== null ? Math.round(gpa * 100) / 100 : null,
        totalCredits,
        gradedCount
      };
    }

    simulateWhatIfGrade(classId, targetOverallScore, upcomingCategoryWeight) {
      const current = this.calculateClassGrade(classId);
      if (!current || current.score === null) {
        return { requiredScore: targetOverallScore, isFeasible: true, currentScore: null, targetScore: targetOverallScore, weightUsed: upcomingCategoryWeight || 20 };
      }

      const currentWeight = current.totalWeightUsed;
      const weightToUse = upcomingCategoryWeight || (100 - currentWeight) || 20;

      const totalNewWeight = currentWeight + weightToUse;
      const requiredScore = (targetOverallScore * (totalNewWeight / 100) - (current.score * (currentWeight / 100))) / (weightToUse / 100);

      return {
        currentScore: current.score,
        targetScore: targetOverallScore,
        weightUsed: weightToUse,
        requiredScore: Math.round(requiredScore * 10) / 10,
        isFeasible: requiredScore <= 100 && requiredScore >= 0
      };
    }

    percentageToLetter(pct) {
      if (pct === null || isNaN(pct)) return 'N/A';
      if (pct >= 93) return 'A';
      if (pct >= 90) return 'A-';
      if (pct >= 87) return 'B+';
      if (pct >= 83) return 'B';
      if (pct >= 80) return 'B-';
      if (pct >= 77) return 'C+';
      if (pct >= 73) return 'C';
      if (pct >= 70) return 'C-';
      if (pct >= 67) return 'D+';
      if (pct >= 60) return 'D';
      return 'F';
    }

    letterToGpaPoints(letter) {
      switch (letter) {
        case 'A': return 4.0;
        case 'A-': return 3.7;
        case 'B+': return 3.3;
        case 'B': return 3.0;
        case 'B-': return 2.7;
        case 'C+': return 2.3;
        case 'C': return 2.0;
        case 'C-': return 1.7;
        case 'D+': return 1.3;
        case 'D': return 1.0;
        case 'F': return 0.0;
        default: return 4.0;
      }
    }

    generateICalString() {
      const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Academia Pro//Student Planner//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'X-WR-CALNAME:Academia Pro Academic Calendar'
      ];

      const asgs = this.getAssignments();
      const exams = this.getExams();

      asgs.forEach(a => {
        const cls = this.getClassById(a.classId);
        const dt = new Date(a.dueDate);
        if (isNaN(dt.getTime())) return;
        const formattedDt = dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

        lines.push('BEGIN:VEVENT');
        lines.push(`UID:asg-${a.id}@academiapro.local`);
        lines.push(`DTSTAMP:${formattedDt}`);
        lines.push(`DTSTART:${formattedDt}`);
        lines.push(`DTEND:${formattedDt}`);
        lines.push(`SUMMARY:[${cls ? cls.name : 'Task'}] ${a.title}`);
        lines.push(`DESCRIPTION:${(a.description || '').replace(/\n/g, '\\n')}`);
        lines.push('STATUS:CONFIRMED');
        lines.push('END:VEVENT');
      });

      exams.forEach(e => {
        const cls = this.getClassById(e.classId);
        const startDt = new Date(`${e.date}T${e.startTime}:00`);
        if (isNaN(startDt.getTime())) return;
        const endDt = new Date(startDt.getTime() + (e.duration || 60) * 60000);

        const fmtStart = startDt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const fmtEnd = endDt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

        lines.push('BEGIN:VEVENT');
        lines.push(`UID:exam-${e.id}@academiapro.local`);
        lines.push(`DTSTAMP:${fmtStart}`);
        lines.push(`DTSTART:${fmtStart}`);
        lines.push(`DTEND:${fmtEnd}`);
        lines.push(`SUMMARY:📝 [${cls ? cls.name : 'Course'}] Exam: ${e.title}`);
        lines.push(`LOCATION:${e.room || ''}`);
        lines.push(`DESCRIPTION:${(e.description || '').replace(/\n/g, '\\n')}`);
        lines.push('STATUS:CONFIRMED');
        lines.push('END:VEVENT');
      });

      lines.push('END:VCALENDAR');
      return lines.join('\r\n');
    }
  }

  const store = new AcademicStore();

  // App View State
  const state = {
    currentView: 'dashboard',
    calendarDate: new Date(),
    calendarViewMode: 'month',
    searchQuery: '',
    assignmentViewMode: 'list', // 'list' | 'kanban'
    filters: {
      assignmentStatus: 'all',
      assignmentClass: 'all',
      assignmentType: 'all',
      assignmentPriority: 'all',
      assignmentSort: 'dueDate-asc',
      examStatus: 'upcoming',
      scheduleDayFilter: 'all'
    },
    modalContext: null
  };

  let elements = {};

  function initApp() {
    cacheDOMElements();
    initTheme();
    bindGlobalEvents();
    setupKeyboardShortcuts();
    setupStoreSubscription();
    updateSidebarUser();
    
    // Automatic persistence hooks
    window.addEventListener('beforeunload', () => store.saveToStorage());
    window.addEventListener('pagehide', () => store.saveToStorage());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') store.saveToStorage();
    });

    // Initial Route
    navigateTo('dashboard');
    checkDueSoonReminders();
  }

  function updateSidebarUser() {
    const data = store.getState();
    const studentName = data.settings.studentName || 'Student';
    const initials = studentName.split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'ST';
    const avatarColor = data.settings.avatarColor || AVATAR_PALETTES[0];

    if (elements.userNameDisplay) elements.userNameDisplay.textContent = studentName;
    if (elements.userAvatarDisplay) {
      elements.userAvatarDisplay.textContent = initials;
      elements.userAvatarDisplay.style.background = avatarColor;
    }
    if (elements.userStatusDisplay) {
      elements.userStatusDisplay.innerHTML = `<span class="cloud-status-dot saved"></span> Local Workspace`;
    }
  }

  function cacheDOMElements() {
    elements = {
      appContainer: document.getElementById('app-container'),
      sidebar: document.querySelector('.app-sidebar'),
      mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
      themeToggleBtn: document.getElementById('theme-toggle-btn'),
      notificationBtn: document.getElementById('notification-btn'),
      headerNotificationDot: document.getElementById('header-notification-dot'),
      headerAuthBtn: document.getElementById('header-auth-btn'),
      sidebarUserCard: document.getElementById('sidebar-user-card'),
      sidebarAuthBtn: document.getElementById('sidebar-auth-btn'),
      userAvatarDisplay: document.getElementById('user-avatar-display'),
      userNameDisplay: document.getElementById('user-name-display'),
      userStatusDisplay: document.getElementById('user-status-display'),
      quickAddBtn: document.getElementById('quick-add-btn'),
      globalSearchInput: document.getElementById('global-search-input'),
      semesterSelect: document.getElementById('semester-select'),
      navItems: document.querySelectorAll('.nav-item, .mobile-nav-btn'),
      viewSections: document.querySelectorAll('.view-section'),
      modalOverlay: document.getElementById('modal-overlay'),
      modalContainer: document.getElementById('modal-container'),
      toastContainer: document.getElementById('toast-container')
    };
  }

  function initTheme() {
    const savedTheme = store.getState().settings.theme || 'light';
    applyTheme(savedTheme);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = elements.themeToggleBtn ? elements.themeToggleBtn.querySelector('.theme-icon') : null;
    if (icon) {
      icon.innerHTML = theme === 'dark' 
        ? `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
        : `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    store.updateSettings({ theme: next });
    applyTheme(next);
    showToast(`Theme switched to ${next} mode`, 'info');
  }

  function bindGlobalEvents() {
    document.querySelectorAll('[data-nav-target]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = btn.getAttribute('data-nav-target');
        navigateTo(target);
        if (elements.sidebar && elements.sidebar.classList.contains('mobile-open')) {
          elements.sidebar.classList.remove('mobile-open');
        }
      });
    });

    if (elements.mobileMenuToggle) {
      elements.mobileMenuToggle.addEventListener('click', () => {
        elements.sidebar?.classList.toggle('mobile-open');
      });
    }

    if (elements.themeToggleBtn) {
      elements.themeToggleBtn.addEventListener('click', toggleTheme);
    }

    if (elements.quickAddBtn) {
      elements.quickAddBtn.addEventListener('click', () => openQuickAddModal());
    }

    // Profile Modals
    if (elements.headerAuthBtn) {
      elements.headerAuthBtn.addEventListener('click', () => openProfileModal());
    }
    if (elements.sidebarUserCard) {
      elements.sidebarUserCard.addEventListener('click', () => openProfileModal());
    }
    if (elements.sidebarAuthBtn) {
      elements.sidebarAuthBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openProfileModal();
      });
    }

    if (elements.globalSearchInput) {
      elements.globalSearchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.trim().toLowerCase();
        if (state.currentView === 'assignments') renderAssignmentsView();
        else if (state.currentView === 'dashboard') renderDashboardView();
        else if (state.currentView === 'exams') renderExamsView();
      });
    }

    if (elements.semesterSelect) {
      populateSemesterSelector();
      elements.semesterSelect.addEventListener('change', (e) => {
        store.updateSettings({ activeSemesterId: e.target.value });
        showToast(`Active term: ${elements.semesterSelect.options[elements.semesterSelect.selectedIndex].text}`, 'info');
        refreshCurrentView();
      });
    }

    if (elements.notificationBtn) {
      elements.notificationBtn.addEventListener('click', () => {
        showUpcomingAlertsModal();
      });
    }
  }

  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== elements.globalSearchInput && !state.modalContext) {
        e.preventDefault();
        elements.globalSearchInput?.focus();
      }
      if ((e.key === 'q' || e.key === 'Q') && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA' && !state.modalContext) {
        e.preventDefault();
        openQuickAddModal();
      }
      if (e.key === 'Escape' && state.modalContext) {
        closeModal();
      }
    });
  }

  function setupStoreSubscription() {
    store.subscribe(() => {
      updateSidebarUser();
      updateBadges();
      refreshCurrentView();
    });
  }

  function navigateTo(viewId) {
    state.currentView = viewId;

    document.querySelectorAll('[data-nav-target]').forEach(el => {
      if (el.getAttribute('data-nav-target') === viewId) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const targetSec = document.getElementById('view-' + viewId);
    if (targetSec) {
      targetSec.classList.add('active');
      refreshCurrentView();
    }
  }

  function refreshCurrentView() {
    populateSemesterSelector();
    updateBadges();

    switch (state.currentView) {
      case 'dashboard': renderDashboardView(); break;
      case 'calendar': renderCalendarView(); break;
      case 'assignments': renderAssignmentsView(); break;
      case 'exams': renderExamsView(); break;
      case 'schedule': renderScheduleView(); break;
      case 'grades': renderGradesView(); break;
      case 'classes': renderClassesView(); break;
      case 'analytics': renderAnalyticsView(); break;
      case 'settings': renderSettingsView(); break;
      default: renderDashboardView(); break;
    }
  }

  function populateSemesterSelector() {
    if (!elements.semesterSelect) return;
    const data = store.getState();
    const semesters = data.semesters || [];
    
    elements.semesterSelect.innerHTML = semesters.map(s => `
      <option value="${s.id}" ${s.id === data.settings.activeSemesterId ? 'selected' : ''}>
        ${s.name}
      </option>
    `).join('');
  }

  function updateBadges() {
    const assignments = store.getAssignments().filter(a => a.status !== 'completed');
    const badgeAsg = document.getElementById('nav-badge-assignments');
    if (badgeAsg) {
      badgeAsg.textContent = assignments.length;
      badgeAsg.className = 'nav-badge' + (assignments.some(a => isOverdue(a.dueDate)) ? ' danger' : '');
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const upcomingExams = store.getExams().filter(e => e.date >= todayStr);
    const badgeExams = document.getElementById('nav-badge-exams');
    if (badgeExams) {
      badgeExams.textContent = upcomingExams.length;
    }
  }

  function isOverdue(dueDateString) {
    if (!dueDateString) return false;
    return new Date(dueDateString).getTime() < Date.now();
  }

  function getDaysUntil(dateString) {
    const target = new Date(dateString).getTime();
    const now = Date.now();
    const diff = target - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  function formatRelativeDueDate(dateString) {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const days = getDaysUntil(dateString);
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (days < 0) {
      const pastDays = Math.abs(days);
      return `<span style="color:var(--danger-text);font-weight:700;">Overdue by ${pastDays} day${pastDays > 1 ? 's' : ''}</span>`;
    }
    if (days === 0) {
      return `<span style="color:var(--warning-text);font-weight:700;">Due Today (${timeStr})</span>`;
    }
    if (days === 1) {
      return `<span style="color:var(--info-text);font-weight:600;">Due Tomorrow (${timeStr})</span>`;
    }
    if (days <= 7) {
      return `<span>Due in ${days} days (${date.toLocaleDateString([], { weekday: 'short' })})</span>`;
    }
    return `<span>Due ${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>`;
  }

  // --- VIEW: DASHBOARD ---
  function renderDashboardView() {
    const container = document.getElementById('view-dashboard');
    if (!container) return;

    const activeSem = store.getActiveSemester();
    const classes = store.getClasses();
    const assignments = store.getAssignments();
    const exams = store.getExams();
    const schedule = store.getSchedule();
    const gpaData = store.calculateOverallGPA();

    const pendingAssignments = assignments.filter(a => a.status !== 'completed');
    const overdueCount = pendingAssignments.filter(a => isOverdue(a.dueDate)).length;
    const todayStr = new Date().toISOString().split('T')[0];
    const upcomingExams = exams.filter(e => e.date >= todayStr).sort((a, b) => a.date.localeCompare(b.date));

    // Time-based greeting
    const hour = new Date().getHours();
    const greetingText = hour < 12 ? 'Good morning' : (hour < 18 ? 'Good afternoon' : 'Good evening');
    const studentName = store.getState().settings.studentName || 'Student';

    // Clean slate check (0 classes & 0 tasks)
    const isCleanSlate = classes.length === 0 && assignments.length === 0;

    let dashboardHTML = `
      <div class="section-header">
        <div>
          <h1 class="section-title">
            ${greetingText}, ${studentName}
          </h1>
          <p class="section-subtitle">${new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })} · ${activeSem.name}</p>
        </div>
        <div class="header-actions">
          <button class="btn-primary" id="dash-quick-add-task">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span>+ Add Task</span>
          </button>
          <button class="btn-secondary" id="dash-quick-add-exam">
            <span>+ Add Exam</span>
          </button>
          <button class="btn-secondary" id="dash-quick-add-class">
            <span>+ Add Course</span>
          </button>
        </div>
      </div>

      <!-- Top Summary Metrics -->
      <div class="stat-cards-grid">
        <div class="stat-card">
          <div class="stat-icon-wrapper blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Active Tasks</span>
            <div class="stat-value">${pendingAssignments.length}</div>
            <span class="stat-subtext">
              ${overdueCount > 0 ? `<b style="color:var(--danger-text)">${overdueCount} overdue</b>` : 'All on track'}
            </span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper amber">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Upcoming Exams</span>
            <div class="stat-value">${upcomingExams.length}</div>
            <span class="stat-subtext">
              ${upcomingExams.length > 0 ? `Next: in ${getDaysUntil(upcomingExams[0].date)}d` : 'No upcoming tests'}
            </span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper emerald">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Cumulative GPA</span>
            <div class="stat-value">
              ${gpaData.gpa !== null ? gpaData.gpa.toFixed(2) : '—'}
            </div>
            <span class="stat-subtext">
              ${gpaData.gpa !== null ? `Scale: 4.00 (${store.percentageToLetter((gpaData.gpa / 4) * 100)})` : 'Add graded work'}
            </span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper purple">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Enrolled Courses</span>
            <div class="stat-value">${classes.length}</div>
            <span class="stat-subtext">${activeSem.name}</span>
          </div>
        </div>
      </div>
    `;

    // Onboarding Guide Card when Clean Slate
    if (isCleanSlate) {
      dashboardHTML += `
        <div class="onboarding-guide-card">
          <div class="onboarding-header">
            <h2 class="onboarding-title">
              <span>✨</span> Setup your Academic Workspace
            </h2>
            <button class="btn-ghost" id="btn-load-demo-data" title="Load sample courses and tasks to test">
              <span>✨ Load Demo Data</span>
            </button>
          </div>
          <p style="font-size:0.8125rem; color:var(--text-secondary); margin-bottom:0.75rem;">
            Your workspace is ready and starts clean with zero sample data. Follow these quick steps to get organized:
          </p>
          <div class="onboarding-steps-grid">
            <div class="onboarding-step-item">
              <span class="step-badge">Step 1</span>
              <div class="step-title">Add your Courses</div>
              <div class="step-desc">Enter your classes (Calculus, Chemistry, Literature, etc.) with custom color tags.</div>
              <button class="btn-primary" id="btn-onboard-add-class" style="margin-top:auto; width:100%; justify-content:center;">
                + Add First Course
              </button>
            </div>

            <div class="onboarding-step-item">
              <span class="step-badge">Step 2</span>
              <div class="step-title">Track Assignments</div>
              <div class="step-desc">Log homework, essays, and lab deadlines with subtasks and priority tags.</div>
              <button class="btn-secondary" id="btn-onboard-add-task" style="margin-top:auto; width:100%; justify-content:center;">
                + Add Assignment
              </button>
            </div>

            <div class="onboarding-step-item">
              <span class="step-badge">Step 3</span>
              <div class="step-title">Schedule Exams</div>
              <div class="step-desc">Set midterm and final dates with countdown timers and study topic checklists.</div>
              <button class="btn-secondary" id="btn-onboard-add-exam" style="margin-top:auto; width:100%; justify-content:center;">
                + Schedule Exam
              </button>
            </div>
          </div>
        </div>
      `;
    }

    // Two column layout
    dashboardHTML += `
      <div class="dashboard-grid">
        <!-- Left Main Column -->
        <div>
          <!-- Priority Tasks List -->
          <div class="card-panel">
            <div class="panel-header">
              <h3 class="panel-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                Upcoming Deadlines
              </h3>
              <a href="#assignments" class="panel-action-link" data-nav-target="assignments">View all tasks →</a>
            </div>

            <div id="dash-tasks-list">
              ${pendingAssignments.length > 0 ? pendingAssignments.slice(0, 5).map(task => renderTaskItemHTML(task)).join('') : `
                <div class="empty-state-box">
                  <div class="empty-state-icon">✓</div>
                  <div class="empty-state-title">No pending deadlines</div>
                  <p class="empty-state-desc">You are completely caught up! Add a new homework assignment or project when ready.</p>
                  <button class="btn-primary" id="btn-empty-add-task">+ Create Assignment</button>
                </div>
              `}
            </div>
          </div>

          <!-- Today's Schedule Matrix snippet -->
          <div class="card-panel">
            <div class="panel-header">
              <h3 class="panel-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                Today's Class Schedule
              </h3>
              <a href="#schedule" class="panel-action-link" data-nav-target="schedule">Full timetable →</a>
            </div>

            <div id="dash-schedule-today">
              ${(() => {
                const todayDay = new Date().getDay(); // 0=Sun, 1=Mon...
                const todaySlots = schedule.filter(s => s.dayOfWeek === todayDay);
                if (todaySlots.length === 0) {
                  return `
                    <div style="padding:1.25rem; text-align:center; color:var(--text-muted); font-size:0.8125rem;">
                      No classes scheduled for today.
                    </div>
                  `;
                }
                return todaySlots.map(slot => {
                  const cls = store.getClassById(slot.classId);
                  return `
                    <div style="display:flex; align-items:center; justify-content:space-between; padding:0.625rem 0.75rem; background:var(--bg-surface-subtle); border-radius:var(--radius-md); margin-bottom:0.5rem; border-left:4px solid ${cls ? cls.color : 'var(--accent)'};">
                      <div>
                        <div style="font-weight:700; font-size:0.875rem; color:var(--text-primary);">${cls ? cls.name : 'Class'}</div>
                        <div style="font-size:0.75rem; color:var(--text-secondary);">${slot.room ? `Room ${slot.room} · ` : ''}${cls && cls.teacher ? cls.teacher : ''}</div>
                      </div>
                      <div style="font-family:var(--font-mono); font-size:0.75rem; font-weight:700; color:var(--text-primary); background:var(--bg-surface); padding:0.25rem 0.5rem; border-radius:var(--radius-sm); border:1px solid var(--border-default);">
                        ${slot.startTime} - ${slot.endTime}
                      </div>
                    </div>
                  `;
                }).join('');
              })()}
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div>
          <!-- Upcoming Exams Widget -->
          <div class="card-panel">
            <div class="panel-header">
              <h3 class="panel-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>
                Exams Countdown
              </h3>
              <a href="#exams" class="panel-action-link" data-nav-target="exams">View all →</a>
            </div>

            <div>
              ${upcomingExams.length > 0 ? upcomingExams.slice(0, 3).map(exam => {
                const cls = store.getClassById(exam.classId);
                const days = getDaysUntil(exam.date);
                return `
                  <div style="padding:0.75rem; background:var(--bg-surface-subtle); border-radius:var(--radius-md); margin-bottom:0.5rem; border:1px solid var(--border-subtle);">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.25rem;">
                      <div style="font-weight:700; font-size:0.875rem; color:var(--text-primary);">${exam.title}</div>
                      <span class="exam-countdown-pill ${days <= 2 ? 'urgent' : (days <= 7 ? 'soon' : 'future')}">
                        ${days === 0 ? 'Today' : (days === 1 ? 'Tomorrow' : `${days}d left`)}
                      </span>
                    </div>
                    <div style="font-size:0.75rem; color:var(--text-secondary);">
                      ${cls ? `<span style="font-weight:600; color:${cls.color}">${cls.name}</span> · ` : ''}${new Date(exam.date).toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${exam.startTime}
                    </div>
                  </div>
                `;
              }).join('') : `
                <div style="padding:1.25rem 0.5rem; text-align:center; color:var(--text-muted); font-size:0.8125rem;">
                  No upcoming exams scheduled.
                </div>
              `}
            </div>
          </div>

          <!-- Academic Performance Summary -->
          <div class="card-panel">
            <div class="panel-header">
              <h3 class="panel-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                Course Grades
              </h3>
              <a href="#grades" class="panel-action-link" data-nav-target="grades">Simulator →</a>
            </div>

            <div>
              ${classes.length > 0 ? classes.map(c => {
                const grade = store.calculateClassGrade(c.id);
                return `
                  <div style="display:flex; align-items:center; justify-content:space-between; padding:0.5rem 0; border-bottom:1px solid var(--border-subtle);">
                    <div style="display:flex; align-items:center; gap:0.5rem; min-width:0;">
                      <div style="width:8px; height:8px; border-radius:50%; background:${c.color}; flex-shrink:0;"></div>
                      <span style="font-size:0.8125rem; font-weight:600; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${c.name}</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:0.5rem;">
                      <span style="font-size:0.8125rem; font-weight:700; color:var(--text-primary);">${grade.score !== null ? `${grade.score}%` : '—'}</span>
                      <span class="badge ${grade.score >= 90 ? 'success' : (grade.score >= 80 ? 'primary' : 'neutral')}">${grade.letter}</span>
                    </div>
                  </div>
                `;
              }).join('') : `
                <div style="padding:1.25rem 0.5rem; text-align:center; color:var(--text-muted); font-size:0.8125rem;">
                  No courses added yet.
                </div>
              `}
            </div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = dashboardHTML;

    // Attach event listeners
    container.querySelector('#dash-quick-add-task')?.addEventListener('click', () => openAssignmentModal());
    container.querySelector('#dash-quick-add-exam')?.addEventListener('click', () => openExamModal());
    container.querySelector('#dash-quick-add-class')?.addEventListener('click', () => openClassModal());

    container.querySelector('#btn-onboard-add-class')?.addEventListener('click', () => openClassModal());
    container.querySelector('#btn-onboard-add-task')?.addEventListener('click', () => openAssignmentModal());
    container.querySelector('#btn-onboard-add-exam')?.addEventListener('click', () => openExamModal());
    container.querySelector('#btn-empty-add-task')?.addEventListener('click', () => openAssignmentModal());

    container.querySelector('#btn-load-demo-data')?.addEventListener('click', () => {
      if (confirm('Load sample courses, assignments, and exams for demonstration?')) {
        store.loadDemoDataPreset();
        showToast('Demo data loaded successfully!', 'success');
      }
    });

    bindTaskItemEvents(container);
    bindNavTargetClicks(container);
  }

  // --- TASK ROW HTML HELPER ---
  function renderTaskItemHTML(task) {
    const cls = store.getClassById(task.classId);
    const isDone = task.status === 'completed';
    const isLate = !isDone && isOverdue(task.dueDate);

    const subtaskTotal = Array.isArray(task.subtasks) ? task.subtasks.length : 0;
    const subtaskDone = Array.isArray(task.subtasks) ? task.subtasks.filter(st => st.isCompleted).length : 0;

    return `
      <div class="task-item ${isDone ? 'completed' : ''} ${isLate ? 'overdue' : ''}" data-task-id="${task.id}">
        <input type="checkbox" class="task-checkbox" ${isDone ? 'checked' : ''} data-action="toggle-task" title="Mark complete" />
        
        <div class="task-content">
          <div class="task-header-row">
            ${cls ? `<span class="task-course-pill" style="background:${cls.color}">${cls.name}</span>` : ''}
            <span class="badge ${task.priority === 'high' ? 'danger' : (task.priority === 'medium' ? 'warning' : 'neutral')}">
              ${task.priority}
            </span>
            <span style="font-size:0.6875rem; color:var(--text-muted); text-transform:uppercase; font-weight:600;">${task.type}</span>
          </div>

          <div class="task-title">${task.title}</div>
          ${task.description ? `<div style="font-size:0.75rem; color:var(--text-secondary); margin-top:0.125rem;">${task.description}</div>` : ''}

          <div class="task-meta-row">
            <div class="task-meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              ${formatRelativeDueDate(task.dueDate)}
            </div>

            ${subtaskTotal > 0 ? `
              <div class="task-meta-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                ${subtaskDone}/${subtaskTotal} subtasks
              </div>
            ` : ''}

            ${task.scoreEarned !== null ? `
              <div class="task-meta-item" style="color:var(--success-text); font-weight:700;">
                ★ ${task.scoreEarned}/${task.maxScore || 100}
              </div>
            ` : ''}
          </div>
        </div>

        <div class="task-actions">
          <button class="icon-btn" data-action="edit-task" title="Edit Assignment" style="width:28px; height:28px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          </button>
          <button class="icon-btn" data-action="delete-task" title="Delete Assignment" style="width:28px; height:28px; color:var(--danger);">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </div>
    `;
  }

  function bindTaskItemEvents(parent) {
    parent.querySelectorAll('[data-action="toggle-task"]').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const taskId = e.target.closest('.task-item').getAttribute('data-task-id');
        store.toggleAssignmentComplete(taskId);
      });
    });

    parent.querySelectorAll('[data-action="edit-task"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const taskId = e.target.closest('.task-item').getAttribute('data-task-id');
        const task = store.getAssignments().find(a => a.id === taskId);
        if (task) openAssignmentModal(task);
      });
    });

    parent.querySelectorAll('[data-action="delete-task"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const taskId = e.target.closest('.task-item').getAttribute('data-task-id');
        if (confirm('Delete this assignment?')) {
          store.deleteAssignment(taskId);
          showToast('Assignment deleted', 'info');
        }
      });
    });
  }

  // --- VIEW: ASSIGNMENTS ---
  function renderAssignmentsView() {
    const container = document.getElementById('view-assignments');
    if (!container) return;

    const classes = store.getClasses();
    let allAssignments = store.getAssignments();

    // Filters
    if (state.filters.assignmentClass !== 'all') {
      allAssignments = allAssignments.filter(a => a.classId === state.filters.assignmentClass);
    }
    if (state.filters.assignmentType !== 'all') {
      allAssignments = allAssignments.filter(a => a.type === state.filters.assignmentType);
    }
    if (state.filters.assignmentPriority !== 'all') {
      allAssignments = allAssignments.filter(a => a.priority === state.filters.assignmentPriority);
    }
    if (state.filters.assignmentStatus === 'pending') {
      allAssignments = allAssignments.filter(a => a.status !== 'completed');
    } else if (state.filters.assignmentStatus === 'completed') {
      allAssignments = allAssignments.filter(a => a.status === 'completed');
    } else if (state.filters.assignmentStatus === 'overdue') {
      allAssignments = allAssignments.filter(a => a.status !== 'completed' && isOverdue(a.dueDate));
    }

    if (state.searchQuery) {
      allAssignments = allAssignments.filter(a => 
        a.title.toLowerCase().includes(state.searchQuery) ||
        (a.description && a.description.toLowerCase().includes(state.searchQuery))
      );
    }

    // Sort
    allAssignments.sort((a, b) => {
      if (state.filters.assignmentSort === 'dueDate-asc') {
        return (a.dueDate || '').localeCompare(b.dueDate || '');
      }
      if (state.filters.assignmentSort === 'dueDate-desc') {
        return (b.dueDate || '').localeCompare(a.dueDate || '');
      }
      if (state.filters.assignmentSort === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    const isKanban = state.assignmentViewMode === 'kanban';

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h1 class="section-title">Assignments & Deadlines</h1>
          <p class="section-subtitle">Track homework, lab reports, reading journals, and projects.</p>
        </div>
        <div class="header-actions">
          <div style="display:flex; background:var(--bg-surface-hover); border:1px solid var(--border-default); border-radius:var(--radius-md); padding:2px;">
            <button class="btn-ghost ${!isKanban ? 'active' : ''}" id="btn-view-list" style="padding:0.3125rem 0.625rem; font-size:0.75rem; border-radius:var(--radius-sm); ${!isKanban ? 'background:var(--bg-surface); font-weight:700;' : ''}">
              List View
            </button>
            <button class="btn-ghost ${isKanban ? 'active' : ''}" id="btn-view-kanban" style="padding:0.3125rem 0.625rem; font-size:0.75rem; border-radius:var(--radius-sm); ${isKanban ? 'background:var(--bg-surface); font-weight:700;' : ''}">
              Board View
            </button>
          </div>
          <button class="btn-primary" id="btn-create-assignment">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span>+ Add Task</span>
          </button>
        </div>
      </div>

      <!-- Filter Controls Row -->
      <div style="display:flex; gap:0.625rem; flex-wrap:wrap; margin-bottom:1.25rem; align-items:center;">
        <select class="form-control" id="asg-filter-class" style="width:auto; min-width:140px; padding:0.375rem 0.625rem; font-size:0.8125rem;">
          <option value="all">All Courses</option>
          ${classes.map(c => `<option value="${c.id}" ${state.filters.assignmentClass === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
        </select>

        <select class="form-control" id="asg-filter-status" style="width:auto; min-width:130px; padding:0.375rem 0.625rem; font-size:0.8125rem;">
          <option value="all" ${state.filters.assignmentStatus === 'all' ? 'selected' : ''}>All Status</option>
          <option value="pending" ${state.filters.assignmentStatus === 'pending' ? 'selected' : ''}>Active / Pending</option>
          <option value="completed" ${state.filters.assignmentStatus === 'completed' ? 'selected' : ''}>Completed</option>
          <option value="overdue" ${state.filters.assignmentStatus === 'overdue' ? 'selected' : ''}>Overdue</option>
        </select>

        <select class="form-control" id="asg-filter-type" style="width:auto; min-width:130px; padding:0.375rem 0.625rem; font-size:0.8125rem;">
          <option value="all">All Types</option>
          <option value="homework" ${state.filters.assignmentType === 'homework' ? 'selected' : ''}>Homework</option>
          <option value="essay" ${state.filters.assignmentType === 'essay' ? 'selected' : ''}>Essay</option>
          <option value="project" ${state.filters.assignmentType === 'project' ? 'selected' : ''}>Project</option>
          <option value="lab" ${state.filters.assignmentType === 'lab' ? 'selected' : ''}>Lab Report</option>
          <option value="quiz" ${state.filters.assignmentType === 'quiz' ? 'selected' : ''}>Quiz</option>
          <option value="reading" ${state.filters.assignmentType === 'reading' ? 'selected' : ''}>Reading</option>
        </select>

        <select class="form-control" id="asg-filter-priority" style="width:auto; min-width:120px; padding:0.375rem 0.625rem; font-size:0.8125rem;">
          <option value="all">All Priority</option>
          <option value="high" ${state.filters.assignmentPriority === 'high' ? 'selected' : ''}>High Priority</option>
          <option value="medium" ${state.filters.assignmentPriority === 'medium' ? 'selected' : ''}>Medium Priority</option>
          <option value="low" ${state.filters.assignmentPriority === 'low' ? 'selected' : ''}>Low Priority</option>
        </select>
      </div>

      <!-- View Container -->
      ${isKanban ? `
        <div class="kanban-board">
          <div class="kanban-column">
            <div class="kanban-col-header">
              <span class="kanban-col-title">To Do</span>
              <span class="kanban-col-count">${allAssignments.filter(a => a.status === 'not-started').length}</span>
            </div>
            <div class="kanban-cards-list">
              ${allAssignments.filter(a => a.status === 'not-started').map(a => renderTaskItemHTML(a)).join('') || '<div style="color:var(--text-muted); font-size:0.75rem; text-align:center; padding:1rem;">Empty</div>'}
            </div>
          </div>

          <div class="kanban-column">
            <div class="kanban-col-header">
              <span class="kanban-col-title">In Progress</span>
              <span class="kanban-col-count">${allAssignments.filter(a => a.status === 'in-progress').length}</span>
            </div>
            <div class="kanban-cards-list">
              ${allAssignments.filter(a => a.status === 'in-progress').map(a => renderTaskItemHTML(a)).join('') || '<div style="color:var(--text-muted); font-size:0.75rem; text-align:center; padding:1rem;">Empty</div>'}
            </div>
          </div>

          <div class="kanban-column">
            <div class="kanban-col-header">
              <span class="kanban-col-title">Completed</span>
              <span class="kanban-col-count">${allAssignments.filter(a => a.status === 'completed').length}</span>
            </div>
            <div class="kanban-cards-list">
              ${allAssignments.filter(a => a.status === 'completed').map(a => renderTaskItemHTML(a)).join('') || '<div style="color:var(--text-muted); font-size:0.75rem; text-align:center; padding:1rem;">Empty</div>'}
            </div>
          </div>
        </div>
      ` : `
        <div class="card-panel">
          ${allAssignments.length > 0 ? allAssignments.map(task => renderTaskItemHTML(task)).join('') : `
            <div class="empty-state-box">
              <div class="empty-state-icon">📋</div>
              <div class="empty-state-title">No assignments found</div>
              <p class="empty-state-desc">Create your first homework or project assignment to start tracking deadlines.</p>
              <button class="btn-primary" id="btn-empty-asg-create">+ Add Assignment</button>
            </div>
          `}
        </div>
      `}
    `;

    container.querySelector('#btn-create-assignment')?.addEventListener('click', () => openAssignmentModal());
    container.querySelector('#btn-empty-asg-create')?.addEventListener('click', () => openAssignmentModal());

    container.querySelector('#btn-view-list')?.addEventListener('click', () => {
      state.assignmentViewMode = 'list';
      renderAssignmentsView();
    });
    container.querySelector('#btn-view-kanban')?.addEventListener('click', () => {
      state.assignmentViewMode = 'kanban';
      renderAssignmentsView();
    });

    container.querySelector('#asg-filter-class')?.addEventListener('change', (e) => {
      state.filters.assignmentClass = e.target.value;
      renderAssignmentsView();
    });
    container.querySelector('#asg-filter-status')?.addEventListener('change', (e) => {
      state.filters.assignmentStatus = e.target.value;
      renderAssignmentsView();
    });
    container.querySelector('#asg-filter-type')?.addEventListener('change', (e) => {
      state.filters.assignmentType = e.target.value;
      renderAssignmentsView();
    });
    container.querySelector('#asg-filter-priority')?.addEventListener('change', (e) => {
      state.filters.assignmentPriority = e.target.value;
      renderAssignmentsView();
    });

    bindTaskItemEvents(container);
  }

  // --- VIEW: EXAMS ---
  function renderExamsView() {
    const container = document.getElementById('view-exams');
    if (!container) return;

    const exams = store.getExams();
    const todayStr = new Date().toISOString().split('T')[0];

    const upcomingExams = exams.filter(e => e.date >= todayStr).sort((a, b) => a.date.localeCompare(b.date));
    const pastExams = exams.filter(e => e.date < todayStr).sort((a, b) => b.date.localeCompare(a.date));

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h1 class="section-title">Exams & Test Schedules</h1>
          <p class="section-subtitle">Countdown timers, seat assignments, study topics, and test scores.</p>
        </div>
        <div class="header-actions">
          <button class="btn-primary" id="btn-create-exam">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span>+ Schedule Exam</span>
          </button>
        </div>
      </div>

      <div style="margin-bottom:1.5rem;">
        <h2 style="font-size:1rem; font-weight:700; color:var(--text-primary); margin-bottom:0.75rem;">Upcoming Exams (${upcomingExams.length})</h2>
        <div class="exam-cards-grid">
          ${upcomingExams.length > 0 ? upcomingExams.map(e => renderExamCardHTML(e)).join('') : `
            <div class="empty-state-box" style="grid-column: 1 / -1;">
              <div class="empty-state-icon">📝</div>
              <div class="empty-state-title">No upcoming exams</div>
              <p class="empty-state-desc">Schedule your midterm, final, or unit test dates to start preparing.</p>
              <button class="btn-primary" id="btn-empty-exam-create">+ Schedule Exam</button>
            </div>
          `}
        </div>
      </div>

      ${pastExams.length > 0 ? `
        <div>
          <h2 style="font-size:1rem; font-weight:700; color:var(--text-primary); margin-bottom:0.75rem;">Past & Graded Exams (${pastExams.length})</h2>
          <div class="exam-cards-grid">
            ${pastExams.map(e => renderExamCardHTML(e, true)).join('')}
          </div>
        </div>
      ` : ''}
    `;

    container.querySelector('#btn-create-exam')?.addEventListener('click', () => openExamModal());
    container.querySelector('#btn-empty-exam-create')?.addEventListener('click', () => openExamModal());

    bindExamCardEvents(container);
  }

  function renderExamCardHTML(exam, isPast = false) {
    const cls = store.getClassById(exam.classId);
    const days = getDaysUntil(exam.date);

    return `
      <div class="exam-card" style="--exam-color: ${cls ? cls.color : 'var(--accent)'};" data-exam-id="${exam.id}">
        <div class="exam-header">
          <div>
            ${cls ? `<span class="badge" style="background:${cls.color}20; color:${cls.color}; margin-bottom:0.375rem;">${cls.name}</span>` : ''}
            <div class="exam-title">${exam.title}</div>
          </div>
          <span class="exam-countdown-pill ${isPast ? 'future' : (days <= 2 ? 'urgent' : (days <= 7 ? 'soon' : 'future'))}">
            ${isPast ? 'Completed' : (days === 0 ? 'Today' : (days === 1 ? 'Tomorrow' : `${days} days left`))}
          </span>
        </div>

        <div class="exam-details-grid">
          <div class="exam-detail-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            ${new Date(exam.date).toLocaleDateString([], { month: 'short', day: 'numeric', weekday: 'short' })}
          </div>
          <div class="exam-detail-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            ${exam.startTime} (${exam.duration || 60}m)
          </div>
          ${exam.room ? `
            <div class="exam-detail-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              ${exam.room} ${exam.seatNumber ? `· ${exam.seatNumber}` : ''}
            </div>
          ` : ''}
          ${exam.scoreEarned !== null ? `
            <div class="exam-detail-item" style="color:var(--success-text); font-weight:700;">
              Score: ${exam.scoreEarned}/${exam.maxScore || 100} (${Math.round((exam.scoreEarned / (exam.maxScore || 100)) * 100)}%)
            </div>
          ` : ''}
        </div>

        ${Array.isArray(exam.topics) && exam.topics.length > 0 ? `
          <div style="margin-top:0.5rem; font-size:0.75rem; border-top:1px solid var(--border-subtle); padding-top:0.5rem;">
            <div style="font-weight:700; color:var(--text-muted); margin-bottom:0.25rem; font-size:0.6875rem; text-transform:uppercase;">Study Topics:</div>
            <div style="display:flex; flex-wrap:wrap; gap:0.25rem;">
              ${exam.topics.map(t => `<span class="badge neutral" style="font-size:0.6875rem;">${t}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        <div style="display:flex; justify-content:flex-end; gap:0.375rem; margin-top:0.875rem; border-top:1px solid var(--border-subtle); padding-top:0.625rem;">
          <button class="btn-ghost" data-action="edit-exam" style="font-size:0.75rem;">Edit</button>
          <button class="btn-ghost" data-action="delete-exam" style="font-size:0.75rem; color:var(--danger);">Delete</button>
        </div>
      </div>
    `;
  }

  function bindExamCardEvents(parent) {
    parent.querySelectorAll('[data-action="edit-exam"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const examId = e.target.closest('.exam-card').getAttribute('data-exam-id');
        const exam = store.getExams().find(ex => ex.id === examId);
        if (exam) openExamModal(exam);
      });
    });

    parent.querySelectorAll('[data-action="delete-exam"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const examId = e.target.closest('.exam-card').getAttribute('data-exam-id');
        if (confirm('Delete this exam?')) {
          store.deleteExam(examId);
          showToast('Exam deleted', 'info');
        }
      });
    });
  }

  // --- VIEW: CALENDAR ---
  function renderCalendarView() {
    const container = document.getElementById('view-calendar');
    if (!container) return;

    const curDate = state.calendarDate;
    const year = curDate.getFullYear();
    const month = curDate.getMonth();

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const assignments = store.getAssignments();
    const exams = store.getExams();

    let calendarCellsHTML = '';

    // Prev month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      calendarCellsHTML += `
        <div class="calendar-day-cell other-month">
          <span class="calendar-day-number">${daysInPrevMonth - i}</span>
        </div>
      `;
    }

    // Current month days
    const today = new Date();
    const isThisMonth = today.getFullYear() === year && today.getMonth() === month;

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isThisMonth && today.getDate() === day;
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      const dayAsgs = assignments.filter(a => a.dueDate && a.dueDate.startsWith(dateStr));
      const dayExams = exams.filter(e => e.date === dateStr);

      calendarCellsHTML += `
        <div class="calendar-day-cell ${isToday ? 'today' : ''}" data-date="${dateStr}">
          <span class="calendar-day-number">${day}</span>
          <div style="display:flex; flex-direction:column; gap:2px; margin-top:2px; overflow:hidden;">
            ${dayExams.map(e => `<span class="cal-event-pill" style="background:#ef4444;">📝 ${e.title}</span>`).join('')}
            ${dayAsgs.map(a => {
              const cls = store.getClassById(a.classId);
              return `<span class="cal-event-pill" style="background:${cls ? cls.color : 'var(--accent)'};">${a.title}</span>`;
            }).join('')}
          </div>
        </div>
      `;
    }

    // Fill remaining grid slots
    const totalRendered = firstDay + daysInMonth;
    const nextPadding = totalRendered <= 35 ? (35 - totalRendered) : (42 - totalRendered);
    for (let i = 1; i <= nextPadding; i++) {
      calendarCellsHTML += `
        <div class="calendar-day-cell other-month">
          <span class="calendar-day-number">${i}</span>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h1 class="section-title">Academic Calendar</h1>
          <p class="section-subtitle">Visual overview of deadlines, exam sessions, and schedule.</p>
        </div>
        <div class="header-actions">
          <button class="btn-secondary" id="cal-btn-prev">‹ Prev</button>
          <button class="btn-secondary" id="cal-btn-today">Today</button>
          <button class="btn-secondary" id="cal-btn-next">Next ›</button>
          <button class="btn-primary" id="cal-btn-add">+ Add Task</button>
        </div>
      </div>

      <div class="calendar-container">
        <div class="calendar-header">
          <h2 style="font-size:1.125rem; font-weight:700; color:var(--text-primary);">
            ${monthNames[month]} ${year}
          </h2>
        </div>

        <div class="calendar-grid-header">
          <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
        </div>

        <div class="calendar-days-matrix">
          ${calendarCellsHTML}
        </div>
      </div>
    `;

    container.querySelector('#cal-btn-prev')?.addEventListener('click', () => {
      state.calendarDate.setMonth(state.calendarDate.getMonth() - 1);
      renderCalendarView();
    });
    container.querySelector('#cal-btn-next')?.addEventListener('click', () => {
      state.calendarDate.setMonth(state.calendarDate.getMonth() + 1);
      renderCalendarView();
    });
    container.querySelector('#cal-btn-today')?.addEventListener('click', () => {
      state.calendarDate = new Date();
      renderCalendarView();
    });
    container.querySelector('#cal-btn-add')?.addEventListener('click', () => openAssignmentModal());

    container.querySelectorAll('.calendar-day-cell:not(.other-month)').forEach(cell => {
      cell.addEventListener('click', () => {
        const dateStr = cell.getAttribute('data-date');
        openAssignmentModal({ dueDate: `${dateStr}T23:59:00` });
      });
    });
  }

  // --- VIEW: SCHEDULE / TIMETABLE ---
  function renderScheduleView() {
    const container = document.getElementById('view-schedule');
    if (!container) return;

    const classes = store.getClasses();
    const schedule = store.getSchedule();

    const days = [
      { id: 1, name: 'Mon' },
      { id: 2, name: 'Tue' },
      { id: 3, name: 'Wed' },
      { id: 4, name: 'Thu' },
      { id: 5, name: 'Fri' }
    ];

    const timeSlots = [
      '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
    ];

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h1 class="section-title">Weekly Timetable</h1>
          <p class="section-subtitle">Weekly recurring class schedule and lecture times.</p>
        </div>
        <div class="header-actions">
          <button class="btn-primary" id="btn-add-schedule-slot">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span>+ Add Class Slot</span>
          </button>
        </div>
      </div>

      ${classes.length === 0 ? `
        <div class="empty-state-box">
          <div class="empty-state-icon">🕒</div>
          <div class="empty-state-title">No timetable slots configured</div>
          <p class="empty-state-desc">First create your courses, then add meeting times to view your weekly matrix.</p>
          <button class="btn-primary" id="btn-empty-sched-class">+ Add Course First</button>
        </div>
      ` : `
        <div class="timetable-grid">
          <div class="timetable-header-cell">Time</div>
          ${days.map(d => `<div class="timetable-header-cell">${d.name}</div>`).join('')}

          ${timeSlots.map(time => `
            <div class="timetable-time-slot">${time}</div>
            ${days.map(d => {
              const slot = schedule.find(s => s.dayOfWeek === d.id && s.startTime.startsWith(time.slice(0, 2)));
              if (slot) {
                const cls = store.getClassById(slot.classId);
                return `
                  <div class="timetable-cell">
                    <div class="timetable-class-block" style="background:${cls ? cls.color : 'var(--accent)'};" title="Click to delete slot" data-slot-id="${slot.id}">
                      <div>${cls ? cls.name : 'Class'}</div>
                      <div style="font-size:0.625rem; opacity:0.9;">${slot.room ? `Room ${slot.room}` : ''}</div>
                    </div>
                  </div>
                `;
              }
              return `<div class="timetable-cell"></div>`;
            }).join('')}
          `).join('')}
        </div>
      `}
    `;

    container.querySelector('#btn-add-schedule-slot')?.addEventListener('click', () => openScheduleModal());
    container.querySelector('#btn-empty-sched-class')?.addEventListener('click', () => openClassModal());

    container.querySelectorAll('.timetable-class-block').forEach(block => {
      block.addEventListener('click', () => {
        const slotId = block.getAttribute('data-slot-id');
        if (confirm('Delete this timetable time slot?')) {
          store.deleteScheduleSlot(slotId);
          showToast('Schedule slot removed', 'info');
        }
      });
    });
  }

  // --- VIEW: GRADES & SIMULATOR ---
  function renderGradesView() {
    const container = document.getElementById('view-grades');
    if (!container) return;

    const classes = store.getClasses();
    const gpaData = store.calculateOverallGPA();

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h1 class="section-title">Grades & What-If Simulator</h1>
          <p class="section-subtitle">Calculate weighted course grades, simulate final exam scores, and track GPA.</p>
        </div>
      </div>

      <!-- GPA Hero Card -->
      <div class="card-panel" style="background:linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-subtle) 100%); border-left: 5px solid var(--accent); margin-bottom:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div>
            <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-muted);">Term Cumulative GPA</div>
            <div style="font-size:2.25rem; font-weight:800; color:var(--text-primary); letter-spacing:-0.03em; margin:0.25rem 0;">
              ${gpaData.gpa !== null ? gpaData.gpa.toFixed(2) : '—'} <span style="font-size:1rem; color:var(--text-muted); font-weight:500;">/ 4.00</span>
            </div>
            <div style="font-size:0.8125rem; color:var(--text-secondary);">
              Based on ${gpaData.gradedCount} graded course${gpaData.gradedCount === 1 ? '' : 's'} (${gpaData.totalCredits} total credits)
            </div>
          </div>
          <div style="display:flex; gap:0.5rem; align-items:center;">
            <div style="text-align:right;">
              <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">Overall Standing</div>
              <div style="font-size:1.25rem; font-weight:800; color:var(--accent);">
                ${gpaData.gpa !== null ? store.percentageToLetter((gpaData.gpa / 4) * 100) : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Course Breakdown Grid -->
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
        ${classes.map(c => {
          const grade = store.calculateClassGrade(c.id);
          return `
            <div class="card-panel" style="margin-bottom:0; display:flex; flex-direction:column;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
                <div>
                  <span class="badge" style="background:${c.color}20; color:${c.color}; margin-bottom:0.25rem;">${c.code || 'Course'}</span>
                  <div style="font-weight:700; font-size:1rem; color:var(--text-primary);">${c.name}</div>
                </div>
                <div style="text-align:right;">
                  <div style="font-size:1.25rem; font-weight:800; color:var(--text-primary);">${grade.score !== null ? `${grade.score}%` : '—'}</div>
                  <span class="badge ${grade.score >= 90 ? 'success' : (grade.score >= 80 ? 'primary' : 'neutral')}">${grade.letter}</span>
                </div>
              </div>

              <!-- Categories Breakdown -->
              <div style="display:flex; flex-direction:column; gap:0.375rem; margin-top:auto; font-size:0.75rem;">
                ${grade.categories.map(cat => `
                  <div>
                    <div style="display:flex; justify-content:space-between; color:var(--text-secondary); margin-bottom:2px;">
                      <span>${cat.name} (${cat.weight}%)</span>
                      <span style="font-weight:700;">${cat.percentage !== null ? `${Math.round(cat.percentage)}%` : 'No scores'}</span>
                    </div>
                    <div style="height:5px; background:var(--bg-surface-hover); border-radius:var(--radius-full); overflow:hidden;">
                      <div style="width:${cat.percentage !== null ? Math.min(100, cat.percentage) : 0}%; height:100%; background:${c.color};"></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('') || '<div class="empty-state-box" style="grid-column:1/-1;"><div class="empty-state-title">No classes enrolled</div><p class="empty-state-desc">Add courses in Classes Directory to calculate grades.</p></div>'}
      </div>

      <!-- What-If Simulator Panel -->
      <div class="card-panel">
        <h3 class="panel-title" style="margin-bottom:0.5rem;">🎯 "What-If" Final Grade Simulator</h3>
        <p style="font-size:0.8125rem; color:var(--text-secondary); margin-bottom:1rem;">
          Calculate the exact score needed on your next exam or final to achieve your target letter grade.
        </p>

        <div class="form-row" style="margin-bottom:1rem;">
          <div class="form-group">
            <label class="form-label">Select Course</label>
            <select class="form-control" id="sim-class-select">
              ${classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Desired Target Grade (%)</label>
            <input type="number" class="form-control" id="sim-target-score" value="90" min="50" max="100" />
          </div>

          <div class="form-group">
            <label class="form-label">Upcoming Exam Weight (%)</label>
            <input type="number" class="form-control" id="sim-weight-score" value="25" min="5" max="100" />
          </div>
        </div>

        <button class="btn-primary" id="btn-calculate-whatif">Calculate Required Score</button>

        <div id="sim-result-container" style="margin-top:1rem; display:none; padding:1rem; background:var(--bg-surface-subtle); border-radius:var(--radius-md); border:1px solid var(--border-default);"></div>
      </div>
    `;

    container.querySelector('#btn-calculate-whatif')?.addEventListener('click', () => {
      const classId = container.querySelector('#sim-class-select').value;
      const target = Number(container.querySelector('#sim-target-score').value) || 90;
      const weight = Number(container.querySelector('#sim-weight-score').value) || 25;

      const result = store.simulateWhatIfGrade(classId, target, weight);
      const resBox = container.querySelector('#sim-result-container');
      if (!resBox) return;

      resBox.style.display = 'block';
      const isDoable = result.requiredScore <= 100 && result.requiredScore >= 0;

      resBox.innerHTML = `
        <div style="font-weight:700; font-size:0.9375rem; color:var(--text-primary); margin-bottom:0.25rem;">
          Simulation Result
        </div>
        <div style="font-size:0.875rem; color:var(--text-secondary);">
          To finish with a <b style="color:var(--accent);">${target}% (${store.percentageToLetter(target)})</b>, you need to score at least:
        </div>
        <div style="font-size:2rem; font-weight:800; color:${isDoable ? 'var(--success)' : 'var(--danger)'}; margin:0.5rem 0;">
          ${result.requiredScore}%
        </div>
        <div style="font-size:0.75rem; color:var(--text-muted);">
          ${isDoable ? '✓ This target is mathematically achievable!' : '⚠️ This required score exceeds 100% based on current weighting.'}
        </div>
      `;
    });
  }

  // --- VIEW: CLASSES DIRECTORY ---
  function renderClassesView() {
    const container = document.getElementById('view-classes');
    if (!container) return;

    const classes = store.getClasses();

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h1 class="section-title">Courses & Classes</h1>
          <p class="section-subtitle">Instructors, office hours, grade categories, and syllabus details.</p>
        </div>
        <div class="header-actions">
          <button class="btn-primary" id="btn-add-class">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span>+ Add Course</span>
          </button>
        </div>
      </div>

      <div class="classes-grid">
        ${classes.length > 0 ? classes.map(c => `
          <div class="class-card" data-class-id="${c.id}">
            <div class="class-card-header">
              <div>
                <span class="badge" style="background:${c.color}20; color:${c.color}; margin-bottom:0.25rem;">${c.code || 'Course'}</span>
                <div class="class-card-name">${c.name}</div>
              </div>
              <div style="width:14px; height:14px; border-radius:50%; background:${c.color};"></div>
            </div>

            <div style="font-size:0.8125rem; color:var(--text-secondary); margin-bottom:0.75rem; display:flex; flex-direction:column; gap:0.25rem;">
              ${c.teacher ? `<div>👨‍🏫 ${c.teacher} ${c.teacherEmail ? `(<a href="mailto:${c.teacherEmail}" style="color:var(--accent); text-decoration:underline;">${c.teacherEmail}</a>)` : ''}</div>` : ''}
              ${c.room ? `<div>📍 Room ${c.room}</div>` : ''}
              <div>🎓 ${c.credits || 3} Credit Hours</div>
            </div>

            <div style="margin-top:auto; border-top:1px solid var(--border-subtle); padding-top:0.625rem; font-size:0.75rem;">
              <div style="font-weight:700; color:var(--text-muted); margin-bottom:0.25rem; font-size:0.6875rem; text-transform:uppercase;">Grading Categories:</div>
              <div style="display:flex; flex-wrap:wrap; gap:0.25rem;">
                ${(c.gradeCategories || []).map(cat => `<span class="badge neutral">${cat.name}: ${cat.weight}%</span>`).join('')}
              </div>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:0.375rem; margin-top:0.75rem; border-top:1px solid var(--border-subtle); padding-top:0.5rem;">
              <button class="btn-ghost" data-action="edit-class" style="font-size:0.75rem;">Edit</button>
              <button class="btn-ghost" data-action="delete-class" style="font-size:0.75rem; color:var(--danger);">Delete</button>
            </div>
          </div>
        `).join('') : `
          <div class="empty-state-box" style="grid-column:1/-1;">
            <div class="empty-state-icon">📚</div>
            <div class="empty-state-title">No courses added</div>
            <p class="empty-state-desc">Add your academic classes to manage timetables, calculate GPA, and track homework.</p>
            <button class="btn-primary" id="btn-empty-class-create">+ Add Course</button>
          </div>
        `}
      </div>
    `;

    container.querySelector('#btn-add-class')?.addEventListener('click', () => openClassModal());
    container.querySelector('#btn-empty-class-create')?.addEventListener('click', () => openClassModal());

    container.querySelectorAll('[data-action="edit-class"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const classId = e.target.closest('.class-card').getAttribute('data-class-id');
        const cls = store.getClassById(classId);
        if (cls) openClassModal(cls);
      });
    });

    container.querySelectorAll('[data-action="delete-class"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const classId = e.target.closest('.class-card').getAttribute('data-class-id');
        if (confirm('Delete this course? All associated assignments and schedule slots will also be removed.')) {
          store.deleteClass(classId);
          showToast('Course deleted', 'info');
        }
      });
    });
  }

  // --- VIEW: ANALYTICS ---
  function renderAnalyticsView() {
    const container = document.getElementById('view-analytics');
    if (!container) return;

    const assignments = store.getAssignments();
    const completed = assignments.filter(a => a.status === 'completed').length;
    const inProgress = assignments.filter(a => a.status === 'in-progress').length;
    const notStarted = assignments.filter(a => a.status === 'not-started').length;
    const total = assignments.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h1 class="section-title">Academic Analytics</h1>
          <p class="section-subtitle">Workload distribution, task completion rates, and study performance.</p>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
        <div class="card-panel">
          <div style="font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Overall Completion</div>
          <div style="font-size:2rem; font-weight:800; color:var(--accent); margin:0.25rem 0;">${completionRate}%</div>
          <div style="font-size:0.8125rem; color:var(--text-secondary);">${completed} of ${total} tasks completed</div>
        </div>

        <div class="card-panel">
          <div style="font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">In Progress</div>
          <div style="font-size:2rem; font-weight:800; color:var(--warning); margin:0.25rem 0;">${inProgress}</div>
          <div style="font-size:0.8125rem; color:var(--text-secondary);">Currently working on</div>
        </div>

        <div class="card-panel">
          <div style="font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Pending Start</div>
          <div style="font-size:2rem; font-weight:800; color:var(--text-muted); margin:0.25rem 0;">${notStarted}</div>
          <div style="font-size:0.8125rem; color:var(--text-secondary);">Not yet started</div>
        </div>
      </div>
    `;
  }

  // --- VIEW: SETTINGS & BACKUP ---
  function renderSettingsView() {
    const container = document.getElementById('view-settings');
    if (!container) return;

    const data = store.getState();
    const studentName = data.settings.studentName || 'Student';
    const schoolName = data.settings.schoolName || '';
    const avatarColor = data.settings.avatarColor || AVATAR_PALETTES[0];
    const initials = studentName.split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'ST';

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h1 class="section-title">Settings & Storage</h1>
          <p class="section-subtitle">Local student profile, appearance preferences, calendar export, and data backups.</p>
        </div>
      </div>

      <div style="max-width:760px; display:flex; flex-direction:column; gap:1.25rem;">
        <!-- Local Profile Card -->
        <div class="card-panel" style="border-left: 5px solid var(--accent);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <h3 class="panel-title" style="margin:0;">👤 Student Profile</h3>
            <span class="badge success">✓ Saved Locally in Browser</span>
          </div>
          
          <div style="display:flex; align-items:center; gap:0.875rem; padding:0.75rem; background:var(--bg-surface-subtle); border-radius:var(--radius-md); margin-bottom:1rem;">
            <div class="user-avatar" style="width:42px; height:42px; font-size:1rem; background:${avatarColor};">${initials}</div>
            <div>
              <div style="font-weight:700; font-size:0.9375rem; color:var(--text-primary);">${studentName}</div>
              <div style="font-size:0.75rem; color:var(--text-secondary);">${schoolName || 'Student Workspace'} · All data preserved across refreshes</div>
            </div>
          </div>
          
          <button class="btn-primary" id="btn-settings-edit-profile">Edit Profile Details</button>
        </div>

        <!-- Appearance -->
        <div class="card-panel">
          <h3 class="panel-title" style="margin-bottom:0.75rem;">Appearance & Theme</h3>
          <div style="display:flex; gap:0.75rem;">
            <button class="btn-secondary" id="btn-theme-light">☀️ Light Theme</button>
            <button class="btn-secondary" id="btn-theme-dark">🌙 Dark Theme</button>
          </div>
        </div>

        <!-- Export & Backup Card -->
        <div class="card-panel">
          <h3 class="panel-title" style="margin-bottom:0.5rem;">Data Export & Backup</h3>
          <p style="font-size:0.8125rem; color:var(--text-secondary); margin-bottom:1rem;">
            Export calendar feed (.ics) for Google/Apple Calendar, or download a full JSON backup.
          </p>

          <div style="display:flex; flex-wrap:wrap; gap:0.625rem;">
            <button class="btn-secondary" id="btn-export-ical">
              📅 Download iCal (.ics) Calendar Feed
            </button>
            <button class="btn-secondary" id="btn-export-json">
              💾 Export Full JSON Backup
            </button>
            <label class="btn-secondary" style="cursor:pointer;">
              📥 Restore from JSON
              <input type="file" id="input-import-json" accept=".json" style="display:none;" />
            </label>
          </div>
        </div>

        <!-- Sample Data & Reset -->
        <div class="card-panel">
          <h3 class="panel-title" style="margin-bottom:0.5rem;">Demo Data & Reset</h3>
          <p style="font-size:0.8125rem; color:var(--text-secondary); margin-bottom:1rem;">
            Load sample courses and assignments for testing, or reset all data back to zero.
          </p>
          <div style="display:flex; gap:0.625rem; flex-wrap:wrap;">
            <button class="btn-secondary" id="btn-load-demo-settings">
              ✨ Load Sample / Demo Data
            </button>
            <button class="btn-secondary" id="btn-reset-clean-settings" style="color:var(--danger); border-color:var(--danger-border);">
              🔄 Reset to Clean Zero State
            </button>
          </div>
        </div>
      </div>
    `;

    container.querySelector('#btn-settings-edit-profile')?.addEventListener('click', () => openProfileModal());

    container.querySelector('#btn-theme-light')?.addEventListener('click', () => {
      store.updateSettings({ theme: 'light' });
      applyTheme('light');
      showToast('Light theme applied', 'info');
    });
    container.querySelector('#btn-theme-dark')?.addEventListener('click', () => {
      store.updateSettings({ theme: 'dark' });
      applyTheme('dark');
      showToast('Dark theme applied', 'info');
    });

    container.querySelector('#btn-export-ical')?.addEventListener('click', () => {
      const icsContent = store.generateICalString();
      downloadFile(icsContent, 'academiapro-calendar.ics', 'text/calendar');
      showToast('iCal calendar downloaded!', 'success');
    });

    container.querySelector('#btn-export-json')?.addEventListener('click', () => {
      const jsonStr = JSON.stringify(store.getState(), null, 2);
      downloadFile(jsonStr, 'academiapro-backup.json', 'application/json');
      showToast('JSON backup downloaded!', 'success');
    });

    const importInput = container.querySelector('#input-import-json');
    if (importInput) {
      importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const parsed = JSON.parse(event.target.result);
            store.data = store.validateAndMigrate(parsed);
            store.saveToStorage(store.data);
            store.notify('data_imported');
            showToast('Data restored successfully!', 'success');
            renderSettingsView();
          } catch (err) {
            alert('Failed to parse backup JSON file: ' + err.message);
          }
        };
        reader.readAsText(file);
      });
    }

    container.querySelector('#btn-load-demo-settings')?.addEventListener('click', () => {
      if (confirm('Load sample courses, assignments, and exams for testing?')) {
        store.loadDemoDataPreset();
        showToast('Sample demo data loaded!', 'success');
        renderSettingsView();
      }
    });

    container.querySelector('#btn-reset-clean-settings')?.addEventListener('click', () => {
      if (confirm('Permanently reset all coursework, tasks, and classes to a clean zero state?')) {
        store.resetToEmptyData();
        showToast('Planner reset to zero state', 'info');
        renderSettingsView();
      }
    });
  }

  // --- MODALS ENGINE ---

  function openModalHTML(htmlContent, onRenderCallback) {
    if (!elements.modalContainer || !elements.modalOverlay) return;
    elements.modalContainer.innerHTML = htmlContent;
    elements.modalOverlay.classList.add('active');
    state.modalContext = true;

    const closeBtn = elements.modalContainer.querySelector('#modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    elements.modalOverlay.onclick = (e) => {
      if (e.target === elements.modalOverlay) closeModal();
    };

    if (typeof onRenderCallback === 'function') {
      onRenderCallback(elements.modalContainer);
    }
  }

  function closeModal() {
    if (elements.modalOverlay) elements.modalOverlay.classList.remove('active');
    if (elements.modalContainer) elements.modalContainer.innerHTML = '';
    state.modalContext = null;
  }

  // Quick Add Universal Modal (Press Q or Click + Add)
  function openQuickAddModal() {
    const html = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h2 class="modal-title">Quick Add</h2>
          <button class="modal-close-btn" id="modal-close">✕</button>
        </div>
        <div class="modal-body">
          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.75rem; margin-bottom:1rem;">
            <button class="onboarding-step-item" id="quick-btn-task" style="text-align:center; cursor:pointer;">
              <span style="font-size:1.5rem; margin-bottom:0.25rem;">📋</span>
              <span style="font-weight:700; font-size:0.875rem;">Assignment</span>
            </button>
            <button class="onboarding-step-item" id="quick-btn-exam" style="text-align:center; cursor:pointer;">
              <span style="font-size:1.5rem; margin-bottom:0.25rem;">📝</span>
              <span style="font-weight:700; font-size:0.875rem;">Exam</span>
            </button>
            <button class="onboarding-step-item" id="quick-btn-class" style="text-align:center; cursor:pointer;">
              <span style="font-size:1.5rem; margin-bottom:0.25rem;">📚</span>
              <span style="font-weight:700; font-size:0.875rem;">Course</span>
            </button>
          </div>
        </div>
      </div>
    `;

    openModalHTML(html, dialog => {
      dialog.querySelector('#quick-btn-task')?.addEventListener('click', () => {
        closeModal();
        openAssignmentModal();
      });
      dialog.querySelector('#quick-btn-exam')?.addEventListener('click', () => {
        closeModal();
        openExamModal();
      });
      dialog.querySelector('#quick-btn-class')?.addEventListener('click', () => {
        closeModal();
        openClassModal();
      });
    });
  }

  // Profile Modal
  function openProfileModal() {
    const data = store.getState();
    const curName = data.settings.studentName || 'Student';
    const curSchool = data.settings.schoolName || '';
    const curColor = data.settings.avatarColor || AVATAR_PALETTES[0];
    const initials = curName.split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'ST';

    const html = `
      <div class="modal-dialog" style="max-width:440px;">
        <div class="modal-header">
          <h2 class="modal-title">Student Profile</h2>
          <button class="modal-close-btn" id="modal-close">✕</button>
        </div>
        <div class="modal-body">
          <div style="display:flex; align-items:center; gap:0.875rem; padding:0.875rem; background:var(--bg-surface-subtle); border-radius:var(--radius-md); margin-bottom:1rem;">
            <div class="user-avatar" id="modal-avatar-preview" style="width:48px; height:48px; font-size:1.125rem; background:${curColor};">${initials}</div>
            <div>
              <div style="font-weight:700; font-size:1rem; color:var(--text-primary);" id="modal-name-preview">${curName}</div>
              <div style="font-size:0.75rem; color:var(--text-secondary);">${curSchool || 'Student Workspace'}</div>
            </div>
          </div>

          <form id="form-profile">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-control" id="profile-input-name" value="${curName}" required maxlength="60" />
            </div>

            <div class="form-group">
              <label class="form-label">School / University</label>
              <input type="text" class="form-control" id="profile-input-school" value="${curSchool}" placeholder="e.g. Westwood Academy" maxlength="100" />
            </div>

            <div class="form-group">
              <label class="form-label">Avatar Color Theme</label>
              <div style="display:flex; gap:0.375rem; flex-wrap:wrap;" id="profile-color-picker">
                ${AVATAR_PALETTES.map((c, i) => `
                  <button type="button" class="avatar-color-option ${c === curColor ? 'selected' : ''}" data-color="${c}" style="background:${c}; width:28px; height:28px;"></button>
                `).join('')}
              </div>
            </div>

            <div class="modal-footer" style="padding-left:0; padding-right:0; padding-bottom:0; background:none;">
              <button type="button" class="btn-secondary" id="modal-cancel">Cancel</button>
              <button type="submit" class="btn-primary">Save Profile</button>
            </div>
          </form>
        </div>
      </div>
    `;

    openModalHTML(html, dialog => {
      dialog.querySelector('#modal-cancel')?.addEventListener('click', closeModal);

      let chosenColor = curColor;

      dialog.querySelectorAll('#profile-color-picker .avatar-color-option').forEach(btn => {
        btn.addEventListener('click', () => {
          dialog.querySelectorAll('#profile-color-picker .avatar-color-option').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          chosenColor = btn.getAttribute('data-color');
          const av = dialog.querySelector('#modal-avatar-preview');
          if (av) av.style.background = chosenColor;
        });
      });

      const nameIn = dialog.querySelector('#profile-input-name');
      nameIn?.addEventListener('input', () => {
        const val = nameIn.value.trim();
        const init = val.split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'ST';
        const av = dialog.querySelector('#modal-avatar-preview');
        const np = dialog.querySelector('#modal-name-preview');
        if (av) av.textContent = init;
        if (np) np.textContent = val || 'Student';
      });

      const form = dialog.querySelector('#form-profile');
      form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const newName = nameIn.value.trim();
        const newSchool = dialog.querySelector('#profile-input-school').value.trim();
        if (!newName) return;

        store.updateSettings({
          studentName: newName,
          schoolName: newSchool,
          avatarColor: chosenColor,
          isProfileConfigured: true
        });

        showToast('Profile saved!', 'success');
        closeModal();
      });
    });
  }

  // Assignment Modal
  function openAssignmentModal(existing = null) {
    const classes = store.getClasses();
    const isEdit = !!existing;

    const html = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h2 class="modal-title">${isEdit ? 'Edit Assignment' : 'New Assignment'}</h2>
          <button class="modal-close-btn" id="modal-close">✕</button>
        </div>
        <div class="modal-body">
          <form id="form-assignment">
            <div class="form-group">
              <label class="form-label">Assignment Title *</label>
              <input type="text" class="form-control" name="title" required placeholder="e.g. Chapter 4 Problem Set" value="${existing ? existing.title : ''}" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Course *</label>
                <select class="form-control" name="classId" required id="modal-asg-class">
                  ${classes.length > 0 ? classes.map(c => `<option value="${c.id}" ${existing && existing.classId === c.id ? 'selected' : ''}>${c.name}</option>`).join('') : '<option value="">No courses added yet</option>'}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Type</label>
                <select class="form-control" name="type">
                  <option value="homework" ${existing && existing.type === 'homework' ? 'selected' : ''}>Homework</option>
                  <option value="essay" ${existing && existing.type === 'essay' ? 'selected' : ''}>Essay</option>
                  <option value="project" ${existing && existing.type === 'project' ? 'selected' : ''}>Project</option>
                  <option value="lab" ${existing && existing.type === 'lab' ? 'selected' : ''}>Lab Report</option>
                  <option value="quiz" ${existing && existing.type === 'quiz' ? 'selected' : ''}>Quiz</option>
                  <option value="reading" ${existing && existing.type === 'reading' ? 'selected' : ''}>Reading</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Due Date & Time *</label>
                <input type="datetime-local" class="form-control" name="dueDate" required value="${existing ? (existing.dueDate ? existing.dueDate.slice(0, 16) : '') : getRelativeDate(1, '23:59').slice(0, 16)}" />
              </div>

              <div class="form-group">
                <label class="form-label">Priority</label>
                <select class="form-control" name="priority">
                  <option value="high" ${existing && existing.priority === 'high' ? 'selected' : ''}>High</option>
                  <option value="medium" ${!existing || existing.priority === 'medium' ? 'selected' : ''}>Medium</option>
                  <option value="low" ${existing && existing.priority === 'low' ? 'selected' : ''}>Low</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Description / Instructions</label>
              <textarea class="form-control" name="description" placeholder="Instructions, rubric links, questions...">${existing ? (existing.description || '') : ''}</textarea>
            </div>

            <div class="modal-footer" style="padding-left:0; padding-right:0; padding-bottom:0; background:none;">
              <button type="button" class="btn-secondary" id="modal-cancel">Cancel</button>
              <button type="submit" class="btn-primary">${isEdit ? 'Save Changes' : 'Create Assignment'}</button>
            </div>
          </form>
        </div>
      </div>
    `;

    openModalHTML(html, dialog => {
      dialog.querySelector('#modal-cancel')?.addEventListener('click', closeModal);
      const form = dialog.querySelector('#form-assignment');
      form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const data = {
          title: fd.get('title').trim(),
          classId: fd.get('classId'),
          type: fd.get('type'),
          dueDate: fd.get('dueDate'),
          priority: fd.get('priority'),
          description: fd.get('description').trim()
        };

        if (isEdit) {
          store.updateAssignment(existing.id, data);
          showToast('Assignment updated', 'success');
        } else {
          store.addAssignment(data);
          showToast('Assignment created!', 'success');
        }
        closeModal();
      });
    });
  }

  // Exam Modal
  function openExamModal(existing = null) {
    const classes = store.getClasses();
    const isEdit = !!existing;

    const html = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h2 class="modal-title">${isEdit ? 'Edit Exam' : 'Schedule Exam'}</h2>
          <button class="modal-close-btn" id="modal-close">✕</button>
        </div>
        <div class="modal-body">
          <form id="form-exam">
            <div class="form-group">
              <label class="form-label">Exam Title *</label>
              <input type="text" class="form-control" name="title" required placeholder="e.g. Midterm Examination" value="${existing ? existing.title : ''}" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Course *</label>
                <select class="form-control" name="classId" required>
                  ${classes.map(c => `<option value="${c.id}" ${existing && existing.classId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Exam Date *</label>
                <input type="date" class="form-control" name="date" required value="${existing ? existing.date : getRelativeDate(7, '').split('T')[0]}" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Start Time</label>
                <input type="time" class="form-control" name="startTime" value="${existing ? existing.startTime : '09:00'}" />
              </div>

              <div class="form-group">
                <label class="form-label">Duration (Minutes)</label>
                <input type="number" class="form-control" name="duration" value="${existing ? existing.duration : 90}" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Room / Hall</label>
                <input type="text" class="form-control" name="room" placeholder="e.g. Science Bldg 304" value="${existing ? existing.room : ''}" />
              </div>

              <div class="form-group">
                <label class="form-label">Seat / Station Number</label>
                <input type="text" class="form-control" name="seatNumber" placeholder="e.g. Seat 14" value="${existing ? existing.seatNumber : ''}" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Study Topics (comma separated)</label>
              <input type="text" class="form-control" name="topics" placeholder="Limits, Derivatives, Series Tests" value="${existing && Array.isArray(existing.topics) ? existing.topics.join(', ') : ''}" />
            </div>

            <div class="modal-footer" style="padding-left:0; padding-right:0; padding-bottom:0; background:none;">
              <button type="button" class="btn-secondary" id="modal-cancel">Cancel</button>
              <button type="submit" class="btn-primary">${isEdit ? 'Save Changes' : 'Schedule Exam'}</button>
            </div>
          </form>
        </div>
      </div>
    `;

    openModalHTML(html, dialog => {
      dialog.querySelector('#modal-cancel')?.addEventListener('click', closeModal);
      const form = dialog.querySelector('#form-exam');
      form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const rawTopics = fd.get('topics') || '';
        const topics = rawTopics.split(',').map(t => t.trim()).filter(Boolean);

        const data = {
          title: fd.get('title').trim(),
          classId: fd.get('classId'),
          date: fd.get('date'),
          startTime: fd.get('startTime'),
          duration: Number(fd.get('duration')),
          room: fd.get('room').trim(),
          seatNumber: fd.get('seatNumber').trim(),
          topics
        };

        if (isEdit) {
          store.updateExam(existing.id, data);
          showToast('Exam updated', 'success');
        } else {
          store.addExam(data);
          showToast('Exam scheduled!', 'success');
        }
        closeModal();
      });
    });
  }

  // Course Modal
  function openClassModal(existing = null) {
    const isEdit = !!existing;
    const currentColor = existing ? existing.color : SUBJECT_COLORS[0];

    const html = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h2 class="modal-title">${isEdit ? 'Edit Course' : 'New Course'}</h2>
          <button class="modal-close-btn" id="modal-close">✕</button>
        </div>
        <div class="modal-body">
          <form id="form-class">
            <div class="form-group">
              <label class="form-label">Course Name *</label>
              <input type="text" class="form-control" name="name" required placeholder="e.g. AP Calculus BC" value="${existing ? existing.name : ''}" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Course Code</label>
                <input type="text" class="form-control" name="code" placeholder="e.g. MATH 302" value="${existing ? existing.code : ''}" />
              </div>

              <div class="form-group">
                <label class="form-label">Credit Hours</label>
                <input type="number" class="form-control" name="credits" value="${existing ? existing.credits : 3}" min="1" max="10" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Instructor Name</label>
                <input type="text" class="form-control" name="teacher" placeholder="e.g. Dr. Thorne" value="${existing ? existing.teacher : ''}" />
              </div>

              <div class="form-group">
                <label class="form-label">Instructor Email</label>
                <input type="email" class="form-control" name="teacherEmail" placeholder="teacher@school.edu" value="${existing ? existing.teacherEmail : ''}" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Class Color</label>
              <div style="display:flex; gap:0.5rem; flex-wrap:wrap;" id="modal-color-picker">
                ${SUBJECT_COLORS.map(c => `
                  <button type="button" class="avatar-color-option ${c === currentColor ? 'selected' : ''}" data-color="${c}" style="background:${c}; width:28px; height:28px;"></button>
                `).join('')}
              </div>
              <input type="hidden" name="color" id="class-selected-color" value="${currentColor}" />
            </div>

            <div class="modal-footer" style="padding-left:0; padding-right:0; padding-bottom:0; background:none;">
              <button type="button" class="btn-secondary" id="modal-cancel">Cancel</button>
              <button type="submit" class="btn-primary">${isEdit ? 'Save Changes' : 'Create Course'}</button>
            </div>
          </form>
        </div>
      </div>
    `;

    openModalHTML(html, dialog => {
      dialog.querySelector('#modal-cancel')?.addEventListener('click', closeModal);

      dialog.querySelectorAll('#modal-color-picker .avatar-color-option').forEach(btn => {
        btn.addEventListener('click', () => {
          dialog.querySelectorAll('#modal-color-picker .avatar-color-option').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          dialog.querySelector('#class-selected-color').value = btn.getAttribute('data-color');
        });
      });

      const form = dialog.querySelector('#form-class');
      form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const data = {
          name: fd.get('name').trim(),
          code: fd.get('code').trim(),
          credits: Number(fd.get('credits')),
          teacher: fd.get('teacher').trim(),
          teacherEmail: fd.get('teacherEmail').trim(),
          color: fd.get('color')
        };

        if (isEdit) {
          store.updateClass(existing.id, data);
          showToast('Course updated', 'success');
        } else {
          store.addClass(data);
          showToast('Course created!', 'success');
        }
        closeModal();
      });
    });
  }

  // Schedule Slot Modal
  function openScheduleModal() {
    const classes = store.getClasses();
    if (classes.length === 0) {
      alert('Please add a course first before scheduling class times.');
      openClassModal();
      return;
    }

    const html = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h2 class="modal-title">Add Timetable Slot</h2>
          <button class="modal-close-btn" id="modal-close">✕</button>
        </div>
        <div class="modal-body">
          <form id="form-schedule">
            <div class="form-group">
              <label class="form-label">Course *</label>
              <select class="form-control" name="classId" required>
                ${classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Day of Week *</label>
              <select class="form-control" name="dayOfWeek" required>
                <option value="1">Monday</option>
                <option value="2">Tuesday</option>
                <option value="3">Wednesday</option>
                <option value="4">Thursday</option>
                <option value="5">Friday</option>
              </select>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Start Time *</label>
                <input type="time" class="form-control" name="startTime" value="09:00" required />
              </div>

              <div class="form-group">
                <label class="form-label">End Time *</label>
                <input type="time" class="form-control" name="endTime" value="10:15" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Room Location</label>
              <input type="text" class="form-control" name="room" placeholder="e.g. Science 304" />
            </div>

            <div class="modal-footer" style="padding-left:0; padding-right:0; padding-bottom:0; background:none;">
              <button type="button" class="btn-secondary" id="modal-cancel">Cancel</button>
              <button type="submit" class="btn-primary">Add Schedule Slot</button>
            </div>
          </form>
        </div>
      </div>
    `;

    openModalHTML(html, dialog => {
      dialog.querySelector('#modal-cancel')?.addEventListener('click', closeModal);
      const form = dialog.querySelector('#form-schedule');
      form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        store.addScheduleSlot({
          classId: fd.get('classId'),
          dayOfWeek: Number(fd.get('dayOfWeek')),
          startTime: fd.get('startTime'),
          endTime: fd.get('endTime'),
          room: fd.get('room').trim()
        });
        showToast('Timetable slot added!', 'success');
        closeModal();
      });
    });
  }

  function showUpcomingAlertsModal() {
    const assignments = store.getAssignments().filter(a => a.status !== 'completed');
    const exams = store.getExams();
    const todayStr = new Date().toISOString().split('T')[0];
    const upcomingExams = exams.filter(e => e.date >= todayStr);

    const html = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h2 class="modal-title">Due Soon & Alerts</h2>
          <button class="modal-close-btn" id="modal-close">✕</button>
        </div>
        <div class="modal-body">
          <div style="margin-bottom:1rem;">
            <div style="font-weight:700; font-size:0.875rem; color:var(--text-primary); margin-bottom:0.5rem;">Pending Deadlines (${assignments.length})</div>
            ${assignments.slice(0, 6).map(a => renderTaskItemHTML(a)).join('') || '<div style="color:var(--text-muted); font-size:0.8125rem;">No pending tasks.</div>'}
          </div>

          <div>
            <div style="font-weight:700; font-size:0.875rem; color:var(--text-primary); margin-bottom:0.5rem;">Upcoming Exams (${upcomingExams.length})</div>
            ${upcomingExams.slice(0, 3).map(e => renderExamCardHTML(e)).join('') || '<div style="color:var(--text-muted); font-size:0.8125rem;">No upcoming exams.</div>'}
          </div>
        </div>
      </div>
    `;

    openModalHTML(html, dialog => {
      bindTaskItemEvents(dialog);
      bindExamCardEvents(dialog);
    });
  }

  function checkDueSoonReminders() {
    const assignments = store.getAssignments().filter(a => a.status !== 'completed');
    const overdue = assignments.filter(a => isOverdue(a.dueDate)).length;
    if (elements.headerNotificationDot) {
      elements.headerNotificationDot.style.display = overdue > 0 ? 'block' : 'none';
    }
  }

  // Toast Notification Helper
  function showToast(message, type = 'info') {
    if (!elements.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    elements.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 200ms ease';
      setTimeout(() => toast.remove(), 200);
    }, 2800);
  }

  function downloadFile(content, fileName, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function bindNavTargetClicks(parent) {
    parent.querySelectorAll('[data-nav-target]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('data-nav-target');
        navigateTo(target);
      });
    });
  }

  // Execution Bootstrapper
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
