export default function SettingsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 border border-gray-100 dark:border-navy-700">
          <h2 className="font-bold text-lg mb-4">Site Information</h2>
          <div className="space-y-4">
            <div><label className="text-sm text-gray-500 mb-1 block">Site Name</label>
              <input defaultValue="Yildiz Foundation" className="w-full border border-gray-200 dark:border-navy-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white outline-none" /></div>
            <div><label className="text-sm text-gray-500 mb-1 block">WhatsApp Number</label>
              <input defaultValue="+90 539 575 5269" className="w-full border border-gray-200 dark:border-navy-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white outline-none" /></div>
            <div><label className="text-sm text-gray-500 mb-1 block">Contact Email</label>
              <input defaultValue="info@yildizfoundation.com" className="w-full border border-gray-200 dark:border-navy-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white outline-none" /></div>
          </div>
        </div>
        <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 border border-gray-100 dark:border-navy-700">
          <h2 className="font-bold text-lg mb-4">Admin Account</h2>
          <div className="space-y-4">
            <div><label className="text-sm text-gray-500 mb-1 block">Admin Email</label>
              <input defaultValue="muhanndkadadou0@gmail.com" disabled className="w-full border border-gray-200 dark:border-navy-600 rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-navy-700 text-gray-500 outline-none" /></div>
            <div><label className="text-sm text-gray-500 mb-1 block">Role</label>
              <input defaultValue="ADMIN" disabled className="w-full border border-gray-200 dark:border-navy-600 rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-navy-700 text-gray-500 outline-none" /></div>
          </div>
        </div>
      </div>
    </div>
  )
}
