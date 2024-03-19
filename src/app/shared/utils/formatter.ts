import { NGXLogger } from 'ngx-logger';

export class Formatter {
  private static currencyFormatter(currency: string) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    });
  }

  private static numberFormatter(fractionDigits: number) {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: fractionDigits });
  }

  public static prettyCurrency = (balance: number, currency: string = 'USD', exchangeRate: number = 1) => {
    return Formatter.currencyFormatter(currency).format(balance * exchangeRate);
  };

  public static prettyNumber(number: number, fractionDigits = 2) {
    return Formatter.numberFormatter(fractionDigits).format(number);
  }

  public static formatAddress(address: string, length = 'short'): string {
    if (address && length === 'very_short') {
      address = address.substring(0, 6);
      return address;
    } else if (address && length === 'short') {
      address = address.substring(0, 6) + '...' + address.substring(address.length - 4, address.length);
      return address;
    } else if (address && length === 'long') {
      address = address.substring(0, 12) + '...' + address.substring(address.length - 8, address.length);
      return address;
    } else {
      return '';
    }
  }

  public static formatCurrency(num: number, digits = 2) {
    if (num < 10) {
      return num.toFixed(digits);
    } else if (num < 100) {
      return num.toFixed(Math.round(digits / 2));
    } else if (num < 1000) {
      return num.toFixed(0);
    } else if (num < 1000_000) {
      return (num / 1000).toFixed(0) + 'K';
    } else if (num < 1000_000_000) {
      return (num / 1000_000).toFixed(0) + 'M';
    } else {
      return '∞';
    }
  }

  public static formatRpcError(
    functionName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any,
    logger: NGXLogger,
  ) {
    // probably we will need to format errors from different RPC providers
    logger.trace(functionName, error);
    return error.reason;
  }

  public static numberToCompact(value: number, fractionDigits = 2): string {
    return Intl.NumberFormat('en', {
      notation: 'compact',
      maximumFractionDigits: fractionDigits,
      minimumFractionDigits: 0,
    }).format(value);
  }

  public static replaceSymbols(value: string, symbolFrom: string, symbolTo: string) {
    return value.replace(new RegExp(symbolFrom, 'g'), symbolTo);
  }
}
