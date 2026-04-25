import React, { useMemo, useState } from 'react'
import PulseLoader from "react-spinners/PulseLoader";
import axios from 'axios'
import { FormFileField, FormTextarea } from '../Common/FormFields';
import { useAppForm } from '../../hooks/useAppForm';
import { postImageSchema } from '../../utils/formSchemas';
import { preprocessTrimmedFormData } from '../../utils/formValidation';
import { useModalData } from '../../store/hooks';
import AppModal from '../Modal/AppModal';

export function PostImages({ modalId, data }) {
  const modal = useModalData()
  const postImageUrl = `${process.env.REACT_APP_API_URL}/createpost/imagepost`
  const [loader, setLoader] = useState(false)
  const [imagecounter, setimagecounter] = useState(0)
  const payload = data || {}
  const { control, handleSubmit, watch, reset } = useAppForm({
    schema: postImageSchema,
    defaultValues: { title: '', images: [] },
  })

  const images = watch('images') || []
  const previewImages = useMemo(() => images.map((image) => URL.createObjectURL(image)), [images])

  const closeModal = () => {
    if (modalId) return modal.closeById(modalId)
    modal.close()
  }

  const decrement = () => setimagecounter((count) => (count > 0 ? count - 1 : Math.max(images.length - 1, 0)))
  const increment = () => setimagecounter((count) => (count < images.length - 1 ? count + 1 : 0))

  const onSubmit = (values) => {
    setLoader(true)
    const { title, images: selectedImages } = preprocessTrimmedFormData(values)
    const formData = new FormData()
    formData.append('title', title)
    formData.append('envname', payload.envname || '')
    selectedImages.forEach((image) => formData.append('images', image))

    axios.post(postImageUrl, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    })
      .then((res) => {
        if (res.data.statusCode === 200 && res.data.success === true) {
          payload.updatepost?.(res.data.data)
          reset()
          closeModal()
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoader(false))
  }

  return (
    <AppModal onClose={closeModal} contentClassName="max-w-[460px] px-4 py-4 sm:px-6 sm:py-16 lg:px-8">
      <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
          <h2 className="text-2xl font-bold leading-tight text-slate-600 mt-3">Post Images</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
            <div className="space-y-3">
              <FormTextarea control={control} name="title" placeholder="Description(Required)" rows={4} maxLength={500}/>
              <div className='mt-4'>
                <p className='inline-flex font-semibold text-lg'>Select</p>
                <span className="ml-4 inline-flex">
                  <FormFileField control={control} name="images" accept="image/*" multiple/>
                </span>
                {loader && <>
                  <span className='ml-2 text-slate-800'> Uploading </span>
                  <span className='ml-2'><PulseLoader color="#475569" size={6} aria-label="Loading Spinner" data-testid="loader"/></span>
                </>}
              </div>
              <div className='h-[180px] w-full bg-slate-600 mt-1 flex justify-center'>
                {previewImages.length > 0 && <>
                  <i className='absolute fa-solid fa-less-than mr-[330px] mt-[78px] text-slate-200 cursor-pointer' onClick={decrement}></i>
                  <img className='bg-slate-200 h-full w-64' src={previewImages[imagecounter]} alt=''/>
                  <i className='absolute fa-solid fa-greater-than ml-[300px] mt-[78px] text-slate-200 cursor-pointer' onClick={increment}></i>
                </>}
              </div>
              <button type="submit" disabled={loader} className="relative inline-flex w-full items-center justify-center rounded-md border border-gray-400 bg-white px-3.5 py-2.5 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-slate-600 focus:bg-gray-100 focus:text-slate-600 focus:outline-none disabled:opacity-70">
                Post
              </button>
            </div>
          </form>
      </div>
    </AppModal>
  )
}
