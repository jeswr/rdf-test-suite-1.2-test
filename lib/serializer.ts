import type * as RDF from '@rdfjs/types';
import { write } from '@jeswr/pretty-turtle';

export function serialize(data: RDF.Quad[], baseIRI: string, options: {format: string}) {
  if (options.format !== 'turtle') {
    throw new Error(`Unsupported format: ${options.format}`);
  }

  return write(data, {
    format: 'text/turtle',
  })
}
