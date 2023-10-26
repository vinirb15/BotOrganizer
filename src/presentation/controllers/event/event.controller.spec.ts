import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { EventInterface } from '@interfaces/event.interface';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '@modules/app.module';
import { EventDTO } from '@dtos/event.dto';
import { Test } from '@nestjs/testing';
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

    const response = await request(app.getHttpServer()).post('/events').send(invalidPayload);

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should return a 400 Bad Request if payload contains invalid data', async () => {
    const invalidPayload = {
      userId: 'invalid',
      title: 'invalid',
      address: 'invalid',
      startDate: 'invalid',
      endDate: 'invalid',
      repeat: 'invalid',
      guests: 'invalid',
      notes: 'invalid',
    };

    const response = await request(app.getHttpServer()).post('/events').send(invalidPayload);

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should return a 201 Created if payload is valid', async () => {
    const validPayload: EventDTO = {
      userId: 1,
      title: 'titulo 1',
      address: 'endereço 1',
      startDate: new Date('10-11-2023'),
      endDate: new Date('10-11-2023'),
      repeat: 'no',
      guests: 'guest 1',
      notes: 'descrição do primeiro evento',
    };

    const response = await request(app.getHttpServer()).post('/events').send(validPayload);

    expect(response.status).toBe(HttpStatus.CREATED);
  });

  it('should return a 200 OK if payload is valid', async () => {
    const validPayload: EventDTO = {
      userId: 1,
      title: 'titulo 1',
      address: 'endereço 1',
      startDate: new Date('10-11-2023'),
      endDate: new Date('10-11-2023'),
      repeat: 'no',
      guests: 'guest 1',
      notes: 'descrição do primeiro evento',
    };

    const response = await request(app.getHttpServer()).put('/events/1').send(validPayload);

    expect(response.status).toBe(HttpStatus.OK);
  });

  it('should return a 200 OK if payload is valid', async () => {
    const response = await request(app.getHttpServer()).get('/events/findById/1').send();

    expect(response.status).toBe(HttpStatus.OK);

    const responseData = JSON.parse(response.text);

    expect(responseData).toMatchObject<EventInterface>({
      userId: expect.any(Number),
      title: expect.any(String),
      address: expect.any(String),
      startDate: expect.any(String),
      endDate: expect.any(String),
      repeat: expect.any(String),
      guests: expect.any(String),
      notes: expect.any(String),
    });
  });

  it('should return a 200 OK if payload is valid', async () => {
    const response = await request(app.getHttpServer()).get('/events/findByUser/1').send();

    expect(response.status).toBe(HttpStatus.OK);

    const responseData = JSON.parse(response.text);

    expect(responseData[0]).toMatchObject<EventInterface>({
      userId: expect.any(Number),
      title: expect.any(String),
      address: expect.any(String),
      startDate: expect.any(String),
      endDate: expect.any(String),
      repeat: expect.any(String),
      guests: expect.any(String),
      notes: expect.any(String),
    });
  });
});
