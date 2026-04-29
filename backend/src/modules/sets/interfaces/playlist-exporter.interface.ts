export interface IPlaylistExporter {
  // 1. Obtener la URL de login para que el usuario nos dé permiso
  getAuthUrl(): string;

  // 2. Intercambiar el código que nos da Spotify por un Token real
  getAccessToken(code: string): Promise<string>;

  // 3. Crear la playlist y meter los tracks
  export(
    accessToken: string,
    playlistName: string,
    trackIds: string[],
  ): Promise<string>;
}
