function extractDateFromId(id: string): Date {
  const timestamp = BigInt(id) >> 22n;
  const time = timestamp;
  return new Date(Number(time));
}

export function extractDate(id: string, format: string): string {
  let options: Intl.DateTimeFormatOptions = {};

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

  return extractDateFromId(id).toLocaleString(undefined, options);
}
