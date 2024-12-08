import { EntityManager } from '@mikro-orm/core'; import { Seeder } from '@mikro-orm/seeder';
import { Role, UserRole } from '../models/role.model';
import { UserFactory } from './factoryies.entity';
import { User } from '../models/user.model';
import { ArgonService } from '../modules/auth/hashingServices/argon.service';




export class DatabaseSeeder extends Seeder {

    hashService = new ArgonService();
    async run(em: EntityManager): Promise<void> {
        em.create(Role, { id: 1, name: UserRole.ADMIN });
        em.create(Role, { id: 2, name: UserRole.USER });
        await em.flush();
        const password = await this.hashService.hash("Test11223344_")
        em.create(User, { id: 1, username: "admin", email: "admin@gmail.com", password, role: 1 })
        new UserFactory(em).make(10, { password, role: 2 })
    }

}
