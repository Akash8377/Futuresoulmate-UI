import React from 'react'

const Story = () => {
    return (
        <div>
            <>
                <section className="backgroup">
                    <img src="images/backgroup.png" alt="" />
                    <div className="container">
                        <div className="wordwide-para">
                            <div className="word-wide-img">
                                <img src="images/future-shadi.svg" alt="" />
                            </div>
                            <div className="word-wide-para">
                                <div className="word-wideheading">
                                    <h2>
                                        <span>
                                            <strong>FutureSoulmates</strong>
                                        </span>{" "}
                                        Trusted Worldwide by Over 35 Million.
                                    </h2>
                                    <p>
                                       At FutureSoulMates, we focus on helping you find a relationship based on shared values, respect, and true connection. Whether you're looking for a lifelong partner or a meaningful relationship, our platform is here to guide you through every step.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="trusted-story">
                    <div className="container-fluid p-0">
                        <div className="row g-0">
                            <div
                                className="col-md-7 right-story"
                                style={{ backgroundColor: "#3E3E3E" }}
                            >
                                <div className="your-story">
                                    <h2>Your story is waiting to happen!</h2>
                                </div>
                            </div>
                            <div
                                className="col-md-5 left-story"
                                style={{ backgroundColor: "#515151" }}
                            >
                                <div className="get-started1">
                                    <h2>Get Started </h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </>

        </div>
    )
}

export default Story
