export type SnowflakeDateFormat = "short" | "medium" | "long";
const epoch = 1420070400000n

export function extractDate(id: string, format: SnowflakeDateFormat): string {
  const options: Intl.DateTimeFormatOptions = {};

  switch (format) {
    case "short": {
      options.timeStyle = "short";
      break;
    }
    case "medium": {
      options.year = "numeric";
      options.month = "long";
      options.day = "numeric";
      break;
    }
    case "long": {
      options.year = "numeric";
      options.month = "long";
      options.day = "numeric";
      options.hour = "2-digit";
      options.minute = "2-digit";
      options.hour12 = false;
      break;
    }
    default: {
      throw "Wrong date format";
    }
  }

  const date = new Date(Number((BigInt(id) >> 22n) + epoch));

  return date.toLocaleString(undefined, options);
}
