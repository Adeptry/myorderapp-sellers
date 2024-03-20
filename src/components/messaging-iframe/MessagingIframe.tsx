/*
    This code is part of the myorderapp-sellers front-end.
    Copyright (C) 2024  Adeptry, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

import { WindowClonable } from "@/components/messaging-iframe/WindowClonable";
import {
  ReceivingWindowMessage,
  WindowMessage,
} from "@/components/messaging-iframe/WindowMessage";
import { logger } from "@/utils/logger";
import { useEffect, useRef, useState } from "react";

export function MessagingIframe<
  SenderType extends WindowClonable,
  ReceiverType extends WindowClonable
>(props: {
  id: string;
  src: string;
  sendMessageState?: WindowMessage<SenderType> | null;
  onReceiveMessage?: (message: WindowMessage<ReceiverType>) => void;
  style?: React.CSSProperties;
}) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [updateCountState, setUpdateCountState] = useState(0);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    iframeRef.current?.contentWindow?.postMessage(
      props.sendMessageState,
      new URL(props.src).origin
    );
  }, [props.sendMessageState, updateCountState, iframeLoaded]);

  useEffect(() => {
    function handleIncomingMessage(
      event: MessageEvent<ReceivingWindowMessage<ReceiverType>>
    ) {
      if (event.origin !== new URL(props.src).origin) {
        return;
      }

      try {
        const data = event.data.data;
        if (data.type === "event" && data.payload === "update") {
          logger.debug(updateCountState, "Web received update event");
          setUpdateCountState(updateCountState + 1);
        }
        props.onReceiveMessage?.(data);
      } catch (e) {
        console.error("Failed to parse message:", e);
      }
    }

    window.addEventListener("message", handleIncomingMessage);

    return () => {
      window.removeEventListener("message", handleIncomingMessage);
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      onLoad={() => setIframeLoaded(true)}
      id={props.id}
      src={props.src}
      style={props.style}
    />
  );
}
