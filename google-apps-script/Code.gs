// Paste this into the Apps Script editor attached to your Google Sheet.
// It receives RSVPs from the website and appends one row per reply.

const SHEET_NAME = 'RSVP';
// Only needed if the script was created at script.google.com (not via the sheet's Extensions > Apps Script).
// The ID is the long string in the sheet URL: docs.google.com/spreadsheets/d/<THIS_PART>/edit
const SHEET_ID = '';

// Stop spreadsheet formula injection: a name like "=IMPORTXML(...)" would otherwise run.
const safe = (v) => {
  const s = String(v == null ? '' : v).slice(0, 1000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
};

function doPost(e) {
  const ss = SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Name', 'Attendance', 'Guests', 'Message', 'Invite']);
    sheet.setFrozenRows(1);
  }
  const d = JSON.parse(e.postData.contents);
  const attending = d.attendance === 'yes';
  sheet.appendRow([
    new Date(),
    safe(d.name),
    attending ? 'Attending' : 'Declined',
    attending ? Math.min(Number(d.guests) || 1, 20) : 0,
    safe(d.message),
    d.invite === 'walima' ? 'Walima only' : 'Nikah & Walima',
  ]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}
