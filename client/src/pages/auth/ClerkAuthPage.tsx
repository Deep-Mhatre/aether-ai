import { SignIn, SignUp } from '@clerk/clerk-react'

export const ClerkSignInPage = () => {
  return (
    <main className="p-6 flex flex-col justify-center items-center h-[80vh]">
      <SignIn routing="path" path="/clerk/sign-in" signUpUrl="/clerk/sign-up" />
    </main>
  )
}

export const ClerkSignUpPage = () => {
  return (
    <main className="p-6 flex flex-col justify-center items-center h-[80vh]">
      <SignUp routing="path" path="/clerk/sign-up" signInUrl="/clerk/sign-in" />
    </main>
  )
}
