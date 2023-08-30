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

  useEffect(() => {
    logger.info(props.sendMessageState, "Web sending message");
    iframeRef.current?.contentWindow?.postMessage(
      props.sendMessageState,
      new URL(props.src).origin
    );
  }, [props.sendMessageState, updateCountState]);

  useEffect(() => {
    function handleIncomingMessage(
      event: MessageEvent<ReceivingWindowMessage<ReceiverType>>
    ) {
      if (event.origin !== new URL(props.src).origin) {
        return;
      }

      logger.info(event.data, "Web received message");

      try {
        const data = event.data.data;
        if (data.type === "event" && data.payload === "update") {
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
    <iframe ref={iframeRef} id={props.id} src={props.src} style={props.style} />
  );
}
