import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HobbiesInterests = () => {
  // State to track selected hobbies
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const navigate = useNavigate();

  // Hobbies data
  const hobbyCategories = [
    {
      name: 'Creative',
      hobbies: [
        'Writing', 'Cooking', 'Singing', 'Photography', 
        'Playing instruments', 'Painting', 'DIY crafts', 
        'Dancing', 'Acting', 'Poetry', 'Gardening', 
        'Blogging', 'Content creation', 'Designing', 'Doodling'
      ]
    },
    {
      name: 'Fun',
      hobbies: [
        'Movies', 'Music', 'Travelling', 'Reading', 
        'Sports', 'Social media', 'Gaming', 
        'Binge-watching', 'Biking', 'Clubbing', 
        'Shopping', 'Theater & Events', 'Anime', 'Stand ups'
      ]
    },
    {
      name: 'Fitness',
      hobbies: [
        'Running', 'Cycling', 'Yoga & Meditation', 'Walking', 
        'Working Out', 'Trekking', 'Areobics/Zumba', 
        'Swimming',
      ]
    },
    {
      name: 'Other Intrests',
      hobbies: [
        'Pets', 'Foodie', 'Vegan', 'News & Politics', 
        'Social Service', 'Entrepreneurship', 'Home Decore', 
        'Investment', 'Fashion & Beauty',
      ]
    }
  ];

useEffect(() => {
  const otherData = JSON.parse(sessionStorage.getItem("otherData"));
  if (otherData?.hobbies) {
    setSelectedHobbies(otherData.hobbies);
  }
}, []);


  // Toggle hobby selection
  const toggleHobby = (hobby) => {
    setSelectedHobbies(prev => {
      if (prev.includes(hobby)) {
        return prev.filter(item => item !== hobby);
      } else {
        if (prev.length < 5) {
          return [...prev, hobby];
        }
        return prev; // Return previous state if limit reached
      }
    });
  };

  // Handle continue button click
  const handleContinue = () => {
    const otherData = {
    hobbies: selectedHobbies
    };
    sessionStorage.setItem("otherData", JSON.stringify(otherData))
    navigate("/verify-profile");
  };

  return (
    <>
      <div className="wrapper">
        <h1>Now let's add his hobbies & interests</h1>
        <p className="subtitle">This will help find better matches</p>

        {hobbyCategories.map((category) => (
          <section className="card" key={category.name}>
            <h3>{category.name}</h3>
            <div className="tags">
              {category.hobbies.map((hobby) => (
                <span 
                  key={hobby}
                  className={`tag ${selectedHobbies.includes(hobby) ? 'selected' : ''}`}
                  onClick={() => toggleHobby(hobby)}
                >
                  {hobby}
                </span>
              ))}
            </div>
          </section>
        ))}

        <button 
          className="continue-btn" 
          onClick={handleContinue}
          disabled={selectedHobbies.length === 0}
        >
          Continue {`(${selectedHobbies.length}/5)`}
        </button>
      </div>
    </>
  );
};

export default HobbiesInterests;