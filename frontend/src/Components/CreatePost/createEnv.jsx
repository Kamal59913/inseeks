import React, { useMemo, useState } from 'react'
import PulseLoader from "react-spinners/PulseLoader";
import axios from 'axios'
import { FormField, FormFileField, FormTextarea } from '../Common/FormFields';
import { useAppForm } from '../../hooks/useAppForm';
import { createEnvSchema } from '../../utils/formSchemas';
import { preprocessTrimmedFormData } from '../../utils/formValidation';
import { useModalData } from '../../store/hooks';
import AppModal from '../Modal/AppModal';

export function CreateEnv({ modalId, data }) {
  const modal = useModalData()
  const createEnvUrl = `${process.env.REACT_APP_API_URL}/env/create-env`
  const [loader, setLoader] = useState(false)
  const payload = data || {}
  const { control, handleSubmit, watch, reset } = useAppForm({
    schema: createEnvSchema,
    defaultValues: { envName: '', EnvDescription: '', envCoverImage: null },
  })

  const envCoverImage = watch('envCoverImage')
  const previewUrl = useMemo(() => (envCoverImage ? URL.createObjectURL(envCoverImage) : null), [envCoverImage])

  const closeModal = () => {
    if (modalId) return modal.closeById(modalId)
    modal.close()
  }

  const onSubmit = (values) => {
    setLoader(true)
    const { envName, EnvDescription, envCoverImage: coverImage } = preprocessTrimmedFormData(values)
    const formData = new FormData()
    formData.append('envName', envName)
    formData.append('EnvDescription', EnvDescription)
    formData.append('envCoverImage', coverImage)

    axios.post(createEnvUrl, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    })
      .then((res) => {
        if (res.data.statusCode === 200 && res.data.success === true) {
          payload.onCreated?.()
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
          <h2 className="text-2xl font-bold leading-tight text-slate-600 mt-3">Create the community</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-2">
            <div className="space-y-3">
              <FormField control={control} name="envName" placeholder="Environment Name" maxLength={80}/>
              <FormTextarea control={control} name="EnvDescription" placeholder="Environment Description(Required)" rows={4} maxLength={500}/>
              <div className='mt-3'>
                <p className='inline-flex font-semibold text-lg'>Add</p>
                <span className="ml-4 inline-flex">
                  <FormFileField control={control} name="envCoverImage" accept="image/*"/>
                </span>
                {loader && <>
                  <span className='ml-2 text-slate-800'> Uploading </span>
                  <span className='ml-2'><PulseLoader color="#475569" size={6} aria-label="Loading Spinner" data-testid="loader"/></span>
                </>}
              </div>
              <div className='h-[180px] w-full bg-slate-600 mt-1 flex justify-center'>
                {previewUrl && <img className='bg-slate-200 h-full w-64' src={previewUrl} alt=''/>}
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
