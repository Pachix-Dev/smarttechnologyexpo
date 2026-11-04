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
      printableLabels: [],

      setName: (name) => set({ name }),
      setPaternSurname: (paternSurname) => set({ paternSurname }),
      setEmail: (email) => set({ email }),
      setPhone: (phone) => set({ phone }),
      setTypeRegister: (typeRegister) => set({ typeRegister }),
      setCompany: (company) => set({ company }),
      setPosition: (position) => set({ position }),

      setCompleteRegister: (complete_register) => set({ complete_register }),
      setPrintableLabel: (printableLabel) => set({ printableLabel, printableLabels: [] }),
      setPrintableLabels: (printableLabels) => set({ printableLabels, printableLabel: null }),

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
          printableLabels: [],
        }),
    }),
    { name: "staff-register-smarttechnologyexpo" },
  ),
);

export { useStaffRegisterForm };
