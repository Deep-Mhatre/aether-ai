import { useEffect, useState } from 'react'
import type { Project } from '../types';
import { Loader2Icon, PlusIcon, TrashIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import api from '@/configs/axios';
import { toast } from 'sonner';
import { useUser } from '@clerk/clerk-react';

const MyProjects = () => {
    const { user, isLoaded } = useUser()
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<Project[]>([])
    const navigate = useNavigate()

    const fetchProjects = async () => {
        try {
            const { data } = await api.get('/api/user/projects')
            setProjects(data.projects)
            setLoading(false)
        } catch (error: any) {
            console.log(error);
            toast.error(error?.response?.data?.message || error.message)
        }
    }

    const deleteProject = async (projectId:string) => {
        try {
            const confirm = window.confirm('Are you sure you want to delete this project?');
            if(!confirm) return;
            const { data } = await api.delete(`/api/project/${projectId}`)
            toast.success(data.message);
            fetchProjects()
        } catch (error: any) {
            console.log(error);
            toast.error(error?.response?.data?.message || error.message)
        }
    }

    useEffect(()=>{
        if(user && isLoaded){
            fetchProjects()
        }else if(isLoaded && !user){
            navigate('/');
            toast('Please login to view your projects');
        }
    },[user, isLoaded])
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
                    <h1 className='text-4xl font-semibold tracking-tight text-[#d7ffd5]'>My Projects</h1>
                    <button onClick={()=> navigate('/')} className='neo-btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm active:scale-95'>
                        <PlusIcon size={18}/> Create New
                    </button>
                </div>

                <div className='flex flex-wrap gap-3.5'>
                    {projects.map((project)=>(
                        <div onClick={()=> navigate(`/projects/${project.id}`)} key={project.id} className='neo-list-card relative group w-72 max-sm:mx-auto cursor-pointer overflow-hidden transition-all duration-300'>
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

                                <div onClick={(e)=>e.stopPropagation()} className='flex justify-between items-center mt-6'>
                                    <span className='text-xs text-[#7f9482]'>{new Date(project.createdAt).toLocaleDateString()}</span>
                                    <div className='flex gap-2 text-[#d7ffd5] text-sm'>

                                        <button onClick={()=>navigate(`/preview/${project.id}`)} className='neo-btn-outline px-3 py-1.5 text-xs'>Preview</button>

                                        <button onClick={()=>navigate(`/projects/${project.id}`)} className='neo-btn-primary px-3 py-1.5 text-xs'>Open</button>
                                    </div>
                                </div>
                             </div>
                             <div onClick={e => e.stopPropagation()}>
                                <TrashIcon className='absolute top-3 right-3 scale-0 group-hover:scale-100 bg-[#111b12] p-1.5 size-7 rounded text-red-400 text-xl cursor-pointer transition-all border border-[#2a3f2e]' onClick={()=>deleteProject(project.id)}/>
                             </div>
                        </div>
                    ))}
                </div>
                
            </div>
        ) : (
            <div className='flex flex-col items-center justify-center h-[80vh]'>
                 <h1 className='text-3xl font-semibold text-[#d7ffd5]'>You have no projects yet!</h1>
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

export default MyProjects
