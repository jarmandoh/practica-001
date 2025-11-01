import React from 'react';
import Hero from '../components/Hero'
import About from '../components/About'
import SkillsSection from '../components/SkillsSection'
import ProjectsSection from '../components/ProjectsSection'
import ContactSection from '../components/ContactSection'

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <About />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  )
}