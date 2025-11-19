import { useDarkMode } from '../hooks/useDarkMode';

import React, { useEffect } from 'react';
import SkillsSection from '../components/SkillsSection';

function Skills() {
  useEffect(() => {
    document.title = 'Habilidades | Mi Portafolio';
  }, []);
  const isDark = useDarkMode();

  const skills = {
    'Frontend': [
      { name: 'React', level: 90 },
      { name: 'TypeScript', level: 85 },
      { name: 'Tailwind CSS', level: 88 },
      { name: 'Next.js', level: 82 },
    ],
    'Backend': [
      { name: 'Node.js', level: 85 },
      { name: 'Express', level: 87 },
      { name: 'MongoDB', level: 80 },
      { name: 'PostgreSQL', level: 75 },
    ],
    'Herramientas': [
      { name: 'Git', level: 88 },
      { name: 'Docker', level: 78 },
      { name: 'VS Code', level: 92 },
      { name: 'Webpack', level: 75 },
    ],
  };

  return (
    <div className={`min-h-screen pt-20 pb-10 transition-colors ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Mis Habilidades</h1>
          <p className={`mt-4 text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Tecnologías y herramientas que domino
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(skills).map(([category, skillList]) => (
            <div
              key={category}
              className={`rounded-xl shadow-lg p-6 transition-colors ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>{category}</h2>
              <div className="space-y-4">
                {skillList.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-1">
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{skill.name}</span>
                      <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{skill.level}%</span>
                    </div>
                    <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div
                        style={{ width: `${skill.level}%` }}
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;