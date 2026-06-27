/**
 * Department Mapping Helper
 * Maps department slugs to organizational structure field names
 * This ensures Kepala data comes from organizational_structure (single source of truth)
 */

export interface DepartmentHeadData {
  name: string
  photo: string | null
}

/**
 * Maps department slug to organizational structure field name
 * @param slug - Department slug (e.g., 'seni-budaya')
 * @returns Field name in organizational_structure table or null if not found
 */
export const getDepartmentHeadField = (slug: string): string | null => {
  const mapping: Record<string, string> = {
    'seni-budaya': 'kepala_seni_budaya',
    'sosial-keagamaan': 'kepala_sosial_keagamaan',
    'infokom': 'kepala_infokom',
    'pengembangan-organisasi': 'kepala_pengembangan_org',
    'olahraga': 'kepala_olahraga',
    'kajian-pendidikan': 'kepala_kajian_pendidikan',
  }
  
  return mapping[slug] || null
}

/**
 * Extracts department head data from organizational structure
 * @param structure - Organizational structure object
 * @param slug - Department slug
 * @returns Department head data or null if not found
 */
export const getDepartmentHeadData = (
  structure: any,
  slug: string
): DepartmentHeadData | null => {
  const field = getDepartmentHeadField(slug)
  
  if (!field) {
    return null
  }
  
  const name = structure[field]
  const photo = structure[`${field}_photo`]
  
  // Return null if no name is set (department head not assigned yet)
  if (!name || !name.trim()) {
    return null
  }
  
  return {
    name: name.trim(),
    photo: photo || null,
  }
}

/**
 * Validates if a department slug has a corresponding organizational structure field
 * @param slug - Department slug to validate
 * @returns True if mapping exists
 */
export const isDepartmentSlugValid = (slug: string): boolean => {
  return getDepartmentHeadField(slug) !== null
}
