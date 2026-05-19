// Pure formatting helpers shared by the frontend and unit tests.
//
// Both helpers take strings produced by Open-Meteo with timezone=auto:
//   - daily entries are bare YYYY-MM-DD strings.
//   - current.time is a timezone-naive YYYY-MM-DDTHH:mm string already
//     adjusted to the location's clock.
//
// JS's Date constructor parses both forms in a way that depends on the
// host: YYYY-MM-DD parses as UTC midnight, and YYYY-MM-DDTHH:mm parses
// as the host's local timezone. Subsequently rendering with an
// explicit timeZone for a different location double-applies the
// offset. Both helpers therefore parse the input parts directly and
// build the moment via Date.UTC, then format with timeZone: 'UTC' so
// the displayed digits/weekday match the input string verbatim,
// regardless of host or location timezone.

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const ISO_DATETIME = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/;

export function formatWeekday(isoDate) {
  const m = typeof isoDate === 'string' && ISO_DATE.exec(isoDate);
  if (!m) {
    if (!isoDate) return '';
    const fallback = new Date(isoDate);
    if (Number.isNaN(fallback.getTime())) return String(isoDate);
    return fallback.toLocaleDateString(undefined, { weekday: 'short', timeZone: 'UTC' });
  }
  const utc = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return utc.toLocaleDateString(undefined, { weekday: 'short', timeZone: 'UTC' });
}

// Returns the runtime's short timezone label for the given location at
// the given UTC instant (e.g. "CET", "GMT+1", "PST"). Falls back to
// the empty string if the runtime cannot resolve the zone.
function timeZoneLabel(utcInstant, timeZone) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'short'
    }).formatToParts(utcInstant);
    const part = parts.find((p) => p.type === 'timeZoneName');
    return part ? part.value : '';
  } catch {
    return '';
  }
}

export function formatTime(isoTime, timeZone) {
  if (!isoTime) return '';
  const m = typeof isoTime === 'string' && ISO_DATETIME.exec(isoTime);
  if (!m) {
    const fallback = new Date(isoTime);
    if (Number.isNaN(fallback.getTime())) return String(isoTime);
    return fallback.toLocaleString(undefined, {
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit'
    });
  }
  const utc = new Date(Date.UTC(
    Number(m[1]), Number(m[2]) - 1, Number(m[3]),
    Number(m[4]), Number(m[5])
  ));
  // Render the digits in UTC so the displayed wall clock matches the
  // input string verbatim. The location's offset has already been
  // applied upstream (Open-Meteo timezone=auto), so there is nothing
  // for us to convert.
  const digits = utc.toLocaleString(undefined, {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC'
  });
  if (!timeZone) return digits;
  // Append the location's tz abbreviation so the user can tell whose
  // clock those digits belong to. Computed separately from the digit
  // formatting so the digits stay aligned with the input.
  const label = timeZoneLabel(utc, timeZone);
  return label ? `${digits} ${label}` : digits;
}
