import React, { useState } from 'react'
import PulseLoader from "react-spinners/PulseLoader";
import axios from 'axios'
import { useAppForm } from '../../hooks/useAppForm';
import { deleteAvatarSchema } from '../../utils/formSchemas';
import { useModalData } from '../../store/hooks';
import AppModal from '../Modal/AppModal';

export default function DeleteImage({ modalId, data }) {
  const modal = useModalData()
  const deleteAvatarUrl = `${process.env.REACT_APP_API_URL}/users/deleteavatar`
  const [loader, setLoader] = useState(false)
  const payload = data || {}
  const { handleSubmit } = useAppForm({
    schema: deleteAvatarSchema,
    defaultValues: {},
  })

  const closeModal = () => {
    if (modalId) return modal.closeById(modalId)
    modal.close()
  }

  const onSubmit = () => {
    setLoader(true)
    axios.patch(deleteAvatarUrl, null, { withCredentials: true })
      .then((res) => {
        if (res.data.statusCode === 200 && res.data.success === true) {
          payload.onComplete?.()
          closeModal()
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoader(false))
  }

  return (
    <AppModal onClose={closeModal} contentClassName="max-w-[460px] px-4 py-3 sm:px-6 sm:py-16 lg:px-8">
      <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md min-h-[200px]">
          <div className='flex justify'>
            {loader && <>
              <p className='absolute text-slate-600 font-semibold'>Deleting</p>
              <span className='absolute ml-[70px]'><PulseLoader color="#475569" size={6} aria-label="Loading Spinner" data-testid="loader"/></span>
            </>}
          </div>
          <h2 className="w-full text-2xl font-bold leading-tight text-slate-600 mt-12">Sure you want to delete the image?</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-2">
            <div className="space-y-3">
              <button type="submit" disabled={loader} className="w-full items-center justify-center rounded-md border border-gray-400 bg-white px-3.5 py-2.5 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-slate-600 focus:bg-gray-100 focus:text-slate-600 focus:outline-none disabled:opacity-70">
                Delete  <i className='fa-regular fa-trash-can ml-3'></i>
              </button>
            </div>
          </form>
      </div>
    </AppModal>
  )
}
