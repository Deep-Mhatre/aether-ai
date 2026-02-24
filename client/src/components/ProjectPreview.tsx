import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { Project } from '../types';
import { iframeScript } from '../assets/assets';
import EditorPanel from './EditorPanel';
import LoaderSteps from './LoaderSteps';

interface ProjectPreviewProps {
    project: Project;
    isGenerating: boolean;
    device?: 'phone' | 'tablet' | 'desktop';
    showEditorPanel?: boolean;
}

export interface ProjectPreviewRef {
    getCode: ()=> string | undefined;
}

const ProjectPreview = forwardRef<ProjectPreviewRef, ProjectPreviewProps>(({project, isGenerating, device = 'desktop', showEditorPanel = true}, ref) => {

    const iframeRef = useRef<HTMLIFrameElement>(null)
    const [selectedElement, setSelectedElement] = useState<any>(null)

    const resolutions = {
        phone: 'w-[390px]',
        tablet: 'w-[760px]',
        desktop: 'w-full'
    }

    useImperativeHandle(ref, ()=>({
        getCode: ()=>{
            const doc = iframeRef.current?.contentDocument;
            if(!doc) return undefined;

             // 1. Remove our selection class / attributes / outline from all elements
             doc.querySelectorAll('.ai-selected-element,[data-ai-selected]').forEach((el)=>{
                el.classList.remove('ai-selected-element');
                el.removeAttribute('data-ai-selected');
                (el as HTMLElement).style.outline = '';
             })

             // 2. Remove injected style + script from the document
             const previewStyle = doc.getElementById('ai-preview-style');
             if(previewStyle) previewStyle.remove();

             const previewScript = doc.getElementById('ai-preview-script');
             if (previewScript) previewScript.remove()

            // 3. Serialize clean HTML
            const html = doc.documentElement.outerHTML;
            return html;
        }
    }))

    useEffect(()=>{
        const handleMessage = (event: MessageEvent)=>{
            if(event.data.type === 'ELEMENT_SELECTED'){
                setSelectedElement(event.data.payload);
            }else if(event.data.type === 'CLEAR_SELECTION'){
                setSelectedElement(null)
            }
        }
        window.addEventListener('message', handleMessage);
        return ()=> window.removeEventListener('message', handleMessage)
    },[])

    const handleUpdate = (updates: any)=>{
        if(iframeRef.current?.contentWindow){
            iframeRef.current.contentWindow.postMessage({
                type: 'UPDATE_ELEMENT',
                payload: updates
            }, '*')
        }
    }

    const injectPreview = (html: string)=>{
        if(!html) return '';
        if(!showEditorPanel) return html

        if(html.includes('</body>')){
            return html.replace('</body>', iframeScript + '</body>')
        }else{
            return html + iframeScript;
        }
    }

  return (
    <div className='relative h-full flex-1 rounded-2xl border border-white/10 bg-[#091833] overflow-hidden'>
      <div className='pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cyan-400/10 to-transparent z-0' />
      <div className='h-full p-3 sm:p-4 relative z-10'>
        {project.current_code ? (
          <>
          <div className='h-full rounded-xl border border-white/10 bg-[#050d1e] p-2 sm:p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'>
            <iframe 
              ref={iframeRef}
              srcDoc={injectPreview(project.current_code)}
              sandbox="allow-scripts"
              className={`h-full max-sm:w-full ${resolutions[device]} mx-auto rounded-lg border border-white/15 bg-white transition-all duration-300 ease-in-out shadow-[0_24px_60px_rgba(0,0,0,0.45)]`}
            />
          </div>
          {showEditorPanel && selectedElement && (
              <EditorPanel selectedElement={selectedElement}
              onUpdate={handleUpdate} onClose={()=>{
                  setSelectedElement(null);
                  if(iframeRef.current?.contentWindow){
                      iframeRef.current.contentWindow.postMessage({type: 'CLEAR_SELECTION_REQUEST'}, '*')
                  }
              }}/>
          )}
          </>
        ): isGenerating && (
          <LoaderSteps />
        )}
      </div>
    </div>
  )
})

export default ProjectPreview
