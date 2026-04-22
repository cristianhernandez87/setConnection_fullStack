import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class AnalysisGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    console.log(`[AnalysisGateway] 🔌 Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`[AnalysisGateway] ❌ Cliente desconectado: ${client.id}`);
  }

  emitAnalysisProgress(setId: string, percent: number) {
    this.server.emit('analysis:progress', { setId, percent });
  }

  emitTrackFound(setId: string, trackData: unknown) {
    this.server.emit('track:found', { setId, track: trackData });
  }

  emitAnalysisCompleted(setId: string) {
    this.server.emit('analysis:completed', { setId });
  }
}
