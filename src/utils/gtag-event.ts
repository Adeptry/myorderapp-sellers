// begin_checkout
// login
// purchase
// sign_up
export const gtagEvent = (
  eventName: EventNames | (string & {}),
  eventParams?: ControlParams | EventParams | CustomParams
): void => {
  window.gtag("event", eventName, eventParams);
};
