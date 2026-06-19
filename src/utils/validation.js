export function validateAusschreibung(ausschreibung, errors) {

  // Fehler zurücksetzen
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  // Tierart
  if (!ausschreibung.animalType) {
    errors.animalType =
      'Bitte eine Tierart auswählen'
  }

  // Tiername
  if (!ausschreibung.petName ||
      !ausschreibung.petName.trim()) {
    errors.petName =
      'Tiername ist erforderlich'
  }

  // Alter
  if (ausschreibung.petAge < 0) {
    errors.petAge =
      'Alter darf nicht negativ sein'
  }

  // Stadt
  if (!ausschreibung.city ||
      !ausschreibung.city.trim()) {
    errors.city =
      'Stadt ist erforderlich'
  }

  // PLZ
  if (!ausschreibung.postalCode ||
      !ausschreibung.postalCode.trim()) {

    errors.postalCode =
      'Bitte eine Postleitzahl angeben'

  } else if (
    !/^\d{5}$/.test(ausschreibung.postalCode)
  ) {

    errors.postalCode =
      'PLZ muss aus 5 Ziffern bestehen'
  }

  // Beschreibung
  if (
    !ausschreibung.description ||
    ausschreibung.description.trim().length < 10
  ) {
    errors.description =
      'Beschreibung muss mindestens 10 Zeichen haben'
  }

  // Vergütung
  if (!ausschreibung.compensation) {
    errors.compensation =
      'Bitte eine Vergütung auswählen'
  }

  // Datum Von
  if (!ausschreibung.dateFrom) {
    errors.dateFrom =
      'Startdatum erforderlich'
  }

  // Datum Bis
  if (!ausschreibung.dateTo) {
    errors.dateTo =
      'Enddatum erforderlich'
  }

  // Datumslogik
  if (
    ausschreibung.dateFrom &&
    ausschreibung.dateTo &&
    ausschreibung.dateTo < ausschreibung.dateFrom
  ) {
    errors.dateTo =
      'Enddatum muss nach dem Startdatum liegen'
  }

  return Object.values(errors)
    .every(error => error === '')
}

export function validateReport(report, errors) {

  errors.grund = ''
  errors.beschreibung = ''

  if (!report.grund) {
    errors.grund = 'Bitte einen Meldegrund auswählen'
  }

  if (!report.beschreibung?.trim()) {
    errors.beschreibung = 'Bitte eine Beschreibung eingeben'
  }

  if (
    report.beschreibung &&
    report.beschreibung.trim().length < 10
  ) {
    errors.beschreibung =
      'Beschreibung muss mindestens 10 Zeichen haben'
  }

  return Object.values(errors)
    .every(error => error === '')
}

export function validateProfile(profile, errors) {

  errors.firstName = ''
  errors.lastName = ''

  if (!profile.firstName?.trim()) {
    errors.firstName = 'Vorname ist erforderlich'
  }

  if (!profile.lastName?.trim()) {
    errors.lastName = 'Nachname ist erforderlich'
  }

  return Object.values(errors)
    .every(error => error === '')
}