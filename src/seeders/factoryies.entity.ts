import { Factory } from '@mikro-orm/seeder';
import { User } from '../models/user.model';
import { faker } from '@faker-js/faker';

export class UserFactory extends Factory<User> {
    model = User;
    counter = 2;

    definition(): Partial<User> {
        return {
            id: this.counter++,
            username: faker.person.firstName(),
            email: faker.internet.email(),
            password: "Test11223344_",
        };
    }
}
