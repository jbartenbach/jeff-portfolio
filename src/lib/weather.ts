const WMO: Record<number, string> = {
  0: 'Clear',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Fog',
  51: 'Light drizzle',
  61: 'Rain',
  80: 'Showers',
  95: 'Thunderstorm',
}

export async function fetchTodayWeather(): Promise<{
  highF: number
  summary: string
} | null> {
  const lat = Number(import.meta.env.VITE_WEATHER_LAT) || 37.7749
  const lon = Number(import.meta.env.VITE_WEATHER_LON) || -122.4194
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,weathercode&temperature_unit=fahrenheit&timezone=auto`
    const r = await fetch(url)
    const j = await r.json()
    const code = j?.daily?.weathercode?.[0]
    const max = j?.daily?.temperature_2m_max?.[0]
    if (max == null) return null
    return {
      highF: Math.round(max),
      summary: WMO[code] ?? 'Mixed',
    }
  } catch {
    return null
  }
}
