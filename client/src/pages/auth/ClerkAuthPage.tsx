import { SignIn, SignUp } from '@clerk/clerk-react'

export const ClerkSignInPage = () => {
  return (
    <main className="p-6 flex flex-col justify-center items-center h-[80vh]">
      <div className='rounded-2xl border border-blue-200/20 bg-[#071a46]/70 p-2 shadow-[0_12px_40px_rgba(0,0,0,0.25)]'>
        <SignIn routing="path" path="/clerk/sign-in" signUpUrl="/clerk/sign-up" />
      </div>
    </main>
  )
}

export const ClerkSignUpPage = () => {
  return (
    <main className="p-6 flex flex-col justify-center items-center h-[80vh]">
      <div className='rounded-2xl border border-blue-200/20 bg-[#071a46]/70 p-2 shadow-[0_12px_40px_rgba(0,0,0,0.25)]'>
        <SignUp routing="path" path="/clerk/sign-up" signInUrl="/clerk/sign-in" />
      </div>
    </main>
  )
}
