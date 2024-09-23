import React from 'react';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

const socialMediaLinks = [
    {
      url: 'https://www.linkedin.com/in/krzamiela',
      icon: <FaLinkedin />,
    },
    {
      url: 'https://github.com/krzamiela',
      icon: <FaGithub />,
    },
    {
      url: 'https://twitter.com/krzamiela',
      icon: <FaTwitter />,
    },
  ];
  
  export const Social: React.FC = () => {
    return (
      <div className="social-container">
        {socialMediaLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            {link.icon}
          </a>
        ))}
      </div>
    );
  };