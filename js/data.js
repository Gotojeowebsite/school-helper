/**
 * AcademiaPro Data Layer & State Management
 * Persistent localStorage architecture with schema migrations,
 * full academic data models, reactive store events, and seed presets.
 */

const STORAGE_KEY = 'academia_pro_data_v1';

// Available Subject Color Palettes
export const SUBJECT_COLORS = [
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

// Default Initial Seed Data
const DEFAULT_DATA = {
  settings: {
    activeSemesterId: 'sem-fall-2026',
    theme: 'light',
    scheduleMode: 'standard', // 'standard' | 'ab-block'
    currentCycleDay: 'A', // 'A' | 'B'
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
      name: 'Intro to Data Structures & Algorithms',
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
    // AP Calculus: Mon, Wed, Fri 09:00 - 10:15
    { id: 'sch-1', classId: 'cls-calc', dayOfWeek: 1, startTime: '09:00', endTime: '10:15', room: '304', scheduleType: 'all' },
    { id: 'sch-2', classId: 'cls-calc', dayOfWeek: 3, startTime: '09:00', endTime: '10:15', room: '304', scheduleType: 'all' },
    { id: 'sch-3', classId: 'cls-calc', dayOfWeek: 5, startTime: '09:00', endTime: '10:15', room: '304', scheduleType: 'all' },

    // AP Biology: Tue, Thu 09:30 - 11:00 + Fri Lab 13:00 - 15:00
    { id: 'sch-4', classId: 'cls-bio', dayOfWeek: 2, startTime: '09:30', endTime: '11:00', room: 'Bio Lab 2', scheduleType: 'all' },
    { id: 'sch-5', classId: 'cls-bio', dayOfWeek: 4, startTime: '09:30', endTime: '11:00', room: 'Bio Lab 2', scheduleType: 'all' },
    { id: 'sch-6', classId: 'cls-bio', dayOfWeek: 5, startTime: '13:00', endTime: '15:00', room: 'Bio Lab 2', scheduleType: 'all' },

    // World Lit: Mon, Wed 10:45 - 12:15
    { id: 'sch-7', classId: 'cls-lit', dayOfWeek: 1, startTime: '10:45', endTime: '12:15', room: '112', scheduleType: 'all' },
    { id: 'sch-8', classId: 'cls-lit', dayOfWeek: 3, startTime: '10:45', endTime: '12:15', room: '112', scheduleType: 'all' },

    // CS 210: Tue, Thu 13:00 - 14:30
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
    },
    {
      id: 'asg-6',
      semesterId: 'sem-fall-2026',
      classId: 'cls-bio',
      title: 'Enzyme Kinetics Quiz',
      description: 'Short check-in on Michaelis-Menten kinetics and competitive inhibition.',
      type: 'quiz',
      dueDate: getRelativeDate(-5, '09:30'),
      priority: 'medium',
      status: 'completed',
      completionPercentage: 100,
      gradeCategoryId: 'gc-bio-hw',
      scoreEarned: 92,
      maxScore: 100,
      subtasks: [],
      notes: 'Reviewed in class.'
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
      description: 'Covers Units 1-6: Limits, Derivatives, Integrals, and Series Tests. Scientific/Graphing calculator permitted for Section II only.',
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
      description: '50 Multiple Choice questions + 2 Free Response Questions on Photosynthesis, Respiration, and Mendelian Genetics.',
      gradeCategoryId: 'gc-bio-tests',
      scoreEarned: null,
      maxScore: 100,
      status: 'upcoming',
      topics: ['Krebs Cycle', 'Electron Transport Chain', 'Light Reactions', 'Punnett Squares', 'Epistasis']
    },
    {
      id: 'ex-3',
      semesterId: 'sem-fall-2026',
      classId: 'cls-cs',
      title: 'CS 210 Midterm Exam: Linear Data Structures',
      date: getRelativeDate(-10, '').split('T')[0],
      startTime: '13:00',
      duration: 80,
      room: 'Turing Lab A',
      seatNumber: 'Station 8',
      description: 'Covers Linked Lists, Stacks, Queues, and Big-O Asymptotic Complexity.',
      gradeCategoryId: 'gc-cs-exam',
      scoreEarned: 94,
      maxScore: 100,
      status: 'completed',
      topics: ['Big-O Analysis', 'Doubly Linked Lists', 'Circular Queues']
    }
  ]
};

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

