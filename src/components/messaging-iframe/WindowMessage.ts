import { WindowClonable } from "@/components/messaging-iframe/WindowClonable";

export interface WindowMessage<T extends WindowClonable> {
  type: string;
  payload: T;
}

export interface ReceivingWindowMessage<T extends WindowClonable> {
  data: WindowMessage<T>;
}
