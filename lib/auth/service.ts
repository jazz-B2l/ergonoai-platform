import { createClient } from '@/lib/supabase/client'
import { LoginInput, SignupInput, ResetPasswordInput, UpdatePasswordInput, UpdateEmailInput } from './validation'

class AuthService {
  private get supabase() {
    return createClient()
  }

  async login(input: LoginInput) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    })
    if (error) throw error
    return data
  }

  async signup(input: SignupInput) {
    const { data, error } = await this.supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          first_name: input.firstName,
          last_name: input.lastName,
        },
      },
    })
    if (error) throw error
    return data
  }

  async signInWithGoogle(redirectTo?: string) {
    const targetUrl = redirectTo || `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: targetUrl,
      },
    })
    if (error) throw error
    return data
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut()
    if (error) throw error
  }

  async forgotPassword(email: string) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
  }

  async resetPassword(input: ResetPasswordInput) {
    const { error } = await this.supabase.auth.updateUser({
      password: input.password,
    })
    if (error) throw error
  }

  async updatePassword(input: UpdatePasswordInput) {
    // In Supabase, if the user is signed in, you just update the password.
    // However, it's best practice to verify current password first if you aren't using Supabase Reauthentication.
    // Since Supabase doesn't have a direct "verify password" endpoint without signIn, 
    // you would either sign them in again or just call updateUser (which might require a recent login).
    // For now, we will simply use updateUser.
    
    // Check current password by attempting to sign in
    const user = await this.supabase.auth.getUser()
    if (!user.data.user?.email) throw new Error("Not logged in")
    
    const { error: signInError } = await this.supabase.auth.signInWithPassword({
      email: user.data.user.email,
      password: input.currentPassword
    })
    
    if (signInError) throw new Error("Invalid current password")

    const { error } = await this.supabase.auth.updateUser({
      password: input.newPassword,
    })
    if (error) throw error
  }

  async updateEmail(input: UpdateEmailInput) {
    const user = await this.supabase.auth.getUser()
    if (!user.data.user?.email) throw new Error("Not logged in")

    const { error: signInError } = await this.supabase.auth.signInWithPassword({
      email: user.data.user.email,
      password: input.currentPassword
    })
    
    if (signInError) throw new Error("Invalid current password")

    const { error } = await this.supabase.auth.updateUser({
      email: input.email,
    }, {
      emailRedirectTo: `${window.location.origin}/settings/security`
    })
    if (error) throw error
  }

  async resendVerification(email: string) {
    const { error } = await this.supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      }
    })
    if (error) throw error
  }

  async verifyOtp(email: string, token: string) {
    const { data, error } = await this.supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup'
    })
    if (error) throw error
    return data
  }
}

export const authService = new AuthService()
