import { defineNuxtPlugin } from '#app'
import localforage from 'localforage'
import type { Pinia, PiniaPluginContext } from 'pinia'

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = nuxtApp.$pinia as Pinia

  pinia.use((context: PiniaPluginContext) => {
    const { store } = context
    const key = `pinia:${store.$id}`

    // load persisted state (async)
    void (async () => {
      try {
        const raw = await localforage.getItem<string>(key)
        if (raw) {
          const parsed = JSON.parse(raw)
          // apply only keys present in the stored object
          store.$patch(parsed)
        }
      } catch (e) {
        // non-fatal: print to console if something goes wrong
        // do not throw — we don't want to crash app boot
        // eslint-disable-next-line no-console
        console.error('[pinia-persist] failed to restore store', store.$id, e)
      }
    })()

    // subscribe to changes and persist selected parts of the state
    store.$subscribe(
      (_mutation, state) => {
        try {
          // Persist **only** favoriteRockets (change this if you want more keys)
          const toSave = { favoriteRockets: (state as any).favoriteRockets }
          void localforage.setItem(key, JSON.stringify(toSave))
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('[pinia-persist] failed to persist store', store.$id, e)
        }
      },
      { detached: true } // avoid interfering with SSR/reactivity
    )
  })
})
