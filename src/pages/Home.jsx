import { useState } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2] 
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-glow">
              <ApperIcon name="Users" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                StaffHub
              </h1>
              <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400">
                Employee Management
              </p>
            </div>
          </motion.div>

          <motion.button
            onClick={toggleDarkMode}
            className="p-2 sm:p-3 rounded-2xl bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm border border-surface-200 dark:border-surface-700 hover:shadow-glow transition-all duration-300"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon 
              name={darkMode ? "Sun" : "Moon"} 
              className="w-5 h-5 sm:w-6 sm:h-6 text-surface-700 dark:text-surface-300" 
            />
          </motion.button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-surface-900 dark:text-surface-100 mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Modern Employee
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Management System
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-lg sm:text-xl lg:text-2xl text-surface-600 dark:text-surface-400 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Streamline HR processes, manage employee data, and boost productivity with our intuitive platform
            </motion.p>
          </div>

          {/* Stats Cards */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {[
              { icon: "Users", label: "Employees", value: "1,247", color: "from-blue-500 to-blue-600" },
              { icon: "Calendar", label: "Active Projects", value: "89", color: "from-green-500 to-green-600" },
              { icon: "TrendingUp", label: "Performance", value: "94%", color: "from-purple-500 to-purple-600" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="group relative p-6 sm:p-8 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-3xl border border-surface-200 dark:border-surface-700 hover:shadow-glow transition-all duration-500"
                whileHover={{ y: -5, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <ApperIcon name={stat.icon} className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-surface-100 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-surface-600 dark:text-surface-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Feature Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto">
          <MainFeature />
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.h3 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-surface-900 dark:text-surface-100 mb-8 sm:mb-12 lg:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Powerful Features for Modern HR
          </motion.h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: "UserPlus",
                title: "Employee Onboarding",
                description: "Streamlined onboarding process with digital forms and automated workflows",
                color: "from-emerald-500 to-teal-600"
              },
              {
                icon: "Clock",
                title: "Time & Attendance",
                description: "Track work hours, breaks, and overtime with intelligent time management",
                color: "from-blue-500 to-indigo-600"
              },
              {
                icon: "Award",
                title: "Performance Reviews",
                description: "Comprehensive performance evaluation system with goal tracking",
                color: "from-purple-500 to-pink-600"
              },
              {
                icon: "Calendar",
                title: "Leave Management",
                description: "Easy leave requests, approvals, and calendar integration",
                color: "from-orange-500 to-red-600"
              },
              {
                icon: "BarChart3",
                title: "Analytics & Reports",
                description: "Detailed insights and custom reports for data-driven decisions",
                color: "from-cyan-500 to-blue-600"
              },
              {
                icon: "Shield",
                title: "Security & Compliance",
                description: "Enterprise-grade security with compliance management tools",
                color: "from-gray-600 to-gray-800"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group relative p-6 sm:p-8 bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm rounded-3xl border border-surface-200 dark:border-surface-700 hover:shadow-glow transition-all duration-500"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <ApperIcon name={feature.icon} className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h4 className="text-lg sm:text-xl font-semibold text-surface-900 dark:text-surface-100 mb-3">
                  {feature.title}
                </h4>
                <p className="text-sm sm:text-base text-surface-600 dark:text-surface-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-surface-200 dark:border-surface-700 bg-white/50 dark:bg-surface-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <p className="text-sm sm:text-base text-surface-600 dark:text-surface-400">
              © 2024 StaffHub. Built with modern technology for efficient employee management.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home