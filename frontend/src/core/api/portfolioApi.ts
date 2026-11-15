import {
  PublicPortfolioSummary,
  PublicProfile,
  PublicSkillCategory,
  PublicProject,
  PublicExperience,
  PublicEducation,
  PublicCertificate,
  PublicModule,
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function fetchWithFallback<T>(endpoint: string, fallbackPath: string): Promise<T> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      return (await response.json()) as T;
    }
  } catch {
    // API is unreachable or timed out; fall through to static bundle fallback
  }

  // Fallback to static public content
  const fallbackRes = await fetch(fallbackPath);
  if (!fallbackRes.ok) {
    throw new Error(`Failed to load content from fallback: ${fallbackPath}`);
  }
  return (await fallbackRes.json()) as T;
}

export async function getPortfolioSummary(): Promise<PublicPortfolioSummary> {
  return fetchWithFallback<PublicPortfolioSummary>(
    '/api/v1/public/portfolio',
    '/public-content.json'
  );
}

export async function getProfile(): Promise<PublicProfile> {
  try {
    const summary = await getPortfolioSummary();
    return summary.profile;
  } catch {
    const res = await fetch('/public-content.json');
    const data = await res.json();
    return data.profile;
  }
}

export async function getSkills(): Promise<PublicSkillCategory[]> {
  try {
    const summary = await getPortfolioSummary();
    return summary.skillCategories;
  } catch {
    const res = await fetch('/public-content.json');
    const data = await res.json();
    return data.skillCategories;
  }
}

export async function getProjects(): Promise<PublicProject[]> {
  try {
    const summary = await getPortfolioSummary();
    return summary.featuredProjects;
  } catch {
    const res = await fetch('/public-content.json');
    const data = await res.json();
    return data.featuredProjects;
  }
}

export async function getProjectBySlug(slug: string): Promise<PublicProject | null> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) || null;
}

export async function getExperience(): Promise<PublicExperience[]> {
  try {
    const summary = await getPortfolioSummary();
    return summary.experience;
  } catch {
    const res = await fetch('/public-content.json');
    const data = await res.json();
    return data.experience;
  }
}

export async function getEducation(): Promise<PublicEducation[]> {
  try {
    const summary = await getPortfolioSummary();
    return summary.education;
  } catch {
    const res = await fetch('/public-content.json');
    const data = await res.json();
    return data.education;
  }
}

export async function getCertificates(): Promise<PublicCertificate[]> {
  try {
    const summary = await getPortfolioSummary();
    return summary.certificates;
  } catch {
    const res = await fetch('/public-content.json');
    const data = await res.json();
    return data.certificates;
  }
}

export async function getPublications(): Promise<import('./types').PublicPublication[]> {
  try {
    const summary = await getPortfolioSummary();
    return summary.publications || [];
  } catch {
    const res = await fetch('/public-content.json');
    const data = await res.json();
    return data.publications || [];
  }
}

export async function getPublicModules(): Promise<PublicModule[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const response = await fetch(`${API_BASE_URL}/api/v1/public/modules`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);
    if (response.ok) {
      return (await response.json()) as PublicModule[];
    }
  } catch {
    // Return standard public navigation
  }

  return [
    {
      moduleId: 'lobby',
      displayName: 'Command Center Lobby',
      icon: 'Crosshair',
      navGroup: 'primary',
      sortOrder: 10,
      avatarThemeId: 'theme-cyber-neon',
      routes: [{ path: '/', label: 'Lobby', isExact: true, requiresAuth: false }],
      featureFlags: {},
    },
    {
      moduleId: 'portfolio',
      displayName: 'Engineering Portfolio',
      icon: 'Briefcase',
      navGroup: 'primary',
      sortOrder: 20,
      avatarThemeId: 'theme-cyber-neon',
      routes: [
        { path: '/about', label: 'About', isExact: true, requiresAuth: false },
        { path: '/skills', label: 'Skills', isExact: true, requiresAuth: false },
        { path: '/projects', label: 'Projects', isExact: true, requiresAuth: false },
        { path: '/education', label: 'Education', isExact: true, requiresAuth: false },
        { path: '/experience', label: 'Experience', isExact: true, requiresAuth: false },
      ],
      featureFlags: {},
    },
  ];
}
