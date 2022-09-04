function parseStringify(object: any) {
  try {
    return JSON.parse(JSON.stringify(object));
  } catch (error) {
    return { error };
  }
}

export { parseStringify };
