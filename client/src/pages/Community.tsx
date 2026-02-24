import { useEffect, useState } from 'react'
import type { Project } from '../types';
import { Loader2Icon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import api from '@/configs/axios';
import { toast } from 'sonner';

const Community = () => {
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<Project[]>([])
    const navigate = useNavigate()

    const fetchProjects = async () => {
       try {
        const { data } = await api.get('/api/project/published');
        setProjects(data.projects);
        setLoading(false);
       } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.message || error.message);
       }
    }

    useEffect(()=>{
        fetchProjects()
    },[])
  return (
    <>
      <div className='px-4 md:px-16 lg:px-24 xl:px-32'>
        {loading ? (
            <div className='flex items-center justify-center h-[80vh]'>
                <Loader2Icon className='size-7 animate-spin text-[#b8ffb5]'/>
            </div>
        ) : projects.length > 0 ? (
            <div className='py-10 min-h-[80vh]' > 
                <div className='flex items-center justify-between mb-12'>
                    <h1 className='text-4xl font-semibold tracking-tight text-[#d7ffd5]'>Published Projects</h1>
                </div>

                <div className='flex flex-wrap gap-3.5'>
                    {projects.map((project)=>(
                        <Link 
                        key={project.id} 
                        to={`/view/${project.id}`}
                        target='_blank'
                        className='neo-list-card w-72 max-sm:mx-auto cursor-pointer overflow-hidden group transition-all duration-300'>
                            {/* Desktop-like Mini Preview */}
                            <div className='relative w-full h-40 bg-[#050a06] overflow-hidden border-b border-[#213124]'>
                                {project.current_code ? (
                                    <iframe  
                                    srcDoc={project.current_code}
                                    className='absolute top-0 left-0 w-[1200px] h-[800px] origin-top-left pointer-events-none'
                                    sandbox='allow-scripts allow-same-origin'
                                    style={{ transform: 'scale(0.25)'}}/>
                                )
                            : (
                                <div className='flex items-center justify-center h-full text-[#7d927f]'>
                                    <p>No Preview</p>
                                </div>
                            )}
                            </div>
                             {/* Content */}
                             <div className='p-4 text-[#d7e5d7] bg-gradient-to-b from-transparent group-hover:from-[#112013]/35 to-transparent transition-colors'>
                                <div className='flex items-start justify-between'>
                                    <h2 className='text-xl font-medium line-clamp-2'>{project.name}</h2>
                                    <button className='px-2.5 py-0.5 mt-1 ml-2 text-xs bg-[#111b12] border border-[#2a3f2e] rounded-full text-[#9ec89f]'>Website</button>
                                </div>
                                <p className='text-[#9cb39f] mt-1 text-sm line-clamp-2'>{project.initial_prompt}</p>

                                <div className='flex justify-between items-center mt-6'>
                                    <span className='text-xs text-[#7f9482]'>{new Date(project.createdAt).toLocaleDateString()}</span>
                                    <div className='flex gap-3 text-[#d7ffd5] text-sm'>

                                        <button className='neo-btn-outline px-3 py-1.5 text-xs flex items-center gap-2'>
                                            <span className='bg-gray-200 w-[18px] h-[18px] rounded-full text-black font-semibold flex items-center justify-center'>{project.user?.name?.slice(0,1)}</span>
                                            {project.user?.name}
                                        </button>

                                    </div>
                                </div>
                             </div>
                        </Link>
                    ))}
                </div>
                
            </div>
        ) : (
            <div className='flex flex-col items-center justify-center h-[80vh]'>
                 <h1 className='text-3xl font-semibold text-[#d7ffd5]'>No projects have been published yet.</h1>
                 <button onClick={() => navigate('/')} className='neo-btn-primary mt-5 px-5 py-2.5 active:scale-95'>
                    Create New
                 </button>
            </div>
        )}
      </div>
      <Footer />
    </>
  )
}


export default Community
