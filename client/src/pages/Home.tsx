import api from '@/configs/axios'
import { useUser } from '@clerk/clerk-react'
import { BotIcon, CalendarIcon, DatabaseIcon, Loader2Icon, SparklesIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const featureCards = [
  {
    title: 'Instant Website Generation',
    subtitle: 'Turn one prompt into a complete responsive site',
    icon: CalendarIcon,
  },
  {
    title: 'Smart AI Revisions',
    subtitle: 'Refine sections, copy, and layout in seconds',
    icon: SparklesIcon,
  },
  {
    title: 'Version History and Rollback',
    subtitle: 'Track changes and restore any previous version',
    icon: DatabaseIcon,
  },
  {
    title: 'Publish and Share',
    subtitle: 'Push live and share public project previews instantly',
    icon: BotIcon,
  },
]

const Home = () => {
  const { user, isLoaded } = useUser()
  const navigate = useNavigate()

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!isLoaded) {
        return toast.error('Loading your session, please try again in a moment')
      }
      if (!user) {
        return toast.error('Please sign in to create a project')
      }
      if (!input.trim()) {
        return toast.error('Please enter a message')
      }
      setLoading(true)
      const { data } = await api.post('/api/user/project', { initial_prompt: input })
      
      if (!data || !data.projectId || typeof data.projectId !== 'string') {
        console.error('Invalid API response:', data)
        toast.error('Failed to create project. Please try again.')
        return
      }
      
      navigate(`/projects/${data.projectId}`)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message)
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className='relative min-h-[calc(100vh-76px)] overflow-hidden neo-dot-bg px-4 pb-14 pt-6 md:px-10 lg:px-14'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(121,255,147,0.06),transparent_40%),radial-gradient(circle_at_90%_82%,rgba(121,255,147,0.05),transparent_35%)]' />

      <div className='relative mx-auto max-w-7xl rounded-[30px] border border-[#1b2a1f] bg-[#060b07]/86 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl md:p-6'>
        <div className='grid gap-10 lg:grid-cols-[1.12fr_1fr] lg:items-start'>
          <div className='px-2 pt-5'>
            <p className='text-sm font-medium uppercase tracking-[0.14em] text-[#b8ffb5]'>// built for creators and teams</p>
            <h1 className='mt-5 max-w-xl text-5xl font-semibold leading-[0.95] tracking-tight text-[#d7ffd5] sm:text-6xl md:text-7xl'>
              AETHER AI
              <br />
              Website Studio.
            </h1>
            <p className='mt-6 max-w-xl text-lg text-[#9cb39f]'>
              AETHER AI helps you generate, edit, and publish modern websites from simple prompts with full control over revisions and versions.
            </p>

            <div className='mt-8 flex flex-wrap gap-3'>
              <button onClick={() => navigate('/pricing')} className='neo-btn-primary'>See Our Plans</button>
              <button onClick={() => toast.info('Contact feature coming soon!')} className='neo-btn-outline'>Get in Touch</button>
            </div>

            <form
              onSubmit={onSubmitHandler}
              className='neo-panel mt-7 max-w-2xl p-3'
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={4}
                placeholder='Describe your website idea (e.g. conversion-first SaaS landing page with pricing and testimonials)'
                className='w-full resize-none rounded-xl border border-[#25382a] bg-[#0b130d] p-3 text-sm text-[#ddffdc] outline-none placeholder:text-[#7d927f] focus:border-[#4a7e52]'
                required
              />
              <div className='mt-3 flex items-center justify-between gap-3'>
                <p className='text-xs text-[#7c8f7f]'>Prompt once, then iterate in the studio.</p>
                <button
                  disabled={loading}
                  className={`neo-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {!loading ? 'Create with AI' : (
                    <>
                      Creating
                      <Loader2Icon className='size-4 animate-spin' />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className='mt-12'>
              <p className='text-sm uppercase tracking-[0.12em] text-[#8ba28d]'>Used for:</p>
              <div className='mt-5 flex flex-wrap items-center gap-8 text-3xl font-semibold tracking-tight text-[#4f6051]'>
                <span>Landing Pages</span>
                <span>Portfolios</span>
                <span>SaaS Sites</span>
                <span>Storefronts</span>
              </div>
            </div>
          </div>

          <div className='pt-3'>
            <div className='space-y-4'>
              {featureCards.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className='neo-list-card flex items-center gap-4 p-4 sm:p-5'>
                    <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#2d4431] bg-[#111913] text-[#b9ffb6]'>
                      <Icon className='size-5' />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <h3 className='truncate text-xl font-medium text-[#d8e8d9]'>{item.title}</h3>
                      <p className='truncate text-base text-[#88a089]'>{item.subtitle}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home
