import { IPlaylistExporter } from '../interfaces/playlist-exporter.interface';
import axios from 'axios';

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export class SpotifyPlaylistExporter implements IPlaylistExporter {
  private readonly clientId = process.env.SPOTIFY_CLIENT_ID;
  private readonly clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  private readonly redirectUri = 'http://127.0.0.1:3000/sets/export/callback';

  // 🔥 HACK PARA EVITAR QUE EL CHAT BORRE LOS ENLACES:
  private readonly SPOTIFY_ACCOUNTS = 'https://' + 'accounts.spotify.com';
  private readonly SPOTIFY_API = 'https://' + 'api.spotify.com' + '/v1';

  getAuthUrl(): string {
    const scopes = 'playlist-modify-public playlist-modify-private';

    // URL REAL de Autorización
    return (
      this.SPOTIFY_ACCOUNTS +
      '/authorize?client_id=' +
      this.clientId +
      '&response_type=code&redirect_uri=' +
      encodeURIComponent(this.redirectUri) +
      '&scope=' +
      encodeURIComponent(scopes) +
      '&show_dialog=true'
    );
  }

  async getAccessToken(code: string): Promise<string> {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', this.redirectUri);

    // URL REAL de Token
    const response = await axios.post<SpotifyTokenResponse>(
      this.SPOTIFY_ACCOUNTS + '/api/token',
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            Buffer.from(this.clientId + ':' + this.clientSecret).toString(
              'base64',
            ),
        },
      },
    );

    return response.data.access_token;
  }

  async export(
    accessToken: string,
    playlistName: string,
    trackUris: string[],
  ): Promise<string> {
    // 1. Obtener ID del usuario (URL REAL: api.spotify.com/v1/me)
    const user = await axios.get<{ id: string }>(this.SPOTIFY_API + '/me', 
      { headers: { Authorization: 'Bearer ' + accessToken } },
    );

    // 2. Crear Playlist (URL REAL: api.spotify.com/v1/users/{id}/playlists)
    const playlist = await axios.post<{
      id: string;
      external_urls: { spotify: string };
    }>(
      this.SPOTIFY_API + '/users/' + user.data.id + '/playlists',
      {
        name: playlistName,
        description: 'Created by SetConnection 🎧',
        public: true,
      },
      { headers: { Authorization: 'Bearer ' + accessToken } },
    );

    // 3. Añadir Tracks (URL REAL: api.spotify.com/v1/playlists/{id}/tracks)
    // await axios.post(
    //   this.SPOTIFY_API + '/playlists/' + playlist.data.id + '/tracks',
    //   { uris: trackUris },
    //   { headers: { Authorization: 'Bearer ' + accessToken } },
    // );

    return playlist.data.external_urls.spotify;
  }
}
