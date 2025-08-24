import React from 'react'

const SatisfiedCustomer = () => {
    return (
        <section className="satiesfied-customer">
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <div className="number-statiesfied">
                            <div className="satiesfied-icon">
                                <img src="images/phone-icon.svg" alt="phone-icon" />
                            </div>
                            <div className="satiesfied-para">
                                <h2>100%</h2>
                                <p>Mobile-verified profiles</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="number-statiesfied">
                            <div className="satiesfied-icon">
                                <img src="images/hand-icon.svg" alt="phone-icon" />
                            </div>
                            <div className="satiesfied-para">
                                <h2>4 Crores+</h2>
                                <p>Customers served</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="number-statiesfied">
                            <div className="satiesfied-icon">
                                <img src="images/handshake.svg" alt="phone-icon" />
                            </div>
                            <div className="satiesfied-para">
                                <h2>23 Years</h2>
                                <p>of successful matchmaking</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default SatisfiedCustomer
