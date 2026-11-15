import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AboutPage } from '../src/modules/about/AboutPage';
import { SkillsPage } from '../src/modules/skills/SkillsPage';
import { ProjectsPage } from '../src/modules/projects/ProjectsPage';
import { ExperiencePage } from '../src/modules/experience/ExperiencePage';
import { EducationPage } from '../src/modules/education/EducationPage';
import { PrivacyNoticePage } from '../src/modules/privacy/PrivacyNoticePage';
import axe from 'axe-core';

// Test fixture based on confirmed owner resume data
const confirmedSummary = {
  profile: {
    fullName: 'Girish Gowda H R',
    headline: 'Software Engineer | Java, SQL & Full-Stack Development',
    bio: 'MCA student at RV College of Engineering with a strong foundation in Java, SQL, and web development.',
    location: 'Bengaluru, Karnataka',
    resumeUrl: '/api/v1/public/portfolio/resume',
  },
  skillCategories: [
    {
      name: 'Programming Languages',
      sortOrder: 1,
      items: [
        { name: 'Java (OOP, Collections, Exception Handling, File Handling)', proficiency: 'Advanced', yearsOfExperience: 3.0, isFeatured: true },
        { name: 'Python', proficiency: 'Proficient', yearsOfExperience: 2.0, isFeatured: false },
        { name: 'SQL', proficiency: 'Advanced', yearsOfExperience: 3.0, isFeatured: true },
      ],
    },
  ],
  featuredProjects: [
    {
      slug: 'digital-twin',
      title: 'Digital Twin-Enabled Self-Healing Web Application',
      tagline: 'Team Project (3 members)',
      description: 'Designed and implemented a self-healing web application using Digital Twin technology to monitor systems and auto-recover from failures.',
      category: 'Software Engineering',
      technologies: ['Java', 'Servlet', 'HTML', 'CSS', 'SQL'],
      featured: true,
      sortOrder: 1,
    },
    {
      slug: 'population',
      title: 'Population Analysis of Karnataka Districts',
      tagline: 'Academic Project',
      description: 'Built a C-language application to ingest, process, and display census-style population data for Karnataka districts.',
      category: 'Software Engineering',
      technologies: ['C', 'File handling', 'CLI'],
      featured: false,
      sortOrder: 2,
    },
  ],
  experience: [],
  education: [
    {
      institution: 'RV College of Engineering',
      degree: 'MCA',
      fieldOfStudy: 'Computer Applications',
      startYear: 2025,
      endYear: 2027,
      description: 'In progress. Expected completion: 2027',
      sortOrder: 1,
    },
    {
      institution: 'Vidyavahini First Grade College',
      degree: 'BCA',
      fieldOfStudy: 'Computer Applications',
      startYear: 2021,
      endYear: 2024,
      gradeOrGpa: 'CGPA 8.91/10.0',
      sortOrder: 2,
    },
  ],
  certificates: [
    {
      name: 'Certified Fitness Trainer',
      issuingOrganization: 'Indian Institute of Skill Development Training',
      description: 'Reflects discipline, goal orientation, and continuous learning.',
      sortOrder: 1,
    },
  ],
  publications: [
    {
      id: 'pub-ieee-dt',
      title: 'Digital Twin-Enabled Self-Healing Web Application',
      publisher: 'IEEE',
      year: '2026',
      state: 'Approved & Published',
      role: 'Co-author (team paper)',
      abstractSummary: 'Co-authored research on AI-driven self-healing architectures and Digital Twin frameworks for resilient, scalable web systems.',
    },
  ],
};

describe('Phase 2 Public Portfolio UI Pages', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(confirmedSummary),
        })
      )
    );
  });

  it('renders AboutPage with verified operator name, resume link, and research publication', async () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /about me/i })).toBeInTheDocument();
      expect(screen.getByText('Girish Gowda H R')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /resume/i })).toBeInTheDocument();
      expect(screen.getByText(/Digital Twin-Enabled Self-Healing Web Application/i)).toBeInTheDocument();
      expect(screen.getByText(/Certified Fitness Trainer/i)).toBeInTheDocument();
    });
  });

  it('renders SkillsPage with confirmed categories and competencies', async () => {
    render(
      <MemoryRouter>
        <SkillsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /skills & competencies/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: 'Programming Languages' })).toBeInTheDocument();
      expect(screen.getByText(/Java \(OOP, Collections/i)).toBeInTheDocument();
      expect(screen.getByText('Python')).toBeInTheDocument();
    });
  });

  it('renders ProjectsPage with confirmed projects and technology tags', async () => {
    render(
      <MemoryRouter>
        <ProjectsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /featured projects/i })).toBeInTheDocument();
      expect(screen.getByText('Digital Twin-Enabled Self-Healing Web Application')).toBeInTheDocument();
      expect(screen.getByText('Population Analysis of Karnataka Districts')).toBeInTheDocument();
    });
  });

  it('renders ExperiencePage gracefully when career history is empty', async () => {
    render(
      <MemoryRouter>
        <ExperiencePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /professional experience/i })).toBeInTheDocument();
      expect(screen.getByText(/University Hire Software Engineer Candidate/i)).toBeInTheDocument();
      expect(screen.getByText(/RV College of Engineering, Bengaluru/i)).toBeInTheDocument();
    });
  });

  it('renders EducationPage with MCA and BCA academic credentials', async () => {
    render(
      <MemoryRouter>
        <EducationPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /education & credentials/i })).toBeInTheDocument();
      expect(screen.getByText('RV College of Engineering')).toBeInTheDocument();
      expect(screen.getByText('Vidyavahini First Grade College')).toBeInTheDocument();
      expect(screen.getByText(/CGPA 8.91\/10.0/i)).toBeInTheDocument();
    });
  });

  it('ensures zero SYNTHETIC or lorem strings appear in public pages', async () => {
    const { container } = render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /about me/i })).toBeInTheDocument();
    });

    const htmlContent = container.innerHTML.toLowerCase();
    expect(htmlContent).not.toContain('synthetic');
    expect(htmlContent).not.toContain('lorem');
  });

  it('renders PrivacyNoticePage with zero-knowledge commitments and passes axe A11y', async () => {
    const { container } = render(
      <MemoryRouter>
        <PrivacyNoticePage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /privacy notice & principles/i })).toBeInTheDocument();
    expect(screen.getByText(/zero commercial trackers/i)).toBeInTheDocument();

    const results = await axe.run(container);
    const criticalViolations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(criticalViolations).toHaveLength(0);
  });
});
