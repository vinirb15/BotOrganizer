import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { CreateUserDTO } from 'src/applications/DTOs/create-user.dto';
import { AppModule } from '../../../infra/data/modules/app.module';
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
    const validPayload: CreateUserDTO = {
      phoneNumber: '+55(12)988888888',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: '1234',
    };

    const response = await request(app.getHttpServer()).post('/users').send(validPayload);

    expect(response.status).toBe(HttpStatus.CREATED);
  });
});
