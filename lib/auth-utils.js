export function canStudentSeeFile(file, session, assignment = null) {
  if (session.user.role !== 'STUDENT') return true;

  const parts = file.path.split('/');
  if (parts.length === 1) return true; // Root files are public

  const folderName = parts[1];

  // Assignment root README.md: E.g. "Lab1/README.md" (parts.length == 2)
  if (parts.length === 2 && file.path.endsWith('README.md')) {
    return true;
  }

  if (folderName === 'solution') {
    // If we have assignment info, check deadline
    if (assignment) {
      if (!assignment.deadline || new Date() < new Date(assignment.deadline)) {
        return false;
      }
      return true;
    }
    // If no assignment info provided, we'd need to fetch it, but here we'll be conservative
    return false;
  }

  // Student folder check
  if (file.userId) {
    return file.userId === session.user.id;
  }

  // Fallback for folders that don't have userId (e.g. subfolders created by teacher)
  // Our convention: AssignmentName/StudentName/...
  if (folderName === session.user.name) {
    return true;
  }

  return false;
}
