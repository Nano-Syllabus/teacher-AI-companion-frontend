export function buildAccessRequestMailto({
  teacherEmail,
  teacherName,
  studentName,
  studentEmail,
  notebookTitle,
  accessType,
  message,
}: {
  teacherEmail: string;
  teacherName: string;
  studentName: string;
  studentEmail: string;
  notebookTitle: string;
  accessType: "view" | "download" | "chat";
  message: string;
}): string {
  const subject = `Access Request: "${notebookTitle}"`;

  const body = `Hi ${teacherName},

I would like to request ${accessType} access to your notebook "${notebookTitle}".

${message ? `Message:\n${message}\n` : ""}
Student Details:
  Name:  ${studentName}
  Email: ${studentEmail}

Please reply to this email to confirm access.

Thank you,
${studentName}`;

  return `mailto:${teacherEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}