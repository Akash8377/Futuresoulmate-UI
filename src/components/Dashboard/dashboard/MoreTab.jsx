import React, {useState, useEffect} from 'react'
import Notification from './Notification'
import { useSelector } from "react-redux";
import axios from 'axios';
import config from '../../../config';

const MoreTab = ({onChangeTab}) => {

  return (
    <div className='container mt-3'>
     <Notification onChangeTab={onChangeTab}/>
    </div>
  )
}

export default MoreTab
