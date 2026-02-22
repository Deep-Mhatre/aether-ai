import api from '@/configs/axios';
import { authClient } from '@/lib/auth-client';
import { Loader2Icon } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Home = () => {

  const {data: session} = authClient.useSession()
  const navigate = useNavigate()

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if(!session?.user){
        return toast.error('Please sign in to create a project')
      }else if(!input.trim()){
        return toast.error('Please enter a message')
      }
      setLoading(true)
      const {data} = await api.post('/api/user/project', {initial_prompt: input});
      setLoading(false);
      navigate(`/projects/${data.projectId}`)
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    }

  }

  return (
  
      <section className="relative flex flex-col items-center text-white text-sm pb-28 px-4 font-poppins bg-[#0C0414] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-black/40 pointer-events-none" />

        <div className="p-px rounded-full bg-gradient-to-r from-indigo-900 to-gray-500 mt-24">
  <div className="flex items-center justify-center px-4 py-2 rounded-full bg-[#0C0414] text-sm text-slate-200">
    ⚡ AI-Powered Website Generator
  </div>
</div>

       <h1 className="text-4xl md:text-[66px]/[72px] text-center max-w-4xl mt-6 
bg-gradient-to-r from-[#5b3b82] via-white to-[#5b3b82] 
text-transparent bg-clip-text font-semibold leading-tight">
  Design, Build & Launch Websites with AI in Minutes
</h1>

       <p className="text-sm md:text-base bg-gradient-to-r from-[#5b3b82] via-white to-[#5b3b82] 
text-transparent bg-clip-text text-center max-w-lg mt-4">
  Create production-ready websites and UI components instantly with AI-generated layouts, code and design systems.
</p>

<div className="absolute top-[220px] left-1/2 -translate-x-1/2 
w-[800px] h-40 bg-purple-700 blur-[120px] opacity-30 pointer-events-none -z-10"></div>

        <form onSubmit={onSubmitHandler} className="bg-white/10 max-w-2xl w-full rounded-xl p-4 mt-10 border border-indigo-600/70 focus-within:ring-2 ring-indigo-500 transition-all">
          <textarea onChange={e => setInput(e.target.value)} className="bg-transparent outline-none text-gray-300 resize-none w-full" rows={4} placeholder="“Describe your website idea (e.g. AI fitness app with pricing & blog)”" required />
          <button 
            disabled={loading}
            className={`ml-auto flex items-center gap-2 
            bg-gradient-to-r from-[#CB52D4] to-indigo-600 
            rounded-md px-5 py-2.5 transition 
            ${loading && 'opacity-70 cursor-not-allowed'}`}
          >
            {!loading ? 'Create with AI' : (
              <>
              Creating <Loader2Icon className='animate-spin size-4 text-white'/>
              </>
            )}
          </button>
        </form>

        <div className="relative mt-16 w-full max-w-5xl px-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 
          w-[700px] h-32 bg-purple-500 blur-[80px] opacity-60"></div>

          <div className="relative z-10 bg-white/5 backdrop-blur rounded-2xl p-3 border border-white/10 shadow-2xl">
            <img
              className="rounded-lg"
              src="https://assets.prebuiltui.com/images/components/hero-section/hero-dashImage1.png"
              alt="AI Builder Preview"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-16 md:gap-20 mx-auto mt-16">
          <img className="max-w-28 md:max-w-32" src="https://saasly.prebuiltui.com/assets/companies-logo/framer.svg" alt="" />
          <img className="max-w-28 md:max-w-32" src="https://saasly.prebuiltui.com/assets/companies-logo/huawei.svg" alt="" />
          <img className="max-w-28 md:max-w-32" src="https://saasly.prebuiltui.com/assets/companies-logo/instagram.svg" alt="" />
          <img className="max-w-28 md:max-w-32" src="https://saasly.prebuiltui.com/assets/companies-logo/microsoft.svg" alt="" />
          <img className="max-w-28 md:max-w-32" src="https://saasly.prebuiltui.com/assets/companies-logo/walmart.svg" alt="" />
        </div>
      </section>

  )
}

export default Home
