import React from 'react'
import Myphoto from '../myphototab/Myphoto'

const PhotosTab = ({onChangeTab}) => {
  return (
    <div className='container mt-3'>
      <Myphoto onChangeTab={onChangeTab}/>
    </div>
  )
}

export default PhotosTab
