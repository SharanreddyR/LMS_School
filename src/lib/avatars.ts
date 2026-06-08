/** Consistent demo profile photos via pravatar.cc */
export function getStudentAvatar(studentId: string) {
  return `https://i.pravatar.cc/400?u=${encodeURIComponent(studentId)}`
}

export function getParentAvatar(parentId: string) {
  return `https://i.pravatar.cc/400?u=${encodeURIComponent(parentId)}`
}

export function getPersonAvatar(name: string, seed?: string) {
  return `https://i.pravatar.cc/400?u=${encodeURIComponent(seed ?? name)}`
}
