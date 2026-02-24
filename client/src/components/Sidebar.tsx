import React, { useEffect, useRef, useState } from 'react'
import type { Message, Project, Version } from '../types';
import { BotIcon, EyeIcon, Loader2Icon, SendIcon, UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/configs/axios';
import { toast } from 'sonner';

interface SidebarProps {
    isMenuOpen: boolean;
    project: Project,
    setProject: (project: Project)=> void;
    isGenerating: boolean;
    setIsGenerating: (isGenerating: boolean)=> void;
}

const Sidebar = ({isMenuOpen, project, setProject, isGenerating, setIsGenerating} : SidebarProps) => {

    const messageRef = useRef<HTMLDivElement>(null)
    const [input, setInput] = useState('')

    const fetchProject = async () => {
        try {
            const { data } = await api.get(`/api/user/project/${project.id}`)
            setProject(data.project)
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message);
            console.log(error);
        }
    }

    const handleRollback = async (versionId: string) => {
        try {
            const confirm = window.confirm('Are you sure you want to rollback to this version?')
            if(!confirm) return;
            setIsGenerating(true)
            const { data } = await api.get(`/api/project/rollback/${project.id}/${versionId}`);
            const { data: data2 } = await api.get(`/api/user/project/${project.id}`);
            toast.success(data.message)
            setProject(data2.project)
            setIsGenerating(false)

        } catch (error: any) {
            setIsGenerating(false)
            toast.error(error?.response?.data?.message || error.message);
            console.log(error);
        }
    }

    const handleRevisions = async (e: React.FormEvent) => {
        e.preventDefault()
        let interval: number | undefined;
        try {
            setIsGenerating(true);
            interval = setInterval(()=>{
                fetchProject();
            },10000)
            const {data} = await api.post(`/api/project/revision/${project.id}`, {message: input})
            fetchProject();
            toast.success(data.message)
            setInput('')
            clearInterval(interval)
            setIsGenerating(false);
        } catch (error: any) {
            setIsGenerating(false);
            toast.error(error?.response?.data?.message || error.message);
            console.log(error);
            clearInterval(interval)
        }
    }

    useEffect(()=>{
        if(messageRef.current){
            messageRef.current.scrollIntoView({behavior: 'smooth'})
        }
    },[project.conversation.length, isGenerating])

  return (
    <div className={`h-full sm:w-[340px] sm:shrink-0 rounded-2xl border border-white/10 bg-[#07152f]/85 backdrop-blur-xl transition-all duration-300 ${isMenuOpen ? 'max-sm:w-0 max-sm:opacity-0 max-sm:overflow-hidden' : 'w-full'}`}>
      <div className='flex flex-col h-full'>
        {/* Messages container */}
        <div className='flex-1 overflow-y-auto no-scrollbar px-3 py-3 flex flex-col gap-3'>
            {[...project.conversation, ...project.versions]
            .sort((a,b)=> new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).map((message)=>{
                const isMessage = 'content' in message;

                if(isMessage){
                    const msg = message as Message;
                    const isUser = msg.role === 'user';
                    return (
                        <div key={msg.id} className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
                            {!isUser && (
                                <div className='w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-[0_6px_18px_rgba(41,172,255,0.4)]'>
                                    <BotIcon className='size-5 text-white'/>
                                </div>
                            )}
                            <div className={`max-w-[80%] p-2.5 px-4 rounded-2xl shadow-sm text-sm mt-2 leading-relaxed border ${isUser ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-tr-none border-blue-300/30" : "rounded-tl-none bg-white/8 text-slate-100 border-white/10"}`}>
                                {msg.content}
                            </div>
                            {isUser && (
                                <div className='w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/15'>
                                    <UserIcon className='size-5 text-gray-200'/>
                                </div>
                            )}
                        </div>
                    )
                }else{
                    const ver = message as Version;
                    return (
                        <div key={ver.id} className='w-[88%] mx-auto my-1 p-3 rounded-xl bg-white/8 border border-white/10 text-gray-100 shadow flex flex-col gap-2'>
                            <div className='text-xs font-medium text-slate-200'>
                                code updated <br /> 
                                <span className='text-slate-400 text-xs font-normal'>
                                    {new Date(ver.timestamp).toLocaleString()}
                                </span>
                            </div>
                            <div className='flex items-center justify-between'>
                                {project.current_version_index === ver.id ? (
                                    <button className='px-3 py-1 rounded-md text-xs bg-white/12 border border-white/15'>Current version</button>
                                ): (
                                    <button onClick={()=> handleRollback(ver.id)} className='px-3 py-1 rounded-md text-xs bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white'>Roll back</button>
                                )}
                                <Link target='_blank' to={`/preview/${project.id}/${ver.id}`} aria-label={`Preview version ${ver.id}`} title={`Preview version ${ver.id}`}>
                                <EyeIcon className='size-7 p-1.5 bg-white/10 border border-white/15 hover:bg-white/18 transition-colors rounded-lg'/>
                                </Link>
                            </div>
                        </div>
                    )
                }
            })}
            {isGenerating && (
                <div className='flex items-start gap-3 justify-start'>
                    <div className='w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-[0_6px_18px_rgba(41,172,255,0.4)]'>
                        <BotIcon className='size-5 text-white'/>
                    </div>
                    {/* three dot loader */}
                    <div className='flex gap-1.5 h-full items-end'>
                        <span className='size-2 rounded-full animate-bounce bg-gray-600' style={{animationDelay : '0s'}}/>
                        <span className='size-2 rounded-full animate-bounce bg-gray-600' style={{animationDelay : '0.2s'}}/>
                        <span className='size-2 rounded-full animate-bounce bg-gray-600' style={{animationDelay : '0.4s'}}/>
                    </div>
                </div>
            )

            }
            <div ref={messageRef}/>
        </div>
        {/* Input area */}
        <form onSubmit={handleRevisions} className='m-3 relative'>
            <div className='flex items-center gap-2'>
                <textarea onChange={(e)=>setInput(e.target.value)} value={input} rows={4} placeholder='Describe your website or request changes...' className='flex-1 p-3 rounded-xl resize-none text-sm outline-none border border-white/12 focus:border-blue-400 bg-[#0b1e40] text-gray-100 placeholder-gray-400 transition-all' disabled={isGenerating}/>
                <button disabled={isGenerating || !input.trim()} className='absolute bottom-2.5 right-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white transition-colors disabled:opacity-60 shadow-[0_8px_18px_rgba(67,116,255,0.4)]'>
                    {isGenerating 
                    ? <Loader2Icon className='size-7 p-1.5 animate-spin text-white'/>
                : <SendIcon className='size-7 p-1.5 text-white'/>}
                </button>
            </div>
        </form>
      </div>
    </div>
  )
}

export default Sidebar
