import { Injectable } from "@nestjs/common";

@Injectable()
export class AppAuthentication {

  private RegisteredApp = new Set([
    "eba833927e93be1e8da25766c67f5ef8",
    "c8d1f48cfaad12fc26df41285a41ae25"
  ]);


  verifyAppWithID(appId: string) {
    return this.RegisteredApp.has(appId);
  }
}