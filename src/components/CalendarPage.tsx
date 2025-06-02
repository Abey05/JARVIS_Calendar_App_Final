import React, { useEffect, useRef, useState } from 'react'
import { format } from 'date-fns'
import { AiOutlinePlus, AiOutlineLogout } from 'react-icons/ai'
import VoiceInteraction from './VoiceInteraction'
import TaskModal from './TaskModal'
import TaskList from './TaskList'
import ProfileMenu from './ProfileMenu'

interface CalendarPageProps {
  user: string
}

interface Task {
  id: string
  title: string
  date: string
  color: string
}

const CalendarPage: React.FC<CalendarPageProps> = ({ user }) => {
  const [currentDate] = useState(new Date())
  const [tasks, setTasks] = useState<Task[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>('')

  const hasGreetedRef = useRef(false)

  const addTask = (task: Task) => {
    setTasks((prev) => [...prev, task])
    speak(`Task "${task.title}" added for ${format(new Date(task.date + 'T12:00:00'), 'MMMM d')}`)
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const speak = (text: string) => {
    const synth = window.speechSynthesis
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.voice = synth.getVoices().find(v => v.name.includes('Google') || v.default) || null
    synth.speak(utterance)
  }

  useEffect(() => {
  if (!hasGreetedRef.current) {
    const hour = new Date().getHours()
    let timeGreeting = 'Good evening'

    if (hour < 12) {
      timeGreeting = 'Good morning'
    } else if (hour < 17) {
      timeGreeting = 'Good afternoon'
    }

    speak(`${timeGreeting}, ${user}. Welcome to your JARVIS calendar system.`)
    hasGreetedRef.current = true
  }
}, [user])


  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr)
    setModalOpen(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('jarvisUser')
    location.reload()
  }

  const handleDeleteAccount = () => {
    localStorage.removeItem('jarvisUser')
    localStorage.removeItem(`jarvisProfile-${user}`)
    localStorage.removeItem('jarvisUsers')
    location.reload()
  }

  const renderCalendar = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
    const blanks = Array.from({ length: firstDay }, () => null)

    return [...blanks, ...Array.from({ length: daysInMonth }, (_, i) => i + 1)].map((day, i) => {
      if (day == null) {
        return <div key={i} className="p-2 rounded-md min-h-[80px]" />
      }

      const localDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day, 12)
      const dateStr = localDate.toISOString().split('T')[0]
      const dayTasks = tasks.filter((t) => t.date === dateStr)

      return (
        <div
          key={i}
          className="border border-slate-700 p-2 rounded-md hover:bg-slate-700 cursor-pointer transition relative min-h-[80px]"
          onClick={() => handleDayClick(dateStr)}
        >
          <div className="font-semibold text-white">{day}</div>
          {dayTasks.map((task) => (
            <div
              key={task.id}
              className="mt-1 text-xs px-1 py-0.5 rounded-sm truncate"
              style={{ backgroundColor: task.color }}
            >
              {task.title}
            </div>
          ))}
        </div>
      )
    })
  }

  return (
    <div className="p-6 bg-[#0f172a] min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          <span className="text-[#DC2626]">JARVIS</span>{' '}
          <span className="text-[#F59E0B]">Calendar</span>
          <span className="text-white font-normal text-base ml-4">– Welcome, {user}</span>
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-1"
          >
            <AiOutlinePlus />
            Add Task
          </button>
          <button
            onClick={handleLogout}
            className="bg-white text-red-600 hover:bg-red-200 px-4 py-2 rounded-md flex items-center gap-1"
          >
            <AiOutlineLogout />
            Logout
          </button>

          <ProfileMenu username={user} onDeleteAccount={handleDeleteAccount} />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="grid grid-cols-7 gap-2 flex-grow">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="text-center font-medium text-blue-300">
              {d}
            </div>
          ))}
          {renderCalendar()}
        </div>

        <div className="w-[280px]">
          <TaskList tasks={tasks} onDelete={deleteTask} />
        </div>
      </div>

      <VoiceInteraction />
      {modalOpen && (
        <TaskModal
          date={selectedDate}
          onClose={() => setModalOpen(false)}
          onSave={addTask}
        />
      )}
    </div>
  )
}

export default CalendarPage
