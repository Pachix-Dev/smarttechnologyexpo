import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStaffRegisterForm = create(
  persist(
    (set) => ({
      name: "",
      paternSurname: "",
      email: "",
      phone: "",
      typeRegister: "",
      company: "",
      position: "",

      complete_register: false,
      printableLabel: null,

      setName: (name) => set({ name }),
      setPaternSurname: (paternSurname) => set({ paternSurname }),
      setEmail: (email) => set({ email }),
      setPhone: (phone) => set({ phone }),
      setTypeRegister: (typeRegister) => set({ typeRegister }),
      setCompany: (company) => set({ company }),
      setPosition: (position) => set({ position }),

      setCompleteRegister: (complete_register) => set({ complete_register }),
      setPrintableLabel: (printableLabel) => set({ printableLabel }),

      clear: () =>
        set({
          name: "",
          paternSurname: "",
          email: "",
          phone: "",
          typeRegister: "",
          company: "",
          position: "",
          complete_register: false,
          printableLabel: null,
        }),
    }),
    { name: "staff-register-smarttechnologyexpo" },
  ),
);

export { useStaffRegisterForm };