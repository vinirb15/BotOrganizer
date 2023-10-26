import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { CreateUserDTO } from '@dtos/create-user.dto';
import { AppModule } from '@modules/app.module';
import { randomUUID, randomInt } from 'node:crypto';
import request from 'supertest';

describe('EventController', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const adapter = new ExpressAdapter();
    app = moduleFixture.createNestApplication(adapter);
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // <--- Required to stop the crash
    await app.close();
  });

  it('should return a 400 Bad Request if payload is missing required fields', async () => {
    const invalidPayload = {};

    const response = await request(app.getHttpServer()).post('/users').send(invalidPayload);

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should return a 400 Bad Request if payload contains invalid data', async () => {
    const invalidPayload = {
      email: 'invalid',
      firstName: 'invalid',
      lastName: 'invalid',
      password: 'invalid',
      phoneNumber: 'invalid',
    };

    const response = await request(app.getHttpServer()).post('/users').send(invalidPayload);

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should return a 201 Created if payload is valid', async () => {
    const testEmail = randomUUID().split('-')[0];
    const testMumber = randomInt(100000000, 999999999);
    const validPayload: CreateUserDTO = {
      phoneNumber: `+55(12)${testMumber}`,
      email: `${testEmail}@example.com`,
      firstName: 'Test',
      lastName: 'User',
      password: '1234',
    };

    const response = await request(app.getHttpServer()).post('/users').send(validPayload);

    expect(response.status).toBe(HttpStatus.CREATED);
  });
});
