import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StacksService from '../services/StacksService';

const CreateProfile = () => {
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState('client');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Create profile data object
      const profileData = {
        username,
        userType,
        skills: userType === 'freelancer' ? skills.split(',').map(s => s.trim()) : [],
        experience: userType === 'freelancer' ? experience : '',
        createdAt: new Date().toISOString()
      };
      
      // Save profile data to Gaia
      const profileDataUrl = await StacksService.saveToGaia('profile.json', profileData);
      
      // Register user on-chain
      await StacksService.registerUser(username, userType, profileDataUrl);
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('Failed to create profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-profile">
      <h2>Create Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>I am a:</label>
          <select 
            value={userType} 
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
          </select>
        </div>
        
        {userType === 'freelancer' && (
          <>
            <div className="form-group">
              <label>Skills (comma-separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g., Web Development, Design, Writing"
              />
            </div>
            
            <div className="form-group">
              <label>Experience</label>
              <textarea
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Describe your experience..."
                rows={4}
              />
            </div>
          </>
        )}
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Profile'}
        </button>
      </form>
    </div>
  );
};

export default CreateProfile;