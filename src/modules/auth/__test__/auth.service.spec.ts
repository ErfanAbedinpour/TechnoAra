import { Test } from "@nestjs/testing";
import { AuthService } from "../auth.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { HashService } from "../hashingServices/hash.service";
import { ArgonService } from "../hashingServices/argon.service";
import { User } from "../../../models/user.model";
import { EntityManager, SqliteDriver } from "@mikro-orm/sqlite";
import { UserTokenService } from "../tokens/user.token.service";
import { RefreshTokenService } from "../tokens/refreshToken.service";
import { BlackListService } from "../blacklist/blacklist.service";
import { mock } from "jest-mock-extended";

describe("auth service", function() {
	let authService: AuthService;
	let em: EntityManager;
	let userTokenMock = mock<UserTokenService>();
	let refreshTokenMock = mock<RefreshTokenService>();
	let blackListMock = mock<BlackListService>();

	beforeAll(async () => {
		const moduelRef = await Test.createTestingModule({
			imports: [
				MikroOrmModule.forRoot({
					entities: [User],
					dbName: ":memory",
					ensureDatabase: { create: true },
					allowGlobalContext: true,
					driver: SqliteDriver,
				}),
			],
			providers: [
				AuthService,
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
	});

	it("happy ", () => {
		expect(authService).toBeDefined();
		expect(em).toBeDefined();
	});

	describe("register Service", () => { });
});
