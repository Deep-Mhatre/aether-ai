import { AccountSettingsCards, ChangePasswordCard, DeleteAccountCard  } from "@daveyplate/better-auth-ui"

const Settings = () => {
  return (
 
    <div className="w-full p-4 flex justify-center items-center min-h-[90vh] flex-col gap-6 py-12">
      <AccountSettingsCards 
      classNames={{
        card: {
            base: 'bg-[#071a46]/70 border border-blue-200/20 max-w-xl mx-auto text-blue-50',
            footer: 'bg-[#061438]/70 border-t border-blue-200/15'
        }
      }}/>
      <div className="w-full">
            <ChangePasswordCard classNames={{
                base: 'bg-[#071a46]/70 border border-blue-200/20 max-w-xl mx-auto text-blue-50',
                footer: 'bg-[#061438]/70 border-t border-blue-200/15'
            }}/>
        </div>
        <div className="w-full">
            <DeleteAccountCard classNames={{
                base: 'bg-[#071a46]/70 border border-blue-200/20 max-w-xl mx-auto text-blue-50'
            }}/>
        </div>
      </div>     
  )
}

export default Settings
