"use client"
import { useState } from 'react'
import { TvShowCard } from './tv-show-card'

interface TvShowListProps {
  tvShows: any[]
  onDeleteShow: (show: any) => void
}

export function TvShowList({ tvShows, onDeleteShow }: TvShowListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tvShows?.map((tvShow) => (
        <TvShowCard 
          key={tvShow.id} 
          tvShow={tvShow} 
          onDelete={() => onDeleteShow(tvShow)}
        />
      ))}
    </div>
  )
}
