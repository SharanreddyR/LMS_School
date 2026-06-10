/** @param {Record<string, string>} data */
export function buildApplicationLinkHtml(data) {
  const {
    greeting,
    paragraphs,
    applyUrl,
    schoolName,
    enquiryNumber,
    studentName,
    gradeApplying,
    academicYear,
  } = data

  const bodyParagraphs = paragraphs
    .map((p) => `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;">${escapeHtml(p)}</p>`)
    .join('')

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.08);">
        <tr><td style="background:linear-gradient(135deg,#4f46e5,#3730a3);padding:28px 32px;">
          <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.85);">${escapeHtml(schoolName)}</p>
          <h1 style="margin:8px 0 0;font-size:22px;font-weight:700;color:#ffffff;">Complete Your Admission Application</h1>
          <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.9);">Academic Year ${escapeHtml(academicYear)}</p>
        </td></tr>
        <tr><td style="padding:32px;">
          <p style="margin:0 0 20px;font-size:16px;font-weight:600;color:#0f172a;">${escapeHtml(greeting)}</p>
          ${bodyParagraphs}
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;background:#eef2ff;border:1px solid #c7d2fe;border-radius:12px;">
            <tr><td style="padding:24px;text-align:center;">
              <p style="margin:0 0 16px;font-size:14px;font-weight:600;color:#312e81;">Click below to open and complete the online application form</p>
              <a href="${escapeHtml(applyUrl)}" style="display:inline-block;background:#4f46e5;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 28px;border-radius:10px;">Complete Online Application</a>
              <p style="margin:16px 0 0;font-size:12px;color:#64748b;word-break:break-all;">${escapeHtml(applyUrl)}</p>
            </td></tr>
          </table>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:8px;background:#f8fafc;border-radius:8px;">
            <tr><td style="padding:16px;font-size:13px;color:#475569;">
              <strong>Student:</strong> ${escapeHtml(studentName)}<br>
              <strong>Class:</strong> ${escapeHtml(gradeApplying)}<br>
              <strong>Enquiry ref:</strong> ${escapeHtml(enquiryNumber)}
            </td></tr>
          </table>
          <p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:#64748b;">
            Warm regards,<br>
            <strong style="color:#334155;">Admissions Team</strong><br>
            ${escapeHtml(schoolName)}
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
