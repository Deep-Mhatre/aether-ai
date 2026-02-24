import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Project } from '../types'
import { ArrowBigDownDashIcon, EyeIcon, EyeOffIcon, FullscreenIcon, LaptopIcon, Loader2Icon, MessageSquareIcon, SaveIcon, SmartphoneIcon, TabletIcon, XIcon } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import ProjectPreview, { type ProjectPreviewRef } from '../components/ProjectPreview'
import api from '@/configs/axios'
import { toast } from 'sonner'
import { useUser } from '@clerk/clerk-react'

const Projects = () => {
  const {projectId} = useParams()
  const navigate = useNavigate()
  const { user, isLoaded } = useUser()

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  const [isGenerating, setIsGenerating] = useState(true)
  const [device, setDevice] = useState<'phone' | 'tablet' | 'desktop'>("desktop")

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const previewRef = useRef<ProjectPreviewRef>(null)
  const deviceButtonClass = (selected: boolean) =>
    `size-8 p-1.5 rounded-lg transition-colors ${selected ? 'bg-white/[18%] text-white' : 'text-white/70 hover:text-white hover:bg-white/[8%]'}`

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/api/user/project/${projectId}`);
      setProject(data.project)
      setIsGenerating(data.project.current_code ? false : true)
      setLoading(false)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    }
  }

  const saveProject = async () => {
    if(!previewRef.current) return;
    const code = previewRef.current.getCode();
    if(!code) return;
    setIsSaving(true);
    try {
      const { data } = await api.put(`/api/project/save/${projectId}`, {code});
      toast.success(data.message)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    }finally{
      setIsSaving(false);
    }
    };

    // download code ( index.html )
  const downloadCode = ()=>{
    const code = previewRef.current?.getCode() || project?.current_code;
    if(!code){
      if(isGenerating){
        return
      }
      return
    }
    const element = document.createElement('a');
    const file = new Blob([code], {type: "text/html"});
    element.href = URL.createObjectURL(file)
    element.download = "index.html";
    document.body.appendChild(element)
    element.click();
  }

  const togglePublish = async () => {
    try {
      const { data } = await api.get(`/api/user/publish-toggle/${projectId}`);
      toast.success(data.message)
      setProject((prev)=> prev ? ({...prev, isPublished: !prev.isPublished}) : null)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    }
  }

  useEffect(()=>{
    if(user){
      fetchProject();
    }else if(isLoaded && !user){
      navigate("/")
      toast("Please login to view your projects")
    }
  },[user, isLoaded])

  useEffect(()=>{
    if(project && !project.current_code){
      const intervalId = setInterval(fetchProject, 10000);
      return ()=> clearInterval(intervalId)
    }
  },[project])

  if(loading){
    return (
      <>
      <div className="flex items-center justify-center h-screen">
        <Loader2Icon className="size-7 animate-spin text-violet-200"/>
      </div>
      </>
    )
  }
  return project ? (
    <div className='studio-shell h-screen w-full overflow-hidden text-white p-2 sm:p-3'>
      <div className='studio-panel h-full flex flex-col overflow-hidden'>
        <div className='px-3 py-2 sm:px-4 sm:py-3 border-b border-white/10 bg-[#050f28]/75 backdrop-blur-xl'>
          <div className='flex flex-col gap-3 lg:flex-row lg:items-center'>
            <div className='flex items-center gap-3 min-w-0 lg:w-[360px]'>
              <img src="/favicon.svg" alt="logo" className="h-6 w-6 cursor-pointer shrink-0" onClick={()=> navigate('/')}/>
              <div className='min-w-0'>
                <p className='text-sm font-medium capitalize truncate'>{project.name}</p>
                <p className='text-xs studio-muted'>Previewing last saved version</p>
              </div>
              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className='sm:hidden ml-auto rounded-lg border border-white/15 bg-white/8 p-1.5'
              >
                {isMenuOpen ? <XIcon className="size-5" /> : <MessageSquareIcon className="size-5"/>}
              </button>
            </div>

            <div className='hidden sm:flex items-center gap-1 studio-soft-panel px-1.5 py-1'>
              <button type="button" onClick={()=> setDevice('phone')} className={deviceButtonClass(device === 'phone')} aria-label="Switch to phone view" aria-pressed={device === 'phone'}>
                <SmartphoneIcon className="size-5"/>
              </button>
              <button type="button" onClick={()=> setDevice('tablet')} className={deviceButtonClass(device === 'tablet')} aria-label="Switch to tablet view" aria-pressed={device === 'tablet'}>
                <TabletIcon className="size-5"/>
              </button>
              <button type="button" onClick={()=> setDevice('desktop')} className={deviceButtonClass(device === 'desktop')} aria-label="Switch to desktop view" aria-pressed={device === 'desktop'}>
                <LaptopIcon className="size-5"/>
              </button>
            </div>

            <div className='flex items-center gap-2 lg:ml-auto text-xs sm:text-sm overflow-x-auto no-scrollbar'>
              <button onClick={saveProject} disabled={isSaving} className='studio-btn-ghost px-3.5 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap disabled:opacity-70'>
                {isSaving ? <Loader2Icon className="animate-spin" size={16}/> : <SaveIcon size={16}/>} Save
              </button>
              <Link target='_blank' to={`/preview/${projectId}`} className="studio-btn-ghost px-3.5 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap">
                <FullscreenIcon size={16} /> Preview
              </Link>
              <button onClick={downloadCode} className='studio-btn-primary px-3.5 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap'>
                <ArrowBigDownDashIcon size={16} /> Download
              </button>
              <button onClick={togglePublish} className='bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 px-3.5 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap shadow-[0_8px_24px_rgba(0,185,220,0.28)] transition-all'>
                {project.isPublished ? <EyeOffIcon size={16}/> : <EyeIcon size={16}/>}
                {project.isPublished ? "Unpublish" : "Publish"}
              </button>
            </div>
          </div>
        </div>

        <div className='flex-1 flex overflow-hidden p-2 sm:p-3 gap-3'>
          <Sidebar isMenuOpen={isMenuOpen} project={project} setProject={(p)=>setProject(p)} isGenerating={isGenerating} setIsGenerating={setIsGenerating}/>
          <div className='flex-1 min-w-0'>
            <ProjectPreview ref={previewRef} project={project} isGenerating={isGenerating} device={device}/>
          </div>
        </div>
      </div>
    </div>
  )
  : 
  (
    <div className='flex items-center justify-center h-screen'>
      <p className="text-2xl font-medium text-gray-200">Unable to load project!</p>
    </div>
  )
}

export default Projects
