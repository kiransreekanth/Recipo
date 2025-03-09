import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './support.css';

const Support = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I upload a recipe?",
      answer: "To upload a recipe, navigate to your profile page after logging in. Click on the 'Upload Recipe' button and fill out all the required fields including ingredients, instructions, cooking time, and an optional image."
    },
    {
      question: "Can I edit my recipes after uploading?",
      answer: "Yes! You can edit your recipes at any time. Simply go to your profile, find the recipe you want to edit, and click the 'Edit' button."
    },
    {
      question: "How do I save recipes from other users?",
      answer: "When viewing a recipe you like, click the 'Save' button located near the recipe title. All saved recipes can be found in your 'Saved Recipes' section."
    },
    {
      question: "What image formats are supported for recipe uploads?",
      answer: "We support JPG, PNG, and WEBP image formats. Maximum file size is 5MB."
    },
    {
      question: "Is there a limit to how many recipes I can upload?",
      answer: "Currently, free accounts can upload up to 25 recipes. Premium members have unlimited recipe uploads."
    }
  ];

  return (
    <div className="support-container">
      <h1 className="support-title">Support Center</h1>
      
      <div className="support-tabs">
        <button 
          className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => handleTabChange('upload')}
        >
          Upload Instructions
        </button>
        <button 
          className={`tab-button ${activeTab === 'faq' ? 'active' : ''}`}
          onClick={() => handleTabChange('faq')}
        >
          FAQs
        </button>
        <button 
          className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => handleTabChange('contact')}
        >
          Contact Us
        </button>
      </div>
      
      <div className="support-content">
        {activeTab === 'upload' && (
          <div className="upload-instructions">
            <h2>How to Upload Your Recipe</h2>
            
            <div className="instruction-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Create an account or login</h3>
                <p>You must be logged in to upload recipes. If you don't have an account yet, please <Link to="/login">register here</Link>.</p>
              </div>
            </div>
            
            <div className="instruction-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Navigate to your profile</h3>
                <p>After logging in, click on your username at the top of the page to access your profile dashboard.</p>
              </div>
            </div>
            
            <div className="instruction-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Click "Upload Recipe"</h3>
                <p>Look for the "Upload Recipe" button on your profile dashboard and click it.</p>
              </div>
            </div>
            
            <div className="instruction-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Fill in recipe details</h3>
                <p>Complete all required fields:</p>
                <ul>
                  <li>Recipe title</li>
                  <li>Ingredients (with measurements)</li>
                  <li>Step-by-step instructions</li>
                  <li>Cooking time</li>
                  <li>Serving size</li>
                  <li>Recipe category/tags</li>
                </ul>
              </div>
            </div>
            
            <div className="instruction-step">
              <div className="step-number">5</div>
              <div className="step-content">
                <h3>Add a photo (optional)</h3>
                <p>Upload a photo of your finished recipe. This makes your recipe more appealing to others. Supported formats: JPG, PNG, WEBP. Maximum size: 5MB.</p>
              </div>
            </div>
            
            <div className="instruction-step">
              <div className="step-number">6</div>
              <div className="step-content">
                <h3>Review and submit</h3>
                <p>Review all information for accuracy, then click "Submit Recipe" to publish your creation!</p>
              </div>
            </div>

            <div className="recipe-tips">
              <h3>Tips for Great Recipe Submissions:</h3>
              <ul>
                <li>Be precise with measurements and ingredients</li>
                <li>Write clear, step-by-step instructions</li>
                <li>Include prep time and cooking time separately</li>
                <li>Mention any special equipment needed</li>
                <li>Add notes for possible ingredient substitutions</li>
                <li>Use high-quality photos with good lighting</li>
              </ul>
            </div>
          </div>
        )}
        
        {activeTab === 'faq' && (
          <div className="faq-section">
            <h2>Frequently Asked Questions</h2>
            
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div className="faq-item" key={index}>
                  <div 
                    className="faq-question" 
                    onClick={() => toggleFaq(index)}
                  >
                    {faq.question}
                    <span className="faq-toggle">{expandedFaq === index ? '−' : '+'}</span>
                  </div>
                  {expandedFaq === index && (
                    <div className="faq-answer">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'contact' && (
          <div className="contact-section">
            <h2>Contact Our Support Team</h2>
            
            <p className="contact-intro">
              Can't find what you're looking for? Our support team is here to help!
            </p>
            
            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input type="text" id="name" name="name" placeholder="Enter your name" />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" placeholder="Enter your email" />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select id="subject" name="subject">
                  <option value="">Select a subject</option>
                  <option value="account">Account Issues</option>
                  <option value="recipe">Recipe Upload Problems</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="5" 
                  placeholder="Describe your issue or question in detail"
                ></textarea>
              </div>
              
              <button type="submit" className="contact-submit">Submit</button>
            </form>
            
            <div className="alternative-contact">
              <h3>Other Ways to Reach Us</h3>
              <p><strong>Email:</strong> support@recipo.com</p>
              <p><strong>Phone:</strong> (555) 123-4567</p>
              <p><strong>Hours:</strong> Monday-Friday, 9am-5pm EST</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;