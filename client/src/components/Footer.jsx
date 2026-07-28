import React from 'react'
import { MdFlightTakeoff } from 'react-icons/md'

function Footer() {
  return (
    <div className='bg-slate-50 flex justify-center px-4 pb-10 py-4 pt-10'>
      <div className='w-full max-w-6xl bg-white rounded-2xl shadow-sm border border-slate-200 py-8 px-3 text-center'>
        <div className='flex justify-center items-center gap-3 mb-3'>
            <div className='bg-indigo-600 text-white p-2 rounded-lg'><MdFlightTakeoff size={16}/></div>
            <h2 className='font-semibold'>HirePilot</h2>
        </div>
        <p className='text-gray-500 text-sm max-w-xl mx-auto'>
          AI-powered interview preparation platform designed to improve
          communication skills, technical depth and professional confidence.
        </p>


      </div>
    </div>
  )
}

export default Footer
