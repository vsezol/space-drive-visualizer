export function getArgument<T extends string>(name: string): T | undefined {
  if (!hasArgument(name)) {
    return undefined;
  }

  const index: number = findArgumentIndex(name);

  return <T | undefined>(
    (parseArgumentValue(getValueByEquality(process.argv[index])) ??
      parseArgumentValue(getValueBySpace(process.argv[index + 1])))
  );
}

export function hasArgument(name: string): boolean {
  return findArgumentIndex(name) !== -1;
}

function findArgumentIndex(name: string): number {
  return process.argv.findIndex(
    (arg: string) => arg === name || arg.split(`=`)[0] === name
  );
}

function getValueBySpace(argument: string | undefined): string | undefined {
  return argument?.startsWith('-') ? undefined : parseArgumentValue(argument);
}

function getValueByEquality(argument: string | undefined): string | undefined {
  return argument?.split('=')?.[1] ?? undefined;
}

function parseArgumentValue(value: string | undefined): string | undefined {
  return value === 'undefined' || value === 'null' ? undefined : value;
}
