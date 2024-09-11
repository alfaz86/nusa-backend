import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './store.entity';
import { CreateStoreDto } from './store.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createStoreDto: CreateStoreDto, userId: number): Promise<Store> {
    // 1. Membuat entitas Store
    const store = this.storeRepository.create({
      name: createStoreDto.store_name,
      description: createStoreDto.store_description,
      address: createStoreDto.store_address,
      contact: createStoreDto.store_contact,
      logo: createStoreDto.store_logo, 
      created_at: new Date(),
      updated_at: new Date(),
      users: [], // Nilai default untuk relasi
      products: [], // Nilai default untuk relasi
    });

    // 2. Menyimpan store ke database
    const savedStore = await this.storeRepository.save(store);

    // 3. Mengupdate user dengan store_id dan role
    await this.userRepository.update(userId, {
      store: savedStore, // Mengaitkan user dengan store yang baru dibuat
      role: 'store_owner', // Mengubah role user menjadi store_owner
    });

    return savedStore;
  }
}
