export async function loadCities() {
    const { default: cities } = await import('././cities.json', { with: { type: 'json' } });
    return cities;
}
