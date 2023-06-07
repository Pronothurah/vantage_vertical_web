import React from 'react';
import { useState } from 'react';

import './formValidation.css'

const FormValidation = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [textError, setTextError] = useState("");

  const validateForm = (event) => {
    event.preventDefault();

    // Reset error messages
    setUsernameError("");
    setEmailError("");
    setTextError("");

    // Validate username (at least 3 characters)
    if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters long.");
      return;
    }

    // Validate email
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(emailRegex)) {
      setEmailError("Invalid email address.");
      return;
    }

    // Validate text (at least 10 characters)
    if (text.length < 10) {
      setTextError("Text must be at least 10 characters long.");
      return;
    }

    // Form is valid, can proceed with submission
    // You can perform further actions here, such as sending the form data to a server

    // Reset form fields
    setUsername("");
    setEmail("");
    setText("");
  };

  return (
    <div className='vantage__validation section__padding gradient__bg'>
      <h2>Write us a Message</h2>
      <form onSubmit={validateForm}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {usernameError && <span className="error">{usernameError}</span>}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {emailError && <span className="error">{emailError}</span>}
        </div>
        <div>
          <label htmlFor="text">Text:</label>
          <textarea
            id="text"
            name="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          ></textarea>
          {textError && <span className="error">{textError}</span>}
        </div>
        <button className='form_button' type="submit">Submit</button>
      </form>
    </div>
  )
}

export default FormValidation
