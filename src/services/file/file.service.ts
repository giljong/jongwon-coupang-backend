import { BadRequestException, Injectable } from '@nestjs/common';
import { ReadStream } from 'fs-capacitor';
import { FileUpload } from 'graphql-upload';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  CompleteMultipartUploadCommandOutput,
  DeleteObjectsCommandInput,
  DeleteObjectsCommandOutput,
  GetObjectCommandOutput,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService {
  constructor(private readonly configService: ConfigService) {}

  private getClient() {
    const s3 = new S3({
      region: this.configService.get('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_S3_SECRET_ACCESS_KEY'),
      },
    });

    return s3;
  }

  // 파일 가져오기
  getFile(Bucket: string, Key: string): Promise<GetObjectCommandOutput> {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket,
        Key,
      };

      const client = this.getClient();

      client.getObject(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  // 파일 업로드
  async uploadFile(
    dataBuffer: Buffer | ReadStream,
    filename: string,
    Bucket: string,
    isNotSetNewName = false, // 기존 파일명 사용 여부
  ): Promise<CompleteMultipartUploadCommandOutput> {
    if (!Bucket) {
      throw new BadRequestException({ message: '저장소가 올바르지 않습니다.' });
    }

    const client = this.getClient();

    const fileExtName = extname(filename).toLowerCase();
    let Key = `${uuidv4()}${fileExtName}`;
    if (isNotSetNewName) {
      Key = `${filename}${fileExtName}`;
    }

    const params: PutObjectCommandInput = {
      Bucket,
      Body: dataBuffer,
      Key,
    };

    const upload = new Upload({ client, params });

    return upload.done();
  }

  // 비디오 업로드
  async uploadVideo(
    dataBuffer: Buffer | ReadStream,
    filename: string,
    Bucket: string,
    isNotSetNewName?: boolean, // 파일명 새이름으로 설정 안할지 여부
  ): Promise<PutObjectCommandOutput> {
    if (!Bucket) {
      throw new BadRequestException({ message: '저장소가 올바르지 않습니다.' });
    }

    const client = this.getClient();

    const fileExtName = extname(filename).toLowerCase();
    let Key = `${uuidv4()}${fileExtName}`;
    if (isNotSetNewName) {
      Key = `${filename}${fileExtName}`;
    }

    const params: PutObjectCommandInput = {
      Bucket,
      Body: dataBuffer,
      Key,
    };

    const upload = new Upload({ client, params });

    return upload.done();
  }

  // 파일 여러개 삭제
  deleteFiles(
    Bucket: string,
    keys: string[],
  ): Promise<DeleteObjectsCommandOutput | true> {
    return new Promise((response, reject) => {
      if (keys.length < 1) {
        return response(true);
      }

      const client = this.getClient();

      const paramsToDelete: DeleteObjectsCommandInput = {
        Bucket,
        Delete: {
          Objects: [],
        },
      };

      keys.forEach((Key) => {
        paramsToDelete.Delete.Objects.push({ Key });
      });

      client.deleteObjects(paramsToDelete, (err, data) => {
        if (err) {
          reject(err);
        } else {
          response(data);
        }
      });
    });
  }

  async uploadManyImages(
    images: Promise<FileUpload>[],
    Bucket: string,
  ): Promise<PutObjectCommandOutput[]> {
    const _images = await Promise.all(images);
    return Promise.all(
      _images.map((v) =>
        this.uploadFile(v.createReadStream(), v.filename, Bucket),
      ),
    );
  }
}
