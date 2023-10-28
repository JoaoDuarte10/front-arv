export function countTotalValues(values: number[]): string {
  return values
    .filter(item => !!item)
    .reduce((acc, item) => acc + item, 0)
    .toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
}
