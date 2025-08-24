import React, {useEffect, useRef} from 'react'
import Header from '../../components/Header/Header'
import Banner from './Banner'
import SearchByCity from './SearchByCity'
import SucessStory from './SucessStory'
import SatisfiedCustomer from './SatisfiedCustomer'
import Story from './Story'
import Footer from '../../components/Footer/Footer'
import { useLocation } from 'react-router-dom';
import { scrollToComponent } from '../../utils/helpers'

const Home = () => {
  const searchByCityRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.signUp && searchByCityRef.current) {
      scrollToComponent('searchByCity', 220);
    }
  }, [location.state?.signUp]);

  return (
    <>
      <Header/>
      <Banner/>
      <div id="searchByCity" ref={searchByCityRef}>
        <SearchByCity/>
      </div>
      <SucessStory/>
      <SatisfiedCustomer/>
      <Story/>
      <Footer/>
    </>
  )
}

export default Home



// import React, {useEffect} from 'react'
// import Header from '../../components/Header/Header'
// import Banner from './Banner'
// import SearchByCity from './SearchByCity'
// import SucessStory from './SucessStory'
// import SatisfiedCustomer from './SatisfiedCustomer'
// import Story from './Story'
// import Footer from '../../components/Footer/Footer'
// import { useLocation } from 'react-router-dom';
// import { scrollToPercent, scrollToComponent } from '../../utils/helpers'
// const Home = () => {
//  const location = useLocation();
//  useEffect(()=>{
//    if(location.state?.signUp){
//       scrollToPercent(23)
//    }
//  },[location.state?.signUp])
//   return (
//     <>
//       <Header/>
//       <Banner/>
//       <SearchByCity/>
//       <SucessStory/>
//       <SatisfiedCustomer/>
//       <Story/>
//       <Footer/>

//     </>
//   )
// }

// export default Home
