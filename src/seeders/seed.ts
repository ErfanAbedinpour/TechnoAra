import { EntityManager } from '@mikro-orm/core'; import { Seeder } from '@mikro-orm/seeder';
import { Role, UserRole } from '../models/role.model';
import { UserFactory } from './factoryies.entity';


export class DatabaseSeeder extends Seeder {

    async run(em: EntityManager): Promise<void> {
        const admin = em.create(Role, { name: UserRole.ADMIN });
        const user = em.create(Role, { name: UserRole.USER });
        await em.persistAndFlush([admin, user]);
        new UserFactory(em).makeOne({ username: "admin", email: "admin@gmail.com", 'password': "Test11223344_", role: admin })
        new UserFactory(em).make(10, { role: user })
    }
}
