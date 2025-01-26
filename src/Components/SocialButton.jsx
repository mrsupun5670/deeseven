import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'

const SocialButton = ({ icon, label }) => (
    <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
      <FontAwesomeIcon icon={icon} />
      {label}
    </button>
  );

export default SocialButton