import React from 'react'
import { format } from 'date-fns'
import { AiFillDelete } from 'react-icons/ai'

interface Task {
  id: string
  title: string
  date: string
  color: string
}

interface TaskListProps {
  tasks: Task[]
  onDelete: (id: string) => void
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDelete }) => {
  const sortedTasks = [...tasks].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-inner h-full overflow-y-auto border border-slate-600">
      <h2 className="text-lg font-semibold text-blue-300 mb-3">Upcoming Tasks</h2>
      {sortedTasks.length === 0 && (
        <p className="text-sm text-slate-400">No tasks scheduled.</p>
      )}
      {sortedTasks.map((task) => (
        <div
          key={task.id}
          className="flex items-start justify-between bg-slate-900 mb-2 p-3 rounded-md border-l-4"
          style={{ borderColor: task.color }}
        >
          <div>
            <h3 className="font-medium">{task.title}</h3>
            <p className="text-xs text-slate-400">
              {format(new Date(task.date + 'T12:00:00'), 'MMMM d, yyyy')}
            </p>
          </div>
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-500 hover:text-red-400 transition ml-2"
            title="Delete"
          >
            <AiFillDelete size={18} />
          </button>
        </div>
      ))}
    </div>
  )
}

export default TaskList
