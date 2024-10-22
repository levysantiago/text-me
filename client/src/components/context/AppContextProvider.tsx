/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useEffect, useState } from "react";
import { AppContext } from "./AppContext";
import { checkLoginService } from "services/checkLoginService";
import { Socket, io } from "socket.io-client";
import { emitter } from "lib/event-emitter";

interface IAppContextProviderProps {
  children: ReactNode;
}

export function AppContextProvider({ children }: IAppContextProviderProps) {
  const [isLogged, setIsLogged] = useState(false);
  const [socket, setSocket] = useState<Socket>();

  async function checkLogin() {
    try {
      await checkLoginService();
      setIsLogged(true);

      const accessToken = localStorage.getItem("access_token");
      const _socket = io(process.env.REACT_APP_SERVER_WEBSOCKET as string, {
        extraHeaders: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      _socket.on(
        "handleCreatedMessage",
        ({ fromUserId, toUserId, content }: any) => {
          emitter.emit("handleCreatedMessage", {
            fromUserId,
            toUserId,
            content,
          });
        },
      );

      _socket.on("friendIsTyping", ({ fromUserId }: any) => {
        emitter.emit("friendIsTyping", {
          fromUserId,
        });
      });

      _socket.on("friendStoppedTyping", ({ fromUserId }: any) => {
        emitter.emit("friendStoppedTyping", {
          fromUserId,
        });
      });

      setSocket(_socket);
    } catch (e) {
      console.log(e);
      setIsLogged(false);
    }
  }

  useEffect(() => {
    checkLogin();
  }, [isLogged]);

  return (
    <AppContext.Provider value={{ isLogged, setIsLogged, socket }}>
      {children}
    </AppContext.Provider>
  );
}
