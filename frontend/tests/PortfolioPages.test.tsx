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

// Mock fetch to serve mock public portfolio summary
const mockSummary = {
  profile: {
    fullName: 'Girish Gowda H R',
    headline: 'Full-Stack Software Engineer & Distributed Systems Developer',
    bio: 'Passionate engineer specializing in modern enterprise architectures and Three.js lobbies.',
    location: 'Bengaluru, India',
    email: 'girishgowda0428@gmail.com',
    githubUrl: 'https://github.com/girishgowdahr',
    linkedinUrl: 'https://linkedin.com/in/girishgowdahr',
    resumeUrl: '/api/v1/public/portfolio/resume',
    avatarImageUrl: '/avatar-profile.png',
  },
  skillCategories: [
    {
      name: 'Languages & Core Runtimes',
      sortOrder: 10,
      items: [
        { name: 'Java 21 LTS', proficiency: 'Advanced', yearsOfExperience: 3.0, isFeatured: true },
        { name: 'TypeScript', proficiency: 'Advanced', yearsOfExperience: 3.0, isFeatured: true },
      ],
    },
  ],
  featuredProjects: [
    {
      slug: 'girish-identity-platform',
      title: 'GIRISH Identity & Quantified-Self Platform',
      tagline: 'Personal Identity Platform and 3D Articulated Avatar Lobby.',
      description: 'Engineered with Spring Boot 3, Java 21, React 19, and Three.js.',
      category: 'Full-Stack',
      technologies: ['Java 21', 'Spring Boot 3', 'React 19', 'Three.js'],
      githubUrl: 'https://github.com/girishgowdahr/Girish_Gowda_H_R',
      liveUrl: 'http://localhost:5173',
      featured: true,
      sortOrder: 10,
    },
  ],
  experience: [
    {
      roleTitle: 'Software Engineer',
      companyName: 'Enterprise Cloud Systems',
      employmentType: 'Full-time',
      location: 'Bengaluru, India',
      startDate: '2023-01-01',
      endDate: null,
      isCurrent: true,
      description: 'Architecting and developing mission-critical distributed backend services.',
      highlights: ['Designed and deployed resilient Spring Boot microservices'],
      technologies: ['Java', 'Spring Boot', 'PostgreSQL'],
      sortOrder: 10,
    },
  ],
  education: [
    {
      institution: 'Visvesvaraya Technological University',
      degree: 'Bachelor of Engineering (B.E.)',
      fieldOfStudy: 'Computer Science and Engineering',
      startYear: 2019,
      endYear: 2023,
      gradeOrGpa: 'First Class with Distinction',
      description: 'Specialized in Software Engineering and Distributed Systems.',
      sortOrder: 10,
    },
  ],
  certificates: [
    {
      name: 'Oracle Certified Professional: Java SE Developer',
      issuingOrganization: 'Oracle',
      issueDate: '2023-08-15',
      expirationDate: null,
      credentialId: 'OCP-JAVA-21-SYNTHETIC',
      credentialUrl: 'https://catalog-education.oracle.com',
      sortOrder: 10,
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
          json: () => Promise.resolve(mockSummary),
        })
      )
    );
  });

  it('renders AboutPage with verified operator name and resume download action', async () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /about me/i })).toBeInTheDocument();
      expect(screen.getByText('Girish Gowda H R')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /resume/i })).toBeInTheDocument();
      expect(screen.getByText('girishgowda0428@gmail.com')).toBeInTheDocument();
    });
  });

  it('renders SkillsPage with categories and competencies', async () => {
    render(
      <MemoryRouter>
        <SkillsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /skills & competencies/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: 'Languages & Core Runtimes' })).toBeInTheDocument();
      expect(screen.getByText('Java 21 LTS')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });
  });

  it('renders ProjectsPage with project card and technologies badges', async () => {
    render(
      <MemoryRouter>
        <ProjectsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /featured projects/i })).toBeInTheDocument();
      expect(screen.getByText('GIRISH Identity & Quantified-Self Platform')).toBeInTheDocument();
      expect(screen.getByText('Three.js')).toBeInTheDocument();
    });
  });

  it('renders ExperiencePage with career timeline', async () => {
    render(
      <MemoryRouter>
        <ExperiencePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /professional experience/i })).toBeInTheDocument();
      expect(screen.getByText('Enterprise Cloud Systems')).toBeInTheDocument();
      expect(screen.getByText('Current Position')).toBeInTheDocument();
    });
  });

  it('renders EducationPage with degree and honors', async () => {
    render(
      <MemoryRouter>
        <EducationPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /education & credentials/i })).toBeInTheDocument();
      expect(screen.getByText('Bachelor of Engineering (B.E.)')).toBeInTheDocument();
      expect(screen.getByText('Visvesvaraya Technological University')).toBeInTheDocument();
    });
  });

  it('renders PrivacyNoticePage with zero-knowledge commitments', async () => {
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
