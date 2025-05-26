import React, { useState } from 'react';
import StacksService from '../services/StacksService';

const SubmitBidForm = ({ jobId, jobBudget, onBidSubmitted }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [proposal, setProposal] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Create proposal data object
      const proposalData = {
        jobId,
        bidAmount: parseInt(bidAmount),
        proposal,
        timeframe,
        createdAt: new Date().toISOString()
      };
      
      // Submit bid via StacksService
      await StacksService.submitBid(
        jobId, 
        parseInt(bidAmount), 
        proposalData
      );
      
      // Notify parent component
      if (onBidSubmitted) onBidSubmitted();
      
      // Reset form
      setBidAmount('');
      setProposal('');
      setTimeframe('');
    } catch (error) {
      console.error('Error submitting bid:', error);
      alert('Failed to submit bid. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="submit-bid-form">
      <h3>Submit a Proposal</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Bid Amount (STX)</label>
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            max={jobBudget}
            required
          />
          <small>Client's budget: {jobBudget} STX</small>
        </div>
        
        <div className="form-group">
          <label>Proposal</label>
          <textarea
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
            placeholder="Describe how you'll approach this project..."
            rows={4}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Estimated Timeframe (days)</label>
          <input
            type="number"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Bid'}
        </button>
      </form>
    </div>
  );
};

export default SubmitBidForm;
