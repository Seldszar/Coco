const shortDateTimeFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "short",
  timeStyle: "short",
});

const currencyFormat = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
  trailingZeroDisplay: "stripIfInteger",
});

export function shortDateTime(input: Date | number) {
  return shortDateTimeFormat.format(input);
}

export function currencyAmount(input: number) {
  return currencyFormat.format(input);
}
