'use client'
// import useSideBar from '../../context/use-sidebar'
import React from 'react'
import { Switch } from '../ui/switch'
import { Loader } from '../loading'
const BreadCrumb = () => {

  // const {chatRoom,onActivateRrealtime,page,realtime,loading}=useSideBar()
  return (
    <div
    className='flex flex-col'>
        <div className="flex gap-5 items-center">
            <h2 className="text-3xl font-bold capitalize">
                {/* {page} */}
            </h2>
            {/* {page === 'conversation' && chatRoom && (
              <Loader
              loading={loading}
              className="p-0 inline"
              >
                <Switch
                defaultChecked={realtime}
                onClick={(e)=>onActivateRrealtime(e)}
                className="data-[state=checked]:bg-purple data-[state=unchecked]bg-gray-300"
                />
              </Loader>
            )} */}
        </div>

    </div>
  )
}

export default BreadCrumb
