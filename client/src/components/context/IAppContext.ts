import { Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";

export interface IReceivedMessageData {
  content: string;
  fromUserId: string;
  toUserId: string;
}

export interface IAppContext {
  isLogged: boolean;
  setIsLogged: Dispatch<SetStateAction<boolean>>;
  socket: Socket | undefined;
}
