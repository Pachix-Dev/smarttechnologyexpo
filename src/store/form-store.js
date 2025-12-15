import {create} from 'zustand';
import { persist } from 'zustand/middleware';

const useZustandStore = create(
  persist(
    (set) => ({
      zustandState: false, // Adjust the initial state as needed
      setZustandState: (value) => set({ zustandState: value }),
    }),
    {
      name: 'zustand-storage',
    }
  )
);

export {useZustandStore};
