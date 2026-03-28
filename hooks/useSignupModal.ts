import { create } from 'zustand'

type SignupStep = 1 | 2 | 3

type SignupStore = {
  isOpen: boolean
  step: SignupStep
  email: string
  open: () => void
  close: () => void
  nextStep: () => void
  prevStep: () => void
  setEmail: (email: string) => void
}

export const useSignupModal = create<SignupStore>((set) => ({
  isOpen: false,
  step: 1,
  email: '',
  open: () => set({ isOpen: true, step: 1 }),
  close: () => set({ isOpen: false, step: 1, email: '' }),
  nextStep: () => set((s) => ({ step: (s.step + 1) as SignupStep })),
  prevStep: () => set((s) => ({ step: (s.step - 1) as SignupStep })),
  setEmail: (email) => set({ email }),
}))