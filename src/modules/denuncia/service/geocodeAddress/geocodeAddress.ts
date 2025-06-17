let fetch: typeof import("node-fetch").default;

export async function geocodeAddress(endereco: string): Promise<{ latitude?: number; longitude?: number }> {
  if (!fetch) {
    fetch = (await import("node-fetch")).default;
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(endereco)}&format=json&limit=1`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "CidadeEmFoco/1.0",
      },
    });

    const data = await response.json() as { lat: string; lon: string }[];

    if (data.length === 0) {
      console.warn("Endereço não localizado:", endereco);
      return {};
    }

    const { lat, lon } = data[0];
    return {
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
    };
  } catch (error) {
    console.error("Erro na geocodificação:", error);
    return {};
  }
}
