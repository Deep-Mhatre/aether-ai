import { useState } from 'react'
import { appPlans } from '../assets/assets';
import Footer from '../components/Footer';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';
import api from '@/configs/axios';

interface Plan {
    id: string;
    name: string;
    price: string;
    credits: number;
    description: string;
    features: string[];
}

const Pricing = () => {

    const { user } = useUser()
    const [plans] = useState<Plan[]>(appPlans)

    const handlePurchase = async (planId: string) => {
        try {
            if(!user) return toast('Please login to purchase credits')
            const {data} = await api.post('/api/user/purchase-credits', {planId})
            window.location.href = data.payment_link;
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message);
            console.log(error);
        }
    }
    
  return (
    <>
      <div className='w-full max-w-6xl mx-auto z-20 px-4 min-h-[80vh] pt-8 md:px-8 lg:px-10'>
        <div className='text-center mt-12'>
            <p className='text-xs font-medium uppercase tracking-[0.14em] text-[#b8ffb5]'>Plans</p>
            <h2 className='mt-3 text-4xl sm:text-5xl font-semibold tracking-tight text-[#d7ffd5]'>Choose Your Plan</h2>
            <p className='text-[#9cb39f] text-base max-w-xl mx-auto mt-3'>Start free and scale with predictable credits for creation and revisions.</p>
        </div>
        <div className='pt-12 pb-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                        {plans.map((plan, idx) => (
                            <div key={idx} className={`neo-list-card relative p-7 mx-auto w-full max-w-sm text-[#d7e5d7] hover:scale-[1.02] duration-300 
                            ${idx === 1 && 'border-[#5b8f62] shadow-[inset_0_1px_0_rgba(162,255,167,0.1),0_10px_38px_rgba(47,143,76,0.16)]'}
`}>
                                <h3 className="text-2xl font-semibold tracking-tight">{plan.name}</h3>
                                <div className="my-3">
                                    <span className="text-5xl font-semibold">{plan.price}</span>
                                    <span className="text-[#9cb39f] text-sm"> / {plan.credits} credits</span>
                                </div>

                                <p className="text-[#9cb39f] mb-6 text-sm">{plan.description}</p>

                                <ul className="space-y-1.5 mb-6 text-sm">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center">
                                            <svg className="h-5 w-5 text-[#9cff9a] mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-[#a9bca9]">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => handlePurchase(plan.id)} className="w-full neo-btn-primary py-2.5 px-4 text-sm active:scale-95">
                                    Buy Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <p className='mx-auto text-center text-sm max-w-md mt-8 text-[#90a691] font-light'>Project <span className='text-[#d7ffd5]'>creation/revision</span> consumes <span className='text-[#d7ffd5]'>5 credits</span>.</p>
      </div>
      <Footer />
    </>
  )
}

export default Pricing
