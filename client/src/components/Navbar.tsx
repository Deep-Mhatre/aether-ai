import { useEffect, useState } from 'react'
import { assets } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react'
import api from '@/configs/axios';
import { toast } from 'sonner';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate()
    const [credits, setCredits] = useState(0)

    const { user, isLoaded } = useUser()

    const getCredits = async () => {
      try {
        const {data} = await api.get('/api/user/credits');
        setCredits(data.credits)
      } catch (error: any) {
        toast.error(error?.response?.data?.message || error.message)
        console.log(error);
      }
    }

    useEffect(()=>{
      if(user){
        getCredits()
      }
    },[user])

  return (
    <>
      <nav className="z-50 flex items-center justify-between w-full py-4 px-4 md:px-16 lg:px-24 xl:px-32 backdrop-blur-xl bg-[#070d08]/70 border-b border-[#233127] text-[#d7e5d7]">
        <Link to='/'>
              <img src={assets.logo} alt="logo" className='h-8 sm:h-10 md:h-11'/>
          </Link>

          <div className="hidden md:flex items-center gap-8 transition duration-500 text-sm font-medium text-[#b8c7b9]">
            <Link className='hover:text-[#dbffd8]' to='/'>Home</Link>
            <Link className='hover:text-[#dbffd8]' to='/projects'>My Projects</Link>
            <Link className='hover:text-[#dbffd8]' to='/community'>Community</Link>
            <Link className='hover:text-[#dbffd8]' to='/pricing'>Pricing</Link>
            
          </div>

          <div className="flex items-center gap-3">
          {!user && isLoaded ? (
            <button onClick={()=> navigate('/clerk/sign-in')} className="cta-glow-hover navbar-ghost-btn px-6 py-2 rounded-xl font-medium text-[#d8ffd9] active:scale-95 transition-all duration-300">
              Get started
            </button>
          ) : (
            <>
            <div className='bg-[#101813] px-5 py-1.5 text-xs sm:text-sm border border-[#2f4434] text-[#c7d7c8] rounded-full'>
            Credits : <span className='text-[#97ff9d]'>{credits}</span>
            </div>
            <UserButton />
            </>
            
          ) 
            }

            <button id="open-menu" className="md:hidden active:scale-90 transition" onClick={() => setMenuOpen(true)} >
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/></svg>
          </button>
          </div>

          
        </nav>
        {/* Mobile Menu */}
        <div className={`fixed inset-0 z-[100] bg-[#060b07]/84 text-[#d8ffd9] backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-all duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <Link to='/' onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to='/projects' onClick={() => setMenuOpen(false)}>My Projects</Link>
          <Link to='/community' onClick={() => setMenuOpen(false)}>Community</Link>
          <Link to='/pricing' onClick={() => setMenuOpen(false)}>Pricing</Link>
          
          
          <button className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-slate-100 hover:bg-slate-200 transition text-black rounded-md flex" onClick={() => setMenuOpen(false)} >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
    </>
  )
}

export default Navbar
