// stores/favorites.ts
import { defineStore } from 'pinia'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favoriteRockets: [] as any[],
  }),
  actions: {
    addOrRemoveFavorite(rocket: any) {
      const idx = this.favoriteRockets.findIndex(r => r.id === rocket.id)
      if (idx === -1) {
        this.favoriteRockets.push(rocket)
        return 'added'
      } else {
        this.favoriteRockets.splice(idx, 1)
        return 'removed'
      }
    },
    removeFavorite(id: string) {
      this.favoriteRockets = this.favoriteRockets.filter(r => r.id !== id)
    },
    clearFavorites() {
      this.favoriteRockets = []
    },
    isFavorite(id: string) {
      return this.favoriteRockets.some(r => r.id === id)
    },
  },
})
