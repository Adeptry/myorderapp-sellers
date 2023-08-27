import browserLogger from "@/utils/browserLogger";
import { useEffect, useRef } from "react";
import { useBoolean } from "usehooks-ts";
import { WindowClonable } from "./WindowClonable";
import { ReceivingWindowMessage, WindowMessage } from "./WindowMessage";

export default function MessagingIframe<
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
  const { value: isReadyState, setTrue: setIsReadyStateTrue } =
    useBoolean(false);

  useEffect(() => {
    if (!isReadyState || !props.sendMessageState) return;
    browserLogger.info(props.sendMessageState, "Web sending message");
    iframeRef.current?.contentWindow?.postMessage(
      props.sendMessageState,
      new URL(props.src).origin
    );
  }, [props.sendMessageState, isReadyState]);

  useEffect(() => {
    function handleIncomingMessage(
      event: MessageEvent<ReceivingWindowMessage<ReceiverType>>
    ) {
      if (event.origin !== new URL(props.src).origin) {
        return;
      }

      browserLogger.info(event.data, "Web received message");

      try {
        const data = event.data.data;
        if (data.type === "event" && data.payload === "ready") {
          setIsReadyStateTrue();
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
