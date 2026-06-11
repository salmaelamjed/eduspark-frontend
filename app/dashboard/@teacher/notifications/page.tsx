import React from 'react'

const Notifications = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Gérez et suivez toutes vos notifications
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Tu pourras ajouter ici le contenu des notifications */}
      </div>
    </div>
  )
}

export default Notifications