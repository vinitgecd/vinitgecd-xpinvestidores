import { useState, useEffect, useCallback } from 'react'

export function usePasswordReset() {
  const [step, setStep] = useState<'email' | 'code' | 'success'>('email')
  const [email, setEmail] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [resendCountdown, setResendCountdown] = useState(0)

  useEffect(() => {
    if (resendCountdown <= 0) return
    const timer = setInterval(() => {
      setResendCountdown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCountdown])

  const startResendCountdown = useCallback(() => {
    setResendCountdown(600) // 10 minutes
  }, [])

  const resetCountdown = useCallback(() => {
    setResendCountdown(0)
  }, [])

  const canResend = useCallback(() => {
    return resendCountdown === 0
  }, [resendCountdown])

  const reset = useCallback(() => {
    setStep('email')
    setEmail('')
    setResetCode('')
    setNewPassword('')
    setError('')
    resetCountdown()
  }, [resetCountdown])

  return {
    step,
    setStep,
    email,
    setEmail,
    resetCode,
    setResetCode,
    newPassword,
    setNewPassword,
    error,
    setError,
    resendCountdown,
    startResendCountdown,
    resetCountdown,
    canResend,
    reset,
  }
}
