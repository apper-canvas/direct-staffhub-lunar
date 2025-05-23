import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, parseISO } from 'date-fns'
import ApperIcon from './ApperIcon'
import { useSelector } from 'react-redux'

// Import services
import { fetchEmployees, createEmployee, updateEmployee, deleteEmployee } from '../services/employeeService'
import { fetchProjects, createProject, updateProject, deleteProject } from '../services/projectService'
import { fetchAttendanceRecords, createAttendanceRecord, updateAttendanceRecord, getAttendanceByEmployeeAndDate } from '../services/attendanceService'
import { fetchLeaveRequests, createLeaveRequest, updateLeaveRequest } from '../services/leaveRequestService'
import { fetchProjectMembers, addEmployeesToProject } from '../services/projectMemberService'
import { fetchDepartments } from '../services/departmentService'

const MainFeature = () => {
  const [activeTab, setActiveTab] = useState('employee')
  const { isAuthenticated, user } = useSelector(state => state.user)
  
  // Data states
  const [employees, setEmployees] = useState([])
  const [projects, setProjects] = useState([])
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [leaveRequests, setLeaveRequests] = useState([])
  const [projectMembers, setProjectMembers] = useState([])
  const [departments, setDepartments] = useState([])

  // Loading states
  const [loadingEmployees, setLoadingEmployees] = useState(false)
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [loadingAttendance, setLoadingAttendance] = useState(false)
  const [loadingLeaveRequests, setLoadingLeaveRequests] = useState(false)
  const [loadingProjectMembers, setLoadingProjectMembers] = useState(false)
  const [loadingDepartments, setLoadingDepartments] = useState(false)
  
  // Action loading states
  const [creatingEmployee, setCreatingEmployee] = useState(false)
  const [updatingEmployee, setUpdatingEmployee] = useState(false)
  const [deletingEmployee, setDeletingEmployee] = useState(false)
  const [creatingProject, setCreatingProject] = useState(false)
  const [updatingProject, setUpdatingProject] = useState(false)
  const [deletingProject, setDeletingProject] = useState(false)
  const [submittingLeave, setSubmittingLeave] = useState(false)
  const [clockingInOut, setClockingInOut] = useState(false)
  
  // Error states
  const [employeesError, setEmployeesError] = useState(null)
  const [projectsError, setProjectsError] = useState(null)
  const [attendanceError, setAttendanceError] = useState(null)
  const [leaveRequestsError, setLeaveRequestsError] = useState(null)
  
  // Placeholder data for fallback
  const placeholderProjects = [
    {
      Id: "placeholder-1",
      Name: "Employee Portal Redesign",
      description: "Modernize the employee self-service portal with new UI/UX",
      status: "in-progress",
      priority: "high",
      startDate: "2024-01-15",
      endDate: "2024-03-30",
      teamMembers: [1, 2],
      progress: 65,
      budget: 75000
    },
    {
      Id: "placeholder-2",
      Name: "HR Analytics Dashboard",
      description: "Build comprehensive analytics dashboard for HR metrics",
      status: "planning",
      priority: "medium",
      startDate: "2024-02-01",
      endDate: "2024-05-15",
      teamMembers: [1, 3],
      progress: 15,
      budget: 45000
    }
  ]
  
  // Placeholder leave requests
  const placeholderLeaveRequests = [
    {
      id: "placeholder-1",
      employeeId: 1,
      employeeName: "Sarah Johnson",
      leaveType: "Annual Leave",
      employeeName: "Sarah Johnson",
      leaveType: "Annual Leave",
      startDate: "2024-01-20",
      endDate: "2024-01-22",
      days: 3,
      reason: "Family vacation",
      status: "approved"
    },
    {
      employeeName: "Michael Chen",
      leaveType: "Sick Leave",
      startDate: "2024-01-18",
      endDate: "2024-01-18",
      days: 1,
      reason: "Medical appointment",
      status: "pending"
    }
  ]

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false)

  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    startDate: ''
  })

  const [createProjectForm, setCreateProjectForm] = useState({
    name: '',
    description: '',
    priority: 'medium',
    startDate: '',
    endDate: '',
    teamMembers: [],
    budget: ''
  })

  const [newLeaveRequest, setNewLeaveRequest] = useState({
    employeeId: '',
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: ''
  })
  
  const [attendanceFilter, setAttendanceFilter] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    employee: 'all',
    status: 'all'
  })
  
  const [showLeaveForm, setShowLeaveForm] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [clockedInEmployees, setClockedInEmployees] = useState(new Set())
  
  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])
  
  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    position: '',
    hireDate: format(new Date(), 'yyyy-MM-dd')
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    position: '',
    hireDate: ''
  })

  const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    onLeave: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    terminated: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  }

  const leaveTypes = ['Annual Leave', 'Sick Leave', 'Personal Leave', 'Maternity Leave', 'Paternity Leave', 'Emergency Leave']
  const attendanceStatuses = ['present', 'absent', 'late', 'half-day']
  const attendanceStatusColors = {
    present: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    absent: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    late: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    'half-day': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
  }
  
  const leaveStatusColors = {
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  }

  // Load initial data
  useEffect(() => {
    if (isAuthenticated) {
      loadEmployees();
      loadDepartments();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'projects') {
      loadProjects();
      loadProjectMembers();
    }
  }, [isAuthenticated, activeTab]);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'attendance') {
      loadAttendanceRecords();
      loadLeaveRequests();
    }
  }, [isAuthenticated, activeTab]);

  // Data loading functions
  const loadEmployees = async () => {
    setLoadingEmployees(true);
    setEmployeesError(null);
    try {
      const data = await fetchEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Failed to load employees:', error);
      setEmployeesError('Failed to load employees. Please try again.');
      toast.error('Failed to load employees');
    } finally {
      setLoadingEmployees(false);
    }
  };

  const loadProjects = async () => {
    setLoadingProjects(true);
    setProjectsError(null);
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
      setProjectsError('Failed to load projects. Please try again.');
      toast.error('Failed to load projects');
    } finally {
      setLoadingProjects(false);
    }
  };

  const loadAttendanceRecords = async () => {
    setLoadingAttendance(true);
    setAttendanceError(null);
    try {
      const currentDate = format(new Date(), 'yyyy-MM-dd');
      const data = await fetchAttendanceRecords({ date: currentDate });
      setAttendanceRecords(data);
      
      // Set which employees are clocked in
      const clockedInIds = new Set(
        data
          .filter(record => record.clockIn && !record.clockOut)
          .map(record => record.employee)
      );
      setClockedInEmployees(clockedInIds);
    } catch (error) {
      console.error('Failed to load attendance records:', error);
      setAttendanceError('Failed to load attendance records. Please try again.');
      toast.error('Failed to load attendance records');
    } finally {
      setLoadingAttendance(false);
    }
  };

  const loadLeaveRequests = async () => {
    setLoadingLeaveRequests(true);
    setLeaveRequestsError(null);
    try {
      const data = await fetchLeaveRequests();
      setLeaveRequests(data);
    } catch (error) {
      console.error('Failed to load leave requests:', error);
      setLeaveRequestsError('Failed to load leave requests. Please try again.');
      toast.error('Failed to load leave requests');
    } finally {
      setLoadingLeaveRequests(false);
    }
  };

  const loadProjectMembers = async () => {
    setLoadingProjectMembers(true);
    try {
      const data = await fetchProjectMembers();
      setProjectMembers(data);
    } catch (error) {
      console.error('Failed to load project members:', error);
      toast.error('Failed to load project team members');
    } finally {
      setLoadingProjectMembers(false);
    }
  };

  const loadDepartments = async () => {
    setLoadingDepartments(true);
    try {
      const data = await fetchDepartments();
      // If no departments in the database, use the predefined list
      if (data.length === 0) {
        setDepartments(['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance']);
      } else {
        setDepartments(data.map(dept => dept.Name));
      }
    } catch (error) {
      console.error('Failed to load departments:', error);
      // Fallback to predefined list
      setDepartments(['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance']);
    } finally {
      setLoadingDepartments(false);
    }
  };

  // Create/Update/Delete functions
  
  const handleCreateEmployee = () => {
    if (!createForm.name || !createForm.email || !createForm.department) {
      toast.error('Please fill in all required fields')
      return
    }
    
    setCreatingEmployee(true);

    const employeeData = {
      Name: createForm.name,
      firstName: createForm.name.split(' ')[0],
      lastName: createForm.name.split(' ').slice(1).join(' ') || 'N/A',
      email: createForm.email,
      phone: createForm.phone || '',
      department: createForm.department,
      position: createForm.position || 'Employee',
      status: 'active',
      hireDate: createForm.startDate || new Date().toISOString().split('T')[0],
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=150&h=150&fit=crop&crop=face`,
      Owner: user?.emailAddress
    }

    createEmployee(employeeData)
      .then(newEmployee => {
        setEmployees(prev => [...prev, newEmployee]);
        setCreateForm({
          name: '',
          email: '',
          phone: '',
          department: '',
          position: '',
          startDate: ''
        });
        setShowCreateModal(false);
        toast.success('Employee created successfully!');
      })
      .catch(error => {
        console.error('Error creating employee:', error);
        toast.error('Failed to create employee');
      })
      .finally(() => {
        setCreatingEmployee(false);
      });
  }

  const handleCreateProject = () => {
    if (!createProjectForm.name || !createProjectForm.description) {
      toast.error('Please fill in required fields')
      return
    }
    
    setCreatingProject(true);

    const projectData = {
      Name: createProjectForm.name,
      description: createProjectForm.description,
      priority: createProjectForm.priority,
      startDate: createProjectForm.startDate,
      endDate: createProjectForm.endDate,
      status: 'planning',
      progress: 0,
      budget: parseInt(createProjectForm.budget) || 0,
      Owner: user?.emailAddress
    }

    createProject(projectData)
      .then(newProject => {
        setProjects(prev => [...prev, newProject]);
        
        // If team members were selected, add them to the project
        if (createProjectForm.teamMembers && createProjectForm.teamMembers.length > 0) {
          return addEmployeesToProject(newProject.Id, createProjectForm.teamMembers);
        }
      })
      .then(() => {
        setCreateProjectForm({
          name: '', description: '', priority: 'medium', startDate: '', endDate: '', teamMembers: [], budget: ''
        });
        setShowCreateProjectModal(false);
        toast.success('Project created successfully!');
      })
      .catch(error => {
        console.error('Error creating project:', error);
        toast.error('Failed to create project');
      })
      .finally(() => {
        setCreatingProject(false);
      });
  }

  const handleAddEmployee = (e) => {
    e.preventDefault()
    
    if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.email || !newEmployee.department || !newEmployee.position) {
      toast.error('Please fill in all required fields')
      return
    }
    
    setCreatingEmployee(true);

    const emailExists = employees.some(emp => emp.email?.toLowerCase() === newEmployee.email.toLowerCase())
    if (emailExists) {
      toast.error('Employee with this email already exists')
      setCreatingEmployee(false);
      return
    }

    const employeeData = {
      Name: `${newEmployee.firstName} ${newEmployee.lastName}`,
      firstName: newEmployee.firstName,
      lastName: newEmployee.lastName,
      email: newEmployee.email,
      department: newEmployee.department,
      position: newEmployee.position,
      hireDate: newEmployee.hireDate,
      status: 'active',
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=150&h=150&fit=crop&crop=face`,
      Owner: user?.emailAddress
    }

    createEmployee(employeeData)
      .then(newEmp => {
        setEmployees(prev => [...prev, newEmp]);
        setNewEmployee({
          firstName: '',
          lastName: '',
          email: '',
          department: '',
          position: '',
          hireDate: format(new Date(), 'yyyy-MM-dd')
        });
        setShowAddForm(false);
        toast.success(`Employee ${newEmp.firstName} ${newEmp.lastName} added successfully!`);
      })
      .catch(error => {
        console.error('Error adding employee:', error);
        toast.error('Failed to add employee');
      })
      .finally(() => {
        setCreatingEmployee(false);
      });
  }

  const handleDeleteEmployee = (id) => {
    const employee = employees.find(emp => emp.Id === id);
    if (!employee) return;
    
    setDeletingEmployee(true);
    
    deleteEmployee(id)
      .then(() => {
        setEmployees(prev => prev.filter(emp => emp.Id !== id));
        toast.success(`Employee ${employee.firstName} ${employee.lastName} removed successfully`);
      })
      .catch(error => {
        console.error('Error deleting employee:', error);
        toast.error('Failed to delete employee');
      })
      .finally(() => {
        setDeletingEmployee(false);
      });
  }

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee)
    setEditForm({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      hireDate: employee.hireDate
    })
  }

  const handleUpdateEmployee = (e) => {
    e.preventDefault()
    
    if (!editForm.firstName || !editForm.lastName || !editForm.email || !editForm.department || !editForm.position) {
      toast.error('Please fill in all required fields')
      return
    }
    
    setUpdatingEmployee(true);

    const emailExists = employees.some(emp => emp.Id !== editingEmployee.Id && emp.email?.toLowerCase() === editForm.email.toLowerCase())
    if (emailExists) {
      toast.error('Employee with this email already exists')
      setUpdatingEmployee(false);
      return
    }

    const updatedEmployeeData = {
      ...editForm,
      Name: `${editForm.firstName} ${editForm.lastName}`
    };

    updateEmployee(editingEmployee.Id, updatedEmployeeData)
      .then(updatedEmp => {
        setEmployees(prev => prev.map(emp => 
          emp.Id === editingEmployee.Id ? { ...emp, ...updatedEmp } : emp
        ));
        setEditingEmployee(null);
        setEditForm({ firstName: '', lastName: '', email: '', department: '', position: '', hireDate: '' });
        toast.success(`Employee ${editForm.firstName} ${editForm.lastName} updated successfully!`);
      })
      .catch(error => {
        console.error('Error updating employee:', error);
        toast.error('Failed to update employee');
      })
      .finally(() => {
        setUpdatingEmployee(false);
      });
  }

  const handleStatusChange = (id, newStatus) => {
    const employee = employees.find(emp => emp.Id === id);
    if (!employee) return;
    
    setUpdatingEmployee(true);
    
    updateEmployee(id, { status: newStatus })
      .then(() => {
        setEmployees(prev => prev.map(emp => emp.Id === id ? { ...emp, status: newStatus } : emp));
        toast.success(`${employee.firstName} ${employee.lastName} status updated to ${newStatus}`);
      })
      .catch(error => {
        console.error('Error updating employee status:', error);
        toast.error('Failed to update employee status');
      })
      .finally(() => {
        setUpdatingEmployee(false);
      });
  }

  const filteredEmployees = employees.filter(employee => {
    const fullText = `${employee.firstName || ''} ${employee.lastName || ''} ${employee.email || ''}`.toLowerCase();
    const matchesSearch = fullText.includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment
    return matchesSearch && matchesDepartment
  })

  const handleClockIn = (employeeId) => {
    setClockingInOut(true);

    const currentDate = format(new Date(), 'yyyy-MM-dd');
    const currentTimeStr = format(new Date(), 'HH:mm');
    getAttendanceByEmployeeAndDate(employeeId, currentDate)
      .then(existingRecord => {
        if (existingRecord && existingRecord.clockIn) {
          toast.warning(`${employee.firstName} ${employee.lastName} already clocked in today`);
          setClockingInOut(false);
          return Promise.reject('Already clocked in');
        }

        if (existingRecord) {
          // Update existing record
          return updateAttendanceRecord(existingRecord.Id, { 
            clockIn: currentTimeStr,
            status: 'present'
          });
        } else {
          // Create new record
          const recordData = {
            Name: `Attendance-${employeeId}-${currentDate}`,
            employee: employeeId,
            date: currentDate,
            clockIn: currentTimeStr,
            status: 'present',
            Owner: user?.emailAddress
          };
          return createAttendanceRecord(recordData);
        }
      })
      .then(record => {
        // Refresh attendance records
        loadAttendanceRecords();
        
        // Update UI immediately
        setClockedInEmployees(prev => new Set([...prev, employeeId]));
        toast.success(`${employee.firstName} ${employee.lastName} clocked in successfully at ${currentTimeStr}`);
      })
      .catch(error => {
        if (error !== 'Already clocked in') {
          console.error('Error clocking in:', error);
          toast.error('Failed to clock in');
        }
      })
      .finally(() => {
        setClockingInOut(false);
      });
  };

  const handleClockOut = (employeeId) => {
    const employee = employees.find(emp => emp.Id === employeeId);
    if (!employee) return;
    
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    const currentTimeStr = format(new Date(), 'HH:mm');
    
    setClockingInOut(true);

    getAttendanceByEmployeeAndDate(employeeId, currentDate)
      .then(existingRecord => {
        if (!existingRecord || !existingRecord.clockIn) {
          toast.error(`${employee.firstName} ${employee.lastName} must clock in first`);
          setClockingInOut(false);
          return Promise.reject('Not clocked in');
        }

        if (existingRecord.clockOut) {
          toast.warning(`${employee.firstName} ${employee.lastName} already clocked out today`);
          setClockingInOut(false);
          return Promise.reject('Already clocked out');
        }

        // Calculate total hours
        const clockInTime = new Date(`2024-01-01 ${existingRecord.clockIn}`);
        const clockOutTime = new Date(`2024-01-01 ${currentTimeStr}`);
        const diffMs = clockOutTime - clockInTime;
        const totalHours = (diffMs / (1000 * 60 * 60)).toFixed(2);

        return updateAttendanceRecord(existingRecord.Id, {
          clockOut: currentTimeStr,
          totalHours: totalHours
        });
      })
      .then(record => {
        // Refresh attendance records
        loadAttendanceRecords();
        
        // Update UI immediately
        setClockedInEmployees(prev => {
          const newSet = new Set(prev);
          newSet.delete(employeeId);
          return newSet;
        });
        
        toast.success(`${employee.firstName} ${employee.lastName} clocked out successfully at ${currentTimeStr}`);
      })
      .catch(error => {
        if (error !== 'Not clocked in' && error !== 'Already clocked out') {
          console.error('Error clocking out:', error);
          toast.error('Failed to clock out');
        }
      })
      .finally(() => {
        setClockingInOut(false);
      });
  };

  const handleLeaveRequest = (e) => {
    e.preventDefault();
    
    if (!newLeaveRequest.employeeId || !newLeaveRequest.leaveType || !newLeaveRequest.startDate || !newLeaveRequest.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setSubmittingLeave(true);
    
    const employee = employees.find(emp => emp.Id === parseInt(newLeaveRequest.employeeId));
    const startDate = new Date(newLeaveRequest.startDate);
    const endDate = new Date(newLeaveRequest.endDate);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    const leaveData = {
      Name: `Leave-${employee.firstName}-${employee.lastName}-${newLeaveRequest.leaveType}`,
      employee: parseInt(newLeaveRequest.employeeId),
      leaveType: newLeaveRequest.leaveType,
      startDate: newLeaveRequest.startDate,
      endDate: newLeaveRequest.endDate,
      reason: newLeaveRequest.reason,
      days: days,
      status: 'pending',
      Owner: user?.emailAddress
    };
    
    createLeaveRequest(leaveData)
      .then(newRequest => {
        setLeaveRequests(prev => [...prev, newRequest]);
        setNewLeaveRequest({
          employeeId: '',
          leaveType: '',
          startDate: '',
          endDate: '',
          reason: ''
        });
        setShowLeaveForm(false);
        toast.success(`Leave request submitted for ${employee.firstName} ${employee.lastName}`);
      })
      .catch(error => {
        console.error('Error submitting leave request:', error);
        toast.error('Failed to submit leave request');
      })
      .finally(() => {
        setSubmittingLeave(false);
      });
  };

  const handleLeaveStatusChange = (requestId, newStatus) => {
    const request = leaveRequests.find(req => req.Id === requestId);
    if (!request) return;
    
    updateLeaveRequest(requestId, { status: newStatus })
      .then(() => {
        setLeaveRequests(prev => prev.map(req => 
          req.Id === requestId ? { ...req, status: newStatus } : req
        ));
        toast.success(`Leave request for ${request.Name} ${newStatus}`);
      })
      .catch(error => {
        console.error('Error updating leave request status:', error);
        toast.error('Failed to update leave request status');
      });
  };

  const filteredAttendanceRecords = attendanceRecords.filter(record => {
    const matchesDate = !attendanceFilter.date || record.date === attendanceFilter.date;
    const matchesEmployee = attendanceFilter.employee === 'all' || record.employee === parseInt(attendanceFilter.employee);
    const matchesStatus = attendanceFilter.status === 'all' || record.status === attendanceFilter.status;
    return matchesDate && matchesEmployee && matchesStatus;
  });

  // Helper to get employee name from ID
  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.Id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      try {
        return format(new Date(dateString), 'MMM dd, yyyy');
      } catch (error) {
        return dateString;
      }
    }
  };

  const getTodaysAttendanceStats = () => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const todayRecords = attendanceRecords.filter(record => record.date === today)
    return {
      total: employees.length,
      present: todayRecords.filter(record => record.status === 'present').length,
      absent: todayRecords.filter(record => record.status === 'absent').length,
      late: todayRecords.filter(record => record.status === 'late').length
    }
  }
  
  const attendanceStats = getTodaysAttendanceStats()
  
  const tabs = [
    { id: 'employee', label: 'Employee Directory', icon: 'Users' },
    { id: 'projects', label: 'Projects', icon: 'Briefcase' },
    { id: 'attendance', label: 'Time & Attendance', icon: 'Clock' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'reports', label: 'Reports', icon: 'FileText' }
  ]

  const projectStatuses = ['planning', 'in-progress', 'on-hold', 'completed', 'cancelled']
  const priorityLevels = ['low', 'medium', 'high', 'urgent']
  
  const projectStatusColors = {
    planning: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    'in-progress': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    'on-hold': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    completed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  }

  return (
    <motion.div
      className="w-full max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Tab Navigation */}
      <div className="mb-8 sm:mb-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-surface-900 dark:text-surface-100">
            Employee Management Dashboard
          </h2>
          
          {/* Header Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl font-semibold shadow-soft transition-all duration-200 flex items-center gap-2"
            >
              <ApperIcon name="UserPlus" className="w-4 h-4" />
              Create New Employee
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateProjectModal(true)}
              className="bg-secondary hover:bg-secondary-dark text-white px-4 py-2 rounded-xl font-semibold shadow-soft transition-all duration-200 flex items-center gap-2"
            >
              <ApperIcon name="Briefcase" className="w-4 h-4" />
              Create Project
            </motion.button>
          </div>
        </div>
        
        <div className="flex justify-center">
          <div className="flex items-center bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-2xl p-1 border border-surface-200 dark:border-surface-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-glow'
                    : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100'
                }`}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'employee' && (
          <motion.div
            key="employee"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Controls */}
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full lg:w-auto">
                {/* Search */}
                <div className="relative">
                  <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 w-full sm:w-64 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm border border-surface-200 dark:border-surface-700 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  />
                </div>

                {/* Department Filter */}
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="px-4 py-3 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm border border-surface-200 dark:border-surface-700 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <motion.button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center space-x-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-2xl hover:shadow-glow transition-all duration-300 w-full sm:w-auto justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name={showAddForm ? "X" : "UserPlus"} className="w-5 h-5" />
                <span>{showAddForm ? 'Cancel' : 'Add Employee'}</span>
              </motion.button>
            </div>

            {/* Add Employee Form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 sm:p-8 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-3xl border border-surface-200 dark:border-surface-700 shadow-soft">
                    <h3 className="text-xl sm:text-2xl font-semibold text-surface-900 dark:text-surface-100 mb-6">
                      Add New Employee
                    </h3>
                    <form onSubmit={handleAddEmployee} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={newEmployee.firstName}
                          onChange={(e) => setNewEmployee(prev => ({...prev, firstName: e.target.value}))}
                          className="w-full px-4 py-3 bg-white/60 dark:bg-surface-700/60 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={newEmployee.lastName}
                          onChange={(e) => setNewEmployee(prev => ({...prev, lastName: e.target.value}))}
                          className="w-full px-4 py-3 bg-white/60 dark:bg-surface-700/60 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={newEmployee.email}
                          onChange={(e) => setNewEmployee(prev => ({...prev, email: e.target.value}))}
                          className="w-full px-4 py-3 bg-white/60 dark:bg-surface-700/60 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Department *
                        </label>
                        <select
                          value={newEmployee.department}
                          onChange={(e) => setNewEmployee(prev => ({...prev, department: e.target.value}))}
                          className="w-full px-4 py-3 bg-white/60 dark:bg-surface-700/60 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                          required>
                          <option value="">Select Department</option>
                          {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Position *
                        </label>
                        <input
                          type="text"
                          value={newEmployee.position}
                          onChange={(e) => setNewEmployee(prev => ({...prev, position: e.target.value}))}
                          className="w-full px-4 py-3 bg-white/60 dark:bg-surface-700/60 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Hire Date
                        </label>
                        <input
                          type="date"
                          value={newEmployee.hireDate}
                          onChange={(e) => setNewEmployee(prev => ({...prev, hireDate: e.target.value}))}
                          className="w-full px-4 py-3 bg-white/60 dark:bg-surface-700/60 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                        />
                      </div>
                      
                      <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
                        <button
                          type="submit"
                          className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:shadow-glow transition-all duration-300"
                        >
                          Add Employee
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Employee Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredEmployees.map((employee, index) => (
                <motion.div
                  key={employee.Id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group relative p-6 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-3xl border border-surface-200 dark:border-surface-700 hover:shadow-glow transition-all duration-500"
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={employee.avatar}
                        alt={`${employee.firstName} ${employee.lastName}`}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-white dark:border-surface-700 group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`
                        }}
                      />
                      <div>
                        <h4 className="font-semibold text-surface-900 dark:text-surface-100 text-base sm:text-lg">
                          {employee.firstName} {employee.lastName}
                        </h4>
                        <p className="text-sm text-surface-600 dark:text-surface-400">
                          {employee.position}
                        </p>
                      </div>
                    </div>
    {loadingProjects && (
      <div className="flex justify-center p-8">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
        { title: "In Progress", value: projects?.filter(p => p.status === 'in-progress')?.length || 0, icon: "Play", color: "from-green-500 to-green-600" },
                      >
                        <ApperIcon name="Edit" className="w-4 h-4" />
                      </button>
                        value={employee.status || 'active'}
                        onChange={(e) => handleStatusChange(employee.Id, e.target.value)}
                        onChange={(e) => handleStatusChange(employee.id, e.target.value)}
                        className={`px-2 py-1 text-xs font-medium rounded-lg border-0 ${statusColors[employee.status]} cursor-pointer`}
                      >
                        <option value="active">Active</option>
                        <option value="onLeave">On Leave</option>
                        <option value="terminated">Terminated</option>
                      </select>
                      
                        onClick={() => handleDeleteEmployee(employee.Id)}
                        className={`p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 ${deletingEmployee ? 'opacity-50 cursor-not-allowed' : ''}`}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Mail" className="w-4 h-4 text-surface-400" />
                      <span className="text-surface-600 dark:text-surface-400">
                        {employee.email}
                      </span>
                      </span>
                      </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Building" className="w-4 h-4 text-surface-400" />
                      <span className="text-surface-600 dark:text-surface-400">
                        {employee.department}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-surface-600 dark:text-surface-400">
                        Hired {format(new Date(employee.hireDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredEmployees.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <ApperIcon name="Users" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
                  No employees found
                </h3>
                <p className="text-surface-600 dark:text-surface-400">
                  Try adjusting your search or filter criteria
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

                <span className="text-surface-600 dark:text-surface-400">
          <motion.div
            key="projects"
             initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Project Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { title: "Total Projects", value: projects.length, icon: "Briefcase", color: "from-blue-500 to-blue-600" },
                { title: "In Progress", value: projects.filter(p => p.status === 'in-progress').length, icon: "Play", color: "from-green-500 to-green-600" },
                { title: "Completed", value: projects.filter(p => p.status === 'completed').length, icon: "CheckCircle", color: "from-purple-500 to-purple-600" },
                { title: "On Hold", value: projects.filter(p => p.status === 'on-hold').length, icon: "Pause", color: "from-yellow-500 to-yellow-600" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-6 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-3xl border border-surface-200 dark:border-surface-700"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                    <ApperIcon name={stat.icon} className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                    {stat.value}
                  </div>
                  <div className="text-surface-600 dark:text-surface-400 text-sm">
                    {stat.title}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Project Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.Id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-6 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-3xl border border-surface-200 dark:border-surface-700 hover:shadow-glow transition-all duration-500"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
                        {project.name}
                      </h3>
                      <p className="text-sm text-surface-600 dark:text-surface-400 mb-3">
                        {project.description}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-lg ${projectStatusColors[project.status]}`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('-', ' ')}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-surface-600 dark:text-surface-400">Progress</span>
                      <span className="font-medium text-surface-900 dark:text-surface-100">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    
                    {attendanceError && <div className="bg-red-50 text-red-600 p-4 rounded-lg mt-2">{attendanceError}</div>}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Calendar" className="w-4 h-4 text-surface-400" />
                        <span className="text-surface-600 dark:text-surface-400">
                          {format(new Date(project.startDate), 'MMM dd')} - {format(new Date(project.endDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="DollarSign" className="w-4 h-4 text-surface-400" />
                        <span className="font-medium text-surface-900 dark:text-surface-100">
                          ${project.budget.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Users" className="w-4 h-4 text-surface-400" />
                        <span className="text-sm text-surface-600 dark:text-surface-400">
                          {project.teamMembers.length} team member{project.teamMembers.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          project.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          project.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)} Priority
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 pt-2">
                      <button
                        onClick={() => toast.success('View project details - Feature coming soon!')}
                        className="flex-1 px-3 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => toast.success('Edit project - Feature coming soon!')}
                        className="px-3 py-2 bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 rounded-lg transition-colors duration-200"
                      >
                        <ApperIcon name="Edit" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setProjects(projects.filter(p => p.Id !== project.Id))
                          toast.success('Project deleted successfully!')
                        }}
                        className="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-200"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {projects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-surface-600 dark:text-surface-400">Create your first project to get started</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'attendance' && (
          <motion.div
            key="attendance"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Current Time and Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="lg:col-span-1 p-6 bg-gradient-to-br from-primary to-secondary text-white rounded-3xl">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold mb-2">
                    {format(currentTime, 'HH:mm:ss')}
                  </div>
                  <div className="text-sm opacity-90">
                    {format(currentTime, 'EEEE, MMM dd, yyyy')}
                  </div>
                </div>
              </div>
              
              {[
                { title: "Present Today", value: attendanceStats.present, icon: "UserCheck", color: "from-green-500 to-green-600" },
                { title: "Absent Today", value: attendanceStats.absent, icon: "UserX", color: "from-red-500 to-red-600" },
                { title: "Late Today", value: attendanceStats.late, icon: "Clock", color: "from-yellow-500 to-yellow-600" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-6 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-3xl border border-surface-200 dark:border-surface-700"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                    <ApperIcon name={stat.icon} className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                    {stat.value}
                  </div>
                  <div className="text-surface-600 dark:text-surface-400 text-sm">
                    {stat.title}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Clock In/Out */}
            <div className="p-6 sm:p-8 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-3xl border border-surface-200 dark:border-surface-700">
              <h3 className="text-xl sm:text-2xl font-semibold text-surface-900 dark:text-surface-100 mb-6">
                Quick Clock In/Out
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {employees.slice(0, 6).map((employee, index) => (
                  <div key={employee.Id || index} className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-700/50 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <img
                        src={employee.avatar}
                        alt={`${employee.firstName} ${employee.lastName}`}
                        className="w-10 h-10 rounded-xl object-cover"
                        onError={(e) => {
                          e.target.src = `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`
                        }}
                      />
                      <div>
                        <div className="font-medium text-surface-900 dark:text-surface-100 text-sm">
                          {employee.firstName} {employee.lastName}
                        </div>
                        <div className="text-xs text-surface-600 dark:text-surface-400">
                          {employee.department}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleClockIn(employee.id)}
                        disabled={clockedInEmployees.has(employee.id)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                          clockedInEmployees.has(employee.id)
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        onClick={() => handleClockIn(employee.Id)}
                        disabled={clockedInEmployees.has(employee.Id)}
                        In
                          clockedInEmployees.has(employee.Id)
                      <button
                        onClick={() => handleClockOut(employee.id)}
                        disabled={!clockedInEmployees.has(employee.id)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                          !clockedInEmployees.has(employee.id)
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                      >
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Attendance Filters and Leave Request */}
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full lg:w-auto">
                <input
                  type="date"
                  value={attendanceFilter.date}
                  onChange={(e) => setAttendanceFilter(prev => ({...prev, date: e.target.value}))}
                  className="px-4 py-3 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm border border-surface-200 dark:border-surface-700 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                />
                
                <select
                  value={attendanceFilter.employee}
                  onChange={(e) => setAttendanceFilter(prev => ({...prev, employee: e.target.value}))}
                  className="px-4 py-3 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm border border-surface-200 dark:border-surface-700 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                >
                  <option value="all">All Employees</option>
                  {employees.map((emp, index) => (
                    <option key={emp.Id || index} value={emp.Id}>{emp.firstName} {emp.lastName}</option>
                  ))}
                </select>
                
                <select
                  value={attendanceFilter.status}
                  onChange={(e) => setAttendanceFilter(prev => ({...prev, status: e.target.value}))}
                  className="px-4 py-3 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm border border-surface-200 dark:border-surface-700 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                >
                  <option value="all">All Status</option>
                  {attendanceStatuses.map(status => (
                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                  ))}
                </select>
              </div>
              
              <motion.button
                onClick={() => setShowLeaveForm(!showLeaveForm)}
                className="flex items-center space-x-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-secondary to-primary text-white font-semibold rounded-2xl hover:shadow-glow transition-all duration-300 w-full sm:w-auto justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name={showLeaveForm ? "X" : "Calendar"} className="w-5 h-5" />
                <span>{showLeaveForm ? 'Cancel' : 'Request Leave'}</span>
              </motion.button>
            </div>
            
            {/* Leave Request Form */}
            <AnimatePresence>
              {showLeaveForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 sm:p-8 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-3xl border border-surface-200 dark:border-surface-700 shadow-soft">
                    <h3 className="text-xl sm:text-2xl font-semibold text-surface-900 dark:text-surface-100 mb-6">
                      Request Leave
                    </h3>
                    <form onSubmit={handleLeaveRequest} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Employee *
                        </label>
                        <select
                          value={newLeaveRequest.employeeId}
                          onChange={(e) => setNewLeaveRequest(prev => ({...prev, employeeId: e.target.value}))}
                          className="w-full px-4 py-3 bg-white/60 dark:bg-surface-700/60 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                          required
                        >
                          <option value="">Select Employee</option>
                          {employees.map((emp, index) => (
                            <option key={emp.Id || index} value={emp.Id}>{emp.firstName} {emp.lastName}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Leave Type *
                        </label>
                        <select
                          value={newLeaveRequest.leaveType}
                          onChange={(e) => setNewLeaveRequest(prev => ({...prev, leaveType: e.target.value}))}
                          className="w-full px-4 py-3 bg-white/60 dark:bg-surface-700/60 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                          required
                        >
                          <option value="">Select Leave Type</option>
                          {leaveTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Start Date *
                        </label>
                        <input
                          type="date"
                          value={newLeaveRequest.startDate}
                          onChange={(e) => setNewLeaveRequest(prev => ({...prev, startDate: e.target.value}))}
                          className="w-full px-4 py-3 bg-white/60 dark:bg-surface-700/60 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          End Date *
                        </label>
                        <input
                          type="date"
                          value={newLeaveRequest.endDate}
                          onChange={(e) => setNewLeaveRequest(prev => ({...prev, endDate: e.target.value}))}
                          className="w-full px-4 py-3 bg-white/60 dark:bg-surface-700/60 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                          required
                        />
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Reason
                        </label>
                        <textarea
                          value={newLeaveRequest.reason}
                          onChange={(e) => setNewLeaveRequest(prev => ({...prev, reason: e.target.value}))}
                          rows="3"
                          className="w-full px-4 py-3 bg-white/60 dark:bg-surface-700/60 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                          placeholder="Optional reason for leave request"
                        />
                      </div>
                      
                      <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
                        <button
                          type="submit"
                          className="px-6 py-3 bg-gradient-to-r from-secondary to-primary text-white font-semibold rounded-xl hover:shadow-glow transition-all duration-300"
                        >
                          Submit Request
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Attendance Records */}
            <div className="p-6 sm:p-8 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-3xl border border-surface-200 dark:border-surface-700">
              <h3 className="text-xl sm:text-2xl font-semibold text-surface-900 dark:text-surface-100 mb-6">
                Attendance Records
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-surface-200 dark:border-surface-700">
                      <th className="text-left py-3 px-4 font-semibold text-surface-900 dark:text-surface-100">Employee</th>
                       <th className="text-left py-3 px-4 font-semibold text-surface-900 dark:text-surface-100">Date</th>
                       <th className="text-left py-3 px-4 font-semibold text-surface-900 dark:text-surface-100">Clock In</th>
                       <th className="text-left py-3 px-4 font-semibold text-surface-900 dark:text-surface-100">Clock Out</th>
                       <th className="text-left py-3 px-4 font-semibold text-surface-900 dark:text-surface-100">Total Hours</th>
                       <th className="text-left py-3 px-4 font-semibold text-surface-900 dark:text-surface-100">Status</th>
                  </thead>
                  <tbody>
                    {filteredAttendanceRecords.map((record, index) => (
                      <tr key={record.Id || index} className="border-b border-surface-100 dark:border-surface-700/50 hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors duration-200">
                        <td className="py-3 px-4 text-surface-900 dark:text-surface-100">{getEmployeeName(record.employee)}</td>
                        <td className="py-3 px-4 text-surface-600 dark:text-surface-400">{formatDate(record.date)}</td>
                        <td className="py-3 px-4 text-surface-600 dark:text-surface-400">{record.clockIn || '-'}</td>
                        <td className="py-3 px-4 text-surface-600 dark:text-surface-400">{record.clockOut || '-'}</td>
                        <td className="py-3 px-4 text-surface-600 dark:text-surface-400">{record.totalHours || '-'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-lg ${attendanceStatusColors[record.status] || ''}`}>
                            {record.status ? record.status.charAt(0).toUpperCase() + record.status.slice(1) : '-'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Leave Requests */}
            <div className="p-6 sm:p-8 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-3xl border border-surface-200 dark:border-surface-700">
           {/* Leave Requests */}
                Leave Requests
              <h3 className="text-xl sm:text-2xl font-semibold text-surface-900 dark:text-surface-100 mb-6">
                {leaveRequests.map((request) => (
                  <div key={request.id} className="p-4 bg-surface-50 dark:bg-surface-700/50 rounded-2xl">
              <div className="space-y-4">
                {leaveRequests.map((request, index) => (
                  <div key={request.Id || index} className="p-4 bg-surface-50 dark:bg-surface-700/50 rounded-2xl">
                  onChange={(e) => handleLeaveStatusChange(request.Id, e.target.value)}
                        <p className="text-sm text-surface-600 dark:text-surface-400">{request.leaveType}</p>
                        <h4 className="font-medium text-surface-900 dark:text-surface-100">{getEmployeeName(request.employee)}</h4>
                        value={request.status}
                        onChange={(e) => handleLeaveStatusChange(request.id, e.target.value)}
                      <select
                        value={request.status || 'pending'}
                        onChange={(e) => handleLeaveStatusChange(request.Id, e.target.value)}
                        className={`px-2 py-1 text-xs font-medium rounded-lg border-0 ${leaveStatusColors[request.status] || ''} cursor-pointer`}
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Calendar" className="w-4 h-4 text-surface-400" />
                        <span className="text-surface-600 dark:text-surface-400">
                          {format(new Date(request.startDate), 'MMM dd')} - {format(new Date(request.endDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Clock" className="w-4 h-4 text-surface-400" />
                        <span className="text-surface-600 dark:text-surface-400">{request.days} day{request.days > 1 ? 's' : ''}</span>
                      </div>
                      {request.reason && (
                        <div className="flex items-start space-x-2">
                          <ApperIcon name="FileText" className="w-4 h-4 text-surface-400 mt-0.5" />
                          <span className="text-surface-600 dark:text-surface-400">{request.reason}</span>
                        </div>
                      )}
                    </div>
                 </div>
                ))}
              </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {[
              { title: "Total Employees", value: employees.length, icon: "Users", color: "from-blue-500 to-blue-600" },
              { title: "Active", value: employees.filter(emp => emp.status === 'active').length, icon: "UserCheck", color: "from-green-500 to-green-600" },
              { title: "On Leave", value: employees.filter(emp => emp.status === 'onLeave').length, icon: "UserX", color: "from-yellow-500 to-yellow-600" },
              { title: "Departments", value: new Set(employees.map(emp => emp.department)).size, icon: "Building", color: "from-purple-500 to-purple-600" },
              { title: "New Hires (This Year)", value: employees.filter(emp => new Date(emp.hireDate).getFullYear() === new Date().getFullYear()).length, icon: "UserPlus", color: "from-indigo-500 to-indigo-600" },
              { title: "Avg. Tenure", value: "2.1 years", icon: "Clock", color: "from-teal-500 to-teal-600" }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="p-6 sm:p-8 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-3xl border border-surface-200 dark:border-surface-700 hover:shadow-glow transition-all duration-500"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                  <ApperIcon name={stat.icon} className="w-7 h-7 text-white" />
                </div>
                <div className="text-3xl font-bold text-surface-900 dark:text-surface-100 mb-1">
                  {stat.value}
                </div>
                <div className="text-surface-600 dark:text-surface-400">
                  {stat.title}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'reports' && (
          <motion.div
            key="reports"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { title: "Employee Directory Report", description: "Complete list of all employees with details", icon: "FileText", action: "Generate" },
                { title: "Department Summary", description: "Employee distribution across departments", icon: "PieChart", action: "View" },
                { title: "Attendance Report", description: "Monthly attendance and leave statistics", icon: "Calendar", action: "Export" },
                { title: "Performance Overview", description: "Performance ratings and review summaries", icon: "TrendingUp", action: "Generate" },
                { title: "Hiring Trends", description: "Analysis of hiring patterns and growth", icon: "BarChart3", action: "View" },
                { title: "Custom Report", description: "Create your own custom employee reports", icon: "Settings", action: "Create" }
              ].map((report, index) => (
                <motion.div
                  key={report.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-6 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-3xl border border-surface-200 dark:border-surface-700 hover:shadow-glow transition-all duration-500"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                      <ApperIcon name={report.icon} className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-surface-900 dark:text-surface-100">
                      {report.title}
                  </div>
                  <p className="text-sm text-surface-600 dark:text-surface-400 mb-4">
                    {report.description}
                  </p>
                  <button
                    onClick={() => toast.success(`${report.action} ${report.title} - Feature coming soon!`)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-xl hover:shadow-glow transition-all duration-300"
                  >
                    {report.action}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Create Employee Modal */}
      {showCreateModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-surface-800">Create New Employee</h3>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-surface-400 hover:text-surface-600 transition-colors"
                >
                  <ApperIcon name="X" className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({...createForm, phone: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Department *
                  </label>
                  <select
                    value={createForm.department}
                    onChange={(e) => setCreateForm({...createForm, department: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    value={createForm.position}
                    onChange={(e) => setCreateForm({...createForm, position: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                    placeholder="Enter position/title"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateEmployee}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  disabled={creatingEmployee}
                >
                  Create Employee
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Create Project Modal */}
      {showCreateProjectModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-surface-800">Create New Project</h3>
                <button 
                  onClick={() => setShowCreateProjectModal(false)}
                  className="text-surface-400 hover:text-surface-600 transition-colors"
                >
                  <ApperIcon name="X" className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-surface-700 mb-2">Project Name *</label>
                  <input
                    type="text"
                    value={createProjectForm.name}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                    placeholder="Enter project name"
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-surface-700 mb-2">Description *</label>
                  <textarea
                    value={createProjectForm.description}
                    onChange={(e) => setCreateProjectForm({...createProjectForm, description: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                    rows="3"
                    placeholder="Enter project description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">Priority</label>
                  <select
                    value={createProjectForm.priority}
                    onChange={(e) => setCreateProjectForm({...createProjectForm, priority: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                  >
                    {priorityLevels.map(level => (
                      <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">Budget</label>
                  <input
                    type="number"
                    value={createProjectForm.budget}
                    onChange={(e) => setCreateProjectForm({...createProjectForm, budget: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                    placeholder="Enter budget amount"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={createProjectForm.startDate}
                    onChange={(e) => setCreateProjectForm({...createProjectForm, startDate: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={createProjectForm.endDate}
                    onChange={(e) => setCreateProjectForm({...createProjectForm, endDate: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setShowCreateProjectModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateProject}
                  className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors"
                  disabled={creatingProject}
                >
                  Create Project
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}


      {/* Edit Employee Modal */}
      <AnimatePresence>
        {editingEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setEditingEmployee(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/95 dark:bg-surface-800/95 backdrop-blur-sm rounded-3xl border border-surface-200 dark:border-surface-700 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl sm:text-2xl font-semibold text-surface-900 dark:text-surface-100">
                    Edit Employee Details
                  </h3>
                  <button
                    onClick={() => setEditingEmployee(null)}
                    className="p-2 text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors duration-200"
                  >
                    <ApperIcon name="X" className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleUpdateEmployee} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm(prev => ({...prev, firstName: e.target.value}))}
                      className="w-full px-4 py-3 bg-white/60 dark:bg-surface-700/60 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm(prev => ({...prev, lastName: e.target.value}))}
                      className="w-full px-4 py-3 bg-white/60 dark:bg-surface-700/60 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({...prev, email: e.target.value}))}
                      className="w-full px-4 py-3 bg-white/60 dark:bg-surface-700/60 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Department *
                    </label>
                    <select
                      value={editForm.department}
                      onChange={(e) => setEditForm(prev => ({...prev, department: e.target.value}))}
                      className="w-full px-4 py-3 bg-white/60 dark:bg-surface-700/60 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Position *
                    </label>
                    <input
                      type="text"
                      value={editForm.position}
                      onChange={(e) => setEditForm(prev => ({...prev, position: e.target.value}))}
                      className="w-full px-4 py-3 bg-white/60 dark:bg-surface-700/60 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Hire Date
                    </label>
                    <input
                      type="date"
                      value={editForm.hireDate}
                      onChange={(e) => setEditForm(prev => ({...prev, hireDate: e.target.value}))}
                      className="w-full px-4 py-3 bg-white/60 dark:bg-surface-700/60 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  
                  <div className="sm:col-span-2 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setEditingEmployee(null)}
                      className="px-6 py-3 bg-surface-200 dark:bg-surface-700 text-surface-900 dark:text-surface-100 font-medium rounded-xl hover:bg-surface-300 dark:hover:bg-surface-600 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-glow transition-all duration-300"
                      disabled={updatingEmployee}
                    >
                      Update Employee
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
export default MainFeature