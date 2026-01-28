import { Link } from 'react-router-dom'
import { Building2, DollarSign, TrendingUp, Sparkles, Code, Users, GraduationCap, UserCog, BarChart3, Briefcase } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

// Role icon mapping
const getRoleIcon = (role: string) => {
  const roleLower = role.toLowerCase()
  if (roleLower.includes('sde') || roleLower.includes('software') || roleLower.includes('developer')) return Code
  if (roleLower.includes('analyst') || roleLower.includes('data')) return BarChart3
  if (roleLower.includes('manager') || roleLower.includes('product')) return UserCog
  if (roleLower.includes('hr') || roleLower.includes('human')) return Users
  if (roleLower.includes('intern')) return GraduationCap
  return Briefcase
}

interface CompanyCardProps {
  company: {
    name: string
    experienceCount: number
    selectionRate: number
    avgPackage: number
    isMajor?: boolean
  }
  index: number
}

export default function CompanyCard({ company, index }: CompanyCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ 
        scale: 1.03,
        y: -5,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link
        to={`/company/${encodeURIComponent(company.name)}`}
        className={`card relative overflow-hidden group block ${
          company.isMajor ? 'border-2 border-primary-300 dark:border-primary-700 bg-gradient-to-br from-primary-50/50 to-transparent dark:from-primary-900/10' : ''
        }`}
      >
        {/* Shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={isHovered ? { x: '200%' } : { x: '-100%' }}
          transition={{ duration: 0.6 }}
        />

        {/* Animated border glow */}
        {company.isMajor && (
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3))',
              opacity: 0,
            }}
            animate={isHovered ? { opacity: 0.3 } : { opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
        <div className="flex items-start justify-between mb-4 relative z-10">
          <div className="flex items-center space-x-3">
            <motion.div 
              className={`w-12 h-12 rounded-lg flex items-center justify-center relative ${
              company.isMajor 
                ? 'bg-gradient-to-br from-primary-500 to-primary-600' 
                : 'bg-primary-100 dark:bg-primary-900'
              }`}
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              {company.isMajor ? (
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
              ) : (
                <Building2 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              )}
              {/* Pulsing ring for major companies */}
              {company.isMajor && (
                <motion.div
                  className="absolute inset-0 rounded-lg border-2 border-primary-400"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              )}
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {company.name}
                </h3>
                {company.isMajor && (
                  <span className="px-2 py-0.5 bg-primary-600 text-white text-xs font-semibold rounded">
                    Popular
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {company.experienceCount} experience{company.experienceCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 relative z-10">
          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
              <TrendingUp className="w-4 h-4" />
              </motion.div>
              <span className="text-sm">Selection Rate</span>
            </div>
            <motion.span 
              className="font-semibold text-gray-900 dark:text-white"
              animate={isHovered ? { scale: 1.1, color: '#3b82f6' } : {}}
              transition={{ duration: 0.2 }}
            >
              {company.selectionRate.toFixed(1)}%
            </motion.span>
          </motion.div>

          {company.avgPackage > 0 && (
            <motion.div 
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                <DollarSign className="w-4 h-4" />
                </motion.div>
                <span className="text-sm">Avg Package</span>
              </div>
              <motion.span 
                className="font-semibold text-gray-900 dark:text-white"
                animate={isHovered ? { scale: 1.1, color: '#10b981' } : {}}
                transition={{ duration: 0.2 }}
              >
                ₹{(company.avgPackage / 100000).toFixed(1)}L
              </motion.span>
            </motion.div>
          )}
        </div>

        <motion.div 
          className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.4 }}
        >
          <motion.span 
            className="text-primary-600 dark:text-primary-400 text-sm font-medium inline-flex items-center gap-2"
            animate={isHovered ? { x: 5 } : { x: 0 }}
            transition={{ duration: 0.2 }}
          >
            View Experiences
            <motion.span
              animate={isHovered ? { x: [0, 5, 0] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.span>
        </motion.div>
      </Link>
    </motion.div>
  )
}
