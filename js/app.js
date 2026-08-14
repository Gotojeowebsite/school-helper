/**
 * AcademiaPro — Complete Academic Organizer Application with Cloud Sync
 * Single bundle containing data store, calculations engine, Firebase Auth & Cloud Firestore sync,
 * and view controllers. 100% functional both offline and cloud-connected.
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'academia_pro_data_v1';
  const FIREBASE_CONFIG_KEY = 'academia_firebase_config_v1';

  // Available Subject Color Palettes
  const SUBJECT_COLORS = [
    '#3b82f6', // Blue
    '#10b981', // Emerald
    '#8b5cf6', // Purple
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#06b6d4', // Cyan
    '#ec4899', // Pink
    '#14b8a6', // Teal
    '#f97316', // Orange
    '#6366f1', // Indigo
  ];

  // Helper: Generate Relative Date ISO String
  function getRelativeDate(daysOffset, timeString = '23:59') {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    if (!timeString) return `${year}-${month}-${day}`;
    return `${year}-${month}-${day}T${timeString}:00`;
  }

  // Default Initial Seed Data
  const DEFAULT_DATA = {
    settings: {
      activeSemesterId: 'sem-fall-2026',
      theme: 'light',
      scheduleMode: 'standard',
      currentCycleDay: 'A',
      studentName: 'Alex Morgan',
      schoolName: 'Westwood Academy',
      notificationsEnabled: false,
    },
    semesters: [
      {
        id: 'sem-fall-2026',
        name: 'Fall 2026',
        startDate: '2026-08-20',
        endDate: '2026-12-18',
        isActive: true,
      },
      {
        id: 'sem-spring-2027',
        name: 'Spring 2027',
        startDate: '2027-01-10',
        endDate: '2027-05-28',
        isActive: false,
      }
    ],
    classes: [
      {
        id: 'cls-calc',
        semesterId: 'sem-fall-2026',
        name: 'AP Calculus BC',
        code: 'MATH 302',
        teacher: 'Dr. Aris Thorne',
        teacherEmail: 'a.thorne@westwood.edu',
        room: 'Science Bldg 304',
        color: '#3b82f6',
        credits: 4,
        gradeCategories: [
          { id: 'gc-calc-hw', name: 'Homework & Problem Sets', weight: 20 },
          { id: 'gc-calc-quiz', name: 'Quizzes', weight: 25 },
          { id: 'gc-calc-exam', name: 'Unit Exams', weight: 35 },
          { id: 'gc-calc-final', name: 'Final Exam', weight: 20 }
        ],
        notes: 'Office hours: Tuesdays & Thursdays 3:30 - 4:30 PM in Room 304.'
      },
      {
        id: 'cls-bio',
        semesterId: 'sem-fall-2026',
        name: 'Advanced AP Biology',
        code: 'BIO 201',
        teacher: 'Prof. Elena Vance',
        teacherEmail: 'e.vance@westwood.edu',
        room: 'Bio Lab 2',
        color: '#10b981',
        credits: 4,
        gradeCategories: [
          { id: 'gc-bio-lab', name: 'Lab Reports', weight: 30 },
          { id: 'gc-bio-hw', name: 'Homework & Reading', weight: 15 },
          { id: 'gc-bio-tests', name: 'Exams & Practicals', weight: 40 },
          { id: 'gc-bio-part', name: 'Seminar Participation', weight: 15 }
        ],
        notes: 'Lab safety goggles required at all lab sessions.'
      },
      {
        id: 'cls-lit',
        semesterId: 'sem-fall-2026',
        name: 'World Literature & Rhetoric',
        code: 'ENG 115',
        teacher: 'Ms. Clara Higgins',
        teacherEmail: 'c.higgins@westwood.edu',
        room: 'Humanities Hall 112',
        color: '#8b5cf6',
        credits: 3,
        gradeCategories: [
          { id: 'gc-lit-essays', name: 'Essays & Papers', weight: 45 },
          { id: 'gc-lit-read', name: 'Reading Journals', weight: 25 },
          { id: 'gc-lit-pres', name: 'Presentations & Seminars', weight: 30 }
        ],
        notes: 'Formatting style must strictly follow MLA 9th Edition.'
      },
      {
        id: 'cls-cs',
        semesterId: 'sem-fall-2026',
        name: 'Intro to Computer Science',
        code: 'CS 210',
        teacher: 'Mr. David Zhang',
        teacherEmail: 'd.zhang@westwood.edu',
        room: 'Turing Computer Lab A',
        color: '#f59e0b',
        credits: 3,
        gradeCategories: [
          { id: 'gc-cs-proj', name: 'Programming Projects', weight: 50 },
          { id: 'gc-cs-labs', name: 'Weekly Lab Exercises', weight: 20 },
          { id: 'gc-cs-exam', name: 'Midterm & Final Exams', weight: 30 }
        ],
        notes: 'Submit GitHub repository links via the class portal.'
      }
    ],
    schedule: [
      { id: 'sch-1', classId: 'cls-calc', dayOfWeek: 1, startTime: '09:00', endTime: '10:15', room: '304', scheduleType: 'all' },
      { id: 'sch-2', classId: 'cls-calc', dayOfWeek: 3, startTime: '09:00', endTime: '10:15', room: '304', scheduleType: 'all' },
      { id: 'sch-3', classId: 'cls-calc', dayOfWeek: 5, startTime: '09:00', endTime: '10:15', room: '304', scheduleType: 'all' },

      { id: 'sch-4', classId: 'cls-bio', dayOfWeek: 2, startTime: '09:30', endTime: '11:00', room: 'Bio Lab 2', scheduleType: 'all' },
      { id: 'sch-5', classId: 'cls-bio', dayOfWeek: 4, startTime: '09:30', endTime: '11:00', room: 'Bio Lab 2', scheduleType: 'all' },
      { id: 'sch-6', classId: 'cls-bio', dayOfWeek: 5, startTime: '13:00', endTime: '15:00', room: 'Bio Lab 2', scheduleType: 'all' },

      { id: 'sch-7', classId: 'cls-lit', dayOfWeek: 1, startTime: '10:45', endTime: '12:15', room: '112', scheduleType: 'all' },
      { id: 'sch-8', classId: 'cls-lit', dayOfWeek: 3, startTime: '10:45', endTime: '12:15', room: '112', scheduleType: 'all' },

      { id: 'sch-9', classId: 'cls-cs', dayOfWeek: 2, startTime: '13:00', endTime: '14:30', room: 'Turing Lab A', scheduleType: 'all' },
      { id: 'sch-10', classId: 'cls-cs', dayOfWeek: 4, startTime: '13:00', endTime: '14:30', room: 'Turing Lab A', scheduleType: 'all' }
    ],
    assignments: [
      {
        id: 'asg-1',
        semesterId: 'sem-fall-2026',
        classId: 'cls-calc',
        title: 'Taylor Series & Power Series Convergence Problem Set',
        description: 'Complete problem set questions #1-28 from Chapter 9.4. Show all working steps including ratio test and interval checks.',
        type: 'homework',
        dueDate: getRelativeDate(1, '23:59'),
        priority: 'high',
        status: 'in-progress',
        completionPercentage: 60,
        gradeCategoryId: 'gc-calc-hw',
        scoreEarned: null,
        maxScore: 100,
        subtasks: [
          { id: 'st-1', title: 'Problems 1-10: Ratio Test calculations', isCompleted: true },
          { id: 'st-2', title: 'Problems 11-20: Radius of Convergence', isCompleted: true },
          { id: 'st-3', title: 'Problems 21-28: Endpoint analysis', isCompleted: false },
          { id: 'st-4', title: 'Scan and review final steps', isCompleted: false }
        ],
        notes: 'Check online odd-number answers in textbook appendix.'
      },
      {
        id: 'asg-2',
        semesterId: 'sem-fall-2026',
        classId: 'cls-bio',
        title: 'Cellular Respiration Formal Lab Report',
        description: 'Write up a 4-page formal lab report investigating yeast fermentation rates at varying temperatures.',
        type: 'lab',
        dueDate: getRelativeDate(3, '17:00'),
        priority: 'high',
        status: 'not-started',
        completionPercentage: 15,
        gradeCategoryId: 'gc-bio-lab',
        scoreEarned: null,
        maxScore: 100,
        subtasks: [
          { id: 'st-5', title: 'Plot rate curve graphs in Excel', isCompleted: true },
          { id: 'st-6', title: 'Draft methodology and hypothesis', isCompleted: false },
          { id: 'st-7', title: 'Write discussion and error analysis', isCompleted: false },
          { id: 'st-8', title: 'Format citations in APA 7th', isCompleted: false }
        ],
        notes: 'Include raw data tables in Appendix B.'
      },
      {
        id: 'asg-3',
        semesterId: 'sem-fall-2026',
        classId: 'cls-lit',
        title: 'Comparative Analysis Essay: Hamlet vs. Rosencrantz & Guildenstern',
        description: '1,500-word analytical paper comparing dramatic irony and existential dread in Stoppard vs Shakespeare.',
        type: 'essay',
        dueDate: getRelativeDate(5, '23:59'),
        priority: 'medium',
        status: 'not-started',
        completionPercentage: 0,
        gradeCategoryId: 'gc-lit-essays',
        scoreEarned: null,
        maxScore: 100,
        subtasks: [
          { id: 'st-9', title: 'Select 6 key textual excerpts', isCompleted: false },
          { id: 'st-10', title: 'Create thesis statement and outline', isCompleted: false },
          { id: 'st-11', title: 'Draft rough draft', isCompleted: false },
          { id: 'st-12', title: 'Peer review and final proofreading', isCompleted: false }
        ],
        notes: 'Minimum 4 scholarly secondary sources required.'
      },
      {
        id: 'asg-4',
        semesterId: 'sem-fall-2026',
        classId: 'cls-cs',
        title: 'Project 2: Self-Balancing AVL Tree Implementation',
        description: 'Implement a generic AVL Binary Search Tree in Java/C++ with rebalancing rotations and benchmark test suites.',
        type: 'project',
        dueDate: getRelativeDate(7, '23:59'),
        priority: 'high',
        status: 'in-progress',
        completionPercentage: 40,
        gradeCategoryId: 'gc-cs-proj',
        scoreEarned: null,
        maxScore: 100,
        subtasks: [
          { id: 'st-13', title: 'BST Node insertion & deletion', isCompleted: true },
          { id: 'st-14', title: 'Implement Left and Right Rotations', isCompleted: true },
          { id: 'st-15', title: 'Double Rotation (LR & RL) logic', isCompleted: false },
          { id: 'st-16', title: 'Run automated JUnit unit tests', isCompleted: false }
        ],
        notes: 'Pass all test cases in GitHub autograder.'
      },
      {
        id: 'asg-5',
        semesterId: 'sem-fall-2026',
        classId: 'cls-calc',
        title: 'Derivatives & Integration Techniques Review',
        description: 'Pre-exam warmup drill covering u-substitution and integration by parts.',
        type: 'homework',
        dueDate: getRelativeDate(-2, '23:59'),
        priority: 'low',
        status: 'completed',
        completionPercentage: 100,
        gradeCategoryId: 'gc-calc-hw',
        scoreEarned: 96,
        maxScore: 100,
        subtasks: [
          { id: 'st-17', title: 'Review Chapter 5 formulas', isCompleted: true },
          { id: 'st-18', title: 'Complete practice quiz', isCompleted: true }
        ],
        notes: 'Scored 96/100.'
      }
    ],
    exams: [
      {
        id: 'ex-1',
        semesterId: 'sem-fall-2026',
        classId: 'cls-calc',
        title: 'Calculus BC Midterm Examination',
        date: getRelativeDate(4, '').split('T')[0],
        startTime: '09:00',
        duration: 90,
        room: 'Science Hall 304',
        seatNumber: 'Seat 14',
        description: 'Covers Units 1-6: Limits, Derivatives, Integrals, and Series Tests. Scientific calculator allowed.',
        gradeCategoryId: 'gc-calc-exam',
        scoreEarned: null,
        maxScore: 100,
        status: 'upcoming',
        topics: ['Limits and Continuity', 'Implicit Differentiation', 'Integration by Parts', 'Geometric Series', 'Ratio Test']
      },
      {
        id: 'ex-2',
        semesterId: 'sem-fall-2026',
        classId: 'cls-bio',
        title: 'Unit 3 Cellular Energetics & Genetics Exam',
        date: getRelativeDate(9, '').split('T')[0],
        startTime: '09:30',
        duration: 75,
        room: 'Bio Lecture Hall B',
        seatNumber: 'Seat 42',
        description: '50 Multiple Choice questions + 2 Free Response Questions on Photosynthesis, Respiration, and Genetics.',
        gradeCategoryId: 'gc-bio-tests',
        scoreEarned: null,
        maxScore: 100,
        status: 'upcoming',
        topics: ['Krebs Cycle', 'Electron Transport Chain', 'Light Reactions', 'Punnett Squares']
      },
      {
        id: 'ex-3',
        semesterId: 'sem-fall-2026',
        classId: 'cls-cs',
        title: 'CS 210 Midterm: Linear Data Structures',
        date: getRelativeDate(-10, '').split('T')[0],
        startTime: '13:00',
        duration: 80,
        room: 'Turing Lab A',
        seatNumber: 'Station 8',
        description: 'Covers Linked Lists, Stacks, Queues, and Big-O Complexity.',
        gradeCategoryId: 'gc-cs-exam',
        scoreEarned: 94,
        maxScore: 100,
        status: 'completed',
        topics: ['Big-O Analysis', 'Doubly Linked Lists', 'Circular Queues']
      }
    ]
  };

  // --- FIREBASE CLOUD SYNC MANAGER ---
  class FirebaseSyncManager {
    constructor() {
      this.isConfigured = false;
      this.currentUser = null;
      this.db = null;
      this.auth = null;
      this.syncDebounceTimer = null;
      this.statusListeners = new Set();
      this.init();
    }

    init() {
      if (typeof window === 'undefined' || typeof window.firebase === 'undefined') {
        console.info('Firebase SDK not loaded. Running in local storage mode.');
        return;
      }

      const savedConfig = this.getSavedConfig();
      if (!savedConfig || !savedConfig.apiKey) {
        console.info('No custom Firebase configuration provided. Running in local offline mode.');
        return;
      }

      try {
        if (!window.firebase.apps || !window.firebase.apps.length) {
          window.firebase.initializeApp(savedConfig);
        }
        this.auth = window.firebase.auth();
        this.db = window.firebase.firestore();
        this.isConfigured = true;

        this.auth.onAuthStateChanged(user => {
          this.currentUser = user;
          this.notifyStatusChange();
          if (user) {
            this.fetchFromCloudAndMerge();
            this.listenToCloudChanges();
          }
        });
      } catch (err) {
        console.error('Firebase initialization error:', err);
      }
    }

    getSavedConfig() {
      try {
        const raw = localStorage.getItem(FIREBASE_CONFIG_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    }

    saveConfig(config) {
      try {
        localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(config));
        this.init();
        return true;
      } catch (e) {
        return false;
      }
    }

    onStatusChange(fn) {
      this.statusListeners.add(fn);
      fn(this.getStatus());
      return () => this.statusListeners.delete(fn);
    }

    notifyStatusChange() {
      const status = this.getStatus();
      this.statusListeners.forEach(fn => fn(status));
    }

    getStatus() {
      return {
        isConfigured: this.isConfigured,
        isAuthenticated: !!this.currentUser,
        user: this.currentUser ? {
          email: this.currentUser.email,
          uid: this.currentUser.uid,
          displayName: this.currentUser.displayName
        } : null
      };
    }

    async signUp(email, password, displayName) {
      if (!this.auth) throw new Error('Please configure Firebase in Settings first.');
      const cred = await this.auth.createUserWithEmailAndPassword(email, password);
      if (displayName && cred.user) {
        await cred.user.updateProfile({ displayName });
      }
      return cred.user;
    }

    async signIn(email, password) {
      if (!this.auth) throw new Error('Please configure Firebase in Settings first.');
      const cred = await this.auth.signInWithEmailAndPassword(email, password);
      return cred.user;
    }

    async signOut() {
      if (this.auth) {
        await this.auth.signOut();
      }
    }

    // Debounced Cloud Sync from local store to Firestore
    syncToCloud(data) {
      if (!this.db || !this.currentUser) return;
      
      clearTimeout(this.syncDebounceTimer);
      this.syncDebounceTimer = setTimeout(async () => {
        try {
          updateCloudStatusDot('syncing');
          await this.db.collection('users').doc(this.currentUser.uid).set({
            planner: data,
            lastSyncedAt: new Date().toISOString()
          }, { merge: true });
          updateCloudStatusDot('synced');
        } catch (e) {
          console.error('Cloud sync error:', e);
          updateCloudStatusDot('offline');
        }
      }, 800);
    }

    async fetchFromCloudAndMerge() {
      if (!this.db || !this.currentUser) return;
      try {
        updateCloudStatusDot('syncing');
        const doc = await this.db.collection('users').doc(this.currentUser.uid).get();
        if (doc.exists && doc.data() && doc.data().planner) {
          const cloudData = doc.data().planner;
          store.data = store.validateAndMigrate(cloudData);
          store.saveToStorage(store.data);
          store.notify('cloud_synced');
          showToast('☁️ Cloud data synced!', 'success');
        } else {
          // Upload initial local data to newly created cloud account
          this.syncToCloud(store.getState());
        }
        updateCloudStatusDot('synced');
      } catch (e) {
        console.error('Fetch cloud data error:', e);
        updateCloudStatusDot('offline');
      }
    }

    listenToCloudChanges() {
      if (!this.db || !this.currentUser) return;
      this.db.collection('users').doc(this.currentUser.uid).onSnapshot(doc => {
        if (doc.exists && doc.data() && doc.data().planner) {
          const incoming = doc.data().planner;
          // Only update if different
          const currentStr = JSON.stringify(store.data);
          const incomingStr = JSON.stringify(incoming);
          if (currentStr !== incomingStr) {
            store.data = store.validateAndMigrate(incoming);
            store.saveToStorage(store.data);
            store.notify('cloud_realtime_update');
          }
        }
      });
    }
  }

  const cloud = new FirebaseSyncManager();

  // --- DATA STORE CLASS ---
  class AcademicStore {
    constructor() {
      this.listeners = new Set();
      this.data = this.loadFromStorage();
    }

    loadFromStorage() {
      try {
        if (typeof localStorage !== 'undefined') {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            return this.validateAndMigrate(parsed);
          }
        }
      } catch (e) {
        console.warn('Failed to parse localStorage data, loading default seed dataset.', e);
      }
      this.saveToStorage(DEFAULT_DATA);
      return JSON.parse(JSON.stringify(DEFAULT_DATA));
    }

    saveToStorage(data) {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
      } catch (e) {
        console.error('Error saving data to localStorage:', e);
      }
    }

    validateAndMigrate(data) {
      if (!data.settings) data.settings = { ...DEFAULT_DATA.settings };
      if (!Array.isArray(data.semesters)) data.semesters = [...DEFAULT_DATA.semesters];
      if (!Array.isArray(data.classes)) data.classes = [...DEFAULT_DATA.classes];
      if (!Array.isArray(data.schedule)) data.schedule = [...DEFAULT_DATA.schedule];
      if (!Array.isArray(data.assignments)) data.assignments = [...DEFAULT_DATA.assignments];
      if (!Array.isArray(data.exams)) data.exams = [...DEFAULT_DATA.exams];
      return data;
    }

    subscribe(listener) {
      this.listeners.add(listener);
      return () => this.listeners.delete(listener);
    }

    notify(changeType, payload) {
      this.saveToStorage(this.data);
      if (changeType !== 'cloud_realtime_update') {
        cloud.syncToCloud(this.data);
      }
      this.listeners.forEach(fn => fn(changeType, payload, this.data));
    }

    getState() {
      return this.data;
    }

    getActiveSemester() {
      const active = this.data.semesters.find(s => s.id === this.data.settings.activeSemesterId);
      return active || this.data.semesters[0] || { id: 'default', name: 'Current Term' };
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

    addAssignment(assignment) {
      const newAsg = {
        id: 'asg-' + Date.now(),
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
        id: 'ex-' + Date.now(),
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
        id: 'cls-' + Date.now(),
        semesterId: this.getActiveSemester().id,
        name: classItem.name || 'New Course',
        code: classItem.code || '',
        teacher: classItem.teacher || '',
        teacherEmail: classItem.teacherEmail || '',
        room: classItem.room || '',
        color: classItem.color || SUBJECT_COLORS[Math.floor(Math.random() * SUBJECT_COLORS.length)],
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
        id: 'sch-' + Date.now(),
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

    resetToSampleData() {
      this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
      this.saveToStorage(this.data);
      this.notify('data_reset', this.data);
    }

    calculateClassGrade(classId) {
      const cls = this.getClassById(classId);
      if (!cls) return { score: null, letter: 'N/A', categories: [] };

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
      if (classes.length === 0) return { gpa: 0.0, totalCredits: 0, gradedCount: 0 };

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

      const gpa = totalCredits > 0 ? (totalPoints / totalCredits) : 4.0;
      return {
        gpa: Math.round(gpa * 100) / 100,
        totalCredits,
        gradedCount
      };
    }

    simulateWhatIfGrade(classId, targetOverallScore, upcomingCategoryWeight) {
      const current = this.calculateClassGrade(classId);
      if (!current || current.score === null) {
        return { requiredScore: targetOverallScore, isFeasible: true };
      }

      const currentWeight = current.totalWeightUsed;
      const remainingWeight = 100 - currentWeight;
      const weightToUse = upcomingCategoryWeight || remainingWeight || 20;

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
        'PRODID:-//Academia Pro//School Helper & Planner//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'X-WR-CALNAME:Academia Pro Academic Schedule'
      ];

      const asgs = this.getAssignments();
      const exams = this.getExams();

      asgs.forEach(a => {
        const cls = this.getClassById(a.classId);
        const dt = new Date(a.dueDate);
        if (isNaN(dt.getTime())) return;
        const formattedDt = dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

        lines.push('BEGIN:VEVENT');
        lines.push(`UID:asg-${a.id}@academiapro.app`);
        lines.push(`DTSTAMP:${formattedDt}`);
        lines.push(`DTSTART:${formattedDt}`);
        lines.push(`DTEND:${formattedDt}`);
        lines.push(`SUMMARY:[${cls ? cls.name : 'School'}] ${a.title}`);
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
        lines.push(`UID:exam-${e.id}@academiapro.app`);
        lines.push(`DTSTAMP:${fmtStart}`);
        lines.push(`DTSTART:${fmtStart}`);
        lines.push(`DTEND:${fmtEnd}`);
        lines.push(`SUMMARY:📝 EXAM: [${cls ? cls.name : 'School'}] ${e.title}`);
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
    setupCloudAuthSubscription();
    
    // Initial Route
    navigateTo('dashboard');
    checkDueSoonReminders();
  }

  function cacheDOMElements() {
    elements = {
      appContainer: document.getElementById('app-container'),
      sidebar: document.querySelector('.app-sidebar'),
      mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
      themeToggleBtn: document.getElementById('theme-toggle-btn'),
      notificationBtn: document.getElementById('notification-btn'),
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
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
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
        elements.sidebar.classList.toggle('mobile-open');
      });
    }

    if (elements.themeToggleBtn) {
      elements.themeToggleBtn.addEventListener('click', toggleTheme);
    }

    if (elements.quickAddBtn) {
      elements.quickAddBtn.addEventListener('click', () => openQuickAddModal());
    }

    // Cloud Auth Modals
    if (elements.headerAuthBtn) {
      elements.headerAuthBtn.addEventListener('click', () => openAuthModal());
    }
    if (elements.sidebarUserCard) {
      elements.sidebarUserCard.addEventListener('click', () => openAuthModal());
    }
    if (elements.sidebarAuthBtn) {
      elements.sidebarAuthBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openAuthModal();
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
        showToast(`Switched active term to ${elements.semesterSelect.options[elements.semesterSelect.selectedIndex].text}`, 'info');
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
        if (elements.globalSearchInput) elements.globalSearchInput.focus();
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
      updateBadges();
      refreshCurrentView();
    });
  }

  function setupCloudAuthSubscription() {
    cloud.onStatusChange(status => {
      updateUserSidebarUI(status);
    });
  }

  function updateUserSidebarUI(status) {
    if (!elements.userNameDisplay || !elements.userStatusDisplay) return;

    if (status.isAuthenticated && status.user) {
      const email = status.user.email || 'Student';
      const name = status.user.displayName || email.split('@')[0];
      const initials = name.slice(0, 2).toUpperCase();

      elements.userNameDisplay.textContent = name;
      elements.userStatusDisplay.innerHTML = `<span class="cloud-status-dot synced"></span> ☁️ Synced`;
      if (elements.userAvatarDisplay) elements.userAvatarDisplay.textContent = initials;
    } else {
      const savedName = store.getState().settings.studentName || 'Alex Morgan';
      elements.userNameDisplay.textContent = savedName;
      elements.userStatusDisplay.innerHTML = `<span class="cloud-status-dot offline"></span> Local Offline`;
      if (elements.userAvatarDisplay) elements.userAvatarDisplay.textContent = savedName.slice(0, 2).toUpperCase();
    }
  }

  function updateCloudStatusDot(statusType) {
    if (!elements.userStatusDisplay) return;
    if (statusType === 'syncing') {
      elements.userStatusDisplay.innerHTML = `<span class="cloud-status-dot syncing"></span> Syncing...`;
    } else if (statusType === 'synced') {
      elements.userStatusDisplay.innerHTML = `<span class="cloud-status-dot synced"></span> ☁️ Synced`;
    } else {
      elements.userStatusDisplay.innerHTML = `<span class="cloud-status-dot offline"></span> Local Offline`;
    }
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

    elements.viewSections.forEach(sec => {
      if (sec.id === `view-${viewId}`) {
        sec.classList.add('active');
      } else {
        sec.classList.remove('active');
      }
    });

    refreshCurrentView();
    updateBadges();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function refreshCurrentView() {
    switch (state.currentView) {
      case 'dashboard': renderDashboardView(); break;
      case 'assignments': renderAssignmentsView(); break;
      case 'exams': renderExamsView(); break;
      case 'calendar': renderCalendarView(); break;
      case 'schedule': renderScheduleView(); break;
      case 'grades': renderGradesView(); break;
      case 'classes': renderClassesView(); break;
      case 'analytics': renderAnalyticsView(); break;
      case 'settings': renderSettingsView(); break;
    }
  }

  function updateBadges() {
    const asgs = store.getAssignments();
    const exams = store.getExams();
    const now = new Date();

    const overdueCount = asgs.filter(a => a.status !== 'completed' && new Date(a.dueDate) < now).length;
    const pendingCount = asgs.filter(a => a.status !== 'completed').length;
    const upcomingExams = exams.filter(e => e.status === 'upcoming').length;

    const badgeAsg = document.getElementById('nav-badge-assignments');
    if (badgeAsg) {
      badgeAsg.textContent = pendingCount;
      badgeAsg.className = overdueCount > 0 ? 'nav-badge danger' : 'nav-badge';
    }

    const badgeExams = document.getElementById('nav-badge-exams');
    if (badgeExams) {
      badgeExams.textContent = upcomingExams;
    }
  }

  function populateSemesterSelector() {
    if (!elements.semesterSelect) return;
    const data = store.getState();
    elements.semesterSelect.innerHTML = data.semesters.map(s => `
      <option value="${s.id}" ${s.id === data.settings.activeSemesterId ? 'selected' : ''}>
        ${s.name} ${s.isActive ? '(Current)' : ''}
      </option>
    `).join('');
  }

  // --- DASHBOARD VIEW ---
  function renderDashboardView() {
    const container = document.getElementById('view-dashboard');
    if (!container) return;

    const assignments = store.getAssignments();
    const exams = store.getExams();
    const gpaInfo = store.calculateOverallGPA();
    const now = new Date();

    const activeTasks = assignments.filter(a => a.status !== 'completed');
    const completedTasks = assignments.filter(a => a.status === 'completed');
    const overdueTasks = activeTasks.filter(a => new Date(a.dueDate) < now);
    const completionRate = assignments.length > 0 ? Math.round((completedTasks.length / assignments.length) * 100) : 0;
    const upcomingExams = exams.filter(e => e.status === 'upcoming');

    const next7Days = new Date();
    next7Days.setDate(next7Days.getDate() + 7);
    const dueSoonTasks = activeTasks.filter(a => {
      const d = new Date(a.dueDate);
      return d >= now && d <= next7Days;
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    const todayDay = now.getDay();
    const todaySchedule = store.getSchedule()
      .filter(s => s.dayOfWeek === todayDay)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    container.innerHTML = `
      <div class="stat-cards-grid">
        <div class="stat-card">
          <div class="stat-icon-wrapper blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Cumulative GPA</span>
            <span class="stat-value">${gpaInfo.gpa.toFixed(2)}</span>
            <span class="stat-subtext">${gpaInfo.gradedCount} courses graded</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper amber">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Pending Tasks</span>
            <span class="stat-value">${activeTasks.length}</span>
            <span class="stat-subtext">${overdueTasks.length > 0 ? `<b style="color:var(--danger)">${overdueTasks.length} overdue</b>` : 'All caught up'}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper purple">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Upcoming Exams</span>
            <span class="stat-value">${upcomingExams.length}</span>
            <span class="stat-subtext">${upcomingExams.length > 0 ? `Next: in ${getDaysDiff(new Date(), new Date(upcomingExams[0].date))} days` : 'No exams booked'}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper emerald">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Completion Rate</span>
            <span class="stat-value">${completionRate}%</span>
            <span class="stat-subtext">${completedTasks.length} of ${assignments.length} done</span>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="dashboard-main-col">
          ${overdueTasks.length > 0 ? `
            <div class="card-panel" style="border-color: var(--danger); background: var(--danger-light);">
              <div class="panel-header" style="margin-bottom:0.75rem;">
                <span class="panel-title" style="color: var(--danger);">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  Action Required: ${overdueTasks.length} Overdue Assignment${overdueTasks.length > 1 ? 's' : ''}
                </span>
              </div>
              ${overdueTasks.map(t => renderTaskItemHTML(t)).join('')}
            </div>
          ` : ''}

          <div class="card-panel">
            <div class="panel-header">
              <span class="panel-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                Upcoming Deadlines (Next 7 Days)
              </span>
              <a href="#" class="panel-action-link" data-nav-target="assignments">View All Assignments →</a>
            </div>
            
            <div class="tasks-list-container">
              ${dueSoonTasks.length > 0 
                ? dueSoonTasks.map(t => renderTaskItemHTML(t)).join('')
                : `<div style="text-align:center; padding: 2rem; color: var(--text-muted);">
                     <p>🎉 No assignments due in the next 7 days!</p>
                   </div>`
              }
            </div>
          </div>
        </div>

        <div class="dashboard-side-col">
          <div class="card-panel">
            <div class="panel-header">
              <span class="panel-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                Today's Schedule (${getDayName(todayDay)})
              </span>
              <a href="#" class="panel-action-link" data-nav-target="schedule">Timetable →</a>
            </div>

            <div class="today-schedule-list">
              ${todaySchedule.length > 0 ? todaySchedule.map(slot => {
                const cls = store.getClassById(slot.classId);
                return `
                  <div style="display:flex; align-items:center; gap:0.75rem; padding:0.75rem 0; border-bottom:1px solid var(--border-subtle);">
                    <div style="width:4px; height:36px; border-radius:2px; background:${cls ? cls.color : 'var(--accent)'};"></div>
                    <div style="flex:1;">
                      <div style="font-weight:600; font-size:0.875rem; color:var(--text-primary);">${cls ? cls.name : 'Class'}</div>
                      <div style="font-size:0.75rem; color:var(--text-secondary);">${slot.startTime} - ${slot.endTime} • ${slot.room ? `Room ${slot.room}` : (cls ? cls.room : '')}</div>
                    </div>
                  </div>
                `;
              }).join('') : `
                <div style="text-align:center; padding:1.5rem 0; color:var(--text-muted); font-size:0.875rem;">
                  No classes scheduled for today.
                </div>
              `}
            </div>
          </div>

          <div class="card-panel">
            <div class="panel-header">
              <span class="panel-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                Next Exams
              </span>
              <a href="#" class="panel-action-link" data-nav-target="exams">All Exams →</a>
            </div>

            <div class="upcoming-exams-list">
              ${upcomingExams.slice(0, 3).map(e => {
                const cls = store.getClassById(e.classId);
                const daysLeft = getDaysDiff(new Date(), new Date(e.date));
                return `
                  <div style="padding:0.75rem 0; border-bottom:1px solid var(--border-subtle);">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.25rem;">
                      <span style="font-weight:600; font-size:0.875rem; color:var(--text-primary);">${e.title}</span>
                      <span class="countdown-badge" style="font-size:0.6875rem;">
                        ${daysLeft === 0 ? 'Today!' : daysLeft === 1 ? 'Tomorrow' : `In ${daysLeft} days`}
                      </span>
                    </div>
                    <div style="font-size:0.75rem; color:var(--text-secondary);">
                      ${cls ? cls.name : ''} • ${formatDate(e.date)} at ${e.startTime}
                    </div>
                  </div>
                `;
              }).join('')}
              ${upcomingExams.length === 0 ? `<div style="color:var(--text-muted); font-size:0.875rem; text-align:center; padding:1rem;">No upcoming tests</div>` : ''}
            </div>
          </div>
        </div>
      </div>
    `;

    bindTaskActionEvents(container);
    bindNavTargetClicks(container);
  }

  // --- ASSIGNMENTS VIEW ---
  function renderAssignmentsView() {
    const container = document.getElementById('view-assignments');
    if (!container) return;

    const classes = store.getClasses();
    let assignments = store.getAssignments();
    const now = new Date();

    if (state.searchQuery) {
      assignments = assignments.filter(a => 
        a.title.toLowerCase().includes(state.searchQuery) ||
        (a.description && a.description.toLowerCase().includes(state.searchQuery))
      );
    }

    if (state.filters.assignmentClass !== 'all') {
      assignments = assignments.filter(a => a.classId === state.filters.assignmentClass);
    }

    if (state.filters.assignmentType !== 'all') {
      assignments = assignments.filter(a => a.type === state.filters.assignmentType);
    }

    if (state.filters.assignmentPriority !== 'all') {
      assignments = assignments.filter(a => a.priority === state.filters.assignmentPriority);
    }

    if (state.filters.assignmentStatus === 'active') {
      assignments = assignments.filter(a => a.status !== 'completed');
    } else if (state.filters.assignmentStatus === 'completed') {
      assignments = assignments.filter(a => a.status === 'completed');
    } else if (state.filters.assignmentStatus === 'overdue') {
      assignments = assignments.filter(a => a.status !== 'completed' && new Date(a.dueDate) < now);
    } else if (state.filters.assignmentStatus === 'due-soon') {
      const next3Days = new Date();
      next3Days.setDate(next3Days.getDate() + 3);
      assignments = assignments.filter(a => a.status !== 'completed' && new Date(a.dueDate) >= now && new Date(a.dueDate) <= next3Days);
    }

    assignments.sort((a, b) => {
      if (state.filters.assignmentSort === 'dueDate-asc') return new Date(a.dueDate) - new Date(b.dueDate);
      if (state.filters.assignmentSort === 'dueDate-desc') return new Date(b.dueDate) - new Date(a.dueDate);
      if (state.filters.assignmentSort === 'priority') {
        const pWeights = { high: 3, medium: 2, low: 1 };
        return (pWeights[b.priority] || 0) - (pWeights[a.priority] || 0);
      }
      if (state.filters.assignmentSort === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h1 class="section-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
            Assignments & Homework
          </h1>
          <p class="section-subtitle">Track, organize, and complete academic assignments with subtasks and progress bars.</p>
        </div>
        <div class="header-actions">
          <button class="btn-primary" id="btn-add-assignment">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            New Assignment
          </button>
        </div>
      </div>

      <div class="filters-bar">
        <div class="filter-group">
          <button class="filter-pill ${state.filters.assignmentStatus === 'all' ? 'active' : ''}" data-status="all">All</button>
          <button class="filter-pill ${state.filters.assignmentStatus === 'active' ? 'active' : ''}" data-status="active">Active</button>
          <button class="filter-pill ${state.filters.assignmentStatus === 'due-soon' ? 'active' : ''}" data-status="due-soon">Due Soon</button>
          <button class="filter-pill ${state.filters.assignmentStatus === 'overdue' ? 'active' : ''}" data-status="overdue">Overdue</button>
          <button class="filter-pill ${state.filters.assignmentStatus === 'completed' ? 'active' : ''}" data-status="completed">Completed</button>
        </div>

        <div class="filter-group">
          <select class="select-filter" id="filter-class">
            <option value="all">All Classes</option>
            ${classes.map(c => `<option value="${c.id}" ${state.filters.assignmentClass === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>

          <select class="select-filter" id="filter-type">
            <option value="all">All Types</option>
            <option value="homework" ${state.filters.assignmentType === 'homework' ? 'selected' : ''}>Homework</option>
            <option value="essay" ${state.filters.assignmentType === 'essay' ? 'selected' : ''}>Essay</option>
            <option value="project" ${state.filters.assignmentType === 'project' ? 'selected' : ''}>Project</option>
            <option value="lab" ${state.filters.assignmentType === 'lab' ? 'selected' : ''}>Lab Report</option>
            <option value="quiz" ${state.filters.assignmentType === 'quiz' ? 'selected' : ''}>Quiz</option>
            <option value="reading" ${state.filters.assignmentType === 'reading' ? 'selected' : ''}>Reading</option>
          </select>

          <select class="select-filter" id="filter-sort">
            <option value="dueDate-asc" ${state.filters.assignmentSort === 'dueDate-asc' ? 'selected' : ''}>Due Date (Earliest)</option>
            <option value="dueDate-desc" ${state.filters.assignmentSort === 'dueDate-desc' ? 'selected' : ''}>Due Date (Latest)</option>
            <option value="priority" ${state.filters.assignmentSort === 'priority' ? 'selected' : ''}>Priority (Highest)</option>
            <option value="title" ${state.filters.assignmentSort === 'title' ? 'selected' : ''}>Title (A-Z)</option>
          </select>
        </div>
      </div>

      <div class="assignments-list-container">
        ${assignments.length > 0 
          ? assignments.map(a => renderTaskItemHTML(a)).join('')
          : `<div class="card-panel" style="text-align:center; padding:3.5rem; color:var(--text-muted);">
               <p style="font-size:1.125rem; font-weight:600;">No assignments found</p>
               <p style="font-size:0.875rem; margin-top:0.25rem;">Try adjusting your filters or create a new assignment.</p>
             </div>`
        }
      </div>
    `;

    container.querySelectorAll('.filter-pill[data-status]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.filters.assignmentStatus = btn.getAttribute('data-status');
        renderAssignmentsView();
      });
    });

    const filterClass = container.querySelector('#filter-class');
    if (filterClass) filterClass.addEventListener('change', (e) => {
      state.filters.assignmentClass = e.target.value;
      renderAssignmentsView();
    });

    const filterType = container.querySelector('#filter-type');
    if (filterType) filterType.addEventListener('change', (e) => {
      state.filters.assignmentType = e.target.value;
      renderAssignmentsView();
    });

    const filterSort = container.querySelector('#filter-sort');
    if (filterSort) filterSort.addEventListener('change', (e) => {
      state.filters.assignmentSort = e.target.value;
      renderAssignmentsView();
    });

    const btnAdd = container.querySelector('#btn-add-assignment');
    if (btnAdd) btnAdd.addEventListener('click', () => openAssignmentModal());

    bindTaskActionEvents(container);
  }

  function renderTaskItemHTML(task) {
    const cls = store.getClassById(task.classId);
    const isComplete = task.status === 'completed';
    const now = new Date();
    const isOverdue = !isComplete && new Date(task.dueDate) < now;
    const subtasks = task.subtasks || [];
    const completedSubtasks = subtasks.filter(s => s.isCompleted).length;

    return `
      <div class="task-item ${isComplete ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}" data-task-id="${task.id}">
        <input type="checkbox" class="task-checkbox" ${isComplete ? 'checked' : ''} title="Mark task completed" />
        
        <div class="task-details">
          <div class="task-top-row">
            ${cls ? `
              <span class="class-tag" style="background:${cls.color}20; color:${cls.color};">
                ${cls.name}
              </span>
            ` : ''}
            <span class="badge ${getPriorityBadgeClass(task.priority)}">${task.priority.toUpperCase()}</span>
            <span class="badge neutral">${task.type || 'homework'}</span>
            ${task.scoreEarned !== null ? `<span class="badge success">Grade: ${task.scoreEarned}/${task.maxScore || 100}</span>` : ''}
          </div>

          <div class="task-title">${task.title}</div>
          ${task.description ? `<div class="task-description">${task.description}</div>` : ''}

          ${subtasks.length > 0 ? `
            <div class="subtasks-progress-wrapper">
              <div style="display:flex; justify-content:space-between; font-size:0.6875rem; color:var(--text-muted); font-weight:600;">
                <span>Subtasks (${completedSubtasks}/${subtasks.length})</span>
                <span>${Math.round((completedSubtasks / subtasks.length) * 100)}%</span>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: ${(completedSubtasks / subtasks.length) * 100}%;"></div>
              </div>
            </div>
          ` : ''}

          <div class="task-meta-row">
            <span class="meta-item ${isOverdue ? 'overdue' : ''}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              ${formatDateTime(task.dueDate)} ${isOverdue ? '• Overdue!' : ''}
            </span>
            ${task.completionPercentage > 0 && task.completionPercentage < 100 ? `
              <span class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                ${task.completionPercentage}% Progress
              </span>
            ` : ''}
          </div>
        </div>

        <div class="task-actions">
          <button class="icon-btn btn-edit-task" title="Edit Assignment">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button class="icon-btn btn-delete-task" title="Delete Assignment" style="color:var(--danger);">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </div>
    `;
  }

  function bindTaskActionEvents(container) {
    container.querySelectorAll('.task-item').forEach(item => {
      const id = item.getAttribute('data-task-id');
      
      const chk = item.querySelector('.task-checkbox');
      if (chk) {
        chk.addEventListener('change', () => {
          store.toggleAssignmentComplete(id);
        });
      }

      const btnEdit = item.querySelector('.btn-edit-task');
      if (btnEdit) {
        btnEdit.addEventListener('click', (e) => {
          e.stopPropagation();
          const asg = store.getState().assignments.find(a => a.id === id);
          if (asg) openAssignmentModal(asg);
        });
      }

      const btnDelete = item.querySelector('.btn-delete-task');
      if (btnDelete) {
        btnDelete.addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm('Are you sure you want to delete this assignment?')) {
            store.deleteAssignment(id);
            showToast('Assignment deleted', 'info');
          }
        });
      }
    });
  }

  // --- EXAMS VIEW ---
  function renderExamsView() {
    const container = document.getElementById('view-exams');
    if (!container) return;

    let exams = store.getExams();

    if (state.filters.examStatus === 'upcoming') {
      exams = exams.filter(e => e.status === 'upcoming');
    } else if (state.filters.examStatus === 'completed') {
      exams = exams.filter(e => e.status === 'completed');
    }

    exams.sort((a, b) => new Date(`${a.date}T${a.startTime}`) - new Date(`${b.date}T${b.startTime}`));

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h1 class="section-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Exams & Test Schedules
          </h1>
          <p class="section-subtitle">Dedicated exam management with live countdowns, room locations, seat numbers, and study topics.</p>
        </div>
        <div class="header-actions">
          <button class="btn-primary" id="btn-add-exam">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Schedule Exam
          </button>
        </div>
      </div>

      <div class="filters-bar">
        <div class="filter-group">
          <button class="filter-pill ${state.filters.examStatus === 'upcoming' ? 'active' : ''}" data-exam-tab="upcoming">Upcoming Exams</button>
          <button class="filter-pill ${state.filters.examStatus === 'completed' ? 'active' : ''}" data-exam-tab="completed">Completed / Graded</button>
          <button class="filter-pill ${state.filters.examStatus === 'all' ? 'active' : ''}" data-exam-tab="all">All Tests</button>
        </div>
      </div>

      <div class="exams-list-grid">
        ${exams.length > 0 ? exams.map(e => {
          const cls = store.getClassById(e.classId);
          const daysLeft = getDaysDiff(new Date(), new Date(e.date));
          const isPast = daysLeft < 0 || e.status === 'completed';

          return `
            <div class="exam-card" style="border-left-color: ${cls ? cls.color : 'var(--accent)'};" data-exam-id="${e.id}">
              <div class="exam-header">
                <div>
                  ${cls ? `<span class="class-tag" style="background:${cls.color}20; color:${cls.color}; margin-bottom:0.375rem;">${cls.name}</span>` : ''}
                  <div class="exam-title">${e.title}</div>
                </div>
                <div>
                  <span class="countdown-badge" style="${isPast ? 'background:var(--border-strong); color:var(--text-secondary);' : ''}">
                    ${isPast ? 'Completed' : daysLeft === 0 ? 'Today!' : daysLeft === 1 ? 'Tomorrow' : `In ${daysLeft} Days`}
                  </span>
                </div>
              </div>

              ${e.description ? `<p style="font-size:0.8125rem; color:var(--text-secondary); margin-top:0.75rem;">${e.description}</p>` : ''}

              ${e.topics && e.topics.length > 0 ? `
                <div style="margin-top:0.875rem;">
                  <span class="info-label">Study Topics</span>
                  <div style="display:flex; flex-wrap:wrap; gap:0.375rem; margin-top:0.375rem;">
                    ${e.topics.map(t => `<span class="badge neutral" style="font-size:0.6875rem;">${t}</span>`).join('')}
                  </div>
                </div>
              ` : ''}

              <div class="exam-grid-info">
                <div class="exam-info-block">
                  <span class="info-label">Date & Time</span>
                  <span class="info-value">${formatDate(e.date)} • ${e.startTime}</span>
                </div>
                <div class="exam-info-block">
                  <span class="info-label">Duration</span>
                  <span class="info-value">${e.duration} Minutes</span>
                </div>
                <div class="exam-info-block">
                  <span class="info-label">Location / Room</span>
                  <span class="info-value">${e.room || (cls ? cls.room : 'TBD')}</span>
                </div>
                <div class="exam-info-block">
                  <span class="info-label">Seat Assigned</span>
                  <span class="info-value">${e.seatNumber || 'Free Seating'}</span>
                </div>
                ${e.scoreEarned !== null ? `
                  <div class="exam-info-block">
                    <span class="info-label">Score Earned</span>
                    <span class="info-value" style="color:var(--success); font-weight:700;">${e.scoreEarned} / ${e.maxScore || 100}</span>
                  </div>
                ` : ''}
              </div>

              <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1rem; padding-top:0.75rem; border-top:1px solid var(--border-subtle);">
                <button class="btn-secondary btn-edit-exam" style="padding:0.375rem 0.75rem; font-size:0.75rem;">Edit Exam</button>
                <button class="btn-secondary btn-delete-exam" style="padding:0.375rem 0.75rem; font-size:0.75rem; color:var(--danger);">Delete</button>
              </div>
            </div>
          `;
        }).join('') : `
          <div class="card-panel" style="text-align:center; padding:3.5rem; color:var(--text-muted);">
            <p style="font-size:1.125rem; font-weight:600;">No exams found in this tab</p>
            <p style="font-size:0.875rem; margin-top:0.25rem;">Schedule an exam or view another filter.</p>
          </div>
        `}
      </div>
    `;

    container.querySelectorAll('[data-exam-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.filters.examStatus = btn.getAttribute('data-exam-tab');
        renderExamsView();
      });
    });

    const btnAdd = container.querySelector('#btn-add-exam');
    if (btnAdd) btnAdd.addEventListener('click', () => openExamModal());

    container.querySelectorAll('.exam-card').forEach(card => {
      const id = card.getAttribute('data-exam-id');
      
      const btnEdit = card.querySelector('.btn-edit-exam');
      if (btnEdit) {
        btnEdit.addEventListener('click', () => {
          const exam = store.getState().exams.find(e => e.id === id);
          if (exam) openExamModal(exam);
        });
      }

      const btnDelete = card.querySelector('.btn-delete-exam');
      if (btnDelete) {
        btnDelete.addEventListener('click', () => {
          if (confirm('Delete this exam from your planner?')) {
            store.deleteExam(id);
            showToast('Exam deleted', 'info');
          }
        });
      }
    });
  }

  // --- CALENDAR VIEW ---
  function renderCalendarView() {
    const container = document.getElementById('view-calendar');
    if (!container) return;

    const currentYear = state.calendarDate.getFullYear();
    const currentMonth = state.calendarDate.getMonth();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const assignments = store.getAssignments();
    const exams = store.getExams();

    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const totalCells = Math.ceil((firstDayIndex + daysInMonth) / 7) * 7;
    const today = new Date();

    let cellsHTML = '';

    for (let i = 0; i < totalCells; i++) {
      let dayNum;
      let isCurrentMonth = true;
      let cellDate;

      if (i < firstDayIndex) {
        dayNum = daysInPrevMonth - firstDayIndex + i + 1;
        isCurrentMonth = false;
        cellDate = new Date(currentYear, currentMonth - 1, dayNum);
      } else if (i >= firstDayIndex + daysInMonth) {
        dayNum = i - (firstDayIndex + daysInMonth) + 1;
        isCurrentMonth = false;
        cellDate = new Date(currentYear, currentMonth + 1, dayNum);
      } else {
        dayNum = i - firstDayIndex + 1;
        cellDate = new Date(currentYear, currentMonth, dayNum);
      }

      const isToday = isSameDay(cellDate, today);
      const dateStr = cellDate.toISOString().split('T')[0];

      const dayAsgs = assignments.filter(a => a.dueDate && a.dueDate.startsWith(dateStr));
      const dayExams = exams.filter(e => e.date === dateStr);

      cellsHTML += `
        <div class="calendar-day-cell ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}" data-cal-date="${dateStr}">
          <div class="day-number">${dayNum}</div>
          
          <div class="calendar-events-list">
            ${dayExams.map(e => `
              <div class="cal-event-pill" style="background:#ef4444; color:white;" title="Exam: ${e.title}" data-view-exam-id="${e.id}">
                <span>📝 ${e.title}</span>
              </div>
            `).join('')}

            ${dayAsgs.map(a => {
              const cls = store.getClassById(a.classId);
              const color = cls ? cls.color : 'var(--accent)';
              return `
                <div class="cal-event-pill" style="background:${color}20; color:${color}; border-left:3px solid ${color};" title="Due: ${a.title}" data-view-task-id="${a.id}">
                  <span>${a.title}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h1 class="section-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            Academic Calendar
          </h1>
          <p class="section-subtitle">Visual overview of assignments, exams, and milestones.</p>
        </div>
        <div class="header-actions">
          <button class="btn-secondary" id="btn-cal-today">Today</button>
          <button class="btn-primary" id="btn-cal-add">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add to Calendar
          </button>
        </div>
      </div>

      <div class="calendar-container">
        <div class="calendar-header">
          <div class="calendar-month-title">${monthNames[currentMonth]} ${currentYear}</div>
          <div class="calendar-nav-buttons">
            <button class="icon-btn" id="btn-cal-prev" title="Previous Month">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button class="icon-btn" id="btn-cal-next" title="Next Month">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>

        <div class="calendar-grid-days-header">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        <div class="calendar-grid-month">
          ${cellsHTML}
        </div>
      </div>
    `;

    container.querySelector('#btn-cal-prev').addEventListener('click', () => {
      state.calendarDate.setMonth(state.calendarDate.getMonth() - 1);
      renderCalendarView();
    });

    container.querySelector('#btn-cal-next').addEventListener('click', () => {
      state.calendarDate.setMonth(state.calendarDate.getMonth() + 1);
      renderCalendarView();
    });

    container.querySelector('#btn-cal-today').addEventListener('click', () => {
      state.calendarDate = new Date();
      renderCalendarView();
    });

    container.querySelector('#btn-cal-add').addEventListener('click', () => {
      openQuickAddModal();
    });

    container.querySelectorAll('.calendar-day-cell').forEach(cell => {
      cell.addEventListener('click', (e) => {
        if (e.target.closest('.cal-event-pill')) return;
        const date = cell.getAttribute('data-cal-date');
        openAssignmentModal({ dueDate: `${date}T23:59:00` });
      });
    });

    container.querySelectorAll('[data-view-task-id]').forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = pill.getAttribute('data-view-task-id');
        const asg = store.getState().assignments.find(a => a.id === id);
        if (asg) openAssignmentModal(asg);
      });
    });

    container.querySelectorAll('[data-view-exam-id]').forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = pill.getAttribute('data-view-exam-id');
        const exam = store.getState().exams.find(e => e.id === id);
        if (exam) openExamModal(exam);
      });
    });
  }

  // --- SCHEDULE TIMETABLE VIEW ---
  function renderScheduleView() {
    const container = document.getElementById('view-schedule');
    if (!container) return;

    const scheduleSlots = store.getSchedule();
    const timeHours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
    const days = [
      { num: 1, name: 'Monday' },
      { num: 2, name: 'Tuesday' },
      { num: 3, name: 'Wednesday' },
      { num: 4, name: 'Thursday' },
      { num: 5, name: 'Friday' }
    ];

    let gridRowsHTML = '';

    timeHours.forEach(hour => {
      gridRowsHTML += `<div class="time-slot-label">${hour}</div>`;

      days.forEach(d => {
        const currentHourNum = parseInt(hour.split(':')[0], 10);
        const matchingSlot = scheduleSlots.find(s => {
          if (s.dayOfWeek !== d.num) return false;
          const slotHour = parseInt(s.startTime.split(':')[0], 10);
          return slotHour === currentHourNum;
        });

        if (matchingSlot) {
          const cls = store.getClassById(matchingSlot.classId);
          gridRowsHTML += `
            <div class="timetable-slot-cell" style="background: ${cls ? cls.color : 'var(--accent)'}15;">
              <div class="class-block-card" style="background: ${cls ? cls.color : 'var(--accent)'};" data-slot-id="${matchingSlot.id}">
                <div class="class-block-title">${cls ? cls.name : 'Class'}</div>
                <div class="class-block-meta">${matchingSlot.startTime} - ${matchingSlot.endTime} • Room ${matchingSlot.room || (cls ? cls.room : '')}</div>
              </div>
            </div>
          `;
        } else {
          gridRowsHTML += `<div class="timetable-slot-cell" data-add-slot-day="${d.num}" data-add-slot-time="${hour}"></div>`;
        }
      });
    });

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h1 class="section-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            Weekly Timetable & Schedule
          </h1>
          <p class="section-subtitle">Weekly period grid with room numbers and class times.</p>
        </div>
        <div class="header-actions">
          <button class="btn-primary" id="btn-add-schedule-slot">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Class Period
          </button>
        </div>
      </div>

      <div class="timetable-wrapper">
        <div class="timetable-grid">
          <div class="time-column-header">Time</div>
          <div class="day-column-header">Mon</div>
          <div class="day-column-header">Tue</div>
          <div class="day-column-header">Wed</div>
          <div class="day-column-header">Thu</div>
          <div class="day-column-header">Fri</div>

          ${gridRowsHTML}
        </div>
      </div>
    `;

    container.querySelector('#btn-add-schedule-slot').addEventListener('click', () => openScheduleSlotModal());

    container.querySelectorAll('.class-block-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-slot-id');
        if (confirm('Remove this class period from your weekly timetable?')) {
          store.deleteScheduleSlot(id);
          showToast('Schedule slot removed', 'info');
        }
      });
    });
  }

  // --- GRADES VIEW ---
  function renderGradesView() {
    const container = document.getElementById('view-grades');
    if (!container) return;

    const classes = store.getClasses();

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h1 class="section-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
            Gradebook & "What-If" Simulator
          </h1>
          <p class="section-subtitle">Weighted category averages, cumulative GPA tracking, and target score predictions.</p>
        </div>
      </div>

      <div class="grades-container">
        <div class="grades-classes-col">
          ${classes.map(c => {
            const g = store.calculateClassGrade(c.id);
            return `
              <div class="grade-class-card" style="border-top: 4px solid ${c.color};">
                <div class="grade-card-header">
                  <div>
                    <h3 style="margin:0; font-size:1.125rem; font-weight:700;">${c.name} (${c.code})</h3>
                    <p style="font-size:0.8125rem; color:var(--text-secondary); margin-top:0.25rem;">
                      ${c.credits} Credits • Instructor: ${c.teacher}
                    </p>
                  </div>
                  <div style="text-align:right;">
                    <div class="grade-score-display" style="color:${c.color};">
                      ${g.score !== null ? `${g.score}%` : 'N/A'}
                    </div>
                    <span class="badge ${g.letter === 'A' || g.letter === 'A-' ? 'success' : g.letter === 'F' ? 'danger' : 'primary'}">
                      Letter: ${g.letter} (${g.gpaPoints ? g.gpaPoints.toFixed(1) : '0.0'})
                    </span>
                  </div>
                </div>

                <table class="grade-categories-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Weight</th>
                      <th>Graded Items</th>
                      <th>Category Avg</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${g.categories.map(cat => `
                      <tr>
                        <td style="font-weight:600;">${cat.name}</td>
                        <td>${cat.weight}%</td>
                        <td>${cat.itemCount} items (${cat.earned}/${cat.possible})</td>
                        <td style="font-weight:700;">${cat.percentage !== null ? `${Math.round(cat.percentage * 10) / 10}%` : '—'}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `;
          }).join('')}
        </div>

        <div class="grades-simulator-col">
          <div class="what-if-panel">
            <h3 style="margin:0 0 0.5rem 0; font-size:1.125rem; font-weight:700; display:flex; align-items:center; gap:0.5rem;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              "What-If" Grade Simulator
            </h3>
            <p style="font-size:0.8125rem; color:var(--text-secondary); margin-bottom:1.25rem;">
              Calculate the exact score needed on your next exam or final to achieve your target class grade.
            </p>

            <div class="form-group">
              <label class="form-label">Select Course</label>
              <select class="form-control" id="what-if-class-select">
                ${classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
              </select>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Desired Grade (%)</label>
                <input type="number" class="form-control" id="what-if-target-score" value="90" min="50" max="100" />
              </div>
              <div class="form-group">
                <label class="form-label">Upcoming Exam Weight (%)</label>
                <input type="number" class="form-control" id="what-if-weight" value="25" min="5" max="100" />
              </div>
            </div>

            <button class="btn-primary" id="btn-calculate-what-if" style="width:100%; justify-content:center; margin-top:0.5rem;">
              Calculate Required Score
            </button>

            <div id="what-if-result-container" class="what-if-formula-box" style="display:none;"></div>
          </div>
        </div>
      </div>
    `;

    const btnCalc = container.querySelector('#btn-calculate-what-if');
    if (btnCalc) {
      btnCalc.addEventListener('click', () => {
        const clsId = container.querySelector('#what-if-class-select').value;
        const target = Number(container.querySelector('#what-if-target-score').value);
        const weight = Number(container.querySelector('#what-if-weight').value);

        const sim = store.simulateWhatIfGrade(clsId, target, weight);
        const resBox = container.querySelector('#what-if-result-container');
        resBox.style.display = 'block';

        resBox.innerHTML = `
          <div style="font-size:0.8125rem; color:var(--text-secondary);">
            Current Grade: <b>${sim.currentScore ? `${sim.currentScore}%` : 'No scores logged yet'}</b>
          </div>
          <div style="font-size:1.25rem; font-weight:800; margin:0.5rem 0; color:${sim.isFeasible ? 'var(--accent)' : 'var(--danger)'};">
            Need: ${sim.requiredScore}%
          </div>
          <div style="font-size:0.75rem; color:${sim.isFeasible ? 'var(--success)' : 'var(--danger)'}; font-weight:600;">
            ${sim.isFeasible 
              ? `✓ Achievable! Scoring ${sim.requiredScore}% on this ${sim.weightUsed}% weight item will secure your target ${sim.targetScore}%.`
              : `⚠️ Tough target! You would need an extra-credit score of ${sim.requiredScore}% to hit ${sim.targetScore}%.`
            }
          </div>
        `;
      });
    }
  }

  // --- CLASSES VIEW ---
  function renderClassesView() {
    const container = document.getElementById('view-classes');
    if (!container) return;

    const classes = store.getClasses();

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h1 class="section-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            Classes & Course Directory
          </h1>
          <p class="section-subtitle">Manage enrolled courses, instructors, credit hours, and grading weight categories.</p>
        </div>
        <div class="header-actions">
          <button class="btn-primary" id="btn-add-class">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Course
          </button>
        </div>
      </div>

      <div class="classes-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.25rem;">
        ${classes.map(c => `
          <div class="card-panel" style="border-top: 5px solid ${c.color}; margin-bottom:0;" data-class-id="${c.id}">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div>
                <span class="badge neutral" style="font-size:0.6875rem; margin-bottom:0.375rem;">${c.code || 'COURSE'}</span>
                <h3 style="margin:0; font-size:1.125rem; font-weight:700;">${c.name}</h3>
              </div>
              <div style="width:20px; height:20px; border-radius:4px; background:${c.color};"></div>
            </div>

            <div style="margin-top:1rem; font-size:0.8125rem; color:var(--text-secondary); display:flex; flex-direction:column; gap:0.375rem;">
              <div>👨‍🏫 <b>Instructor:</b> ${c.teacher || 'Not specified'}</div>
              ${c.teacherEmail ? `<div>✉️ <b>Email:</b> <a href="mailto:${c.teacherEmail}" style="color:var(--accent);">${c.teacherEmail}</a></div>` : ''}
              <div>📍 <b>Room:</b> ${c.room || 'TBD'}</div>
              <div>🎓 <b>Credits:</b> ${c.credits || 3} Credit Hours</div>
            </div>

            ${c.notes ? `<p style="font-size:0.75rem; color:var(--text-muted); margin-top:0.75rem; background:var(--bg-surface-hover); padding:0.5rem; border-radius:6px;">${c.notes}</p>` : ''}

            <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.25rem; padding-top:0.75rem; border-top:1px solid var(--border-subtle);">
              <button class="btn-secondary btn-edit-class" style="padding:0.375rem 0.75rem; font-size:0.75rem;">Edit Course</button>
              <button class="btn-secondary btn-delete-class" style="padding:0.375rem 0.75rem; font-size:0.75rem; color:var(--danger);">Delete</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    container.querySelector('#btn-add-class').addEventListener('click', () => openClassModal());

    container.querySelectorAll('.card-panel[data-class-id]').forEach(card => {
      const id = card.getAttribute('data-class-id');
      
      const btnEdit = card.querySelector('.btn-edit-class');
      if (btnEdit) {
        btnEdit.addEventListener('click', () => {
          const cls = store.getClassById(id);
          if (cls) openClassModal(cls);
        });
      }

      const btnDelete = card.querySelector('.btn-delete-class');
      if (btnDelete) {
        btnDelete.addEventListener('click', () => {
          if (confirm('Delete this course along with its assignments, exams, and schedule entries?')) {
            store.deleteClass(id);
            showToast('Course deleted', 'info');
          }
        });
      }
    });
  }

  // --- ANALYTICS VIEW ---
  function renderAnalyticsView() {
    const container = document.getElementById('view-analytics');
    if (!container) return;

    const assignments = store.getAssignments();
    const exams = store.getExams();
    const classes = store.getClasses();

    const total = assignments.length;
    const completed = assignments.filter(a => a.status === 'completed').length;
    const inProgress = assignments.filter(a => a.status === 'in-progress').length;
    const notStarted = assignments.filter(a => a.status === 'not-started').length;

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h1 class="section-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
            Productivity & Academic Analytics
          </h1>
          <p class="section-subtitle">Workload distribution, completion velocity, and subject balance.</p>
        </div>
      </div>

      <div class="stat-cards-grid">
        <div class="stat-card">
          <div class="stat-icon-wrapper blue">📊</div>
          <div class="stat-content">
            <span class="stat-label">Total Workload</span>
            <span class="stat-value">${total + exams.length} Items</span>
            <span class="stat-subtext">${total} assignments + ${exams.length} exams</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper emerald">✅</div>
          <div class="stat-content">
            <span class="stat-label">Finished Tasks</span>
            <span class="stat-value">${completed}</span>
            <span class="stat-subtext">${total > 0 ? Math.round((completed / total) * 100) : 0}% success rate</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper amber">⏳</div>
          <div class="stat-content">
            <span class="stat-label">Active Work</span>
            <span class="stat-value">${inProgress + notStarted}</span>
            <span class="stat-subtext">${inProgress} currently in progress</span>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="card-panel">
          <h3 class="panel-title" style="margin-bottom:1rem;">Workload by Course</h3>
          <div style="display:flex; flex-direction:column; gap:1rem;">
            ${classes.map(c => {
              const classTasks = assignments.filter(a => a.classId === c.id);
              const pct = total > 0 ? (classTasks.length / total) * 100 : 0;
              return `
                <div>
                  <div style="display:flex; justify-content:space-between; font-size:0.8125rem; font-weight:600; margin-bottom:0.25rem;">
                    <span>${c.name}</span>
                    <span>${classTasks.length} tasks (${Math.round(pct)}%)</span>
                  </div>
                  <div class="progress-bar-container" style="height:8px;">
                    <div class="progress-bar-fill" style="width:${pct}%; background:${c.color};"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="card-panel">
          <h3 class="panel-title" style="margin-bottom:1rem;">Task Status Distribution</h3>
          <div style="display:flex; flex-direction:column; gap:0.75rem; font-size:0.875rem;">
            <div style="display:flex; justify-content:space-between; padding:0.5rem; background:var(--bg-surface-hover); border-radius:6px;">
              <span>Completed</span>
              <span style="font-weight:700; color:var(--success);">${completed}</span>
            </div>
            <div style="display:flex; justify-content:space-between; padding:0.5rem; background:var(--bg-surface-hover); border-radius:6px;">
              <span>In Progress</span>
              <span style="font-weight:700; color:var(--warning);">${inProgress}</span>
            </div>
            <div style="display:flex; justify-content:space-between; padding:0.5rem; background:var(--bg-surface-hover); border-radius:6px;">
              <span>Not Started</span>
              <span style="font-weight:700; color:var(--text-muted);">${notStarted}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --- SETTINGS VIEW ---
  function renderSettingsView() {
    const container = document.getElementById('view-settings');
    if (!container) return;

    const data = store.getState();
    const savedConfig = cloud.getSavedConfig() || {};

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h1 class="section-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            Application Settings & Cloud Sync
          </h1>
          <p class="section-subtitle">Manage free Firebase cloud sync, data backup/restore, semesters, and preferences.</p>
        </div>
      </div>

      <div style="max-width:760px; display:flex; flex-direction:column; gap:1.5rem;">
        <!-- Cloud Account Card -->
        <div class="card-panel" style="border-left: 5px solid var(--accent);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <h3 class="panel-title" style="margin:0;">☁️ Cloud Account & Realtime Sync</h3>
            <span class="badge ${cloud.currentUser ? 'success' : 'neutral'}">
              ${cloud.currentUser ? '🟢 Cloud Connected' : '🟡 Offline Local Mode'}
            </span>
          </div>
          <p style="font-size:0.8125rem; color:var(--text-secondary); margin-bottom:1rem;">
            ${cloud.currentUser 
              ? `Logged in as <b>${cloud.currentUser.email}</b>. All assignment and exam edits automatically sync to Cloud Firestore in real time!`
              : `You are currently using Local Storage. Create a free account or sign in to sync seamlessly with your future iOS app.`
            }
          </p>
          <div style="display:flex; gap:0.75rem;">
            <button class="btn-primary" id="btn-open-cloud-modal">
              ${cloud.currentUser ? 'Manage Cloud Account' : 'Sign In / Create Free Account'}
            </button>
            <a href="ios_firebase_setup_guide.md" target="_blank" class="btn-secondary" style="display:inline-flex; align-items:center;">
              📱 iOS Setup Guide
            </a>
          </div>
        </div>

        <!-- Firebase Configuration Setup -->
        <div class="card-panel">
          <h3 class="panel-title" style="margin-bottom:0.5rem;">🔥 Firebase Project Setup (100% Free)</h3>
          <p style="font-size:0.8125rem; color:var(--text-secondary); margin-bottom:1rem;">
            To connect to your own Firebase project, create a free project at <a href="https://console.firebase.google.com" target="_blank" style="color:var(--accent); text-decoration:underline;">console.firebase.google.com</a> and paste your Web App config below.
          </p>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">API Key</label>
              <input type="text" class="form-control" id="fb-api-key" placeholder="AIzaSy..." value="${savedConfig.apiKey || ''}" />
            </div>
            <div class="form-group">
              <label class="form-label">Auth Domain</label>
              <input type="text" class="form-control" id="fb-auth-domain" placeholder="your-app.firebaseapp.com" value="${savedConfig.authDomain || ''}" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Project ID</label>
              <input type="text" class="form-control" id="fb-project-id" placeholder="your-app-id" value="${savedConfig.projectId || ''}" />
            </div>
            <div class="form-group">
              <label class="form-label">Storage Bucket</label>
              <input type="text" class="form-control" id="fb-storage-bucket" placeholder="your-app.appspot.com" value="${savedConfig.storageBucket || ''}" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Messaging Sender ID</label>
              <input type="text" class="form-control" id="fb-sender-id" placeholder="123456789" value="${savedConfig.messagingSenderId || ''}" />
            </div>
            <div class="form-group">
              <label class="form-label">App ID</label>
              <input type="text" class="form-control" id="fb-app-id" placeholder="1:123:web:abc" value="${savedConfig.appId || ''}" />
            </div>
          </div>

          <button class="btn-primary" id="btn-save-firebase-config" style="margin-top:0.5rem;">
            Save Firebase Keys & Connect
          </button>
        </div>

        <!-- Profile Card -->
        <div class="card-panel">
          <h3 class="panel-title" style="margin-bottom:1rem;">Student Profile</h3>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Student Name</label>
              <input type="text" class="form-control" id="settings-student-name" value="${data.settings.studentName || 'Alex Morgan'}" />
            </div>
            <div class="form-group">
              <label class="form-label">School / University</label>
              <input type="text" class="form-control" id="settings-school-name" value="${data.settings.schoolName || 'Westwood Academy'}" />
            </div>
          </div>
          <button class="btn-primary" id="btn-save-profile">Save Profile</button>
        </div>

        <!-- Data Export & Backup Card -->
        <div class="card-panel">
          <h3 class="panel-title" style="margin-bottom:1rem;">Export & Integrations</h3>
          <p style="font-size:0.8125rem; color:var(--text-secondary); margin-bottom:1rem;">
            Export your assignments and exams to external calendar apps (Google Calendar, Apple Calendar, Outlook) or download full JSON backups.
          </p>

          <div style="display:flex; flex-wrap:wrap; gap:0.75rem;">
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

        <!-- Reset & Presets -->
        <div class="card-panel" style="border-color:var(--danger-border);">
          <h3 class="panel-title" style="margin-bottom:0.5rem; color:var(--danger);">Reset / Load Demo Presets</h3>
          <p style="font-size:0.8125rem; color:var(--text-secondary); margin-bottom:1rem;">
            Reset all stored assignments, classes, and exams back to the comprehensive default sample dataset.
          </p>
          <button class="btn-secondary" id="btn-reset-demo" style="color:var(--danger); border-color:var(--danger-border);">
            🔄 Reset to Default Sample Data
          </button>
        </div>
      </div>
    `;

    container.querySelector('#btn-open-cloud-modal').addEventListener('click', () => openAuthModal());

    container.querySelector('#btn-save-firebase-config').addEventListener('click', () => {
      const config = {
        apiKey: container.querySelector('#fb-api-key').value.trim(),
        authDomain: container.querySelector('#fb-auth-domain').value.trim(),
        projectId: container.querySelector('#fb-project-id').value.trim(),
        storageBucket: container.querySelector('#fb-storage-bucket').value.trim(),
        messagingSenderId: container.querySelector('#fb-sender-id').value.trim(),
        appId: container.querySelector('#fb-app-id').value.trim(),
      };

      if (!config.apiKey || !config.projectId) {
        alert('Please fill in at least the API Key and Project ID.');
        return;
      }

      cloud.saveConfig(config);
      showToast('Firebase configuration saved! Connecting...', 'success');
      setTimeout(() => renderSettingsView(), 1000);
    });

    container.querySelector('#btn-save-profile').addEventListener('click', () => {
      const studentName = container.querySelector('#settings-student-name').value.trim();
      const schoolName = container.querySelector('#settings-school-name').value.trim();
      store.updateSettings({ studentName, schoolName });
      if (elements.userNameDisplay) elements.userNameDisplay.textContent = studentName;
      showToast('Profile updated successfully', 'success');
    });

    container.querySelector('#btn-export-ical').addEventListener('click', () => {
      const icsContent = store.generateICalString();
      downloadFile(icsContent, 'academiapro-schedule.ics', 'text/calendar');
      showToast('iCal calendar file downloaded!', 'success');
    });

    container.querySelector('#btn-export-json').addEventListener('click', () => {
      const jsonStr = JSON.stringify(store.getState(), null, 2);
      downloadFile(jsonStr, 'academiapro-backup.json', 'application/json');
      showToast('JSON backup file downloaded!', 'success');
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
            store.saveToStorage(parsed);
            store.data = parsed;
            store.notify('data_imported');
            showToast('Data restored successfully from backup!', 'success');
            renderSettingsView();
          } catch (err) {
            alert('Failed to parse backup JSON file: ' + err.message);
          }
        };
        reader.readAsText(file);
      });
    }

    container.querySelector('#btn-reset-demo').addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all planner data to default sample items?')) {
        store.resetToSampleData();
        showToast('Planner reset to sample data', 'info');
        renderSettingsView();
      }
    });
  }

  // --- AUTH & CLOUD SYNC MODAL ---
  function openAuthModal() {
    const isLogged = cloud.currentUser;

    if (isLogged) {
      const html = `
        <div class="modal-dialog" style="max-width:480px;">
          <div class="modal-header">
            <h2 class="modal-title">☁️ Cloud Sync & Account</h2>
            <button class="modal-close-btn" id="modal-close">✕</button>
          </div>
          <div class="modal-body">
            <div style="display:flex; align-items:center; gap:1rem; padding:1rem; background:var(--bg-surface-hover); border-radius:var(--radius-md); margin-bottom:1.25rem;">
              <div class="user-avatar" style="width:48px; height:48px; font-size:1.25rem;">
                ${(cloud.currentUser.email || 'AM').slice(0, 2).toUpperCase()}
              </div>
              <div style="overflow:hidden;">
                <div style="font-weight:700; font-size:1rem; color:var(--text-primary); text-overflow:ellipsis; overflow:hidden;">
                  ${cloud.currentUser.email}
                </div>
                <div style="font-size:0.75rem; color:var(--success); font-weight:600; margin-top:0.25rem;">
                  🟢 Realtime Cloud Sync Active
                </div>
              </div>
            </div>

            <div style="font-size:0.8125rem; color:var(--text-secondary); margin-bottom:1.25rem; line-height:1.6;">
              <p><b>User ID:</b> <code style="font-family:var(--font-mono); font-size:0.75rem;">${cloud.currentUser.uid}</code></p>
              <p style="margin-top:0.5rem;">Your homework, exams, and classes are synchronized automatically with Cloud Firestore. Any iOS app you build with this user account will share this exact data.</p>
            </div>

            <div style="display:flex; flex-direction:column; gap:0.75rem;">
              <button class="btn-primary" id="btn-force-cloud-sync" style="justify-content:center;">
                🔄 Sync Now to Cloud
              </button>
              <button class="btn-secondary" id="btn-cloud-logout" style="justify-content:center; color:var(--danger);">
                Log Out of Account
              </button>
            </div>
          </div>
        </div>
      `;

      openModalHTML(html, dialog => {
        dialog.querySelector('#btn-force-cloud-sync').addEventListener('click', async () => {
          await cloud.syncToCloud(store.getState());
          showToast('Data uploaded and synced to Cloud!', 'success');
        });
        dialog.querySelector('#btn-cloud-logout').addEventListener('click', async () => {
          await cloud.signOut();
          showToast('Logged out of cloud account', 'info');
          closeModal();
          renderSettingsView();
        });
      });
      return;
    }

    // Not logged in: Show Login / Register Tabs
    const html = `
      <div class="modal-dialog" style="max-width:480px;">
        <div class="modal-header">
          <h2 class="modal-title">Free Cloud Account</h2>
          <button class="modal-close-btn" id="modal-close">✕</button>
        </div>

        <div class="modal-body">
          <div class="auth-tabs-header">
            <button class="auth-tab-btn active" id="tab-sign-in">Sign In</button>
            <button class="auth-tab-btn" id="tab-register">Create Account</button>
          </div>

          <div id="auth-alert-message" class="auth-alert-box"></div>

          <form id="form-auth">
            <div class="form-group" id="group-display-name" style="display:none;">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-control" id="auth-name" placeholder="Alex Morgan" />
            </div>

            <div class="form-group">
              <label class="form-label">Email Address *</label>
              <input type="email" class="form-control" id="auth-email" required placeholder="student@school.edu" />
            </div>

            <div class="form-group">
              <label class="form-label">Password *</label>
              <input type="password" class="form-control" id="auth-password" required minlength="6" placeholder="At least 6 characters" />
            </div>

            <button type="submit" class="btn-primary" id="btn-auth-submit" style="width:100%; justify-content:center; padding:0.75rem; margin-top:0.5rem;">
              Sign In
            </button>
          </form>

          <p style="font-size:0.75rem; color:var(--text-muted); text-align:center; margin-top:1.25rem; line-height:1.5;">
            🔒 100% Free with Firebase Authentication & Cloud Firestore.<br>
            Enables instant cross-device sync on Web and your future iOS app.
          </p>
        </div>
      </div>
    `;

    openModalHTML(html, dialog => {
      let isRegister = false;
      const tabSignIn = dialog.querySelector('#tab-sign-in');
      const tabRegister = dialog.querySelector('#tab-register');
      const groupName = dialog.querySelector('#group-display-name');
      const btnSubmit = dialog.querySelector('#btn-auth-submit');
      const alertBox = dialog.querySelector('#auth-alert-message');
      const form = dialog.querySelector('#form-auth');

      tabSignIn.addEventListener('click', () => {
        isRegister = false;
        tabSignIn.classList.add('active');
        tabRegister.classList.remove('active');
        groupName.style.display = 'none';
        btnSubmit.textContent = 'Sign In';
        alertBox.className = 'auth-alert-box';
      });

      tabRegister.addEventListener('click', () => {
        isRegister = true;
        tabRegister.classList.add('active');
        tabSignIn.classList.remove('active');
        groupName.style.display = 'block';
        btnSubmit.textContent = 'Create Free Account';
        alertBox.className = 'auth-alert-box';
      });

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = dialog.querySelector('#auth-email').value.trim();
        const password = dialog.querySelector('#auth-password').value;
        const name = dialog.querySelector('#auth-name').value.trim();

        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Processing...';

        try {
          if (isRegister) {
            await cloud.signUp(email, password, name);
            showToast('🎉 Free cloud account created! Syncing...', 'success');
          } else {
            await cloud.signIn(email, password);
            showToast('✓ Signed in! Cloud data synced.', 'success');
          }
          closeModal();
        } catch (err) {
          alertBox.className = 'auth-alert-box danger';
          alertBox.textContent = err.message || 'Authentication error. Please check your credentials or Firebase settings.';
          btnSubmit.disabled = false;
          btnSubmit.textContent = isRegister ? 'Create Free Account' : 'Sign In';
        }
      });
    });
  }

  // --- MODALS ---
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
              <input type="text" class="form-control" name="title" required placeholder="e.g. Chapter 6 Problem Set" value="${existing ? existing.title : ''}" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Course / Class *</label>
                <select class="form-control" name="classId" required id="modal-asg-class">
                  ${classes.map(c => `<option value="${c.id}" ${existing && existing.classId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
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
                  <option value="other" ${existing && existing.type === 'other' ? 'selected' : ''}>Other</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Due Date & Time *</label>
                <input type="datetime-local" class="form-control" name="dueDate" required value="${existing && existing.dueDate ? existing.dueDate.slice(0, 16) : getRelativeInputDate(1)}" />
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
              <label class="form-label">Instructions / Description</label>
              <textarea class="form-control" name="description" placeholder="Add assignment details or instructions...">${existing ? existing.description || '' : ''}</textarea>
            </div>

            <div class="form-group">
              <label class="form-label" style="display:flex; justify-content:space-between;">
                <span>Subtasks & Checklists</span>
                <button type="button" id="btn-add-subtask-row" style="color:var(--accent); font-weight:600; font-size:0.75rem;">+ Add Step</button>
              </label>
              <div id="subtasks-inputs-list" style="display:flex; flex-direction:column; gap:0.5rem;">
                ${(existing && existing.subtasks ? existing.subtasks : []).map(st => `
                  <div class="subtask-row-item" style="display:flex; gap:0.5rem;">
                    <input type="text" class="form-control subtask-title-input" value="${st.title}" placeholder="Step title" />
                    <button type="button" class="btn-remove-subtask" style="color:var(--danger); padding:0 0.5rem;">✕</button>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Grade Score Earned</label>
                <input type="number" class="form-control" name="scoreEarned" placeholder="Optional" value="${existing && existing.scoreEarned !== null ? existing.scoreEarned : ''}" />
              </div>
              <div class="form-group">
                <label class="form-label">Max Score Possible</label>
                <input type="number" class="form-control" name="maxScore" value="${existing && existing.maxScore ? existing.maxScore : '100'}" />
              </div>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" id="modal-cancel">Cancel</button>
          <button class="btn-primary" id="modal-submit">${isEdit ? 'Save Changes' : 'Create Assignment'}</button>
        </div>
      </div>
    `;

    openModalHTML(html, (dialog) => {
      const btnAddSubtask = dialog.querySelector('#btn-add-subtask-row');
      const subtasksList = dialog.querySelector('#subtasks-inputs-list');
      btnAddSubtask.addEventListener('click', () => {
        const div = document.createElement('div');
        div.className = 'subtask-row-item';
        div.style.cssText = 'display:flex; gap:0.5rem;';
        div.innerHTML = `
          <input type="text" class="form-control subtask-title-input" placeholder="Next step..." />
          <button type="button" class="btn-remove-subtask" style="color:var(--danger); padding:0 0.5rem;">✕</button>
        `;
        subtasksList.appendChild(div);
        div.querySelector('.btn-remove-subtask').addEventListener('click', () => div.remove());
      });

      dialog.querySelectorAll('.btn-remove-subtask').forEach(btn => {
        btn.addEventListener('click', (e) => e.target.closest('.subtask-row-item').remove());
      });

      dialog.querySelector('#modal-submit').addEventListener('click', () => {
        const form = dialog.querySelector('#form-assignment');
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        const formData = new FormData(form);
        const subtaskTitles = Array.from(dialog.querySelectorAll('.subtask-title-input'))
          .map(i => i.value.trim())
          .filter(t => t.length > 0);

        const subtasks = subtaskTitles.map((t, idx) => ({
          id: 'st-' + idx + '-' + Date.now(),
          title: t,
          isCompleted: existing && existing.subtasks && existing.subtasks[idx] ? existing.subtasks[idx].isCompleted : false
        }));

        const payload = {
          title: formData.get('title'),
          classId: formData.get('classId'),
          type: formData.get('type'),
          dueDate: formData.get('dueDate'),
          priority: formData.get('priority'),
          description: formData.get('description'),
          scoreEarned: formData.get('scoreEarned'),
          maxScore: formData.get('maxScore'),
          subtasks
        };

        if (isEdit) {
          store.updateAssignment(existing.id, payload);
          showToast('Assignment updated', 'success');
        } else {
          store.addAssignment(payload);
          showToast('Assignment created!', 'success');
        }

        closeModal();
      });
    });
  }

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
              <label class="form-label">Exam / Test Title *</label>
              <input type="text" class="form-control" name="title" required placeholder="e.g. Calculus Midterm Examination" value="${existing ? existing.title : ''}" />
            </div>

            <div class="form-group">
              <label class="form-label">Course / Class *</label>
              <select class="form-control" name="classId" required>
                ${classes.map(c => `<option value="${c.id}" ${existing && existing.classId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
              </select>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Exam Date *</label>
                <input type="date" class="form-control" name="date" required value="${existing ? existing.date : getRelativeInputDate(7).split('T')[0]}" />
              </div>

              <div class="form-group">
                <label class="form-label">Start Time</label>
                <input type="time" class="form-control" name="startTime" value="${existing ? existing.startTime : '09:00'}" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Duration (Minutes)</label>
                <input type="number" class="form-control" name="duration" value="${existing ? existing.duration : '90'}" />
              </div>

              <div class="form-group">
                <label class="form-label">Location / Room</label>
                <input type="text" class="form-control" name="room" placeholder="e.g. Science Hall 304" value="${existing ? existing.room || '' : ''}" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Seat Assigned (Optional)</label>
                <input type="text" class="form-control" name="seatNumber" placeholder="e.g. Seat 14" value="${existing ? existing.seatNumber || '' : ''}" />
              </div>

              <div class="form-group">
                <label class="form-label">Status</label>
                <select class="form-control" name="status">
                  <option value="upcoming" ${!existing || existing.status === 'upcoming' ? 'selected' : ''}>Upcoming</option>
                  <option value="completed" ${existing && existing.status === 'completed' ? 'selected' : ''}>Completed</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Study Topics (comma-separated)</label>
              <input type="text" class="form-control" name="topics" placeholder="Limits, Integrals, Series" value="${existing && existing.topics ? existing.topics.join(', ') : ''}" />
            </div>

            <div class="form-group">
              <label class="form-label">Description / Format Notes</label>
              <textarea class="form-control" name="description" placeholder="Calculator rules, question counts, etc.">${existing ? existing.description || '' : ''}</textarea>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" id="modal-cancel">Cancel</button>
          <button class="btn-primary" id="modal-submit">${isEdit ? 'Save Changes' : 'Schedule Exam'}</button>
        </div>
      </div>
    `;

    openModalHTML(html, (dialog) => {
      dialog.querySelector('#modal-submit').addEventListener('click', () => {
        const form = dialog.querySelector('#form-exam');
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        const formData = new FormData(form);
        const rawTopics = formData.get('topics');
        const topics = rawTopics ? rawTopics.split(',').map(t => t.trim()).filter(t => t.length > 0) : [];

        const payload = {
          title: formData.get('title'),
          classId: formData.get('classId'),
          date: formData.get('date'),
          startTime: formData.get('startTime'),
          duration: formData.get('duration'),
          room: formData.get('room'),
          seatNumber: formData.get('seatNumber'),
          status: formData.get('status'),
          topics,
          description: formData.get('description')
        };

        if (isEdit) {
          store.updateExam(existing.id, payload);
          showToast('Exam updated', 'success');
        } else {
          store.addExam(payload);
          showToast('Exam scheduled!', 'success');
        }

        closeModal();
      });
    });
  }

  function openClassModal(existing = null) {
    const isEdit = !!existing;
    let selectedColor = existing ? existing.color : SUBJECT_COLORS[0];

    const html = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h2 class="modal-title">${isEdit ? 'Edit Course' : 'Add New Course'}</h2>
          <button class="modal-close-btn" id="modal-close">✕</button>
        </div>

        <div class="modal-body">
          <form id="form-class">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Course Name *</label>
                <input type="text" class="form-control" name="name" required placeholder="e.g. AP Calculus BC" value="${existing ? existing.name : ''}" />
              </div>
              <div class="form-group">
                <label class="form-label">Course Code</label>
                <input type="text" class="form-control" name="code" placeholder="e.g. MATH 302" value="${existing ? existing.code || '' : ''}" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Instructor Name</label>
                <input type="text" class="form-control" name="teacher" placeholder="e.g. Dr. Aris Thorne" value="${existing ? existing.teacher || '' : ''}" />
              </div>
              <div class="form-group">
                <label class="form-label">Instructor Email</label>
                <input type="email" class="form-control" name="teacherEmail" placeholder="teacher@school.edu" value="${existing ? existing.teacherEmail || '' : ''}" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Default Room</label>
                <input type="text" class="form-control" name="room" placeholder="e.g. Room 304" value="${existing ? existing.room || '' : ''}" />
              </div>
              <div class="form-group">
                <label class="form-label">Credit Hours (for GPA)</label>
                <input type="number" class="form-control" name="credits" value="${existing ? existing.credits : '3'}" min="1" max="6" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Course Color Accent</label>
              <div class="color-picker-grid" id="modal-color-swatches">
                ${SUBJECT_COLORS.map(color => `
                  <div class="color-swatch ${color === selectedColor ? 'active' : ''}" style="background:${color};" data-color="${color}"></div>
                `).join('')}
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Notes & Syllabus Info</label>
              <textarea class="form-control" name="notes" placeholder="Office hours, grading rules, textbook requirements...">${existing ? existing.notes || '' : ''}</textarea>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" id="modal-cancel">Cancel</button>
          <button class="btn-primary" id="modal-submit">${isEdit ? 'Save Changes' : 'Create Course'}</button>
        </div>
      </div>
    `;

    openModalHTML(html, (dialog) => {
      dialog.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.addEventListener('click', () => {
          dialog.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
          swatch.classList.add('active');
          selectedColor = swatch.getAttribute('data-color');
        });
      });

      dialog.querySelector('#modal-submit').addEventListener('click', () => {
        const form = dialog.querySelector('#form-class');
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        const formData = new FormData(form);
        const payload = {
          name: formData.get('name'),
          code: formData.get('code'),
          teacher: formData.get('teacher'),
          teacherEmail: formData.get('teacherEmail'),
          room: formData.get('room'),
          credits: formData.get('credits'),
          color: selectedColor,
          notes: formData.get('notes')
        };

        if (isEdit) {
          store.updateClass(existing.id, payload);
          showToast('Course updated', 'success');
        } else {
          store.addClass(payload);
          showToast('Course added!', 'success');
        }

        closeModal();
      });
    });
  }

  function openScheduleSlotModal() {
    const classes = store.getClasses();

    const html = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h2 class="modal-title">Add Class to Timetable</h2>
          <button class="modal-close-btn" id="modal-close">✕</button>
        </div>

        <div class="modal-body">
          <form id="form-schedule">
            <div class="form-group">
              <label class="form-label">Select Course *</label>
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
              <label class="form-label">Room Number</label>
              <input type="text" class="form-control" name="room" placeholder="e.g. 304" />
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" id="modal-cancel">Cancel</button>
          <button class="btn-primary" id="modal-submit">Add to Schedule</button>
        </div>
      </div>
    `;

    openModalHTML(html, (dialog) => {
      dialog.querySelector('#modal-submit').addEventListener('click', () => {
        const form = dialog.querySelector('#form-schedule');
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        const formData = new FormData(form);
        store.addScheduleSlot({
          classId: formData.get('classId'),
          dayOfWeek: formData.get('dayOfWeek'),
          startTime: formData.get('startTime'),
          endTime: formData.get('endTime'),
          room: formData.get('room')
        });
        showToast('Timetable period added!', 'success');
        closeModal();
      });
    });
  }

  function openQuickAddModal() {
    const html = `
      <div class="modal-dialog" style="max-width:480px;">
        <div class="modal-header">
          <h2 class="modal-title">Quick Action</h2>
          <button class="modal-close-btn" id="modal-close">✕</button>
        </div>
        <div class="modal-body" style="display:flex; flex-direction:column; gap:0.75rem;">
          <button class="btn-secondary" id="quick-btn-asg" style="padding:1rem; justify-content:flex-start; font-size:1rem;">
            📝 Add New Assignment
          </button>
          <button class="btn-secondary" id="quick-btn-exam" style="padding:1rem; justify-content:flex-start; font-size:1rem;">
            🎯 Schedule an Exam
          </button>
          <button class="btn-secondary" id="quick-btn-class" style="padding:1rem; justify-content:flex-start; font-size:1rem;">
            📚 Add Course / Class
          </button>
        </div>
      </div>
    `;

    openModalHTML(html, (dialog) => {
      dialog.querySelector('#quick-btn-asg').addEventListener('click', () => {
        closeModal();
        openAssignmentModal();
      });
      dialog.querySelector('#quick-btn-exam').addEventListener('click', () => {
        closeModal();
        openExamModal();
      });
      dialog.querySelector('#quick-btn-class').addEventListener('click', () => {
        closeModal();
        openClassModal();
      });
    });
  }

  function showUpcomingAlertsModal() {
    const assignments = store.getAssignments();
    const now = new Date();

    const overdue = assignments.filter(a => a.status !== 'completed' && new Date(a.dueDate) < now);
    const next7Days = new Date();
    next7Days.setDate(next7Days.getDate() + 7);
    const upcomingAsgs = assignments.filter(a => a.status !== 'completed' && new Date(a.dueDate) >= now && new Date(a.dueDate) <= next7Days);

    const html = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h2 class="modal-title">Notifications & Reminders</h2>
          <button class="modal-close-btn" id="modal-close">✕</button>
        </div>
        <div class="modal-body">
          ${overdue.length > 0 ? `
            <h4 style="color:var(--danger); margin-bottom:0.5rem;">⚠️ Overdue Assignments (${overdue.length})</h4>
            <div style="margin-bottom:1.25rem;">
              ${overdue.map(o => `
                <div style="padding:0.5rem 0; border-bottom:1px solid var(--border-subtle); font-size:0.875rem;">
                  <b>${o.title}</b> • Due ${formatDateTime(o.dueDate)}
                </div>
              `).join('')}
            </div>
          ` : ''}

          <h4 style="margin-bottom:0.5rem;">Upcoming This Week (${upcomingAsgs.length})</h4>
          <div>
            ${upcomingAsgs.map(u => `
              <div style="padding:0.5rem 0; border-bottom:1px solid var(--border-subtle); font-size:0.875rem;">
                <b>${u.title}</b> • Due ${formatDateTime(u.dueDate)}
              </div>
            `).join('')}
            ${upcomingAsgs.length === 0 ? `<p style="color:var(--text-muted); font-size:0.875rem;">No tasks due this week.</p>` : ''}
          </div>
        </div>
      </div>
    `;

    openModalHTML(html);
  }

  function openModalHTML(html, bindCallback = null) {
    state.modalContext = true;
    elements.modalContainer.innerHTML = html;
    elements.modalOverlay.classList.add('active');

    const dialog = elements.modalContainer.querySelector('.modal-dialog');
    const btnClose = dialog.querySelector('#modal-close');
    const btnCancel = dialog.querySelector('#modal-cancel');

    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnCancel) btnCancel.addEventListener('click', closeModal);

    elements.modalOverlay.onclick = (e) => {
      if (e.target === elements.modalOverlay) closeModal();
    };

    if (bindCallback) bindCallback(dialog);
  }

  function closeModal() {
    state.modalContext = null;
    elements.modalOverlay.classList.remove('active');
    elements.modalContainer.innerHTML = '';
  }

  function showToast(message, type = 'info') {
    if (!elements.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✓' : type === 'danger' ? '✕' : 'ℹ'}</span>
      <span>${message}</span>
    `;
    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 200ms ease';
      setTimeout(() => toast.remove(), 200);
    }, 3200);
  }

  function checkDueSoonReminders() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }

  // --- UTILITIES ---
  function getPriorityBadgeClass(p) {
    if (p === 'high') return 'danger';
    if (p === 'medium') return 'warning';
    return 'info';
  }

  function getDayName(dayNum) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNum] || 'Monday';
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + (dateStr.includes('T') ? '' : 'T00:00:00'));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function formatDateTime(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }

  function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }

  function getDaysDiff(d1, d2) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round((d2 - d1) / oneDay);
  }

  function getRelativeInputDate(daysOffset) {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    d.setHours(23, 59, 0, 0);
    return d.toISOString().slice(0, 16);
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

  // Self-executing initialization on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
