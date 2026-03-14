import React from 'react'

const Loading = () => {
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Chargement de contenue...</p>
        </div>
      </div>

    </div>
  )
}

export default Loading
