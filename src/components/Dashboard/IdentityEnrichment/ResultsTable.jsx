// ResultsTable.jsx
import React, { useState } from "react";
import axios from "axios";

const API_KEY = "ea783f0ea94fa795942d9faec19029118ad2d041be637be48d3e1153c238cdb5";

const ResultsTable = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!email && !phone) {
      alert("Please enter an email or phone number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        "https://api.peopledatalabs.com/v5/person/enrich",
        {
          params: {
            api_key: API_KEY,
            email: email || undefined,
            phone: phone || undefined,
          },
        }
      );

      if (response.data.status === 200 && response.data.data) {
        setResults([response.data]);
      } else {
        setResults([]);
        setError("No results found");
      }
    } catch (error) {
      console.error("API Error:", error);
      setError("Failed to fetch data. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const formatArray = (arr) => {
    if (!arr || arr.length === 0) return "N/A";
    return arr.join(", ");
  };

  const formatObject = (obj) => {
    if (!obj) return "N/A";
    return JSON.stringify(obj, null, 2);
  };

  const formatExperience = (experience) => {
    if (!experience || experience.length === 0) return "N/A";
    
    return experience.map((exp, index) => (
      <div key={index} className="mb-2 p-2 border rounded">
        <strong>{exp.title?.name || "N/A"}</strong> at <strong>{exp.company?.name || "N/A"}</strong><br />
        {exp.start_date && <span>From: {exp.start_date}</span>}
        {exp.end_date && <span> To: {exp.end_date}</span>}
        {exp.location_names && <div>Locations: {formatArray(exp.location_names)}</div>}
      </div>
    ));
  };

  const formatEducation = (education) => {
    if (!education || education.length === 0) return "N/A";
    
    return education.map((edu, index) => (
      <div key={index} className="mb-2 p-2 border rounded">
        <strong>{edu.school?.name || "N/A"}</strong><br />
        {edu.degrees && edu.degrees.length > 0 && <div>Degrees: {formatArray(edu.degrees)}</div>}
        {edu.majors && edu.majors.length > 0 && <div>Majors: {formatArray(edu.majors)}</div>}
        {edu.start_date && <span>From: {edu.start_date}</span>}
        {edu.end_date && <span> To: {edu.end_date}</span>}
      </div>
    ));
  };

  const formatProfiles = (profiles) => {
    if (!profiles || profiles.length === 0) return "N/A";
    
    return profiles.map((profile, index) => (
      <div key={index}>
        <strong>{profile.network}:</strong>{" "}
        <a href={`https://${profile.url}`} target="_blank" rel="noopener noreferrer">
          {profile.username || profile.url}
        </a>
      </div>
    ));
  };

  return (
    <div className="container-fluid py-4">
      {/* Search Section */}
      <div className="card shadow mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">People Data Search</h5>
        </div>
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="col-md-1 text-center">
              <span className="fw-bold">OR</span>
            </div>
            <div className="col-md-4">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                placeholder="Enter Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="col-md-3 d-grid">
              <button 
                className="btn btn-primary btn-lg" 
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {results.length > 0 && results.map((result, index) => (
        <div key={index} className="card shadow mb-4">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">Person Details</h5>
            <div className="d-flex justify-content-between mt-2">
              <span>Match Score: {result.likelihood || "N/A"}</span>
              <span>Status: {result.status}</span>
            </div>
          </div>
          <div className="card-body">
            <div className="row mb-4">
              <div className="col-md-8">
                <h4>{result.data.full_name || "N/A"}</h4>
                <p className="mb-1">
                  <strong>Location:</strong> {result.data.location_name || "N/A"}
                </p>
                <p className="mb-1">
                  <strong>Country:</strong> {result.data.location_country || "N/A"}
                </p>
                <p className="mb-1">
                  <strong>Industry:</strong> {result.data.industry || "N/A"}
                </p>
                <p className="mb-1">
                  <strong>Job Title:</strong> {result.data.job_title || "N/A"}
                </p>
              </div>
              <div className="col-md-4">
                <div className="d-grid gap-2">
                  {result.data.linkedin_url && (
                    <a 
                      href={`https://${result.data.linkedin_url}`} 
                      className="btn btn-outline-primary"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      LinkedIn Profile
                    </a>
                  )}
                  {result.data.facebook_url && (
                    <a 
                      href={`https://${result.data.facebook_url}`} 
                      className="btn btn-outline-primary"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Facebook Profile
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Detailed Information in Table Format */}
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <tbody>
                  <tr>
                    <th className="w-25">Full Name</th>
                    <td>{result.data.full_name || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>First Name</th>
                    <td>{result.data.first_name || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Last Name</th>
                    <td>{result.data.last_name || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Location</th>
                    <td>
                      {result.data.location_name || "N/A"}
                      {result.data.location_locality && `, ${result.data.location_locality}`}
                      {result.data.location_region && `, ${result.data.location_region}`}
                      {result.data.location_country && `, ${result.data.location_country}`}
                    </td>
                  </tr>
                  <tr>
                    <th>Job Information</th>
                    <td>
                      <strong>Title:</strong> {result.data.job_title || "N/A"}<br />
                      <strong>Company:</strong> {result.data.job_company_name || "N/A"}<br />
                      <strong>Role:</strong> {result.data.job_title_role || "N/A"}<br />
                      <strong>Level:</strong> {formatArray(result.data.job_title_levels)}<br />
                      <strong>Start Date:</strong> {result.data.job_start_date || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <th>Emails</th>
                    <td>
                      {result.data.emails ? "Available" : "N/A"}
                      {result.data.work_email && <div>Work Email: Available</div>}
                      {result.data.personal_emails && <div>Personal Emails: Available</div>}
                    </td>
                  </tr>
                  <tr>
                    <th>Phone Numbers</th>
                    <td>{result.data.phone_numbers ? "Available" : "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Skills</th>
                    <td>{formatArray(result.data.skills)}</td>
                  </tr>
                  <tr>
                    <th>Experience</th>
                    <td>{formatExperience(result.data.experience)}</td>
                  </tr>
                  <tr>
                    <th>Education</th>
                    <td>{formatEducation(result.data.education)}</td>
                  </tr>
                  <tr>
                    <th>Profiles</th>
                    <td>{formatProfiles(result.data.profiles)}</td>
                  </tr>
                  <tr>
                    <th>Interests</th>
                    <td>{formatArray(result.data.interests)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultsTable;