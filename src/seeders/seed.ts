import { EntityManager } from '@mikro-orm/core'; import { Seeder } from '@mikro-orm/seeder';
import { Role, UserRole } from '../models/role.model';
import { UserFactory } from './factoryies.entity';
import { Category } from '../models/category.model';
import { mobile_brands } from './data.json'
import { Brand } from '../models/brand.model';
import { loadProvines } from './province/provice.load';
import { Province } from '../models/province.model';
import slugify from 'slugify';
import { loadCities } from './cities/cities.load';
import { City } from '../models/city.model';


export class DatabaseSeeder extends Seeder {


    async run(em: EntityManager): Promise<void> {
        // create role
        const admin = em.create(Role, { name: UserRole.ADMIN });
        const user = em.create(Role, { name: UserRole.USER });

        await em.persistAndFlush([admin, user]);
        // create user
        const adminUser = new UserFactory(em).makeOne({ username: "admin", email: "admin@gmail.com", password: "Test11223344_", role: admin, cart: {} })
        new UserFactory(em).make(10, { role: user, cart: {} })
        await em.flush();

        // create brand
        for (const brand of mobile_brands) {
            em.create(Brand, { name: brand, user: adminUser })
        }

        // create category
        em.create(Category, {
            title: "موبایل",
            slug: "/phone",
            en_name: "phone",
            user: adminUser,
        })
        em.create(Category, {
            title: "اسپیکر",
            slug: "/speaker",
            en_name: "speaker",
            user: adminUser,
        })

        em.create(Category, {
            title: "کامپیوتر",
            slug: "/computer",
            en_name: "computer",
            user: adminUser,
        })

        em.create(Category, {
            title: "پاور بانک",
            slug: "/power-bank",
            en_name: "powerBank",
            user: adminUser,
        })

        em.create(Category, {
            title: "لپ تاپ",
            slug: "/laptop",
            en_name: "laptop",
            user: adminUser,
        })


        const provines = await loadProvines()

        provines.forEach(province => {
            const { id, latitude, longitude, slug, title } = province;
            em.create(Province, {
                slug: slugify(slug, { lower: true, trim: true, replacement: "-" }),
                id,
                en_name: slug,
                latitude,
                longitude,
                title
            }, { persist: true })
        })
        await em.flush()

        const cities = await loadCities();
        cities.forEach(city => {
            const { latitude, longitude, province_id, slug, title } = city;

            em.create(City, {
                en_name: slug,
                slug: slugify(slug, { trim: true, replacement: '-', lower: true }),
                province: { id: province_id },
                latitude: String(latitude),
                longitude: String(longitude),
                title
            })
        })
    }
}
