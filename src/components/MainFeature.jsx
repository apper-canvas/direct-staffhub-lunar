import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [activeTab, setActiveTab] = useState('employee')
  const [employees, setEmployees] = useState([
    {
      id: 1,
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@staffhub.com",
      department: "Engineering",
      position: "Senior Developer",
      status: "active",
      hireDate: "2023-01-15",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      firstName: "Michael",
      lastName: "Chen",
      email: "michael.chen@staffhub.com",
      department: "Design",
      position: "UX Designer",
      status: "active",
      hireDate: "2023-03-22",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      firstName: "Emily",
      lastName: "Rodriguez",
      email: "emily.rodriguez@staffhub.com",
      department: "Marketing",
      position: "Marketing Manager",
      status: "onLeave",
      hireDate: "2022-11-08",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ])

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


  const departments = ['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance']
  const statusColors = {
  })
    onLeave: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    terminated: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  }

  const handleAddEmployee = (e) => {
    e.preventDefault()
    
    if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.email || !newEmployee.department || !newEmployee.position) {
      toast.error('Please fill in all required fields')
      return
    }

    const emailExists = employees.some(emp => emp.email.toLowerCase() === newEmployee.email.toLowerCase())
    if (emailExists) {
      toast.error('Employee with this email already exists')
      return
    }

    const employee = {
      id: Date.now(),
      ...newEmployee,
      status: 'active',
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=150&h=150&fit=crop&crop=face`
    }

    setEmployees(prev => [...prev, employee])
    setNewEmployee({
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      position: '',
      hireDate: format(new Date(), 'yyyy-MM-dd')
    })
    setShowAddForm(false)
    toast.success(`Employee ${employee.firstName} ${employee.lastName} added successfully!`)
  }

  const handleDeleteEmployee = (id) => {
    const employee = employees.find(emp => emp.id === id)
    setEmployees(prev => prev.filter(emp => emp.id !== id))
    toast.success(`Employee ${employee.firstName} ${employee.lastName} removed successfully`)
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

    const emailExists = employees.some(emp => emp.id !== editingEmployee.id && emp.email.toLowerCase() === editForm.email.toLowerCase())
    if (emailExists) {
      toast.error('Employee with this email already exists')
      return
    }

    setEmployees(prev => prev.map(emp => 
      emp.id === editingEmployee.id ? { ...emp, ...editForm } : emp
    ))
    
    setEditingEmployee(null)
    setEditForm({ firstName: '', lastName: '', email: '', department: '', position: '', hireDate: '' })
    toast.success(`Employee ${editForm.firstName} ${editForm.lastName} updated successfully!`)
  }

  const handleStatusChange = (id, newStatus) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === id ? { ...emp, status: newStatus } : emp
    ))
    const employee = employees.find(emp => emp.id === id)
    toast.success(`${employee.firstName} ${employee.lastName} status updated to ${newStatus}`)
  }

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = `${employee.firstName} ${employee.lastName} ${employee.email}`.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment
    return matchesSearch && matchesDepartment
  })

  const tabs = [
    { id: 'employee', label: 'Employee Directory', icon: 'Users' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'reports', label: 'Reports', icon: 'FileText' }
  ]

  return (
    <motion.div
      className="w-full max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Tab Navigation */}
      <div className="mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-surface-900 dark:text-surface-100">
            Employee Management Dashboard
          </h2>
          
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
                  key={employee.id}
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
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditEmployee(employee)}
                        className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                      >
                        <ApperIcon name="Edit" className="w-4 h-4" />
                      </button>
                      <select
                        value={employee.status}
                        onChange={(e) => handleStatusChange(employee.id, e.target.value)}
                        className={`px-2 py-1 text-xs font-medium rounded-lg border-0 ${statusColors[employee.status]} cursor-pointer`}
                      >
                        <option value="active">Active</option>
                        <option value="onLeave">On Leave</option>
                        <option value="terminated">Terminated</option>
                      </select>
                      
                      <button
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Mail" className="w-4 h-4 text-surface-400" />
                      <span className="text-surface-600 dark:text-surface-400 truncate">
                        {employee.email}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Building" className="w-4 h-4 text-surface-400" />
                      <span className="text-surface-600 dark:text-surface-400">
                        {employee.department}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Calendar" className="w-4 h-4 text-surface-400" />
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
                    </h3>
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

      {/* Edit Employee Modal */}
      <AnimatePresence>
        {editingEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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