// Data Store Class with Observer Pattern
class AcademicStore {
  constructor() {
    this.listeners = new Set();
    this.data = this.loadFromStorage();
  }

  // Load or initialize state
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

  // Save to persistent storage
  saveToStorage(data) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch (e) {
      console.error('Error saving data to localStorage:', e);
    }
  }

  // Validate and ensure required fields exist
  validateAndMigrate(data) {
    if (!data.settings) data.settings = { ...DEFAULT_DATA.settings };
    if (!Array.isArray(data.semesters)) data.semesters = [...DEFAULT_DATA.semesters];
    if (!Array.isArray(data.classes)) data.classes = [...DEFAULT_DATA.classes];
    if (!Array.isArray(data.schedule)) data.schedule = [...DEFAULT_DATA.schedule];
    if (!Array.isArray(data.assignments)) data.assignments = [...DEFAULT_DATA.assignments];
    if (!Array.isArray(data.exams)) data.exams = [...DEFAULT_DATA.exams];
    return data;
  }

  // Subscribe to changes
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notify all listeners
  notify(changeType, payload) {
    this.saveToStorage(this.data);
    this.listeners.forEach(fn => fn(changeType, payload, this.data));
  }

  // Getters
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

  // --- CRUD ACTIONS ---

  // Assignments
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

  // Exams
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

  // Classes
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
      // Clean up orphaned assignments, exams, and schedule slots
      this.data.assignments = this.data.assignments.filter(a => a.classId !== id);
      this.data.exams = this.data.exams.filter(e => e.classId !== id);
      this.data.schedule = this.data.schedule.filter(s => s.classId !== id);
      this.notify('class_deleted', deleted);
      return deleted;
    }
    return null;
  }

  // Schedule Slots
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

  // Settings & Theme
  updateSettings(updates) {
    this.data.settings = { ...this.data.settings, ...updates };
    this.notify('settings_updated', this.data.settings);
  }

  // Reset to default seed
  resetToSampleData() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    this.saveToStorage(this.data);
    this.notify('data_reset', this.data);
  }

  // --- ACADEMIC CALCULATIONS & GRADE ENGINES ---

  /**
   * Calculates overall weighted average score and letter grade for a specific class
   */
  calculateClassGrade(classId) {
    const cls = this.getClassById(classId);
    if (!cls) return { score: null, letter: 'N/A', categories: [] };

    const classAsgs = this.getAssignments().filter(a => a.classId === classId && a.scoreEarned !== null);
    const classExams = this.getExams().filter(e => e.classId === classId && e.scoreEarned !== null);

    const categories = (cls.gradeCategories || []).map(cat => {
      // Find all graded items in this category
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

    // Calculate weighted aggregate
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

  /**
   * Calculate cumulative weighted GPA across all enrolled courses in the term
   */
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

  /**
   * "What-If" Grade Predictor Simulation Engine
   * Calculates what minimum score a student needs on an upcoming exam/assignment category
   * to achieve a target overall class percentage (e.g. 90% for an A).
   */
  simulateWhatIfGrade(classId, targetOverallScore, upcomingCategoryWeight) {
    const current = this.calculateClassGrade(classId);
    if (!current || current.score === null) {
      return { requiredScore: targetOverallScore, isFeasible: true };
    }

    const currentWeight = current.totalWeightUsed;
    const remainingWeight = 100 - currentWeight;
    const weightToUse = upcomingCategoryWeight || remainingWeight || 20;

    // Formula: (CurrentScore * CurrentWeight + Required * NextWeight) / (CurrentWeight + NextWeight) = Target
    // Required = (Target * (CurrentWeight + NextWeight) - (CurrentScore * CurrentWeight)) / NextWeight
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

  /**
   * Generates standard iCal (.ics) format string for exporting to Google Calendar / Apple Calendar
   */
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

// Singleton Data Store Export
export const store = new AcademicStore();
