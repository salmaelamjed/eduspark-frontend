"use client"
import React, { useState } from 'react';

type InitialValuesProps = {
  currentStep: number
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
}

const InitialValues: InitialValuesProps = {
  currentStep: 1,
  setCurrentStep: () => undefined,
}

const StepContext = React.createContext(InitialValues)

const { Provider } = StepContext

export const StepContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentStep, setCurrentStep] = useState<number>(InitialValues.currentStep)
  
  const values = {
    currentStep,
    setCurrentStep
  }
  
  return <Provider value={values}>{children}</Provider>
}

export const useStepContextHook = () => {
  const state = React.useContext(StepContext)
  return state
}