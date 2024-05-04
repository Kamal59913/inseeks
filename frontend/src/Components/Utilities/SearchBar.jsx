import React from 'react'

export default function SearchBar() {
  return (
    <form class="flex items-center mx-auto w-[700px] ">   
    <label for="simple-search" class="sr-only">Search</label>
    <div class="relative w-full">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <i className='fa-solid fa-search ga444'></i>
        </div>
        <input type="text" id="simple-search" class="bg-[#131d35] text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Search branch name..." required />
    </div>
    <button type="submit" class="h-[38px] w-[60px] ms-2 text-sm font-medium text-black rounded-sm focus:ring-4 focus:outline-none bg-slate-100">
      Search
    </button>
</form>
    )
}
