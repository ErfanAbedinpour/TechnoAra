import { Test } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { HashService } from '../hashingServices/hash.service';
import { ArgonService } from '../hashingServices/argon.service';
import { User } from '../../../models/user.model';
import { EntityManager, SqliteDriver } from '@mikro-orm/sqlite';
import { UserTokenService } from '../tokens/user.token.service';
import { RefreshTokenService } from '../tokens/refreshToken.service';
import { BlackListService } from '../blacklist/blacklist.service';
import { mock } from 'jest-mock-extended';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Role, UserRole } from '../../../models/role.model';
import { ErrorMessages } from '../../../errorResponse/err.response';
import { DB_TEST_CONFIG } from '../../../config/db.test.config';
import { BullModule } from '@nestjs/bullmq';
import { QUEUES } from '../../../enums/queues.enum';

describe('auth service', function() {
	let role: Role;
	let authService: AuthService;
	let em: EntityManager;
	let userTokenMock = mock<UserTokenService>();
	let refreshTokenMock = mock<RefreshTokenService>();
	let blackListMock = mock<BlackListService>();

	beforeAll(async () => {
		const moduelRef = await Test.createTestingModule({
			imports: [
				MikroOrmModule.forRoot(DB_TEST_CONFIG),
			],
			providers: [
				AuthService,
				{
					provide: "BullQueue_welcome-email",
					useValue: { add: jest.fn() }
				},
				{
					provide: HashService,
					useClass: ArgonService,
				},
				{
					provide: UserTokenService,
					useValue: userTokenMock,
				},

				{
					provide: RefreshTokenService,
					useValue: refreshTokenMock,
				},
				{
					provide: BlackListService,
					useValue: blackListMock,
				},
			],
		}).compile();

		authService = moduelRef.get(AuthService);
		em = moduelRef.get(EntityManager);
		role = em.create(Role, {
			name: UserRole.USER,
		});

		const user = new User();
		user.username = 'fake-username';
		user.email = 'fake@gmail.com';
		user.password = '12341234';
		user.role = role;

		await em.persistAndFlush(role);
		await em.persistAndFlush(user);
	});

	it('ensure Defiend', () => {
		expect(authService).toBeDefined();
		expect(em).toBeDefined();
	});

	describe('register Service', () => {
		it('should be pass for create user ok', async () => {
			const resPromise = authService.register({
				email: 'myEmail@gmail.com',
				password: '12341234',
				username: 'newOne',
			});
			expect(resPromise).resolves.toBeTruthy();
			expect(resPromise).resolves.toStrictEqual({ success: true });
		});

		it('invalid email', async () => {
			const resPromise = authService.register({
				email: 'fake@gmail.com',
				username: 'newOne',
				password: '12341234',
			});
			expect(resPromise).rejects.toThrow(BadRequestException);
			expect(resPromise).rejects.toThrow(ErrorMessages.INVALID_EMAIL);
		});
	});

	describe('Login User', () => {
		it('should be return accessToken and refreshToken', async () => {
			jest
				.spyOn(userTokenMock, 'signTokens')
				.mockResolvedValue({ accessToken: '', refreshToken: '' });
			const resPromise = authService.login({
				email: 'fake@gmail.com',
				password: '12341234',
			});
			expect(resPromise).resolves.toStrictEqual({
				accessToken: '',
				refreshToken: '',
			});
		});

		it('should be throw Error if credential not valid', () => {
			const resPromise = authService.login({
				email: 'new@gmail.com',
				password: '12341234',
			});

			expect(resPromise).rejects.toThrow(BadRequestException);
			expect(resPromise).rejects.toThrow(ErrorMessages.INVALID_CRENDENTIAL);
		});
	});

	describe('get token', () => {
		it('return error if refreshToken invalid', async () => {
			jest.spyOn(refreshTokenMock, 'verify').mockResolvedValueOnce({
				tokenId: '',
				id: 0,
			});
			jest.spyOn(userTokenMock, 'validate').mockResolvedValueOnce(false);

<<<<<<< HEAD
			const resPromise = authService.token({ refreshToken: '' });
			expect(resPromise).rejects.toThrow(UnauthorizedException);
=======
	describe("get token", () => {
		it("return error if refreshToken invalid", async () => {
			jest.spyOn(refreshTokenMock, 'verify').mockResolvedValueOnce(
				{
					tokenId: "",
					id: 0
				}
			)
			jest.spyOn(userTokenMock, 'validate').mockResolvedValueOnce(false)

			const resPromise = authService.token({ refreshToken: "", accessToken: "" });
			expect(resPromise).rejects.toThrow(UnauthorizedException)
>>>>>>> develop
			expect(resPromise).rejects.toThrow(ErrorMessages.INVALID_REFRESH_TOKEN);
		});

<<<<<<< HEAD
		it('should be throw badRequest if user not found', () => {
			jest.spyOn(refreshTokenMock, 'verify').mockResolvedValueOnce({
				tokenId: '',
				id: 0,
			});
			jest.spyOn(userTokenMock, 'validate').mockResolvedValueOnce(true);
			jest.spyOn(userTokenMock, 'invalidate').mockResolvedValueOnce(true);
			const resPromise = authService.token({ refreshToken: '' });
=======
		it("should be throw BadRequest if user not found", () => {
			jest.spyOn(refreshTokenMock, 'verify').mockResolvedValue(
				{
					tokenId: "",
					id: 0
				}
			)
			jest.spyOn(userTokenMock, 'validate').mockResolvedValueOnce(true)
			jest.spyOn(userTokenMock, 'invalidate').mockResolvedValueOnce(true)
			jest.spyOn(blackListMock, 'setToBlackList').mockResolvedValueOnce()
			const resPromise = authService.token({ refreshToken: "", accessToken: "" });
>>>>>>> develop

			expect(resPromise).rejects.toThrow(BadRequestException);
			expect(resPromise).rejects.toThrow(ErrorMessages.USER_NOT_FOUND);
		});

<<<<<<< HEAD
		it('should be pass and reutrn new tokens', () => {
			jest.spyOn(refreshTokenMock, 'verify').mockResolvedValueOnce({
				tokenId: '',
				id: 1,
			});
=======
		it("should be pass and return new tokens", () => {
			jest.spyOn(refreshTokenMock, 'verify').mockResolvedValueOnce(
				{
					tokenId: "",
					id: 1
				})
>>>>>>> develop

			jest.spyOn(userTokenMock, 'signTokens').mockResolvedValueOnce({
				accessToken: 'some-token',
				refreshToken: 'some-token2',
			});

			jest.spyOn(userTokenMock, 'validate').mockResolvedValue(true);

			jest.spyOn(userTokenMock, 'invalidate').mockResolvedValue(true);

<<<<<<< HEAD
			const resPromise = authService.token({ refreshToken: 'this is my' });
=======
			jest.spyOn(blackListMock, 'setToBlackList').mockResolvedValueOnce()

			const resPromise = authService.token({ refreshToken: "this is my", accessToken: "" });
>>>>>>> develop

			expect(resPromise).resolves.toBeTruthy();
			expect(resPromise).resolves.toStrictEqual({
				accessToken: 'some-token',
				refreshToken: 'some-token2',
			});
		});
	});

	describe('logout User', () => {
		it('shoud be logout', async () => {
			jest
				.spyOn(refreshTokenMock, 'verify')
				.mockResolvedValueOnce({ id: 2, tokenId: 'random-token-id' });
			jest.spyOn(userTokenMock, 'invalidate').mockResolvedValueOnce(true);
			jest.spyOn(blackListMock, 'setToBlackList').mockResolvedValueOnce();

<<<<<<< HEAD
			const promise = authService.logout({
				refreshToken: 'refreshTOken',
				accessToken: 'accessToken',
			});
			expect(promise).resolves.toStrictEqual({
				message: 'user logout successfully',
			});
		});
	});
=======
	describe("logout User", () => {
		it("should be logout", () => {
			jest.spyOn(userTokenMock, 'invalidate').mockResolvedValueOnce(true)
			jest.spyOn(blackListMock, 'setToBlackList').mockResolvedValueOnce()

			expect(authService.logout({ accessToken: "", refreshToken: "" })).resolves.toStrictEqual({
				message: "user logout successfully"
			})

		})
	})
>>>>>>> develop
});
