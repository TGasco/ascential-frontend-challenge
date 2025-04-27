import { describe, it, expect, beforeEach, vi } from 'vitest';
import handleAddToFavourites from './addToFavourites';

describe('handleAddToFavourites', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.restoreAllMocks()
    })

    it('adds a new venue when none exist in storage', () => {
        const dispatchSpy = vi.spyOn(window, 'dispatchEvent')
        const result = handleAddToFavourites(1, 'venue')

        expect(result).toBe(true)

        const stored = JSON.parse(localStorage.getItem('favourites')!)
        expect(stored.venues['1']).toBe(true)
        expect(stored.events).toEqual({})

        expect(dispatchSpy).toHaveBeenCalledTimes(1)
        const eventArg = dispatchSpy.mock.calls[0][0] as Event
        expect(eventArg.type).toBe('favouritesUpdated')
    })

    it('removes an existing venue when toggled twice', () => {
        handleAddToFavourites(2, 'venue')
        const dispatchSpy = vi.spyOn(window, 'dispatchEvent')
        const result = handleAddToFavourites(2, 'venue')

        expect(result).toBe(false)

        const stored = JSON.parse(localStorage.getItem('favourites')!)
        expect(stored.venues['2']).toBeUndefined()
        expect(stored.events).toEqual({})

        expect(dispatchSpy).toHaveBeenCalledOnce()
    })

    it('adds and removes an event correctly', () => {
        const dispatchSpy = vi.spyOn(window, 'dispatchEvent')
        const addResult = handleAddToFavourites(5, 'event')
        expect(addResult).toBe(true)

        let stored = JSON.parse(localStorage.getItem('favourites')!)
        expect(stored.events['5']).toBe(true)
        expect(stored.venues).toEqual({})

        const removeResult = handleAddToFavourites(5, 'event')
        expect(removeResult).toBe(false)

        stored = JSON.parse(localStorage.getItem('favourites')!)
        expect(stored.events['5']).toBeUndefined()

        // two dispatch calls: one for add, one for remove
        expect(dispatchSpy).toHaveBeenCalledTimes(2)
    })

    it('initializes missing collections in stored data', () => {
        const initial = { venues: { '3': true } }
        localStorage.setItem('favourites', JSON.stringify(initial))
        const dispatchSpy = vi.spyOn(window, 'dispatchEvent')

        const result = handleAddToFavourites(7, 'event')
        expect(result).toBe(true)

        const stored = JSON.parse(localStorage.getItem('favourites')!)
        expect(stored.venues['3']).toBe(true)
        expect(stored.events['7']).toBe(true)

        expect(dispatchSpy).toHaveBeenCalledOnce()
    })

    it('persists multiple toggles and mixed types correctly', () => {
        handleAddToFavourites(1, 'venue')
        handleAddToFavourites(2, 'event')
        handleAddToFavourites(3, 'venue')

        const stored1 = JSON.parse(localStorage.getItem('favourites')!)
        expect(Object.keys(stored1.venues).sort()).toEqual(['1', '3'])
        expect(Object.keys(stored1.events)).toEqual(['2'])

        handleAddToFavourites(1, 'venue') // remove
        handleAddToFavourites(2, 'event') // remove

        const stored2 = JSON.parse(localStorage.getItem('favourites')!)
        expect(stored2.venues['1']).toBeUndefined()
        expect(stored2.venues['3']).toBe(true)
        expect(stored2.events['2']).toBeUndefined()
    })
})