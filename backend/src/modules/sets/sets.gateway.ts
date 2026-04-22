/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class SetsGateway {
  @WebSocketServer()
  server!: Server;

  emitAnalysisProgress(setId: string, percent: number) {
    this.server.emit('analysis:progress', { setId, percent });
  }

  emitTrackFound(setId: string, trackData: any) {
    this.server.emit('track:found', { setId, trackData });
  }

  emitAnalysisCompleted(setId: string) {
    this.server.emit('analysis:completed', { setId });
  }
}
