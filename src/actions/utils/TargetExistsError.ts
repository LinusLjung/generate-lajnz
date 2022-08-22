class TargetExistsError extends Error {
  constructor(target: string, ...superArgs: ConstructorParameters<typeof Error>) {
    super(...superArgs);

    this.name = 'TargetExistsError';
    this.message = `Target '${target}' already exists`;
  }
}

export default TargetExistsError;
