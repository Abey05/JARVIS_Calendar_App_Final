import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface TaskModalProps {
  date: string
  onClose: () => void
  onSave: (task: { id: string; title: string; date: string; color: string }) => void
}

const TaskModal: React.FC<TaskModalProps> = ({ date, onClose, onSave }) => {
  const [title, setTitle] = useState('')
  const [color, setColor] = useState('#3B82F6') // Arc Reactor blue default

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSave({
      id: uuidv4(),
      title: title.trim(),
      date: new Date(date + 'T12:00:00').toISOString().split('T')[0],
      color
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 text-white p-6 rounded-lg shadow-lg w-[350px] space-y-4 border border-slate-700"
      >
        <h2 className="text-xl font-semibold">New Task – {date}</h2>

        <div className="flex flex-col gap-2">
          <label className="text-sm">Task Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-slate-800 p-2 rounded-md border border-slate-600"
            placeholder="e.g. Suit Calibration at 9PM"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm">Color Tag</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-16 h-8 p-0 border-2 border-slate-400 rounded"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-slate-700 hover:bg-slate-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500"
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  )
}

export default TaskModal
