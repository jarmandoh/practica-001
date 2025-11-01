import React from 'react';

const SkillsCard = ({ icon:  title, skills }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl transition duration-500 hover:shadow-indigo-300/50">
      <h3 className="text-2xl font-semibold mb-4 flex items-center text-indigo-500">
        <Icon className="w-6 h-6 mr-3" />
        {title}
      </h3>
      <ul className="space-y-2 text-gray-600">
        {skills.map((skill, index) => (
          <li key={index} className="flex items-center">
            <span className="text-indigo-500 mr-2">•</span>
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SkillsCard;
