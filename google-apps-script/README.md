# Save RSVPs to a Google Sheet

1. Create a new Google Sheet (e.g. "Wedding RSVPs").
2. In the sheet: **Extensions > Apps Script**. Delete the sample code and paste in `Code.gs`. Save.
3. Click **Deploy > New deployment**, choose type **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**, approve the permissions, and copy the **Web app URL**.
5. Paste that URL into `src/data/config.js` as `rsvp.endpoint`, then push to GitHub.
6. Share the sheet with family/organizers (Share button) so everyone sees the same live list.

Tips:
- After editing `Code.gs` later, use **Deploy > Manage deployments > Edit > New version** so the URL keeps working.
- Total confirmed guests: `=SUM(D2:D)` on the RSVP sheet.
- The web app URL is public (it must be, for guests to submit). The sheet itself stays private.
