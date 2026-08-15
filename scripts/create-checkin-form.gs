/**
 * Creates the Tryout Check-In Google Form, to spec, in one run.
 *
 * HOW TO RUN (about two minutes)
 *   1. Go to script.google.com and start a new project.
 *      Sign in as the account that should OWN the form and the responses —
 *      the form collects student names and parent emails, so use the school
 *      account you want that data to live in.
 *   2. Delete whatever is in Code.gs, paste this whole file in, and Save.
 *   3. Run > Run function > createTryoutCheckInForm. Approve the permission
 *      prompt the first time (it needs to create a Form and a Sheet).
 *   4. Open View > Logs. It prints two links:
 *        - the LIVE form URL  -> send this to Claude for the QR code
 *        - the responses Sheet
 *
 * Responses land in a new spreadsheet called
 * "Tryout Check-In (Responses)" in that account's Drive.
 */

function createTryoutCheckInForm() {
  var POSITIONS = [
    'Goalkeeper',
    'Center back',
    'Outside back',
    'Defensive midfield',
    'Center midfield',
    'Attacking midfield',
    'Winger',
    'Striker',
  ]

  var form = FormApp.create('Tryout Check-In')
  form.setDescription(
    'McDonogh Girls Varsity Soccer — check in once at your first tryout. ' +
      'One submission per player.',
  )
  form.setCollectEmail(false)
  form.setLimitOneResponsePerUser(false)
  form.setProgressBar(false)

  // 1 — Name (required)
  form.addTextItem().setTitle('First and last name').setRequired(true)

  // 2 — Year (required)
  form
    .addMultipleChoiceItem()
    .setTitle('Year')
    .setChoiceValues(['9th', '10th', '11th', '12th'])
    .setRequired(true)

  // 3 — Years at McDonogh (required, whole number)
  var years = form.addTextItem().setTitle('Number of years at McDonogh').setRequired(true)
  years.setValidation(
    FormApp.createTextValidation()
      .setHelpText('Enter a whole number, for example 3. Enter 1 if this is your first year.')
      .requireNumber()
      .build(),
  )

  // 4 — Primary position (required)
  form
    .addMultipleChoiceItem()
    .setTitle('Primary position')
    .setChoiceValues(POSITIONS)
    .setRequired(true)

  // 5 — Secondary position (optional)
  form
    .addMultipleChoiceItem()
    .setTitle('Secondary position')
    .setChoiceValues(POSITIONS.concat(['None']))
    .setRequired(false)

  // 6 — Parent email #1 (required — the only required parent email)
  var p1 = form.addTextItem().setTitle('Parent email #1').setRequired(true)
  p1.setValidation(
    FormApp.createTextValidation()
      .setHelpText('Enter a valid email address.')
      .requireTextIsEmail()
      .build(),
  )

  // 7 — Parent email #2 (optional)
  var p2 = form
    .addTextItem()
    .setTitle('Parent email #2')
    .setHelpText('Optional.')
    .setRequired(false)
  p2.setValidation(
    FormApp.createTextValidation()
      .setHelpText('Enter a valid email address.')
      .requireTextIsEmail()
      .build(),
  )

  // 8 — McDonogh email access (required)
  form
    .addMultipleChoiceItem()
    .setTitle('Do you have access to your McDonogh email?')
    .setChoiceValues(['Yes', 'No'])
    .setRequired(true)

  // Responses into their own spreadsheet.
  var sheet = SpreadsheetApp.create('Tryout Check-In (Responses)')
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId())

  Logger.log('LIVE FORM URL (use this for the QR): ' + form.getPublishedUrl())
  Logger.log('EDIT THE FORM:                       ' + form.getEditUrl())
  Logger.log('RESPONSES SHEET:                     ' + sheet.getUrl())
}
