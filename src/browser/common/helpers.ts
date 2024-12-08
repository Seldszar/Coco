const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

const currencyFormat = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
  trailingZeroDisplay: "stripIfInteger",
});

export function formatDateTime(input: Date | number) {
  return dateTimeFormat.format(input);
}

export function formatCurrency(input: number) {
  return currencyFormat.format(input);
}
