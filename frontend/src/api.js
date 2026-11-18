async function getJson(path) {
  const response = await fetch(`/api/${path}`);
  if (!response.ok) {
    throw new Error(`La API respondió con estado ${response.status}`);
  }
  return response.json();
}

export async function getPortfolio() {
  const [profile, skills, certifications, projects] = await Promise.all([
    getJson('profile'),
    getJson('skills'),
    getJson('certifications'),
    getJson('projects'),
  ]);
  return { profile, skills, certifications, projects };
}

