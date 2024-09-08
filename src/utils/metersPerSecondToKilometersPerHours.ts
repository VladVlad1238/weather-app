export function metersPerSecondToKilometersPerHours(speed: number): string {
  const speedInKilometersPerHour = speed * 3.6;
  return `${speedInKilometersPerHour.toFixed(0)}km/h`;
}
