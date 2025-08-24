// HeroSection.jsx
import React from 'react';

const HeroSection = () => (
  <section className="hero">
    <div className="hero-inner">
      <div className="hero-left">
        <h1>Incredible! 15 Matches Found - Select Your Result Now <i className="fa fa-download" aria-hidden="true"></i></h1>
        <div className="hero-sub">
          <span>Not the right person?</span>
          <a href="#" className="modify">Modify Search</a>
        </div>
      </div>
      <aside className="stats">
        {[
          { value: "Millions", label: "Records Searched" },
          { value: "15 Results", label: "Found for Your Search" },
          { value: "14 Matches", label: "Verified Name Matches" },
          { value: "31-53 yrs old", label: "Age Range Found" }
        ].map((stat, index) => (
          <div key={index} className="stat">
            <b>{stat.value}</b><span>{stat.label}</span>
          </div>
        ))}
      </aside>
    </div>
  </section>
);

export default HeroSection;