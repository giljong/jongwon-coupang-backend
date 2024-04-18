import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { FileUpload } from 'graphql-upload';

interface FileSizeOptions {
  size: number;
  unit: 'kb' | 'mb';
}

export function FileSize(
  options: FileSizeOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    return registerDecorator({
      async: true,
      name: 'fileSize',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          if (Array.isArray(value)) {
            const result = await validateFiles(value, options);

            return result;
          } else {
            const { createReadStream } = await value;

            const fileSize = await getFileSize(createReadStream);

            if (fileSize > convertFileSize(options)) {
              return false;
            }

            return true;
          }
        },
      },
    });
  };
}

const validateFiles = async (
  values: Promise<FileUpload>[],
  options: FileSizeOptions,
) => {
  for (let i = 0, len = values.length; i < len; i++) {
    const value = await values[i];

    const fileSize = await getFileSize(value.createReadStream);

    if (fileSize > convertFileSize(options)) {
      return false;
    }
  }

  return true;
};

const getFileSize = (
  createReadStream: FileUpload['createReadStream'],
): Promise<number> => {
  return new Promise((resolve, reject) => {
    let filesize = 0;
    const stream = createReadStream();
    stream.on('data', (chunk: Buffer) => {
      filesize += chunk.length;
    });
    stream.on('end', () => resolve(filesize));
    stream.on('error', reject);
  });
};

const convertFileSize = (options: FileSizeOptions) => {
  let size = 0;
  if (options.unit === 'mb') {
    size = options.size * 1000 * 1000;
  }

  if (options.unit === 'kb') {
    size = options.size * 1000;
  }

  return size;
};
