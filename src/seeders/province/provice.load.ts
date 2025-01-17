
export async function loadProvines() {
    const { default: provinces } = await import('./province.json', { with: { type: 'json' } });
    return provinces;
}

