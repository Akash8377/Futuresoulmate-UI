import React from 'react'
import { scrollToComponent } from '../../utils/helpers'
import { useNavigate } from 'react-router-dom'
const Banner = () => {
    const navigate = useNavigate()
    return (
        <section className="banner">
            <div className="banner-blk">
                <img src="/images/banner.jpg" alt="" />
                <div className="container">
                    <div className="content-blk">
                        <h2>
                            The <br />
                            Elite Way <br />
                            to Find Love
                        </h2>
                        <button className="btn btn-filled" type="button" onClick={()=>scrollToComponent('searchByCity', 220)}>
                            Find Your Match
                        </button>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default Banner
