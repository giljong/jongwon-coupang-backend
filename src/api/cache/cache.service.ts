import { BadRequestException, Injectable } from '@nestjs/common';
import { RedisService } from '@songkeys/nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
  private readonly redisClient: Redis;
  constructor(private readonly redisService: RedisService) {
    this.redisClient = redisService.getClient();
  }

  async keys(key: string): Promise<string[]> {
    return this.redisClient.keys(key);
  }

  async ttl(key: string): Promise<number> {
    return this.redisClient.ttl(key);
  }

  async get(key: string): Promise<string> {
    return this.redisClient.get(key);
  }

  async set(key: string, value: string, expire?: number): Promise<'OK'> {
    return this.redisClient.set(key, value, 'EX', expire ?? 10).catch(() => {
      throw new BadRequestException('저장을 실패하였습니다.');
    });
  }

  async del(key: string): Promise<number> {
    return this.redisClient.del(key);
  }

  async incr(key: string): Promise<number> {
    return this.redisClient.incr(key);
  }

  async expire(key: string, seconds: string | number): Promise<number> {
    return this.redisClient.expire(key, seconds);
  }

  async zcount(key: string) {
    return this.redisClient.zcount(key, '-inf', '+inf');
  }

  async zadd(key: string, score: number, member: string) {
    return this.redisClient.zadd(key, score, member);
  }

  async zrange(key: string, skip: number, take: number) {
    return this.redisClient.zrange(key, skip, take - 1 + skip);
  }

  async hgetall(key: string): Promise<any> {
    return this.redisClient.hgetall(key);
  }

  async hmset(key: string, object: object) {
    const values = Object.keys(object).reduce((prev, key) => {
      const value = object[key];
      prev.push(key, value);

      return prev;
    }, []);

    return this.redisClient.hmset(key, [...values]);
  }

  async hset(key: string, array: any[], expire?: number): Promise<number> {
    return this.redisClient.hset(key, [...array]).catch((error) => {
      console.log({ error });
      return -1;
    });
  }

  /**
   * 리스트에서 특정 값 삭제
   * @param key - 리스트 키
   * @param count - 삭제할 원소 개수
   * @param value - 삭제할 element
   * @returns
   */
  lrem(key: string, count: number, value: string | number | Buffer) {
    return this.redisClient.lrem(key, count, value);
  }

  // 리스트에서 start, stop에 따른 내용 조회
  lrange(key: string, start: number, stop: number): Promise<string[]> {
    return this.redisClient.lrange(key, start, stop);
  }

  /**
   * 리스트에서 특정 index의 값을 새로운 값으로 수정
   * @param key
   * @param index
   * @param newValue
   * @returns
   */
  lset(
    key: string,
    index: number,
    newValue: string | number | Buffer,
  ): Promise<'OK'> {
    return this.redisClient.lset(key, index, newValue);
  }

  /**
   * 리스트에서 특정 값이 있는지 조회 (null 이거나 -1이면 존재하지 않음)
   * @param key
   * @param value
   * @returns
   */
  lpos(key: string, value: string): Promise<number> {
    return this.redisClient.lpos(key, value);
  }

  rpush(key: string, array: any[]): Promise<number> {
    return this.redisClient.rpush(key, ...array);
  }

  verify<Model extends { new (a: any) }, RedisObject>(
    model: Model,
    redisObject: RedisObject,
  ) {
    if (!redisObject) {
      return null;
    }

    for (let i = 0, len = Object.keys(redisObject).length; i < len; i++) {
      const key = Object.keys(redisObject)[i];

      if (redisObject[key] === 'true') {
        redisObject[key] = true;
      }

      if (redisObject[key] === 'false') {
        redisObject[key] = false;
      }
    }

    if (Array.isArray(redisObject)) {
      return redisObject.map((value) => new model(value));
    }

    return new model(redisObject);
  }

  private async save() {
    return this.redisClient.save();
  }
}
