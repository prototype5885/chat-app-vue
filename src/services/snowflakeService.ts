function extractDateFromId(id: bigint): Date {
  const epoch = BigInt(new Date("2015-01-01T00:00:00Z").getTime());
  const timestamp = id >> 22n;
  const time = epoch + timestamp;
  return new Date(Number(time));
}

export function extractDate(id: bigint, format: string): string {
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
