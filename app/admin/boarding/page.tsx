'use client'
import { motion } from 'framer-motion'
import NextLink from 'next/link'
import { useEffect, useState } from 'react'

interface Student {
  id: number;
  name: string;
  boarding: string;
  leaving: string;
  hasBoarded: boolean;
  hasLeft: boolean;
}

// 1. Move the default list outside the component
const DEFAULT_STUDENTS: Student[] = [
  { id: 1, name: "Yash Kiran", boarding: "Thalassery", leaving: "Thalassery", hasBoarded: false, hasLeft: false },
  { id: 2, name: "Jithya J", boarding: "Thalassery", leaving: "Thalassery", hasBoarded: false, hasLeft: false },
  { id: 3, name: "Niyamika M ", boarding: "Thalassery", leaving: "Thalassery", hasBoarded: false, hasLeft: false },
  { id: 4, name: "Nandana T", boarding: "Thalassery", leaving: "Thalassery", hasBoarded: false, hasLeft: false },
  { id: 5, name: "Hanima Sudheep", boarding: "Thalassery", leaving: "Thalassery", hasBoarded: false, hasLeft: false },
  { id: 6, name: "Aparna Dinuraj", boarding: "Thalassery", leaving: "Thalassery", hasBoarded: false, hasLeft: false },
  { id: 7, name: "Metilda Vinod", boarding: "Thalassery", leaving: "Thalassery", hasBoarded: false, hasLeft: false },
  { id: 8, name: "Mariya Mathew", boarding: "Thalassery", leaving: "Thalassery", hasBoarded: false, hasLeft: false },
  { id: 9, name: "Agneya Ani", boarding: "Thalassery", leaving: "Thalassery", hasBoarded: false, hasLeft: false },
  { id: 10, name: "Tom Christ George", boarding: "Thalassery", leaving: "Thalassery", hasBoarded: false, hasLeft: false },
  { id: 11, name: "Muhammed Sinan P H", boarding: "Thalassery", leaving: "Thalassery", hasBoarded: false, hasLeft: false },
  { id: 12, name: "Mejo Mathew", boarding: "Thalassery", leaving: "Thalassery", hasBoarded: false, hasLeft: false },
  { id: 13, name: "Padma Jyothish", boarding: "Thalassery", leaving: "Thalassery", hasBoarded: false, hasLeft: false },
  { id: 14, name: "Lena jolly", boarding: "Thalassery", leaving: "Thalassery", hasBoarded: false, hasLeft: false },
  { id: 15, name: "Anliya Jose", boarding: "Thalassery", leaving: "Thalassery", hasBoarded: false, hasLeft: false },
  { id: 16, name: "Richu Thomas", boarding: "Vadakara", leaving: "Vadakara", hasBoarded: false, hasLeft: false },
  { id: 17, name: "Samith", boarding: "Vadakara", leaving: "Vadakara", hasBoarded: false, hasLeft: false },
  { id: 18, name: "Abhishek C V", boarding: "Vadakara", leaving: "Vadakara", hasBoarded: false, hasLeft: false },
]

