import pb from '@/lib/pocketbase/client'

export const requestPasswordReset = async (email: string) => {
  return pb.send('/backend/v1/send-password-reset-email', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export const verifyResetCode = async (email: string, code: string, newPassword: string) => {
  return pb.send('/backend/v1/verify-reset-code', {
    method: 'POST',
    body: JSON.stringify({ email, code, newPassword }),
  })
}

export const changePassword = async (newPassword: string) => {
  return pb.send('/backend/v1/change-password', {
    method: 'POST',
    body: JSON.stringify({ newPassword }),
  })
}