export default function BoardingPage() {
  // 2. Initialize exactly with default so server and client match
  const [students, setStudents] = useState<Student[]>(DEFAULT_STUDENTS)
  const [isLoaded, setIsLoaded] = useState(false)

  // 3. Hydration Safe Data Load
  useEffect(() => {
    const saved = localStorage.getItem('techmaghi_transit_log')
    if (saved) {
      const parsedSaved = JSON.parse(saved)
      // Safety Check: If you add/remove students, it resets the memory to prevent a crash
      if (parsedSaved.length === DEFAULT_STUDENTS.length) {
        setStudents(parsedSaved)
      } else {
        localStorage.setItem('techmaghi_transit_log', JSON.stringify(DEFAULT_STUDENTS))
      }
    }
    setIsLoaded(true)
  }, [])

  // Automatically save to memory every time you click a button
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('techmaghi_transit_log', JSON.stringify(students))
    }
  }, [students, isLoaded])

  // Separate Toggle Functions
  const toggleBoarding = (studentId: number) => {
    setStudents(students.map((student) => 
      student.id === studentId ? { ...student, hasBoarded: !student.hasBoarded } : student
    ))
  }

  const toggleLeaving = (studentId: number) => {
    setStudents(students.map((student) => 
      student.id === studentId ? { ...student, hasLeft: !student.hasLeft } : student
    ))
  }

  // Live Counters
  const totalStudents = students.length
  const boardedCount = students.filter((s) => s.hasBoarded).length
  const leftCount = students.filter((s) => s.hasLeft).length

  // Hide UI until safe to render
  if (!isLoaded) return null

  return (
    <div 
      style={{ backgroundColor: '#E6E6FA', minHeight: '100vh', width: '100%' }} 
      className="flex flex-col items-center py-12 px-4 md:px-6 font-sans relative overflow-hidden"
    >
      {/* Background Mesh */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.25, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="fixed top-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none"
      />

      {/* Header & Live Counters */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 flex flex-col items-center mb-8 text-center"
      >
        <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-2">
          TRANSIT LOG
        </h1>
        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.5em] opacity-70 mb-6">
          Techmaghi Industrial Visit
        </p>
        
        {/* Dual Live Counters */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-6">
          <div className="px-5 py-2 bg-white/20 backdrop-blur-md border border-white/40 rounded-full shadow-sm">
            <span className="text-[10px] md:text-xs font-black text-slate-700 uppercase tracking-widest">
              Boarded: <span className="text-green-600">{boardedCount}</span> / {totalStudents}
            </span>
          </div>
          <div className="px-5 py-2 bg-white/20 backdrop-blur-md border border-white/40 rounded-full shadow-sm">
            <span className="text-[10px] md:text-xs font-black text-slate-700 uppercase tracking-widest">
              Departed: <span className="text-red-600">{leftCount}</span> / {totalStudents}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Main Glass Container - List of Students */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative z-10 w-full max-w-4xl bg-white/10 backdrop-blur-[45px] border-[0.5px] border-white/40 p-4 md:p-8 rounded-[40px] shadow-[0_40px_80px_rgba(0,0,0,0.1)] flex flex-col items-center min-h-[400px]"
      >
        <div className="w-full space-y-4">
          {students.map((student, idx) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx }}
              className="w-full flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 border-[0.5px] rounded-2xl backdrop-blur-md transition-all duration-300 bg-white/10 border-white/30 hover:bg-white/20"
            >
              {/* Student Name */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-black text-slate-500 text-xs shadow-inner shrink-0">
                  {student.name.charAt(0)}
                </div>
                <span className="text-base font-black text-slate-800">{student.name}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-row gap-3 w-full lg:w-auto">
                {/* Boarding Button (Glows Green) */}
                <button
                  onClick={() => toggleBoarding(student.id)}
                  className={`flex-1 lg:flex-none px-4 py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-sm border-[0.5px] ${
                    student.hasBoarded
                      ? 'bg-green-500/20 text-green-700 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                      : 'bg-white/30 text-slate-500 border-white/50 hover:bg-white/40'
                  }`}
                >
                  ↑ {student.boarding}
                </button>

                {/* Leaving Button (Glows Red) */}
                <button
                  onClick={() => toggleLeaving(student.id)}
                  className={`flex-1 lg:flex-none px-4 py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-sm border-[0.5px] ${
                    student.hasLeft
                      ? 'bg-red-500/20 text-red-700 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                      : 'bg-white/30 text-slate-500 border-white/50 hover:bg-white/40'
                  }`}
                >
                  ↓ {student.leaving}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Back Button */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="relative z-20 mt-12 mb-8">
        <NextLink href="/admin" className="px-8 py-4 bg-white/20 backdrop-blur-md border-[0.5px] border-white/40 rounded-full text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] hover:bg-white/40 transition-all shadow-lg inline-block">
          ← Return to Portal
        </NextLink>
      </motion.div>
    </div>
  )
}